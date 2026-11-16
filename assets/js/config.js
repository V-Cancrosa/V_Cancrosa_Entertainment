/*
 * ===========================================================
 *  KONFIGURACJA STRONY — tu zmieniasz linki i dodajesz serwisy
 * ===========================================================
 *
 *  Każdy serwis to jeden obiekt w tablicy `platforms`.
 *  - id      : nazwa folderu podstrony (np. "youtube" -> /youtube/)
 *  - status  : "active" = ma podstronę i jest w menu
 *              "soon"   = pokazuje się na głównej jako "Wkrótce"
 *  - url     : link do profilu w danym serwisie
 *  - color   : kolor akcentu karty / podstrony
 *
 *  Nowy serwis: dopisz obiekt poniżej, skopiuj folder `_szablon`
 *  jako `<id>/` i uzupełnij treść. Szczegóły w README.md.
 */
window.SITE = {
  name: "V Cancrosa Entertainment",
  tagline: "Gry, streamy i wszystko pomiędzy.",

  platforms: [
    {
      id: "youtube",
      name: "YouTube",
      status: "active",
      color: "#ff3b3b",
      url: "https://www.youtube.com/@TWOJ_KANAL",
      // ID kanału (zaczyna się od "UC...") — potrzebne do osadzenia
      // listy najnowszych filmów. Zostaw puste, jeśli nie chcesz.
      channelId: "",
      short: "Filmy, montaże, serie i powtórki najlepszych momentów.",
    },
    {
      id: "twitch",
      name: "Twitch",
      status: "active",
      color: "#a970ff",
      url: "https://www.twitch.tv/TWOJ_KANAL",
      // Login kanału na Twitchu (to, co jest w adresie po twitch.tv/)
      channel: "",
      short: "Streamy na żywo, wspólne granie i rozmowy z czatem.",
    },
    // Przykład serwisu, który dopiero wejdzie:
    // {
    //   id: "tiktok",
    //   name: "TikTok",
    //   status: "soon",
    //   color: "#25f4ee",
    //   url: "",
    //   short: "Krótkie formy i klipy.",
    // },
  ],
};
