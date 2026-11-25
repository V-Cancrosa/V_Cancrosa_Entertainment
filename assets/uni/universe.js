/* ==========================================================================
   Wspólny pas „V Cancrosa” — jeden dla wszystkich stron uniwersum.
   ŹRÓDŁO: repo V_Cancrosa-One-and-Fursonas, folder uni/.
   Kopie: V_Cancrosa_Entertainment/assets/uni/, V_Cancrosa-YouTube-Create/site/uni/.
   Zmieniaj tutaj i kopiuj cały folder uni/ (bez zmian) do pozostałych repo.

   Użycie na stronie (w <head>):
     <link rel="stylesheet" href="uni/universe.css">
     <script src="uni/universe.js" data-site="fursony" defer></script>
   data-site: "fursony" | "entertainment" | "studio" — zaznacza bieżącą stronę.

   Ukryte przejście do studia (tylko dla właściciela): pięć szybkich kliknięć w znak
   albo wpisanie na klawiaturze słowa „studio”. Samo studio stoi na Cloudflare
   (Worker „studio”) za Cloudflare Access — wpuszcza tylko właściciela, kodem z e-maila.

   Licznik odwiedzin: Cloudflare Web Analytics (bez ciasteczek, bez danych osobowych).
   Ładuje się tylko na v-cancrosa.github.io i nigdy w studiu.
   ========================================================================== */
(() => {
  const me = document.currentScript;
  const site = (me && me.dataset.site) || "";
  const HOME = "v-cancrosa.github.io";
  // Na v-cancrosa.github.io wystarczą ścieżki od korzenia; gdzie indziej (dysk, podgląd, inna domena) — pełne adresy.
  const BASE = location.hostname === HOME ? "" : "https://" + HOME;
  const PATH = {
    fursony: "/V_Cancrosa-One-and-Fursonas/",
    entertainment: "/V_Cancrosa_Entertainment/",
  };
  // Studio jest osobno, za zamkiem — zawsze pełny adres
  const STUDIO = "https://studio.vulpescancrosa.workers.dev/";
  const T = {
    pl: { fursony: "Postacie", entertainment: "Kanały", studio: "Studio", home: "The One Above Them — postacie", mark: "Znak: jeden ponad nimi" },
    en: { fursony: "Characters", entertainment: "Channels", studio: "Studio", home: "The One Above Them — characters", mark: "Mark: the one above them" },
  };
  const KEY = "uni-studio";
  const store = {
    get() { try { return sessionStorage.getItem(KEY); } catch (e) { return null; } },
    set() { try { sessionStorage.setItem(KEY, "1"); } catch (e) {} },
  };
  const root = document.documentElement;
  const lang = () => (/^en/i.test(root.dataset.lang || root.lang) ? "en" : "pl");

  const bar = document.createElement("nav");
  bar.className = "uni";
  bar.innerHTML =
    '<button type="button" class="uni-mark"><svg viewBox="0 0 32 32" aria-hidden="true"><circle class="dot" cx="16" cy="8" r="3"/><path d="M8 19v8M16 17v10M24 19v8" stroke-width="2.4" stroke-linecap="round" fill="none"/></svg></button>' +
    '<a class="uni-home"><span>V Cancrosa</span></a>' +
    '<div class="uni-links"><a data-to="fursony"></a><a data-to="entertainment"></a><a data-to="studio" class="uni-studio" hidden></a></div>';
  const mark = bar.querySelector(".uni-mark");
  const home = bar.querySelector(".uni-home");
  const studio = bar.querySelector(".uni-studio");

  function render() {
    const l = lang(), t = T[l];
    bar.setAttribute("aria-label", "V Cancrosa");
    mark.setAttribute("aria-label", t.mark);
    home.href = BASE + PATH.fursony;
    home.setAttribute("aria-label", t.home);
    bar.querySelectorAll("[data-to]").forEach(a => {
      const to = a.dataset.to;
      a.textContent = t[to];
      a.href = to === "studio" ? STUDIO : BASE + PATH[to] + (to === "entertainment" && l === "en" ? "en/" : "");
      if (to === site) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }

  function reveal(fromUser) {
    studio.hidden = false;
    bar.classList.add("open");
    store.set();
    if (fromUser) studio.focus({ preventScroll: true });
  }

  // Pięć szybkich kliknięć w znak
  let taps = [];
  mark.addEventListener("click", () => {
    mark.classList.remove("tap"); void mark.offsetWidth; mark.classList.add("tap");
    const now = Date.now();
    taps = taps.filter(x => now - x < 2500).concat(now);
    if (taps.length >= 5) { taps = []; reveal(true); }
  });
  // …albo wpisanie „studio”
  let typed = "";
  addEventListener("keydown", e => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1 || (e.target.closest && e.target.closest("input, textarea, select, [contenteditable]"))) return;
    typed = (typed + e.key.toLowerCase()).slice(-6);
    if (typed === "studio") reveal(true);
  });

  // Pas chowa się przy przewijaniu w dół i wraca przy przewijaniu w górę
  let lastY = scrollY;
  addEventListener("scroll", () => {
    const y = scrollY, dy = y - lastY;
    if (Math.abs(dy) < 6) return;
    root.classList.toggle("uni-up", dy > 0 && y > 120 && !bar.contains(document.activeElement));
    lastY = y;
  }, { passive: true });
  bar.addEventListener("focusin", () => root.classList.remove("uni-up"));

  function mount() {
    render();
    if (site === "studio" || store.get()) reveal(false);
    document.body.prepend(bar);
    // Strony postaci przełączają język w miejscu — pas idzie za nimi
    new MutationObserver(render).observe(root, { attributes: true, attributeFilter: ["lang", "data-lang"] });
  }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);

  // Licznik odwiedzin — jeden skrypt Cloudflare dla całego v-cancrosa.github.io
  if (site !== "studio" && location.hostname === HOME && !document.querySelector("script[data-cf-beacon]")) {
    const s = document.createElement("script");
    s.defer = true;
    s.src = "https://static.cloudflareinsights.com/beacon.min.js";
    s.setAttribute("data-cf-beacon", '{"token": "c77fd34d51aa46b98fb10a5b296267d5"}');
    document.head.appendChild(s);
  }
})();
