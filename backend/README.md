# Spazio — demo Full Stack

API ASP.NET Core 10 + Entity Framework Core + PostgreSQL. Progetto dimostrativo, separato dal portfolio statico e dai siti realizzati per clienti. Il frontend Angular esistente può collegarsi a questa API oppure mantenere i dati nel browser. Nessuna modalità simula chiamate a un server.

## Cosa è implementato

- Registrazione e login ASP.NET Core Identity, password hashate e token bearer opachi (non JWT inventati dal progetto).
- Il pulsante «Prova con il backend» crea un account dimostrativo casuale, senza chiedere dati personali. Il token è conservato nel sessionStorage della scheda, con scadenza; non viene inserito in URL o log.
- Bacheche private per utente: ogni query e modifica filtra sul proprietario ricavato dall’identità autenticata, mai da un parametro inviato dal client.
- Creazione, elenco, cambio stato, eliminazione e ripristino degli esempi. Validazione sul server di titolo, categoria, stato e data.
- Database PostgreSQL persistente, chiave esterna con cancellazione a cascata e indice per proprietario/data.
- Rate limiting su autenticazione e operazioni, CORS esplicito, errori Problem Details e cancellazione periodica degli account demo più vecchi di 24 ore. Non utilizzare questa API per account reali.

## Avvio con Docker Compose

Richiede Docker Compose. Da PowerShell, nella radice del repository:

```powershell
$env:SPAZIO_DB_PASSWORD=[guid]::NewGuid().ToString('N')
docker compose -f backend/compose.yaml up --build
```

La API risponde su `http://127.0.0.1:5080/health`. Il database ha un volume persistente e non espone porte all’esterno. La creazione iniziale dello schema è abilitata esplicitamente per questa demo tramite `Database__Initialize`; usa un database dedicato vuoto. `EnsureCreated` non è un sistema di migrazione per database già esistenti.

Per provare il frontend con questa API:

```powershell
$env:SPAZIO_API_URL='http://127.0.0.1:5080'
npm run build -- --base-href /
py -m http.server 4200 --bind 127.0.0.1 --directory dist/portfolio/browser
```

Apri il portfolio, seleziona Spazio, entra nella demo e premi «Prova con il backend». Il cambio modalità conserva separatamente i dati locali. Il refresh può riconnettersi alla stessa sessione finché il token è valido. Una sessione scaduta viene sostituita da una nuova demo.

## Avvio senza Docker

Richiede SDK .NET 10 e PostgreSQL. Crea un database vuoto dedicato e configura una stringa di connessione tramite ambiente o user-secrets, senza commetterla:

```powershell
$env:ConnectionStrings__Spazio='Host=localhost;Database=spazio;Username=spazio;Password=YOUR_LOCAL_PASSWORD'
$env:Database__Initialize='true'
$env:ASPNETCORE_URLS='http://127.0.0.1:5080'
dotnet run --project backend/Spazio.Api
```

## Contratto API

| Metodo | URL | Comportamento |
| --- | --- | --- |
| GET | `/health` | Verifica connessione PostgreSQL |
| POST | `/api/auth/register` | Registrazione Identity `{email,password}` |
| POST | `/api/auth/login` | Token Identity `{email,password}` |
| GET | `/api/tasks/` | Attività dell’utente autenticato |
| POST | `/api/tasks/` | `{title,tag,state,due}`; 201 e attività creata |
| PATCH | `/api/tasks/{id}` | `{state}`; modifica solo attività proprie |
| DELETE | `/api/tasks/{id}` | 204; 404 per attività non proprie o inesistenti |
| POST | `/api/tasks/reset` | Ripristino transazionale dei quattro esempi dell’utente |

I metodi tasks richiedono `Authorization: Bearer TOKEN`. Stati canonici: `Da fare`, `In corso`, `Completate`; data `YYYY-MM-DD` oppure stringa vuota. Il client traduce l’interfaccia senza cambiare questi valori.

## Verifica

Con API e database avviati:

```sh
dotnet restore backend/Spazio.Api --locked-mode
dotnet build backend/Spazio.Api --no-restore
node backend/tests/integration.mjs
```

Il test usa due account isolati e verifica autenticazione, CRUD, validazione, 404 su operazioni incrociate e isolamento del ripristino. Per un’altra porta impostare `SPAZIO_TEST_URL`. Eseguirlo su un database dedicato: gli account dimostrativi sono ripuliti periodicamente.

## Hosting

GitHub Pages ospita il frontend, non processi .NET o PostgreSQL. Il backend deve essere distribuito separatamente con il Dockerfile e un database PostgreSQL. Configurare `ConnectionStrings__Spazio`, origini CORS esatte in `AllowedOrigins__0`, HTTPS e chiavi Data Protection persistenti. Per il frontend impostare `SPAZIO_API_URL` prima della build; non contiene credenziali. La build pubblica senza questa variabile resta in modalità browser. Non dichiarare online il backend finché hosting e test pubblici non sono completati.
