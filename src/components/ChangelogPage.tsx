type ChangeType = 'new' | 'changed' | 'fixed' | 'security'

type ChangelogEntry = {
  text: string
  type: ChangeType
}

type Release = {
  version: string
  date: string
  title: string
  current?: boolean
  entries: ChangelogEntry[]
}

const RELEASES: Release[] = [
  {
    version: '1.0.0',
    date: '28 aprile 2026',
    title: 'Vercel-ready · sicurezza completa',
    current: true,
    entries: [
      {
        type: 'new',
        text: 'Controllo Parentale con pianificazione settimanale per dispositivo (7×24 fasce orarie, click & drag, preset)',
      },
      {
        type: 'new',
        text: 'Date & time picker custom in stile app (Lun→Dom, scroll lists per ore/minuti, preset "Adesso")',
      },
      {
        type: 'new',
        text: "Pagine Privacy Policy e Termini d'uso, accessibili dal footer",
      },
      {
        type: 'new',
        text: 'Pagina Funzionalità e Pagina Changelog (questa)',
      },
      {
        type: 'security',
        text: 'Content-Security-Policy stretta con frame-ancestors none (anti-clickjacking)',
      },
      {
        type: 'security',
        text: 'Strict-Transport-Security con preload (HSTS, 2 anni)',
      },
      {
        type: 'security',
        text: 'Permissions-Policy che disabilita camera/mic/geo/payment/USB/Bluetooth/sensori',
      },
      {
        type: 'security',
        text: 'Cross-Origin-Opener-Policy + Resource-Policy same-origin',
      },
      {
        type: 'security',
        text: 'Modali di conferma per azioni distruttive (spegni Wi-Fi principale, elimina filtro parental)',
      },
      {
        type: 'security',
        text: "Timeout di 5 minuti sull'autenticazione in attesa (stop polling indefinito)",
      },
      {
        type: 'changed',
        text: 'Border-radius "squircle" più morbido su tutte le card e i bottoni',
      },
      {
        type: 'changed',
        text: 'Changelog ridisegnata come timeline verticale',
      },
      {
        type: 'changed',
        text: 'Dati demo completamente randomizzati a ogni sessione (IP, MAC, SSID, password, dispositivi pescati da pool di 33 modelli generici)',
      },
    ],
  },
  {
    version: '0.4.0',
    date: '28 aprile 2026',
    title: 'Storico, demo e UI polish',
    entries: [
      {
        type: 'new',
        text: 'Sezione Storico con grafici RRD per banda e temperature',
      },
      {
        type: 'new',
        text: 'Modalità demo con dati simulati realistici (banda fluttuante, temperature con drift)',
      },
      {
        type: 'new',
        text: 'Sfondo animato con percorsi rossi sulla home (Floating Paths)',
      },
      {
        type: 'new',
        text: "Route /dashboard dedicata, link 'Storico' e 'Parental' nell'header",
      },
      {
        type: 'changed',
        text: 'Polling banda passato da 5s a 2s per più reattività',
      },
      {
        type: 'changed',
        text: 'Bordi arrotondati e ombre sobrie su tutte le card',
      },
      {
        type: 'changed',
        text: '"Esci dalla demo" rosso sostituisce "Disconnetti" grigio quando in modalità demo',
      },
      {
        type: 'changed',
        text: 'Cursor pointer globale su tutti i bottoni (regola CSS automatica)',
      },
      {
        type: 'changed',
        text: 'Background dashboard cambiato in neutral-100 per maggiore chiarezza',
      },
      {
        type: 'fixed',
        text: 'Allineamento delle card di stato e banda (h-full)',
      },
      {
        type: 'fixed',
        text: 'Banner demo allineato al resto della dashboard (spostato dentro main)',
      },
      {
        type: 'fixed',
        text: 'Scroll orizzontale rimosso (overflow-x: hidden globale)',
      },
    ],
  },
  {
    version: '0.3.0',
    date: '28 aprile 2026',
    title: 'Progressive Web App',
    entries: [
      { type: 'new', text: 'App installabile come Progressive Web App' },
      {
        type: 'new',
        text: 'Web manifest con icone, lingua italiana, display standalone',
      },
      {
        type: 'new',
        text: 'Service worker con Workbox per pre-cache statico',
      },
      {
        type: 'new',
        text: 'Pulsante "Installa app" automatico su Chrome/Edge/Android',
      },
      { type: 'new', text: 'Suggerimento installazione PWA per Safari iOS' },
      {
        type: 'security',
        text: '/api/* forzato in NetworkOnly: i dati live non vengono mai cached',
      },
    ],
  },
  {
    version: '0.2.0',
    date: '28 aprile 2026',
    title: 'Layout, routing e documentazione',
    entries: [
      { type: 'new', text: 'Header condiviso con logo personalizzato' },
      {
        type: 'new',
        text: 'Routing hash-based per pagine multiple (#/dashboard, #/docs)',
      },
      {
        type: 'new',
        text: 'Pagina Documentazione separata con guida completa',
      },
      { type: 'new', text: 'Footer con link al codice sorgente su GitHub' },
    ],
  },
  {
    version: '0.1.0',
    date: '28 aprile 2026',
    title: 'Prima release · MVP',
    entries: [
      {
        type: 'new',
        text: 'Dashboard live: stato linea, banda real-time, dispositivi LAN, sistema',
      },
      {
        type: 'new',
        text: 'Gestione Wi-Fi: visualizza reti, cambia password, accendi/spegni',
      },
      {
        type: 'new',
        text: 'Autenticazione FreeboxOS v8 con HMAC-SHA1 challenge-response',
      },
      {
        type: 'new',
        text: 'Polling automatico con refresh sessione (auto-relogin)',
      },
      {
        type: 'new',
        text: 'Design sobrio bianco/nero/rosso, palette Tailwind formale',
      },
      {
        type: 'new',
        text: 'Proxy Vite per evitare CORS in dev (mafreebox.freebox.fr)',
      },
    ],
  },
]

