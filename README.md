# Gioele Valori — Portfolio

Portfolio Angular in italiano e inglese, pubblicato su https://gioelevalori.dev/. Recruiter e clienti hanno la stessa priorità. Tema chiaro/scuro, CV, progetti reali e demo frontend Spazio.

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

- `src/main.ts`: shell e configurazione delle route.
- `src/case-study.component.ts`, `.html`, `.css`: vista progetto.
- `scripts/build.mjs`: build Angular con gli argomenti CLI richiesti.
- `scripts/build-route-shells.mjs`: dopo la build crea gli entry point Angular per i quattro URL progetto e il fallback `404.html` di GitHub Pages. Non genera pagine applicative separate.

Le shell mantengono metadati specifici per condivisione e canonical; titoli, lingua e dati strutturati vengono aggiornati anche durante la navigazione SPA. Il contenuto delle viste viene renderizzato da Angular.

Il cliente ha fornito l’idea; Gioele ha realizzato entrambi i progetti da solo, come confermato dall’autore. Le immagini in `public/projects/` sono catture PNG reali 1x e 2x, accompagnate dalla provenienza. Ogni scheda usa la stessa cornice 16:10, senza alterare o ritagliare le proporzioni delle singole schermate. CookieMakers rimanda anche al repository pubblico. Non sono riportate metriche commerciali non verificate.

## Demo Spazio

Demo frontend con ricerca, creazione, filtro, eliminazione e cambio di stato delle attività. I dati restano nel localStorage del browser. API .NET e PostgreSQL rappresentano un’eventuale evoluzione, non funzionalità implementate.

## Movimento e navigazione

Lo scroll resta nativo. I progetti possono sovrapporsi su desktop, mentre il profilo usa timeline CSS progressive. L’opzione di sistema per le animazioni ridotte mantiene una lettura statica. Le schede progetto usano dialog nativi con gestione di focus ed Escape; i casi studio hanno anche URL propri. Un refresh della homepage riparte dalla presentazione, mentre link diretti alle sezioni e tasto Indietro mantengono il comportamento nativo.
