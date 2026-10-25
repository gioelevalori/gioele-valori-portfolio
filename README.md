# Gioele Valori — Portfolio

Portfolio Angular in italiano e inglese, pubblicato su https://gioelevalori.dev/. Recruiter e clienti hanno la stessa priorità. Tema chiaro/scuro, CV, progetti reali e demo Spazio con modalità locale e backend Full Stack.

## Avvio e build

Usare Node.js 24, come nel workflow GitHub Pages.

```sh
npm ci
npm start
npm run build -- --base-href /
```

La cartella pubblicata è `dist/portfolio/browser`. Non servono backend o database per il portfolio.

## Struttura

- `src/main.ts`: bootstrap Angular.
- `src/app.component.ts` e `src/app.component.html`: logica e template del portfolio.
- `src/portfolio-data.ts`: progetti, servizi, esperienze e competenze.
- `src/content/project-studies.json`: contenuti dei casi studio.
- `src/project-preview.component.ts`: composizione condivisa delle schermate desktop e mobile.
- `src/translations.ts`: traduzioni inglesi.
- `src/styles.css` e `src/demo.css`: stile del portfolio e della demo.
- `scripts/build.mjs` e `scripts/build-route-shells.mjs`: compilazione e preparazione degli entry point SPA per GitHub Pages.

## Casi studio e SPA

Homepage e casi studio sono viste della stessa SPA Angular, gestite da `@angular/router`. I collegamenti interni usano RouterLink: apertura, cambio lingua e ritorno al portfolio non ricaricano il documento. Gli URL `/progetti/:slug` e `/en/projects/:slug` restano condivisibili.

- `src/app.config.ts`: shell, route, hydration e transizioni.
- `src/main.server.ts`: prerendering Angular dei casi studio.
- `src/case-study.component.ts`, `.html`, `.css`: vista progetto.
- `scripts/build.mjs`: build Angular con gli argomenti CLI richiesti.
- `scripts/build-route-shells.mjs`: dopo la build crea gli entry point Angular per gli URL progetto in entrambe le lingue e il fallback `404.html` di GitHub Pages. Non genera pagine applicative separate.

I casi studio e gli elenchi progetti sono prerenderizzati da Angular: titolo, testi, immagini e collegamenti sono presenti nell’HTML anche senza JavaScript. Hydration e RouterLink mantengono poi la navigazione SPA. La homepage resta client-rendered. Canonical, hreflang e dati strutturati seguono la lingua. La favicon SVG è attiva.

Il cliente ha fornito l’idea; Gioele ha realizzato entrambi i progetti da solo, come confermato dall’autore. Le immagini in `public/projects/` sono catture PNG reali 1x e 2x, accompagnate dalla provenienza. Ogni scheda usa la stessa cornice 16:10, senza alterare o ritagliare le proporzioni delle singole schermate. Le schede mettono in primo piano la visita al sito e il contatto. Non sono riportate metriche commerciali non verificate.

## Demo Spazio

Spazio offre due modalità separate: browser con localStorage, oppure API ASP.NET Core 10 con autenticazione ASP.NET Core Identity e PostgreSQL tramite Entity Framework Core. Ogni sessione API ha una bacheca privata. Il frontend si collega soltanto quando configurato; la versione pubblica resta locale finché non viene fornito un hosting API. Sorgenti, avvio e test sono descritti in [backend/README.md](backend/README.md).

## Movimento e navigazione

Lo scroll resta nativo con timeline progressive e rispetto delle animazioni ridotte. Le frecce cambiano progetto sul posto; nome e contatore sostituiscono la tendina. Un solo collegamento Scopri di più apre il caso studio completo nella SPA. Transizioni native accompagnano navigazione, selezione progetto, lingua e tema. Spazio mantiene il dialog interattivo.

## Anteprime e immagini

La scheda principale mantiene nome, contatore e frecce. Esplora i progetti apre l’elenco completo su `/progetti/` o `/en/projects/`, con immagini, descrizioni e collegamenti ai casi studio; la homepage non contiene miniature aggiuntive. I PNG originali restano come sorgenti e fallback. Le immagini attive usano picture con AVIF, WebP, srcset a larghezza e sizes responsive. `npm run images:optimize` rigenera le varianti ad alta qualità, con impostazioni e provenienza in `public/projects/optimized-images.json`.

Misure locali indicative su Chrome, viewport 390×844, DPR 2: immagini principali CookieMakers da 1.38 MB a circa 33 KB; Le miniature sperimentali sono state rimosse su richiesta. Singole esecuzioni non equivalgono ai Core Web Vitals sul campo: LCP e CLS vanno valutati su più esecuzioni e sui dati reali degli utenti; INP richiede interazioni rappresentative.

Misurazione finale con la libreria ufficiale web-vitals, Chrome locale 390×844 DPR 2 e sei cambi progetto: LCP 0.66 s, CLS 0.013, INP 104 ms. Sono risultati di laboratorio senza throttling, non percentili sul campo né una garanzia per tutti i dispositivi.

## LiberaUI

Il progetto open source LiberaUI è incluso nel catalogo e nei casi studio IT/EN. Descrizioni e funzionalità sono verificate sul sito pubblico e sul README di gioelevalori/liberaui; non è presentato come lavoro per un cliente. Le catture reali desktop/mobile hanno varianti PNG, AVIF e WebP con provenienza.
