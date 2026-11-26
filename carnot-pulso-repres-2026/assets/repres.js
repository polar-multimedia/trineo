/* Resultados de PULSO para cada representante. Los datos vienen del servidor de PULSO (acción repList)
   y solo incluyen a los médicos de ese representante. La liga ?c=<clave> es la clave del representante. */
(function () {
  var API = "https://script.google.com/macros/s/AKfycbxYO671fzh-V5z2lFyXAT5LNNQSfNl0xXa5VLWuKYrYV0eXEhuIjZCrHaP7XUXmaEOZ/exec";
  var qs = new URLSearchParams(location.search);
  var key = (qs.get("c") || "").replace(/[^a-z0-9-]/gi, "").slice(0, 24);
  var demo = !key || key === "prueba" || qs.has("demo");
  var NT = qs.has("nt") ? 1 : 0;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var fmt = function (n) { return Number(n || 0).toLocaleString("es-MX"); };
  var D = null, filter = "todos";

  function call(body) {
    return fetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(body) }).then(function (r) { return r.json(); });
  }
  function toast(t) { var e = $("toast"); e.textContent = t; e.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(function () { e.classList.remove("on"); }, 3200); }
  function titleName(n) { return String(n || "").replace(/^(dr|dra|doctor|doctora)\.?\s+/i, ""); }

  function demoData() {
    var x = [["Ana Sofía Ramírez Ortega", "Pediatría", 1, 4720, 1, 1], ["Luis Fernando Castillo Mora", "Gastroenterología pediátrica", 1, 3560, 5, 0], ["Daniela Torres Villa", "Pediatría", 1, 2980, 14, 0], ["Ricardo Salinas Peña", "Pediatría", 1, 0, 0, 0], ["Paola Andrea Núñez Cruz", "Neonatología", 0, 0, 0, 0], ["Héctor Iván Ruiz Gómez", "", 0, 0, 0, 0, 1]];
    return { success: true, demo: true, rep: "Representante de ejemplo", open: true, jugadores: 112, updated: new Date().toISOString(),
      vivo: { ahora: { n: "El Arrecife · Dra. Ana Teresa Abreu y Abreu", time: "16:55" }, agenda: [["14:00", "Registro y bienvenida", "Check-in con QR en la entrada"], ["14:30", "Comida", "Terraza"], ["16:00", "El Observatorio · Dra. María José Mendoza Tavera", "Diarrea aguda en pediatría"], ["19:55", "Reto PULSO", "Cinco casos clínicos en tiempo real"], ["20:40", "Cena", "Salen las constancias por correo"], ["22:40", "Cierre", "Aquí mismo verá sus resultados"]] },
      doctors: x.map(function (d, i) { return { id: d[6] ? "" : "DEMO" + i, name: d[0], specialty: d[1], checkedIn: !!d[2], certReady: !!d[2], certSent: !!d[2], played: d[3] > 0, pts: d[3], place: d[4], winner: d[5], pending: !!d[6] }; }) };
  }

  function toM(t) { var m = String(t || "").match(/(\d{1,2}):(\d{2})/); return m ? +m[1] * 60 + +m[2] : -1; }
  function vivo(d) {
    var V = d.vivo, sec = $("s-vivo"); if (!V) { sec.hidden = true; return; }
    sec.hidden = false; sec.classList.add("in");
    var docs = d.doctors || [], came = docs.filter(function (x) { return x.checkedIn; }).length, a = V.ahora;
    $("vivo-sub").textContent = "Actualizado a las " + new Date(d.updated || Date.now()).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false }) + " h · se actualiza sola cada minuto. Al cierre, aquí mismo verá sus resultados y constancias.";
    $("vivo-ahora").innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:18px;align-items:baseline"><div><div class="eyebrow">De sus médicos ya llegaron</div><div style="font-weight:800;font-size:34px;color:var(--navy);line-height:1">' + fmt(came) + '<span style="font-size:15px;color:var(--mute)"> de ' + fmt(docs.length) + "</span></div></div>" +
      (a ? '<div style="flex:1;min-width:200px"><div class="eyebrow">En la Sala 360 desde las ' + esc(a.time) + '</div><div style="font-weight:800;font-size:17px;color:var(--navy)">' + esc(a.n) + "</div></div>" : "") + "</div>";
    var A = V.agenda || [], h = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" })), dia = h.getFullYear() === 2026 && h.getMonth() === 10 && h.getDate() === 26, nm = h.getHours() * 60 + h.getMinutes(), cur = -1;
    if (dia) A.forEach(function (x, i) { var m = toM(x[0]); if (m >= 0 && m <= nm) cur = i; });
    $("vivo-agenda").innerHTML = '<div class="eyebrow" style="padding-top:12px">Agenda de hoy</div>' + A.map(function (x, i) {
      var now = i === cur, next = dia && i === cur + 1;
      return '<div style="display:flex;gap:12px;align-items:flex-start;padding:11px 0;border-bottom:1px solid var(--line);' + (dia && i < cur ? "opacity:.5;" : "") + (now ? "background:rgba(73,230,255,.10);margin:0 -10px;padding-left:10px;padding-right:10px;border-radius:12px;" : "") + '"><b style="min-width:46px;color:var(--navy)">' + esc(x[0]) + '</b><div style="flex:1;min-width:0"><div style="font-weight:800;color:var(--navy)">' + esc(x[1]) + '</div><div class="mute" style="font-size:13px;font-weight:700">' + esc(x[2]) + "</div></div>" + (now ? '<span class="chip">Ahora</span>' : next ? '<span class="chip gray">Sigue</span>' : "") + "</div>";
    }).join("");
  }
  function render(d) {
    D = d; vivo(d);
    $("para-nombre").textContent = d.rep || "Representante Carnot";
    document.title = "PULSO · Resultados de " + (d.rep || "sus médicos");
    var now = new Date(); $("h-upd").textContent = "Datos al " + now.toLocaleDateString("es-MX", { day: "numeric", month: "long" }) + ", " + now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false }) + " h";
    var docs = d.doctors || [];
    var came = docs.filter(function (x) { return x.checkedIn; }).length, played = docs.filter(function (x) { return x.played; }).length,
      wins = docs.filter(function (x) { return x.winner; }).length, certs = docs.filter(function (x) { return x.certReady; }).length;
    var pct = docs.length ? Math.round(came / docs.length * 100) : 0;
    var K = [[came, "de sus médicos asistieron", "hi"], [pct, "de asistencia", "", "%"], [docs.length, "médicos en su lista"], [played, "jugaron el Reto PULSO"], [certs, "constancias listas"], [wins, wins === 1 ? "ganó beca para CONAPEME 2027" : "ganaron beca para CONAPEME 2027"]];
    $("kpis").innerHTML = K.map(function (k, i) { return '<div class="glass kpi ' + (k[2] || "") + '"><div class="n">' + fmt(k[0]) + (k[3] || "") + '</div><div class="l">' + esc(k[1]) + "</div>" + (i === 1 ? '<div class="meter"><i style="width:' + pct + '%"></i></div>' : "") + "</div>"; }).join("");
    $("sum-sub").textContent = wins ? "¡Felicidades! Uno de sus médicos está entre los ganadores del Reto PULSO." : "Médicos que usted invitó y confirmó para el evento.";
    if (wins > 1) $("sum-sub").textContent = "¡Felicidades! " + wins + " de sus médicos están entre los ganadores del Reto PULSO.";
    var F = [["todos", "Todos · " + docs.length], ["asistieron", "Asistieron · " + came], ["no", "No asistieron · " + (docs.length - came)]];
    $("filters").innerHTML = F.map(function (f) { return '<button type="button" data-f="' + f[0] + '" class="' + (f[0] === filter ? "on" : "") + '">' + f[1] + "</button>"; }).join("");
    $("filters").querySelectorAll("button").forEach(function (b) { b.onclick = function () { filter = b.dataset.f; render(D); }; });
    var list = docs.filter(function (x) { return filter === "todos" || (filter === "asistieron" ? x.checkedIn : !x.checkedIn); });
    $("docs").innerHTML = list.length ? list.map(function (x) {
      var tags = [];
      if (x.winner) tags.push('<span class="chip mag">Ganador · ' + x.winner + '.º lugar</span>');
      tags.push(x.checkedIn ? '<span class="chip">Asistió</span>' : x.pending ? '<span class="chip warn">Confirmado, no se registró</span>' : '<span class="chip gray">No asistió</span>');
      if (x.certSent) tags.push('<span class="chip gray">Constancia enviada a su correo</span>');
      var rt = x.played ? "<b>" + fmt(x.pts) + " pts</b><small>Lugar " + x.place + (d.jugadores ? " de " + d.jugadores : "") + "</small>" : x.checkedIn ? "<small>No jugó el Reto</small>" : "";
      var act = x.certReady && x.id ? '<div class="act"><button class="btn sm" type="button" data-cert="' + esc(x.id) + '">Constancia (PDF)</button></div>' : (x.checkedIn && !d.open ? '<div class="act"><span class="mute" style="font-size:12.5px;font-weight:700">La constancia se libera el 26 de noviembre a las 20:40 h.</span></div>' : "");
      return '<div class="glass doc' + (x.winner ? " gold" : "") + (x.checkedIn ? "" : " off") + '"><div><div class="nm">' + esc(titleName(x.name)) + '</div><div class="sp">' + esc(x.specialty || "Especialidad sin registrar") + '</div><div class="tags">' + tags.join("") + '</div></div><div class="rt">' + rt + "</div>" + act + "</div>";
    }).join("") : '<div class="empty">No hay médicos en este filtro.</div>';
    $("docs").querySelectorAll("[data-cert]").forEach(function (b) { b.onclick = function () { cert(b); }; });
  }

  function cert(b) {
    if (D.demo) return toast("En la liga real aquí se descarga el PDF de la constancia.");
    var t = b.textContent; b.disabled = true; b.textContent = "Preparando…";
    call({ action: "repCert", k: key, id: b.dataset.cert }).then(function (r) {
      if (!r || !r.success) return toast(r && r.message ? r.message : "No se pudo descargar.");
      var bin = atob(r.pdf), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
      var url = URL.createObjectURL(new Blob([u], { type: "application/pdf" })), a = document.createElement("a");
      a.href = url; a.download = r.filename || "Constancia-PULSO.pdf"; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000); toast("Constancia descargada");
    }).catch(function () { toast("Sin conexión. Intente de nuevo."); }).then(function () { b.disabled = false; b.textContent = t; });
  }

  $("print").onclick = function () { window.print(); };
  function fail(msg) {
    $("load").remove();
    document.querySelector("main").innerHTML = '<section class="sheet err"><h2>No pudimos abrir sus resultados</h2><p>' + esc(msg) + '</p><p class="mute">Escríbanos a <a href="mailto:pulso@polarmultimedia.com">pulso@polarmultimedia.com</a> y le mandamos su liga de nuevo.</p></section>';
  }
  if (demo) { $("demo").hidden = false; $("load").remove(); render(demoData()); return; }
  call({ action: "repList", k: key, nt: NT }).then(function (d) {
    if (!d || !d.success) return fail(d && d.message ? d.message : "La liga no es válida.");
    $("load").remove(); render(d);
    if (d.vivo) setInterval(function () { if (document.hidden) return; call({ action: "repList", k: key, nt: NT }).then(function (n) { if (n && n.success) render(n); }).catch(function () {}); }, 60000);
  }).catch(function () { fail("No hubo conexión con el servidor. Revise su internet e intente de nuevo."); });
})();
