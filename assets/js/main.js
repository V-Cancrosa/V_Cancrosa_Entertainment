/*
 * Wspólny skrypt strony: menu, karty serwisów, osadzenia.
 * Ścieżka do katalogu głównego brana jest z <body data-root="...">.
 */
(function () {
  "use strict";

  var site = window.SITE || { platforms: [] };
  var body = document.body;
  var root = body.getAttribute("data-root") || "./";
  var current = body.getAttribute("data-platform") || "";

  var ICONS = {
    youtube:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg>',
    twitch:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.3 1 3 4.4v14h4.8V21h2.7l2.6-2.6H17l5-5V1H4.3zm15.9 11.5-3 3h-4.8l-2.6 2.6v-2.6H5.9V2.8h14.3v9.7zM17.2 6.4v5.2h-1.8V6.4h1.8zm-4.8 0v5.2h-1.8V6.4h1.8z"/></svg>',
    _default:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
  };

  function icon(id) {
    return ICONS[id] || ICONS._default;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function active() {
    return site.platforms.filter(function (p) {
      return p.status === "active";
    });
  }

  function find(id) {
    for (var i = 0; i < site.platforms.length; i++) {
      if (site.platforms[i].id === id) return site.platforms[i];
    }
    return null;
  }

  /* ---------- Menu ---------- */
  function renderNav() {
    var nav = document.getElementById("site-nav");
    if (!nav) return;
    var html = '<a href="' + root + '"' + (current ? "" : ' aria-current="page"') + ">Start</a>";
    active().forEach(function (p) {
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
    var grid = document.getElementById("platform-grid");
    if (!grid) return;
    grid.innerHTML = site.platforms
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
  }

  /* ---------- Podstrona serwisu ---------- */
  function renderPlatformPage() {
    var p = find(current);
    if (!p) return;
    document.documentElement.style.setProperty("--accent", p.color);

    document.querySelectorAll("[data-platform-link]").forEach(function (a) {
      if (p.url) a.href = p.url;
    });
    document.querySelectorAll("[data-platform-icon]").forEach(function (el) {
      el.innerHTML = icon(p.id);
    });

    var embed = document.getElementById("embed");
    if (!embed) return;

    if (p.id === "youtube" && p.channelId) {
      // Playlista "uploads" kanału = ID kanału z "UC" zamienionym na "UU"
      var list = "UU" + p.channelId.replace(/^UC/, "");
      embed.innerHTML =
        '<iframe src="https://www.youtube-nocookie.com/embed/videoseries?list=' +
        encodeURIComponent(list) +
        '" title="Najnowsze filmy" loading="lazy" allowfullscreen ' +
        'allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"></iframe>';
      embed.classList.add("embed--ready");
    } else if (p.id === "twitch" && p.channel) {
      // Twitch wymaga parametru parent = domena, na której stoi strona
      var host = location.hostname || "localhost";
      embed.innerHTML =
        '<iframe src="https://player.twitch.tv/?channel=' +
        encodeURIComponent(p.channel) +
        "&parent=" + encodeURIComponent(host) +
        '&muted=true" title="Stream na Twitchu" loading="lazy" allowfullscreen></iframe>';
      embed.classList.add("embed--ready");
    }
  }

  function renderFooter() {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
    var socials = document.getElementById("footer-links");
    if (socials) {
      socials.innerHTML = active()
        .filter(function (p) { return p.url; })
        .map(function (p) {
          return '<a href="' + esc(p.url) + '" target="_blank" rel="noopener" aria-label="' +
            esc(p.name) + '" style="--accent:' + esc(p.color) + '">' + icon(p.id) + "</a>";
        })
        .join("");
    }
  }

  renderNav();
  renderCards();
  renderPlatformPage();
  renderFooter();
})();
