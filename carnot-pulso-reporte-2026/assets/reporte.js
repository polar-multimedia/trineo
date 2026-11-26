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
      timeline: tl.map(function (x) { return { time: x[0], ts: Date.parse("2026-11-26T" + x[0] + ":00-06:00"), label: x[1], key: !!x[2] }; }),
      program: [["16:00", "El Observatorio", "Dra. María José Mendoza Tavera", "Diarrea aguda en pediatría: decisiones terapéuticas basadas en evidencia y estrategias para una recuperación intestinal efectiva"], ["16:30", "El Laboratorio", "Dr. Francisco Javier Otero Mendoza", "Antibióticos en pediatría: ¿cuándo sí, cuándo no y cómo proteger la salud intestinal?"], ["16:55", "El Arrecife", "Dra. Ana Teresa Abreu y Abreu", "Clasificación de los bioterapéuticos y su evidencia científica"], ["17:55", "El Jardín japonés", "Dr. Rodrigo Vázquez Frías", "De la evidencia clínica a la recuperación intestinal: el rol de Lactobacillus LB inactivados"], ["18:25", "La Mesa de Perspectivas", "Panel de expertos · modera Dr. Alfonso Copto", "¿Qué necesita realmente el intestino para su recuperación?"], ["19:10", "La Orilla", "Dr. José Antonio Chávez Barrera", "Dolor, diarrea, estreñimiento y estudios normales: Roma V llega al consultorio"], ["19:55", "Reto PULSO", "Cinco casos clínicos en tiempo real", "Becas para CONAPM 2027"]],
      reto: { perQuestion: [108, 111, 106, 109, 104].map(function (v, i) { return { q: "q" + (i + 1), n: v }; }), top: n.map(function (x, i) { return { place: i + 1, name: x, pts: 4720 - i * 260 - (i > 2 ? 120 : 0) }; }) },
      winners: [0, 1, 2].map(function (i) { return { place: i + 1, name: n[i], pts: 4720 - i * 260, confirmed: i < 2, specialty: ["Pediatría", "Gastroenterología pediátrica", "Pediatría"][i], city: ["Ciudad de México", "Puebla", "Toluca"][i], rep: "Representante de ejemplo " + (i + 1) }; }),
      byRep: [["Representante de ejemplo 1", 9, 8], ["Representante de ejemplo 2", 7, 6], ["Representante de ejemplo 3", 6, 6], ["Representante de ejemplo 4", 5, 3]].map(function (r) { return { rep: r[0], confirmados: r[1], asistieron: r[2] }; }),
      vivo: { ahora: { n: "El Arrecife · Dra. Ana Teresa Abreu y Abreu", what: "", time: "16:55" }, viajes: [["Dr. Jorge Alberto Méndez Ríos", "Durango", 1, "07:45", "here"], ["Dr. Ricardo Salinas Peña", "Tampico", 1, "10:05", "here"], ["Dr. Héctor Iván Ruiz Gómez", "Tapachula", 1, "11:15", "delay", 35], ["Dra. Paola Andrea Núñez Cruz", "Los Mochis", 1, "13:10", "air"], ["Dr. Óscar Medina Solís", "Pachuca", 0, "", "pick"]].map(function (x) { return { name: x[0], from: x[1], air: !!x[2], eta: x[3], s: x[4], d: x[5] || 0 }; }) },
      photos: [["r-calle_noche.jpg", "Llegada y registro", "14:40"], ["r-escenario.jpg", "Ponencia · Dra. Mendoza (El Observatorio)", "16:10"], ["r-s360.jpg", "Ponencia · Dra. Abreu (El Arrecife)", "17:00"], ["r-booth.jpg", "Espacios y marca", "17:30"], ["r-dinamica.jpg", "Reto PULSO", "20:02"], ["r-cena.jpg", "Cena", "20:50"]].map(function (x, i) { return { id: "demo" + i, src: "assets/" + x[0], momento: x[1], caption: "Foto de ejemplo (render)", at: "2026-11-26T" + x[2] + ":00-06:00" }; }),
      video: "", updated: new Date().toISOString()
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

  function vivo(d) {
    var V = d.vivo, sec = $("s-vivo");
    if (!V) { sec.hidden = true; return; }
    sec.hidden = false; sec.classList.add("in");
    $("para-cargo").textContent = "PULSO by Lacteol · en vivo";
    var up = new Date(d.updated || Date.now());
    $("vivo-sub").textContent = "Actualizado a las " + up.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false }) + " h · se actualiza solo cada minuto. Al cierre, esta misma liga se convierte en el reporte final.";
    var f = d.figures || {}, a = V.ahora;
    $("vivo-ahora").innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:18px;align-items:baseline"><div><div class="eyebrow">Llegaron</div><div style="font-weight:800;font-size:34px;color:var(--navy);line-height:1">' + fmt(f.asistentes) + '<span style="font-size:15px;color:var(--mute)"> de ' + fmt(f.confirmados) + ' confirmados</span></div></div>' +
      (a ? '<div style="flex:1;min-width:220px"><div class="eyebrow">En la Sala 360 desde las ' + esc(a.time) + '</div><div style="font-weight:800;font-size:17px;color:var(--navy)">' + esc(a.n) + '</div>' + (a.what && !/sin señal/i.test(a.what) ? '<div class="mute" style="font-weight:700">' + esc(a.what) + '</div>' : '') + '</div>' : '<div class="mute" style="font-weight:700">El programa arranca a las 16:00.</div>') + '</div>';
    var T = V.viajes || [];
    if (!T.length) { $("vivo-h").hidden = true; $("vivo-viajes").hidden = true; return; }
    var LBL = { prog: ["Programado", "gray"], air: ["En vuelo", ""], delay: ["Retrasado", "warn"], land: ["Aterrizó", ""], pick: ["Con el chofer", ""], done: ["Entregado", ""], here: ["Ya está en PULSO", ""] };
    T = T.slice().sort(function (x, y) { return (x.s === "here") - (y.s === "here") || String(x.eta).localeCompare(String(y.eta)); });
    $("vivo-viajes").innerHTML = T.map(function (t) {
      var l = LBL[t.s] || LBL.prog;
      return '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--line)"><div style="flex:1;min-width:0"><div class="who" style="font-weight:800;color:var(--navy)">' + esc(t.name) + '</div><div class="mute" style="font-size:13px;font-weight:700">' + esc(t.from) + ' · ' + (t.air ? "en avión" : "por tierra") + (t.eta ? " · llega " + esc(t.eta) : "") + '</div></div><span class="chip ' + l[1] + '" style="flex:none">' + l[0] + (t.s === "delay" && t.d ? " +" + t.d + " min" : "") + "</span></div>";
    }).join("");
  }

  function render(d) {
    vivo(d);
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

    // 2 · Cronología (cada momento con sus fotos)
    var T = d.timeline || [];
    P = d.photos || [];
    var byItem = photosForTimeline(T, P);
    $("tl").innerHTML = T.length ? T.map(function (x, j) {
      var k = x.key || /Reto|constancias|ganador/i.test(x.label);
      var ph = (byItem[j] || []).slice(0, 3);
      return '<li class="' + (k ? "key" : "") + (ph.length ? " has-ph" : "") + '"><time>' + esc(x.time) + '</time><span class="dot"></span><span class="t">' + esc(x.label) + (x.pc ? "<small>" + x.pc + " médicos conectados al Reto</small>" : "") +
        (ph.length ? '<span class="tl-ph n' + ph.length + '">' + ph.map(function (i) { return '<button class="ph" data-i="' + i + '" type="button"><img alt="' + esc(P[i].momento || "PULSO") + '"></button>'; }).join("") + "</span>" : "") + "</span></li>";
    }).join("") : '<li><span></span><span></span><span class="t mute">La cronología se llena sola durante el evento.</span></li>';
    lazyPhotos($("tl"));

    // 3 · Programa
    $("prog-sub").textContent = "Coordinador: Dr. Alfonso Copto · " + (f.puntos || 6) + " puntos curriculares " + (f.clave || "");
    var talkPh = photosForTalks(d.program || [], P);
    $("prog").innerHTML = (d.program || []).map(function (t, j) {
      var ph = talkPh[j] || [], first = ph[0], scene = SCENE[t[1]];
      var im = first != null ? '<button class="im ph" data-i="' + first + '" type="button"><img alt="' + esc(t[2]) + '"></button>'
        : '<button class="im ref" type="button" data-img="' + (scene || "e03") + '" data-cap="' + esc(t[1]) + ' · escena de la Sala 360" style="background-image:url(assets/' + (scene || "e03") + '.jpg)"></button>';
      return '<div class="glass talk">' + im + '<div class="tx"><div class="hr">' + esc(t[0]) + " · " + esc(t[1]) + '</div><div class="sp">' + esc(t[2]) + '</div><div class="tp">' + esc(t[3]) + "</div>" +
        (ph.length > 1 ? '<div class="more">' + ph.slice(1, 5).map(function (i) { return '<button class="ph" data-i="' + i + '" type="button"><img alt=""></button>'; }).join("") + "</div>" : "") + "</div></div>";
    }).join("");
    lazyPhotos($("prog"));

    // Encabezados: la foto destacada (o la primera) de su momento; si no hay, la imagen de referencia
    document.querySelectorAll(".scene[data-mom]").forEach(function (el) {
      var mm = el.dataset.mom, pick = -1;
      P.forEach(function (p, i) { if (String(p.momento || "").indexOf(mm) === 0 && (pick < 0 || (p.star && !P[pick].star))) pick = i; });
      if (pick < 0) return;
      thumb(pick).then(function (u) { if (!u) return; el.style.backgroundImage = "url(" + u + ")"; el.classList.remove("ref"); el.classList.add("real"); el.onclick = function () { openLb(pick); }; });
    });

    // 5 · Comunicación
    var C = [["correo-constancia", "Constancia", (f.constancias ? fmt(f.constancias) + " médicos" : "Cada médico asistente") + " · 20:40 h", "Su constancia en PDF, lista para descargar, reenviar o corregir su nombre.", "constancia-muestra", "Ver la constancia"],
      ["correo-ganador", "Ganadores del Reto", "3 médicos · al confirmar producción", "Felicitación, sus puntos y confirmación de datos para gestionar la beca."],
      ["correo-repre-hoy", "Representantes · día del evento", "9:00 h", "«Hoy es PULSO»: la lista de sus médicos confirmados y su liga de seguimiento."],
      ["correo-gracias", "Agradecimiento a los asistentes", "Al cierre", "Gracias por ser parte de PULSO, con la videomemoria."],
      ["correo-repre-resultados", "Resultados a cada representante", "Al cierre", "Su página con los médicos que llegaron, su Reto, becas y constancias."],
      ["correo-reporte", "Reporte final a la cadena", "Al cierre", "Este reporte, con una liga para cada destinatario."]];
    $("mails").innerHTML = C.map(function (c) {
      return '<div class="glass mail"><button class="mi" type="button" data-img="' + c[0] + '" data-cap="' + esc(c[1]) + ' (datos de ejemplo)" style="background-image:url(assets/' + c[0] + '.jpg)"></button><div class="mt"><div class="hr">' + esc(c[2]) + '</div><div class="sp">' + esc(c[1]) + '</div><p>' + esc(c[3]) + '</p><div class="btns"><button class="btn sm" type="button" data-img="' + c[0] + '" data-cap="' + esc(c[1]) + ' (datos de ejemplo)">Ver correo</button>' +
        (c[4] ? '<button class="btn sm ghost" type="button" data-img="' + c[4] + '" data-cap="Constancia (machote con nombre de ejemplo)">' + c[5] + "</button>" : "") + "</div></div></div>";
    }).join("");

    // 4 · Reto
    var R = d.reto || {}, Q = R.perQuestion || [], TOP = R.top || [];
    $("reto-sub").textContent = f.jugadores ? f.jugadores + " médicos jugaron desde su celular, con su boleto y su puntaje guardados en tiempo real." : "El Reto se juega al final del programa académico.";
    var W = (d.winners || []).slice().sort(function (a, b) { return a.place - b.place; });
    $("podium").innerHTML = W.length ? W.map(function (w) {
      return '<div class="glass win' + (w.place == 1 ? " first" : "") + '"><div class="medal">' + w.place + '</div><div class="pl">' + ({ 1: "1.er", 2: "2.º", 3: "3.er" }[w.place] || w.place + ".º") + ' lugar</div>' +
        '<div class="nm">' + esc(w.name) + '</div><div class="sp">' + esc([w.specialty, w.city].filter(Boolean).join(" · ")) + '</div>' + (w.rep ? '<div class="rp">Representante: <b>' + esc(w.rep) + "</b></div>" : "") + '<div class="pt">' + fmt(w.pts) + ' pts</div><div class="ok"><span class="chip ' + (w.confirmed ? "" : "gray") + '">' + (w.confirmed ? "Confirmó sus datos" : "Por confirmar sus datos") + "</span></div></div>";
    }).join("") + '<div class="btns" style="grid-column:1/-1"><button class="btn sm ghost" type="button" data-img="correo-ganador" data-cap="Correo de felicitación a cada ganador (datos de ejemplo)">Ver el correo que recibieron</button><button class="btn sm ghost" type="button" data-img="correo-repre-resultados" data-cap="Aviso al representante cuando su médico gana (datos de ejemplo)">Ver el aviso a su representante</button></div>' : '<div class="empty" style="grid-column:1/-1">Los ganadores aparecerán aquí cuando producción confirme y envíe el aviso.</div>';
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
    if ($("vid").querySelector("video")) return;
    var src = d.video || VIDEO, v = document.createElement("video");
    v.controls = true; v.preload = "metadata"; v.playsInline = true; v.src = src; v.hidden = true;
    v.addEventListener("loadedmetadata", function () { v.hidden = false; $("vsoon").remove(); });
    $("vid").prepend(v);
  }

  // ─── Fotos: llegan del servidor de PULSO, de pocas en pocas, y se reutilizan en la cronología y la galería ───
  var P = [], cur = 0, q = [], busy = 0, wait = {};
  function thumb(i) {
    if (P[i].thumb) return Promise.resolve(P[i].thumb);
    if (P[i].src) { P[i].thumb = P[i].src; return Promise.resolve(P[i].src); }
    if (wait[i]) return wait[i];
    wait[i] = new Promise(function (ok) { q.push([i, ok]); pump(); });
    return wait[i];
  }
  function pump() {
    while (busy < 3 && q.length) {
      var it = q.shift(); busy++;
      (function (i, ok) {
        call({ action: "photo", k: key, id: P[i].id, w: 900 }).then(function (r) { if (r && r.success) P[i].thumb = "data:" + r.mime + ";base64," + r.data; })
          .catch(function () {}).then(function () { busy--; ok(P[i].thumb || ""); pump(); });
      })(it[0], it[1]);
    }
  }
  function lazyPhotos(root) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) {
      if (!e.isIntersecting) return; io.unobserve(e.target); var el = e.target;
      thumb(+el.dataset.i).then(function (u) { if (!u) return; var im = el.querySelector("img"); im.onload = function () { im.classList.add("on"); el.style.animation = "none"; }; im.src = u; });
    }); }, { rootMargin: "300px" });
    root.querySelectorAll(".ph").forEach(function (el) { io.observe(el); el.onclick = function () { openLb(+el.dataset.i); }; });
  }
  /* A qué momento de la cronología va cada foto: primero por el momento que eligió quien la subió
     (Reto, ganadores, cena, llegada); si no, por la hora en que se subió. */
  function photosForTimeline(T, list) {
    var out = {}, ts = T.map(function (x) { return x.ts || 0; });
    var find = function (re) { for (var j = 0; j < T.length; j++) if (re.test(T[j].label)) return j; return -1; };
    var M = { "Reto PULSO": find(/^Reto PULSO/i), "Ganadores": find(/ganador/i), "Cena": find(/^Cena/i), "Llegada y registro": find(/primer médico|registro/i), "Panel": find(/Mesa de Perspectivas|Panel/i) };
    ["El Observatorio", "El Laboratorio", "El Arrecife", "El Jardín japonés", "La Mesa de Perspectivas", "La Orilla"].forEach(function (n) { var j = find(new RegExp(n)); list.forEach(function (p) { if (String(p.momento || "").indexOf(n) >= 0) M[p.momento] = j; }); });
    list.forEach(function (p, i) {
      var j = M[p.momento] != null ? M[p.momento] : -1;
      if (j < 0) { var t = Date.parse(p.at || ""); if (!t) return; for (var k = 0; k < T.length; k++) if (ts[k] && ts[k] <= t) j = k; }
      if (j < 0) return;
      (out[j] = out[j] || []).push(i);
    });
    return out;
  }
  var SCENE = { "El Observatorio": "e03", "El Laboratorio": "e04", "El Arrecife": "e05", "El Jardín japonés": "e07", "La Mesa de Perspectivas": "e08", "La Orilla": "e09", "Reto PULSO": "e10" };
  /* Fotos de cada ponencia: las que se subieron con su nombre; si no, las genéricas tomadas durante su horario. */
  function photosForTalks(prog, list) {
    var out = {}, day = "2026-11-26T";
    var st = prog.map(function (t) { return Date.parse(day + t[0] + ":00-06:00"); });
    list.forEach(function (p, i) {
      var m = String(p.momento || ""), j = -1;
      prog.forEach(function (t, k) { if (j < 0 && t[1] && m.indexOf(t[1]) >= 0) j = k; });
      if (j < 0 && /^Ponencia$|^Ponencias$|^Panel$/.test(m)) { var at = Date.parse(p.at || ""); prog.forEach(function (t, k) { if (at >= st[k] && (k === prog.length - 1 || at < st[k + 1])) j = k; }); }
      if (j < 0) return;
      (out[j] = out[j] || []).push(i);
    });
    Object.keys(out).forEach(function (k) { out[k].sort(function (a, b) { return (list[b].star ? 1 : 0) - (list[a].star ? 1 : 0); }); });
    return out;
  }
  function openImg(name, cap) {
    var u = /^(https?:|data:)/.test(name) ? name : "assets/" + name + ".jpg";
    cur = -1; $("lbimg").src = u; $("lbcap").textContent = cap || ""; $("lbdl").href = u; $("lb").classList.add("on", "doc");
  }
  document.addEventListener("click", function (e) { var b = e.target.closest("[data-img]"); if (b) openImg(b.dataset.img, b.dataset.cap); });
  function photos(list, isDemo) {
    var g = $("gal");
    if (!list.length) {
      g.innerHTML = '<div class="empty" style="grid-column:1/-1">' + (isDemo ? "Aquí aparecerán las fotos que suban Roberto y Blanca desde su celular o desde la carpeta de Drive." : "Las fotos del evento se están cargando. Vuelva a abrir esta liga en un rato.") + "</div>";
      return;
    }
    $("fot-sub").textContent = list.length + " fotografías · toque una para verla completa o descargarla.";
    g.innerHTML = list.map(function (p, i) { return '<button class="ph' + (i % 7 === 0 ? " big" : "") + '" data-i="' + i + '" type="button"><img alt="' + esc(p.caption || p.momento || "PULSO") + '">' + (p.caption || p.momento ? "<figcaption>" + esc(p.caption || p.momento) + "</figcaption>" : "") + "</button>"; }).join("");
    lazyPhotos(g);
  }
  function openLb(i) {
    cur = (i + P.length) % P.length; var p = P[cur];
    $("lbimg").src = p.thumb || p.src || ""; if (!p.thumb && !p.src) thumb(cur).then(function (u) { if (P[cur] === p) { $("lbimg").src = u; $("lbdl").href = u; } }); $("lbcap").textContent = [p.momento, p.caption].filter(Boolean).join(" · ");
    $("lbdl").href = p.thumb || "#"; $("lb").classList.remove("doc"); $("lb").classList.add("on");
    if (p.src) return;
    call({ action: "photo", k: key, id: p.id, w: 2000 }).then(function (r) { if (r && r.success && cur === i % P.length) { var u = "data:" + r.mime + ";base64," + r.data; p.full = u; $("lbimg").src = u; $("lbdl").href = u; } }).catch(function () {});
  }
  $("lbx").onclick = function () { $("lb").classList.remove("on"); };
  $("lbp").onclick = function () { if (cur >= 0) openLb(cur - 1); };
  $("lbn").onclick = function () { if (cur >= 0) openLb(cur + 1); };
  addEventListener("keydown", function (e) { if (!$("lb").classList.contains("on")) return; if (e.key === "Escape") $("lbx").onclick(); if (cur < 0) return; if (e.key === "ArrowLeft") openLb(cur - 1); if (e.key === "ArrowRight") openLb(cur + 1); });

  $("print").onclick = function () { window.print(); };

  function fail(msg) {
    $("load").remove();
    document.querySelector("main").innerHTML = '<section class="sheet err"><h2>No pudimos abrir el reporte</h2><p>' + esc(msg) + '</p><p class="mute">Escríbanos a <a href="mailto:pulso@polarmultimedia.com">pulso@polarmultimedia.com</a> y le mandamos su liga de nuevo.</p></section>';
  }

  if (demo) { $("demo").hidden = false; $("load").remove(); render(demoData()); return; }
  call({ action: "reportData", k: key }).then(function (d) {
    if (!d || !d.success) return fail(d && d.message ? d.message : "La liga no es válida.");
    $("load").remove(); render(d);
    if (d.vivo) setInterval(function () { if (document.hidden) return; call({ action: "reportData", k: key }).then(function (n) { if (n && n.success) { vivo(n); if (!n.vivo) location.reload(); } }).catch(function () {}); }, 60000);
  }).catch(function () { fail("No hubo conexión con el servidor. Revise su internet e intente de nuevo."); });
})();
