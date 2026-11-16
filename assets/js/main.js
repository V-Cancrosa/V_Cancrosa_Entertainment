/*
 * Wspólny skrypt strony: menu, karty serwisów, osadzenia.
 * Ścieżka do katalogu głównego brana jest z <body data-root="...">.
 */
(function () {
  "use strict";

  var site = window.SITE || { platforms: [] };
  var PATHS = window.ICON_PATHS || {};
  var body = document.body;
  var root = body.getAttribute("data-root") || "./";
  var current = body.getAttribute("data-platform") || "";
  var LANG = document.documentElement.lang === "en" ? "en" : "pl";
  var home = root + (LANG === "en" ? "en/" : "");   // strona główna w danym języku

  /* ---------- Teksty interfejsu (PL / EN) ---------- */
  var T = {
    pl: {
      start: "Start", enter: "Wejdź", soon: "Wkrótce", credits: "Napisy końcowe",
      videos: "Najnowsze filmy", stream: "Stream na Twitchu", seePost: "Zobacz post",
      consent: function (n) { return "Podgląd ładuje treści z serwisu " + n + ", który może zapisywać ciasteczka."; },
      load: "Wczytaj podgląd", loadFail: "Nie udało się wczytać podglądu.",
      bskyEmpty: "Na razie pusto — pierwsze posty już wkrótce.",
      bskyFail: "Nie udało się wczytać postów.", bskyProfile: "Zobacz profil na Bluesky →",
      locale: "pl-PL",
      term: ["uruchom norka --tryb=kosmos", "rdzeń systemu online", "sygnał:", "» Witaj, podróżniku. Wybierz kanał."],
    },
    en: {
      start: "Home", enter: "Enter", soon: "Coming soon", credits: "Credits",
      videos: "Latest videos", stream: "Twitch stream", seePost: "View post",
      consent: function (n) { return "This preview loads content from " + n + ", which may set cookies."; },
      load: "Load preview", loadFail: "Couldn't load the preview.",
      bskyEmpty: "Nothing here yet — first posts coming soon.",
      bskyFail: "Couldn't load the posts.", bskyProfile: "See the profile on Bluesky →",
      locale: "en-GB",
      term: ["launch den --mode=cosmos", "core system online", "signal:", "» Welcome, traveller. Choose your channel."],
    },
  }[LANG];

  // tekst z configu: zwykły napis albo { pl: "...", en: "..." }
  function tr(v) {
    return v && typeof v === "object" ? (v[LANG] || v.pl || "") : v;
  }

  /* ---------- Pomocnicze ---------- */
  function icon(id) {
    var d = PATHS[id] ||
      "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z";
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="' + d + '"/></svg>';
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function hasPage(p) {
    return p.status === "active" && p.group !== "links";
  }

  function find(id) {
    for (var i = 0; i < site.platforms.length; i++) {
      if (site.platforms[i].id === id) return site.platforms[i];
    }
    return null;
  }

  function loadScript(src) {
    return new Promise(function (ok, fail) {
      var s = document.createElement("script");
      s.src = src; s.async = true; s.onload = ok; s.onerror = fail;
      document.body.appendChild(s);
    });
  }

  /* ---------- Menu ---------- */
  function renderNav() {
    var nav = document.getElementById("site-nav");
    if (!nav) return;
    var html = '<a href="' + home + '"' + (current ? "" : ' aria-current="page"') + ">" + T.start + "</a>";
    site.platforms.filter(hasPage).forEach(function (p) {
      html +=
        '<a href="' + home + p.id + '/"' +
        (p.id === current ? ' aria-current="page"' : "") +
        ' style="--accent:' + esc(p.color) + '">' + esc(p.name) + "</a>";
    });
    nav.innerHTML = html;

    var toggle = document.getElementById("nav-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
  }

  /* ---------- Karty na stronie głównej ---------- */
  function renderCards() {
    document.querySelectorAll("[data-platform-grid]").forEach(function (grid) {
      var group = grid.getAttribute("data-platform-grid");
      grid.innerHTML = site.platforms
        .filter(function (p) { return p.group === group; })
        .map(function (p, i) {
          var soon = p.status !== "active";
          var tag = soon ? "div" : "a";
          var href = soon ? "" : ' href="' + home + p.id + '/"';
          return (
            "<" + tag + href + ' class="card' + (soon ? " card--soon" : "") +
            '" data-reveal style="--accent:' + esc(p.color) + ";--d:" + (i * 0.12) + 's">' +
            '<span class="card__index">0' + (i + 1) + "</span>" +
            '<span class="card__icon">' + icon(p.id) + "</span>" +
            '<span class="card__name">' + esc(p.name) + "</span>" +
            '<span class="card__text">' + esc(tr(p.short)) + "</span>" +
            '<span class="card__cta">' + (soon ? T.soon : T.enter) + "</span>" +
            "</" + tag + ">"
          );
        })
        .join("");
    });

    var links = document.getElementById("link-row");
    if (links) {
      links.innerHTML = site.platforms
        .filter(function (p) { return p.group === "links" && p.url; })
        .map(function (p, i) {
          return '<a class="pill" data-reveal href="' + esc(p.url) + '" target="_blank" rel="noopener" style="--accent:' +
            esc(p.color) + ";--d:" + (i * 0.07) + 's">' + icon(p.id) + "<span>" + esc(p.name) + "</span></a>";
        })
        .join("");
    }
  }

  /* ---------- Podstrona serwisu ---------- */
  function renderPlatformPage() {
    var p = find(current);
    if (!p) return;
    document.documentElement.style.setProperty("--accent", p.color);
    if (p.ink) document.documentElement.style.setProperty("--on-accent", p.ink);

    document.querySelectorAll("[data-platform-link]").forEach(function (a) {
      if (p.url) a.href = p.url;
    });
    document.querySelectorAll("[data-platform-icon]").forEach(function (el) {
      el.innerHTML = icon(p.id);
    });
    document.querySelectorAll("[data-platform-handle]").forEach(function (el) {
      if (p.handle) el.textContent = "@" + p.handle;
    });

    var embed = document.getElementById("embed");
    if (embed && EMBEDS[p.id]) EMBEDS[p.id](p, embed);
  }

  /* Osadzenia per serwis */
  var EMBEDS = {
    youtube: function (p, el) {
      if (!p.channelId) return;
      // Playlista "uploads" kanału = ID kanału z "UC" zamienionym na "UU"
      var list = "UU" + p.channelId.replace(/^UC/, "");
      el.innerHTML =
        '<iframe src="https://www.youtube-nocookie.com/embed/videoseries?list=' +
        encodeURIComponent(list) +
        '" title="' + T.videos + '" loading="lazy" allowfullscreen ' +
        'allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"></iframe>';
      el.classList.add("embed--ready");
    },

    twitch: function (p, el) {
      if (!p.channel) return;
      // Twitch wymaga parametru parent = domena, na której stoi strona
      var host = location.hostname || "localhost";
      el.innerHTML =
        '<iframe src="https://player.twitch.tv/?channel=' + encodeURIComponent(p.channel) +
        "&parent=" + encodeURIComponent(host) +
        '&muted=true" title="' + T.stream + '" loading="lazy" allowfullscreen></iframe>';
      el.classList.add("embed--ready");
    },

    // TikTok i Instagram ładują skrypty firm trzecich (z ciasteczkami),
    // więc podgląd wczytuje się dopiero po kliknięciu.
    tiktok: function (p, el) {
      clickToLoad(el, "TikTok", function () {
        el.className = "feed-embed";
        el.innerHTML =
          '<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@' + esc(p.handle) +
          '" data-unique-id="' + esc(p.handle) + '" data-embed-type="creator" ' +
          'style="max-width:780px;min-width:288px;margin:0 auto">' +
          '<section><a target="_blank" rel="noopener" href="' + esc(p.url) + '">@' + esc(p.handle) +
          "</a></section></blockquote>";
        return loadScript("https://www.tiktok.com/embed.js");
      });
    },

    instagram: function (p, el) {
      if (!p.posts || !p.posts.length) return;
      clickToLoad(el, "Instagram", function () {
        el.className = "ig-grid";
        el.innerHTML = p.posts.map(function (u) {
          return '<blockquote class="instagram-media" data-instgrm-permalink="' + esc(u) +
            '" data-instgrm-version="14"><a href="' + esc(u) + '" target="_blank" rel="noopener">' + T.seePost + '</a></blockquote>';
        }).join("");
        return loadScript("https://www.instagram.com/embed.js").then(function () {
          if (window.instgrm) window.instgrm.Embeds.process();
        });
      });
    },

    bluesky: function (p, el) {
      if (!p.handle) return;
      var api = "https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?filter=posts_no_replies&limit=9&actor=" +
        encodeURIComponent(p.handle);
      fetch(api)
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (data) {
          var items = (data.feed || []).filter(function (f) { return !f.reason; }).slice(0, 6);
          if (!items.length) { el.innerHTML = "<p>" + T.bskyEmpty + "</p>"; return; }
          el.className = "posts";
          el.innerHTML = items.map(function (f) { return bskyPost(f.post); }).join("");
        })
        .catch(function () {
          el.innerHTML = '<p>' + T.bskyFail + ' <a href="' + esc(p.url) +
            '" target="_blank" rel="noopener">' + T.bskyProfile + '</a></p>';
        });
    },
  };

  function bskyPost(post) {
    var rec = post.record || {};
    var rkey = String(post.uri || "").split("/").pop();
    var link = "https://bsky.app/profile/" + encodeURIComponent(post.author.handle) + "/post/" + encodeURIComponent(rkey);
    var date = rec.createdAt ? new Date(rec.createdAt).toLocaleDateString(T.locale, { day: "numeric", month: "long", year: "numeric" }) : "";
    var imgs = "";
    var e = post.embed || {};
    var images = e.images || (e.media && e.media.images) || [];
    if (images.length) {
      imgs = '<div class="post__media post__media--' + Math.min(images.length, 4) + '">' +
        images.slice(0, 4).map(function (i) {
          return '<img src="' + esc(i.thumb) + '" alt="' + esc(i.alt || "") + '" loading="lazy">';
        }).join("") + "</div>";
    } else if (e.external && e.external.thumb) {
      imgs = '<div class="post__media post__media--1"><img src="' + esc(e.external.thumb) + '" alt="" loading="lazy"></div>';
    }
    return '<a class="post" href="' + link + '" target="_blank" rel="noopener">' +
      imgs +
      (rec.text ? '<p class="post__text">' + esc(rec.text) + "</p>" : "") +
      '<span class="post__meta"><span>' + esc(date) + "</span><span>♥ " + (post.likeCount || 0) +
      "  ↻ " + (post.repostCount || 0) + "</span></span></a>";
  }

  function clickToLoad(el, name, load) {
    el.innerHTML =
      '<div class="consent"><p>' + esc(T.consent(name)) + "</p>" +
      '<button class="btn" type="button">' + T.load + "</button></div>";
    el.querySelector("button").addEventListener("click", function () {
      load().catch(function () {
        el.innerHTML = "<p>Nie udało się wczytać podglądu.</p>";
      });
    });
  }

  function renderFooter() {
    var y = document.getElementById("year");
    if (y) {
      y.textContent = new Date().getFullYear();
      if (!document.querySelector(".credits-link")) {
        y.parentNode.insertAdjacentHTML("beforeend", '<a class="credits-link" href="' + home + 'credits/">' + T.credits + '</a>');
      }
    }
    var socials = document.getElementById("footer-links");
    if (socials) {
      socials.innerHTML = site.platforms
        .filter(function (p) { return p.status === "active" && p.url; })
        .map(function (p) {
          return '<a href="' + esc(p.url) + '" target="_blank" rel="noopener" aria-label="' +
            esc(p.name) + '" title="' + esc(p.name) + '" style="--accent:' + esc(p.color) + '">' + icon(p.id) + "</a>";
        })
        .join("");
    }
  }

  /* ---------- Terminal na ekranie tytułowym ---------- */
  function renderTerminal() {
    var el = document.getElementById("terminal");
    if (!el || !window.runTerminal) return;
    var lines = [{ type: T.term[0] }, { html: '<span class="ok">✓</span> ' + T.term[1], wait: 300 }];
    site.platforms.filter(hasPage).forEach(function (p) {
      lines.push({
        html: '<span class="ok">✓</span> ' + T.term[2] + ' <span style="color:' + esc(p.color) + '">' + esc(p.name) + "</span>",
        wait: 170,
      });
    });
    lines.push({ html: '<span class="hl">' + T.term[3] + "</span>", wait: 200 });
    window.runTerminal(el, lines);
  }

  renderNav();
  renderCards();
  renderPlatformPage();
  renderFooter();
  renderTerminal();
  // na podstronach animuj panele automatycznie
  document.querySelectorAll(".section h2, .section .lead, .info article, .embed, .table-scroll, details")
    .forEach(function (el, i) {
      if (el.closest("[data-reveal]") || el.hasAttribute("data-reveal")) return;
      el.setAttribute("data-reveal", "");
      if (el.matches(".info article")) {
        var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
        el.style.setProperty("--d", (idx * 0.1) + "s");
      }
    });
  if (window.revealAll) window.revealAll();
  if (window.tiltCards) window.tiltCards();
})();
