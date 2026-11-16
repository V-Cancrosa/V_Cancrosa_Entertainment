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
assets/js/fx.js       efekty: kosmos (canvas), ekran ładowania, terminal, 3D, scroll
credits/index.html    napisy końcowe (autorzy efektów, czcionek, ikon)
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

## Wygląd i efekty

Kosmiczny motyw w stylu ekranu tytułowego gry: żywe tło z gwiazdami (paralaksa od myszy, spadające gwiazdy),
mgławice w kolorze danego serwisu, ekran ładowania (raz na sesję), terminal „łączący się” z serwisami,
karty z neonowym szkłem, przechylaniem 3D i poświatą oraz pojawianie się elementów przy przewijaniu.

Dla osób z włączonym „ogranicz ruch” w systemie animacje są wyłączone, a treść widoczna od razu.

### Autorzy inspiracji (z [CodePenFolders](https://github.com/V-Cancrosa/CodePenFolders), licencja MIT)

| Efekt | Autor | Gdzie użyty |
|---|---|---|
| [Animated Back Glow](https://codepen.io/georgehastings/pen/xgwxgo) | George Hastings | poświata za kartami |
| [Neon Glass Context Menu](https://codepen.io/simeydotme/pen/PwwYZOe) | Simey | szklane karty, świecące krawędzie |
| [termynal.js](https://codepen.io/ines/pen/MoaRYM) | Ines Montani | terminal na ekranie tytułowym |
| [AOS](https://codepen.io/michalsnik/pen/WxNdvq) | Michał Sajnóg | pojawianie się przy przewijaniu |
| [Button hover effects with box-shadow](https://codepen.io/giana/pen/BZaGyP) | Giana | efekty przycisków |

Czcionki: Exo 2, Inter, JetBrains Mono (Google Fonts, SIL OFL). Ikony: Simple Icons (CC0).
