import {
  ClockCounterClockwiseIcon,
  DownloadSimpleIcon,
  LockIcon,
  PulseIcon,
  ShieldCheckIcon,
  WifiHighIcon,
  type Icon,
} from '@phosphor-icons/react'

type Feature = {
  Icon: Icon
  title: string
  description: string
  bullets: string[]
}

const FEATURES: Feature[] = [
  {
    Icon: PulseIcon,
    title: 'Monitoraggio live',
    description:
      'Una panoramica costante della tua connessione, aggiornata ogni due secondi senza pesare sul router.',
    bullets: [
      'Stato della linea (online / offline) con indirizzo IPv4 pubblico e IPv6',
      "Banda massima della tua linea + traffico totale dall'accensione",
      'Grafico del bitrate download e upload in tempo reale (rolling window)',
      'Elenco dispositivi LAN: nome, MAC, IP, vendor, online/offline',
      'Stato del router: modello, firmware, uptime, sensori CPU/switch/HDD, ventola',
    ],
  },
  {
    Icon: WifiHighIcon,
    title: 'Gestione Wi-Fi',
    description:
      "Tutto il pannello Wi-Fi della iliadbox, con un'interfaccia decente al posto di quella di default.",
    bullets: [
      'Visualizza tutte le reti configurate (2.4 GHz, 5 GHz, ospiti)',
      'Cambia la password con validazione lunghezza (8–63) e conferma esplicita',
      'Accendi e spegni reti singolarmente',
      'Conferma extra prima di disattivare la rete principale (per evitare di tagliarti fuori)',
      'Numero di client connessi a ciascuna rete in tempo reale',
    ],
  },
  {
    Icon: ClockCounterClockwiseIcon,
    title: 'Storico',
    description:
      'Lo storico della linea preso direttamente dal database RRD del router. Niente database esterni, niente cloud.',
    bullets: [
      'Grafico storico della banda con range personalizzabile',
      'Storico delle temperature interne (CPU M, CPU B, switch, HDD)',
      'Date & time picker custom per scegliere intervalli precisi',
      'Preset rapidi: ultima ora, ultime 24 ore, ultima settimana, ultimo mese',
      'Granularità che si adatta automaticamente al periodo selezionato',
    ],
  },
  {
    Icon: ShieldCheckIcon,
    title: 'Controllo Parentale',
    description:
      "Limita l'accesso a internet per dispositivi specifici nelle fasce orarie che decidi tu.",
    bullets: [
      'Crei filtri assegnabili a uno o più dispositivi della LAN',
      'Pianificazione settimanale a granularità oraria (7 giorni × 24 ore = 168 fasce)',
      'Click & drag per dipingere intervalli da bloccare',
      'Preset rapidi: "Blocca notte (22→7)", "Blocca scuola (Lun-Ven 8→13)"',
      'Toggle on/off, modifica e eliminazione (con conferma esplicita)',
    ],
  },
  {
    Icon: DownloadSimpleIcon,
    title: 'Installazione come app (PWA)',
    description:
      "Si installa direttamente dal browser, senza app store, e si comporta come un'app nativa.",
    bullets: [
      'Pulsante "Installa app" automatico su Chrome/Edge desktop e Android',
      'Suggerimenti dedicati per Safari iOS (Aggiungi a Home dal menu Condividi)',
      'Si apre in finestra dedicata, senza barra del browser',
      "Service worker con pre-cache statico (l'interfaccia è disponibile offline)",
      'Niente caching dei dati API: i numeri che vedi sono sempre live',
    ],
  },
  {
    Icon: LockIcon,
    title: 'Privacy e sicurezza',
    description:
      "L'intero stack è progettato per non esporre nessun dato fuori dalla tua rete di casa.",
    bullets: [
      'Nessun server backend: solo browser ↔ iliadbox sulla LAN',
      'Nessun cookie di tracciamento, nessun analytics, nessun pixel',
      "Content-Security-Policy stretta + frame-ancestors 'none' (no clickjacking)",
      'Strict-Transport-Security con preload e Permissions-Policy disabilitante',
      "Modalità demo per esplorare l'interfaccia senza una iliadbox vera",
    ],
  },
]

export function FeaturesPage() {
  return (
    <main className="max-w-5xl w-full mx-auto px-6 py-8 space-y-6">
      <div className="bg-white border border-gray-200 rounded-[10px] shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="border-l-2 border-red-600 pl-3">
            <h1 className="text-base font-semibold text-black uppercase tracking-wider">
              Funzionalità
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Tutto quello che puoi fare con Iliad Network Monitor
            </p>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-[14px] text-gray-700 leading-relaxed">
            <strong className="text-black">Iliad Network Monitor</strong> è
            una dashboard locale per controllare in modo completo la tua
            connessione fibra Iliad e gestire il router. Tutto avviene fra il
            browser e la iliadbox di casa: niente server esterni, niente
            cloud, nessun dato che esce dalla rete locale.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {FEATURES.map((f) => (
          <FeatureCard key={f.title} feature={f} />
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-[10px] shadow-sm px-6 py-5 text-center">
        <p className="text-[13px] text-gray-700 leading-relaxed">
          Vuoi provare l'interfaccia senza una iliadbox?{' '}
          <a href="#/" className="text-red-700 underline font-medium">
            Avvia la modalità demo
          </a>{' '}
          dalla home — i dati mostrati sono simulati ma il flusso è lo stesso
          dell'app reale.
        </p>
      </div>
    </main>
  )
}

function FeatureCard({ feature }: { feature: Feature }) {
  const { Icon } = feature
  return (
    <div className="bg-white border border-gray-200 rounded-[10px] shadow-sm h-full">
      <div className="border-b border-gray-200 px-5 py-4 flex items-center gap-3">
        <Icon
          weight="fill"
          className="w-12 h-12 text-black shrink-0"
        />
        <h2 className="text-sm font-semibold text-black uppercase tracking-wider">
          {feature.title}
        </h2>
      </div>

      <div className="px-5 py-4 space-y-3">
        <p className="text-[13px] text-gray-700 leading-relaxed">
          {feature.description}
        </p>
        <ul className="text-[12px] text-gray-700 leading-relaxed space-y-1 list-disc pl-4">
          {feature.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
