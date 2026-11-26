/* Reporte final de PULSO by Lacteol. Los datos viven en el servidor de PULSO (Apps Script);
   esta página solo trae el diseño. La liga ?c=<clave> identifica al destinatario. */
(function () {
  var API = "https://script.google.com/macros/s/AKfycbxYO671fzh-V5z2lFyXAT5LNNQSfNl0xXa5VLWuKYrYV0eXEhuIjZCrHaP7XUXmaEOZ/exec";
  var VIDEO = "https://polar-multimedia.github.io/pulso/memoria/memoria.mp4";
  var qs = new URLSearchParams(location.search);
  var key = (qs.get("c") || "").replace(/[^a-z0-9-]/gi, "").slice(0, 24);
  var demo = !key || key === "prueba" || qs.has("demo");
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var fmt = function (n) { return Number(n || 0).toLocaleString("es-MX"); };

  function call(body) {
    return fetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); });
  }

  // ─── Datos de ejemplo para ?c=prueba ───
  function demoData() {
    var n = ["Ana Sofía Ramírez Ortega", "Luis Fernando Castillo Mora", "María José Herrera Luna", "Jorge Alberto Méndez Ríos", "Daniela Torres Villa", "Ricardo Salinas Peña", "Paola Andrea Núñez Cruz", "Héctor Iván Ruiz Gómez", "Fernanda López Ibarra", "Óscar Medina Solís"];
    var arr = [["14:30", 6], ["14:45", 14], ["15:00", 27], ["15:15", 31], ["15:30", 22], ["15:45", 13], ["16:00", 7], ["16:15", 3], ["16:30", 2]];
    var tl = [["14:22", "Llega el primer médico"], ["14:30", "Abre el registro · Bienvenida en la Sala 360"], ["15:50", "Apertura · Dr. Alfonso Copto"], ["16:00", "El Observatorio · Dra. María José Mendoza Tavera"], ["16:30", "El Laboratorio · Dr. Francisco Javier Otero Mendoza"], ["16:55", "El Arrecife · Dra. Ana Teresa Abreu y Abreu"], ["17:25", "Receso"], ["17:55", "El Jardín japonés · Dr. Rodrigo Vázquez Frías"], ["18:25", "La Mesa de Perspectivas · Panel de expertos"], ["19:10", "La Orilla · Dr. José Antonio Chávez Barrera"], ["19:55", "Reto PULSO · 112 médicos conectados", 1], ["20:30", "Se anuncian los ganadores de las becas", 1], ["20:40", "Salen las constancias por correo (121)", 1], ["20:40", "Cena"], ["21:05", "Se notifica a los ganadores del Reto"]];
    return {
      success: true, demo: true, who: { name: "Equipo Carnot", company: "Carnot Laboratorios", role: "carnot" },
      figures: { confirmados: 172, registrados: 139, asistentes: 125, enSitio: 14, porReto: 9, constancias: 121, jugadores: 112, puntos: 6, clave: "CMCP-PED-N26426" },
      arrivals: arr.map(function (a) { return { t: a[0], n: a[1] }; }),
      timeline: tl.map(function (x) { return { time: x[0], label: x[1], key: !!x[2] }; }),
      program: [["16:00", "El Observatorio", "Dra. María José Mendoza Tavera", "Diarrea aguda en pediatría: decisiones terapéuticas basadas en evidencia y estrategias para una recuperación intestinal efectiva"], ["16:30", "El Laboratorio", "Dr. Francisco Javier Otero Mendoza", "Antibióticos en pediatría: ¿cuándo sí, cuándo no y cómo proteger la salud intestinal?"], ["16:55", "El Arrecife", "Dra. Ana Teresa Abreu y Abreu", "Clasificación de los bioterapéuticos y su evidencia científica"], ["17:55", "El Jardín japonés", "Dr. Rodrigo Vázquez Frías", "De la evidencia clínica a la recuperación intestinal: el rol de Lactobacillus LB inactivados"], ["18:25", "La Mesa de Perspectivas", "Panel de expertos · modera Dr. Alfonso Copto", "¿Qué necesita realmente el intestino para su recuperación?"], ["19:10", "La Orilla", "Dr. José Antonio Chávez Barrera", "Dolor, diarrea, estreñimiento y estudios normales: Roma V llega al consultorio"], ["19:55", "Reto PULSO", "Cinco casos clínicos en tiempo real", "Becas para CONAPM 2027"]],
      reto: { perQuestion: [108, 111, 106, 109, 104].map(function (v, i) { return { q: "q" + (i + 1), n: v }; }), top: n.map(function (x, i) { return { place: i + 1, name: x, pts: 4720 - i * 260 - (i > 2 ? 120 : 0) }; }) },
      winners: [0, 1, 2].map(function (i) { return { place: i + 1, name: n[i], pts: 4720 - i * 260, confirmed: i < 2, specialty: ["Pediatría", "Gastroenterología pediátrica", "Pediatría"][i], city: ["Ciudad de México", "Puebla", "Toluca"][i] }; }),
      byRep: [["Representante de ejemplo 1", 9, 8], ["Representante de ejemplo 2", 7, 6], ["Representante de ejemplo 3", 6, 6], ["Representante de ejemplo 4", 5, 3]].map(function (r) { return { rep: r[0], confirmados: r[1], asistieron: r[2] }; }),
      photos: [], video: "", updated: new Date().toISOString()
    };
  }

  // ─── Render ───
  function countUp(el, to, suf) {
    var t0 = null, d = 1300; to = Number(to) || 0;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = fmt(to) + (suf || ""); return; }
    (function f(now) { if (t0 === null) t0 = now; var p = Math.min(1, (now - t0) / d); el.textContent = fmt(Math.round(to * (1 - Math.pow(1 - p, 3)))) + (suf || ""); if (p < 1) requestAnimationFrame(f); })(performance.now());
  }
  function whenSeen(el, fn) {
    if (!("IntersectionObserver" in window)) return fn();
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); fn(); } }, { threshold: .2 });
    io.observe(el);
  }

  function render(d) {
    var f = d.figures || {};
    var who = d.who || {};
    if (who.name) { $("para-nombre").textContent = who.name; document.title = "PULSO by Lacteol · Reporte final para " + who.name; }
    $("para-cargo").textContent = (who.company || "Carnot Laboratorios") + " · PULSO by Lacteol";
    var up = d.updated ? new Date(d.updated) : null;
    if (up) $("h-upd").textContent = "Datos al " + up.toLocaleDateString("es-MX", { day: "numeric", month: "long" }) + ", " + up.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false }) + " h";

    // 1 · Cifras
    var pct = f.confirmados ? Math.round(f.asistentes / f.confirmados * 100) : 0;
    var K = [
      [f.asistentes, "médicos asistieron", "hi"],
      [pct, "de los confirmados llegó", "", "%"],
      [f.confirmados, "médicos confirmados por los representantes"],
      [f.registrados, "se registraron con su boleto"],
      [f.enSitio, "se registraron en el lugar"],
      [f.jugadores, "jugaron el Reto PULSO"],
      [f.constancias, "constancias enviadas por correo"],
      [f.puntos, "puntos curriculares · " + (f.clave || "")]
    ];
    $("kpis").innerHTML = K.map(function (k, i) { return '<div class="glass kpi ' + (k[2] || "") + '"><div class="n" data-n="' + (Number(k[0]) || 0) + '" data-s="' + (k[3] || "") + '">0</div><div class="l">' + esc(k[1]) + "</div>" + (i === 1 ? '<div class="meter"><i data-w="' + Math.min(100, pct) + '"></i></div>' : "") + "</div>"; }).join("");
    whenSeen($("kpis"), function () {
      document.querySelectorAll("#kpis .n").forEach(function (el) { countUp(el, el.dataset.n, el.dataset.s); });
      document.querySelectorAll("#kpis .meter i").forEach(function (el) { el.style.width = el.dataset.w + "%"; });
    });
    if (f.porReto) $("cif-sub").textContent = "Registro, llegada y constancias, con datos del sistema de acceso. " + f.porReto + " llegadas se marcaron automáticamente al entrar al Reto PULSO con su boleto.";
    var A = d.arrivals || [];
    if (A.length) {
      var mx = Math.max.apply(null, A.map(function (a) { return a.n; })), peak = A.filter(function (a) { return a.n === mx; })[0];
      $("bars").innerHTML = A.map(function (a) { return '<div class="b' + (a.n === mx ? " peak" : "") + '"><em>' + a.n + '</em><i data-h="' + Math.max(3, Math.round(a.n / mx * 100)) + '"></i></div>'; }).join("");
      $("barsx").innerHTML = A.map(function (a) { return "<span>" + esc(a.t) + "</span>"; }).join("");
      whenSeen($("bars"), function () { document.querySelectorAll("#bars i").forEach(function (el) { el.style.height = el.dataset.h + "%"; }); });
      $("arr-note").textContent = "El momento de más afluencia fue a las " + peak.t + " h, con " + peak.n + " llegadas en 15 minutos.";
    } else { $("bars").parentNode.innerHTML = '<div class="empty">Las llegadas aparecerán aquí en cuanto se registren.</div>'; }

    // 2 · Cronología
    var T = d.timeline || [];
    $("tl").innerHTML = T.length ? T.map(function (x) {
      var k = x.key || /Reto|constancias|ganador/i.test(x.label);
      return '<li class="' + (k ? "key" : "") + '"><time>' + esc(x.time) + '</time><span class="dot"></span><span class="t">' + esc(x.label) + (x.pc ? "<small>" + x.pc + " médicos conectados al Reto</small>" : "") + "</span></li>";
    }).join("") : '<li><span></span><span></span><span class="t mute">La cronología se llena sola durante el evento.</span></li>';

    // 3 · Programa
    $("prog-sub").textContent = "Coordinador: Dr. Alfonso Copto · " + (f.puntos || 6) + " puntos curriculares " + (f.clave || "");
    $("prog").innerHTML = "<tr><th>Hora</th><th>Paisaje</th><th>Ponente y tema</th></tr>" + (d.program || []).map(function (p) {
      return '<tr><td class="k">' + esc(p[0]) + '</td><td class="who">' + esc(p[1]) + "</td><td><b>" + esc(p[2]) + "</b><small>" + esc(p[3]) + "</small></td></tr>";
    }).join("");

    // 4 · Reto
    var R = d.reto || {}, Q = R.perQuestion || [], TOP = R.top || [];
    $("reto-sub").textContent = f.jugadores ? f.jugadores + " médicos jugaron desde su celular, con su boleto y su puntaje guardados en tiempo real." : "El Reto se juega al final del programa académico.";
    var W = (d.winners || []).slice().sort(function (a, b) { return a.place - b.place; });
    $("podium").innerHTML = W.length ? W.map(function (w) {
      return '<div class="glass win' + (w.place == 1 ? " first" : "") + '"><div class="medal">' + w.place + '</div><div class="pl">' + ({ 1: "1.er", 2: "2.º", 3: "3.er" }[w.place] || w.place + ".º") + ' lugar</div>' +
        '<div class="nm">' + esc(w.name) + '</div><div class="sp">' + esc([w.specialty, w.city].filter(Boolean).join(" · ")) + '</div><div class="pt">' + fmt(w.pts) + ' pts</div><div class="ok"><span class="chip ' + (w.confirmed ? "" : "gray") + '">' + (w.confirmed ? "Confirmó sus datos" : "Por confirmar sus datos") + "</span></div></div>";
    }).join("") : '<div class="empty" style="grid-column:1/-1">Los ganadores aparecerán aquí cuando producción confirme y envíe el aviso.</div>';
    var qmx = Math.max.apply(null, Q.map(function (q) { return q.n; }).concat([1]));
    $("qbars").innerHTML = Q.length ? Q.map(function (q, i) { return '<div class="qbar"><span>Caso ' + (i + 1) + '</span><div class="meter"><i data-w="' + Math.round(q.n / (f.jugadores || qmx) * 100) + '"></i></div><b>' + q.n + "</b></div>"; }).join("") + '<p class="mute" style="font-size:12px;margin:10px 0 0">Respuestas recibidas en cada caso.</p>' : '<div class="mute">Aún no hay respuestas.</div>';
    whenSeen($("qbars"), function () { document.querySelectorAll("#qbars .meter i").forEach(function (el) { el.style.width = Math.min(100, el.dataset.w) + "%"; }); });
    $("top").innerHTML = TOP.length ? '<tr><th>#</th><th>Médico</th><th class="n">Puntos</th></tr>' + TOP.map(function (p) { return '<tr><td class="k">' + p.place + '</td><td class="who">' + esc(p.name) + '</td><td class="n">' + fmt(p.pts) + "</td></tr>"; }).join("") : '<tr><td class="mute">El marcador aparecerá al terminar el Reto.</td></tr>';

    // 5 · Por representante (no se muestra a DSM)
    var B = d.byRep || [];
    if (!B.length) $("s-rep").hidden = true;
    else {
      var tc = 0, ta = 0; B.forEach(function (r) { tc += r.confirmados; ta += r.asistieron; });
      $("reps").innerHTML = '<tr><th>Representante</th><th class="n">Confirmados</th><th class="n">Asistieron</th><th style="width:28%">Asistencia</th></tr>' + B.map(function (r) {
        var p = r.confirmados ? Math.round(r.asistieron / r.confirmados * 100) : 0;
        return '<tr><td class="who">' + esc(r.rep) + '</td><td class="n">' + r.confirmados + '</td><td class="n"><b>' + r.asistieron + '</b></td><td><div class="meter" style="margin-top:6px"><i style="width:' + p + '%"></i></div></td></tr>';
      }).join("") + '<tr><td class="k">Total</td><td class="n"><b>' + tc + '</b></td><td class="n"><b>' + ta + '</b></td><td class="mute" style="font-weight:700">' + (tc ? Math.round(ta / tc * 100) : 0) + "%</td></tr>";
    }

    // 6 · Fotos
    photos(d.photos || [], !!d.demo);

    // 7 · Video
    var src = d.video || VIDEO, v = document.createElement("video");
    v.controls = true; v.preload = "metadata"; v.playsInline = true; v.src = src; v.hidden = true;
    v.addEventListener("loadedmetadata", function () { v.hidden = false; $("vsoon").remove(); });
    $("vid").prepend(v);
  }

  // ─── Galería: las fotos llegan del servidor de PULSO, de pocas en pocas ───
  var P = [], cur = 0;
  function photos(list, isDemo) {
    var g = $("gal");
    if (!list.length) {
      g.innerHTML = '<div class="empty" style="grid-column:1/-1">' + (isDemo ? "Aquí aparecerán las fotos que suban Roberto y Blanca desde su celular o desde la carpeta de Drive." : "Las fotos del evento se están cargando. Vuelva a abrir esta liga en un rato.") + "</div>";
      return;
    }
    $("fot-sub").textContent = list.length + " fotografías · toque una para verla completa o descargarla.";
    P = list;
    g.innerHTML = list.map(function (p, i) { return '<button class="ph' + (i % 7 === 0 ? " big" : "") + '" data-i="' + i + '" type="button"><img alt="' + esc(p.caption || p.momento || "PULSO") + '">' + (p.caption || p.momento ? "<figcaption>" + esc(p.caption || p.momento) + "</figcaption>" : "") + "</button>"; }).join("");
    var queue = [], busy = 0;
    function pump() {
      while (busy < 3 && queue.length) {
        var el = queue.shift(), i = +el.dataset.i; busy++;
        call({ action: "photo", k: key, id: P[i].id, w: 900 }).then(function (el, i) { return function (r) {
          if (r && r.success) { var im = el.querySelector("img"); P[i].thumb = "data:" + r.mime + ";base64," + r.data; im.onload = function () { im.classList.add("on"); el.style.animation = "none"; }; im.src = P[i].thumb; }
        }; }(el, i)).catch(function () {}).then(function () { busy--; pump(); });
      }
    }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); queue.push(e.target); pump(); } }); }, { rootMargin: "300px" });
    g.querySelectorAll(".ph").forEach(function (el) { io.observe(el); el.onclick = function () { openLb(+el.dataset.i); }; });
  }
  function openLb(i) {
    cur = (i + P.length) % P.length; var p = P[cur];
    $("lbimg").src = p.thumb || ""; $("lbcap").textContent = [p.momento, p.caption].filter(Boolean).join(" · ");
    $("lbdl").href = p.thumb || "#"; $("lb").classList.add("on");
    call({ action: "photo", k: key, id: p.id, w: 2000 }).then(function (r) { if (r && r.success && cur === i % P.length) { var u = "data:" + r.mime + ";base64," + r.data; p.full = u; $("lbimg").src = u; $("lbdl").href = u; } }).catch(function () {});
  }
  $("lbx").onclick = function () { $("lb").classList.remove("on"); };
  $("lbp").onclick = function () { openLb(cur - 1); };
  $("lbn").onclick = function () { openLb(cur + 1); };
  addEventListener("keydown", function (e) { if (!$("lb").classList.contains("on")) return; if (e.key === "Escape") $("lbx").onclick(); if (e.key === "ArrowLeft") openLb(cur - 1); if (e.key === "ArrowRight") openLb(cur + 1); });

  $("print").onclick = function () { window.print(); };

  function fail(msg) {
    $("load").remove();
    document.querySelector("main").innerHTML = '<section class="sheet err"><h2>No pudimos abrir el reporte</h2><p>' + esc(msg) + '</p><p class="mute">Escríbanos a <a href="mailto:pulso@polarmultimedia.com">pulso@polarmultimedia.com</a> y le mandamos su liga de nuevo.</p></section>';
  }

  if (demo) { $("demo").hidden = false; $("load").remove(); render(demoData()); return; }
  call({ action: "reportData", k: key }).then(function (d) {
    if (!d || !d.success) return fail(d && d.message ? d.message : "La liga no es válida.");
    $("load").remove(); render(d);
  }).catch(function () { fail("No hubo conexión con el servidor. Revise su internet e intente de nuevo."); });
})();
