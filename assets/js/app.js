/* ============================================================
   Mahakam Moonlight Studio v3 - app.js
   Tema (View Transitions + fallback), scene 3D bulan + bintang
   berkelip + shooting star, reveal, tilt, lightbox, counter,
   copy email. Canvas 2D murni, tanpa dependensi.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Tema terang/gelap dengan transisi halus ---------- */
  var root = document.documentElement;
  var KEY = "theme";

  function apply(theme) {
    root.setAttribute("data-bs-theme", theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0a0a12" : "#f6f5fb");
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: theme } }));
  }

  function setTheme(theme) {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && document.startViewTransition) {
      document.startViewTransition(function () { apply(theme); });
    } else {
      root.classList.add("theme-anim");
      apply(theme);
      setTimeout(function () { root.classList.remove("theme-anim"); }, 600);
    }
  }

  function init() {
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    var q = new URLSearchParams(location.search).get("theme");
    var sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    apply(q === "dark" || q === "light" ? q : (saved || sys));
  }
  init();

  window.__toggleTheme = function () {
    setTheme(root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark");
  };

  /* ---------- Scroll progress + back to top ---------- */
  var bar = document.getElementById("progress");
  var toTop = document.getElementById("toTop");
  window.addEventListener("scroll", function () {
    var h = document.documentElement;
    var p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    if (bar) bar.style.width = (p * 100).toFixed(2) + "%";
    if (toTop) toTop.classList.toggle("show", h.scrollTop > 480);
  }, { passive: true });
  if (toTop) toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------- Counter angka ---------- */
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      cio.unobserve(en.target);
      var el = en.target, end = parseInt(el.dataset.count, 10) || 0, t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var k = Math.min((ts - t0) / 1200, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + (el.dataset.suffix || "");
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach(function (el) { cio.observe(el); });

  /* ---------- Tilt halus pada kartu ---------- */
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      var r = null;
      card.addEventListener("mousemove", function (e) {
        if (r) return;
        r = requestAnimationFrame(function () {
          r = null;
          var b = card.getBoundingClientRect();
          var x = (e.clientX - b.left) / b.width - 0.5;
          var y = (e.clientY - b.top) / b.height - 0.5;
          card.style.transform = "perspective(900px) rotateX(" + (-y * 6).toFixed(2) +
            "deg) rotateY(" + (x * 6).toFixed(2) + "deg) translateY(-4px)";
        });
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---------- Lightbox screenshot ---------- */
  var lb = document.getElementById("lightbox");
  if (lb) {
    var lbImg = lb.querySelector("img");
    document.querySelectorAll(".shot-frame img").forEach(function (img) {
      img.addEventListener("click", function () {
        lbImg.src = img.src; lbImg.alt = img.alt;
        lb.classList.add("open");
      });
    });
    lb.addEventListener("click", function () { lb.classList.remove("open"); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") lb.classList.remove("open");
    });
  }

  /* ---------- Salin email ---------- */
  var copyBtn = document.getElementById("copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = "mahakammoonlightstudio@gmail.com";
      var done = function () {
        var t = copyBtn.querySelector(".copy-label");
        var old = t.textContent;
        t.textContent = "Tersalin!";
        setTimeout(function () { t.textContent = old; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = email; document.body.appendChild(ta);
        ta.select(); document.execCommand("copy"); ta.remove(); done();
      }
    });
  }

  /* ---------- Tahun footer ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ============================================================
     Scene 3D: bulan wireframe + bintang berkelip + shooting star
     (canvas 2D murni, proyeksi perspektif, parallax mouse)
     ============================================================ */
  var canvas = document.getElementById("hero3d");
  if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ctx = canvas.getContext("2d");
    var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var mx = 0, my = 0, tmx = 0, tmy = 0;

    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", function (e) {
      tmx = (e.clientX / window.innerWidth - 0.5) * 2;
      tmy = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // Bola: latitude/longitude rings (wireframe sphere = "bulan")
    var LAT = 7, LON = 12, R = 130;
    var rings = []; // tiap ring: array titik [x,y,z]
    for (var la = 1; la < LAT; la++) {
      var phi = (la / LAT) * Math.PI;
      var rr = R * Math.sin(phi), yy = R * Math.cos(phi);
      var ring = [];
      for (var lo = 0; lo < LON; lo++) {
        var th = (lo / LON) * Math.PI * 2;
        ring.push([rr * Math.cos(th), yy, rr * Math.sin(th)]);
      }
      rings.push(ring);
    }
    // Meridian rings
    for (var m = 0; m < LON / 2; m++) {
      var th2 = (m / (LON / 2)) * Math.PI;
      var ring2 = [];
      for (var la2 = 0; la2 <= LAT * 2; la2++) {
        var phi2 = (la2 / (LAT * 2)) * Math.PI;
        ring2.push([R * Math.sin(phi2) * Math.cos(th2), R * Math.cos(phi2), R * Math.sin(phi2) * Math.sin(th2)]);
      }
      rings.push(ring2);
    }
    // Kawah (titik) di permukaan
    var craters = [];
    for (var c = 0; c < 26; c++) {
      var u = Math.random() * 2 - 1, a = Math.random() * Math.PI * 2;
      var rr3 = R * Math.sqrt(1 - u * u);
      craters.push([rr3 * Math.cos(a), R * u, rr3 * Math.sin(a), 1.5 + Math.random() * 2.5]);
    }

    // Bintang latar
    var STARS = [];
    for (var i = 0; i < 140; i++) {
      STARS.push({ x: Math.random(), y: Math.random(), z: 0.25 + Math.random() * 0.75, r: 0.5 + Math.random() * 1.5, tw: Math.random() * 6.28 });
    }
    // Shooting star
    var shots = [];
    function spawnShot() {
      if (document.hidden || shots.length > 1) return;
      shots.push({ x: Math.random() * 0.7, y: Math.random() * 0.3, vx: 0.0035 + Math.random() * 0.002, vy: 0.0016 + Math.random() * 0.001, life: 1 });
    }
    setInterval(spawnShot, 3600);

    function css(n) { return getComputedStyle(root).getPropertyValue(n).trim(); }

    function frame(ts) {
      mx += (tmx - mx) * 0.04;
      my += (tmy - my) * 0.04;
      var accent = css("--accent") || "#a5b4fc";
      var dim = css("--ink-2") || "#9b98a8";
      var dark = root.getAttribute("data-bs-theme") === "dark";
      ctx.clearRect(0, 0, W, H);

      // Bintang berkelip
      STARS.forEach(function (s) {
        var tw = 0.35 + 0.65 * Math.abs(Math.sin(ts * 0.0012 + s.tw));
        ctx.globalAlpha = (dark ? 0.75 : 0.45) * tw * s.z;
        ctx.fillStyle = dark ? "#e0e7ff" : "#6366a5";
        ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r * s.z, 0, 6.283); ctx.fill();
      });

      // Shooting star
      for (var si = shots.length - 1; si >= 0; si--) {
        var sh = shots[si];
        sh.x += sh.vx; sh.y += sh.vy; sh.life -= 0.012;
        if (sh.life <= 0 || sh.x > 1.1) { shots.splice(si, 1); continue; }
        var grad = ctx.createLinearGradient(sh.x * W, sh.y * H, sh.x * W - 90, sh.y * H - 40);
        grad.addColorStop(0, "rgba(" + (dark ? "224,231,255" : "124,108,240") + "," + (0.85 * sh.life).toFixed(3) + ")");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.strokeStyle = grad; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(sh.x * W, sh.y * H); ctx.lineTo(sh.x * W - 90, sh.y * H - 40); ctx.stroke();
      }

      // Bulan 3D
      var cx = W * (W > 768 ? 0.72 : 0.5), cy = H * 0.44;
      var rotY = ts * 0.00016 + mx * 0.5, rotX = -0.32 + my * 0.25;
      var sy = Math.sin(rotY), cyw = Math.cos(rotY), sx = Math.sin(rotX), cxw = Math.cos(rotX);
      var fov = 640;

      function proj(v) {
        var x = v[0] * cyw - v[2] * sy;
        var z = v[0] * sy + v[2] * cyw;
        var y = v[1] * cxw - z * sx;
        z = v[1] * sx + z * cxw;
        var k = fov / (fov + z);
        return { x: cx + x * k, y: cy + y * k, k: k, z: z };
      }

      rings.forEach(function (ring) {
        ctx.strokeStyle = accent;
        ctx.beginPath();
        var started = false;
        ring.forEach(function (v) {
          var p = proj(v);
          if (p.z > R * 0.55) { started = false; return; } // sisi belakang: skip segmen
          if (!started) { ctx.moveTo(p.x, p.y); started = true; }
          else ctx.lineTo(p.x, p.y);
        });
        ctx.globalAlpha = dark ? 0.34 : 0.3;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      craters.forEach(function (v) {
        var p = proj(v);
        if (p.z > R * 0.4) return;
        ctx.globalAlpha = dark ? 0.5 : 0.4;
        ctx.fillStyle = accent;
        ctx.beginPath(); ctx.arc(p.x, p.y, v[3] * p.k, 0, 6.283); ctx.fill();
      });

      // Glow lembut di sekeliling bulan
      var g = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.5);
      g.addColorStop(0, dark ? "rgba(165,180,252,0.10)" : "rgba(124,108,240,0.08)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.5, 0, 6.283); ctx.fill();

      ctx.globalAlpha = 1;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
