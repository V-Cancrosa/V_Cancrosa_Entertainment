/*
 * ===========================================================
 *  KONFIGURACJA STRONY — tu zmieniasz linki i dodajesz serwisy
 * ===========================================================
 *
 *  Każdy serwis to jeden obiekt w tablicy `platforms`:
 *  - id     : nazwa folderu podstrony (np. "youtube" -> /youtube/)
 *             i nazwa ikony z assets/js/icons.js
 *  - group  : "video"  = sekcja „Wideo i streamy” na głównej
 *             "social" = sekcja „Zdjęcia i posty”
 *             "links"  = tylko ikonka w „Znajdziesz mnie też” (bez podstrony)
 *  - status : "active" = ma podstronę i jest w menu
 *             "soon"   = karta „Wkrótce” (bez podstrony)
 *  - url    : link do profilu
 *  - color  : kolor akcentu karty / podstrony
 *  - short  : opis na karcie — { pl: "...", en: "..." }
 *
 *  Nowy serwis z podstroną: dopisz obiekt, skopiuj folder `_szablon`
 *  jako `<id>/` i uzupełnij treść. Szczegóły w README.md.
 */
window.SITE = {
  name: "V Cancrosa Entertainment",
  tagline: "Gry, streamy i wszystko pomiędzy.",

  platforms: [
    /* ---------- Wideo i streamy ---------- */
    {
      id: "youtube",
      name: "YouTube",
      group: "video",
      status: "active",
      color: "#ff3b3b",
      url: "https://www.youtube.com/@Vincent_Vince_Cancrosa",
      // ID kanału (UC...) — z niego robi się playlista najnowszych filmów
      channelId: "UCR_xUJhkPymy4xGxNfguC9A",
      short: {
        pl: "Filmy, montaże, serie i powtórki najlepszych momentów.",
        en: "Videos, edits, series and replays of the best moments.",
      },
    },
    {
      id: "twitch",
      name: "Twitch",
      group: "video",
      status: "active",
      color: "#a970ff",
      url: "https://www.twitch.tv/vincent_cancrosa",
      channel: "vincent_cancrosa",
      short: {
        pl: "Streamy na żywo, wspólne granie i rozmowy z czatem.",
        en: "Live streams, playing together and talking with chat.",
      },
    },
    {
      id: "tiktok",
      name: "TikTok",
      group: "video",
      status: "active",
      color: "#25f4ee",
      ink: "#0f0d0c", // kolor tekstu na przyciskach (jasny akcent -> ciemny tekst)
      url: "https://www.tiktok.com/@vulpescancrosa",
      handle: "vulpescancrosa",
      short: {
        pl: "Krótkie formy, klipy i szybkie akcje.",
        en: "Short-form clips, highlights and quick action.",
      },
    },

    /* ---------- Zdjęcia i posty ---------- */
    {
      id: "instagram",
      name: "Instagram",
      group: "social",
      status: "active",
      color: "#e1306c",
      url: "https://www.instagram.com/vincent_cancrosa/",
      handle: "vincent_cancrosa",
      // Linki do wybranych postów do pokazania na podstronie, np.
      // "https://www.instagram.com/p/ABC123xyz/"
      posts: [],
      short: {
        pl: "Osobny świat — zdjęcia, kadry i historie, które żyją własnym życiem.",
        en: "A world of its own — photos, frames and stories with a life of their own.",
      },
    },
    {
      id: "bluesky",
      name: "Bluesky",
      group: "social",
      status: "active",
      color: "#1185fe",
      url: "https://bsky.app/profile/vcancrosa.bsky.social",
      handle: "vcancrosa.bsky.social",
      short: {
        pl: "Posty, przemyślenia i bieżące ogłoszenia.",
        en: "Posts, thoughts and the latest announcements.",
      },
    },

    /* ---------- Znajdziesz mnie też ---------- */
    { id: "x",        name: "X",        group: "links", status: "active", color: "#e7e9ea", url: "https://x.com/Vulpine_Regnum" },
    { id: "telegram", name: "Telegram", group: "links", status: "active", color: "#26a5e4", url: "https://t.me/vincent_vince_cancrosa" },
    { id: "reddit",   name: "Reddit",   group: "links", status: "active", color: "#ff4500", url: "https://www.reddit.com/user/Kilokero1/" },
    { id: "kick",     name: "Kick",     group: "links", status: "active", color: "#53fc18", url: "https://kick.com/v-cancrosa" },
    { id: "github",   name: "GitHub",   group: "links", status: "active", color: "#f0f0f0", url: "https://github.com/V-Cancrosa" },
  ],
};
