# V Cancrosa Entertainment

Strona-hub (GitHub Pages) zbierająca wszystkie serwisy V Cancrosa. Każdy główny serwis ma własną podstronę z tym, co i jak:

- **Wideo i streamy:** YouTube, Twitch, TikTok
- **Zdjęcia i posty:** Instagram (osobny świat), Bluesky (posty wczytywane na żywo)
- **Znajdziesz mnie też:** X, Telegram, Reddit, Kick, GitHub — same linki, bez podstron

Czysty HTML/CSS/JS — bez builda, bez zależności. Dwie wersje językowe: polska (główna) i angielska pod `/en/`.

## Dwa głosy: Vincent i „zza kulis”

Teksty na stronie mówią dwa głosy, jak dialogi w grze:

- **Vincent** — świecąca ramka z avatarem. Dopracowany, pewny siebie gospodarz norki.
- **Zza kulis** (*Behind the scenes*) — przerywana ramka, pismo jak z terminala. Szczery komentarz osoby, z której Vincent wyszedł.

```html
<div class="dialog dialog--vincent" data-reveal> … <span class="dialog__speaker">Vincent</span><p>Tekst Vincenta</p> … </div>
<div class="dialog dialog--me" data-reveal>      … <span class="dialog__speaker">Zza kulis</span><p>Twój komentarz</p> … </div>
```

Avatar Vincenta: `assets/img/vincent.png` — fragment „The Night Paw” (art: amanda_rice910, podpisany w napisach końcowych).

## Wspólny pas „V Cancrosa”

Trzy strony tworzą jedno uniwersum i mają ten sam cienki pas na górze: **Postacie** (The One Above Them — wejście główne),
**Kanały** (V Cancrosa Entertainment) i — ukryte — **Studio** (V_Cancrosa-YouTube-Create).

- Źródło pasa: folder `uni/` w repo **V_Cancrosa-One-and-Fursonas**. Kopie: `assets/uni/` w Entertainment i `site/uni/` w YouTube-Create.
  Zmieniasz tylko źródło, potem kopiujesz cały folder `uni/` bez zmian.
- Na stronie: `<link rel="stylesheet" href="…/uni/universe.css">` i `<script src="…/uni/universe.js" data-site="fursony|entertainment|studio" defer></script>`.
- Pas chowa się przy przewijaniu w dół, wraca przy przewijaniu w górę i mówi językiem strony.
- Ukryte przejście do studia: pięć szybkich kliknięć w znak (punkt nad trzema kreskami) albo wpisanie na klawiaturze „studio”.
  To ukrycie, nie zabezpieczenie — kto zna adres, wejdzie. Studio ma `noindex`, więc wyszukiwarki go nie pokazują.

## Wersja angielska

Każda strona ma bliźniaka w `en/` (np. `twitch/index.html` ↔ `en/twitch/index.html`).
Zmieniając treść, popraw oba pliki. Teksty generowane przez skrypty (menu, karty, terminal, komunikaty)
są w słowniku `T` na początku `assets/js/main.js`, a opisy kart w `short: { pl, en }` w configu.

## Struktura

```
index.html            strona główna (karty serwisów generowane z configu)
youtube/ twitch/ tiktok/ instagram/ bluesky/   podstrony serwisów
en/                   wersja angielska (te same podstrony)
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
     ink: "#0f0d0c", url: "https://www.threads.net/@...", short: { pl: "...", en: "..." } }
   ```
   - `group: "links"` — sama ikonka w „Znajdziesz mnie też”, bez podstrony (koniec, dalsze kroki niepotrzebne).
   - `status: "soon"` — karta „Wkrótce” na głównej, bez podstrony.
   - `ink` — kolor tekstu na przyciskach, gdy akcent jest jasny.
2. Skopiuj folder `_szablon` jako `threads/`, a `en/_szablon` jako `en/threads/`. W obu podmień `ID_SERWISU` → `threads` oraz `NAZWA`/`NAME` → `Threads` i wpisz teksty Vincenta i zza kulis.
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

Czcionki: Exo 2, Inter, JetBrains Mono (SIL OFL) — trzymane na serwerze strony w `assets/fonts/`, bez Google Fonts (RODO). Ikony: Simple Icons (CC0).
