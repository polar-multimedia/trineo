import { FIREBASE } from "./firebase.js";
const DOC = document.querySelector("meta[name=cotizacion]")?.content || "sin-doc";

const code = (new URLSearchParams(location.search).get("c") || "sin-codigo").replace(/[^a-z0-9-]/gi, "").slice(0, 24) || "sin-codigo";
const noTrack = new URLSearchParams(location.search).has("nt");
const ready = !noTrack && FIREBASE.databaseURL && !FIREBASE.databaseURL.includes("PENDIENTE");

function deviceId() {
  try {
    let d = localStorage.getItem("corep_dev");
    if (!d) { d = Math.random().toString(36).slice(2, 10); localStorage.setItem("corep_dev", d); }
    return d;
  } catch (e) { return "anon"; }
}

async function start() {
  if (!ready) { console.info("Seguimiento desactivado: falta configurar Firebase."); return; }
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
  const { getDatabase, ref, push, set, update } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js");
  const db = getDatabase(initializeApp(FIREBASE));
  const dev = deviceId();
  const t0 = Date.now();
  const visitRef = push(ref(db, `trineo/tracking/${DOC}/visits/${code}`));
  const seen = new Set();
  await set(visitRef, {
    start: t0, last: t0, secs: 0, device: dev,
    ua: navigator.userAgent.slice(0, 180),
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    screen: `${screen.width}x${screen.height}`,
    sections: ""
  });

  let active = Date.now(), total = 0, visible = document.visibilityState === "visible";
  const flush = () => {
    if (visible) { total += Date.now() - active; active = Date.now(); }
    update(visitRef, { last: Date.now(), secs: Math.round(total / 1000), sections: [...seen].sort().join(",") });
  };
  setInterval(flush, 15000);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") { flush(); visible = false; }
    else { visible = true; active = Date.now(); }
  });
  addEventListener("pagehide", flush);

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) seen.add(String([...document.querySelectorAll(".sheet")].indexOf(e.target) + 1));
  }), { threshold: 0.15 });
  document.querySelectorAll(".sheet").forEach(s => io.observe(s));

  document.querySelectorAll(".dl").forEach(dl => dl.addEventListener("click", () => {
    push(ref(db, `trineo/tracking/${DOC}/downloads/${code}`), { ts: Date.now(), device: dev }));
  });
}
start().catch(e => console.warn("Seguimiento:", e));
