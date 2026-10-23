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
- `scripts/build-case-studies.mjs`: genera le pagine progetto statiche, la sitemap e robots.txt prima di avvio e build.

## Casi studio

CookieMakers e Cali al Sole hanno pagine autonome sotto `/progetti/` e `/en/projects/`, complete di HTML leggibile senza JavaScript, canonical, hreflang e dati strutturati. Le descrizioni tecniche sono condivise con il portfolio. I file HTML generati in `public/` vengono aggiornati automaticamente da start e build.

Il cliente ha fornito l’idea; Gioele ha realizzato entrambi i progetti da solo, come confermato dall’autore. Le immagini in `public/projects/` sono schermate reali, accompagnate da registrazioni della provenienza. CookieMakers rimanda anche al repository pubblico. Non sono riportate metriche di conversione o risultati commerciali non verificati.

La homepage resta renderizzata sul client Angular; le pagine progetto sono statiche. I metadati della homepage includono canonical, Open Graph, social card e dati Person. Il curriculum resta in italiano anche quando si seleziona English.

## Demo Spazio

Demo frontend con ricerca, creazione, filtro, eliminazione e cambio di stato delle attività. I dati restano nel localStorage del browser. API .NET e PostgreSQL rappresentano un’eventuale evoluzione, non funzionalità implementate.

## Movimento e navigazione

Lo scroll resta nativo. I progetti possono sovrapporsi su desktop, mentre il profilo usa timeline CSS progressive. L’opzione di sistema per le animazioni ridotte mantiene una lettura statica. Le schede progetto usano dialog nativi con gestione di focus ed Escape; i casi studio hanno anche URL propri. Un refresh della homepage riparte dalla presentazione, mentre link diretti alle sezioni e tasto Indietro mantengono il comportamento nativo.
