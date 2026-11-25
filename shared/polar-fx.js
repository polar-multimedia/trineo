// Efectos polares compartidos: aurora boreal (WebGL), estrellas, nieve, huellas de oso,
// aparición de secciones, inclinación 3D de tarjetas y conteo de cifras.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const soft = document.body.dataset.fx === "soft"; // versión más tranquila (panel)

// ---------- Aurora (WebGL)
(function aurora() {
  const c = document.createElement("canvas");
  c.id = "aurora"; c.setAttribute("aria-hidden", "true");
  document.body.prepend(c);
  const gl = c.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
  if (!gl) { document.body.classList.add("no-gl"); return; }
  const vs = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  const fs = `precision mediump float;
uniform vec2 r;uniform float t;uniform float sc;uniform vec2 m;uniform float k;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float a=.5,v=0.;for(int i=0;i<5;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}
void main(){
 vec2 uv=gl_FragCoord.xy/r;float asp=r.x/r.y;
 vec3 col=mix(vec3(.035,.10,.17),vec3(.012,.035,.075),uv.y);
 col+=vec3(.05,.16,.17)*exp(-uv.y*5.);
 vec2 sp=floor(gl_FragCoord.xy/1.6);float st=h(sp);
 col+=vec3(.9,.97,1.)*step(.9982,st)*(.45+.55*sin(t*1.7+st*90.))*smoothstep(.15,.7,uv.y);
 float y=uv.y+sc*.12;
 for(int i=0;i<4;i++){float fi=float(i);
  float x=(uv.x+(m.x-.5)*.05*(fi+1.))*asp*(.9+fi*.42)+fi*4.3;
  float w=fbm(vec2(x*.7+t*.045*(1.+fi*.35),t*.035+fi*1.7));
  float base=.30+fi*.11+(w-.5)*.62;
  float d=y-base;
  float ray=fbm(vec2(x*7.+w*3.,t*.22+fi*2.));
  float fine=n(vec2(x*42.+w*8.,t*.5));
  float band=smoothstep(-.005,.035,d)*exp(-d*(4.4-fi*.5));
  float I=band*(.22+1.05*ray)*(.72+.28*fine);
  vec3 c=mix(vec3(.26,.90,.78),vec3(.88,.09,.62),smoothstep(.02,.42,d+(ray-.5)*.22));
  c=mix(c,vec3(.55,1.,.82),.35*(1.-smoothstep(0.,.10,d)));
  col+=c*I*(.80-fi*.13)*k;
 }
 col+=vec3(.31,.80,.79)*.05*exp(-length((uv-m)*vec2(asp,1.))*5.);
 col=1.-exp(-col*1.35);
 gl_FragColor=vec4(col,1.);
}`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { document.body.classList.add("no-gl"); c.remove(); return; }
  gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(pr, n), uR = U("r"), uT = U("t"), uS = U("sc"), uM = U("m"), uK = U("k");
  const scale = innerWidth < 720 ? 0.6 : 0.5;
  let mx = .5, my = .6, tx = .5, ty = .6;
  const rs = () => { c.width = Math.max(2, innerWidth * scale | 0); c.height = Math.max(2, innerHeight * scale | 0); gl.viewport(0, 0, c.width, c.height); };
  rs(); addEventListener("resize", rs);
  addEventListener("pointermove", e => { tx = e.clientX / innerWidth; ty = 1 - e.clientY / innerHeight; }, { passive: true });
  const draw = now => {
    mx += (tx - mx) * .04; my += (ty - my) * .04;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    gl.uniform2f(uR, c.width, c.height); gl.uniform1f(uT, now / 1000 + 40);
    gl.uniform1f(uS, scrollY / max); gl.uniform2f(uM, mx, my); gl.uniform1f(uK, soft ? .5 : .9);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  if (reduce) { draw(0); return; }
  let on = true;
  document.addEventListener("visibilitychange", () => { on = document.visibilityState === "visible"; if (on) requestAnimationFrame(loop); });
  function loop(now) { if (!on) return; draw(now); requestAnimationFrame(loop); }
  requestAnimationFrame(loop);
})();

// ---------- Nieve + huellas de oso (un solo canvas 2D encima)
(function overlay() {
  if (reduce) return;
  const c = document.createElement("canvas");
  c.id = "polarfx"; c.setAttribute("aria-hidden", "true");
  document.body.append(c);
  const g = c.getContext("2d"); let W, H; const dpr = Math.min(2, devicePixelRatio || 1);
  const rs = () => { W = innerWidth; H = innerHeight; c.width = W * dpr; c.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); };
  rs(); addEventListener("resize", rs);
  const N = soft ? 28 : (innerWidth < 720 ? 45 : 90);
  const flakes = Array.from({ length: N }, () => ({ x: Math.random(), y: Math.random(), z: .3 + Math.random() * .7, p: Math.random() * 6.28 }));
  const prints = []; let last = null, side = 1, wind = 0, lastX = null;
  const paw = (x, y, a) => { prints.push({ x, y, a, side, t: performance.now() }); side *= -1; };
  addEventListener("pointermove", e => {
    if (lastX != null) wind += ((e.clientX - lastX) * .004 - wind) * .2; lastX = e.clientX;
    if (e.pointerType === "touch") return;
    const p = { x: e.clientX, y: e.clientY };
    if (!last) { last = p; return; }
    const dx = p.x - last.x, dy = p.y - last.y;
    if (Math.hypot(dx, dy) > 70) { paw(p.x, p.y, Math.atan2(dy, dx)); last = p; }
  }, { passive: true });
  addEventListener("pointerdown", e => { if (e.pointerType === "touch") paw(e.clientX, e.clientY, -Math.PI / 2); }, { passive: true });
  function drawPaw(p, al) {
    g.save(); g.translate(p.x, p.y); g.rotate(p.a + Math.PI / 2); g.translate(p.side * 9, 0);
    g.globalAlpha = al; g.fillStyle = "rgba(78,203,202,.62)"; g.shadowColor = "rgba(78,203,202,.8)"; g.shadowBlur = 10;
    g.beginPath(); g.ellipse(0, 4, 8, 7, 0, 0, 6.29); g.fill();
    [[-9, -6, 3.2], [-3.5, -11, 3.4], [3.5, -11, 3.4], [9, -6, 3.2]].forEach(([x, y, r]) => { g.beginPath(); g.ellipse(x, y, r, r * 1.15, 0, 0, 6.29); g.fill(); });
    g.restore();
  }
  let on = true, prev = performance.now();
  document.addEventListener("visibilitychange", () => { on = document.visibilityState === "visible"; if (on) { prev = performance.now(); requestAnimationFrame(loop); } });
  function loop(now) {
    if (!on) return;
    const dt = Math.min(50, now - prev) / 1000; prev = now; wind *= .97;
    g.clearRect(0, 0, W, H);
    g.fillStyle = "#fff";
    for (const f of flakes) {
      f.y += dt * (.018 + .05 * f.z); f.x += dt * (wind * f.z + Math.sin(now / 1400 + f.p) * .012);
      if (f.y > 1.02) { f.y = -.02; f.x = Math.random(); } if (f.x > 1.02) f.x = -.02; if (f.x < -.02) f.x = 1.02;
      g.globalAlpha = .25 + .55 * f.z; g.beginPath(); g.arc(f.x * W, f.y * H, .6 + 1.7 * f.z, 0, 6.29); g.fill();
    }
    for (let i = prints.length - 1; i >= 0; i--) {
      const age = (now - prints[i].t) / 2200; if (age >= 1) { prints.splice(i, 1); continue; }
      drawPaw(prints[i], 1 - age);
    }
    g.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

// ---------- Aparición de secciones, conteo de cifras e inclinación de tarjetas
(function ui() {
  const els = document.querySelectorAll("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); }
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .08 });
    els.forEach(e => io.observe(e));
  }
  document.querySelectorAll("[data-count]").forEach(el => {
    const end = Number(el.dataset.count); if (reduce || !end) return;
    const t0 = performance.now() + 500; el.textContent = "0";
    (function step(now) {
      const p = Math.min(1, Math.max(0, (now - t0) / 1600)), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(end * e).toLocaleString("en-US");
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  });
  if (reduce || matchMedia("(hover: none)").matches) return;
  document.querySelectorAll("[data-tilt]").forEach(el => {
    el.addEventListener("pointermove", e => {
      const b = el.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
      el.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
      el.style.setProperty("--gx", `${(x + .5) * 100}%`); el.style.setProperty("--gy", `${(y + .5) * 100}%`);
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });
})();