export function ChangelogPage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-6 py-8 space-y-8">
      <div className="bg-white border border-gray-200 rounded-[10px] shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="border-l-2 border-red-600 pl-3">
            <h1 className="text-base font-semibold text-black uppercase tracking-wider">
              Changelog
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Cronologia degli aggiornamenti, dal più recente al più vecchio
            </p>
          </div>
        </div>

        <div className="px-6 py-4 flex flex-wrap gap-3 text-[11px] text-gray-600">
          <Legend type="new" label="Nuova feature" />
          <Legend type="changed" label="Modifica" />
          <Legend type="fixed" label="Fix" />
          <Legend type="security" label="Sicurezza" />
        </div>
      </div>

      <ol className="space-y-0">
        {RELEASES.map((r, idx) => {
          const isLast = idx === RELEASES.length - 1
          return (
            <li
              key={r.version}
              className="grid grid-cols-[auto_1fr] gap-x-5"
            >
              <div className="relative flex flex-col items-center w-3">
                <span
                  className={`relative z-10 w-3 h-3 rounded-[10px] mt-2 ring-4 ring-neutral-100 ${
                    r.current
                      ? 'bg-red-600 border-2 border-red-700'
                      : 'bg-white border-2 border-gray-400'
                  }`}
                />
                {!isLast && (
                  <span className="flex-1 w-px bg-gray-300 -mt-1" />
                )}
              </div>

              <div className={isLast ? '' : 'pb-8'}>
                <div className="mb-3 flex items-baseline justify-between gap-3 flex-wrap">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h2 className="text-base font-semibold text-black tabular-nums">
                      v{r.version}
                    </h2>
                    {r.current && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-red-600 text-white rounded-[10px] font-semibold">
                        Attuale
                      </span>
                    )}
                    <span className="text-[11px] text-gray-700 uppercase tracking-wider">
                      {r.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500 tabular-nums">
                    {r.date}
                  </span>
                </div>

                <ul className="bg-white border border-gray-200 rounded-[10px] shadow-sm divide-y divide-gray-100">
                  {r.entries.map((e, i) => (
                    <li
                      key={i}
                      className="px-4 py-2.5 flex items-start gap-3"
                    >
                      <TypeBadge type={e.type} />
                      <span className="text-[13px] text-gray-700 leading-relaxed flex-1">
                        {e.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          )
        })}
      </ol>
    </main>
  )
}

function TypeBadge({ type }: { type: ChangeType }) {
  const config = TYPE_CONFIG[type]
  return (
    <span
      className={`shrink-0 text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-[10px] border ${config.classes}`}
      style={{ minWidth: '4.5rem', textAlign: 'center' }}
    >
      {config.label}
    </span>
  )
}

function Legend({ type, label }: { type: ChangeType; label: string }) {
  const config = TYPE_CONFIG[type]
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-[10px] border ${config.classes}`}
      >
        {config.label}
      </span>
      <span>{label}</span>
    </span>
  )
}

const TYPE_CONFIG: Record<ChangeType, { label: string; classes: string }> = {
  new: {
    label: 'New',
    classes: 'bg-red-600 text-white border-red-700',
  },
  changed: {
    label: 'Update',
    classes: 'bg-gray-100 text-black border-gray-300',
  },
  fixed: {
    label: 'Fix',
    classes: 'bg-white text-gray-700 border-gray-300',
  },
  security: {
    label: 'Security',
    classes: 'bg-black text-white border-black',
  },
}
