export function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-8">
      <div className="bg-white border border-gray-200 rounded shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="border-l-2 border-red-600 pl-3">
            <h1 className="text-base font-semibold text-black uppercase tracking-wider">
              Termini d'uso
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Ultimo aggiornamento: 28 aprile 2026
            </p>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          <Section title="In sintesi">
            <p>
              Questa applicazione è gratuita e open source. La usi così com'è,
              a tuo rischio. Non garantiamo che sia priva di bug né sempre
              disponibile.
            </p>
          </Section>

          <Section title="Cosa fa l'applicazione">
            <p>
              <strong>Iliad Network Monitor</strong> è una dashboard che
              monitora lo stato della tua connessione fibra Iliad e permette
              di gestire alcune impostazioni della iliadbox tramite l'API
              ufficiale FreeboxOS v8. Funziona solo se sei collegato alla rete
              locale della tua iliadbox.
            </p>
          </Section>

          <Section title="Esclusione di garanzia">
            <p>
              L'applicazione è fornita "così com'è" e "come disponibile",
              senza alcuna garanzia, esplicita o implicita. In particolare non
              garantiamo:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Che funzioni senza errori o interruzioni</li>
              <li>
                Che sia compatibile con la versione di firmware della tua
                iliadbox o con eventuali revisioni future dell'API FreeboxOS
              </li>
              <li>Che sia disponibile in modo continuo</li>
              <li>
                Che le modifiche apportate alle impostazioni della iliadbox
                (ad esempio il cambio password Wi-Fi o l'attivazione di
                regole di controllo parentale) abbiano sempre l'effetto
                atteso
              </li>
            </ul>
          </Section>

          <Section title="Limitazione di responsabilità">
            <p>
              Nei limiti consentiti dalla legge, il manutentore di questo
              progetto non è responsabile per:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>
                Danni diretti o indiretti derivanti dall'uso (o dall'impossibilità
                di uso) dell'applicazione
              </li>
              <li>
                Perdite di connettività della tua rete causate da impostazioni
                modificate tramite la dashboard
              </li>
              <li>
                Disservizi del fornitore di hosting o della tua iliadbox
              </li>
              <li>
                Modifiche dell'API FreeboxOS che rendano inutilizzabili alcune
                funzioni
              </li>
            </ul>
          </Section>

          <Section title="Rapporto con Iliad">
            <p>
              L'applicazione utilizza un'API pubblicamente documentata da
              Iliad ma <strong>non è prodotta né supportata da Iliad</strong>.
              Non esiste alcun rapporto commerciale o di affiliazione tra
              questo progetto e Iliad Italia, Free SAS o le società del
              gruppo. I marchi "Iliad" e "Freebox" appartengono ai rispettivi
              titolari e sono citati in questa applicazione esclusivamente per
              indicare i prodotti con cui essa interagisce.
            </p>
          </Section>

          <Section title="Software open source">
            <p>
              Il codice sorgente è disponibile pubblicamente: puoi consultarlo,
              segnalare bug, contribuire o forkare il progetto. Il link al
              repository è nel footer della pagina; la licenza specifica è
              indicata nel file <Code>LICENSE</Code> del repository.
            </p>
          </Section>

          <Section title="Modifiche ai termini">
            <p>
              Eventuali modifiche verranno pubblicate qui aggiornando la data
              in cima.
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
