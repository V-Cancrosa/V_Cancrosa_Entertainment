/*
 * Efekty wizualne: kosmos (canvas), ekran ładowania, terminal,
 * przechylanie kart 3D, pojawianie się przy przewijaniu.
 * Bez zależności. Szanuje „prefers-reduced-motion”.
 *
 * Terminal wzorowany na termynal.js (Ines Montani, MIT),
 * pojawianie się przy scrollu na AOS (Michał Sajnóg, MIT).
 */
(function () {
  "use strict";

  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia && matchMedia("(pointer: fine)").matches;
  document.documentElement.classList.add("js");

  /* ---------- Warstwy tła ---------- */
  function addLayer(tag, cls, id) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (id) el.id = id;
    el.setAttribute("aria-hidden", "true");
    document.body.insertBefore(el, document.body.firstChild);
    return el;
  }
  addLayer("div", "vignette");
  addLayer("div", "nebula");
  var canvas = addLayer("canvas", "", "space");

  /* ---------- Gwiazdy ---------- */
  (function starfield() {
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var W, H, DPR, stars = [], shooters = [];
    var mx = 0, my = 0, px = 0, py = 0;
    var COLORS = ["#ffffff", "#ffe9d6", "#d6e4ff", "#ffd1a8", "#c9b8ff"];
    var running = true, nextShot = 2000, last = 0;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      var count = Math.min(420, Math.round((W * H) / 4200));
      stars = [];
      for (var i = 0; i < count; i++) {
        var z = Math.random();              // 0 = daleko, 1 = blisko
        stars.push({
          x: Math.random() * W, y: Math.random() * H, z: z,
          r: 0.25 + z * z * 1.6,
          a: 0.35 + Math.random() * 0.65,
          tw: Math.random() * Math.PI * 2,
          ts: 0.5 + Math.random() * 2,
          c: COLORS[(Math.random() * COLORS.length) | 0],
        });
      }
      if (reduce) draw(0, 0);
    }

    function draw(t, dt) {
      ctx.clearRect(0, 0, W, H);
      px += (mx - px) * 0.04; py += (my - py) * 0.04;
      var scrollY = window.scrollY || 0;
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        if (!reduce) {
          s.x -= dt * 0.004 * (0.2 + s.z);       // powolny dryf
          if (s.x < -5) s.x = W + 5;
        }
        var ox = px * s.z * 26, oy = py * s.z * 26 - (scrollY * s.z * 0.08) % H;
        var x = (s.x + ox + W) % W, y = (s.y + oy + H) % H;
        var tw = reduce ? 1 : 0.65 + 0.35 * Math.sin(t * 0.001 * s.ts + s.tw);
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = s.c;
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.283); ctx.fill();
        if (s.r > 1.35) {                        // poświata najbliższych gwiazd
          ctx.globalAlpha = s.a * tw * 0.15;
          ctx.beginPath(); ctx.arc(x, y, s.r * 4, 0, 6.283); ctx.fill();
        }
      }
      // spadające gwiazdy
      for (var j = shooters.length - 1; j >= 0; j--) {
        var m = shooters[j];
        m.life += dt;
        var k = m.life / m.dur;
        if (k >= 1) { shooters.splice(j, 1); continue; }
        var hx = m.x + m.vx * m.life, hy = m.y + m.vy * m.life;
        var g = ctx.createLinearGradient(hx, hy, hx - m.vx * 180, hy - m.vy * 180);
        var alpha = Math.sin(k * Math.PI);
        g.addColorStop(0, "rgba(255,240,220," + alpha + ")");
        g.addColorStop(1, "rgba(255,122,47,0)");
        ctx.globalAlpha = 1;
        ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx - m.vx * 180, hy - m.vy * 180); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function shoot() {
      var ang = (20 + Math.random() * 25) * Math.PI / 180;
      var speed = 0.9 + Math.random() * 0.7;
      shooters.push({
        x: Math.random() * W * 0.8, y: Math.random() * H * 0.4,
        vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed,
        life: 0, dur: 700 + Math.random() * 500,
      });
    }

    function frame(t) {
      if (!running) return;
      var dt = last ? Math.min(t - last, 50) : 16;
      last = t;
      nextShot -= dt;
      if (nextShot <= 0) { shoot(); nextShot = 3500 + Math.random() * 6000; }
      draw(t, dt);
      requestAnimationFrame(frame);
    }

    window.addEventListener("resize", resize);
    if (finePointer) {
      window.addEventListener("mousemove", function (e) {
        mx = e.clientX / W - 0.5; my = e.clientY / H - 0.5;
      }, { passive: true });
    }
    document.addEventListener("visibilitychange", function () {
      if (reduce) return;
      running = !document.hidden;
      if (running) { last = 0; requestAnimationFrame(frame); }
    });

    resize();
    if (!reduce) requestAnimationFrame(frame);
  })();

  /* ---------- Ekran ładowania (raz na sesję) ---------- */
  (function boot() {
    if (reduce || !document.body.hasAttribute("data-boot")) return;
    var seen = false;
    try { seen = sessionStorage.getItem("vc-boot") === "1"; } catch (e) {}
    if (seen) return;
    try { sessionStorage.setItem("vc-boot", "1"); } catch (e) {}
    var root = document.body.getAttribute("data-root") || "./";
    var el = document.createElement("div");
    el.id = "boot";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = '<div><img src="' + root + 'assets/img/logo.svg" alt="">' +
      '<div class="boot__label">Ładowanie świata</div><div class="boot__bar"><span></span></div></div>';
    document.body.appendChild(el);
    function done() { el.classList.add("done"); setTimeout(function () { el.remove(); }, 700); }
    setTimeout(done, 1300);
    el.addEventListener("click", done);
  })();

  /* ---------- Terminal ---------- */
  window.runTerminal = function (el, lines) {
    if (!el) return;
    if (reduce) {
      el.innerHTML = lines.map(function (l) { return '<div class="terminal__line">' + l.html + "</div>"; }).join("");
      return;
    }
    var delay = document.getElementById("boot") ? 1500 : 300;
    var cursor = '<span class="terminal__cursor"></span>';
    var i = 0;
    function next() {
      if (i >= lines.length) { el.lastChild && el.lastChild.insertAdjacentHTML("beforeend", " " + cursor); return; }
      var l = lines[i++];
      var row = document.createElement("div");
      row.className = "terminal__line";
      el.appendChild(row);
      if (l.type) {                    // wpisywanie znak po znaku
        var n = 0, text = l.type;
        (function typeChar() {
          row.innerHTML = '<span class="p">❯</span><span class="hl">' + text.slice(0, n) + "</span>" + cursor;
          if (n++ < text.length) setTimeout(typeChar, 28 + Math.random() * 40);
          else { row.innerHTML = '<span class="p">❯</span><span class="hl">' + text + "</span>"; setTimeout(next, 350); }
        })();
      } else {
        row.innerHTML = l.html;
        setTimeout(next, l.wait || 260);
      }
    }
    setTimeout(next, delay);
  };

  /* ---------- Pojawianie się przy przewijaniu ---------- */
  window.revealAll = function () {
    var els = document.querySelectorAll("[data-reveal]:not(.in)");
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (e) { io.observe(e); });
  };

  /* ---------- Przechylanie kart 3D ---------- */
  window.tiltCards = function () {
    if (reduce || !finePointer) return;
    document.querySelectorAll("a.card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--ry", (x * 12).toFixed(2) + "deg");
        card.style.setProperty("--rx", (-y * 12).toFixed(2) + "deg");
      });
      card.addEventListener("mouseleave", function () {
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--rx", "0deg");
      });
    });
  };
})();
