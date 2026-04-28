# Iliad Network Monitor

Una piccola dashboard che mostra in tempo reale come va la tua connessione
fibra Iliad: se la linea è attiva, quanto stai scaricando, chi è collegato
alla rete di casa e come sta il router.

## Installare l'app sul telefono o sul computer

L'applicazione è una **PWA** (Progressive Web App): si installa direttamente
dal browser senza passare da app store, e una volta installata si apre come
una qualsiasi altra app dal menu del telefono o dal Launchpad.

### Su Android (Chrome / Edge)

Quando apri l'app la prima volta, in alto a destra compare il pulsante
**Installa app** in rosso. Premilo e conferma. L'app comparirà tra le icone
del telefono.

In alternativa: menu del browser (i tre puntini) → **Installa app** o
**Aggiungi a schermata Home**.

### Su iPhone / iPad (Safari)

Safari su iPhone non ha un pulsante automatico, devi aggiungerla a mano:

1. Apri l'app in Safari.
2. Tocca il pulsante **Condividi** (il quadratino con la freccia in su).
3. Scegli **"Aggiungi a Home"**.
4. Conferma il nome e premi **Aggiungi**.

L'icona compare sulla schermata Home come una qualsiasi app.

### Su computer (Chrome / Edge / Brave)

Nella barra dell'indirizzo, sul lato destro, compare un'icona con uno
schermo e una freccia: cliccala per installare l'app come finestra
indipendente. In alternativa, il pulsante **Installa app** è disponibile
nell'header dell'applicazione stessa.

### Cosa cambia una volta installata

- Si apre in una finestra dedicata, senza la barra del browser.
- Compare nel menu del telefono / Launchpad come una vera app.
- L'interfaccia (HTML, CSS, immagini) è disponibile anche senza
  connessione: si apre subito. I dati live ovviamente richiedono di essere
  connessi alla rete della iliadbox.

## Cosa puoi vedere

- **Stato della linea** — se la fibra è online o offline, l'indirizzo IP che
  ti ha assegnato Iliad, la velocità massima della tua linea e quanti dati
  hai consumato in totale.
- **Velocità in tempo reale** — un grafico che mostra quanto stai scaricando
  (download) e caricando (upload) in questo preciso istante.
- **Dispositivi collegati** — l'elenco di tutto quello che è connesso alla
  tua rete: telefoni, computer, smart TV, lampadine smart, ecc.
- **Reti Wi-Fi** — vedi e modifica le reti Wi-Fi: cambia password, accendi
  o spegni una rete (utile per la rete ospiti).
- **Stato del router** — modello, da quanto tempo è acceso, temperatura
  interna e velocità della ventola.

## Come si avvia

Apri il terminale nella cartella del progetto e lancia:

```bash
pnpm install
pnpm dev
```

