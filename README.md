# V Cancrosa Entertainment

Strona-hub (GitHub Pages) zbierająca wszystkie serwisy V Cancrosa: na start **YouTube** i **Twitch**, kolejne dojdą z czasem. Każdy serwis ma własną podstronę z tym, co i jak.

Czysty HTML/CSS/JS — bez builda, bez zależności.

## Struktura

```
index.html            strona główna (karty serwisów generowane z configu)
youtube/index.html    podstrona YouTube
twitch/index.html     podstrona Twitch
_szablon/index.html   szablon nowej podstrony
assets/js/config.js   ⭐ linki, ID kanałów, lista serwisów
assets/js/main.js     menu, karty, osadzenia (zwykle nie trzeba ruszać)
assets/css/style.css  wygląd
assets/img/logo.svg   logo / favicon
404.html              strona błędu
```

## Pierwsze kroki

1. W `assets/js/config.js` podmień `TWOJ_KANAL` na prawdziwe adresy.
2. YouTube: wpisz `channelId` (zaczyna się od `UC…`) — pojawi się playlista najnowszych filmów.
3. Twitch: wpisz `channel` (login z adresu `twitch.tv/…`) — pojawi się odtwarzacz.
4. Uzupełnij teksty oznaczone „Uzupełnij” w plikach HTML.

## Włączenie GitHub Pages

Settings → Pages → *Source: Deploy from a branch* → `main` / `/ (root)` → Save.
Strona będzie pod adresem `https://v-cancrosa.github.io/V_Cancrosa_Entertainment/`.

## Dodanie nowego serwisu

1. Dopisz obiekt w `platforms` w `assets/js/config.js`:
   ```js
   { id: "tiktok", name: "TikTok", status: "active", color: "#25f4ee",
     url: "https://www.tiktok.com/@...", short: "Krótkie formy i klipy." }
   ```
   `status: "soon"` = karta „Wkrótce” na głównej, bez podstrony i bez pozycji w menu.
2. Skopiuj folder `_szablon` jako `tiktok/` i w `index.html` podmień `ID_SERWISU` → `tiktok` oraz `NAZWA` → `TikTok`.
3. Opcjonalnie dodaj ikonę serwisu do obiektu `ICONS` w `assets/js/main.js` (inaczej użyje ikony domyślnej).

Menu, karty na głównej i ikonki w stopce aktualizują się same.
