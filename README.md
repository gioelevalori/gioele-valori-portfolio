# Gioele Valori — Portfolio Angular

Portfolio responsive in italiano, con tema chiaro/scuro, percorso professionale, competenze, formazione, download CV e contatti.

## Avvio

Node.js 22.22.3+ oppure 24.15+ o una versione supportata da Angular 22.

```sh
npm install
npm start
```

## Build

```sh
npm run build
```

Pubblicare la cartella `dist/portfolio/browser` su un hosting statico. Nessun backend o database necessario: il sito non raccoglie dati. Il pulsante contatti apre il client email.

I contenuti provengono dal CV fornito. I riferimenti visivi sono Brittany Chiang e Bruno Simon, consultati anche nella raccolta https://github.com/emmabostian/developer-portfolios; il layout e il codice sono originali. Nessun progetto o risultato commerciale inventato.

Per modificare contenuti e contatti: `src/main.ts`. Per il design: `src/styles.css`. Il PDF originale è in `public/`.


## Galleria portfolio
L’apertura usa un pannello HTML/CSS in prospettiva, con movimento al puntatore su desktop. La bacheca Spazio è un’anteprima illustrativa cliccabile che porta alla descrizione del concept; non è un’applicazione gestionale. Su mobile il pannello è frontale. Il movimento rispetta prefers-reduced-motion.


La galleria desktop segue lo scorrimento con una scena sticky, avvicinamento e rotazione del pannello. Il link Salta al profilo evita la sequenza. Il browser mantiene scorrimento nativo e supporto alla tastiera. Su mobile e con prefers-reduced-motion la sequenza estesa è disattivata.


## Demo Spazio
Il sito apre con la presentazione personale e poi mostra i progetti. Il pannello Spazio apre un dialog nativo con transizione visiva (quando supportata), demo interattiva e descrizione del progetto. La bacheca permette creazione, ricerca, filtro, eliminazione e cambio di stato con trascinamento o menu. Le attività vengono salvate in localStorage; non vengono inviate a server. Ripristina esempio riporta la bacheca ai dati iniziali. Il backend .NET/PostgreSQL è solo un'ipotesi di evoluzione.

