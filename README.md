# V Cancrosa Entertainment

Strona-hub (GitHub Pages) zbierająca wszystkie serwisy V Cancrosa. Każdy główny serwis ma własną podstronę z tym, co i jak:

- **Wideo i streamy:** YouTube, Twitch, TikTok
- **Zdjęcia i posty:** Instagram (osobny świat), Bluesky (posty wczytywane na żywo)
- **Znajdziesz mnie też:** X, Telegram, Reddit, Kick, GitHub — same linki, bez podstron

Czysty HTML/CSS/JS — bez builda, bez zależności.

## Struktura

```
index.html            strona główna (karty serwisów generowane z configu)
youtube/ twitch/ tiktok/ instagram/ bluesky/   podstrony serwisów
_szablon/index.html   szablon nowej podstrony
assets/js/config.js   ⭐ linki, ID kanałów, lista serwisów
assets/js/main.js     menu, karty, osadzenia (zwykle nie trzeba ruszać)
assets/js/icons.js    ikony serwisów (simple-icons, CC0)
assets/css/style.css  wygląd
assets/img/logo.svg   logo / favicon
404.html              strona błędu
```

## Osadzenia

| Serwis | Co się pokazuje | Skąd |
|---|---|---|
| YouTube | playlista najnowszych filmów | `channelId` (youtube-nocookie) |
| Twitch | odtwarzacz na żywo | `channel` |
| TikTok | profil z klipami — **po kliknięciu** | `handle` (skrypt TikToka) |
| Instagram | wybrane posty — **po kliknięciu** | lista `posts` w configu |
| Bluesky | 6 najnowszych postów, na bieżąco | publiczne API Bluesky, bez logowania |

TikTok i Instagram ładują skrypty z ciasteczkami, więc czekają na kliknięcie odwiedzającego (zgodnie z RODO).
Instagram nie pozwala osadzić całego profilu, tylko pojedyncze posty — dodaj ich linki do `posts`.

## Do uzupełnienia

Teksty oznaczone „Uzupełnij” w plikach HTML (harmonogram, serie, zasady czatu, opis świata na Instagramie).

## Włączenie GitHub Pages

Settings → Pages → *Source: Deploy from a branch* → `main` / `/ (root)` → Save.
Strona będzie pod adresem `https://v-cancrosa.github.io/V_Cancrosa_Entertainment/`.

## Dodanie nowego serwisu

1. Dopisz obiekt w `platforms` w `assets/js/config.js`:
   ```js
   { id: "threads", name: "Threads", group: "social", status: "active", color: "#ffffff",
     ink: "#0f0d0c", url: "https://www.threads.net/@...", short: "..." }
   ```
   - `group: "links"` — sama ikonka w „Znajdziesz mnie też”, bez podstrony (koniec, dalsze kroki niepotrzebne).
   - `status: "soon"` — karta „Wkrótce” na głównej, bez podstrony.
   - `ink` — kolor tekstu na przyciskach, gdy akcent jest jasny.
2. Skopiuj folder `_szablon` jako `threads/` i w `index.html` podmień `ID_SERWISU` → `threads` oraz `NAZWA` → `Threads`.
3. Dodaj ikonę do `assets/js/icons.js` — ścieżkę `d` z pliku SVG na https://simpleicons.org (inaczej będzie ikona domyślna).

Menu, karty na głównej i ikonki w stopce aktualizują się same.
