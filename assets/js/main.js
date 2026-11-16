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
    var html = '<a href="' + root + '"' + (current ? "" : ' aria-current="page"') + ">Start</a>";
    site.platforms.filter(hasPage).forEach(function (p) {
      html +=
        '<a href="' + root + p.id + '/"' +
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
        .map(function (p) {
          var soon = p.status !== "active";
          var tag = soon ? "div" : "a";
          var href = soon ? "" : ' href="' + root + p.id + '/"';
          return (
            "<" + tag + href + ' class="card' + (soon ? " card--soon" : "") +
            '" style="--accent:' + esc(p.color) + '">' +
            '<span class="card__icon">' + icon(p.id) + "</span>" +
            '<span class="card__name">' + esc(p.name) + "</span>" +
            '<span class="card__text">' + esc(p.short) + "</span>" +
            '<span class="card__cta">' + (soon ? "Wkrótce" : "Zobacz co i jak →") + "</span>" +
            "</" + tag + ">"
          );
        })
        .join("");
    });

    var links = document.getElementById("link-row");
    if (links) {
      links.innerHTML = site.platforms
        .filter(function (p) { return p.group === "links" && p.url; })
        .map(function (p) {
          return '<a class="pill" href="' + esc(p.url) + '" target="_blank" rel="noopener" style="--accent:' +
            esc(p.color) + '">' + icon(p.id) + "<span>" + esc(p.name) + "</span></a>";
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
        '" title="Najnowsze filmy" loading="lazy" allowfullscreen ' +
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
        '&muted=true" title="Stream na Twitchu" loading="lazy" allowfullscreen></iframe>';
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
            '" data-instgrm-version="14"><a href="' + esc(u) + '" target="_blank" rel="noopener">Zobacz post</a></blockquote>';
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
          if (!items.length) { el.innerHTML = "<p>Na razie pusto — pierwsze posty już wkrótce.</p>"; return; }
          el.className = "posts";
          el.innerHTML = items.map(function (f) { return bskyPost(f.post); }).join("");
        })
        .catch(function () {
          el.innerHTML = '<p>Nie udało się wczytać postów. <a href="' + esc(p.url) +
            '" target="_blank" rel="noopener">Zobacz profil na Bluesky →</a></p>';
        });
    },
  };

  function bskyPost(post) {
    var rec = post.record || {};
    var rkey = String(post.uri || "").split("/").pop();
    var link = "https://bsky.app/profile/" + encodeURIComponent(post.author.handle) + "/post/" + encodeURIComponent(rkey);
    var date = rec.createdAt ? new Date(rec.createdAt).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" }) : "";
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
      '<div class="consent"><p>Podgląd ładuje treści z serwisu ' + esc(name) +
      ", który może zapisywać ciasteczka.</p>" +
      '<button class="btn" type="button">Wczytaj podgląd</button></div>';
    el.querySelector("button").addEventListener("click", function () {
      load().catch(function () {
        el.innerHTML = "<p>Nie udało się wczytać podglądu.</p>";
      });
    });
  }

  function renderFooter() {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
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

  renderNav();
  renderCards();
  renderPlatformPage();
  renderFooter();
})();