Poi apri il browser su [http://localhost:5173](http://localhost:5173).

## Guida · Come collegarsi alla iliadbox

### Prima di iniziare

- Devi essere collegato alla rete di casa (Wi-Fi della iliadbox o cavo di
  rete). Da fuori casa l'app non funziona.
- Devi poter raggiungere fisicamente la iliadbox per premere un tasto sul
  suo schermo.
- Non serve installare nulla sul router e non servono password.

### Cosa fare la prima volta

1. Apri l'app sul computer (`pnpm dev` → `http://localhost:5173`).
2. Premi il pulsante **Avvia autenticazione**.
3. Vai vicino alla iliadbox. Sul piccolo schermo del router compare la
   scritta *"Iliad Network Monitor — Autorizzare?"*.
4. Usa la rotella (o le frecce) del router per scegliere **Sì** e premi il
   tasto di conferma. Hai circa 30 secondi.
5. Torna al computer: la dashboard si apre da sola.

Questo passaggio si fa **una volta sola**. Le volte successive che apri
l'app, entri direttamente nella dashboard.

### Come funziona, in parole semplici

L'app non conosce nessuna password della tua iliadbox. Per fidarsi di lei,
la iliadbox chiede a te di confermare di persona premendo un tasto sul
router. Una volta che hai detto "sì", la iliadbox dà all'app una specie di
**chiave d'accesso personale**, che resta salvata solo nel browser del tuo
computer.

Da quel momento in poi, l'app usa questa chiave per chiedere alla iliadbox
i dati della rete ogni pochi secondi e mostrarteli sulla dashboard.

> **È sicuro?** Sì. Nessun dato esce mai dalla tua rete di casa. Tutto
> avviene tra il computer e il router. Non ci sono server esterni di mezzo
> e non viene salvato niente "nel cloud".

## Se qualcosa non funziona

| Cosa vedi                            | Cosa significa e come risolvere                                                                                                                                       |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **iliadbox non raggiungibile**       | Il computer non riesce a parlare con il router. Controlla di essere sulla Wi-Fi di casa (non a quella del vicino o ai dati del cellulare) e che il router sia acceso. |
| **Autorizzazione rifiutata**         | Sul router hai scelto "No" o hai premuto il tasto sbagliato. Premi di nuovo *Avvia autenticazione* e riprova.                                                         |
| **Tempo scaduto**                    | Il router aspetta solo una trentina di secondi. Riprova e vai subito a confermare sul router.                                                                         |
| L'app continua a dirmi di rifare la prima volta | Hai cambiato browser o cancellato i dati del browser. È normale: rifai la procedura, è veloce.                                                                  |

### Per cambiare la password Wi-Fi servono permessi extra

Per leggere lo stato della linea bastano i permessi base, ma per **modificare
la password Wi-Fi** o **accendere/spegnere una rete** l'app deve avere il
permesso "Modifica impostazioni".

Se vedi scritto "Sola lettura" nella sezione Wi-Fi:

1. Apri il browser su [mafreebox.freebox.fr](http://mafreebox.freebox.fr).
2. Entra con il tuo account Iliad.
3. Cerca la sezione **"Gestione degli accessi"**.
4. Trova l'app *"Iliad Network Monitor"* nell'elenco.
5. Abilita la voce **"Modifica delle impostazioni della Freebox"**.
6. Torna sull'app: il pulsante "Cambia password" diventa attivo.

### Voglio togliere l'accesso a questa app

Apri il browser e vai su [mafreebox.freebox.fr](http://mafreebox.freebox.fr).
Entra con il tuo account Iliad, cerca la sezione **"Gestione degli accessi"**
e cancella la voce *"Iliad Network Monitor"*. Da quel momento l'app non
potrà più leggere niente fino a quando non rifai la procedura iniziale.

In alternativa, basta svuotare la cronologia del browser per dimenticare la
chiave d'accesso (l'autorizzazione resterà però attiva sul router fino a
quando non la rimuovi dal pannello).

## Per chi vuole sapere di più (parte tecnica)

> Questa sezione è opzionale: serve solo se hai voglia di smanettare con il
> codice o capire cosa succede sotto al cofano.

### Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- recharts (grafico velocità)
- crypto-js (firma HMAC-SHA1 dell'autenticazione)

### Flusso di autenticazione (FreeboxOS API v8)

```
1.  POST /api/v8/login/authorize/   → app_token + track_id
2.  Polling /login/authorize/{track_id} fino a status=granted
3.  GET  /api/v8/login/             → challenge
4.  password = HMAC_SHA1(app_token, challenge)
5.  POST /api/v8/login/session/     → session_token
6.  Tutte le chiamate successive: header X-Fbx-App-Auth: <session_token>
```

Se la sessione scade (`auth_required`), il client rinegozia automaticamente
dal punto 3 senza richiedere all'utente di confermare nuovamente sul router.

### Endpoint usati

| Endpoint                       | Frequenza | Cosa contiene                              |
| ------------------------------ | --------- | ------------------------------------------ |
| `GET /api/v8/connection/`      | 2 s       | stato linea, IP, velocità istantanea       |
| `GET /api/v8/lan/browser/pub/` | 15 s      | dispositivi LAN (nome, MAC, IP, vendor)    |
| `GET /api/v8/system/`          | 30 s      | modello, firmware, uptime, sensori         |
| `GET /api/v8/wifi/bss/`        | on demand | elenco reti Wi-Fi (SSID, password, stato)  |
| `PUT /api/v8/wifi/bss/{id}`    | on demand | aggiorna config rete (key, enabled, ssid)  |

Le scritture (`PUT`) richiedono il permesso `settings`, da abilitare dal
pannello iliadbox per la nostra app.

### Struttura del progetto

```
src/
├── api/             # client HTTP, autenticazione, tipi
├── components/      # AuthScreen, Dashboard, StatusCard, …
├── hooks/           # useFreeboxAuth, usePolling
├── lib/format.ts    # formattazione bitrate, byte, uptime
└── App.tsx
```

### Build di produzione

```bash
pnpm build      # genera dist/
pnpm preview    # serve dist/ in locale
```

In produzione il proxy di Vite non c'è: il sito statico va ospitato sulla
stessa rete della iliadbox, oppure dietro un reverse proxy che inoltri le
chiamate `/api/*` verso `mafreebox.freebox.fr`.
