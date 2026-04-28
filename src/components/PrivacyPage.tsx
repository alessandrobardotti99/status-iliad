export function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-8">
      <div className="bg-white border border-gray-200 rounded shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="border-l-2 border-red-600 pl-3">
            <h1 className="text-base font-semibold text-black uppercase tracking-wider">
              Privacy Policy
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Ultimo aggiornamento: 28 aprile 2026
            </p>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          <Section title="In sintesi">
            <p>
              Questa applicazione gira interamente nel tuo browser e parla
              esclusivamente con la tua iliadbox sulla rete locale di casa.
              Nessun dato esce dalla tua rete: non ci sono server esterni, non
              c'è analytics, non c'è tracciamento.
            </p>
          </Section>

          <Section title="Cosa salviamo nel tuo browser">
            <p>
              Per funzionare, l'applicazione memorizza tre piccole informazioni
              nel <Code>localStorage</Code> del browser:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>
                <Code>iliadbox.app_token</Code> — la chiave d'accesso
                rilasciata dalla tua iliadbox la prima volta che hai
                autorizzato l'app premendo il tasto sul router. Senza questa
                chiave dovresti rifare la procedura ad ogni avvio.
              </li>
              <li>
                <Code>iliadbox.demo</Code> — un flag che indica se sei in
                modalità demo (i dati mostrati sono simulati).
              </li>
              <li>
                <Code>iliadbox.ios_hint_dismissed</Code> — ricorda se hai
                chiuso il suggerimento di installazione PWA su iOS.
              </li>
            </ul>
            <p className="mt-2">
              Questi dati restano sul tuo dispositivo. Nessuno li legge tranne
              il browser stesso e l'applicazione quando la apri. Puoi
              cancellarli in qualsiasi momento svuotando i dati del sito dal
              browser.
            </p>
          </Section>

          <Section title="Cosa elabora la iliadbox">
            <p>
              Quando la dashboard mostra dispositivi connessi, indirizzi IP,
              MAC address, statistiche di traffico o nomi delle reti Wi-Fi,
              sono dati elaborati dalla tua <strong>iliadbox</strong>, hardware
              fornito da Iliad. Iliad è il titolare del trattamento di questi
              dati. Per i dettagli consulta la{' '}
              <a
                href="https://www.iliad.it/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-700 underline"
              >
                Privacy Policy di Iliad
              </a>
              .
            </p>
          </Section>

          <Section title="Cosa NON facciamo">
            <ul className="list-disc pl-5 space-y-1">
              <li>Nessun cookie di tracciamento</li>
              <li>
                Nessuno strumento di analytics (no Google Analytics, no
                Plausible, no nulla)
              </li>
              <li>Nessuna comunicazione con server di terze parti</li>
              <li>Nessuna profilazione</li>
              <li>Nessun pixel pubblicitario</li>
            </ul>
            <p className="mt-2">
              L'unica connessione di rete che l'applicazione apre, oltre a
              quella verso la tua iliadbox, è il caricamento iniziale dei file
              statici (HTML/CSS/JavaScript) dal server che ospita il sito.
            </p>
          </Section>

          <Section title="Hosting del sito">
            <p>
              La versione pubblica di questa applicazione è ospitata da{' '}
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-700 underline"
              >
                Vercel Inc.
              </a>{' '}
              su <Code>status-iliad.vercel.app</Code>. Vercel registra nei
              propri log tecnici l'indirizzo IP, la richiesta HTTP, lo
              user-agent e altri metadata standard, per il tempo necessario a
              gestire il servizio (CDN, edge caching, anti-abuso). Questo
              trattamento è coperto dalla{' '}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-700 underline"
              >
                privacy policy di Vercel
              </a>{' '}
              e non da noi.
            </p>
            <p className="mt-2">
              Se installi l'applicazione come PWA sul tuo dispositivo, dopo il
              primo download dei file statici il funzionamento è interamente
              locale: nessun traffico verso Vercel se non quando il browser
              cerca un eventuale aggiornamento dell'app.
            </p>
          </Section>

          <Section title="Come revocare l'accesso">
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                Per cancellare la chiave salvata nel browser: premi{' '}
                <strong>Disconnetti</strong> nell'header.
              </li>
              <li>
                Per revocare anche l'autorizzazione lato iliadbox: vai su{' '}
                <a
                  href="http://mafreebox.freebox.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-700 underline"
                >
                  mafreebox.freebox.fr
                </a>{' '}
                → <em>Impostazioni</em> → <em>Gestione degli accessi</em> →
                rimuovi <em>"Iliad Network Monitor"</em>.
              </li>
            </ol>
          </Section>

          <Section title="Modifiche a questa informativa">
            <p>
              Eventuali modifiche verranno pubblicate qui aggiornando la data
              in cima. È sempre la versione attualmente visibile su questo
              sito.
            </p>
          </Section>

          <Section title="Contatti">
            <p>
              Per domande relative a questa informativa o all'esercizio dei
              diritti previsti dal GDPR (artt. 15-22), apri una issue sul
              repository GitHub linkato nel footer.
            </p>
          </Section>
        </div>
      </div>
    </main>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="text-[13px] text-gray-700 leading-relaxed">
      <h2 className="text-[11px] font-semibold text-black uppercase tracking-wider mb-2">
        {title}
      </h2>
      {children}
    </div>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 border border-gray-200 rounded">
      {children}
    </code>
  )
}
