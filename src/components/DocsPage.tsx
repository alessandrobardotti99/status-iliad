import { HowItWorks } from './HowItWorks'
import { REPO_URL } from '../lib/links'

export function DocsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
      <div className="bg-white border border-gray-200 rounded-[10px] shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="border-l-2 border-red-600 pl-3">
            <h1 className="text-base font-semibold text-black uppercase tracking-wider">
              Documentazione
            </h1>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Guida completa all'uso dell'applicazione
            </p>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          <Section title="Prima di iniziare">
            <ul className="text-[13px] text-gray-700 space-y-1.5 list-disc pl-5 leading-relaxed">
              <li>
                Devi essere collegato alla rete di casa (Wi-Fi della
                iliadbox o cavo di rete). Da fuori casa l'app non funziona.
              </li>
              <li>
                Devi poter raggiungere fisicamente la iliadbox per premere
                un tasto sul suo schermo.
              </li>
              <li>
                Non serve installare nulla sul router e non servono
                password.
              </li>
            </ul>
          </Section>

          <Section title="Usarla anche senza Internet (WAN giù)">
            <div className="text-[13px] text-gray-700 space-y-3 leading-relaxed">
              <p>
                Se la WAN è giù ma sei collegato alla Wi‑Fi della iliadbox,
                le API del router funzionano comunque in <strong>rete locale</strong>.
                Per questo però la webapp deve essere servita da un
                dispositivo nella tua LAN (non da un sito pubblico).
              </p>
              <p>
                Con solo un Mac, la soluzione più semplice è usare il Mac
                come “mini‑server” in casa: lo apri una volta e poi, dal
                telefono, visiti sempre lo stesso link in LAN.
              </p>
              <ul className="space-y-1.5 list-disc pl-5">
                <li>
                  Installa Docker Desktop sul Mac (una volta sola).
                </li>
                <li>
                  Avvia il server in LAN (chi sviluppa può usare{' '}
                  <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 border border-gray-200 rounded-[10px]">
                    docker compose up -d
                  </code>
                  ).
                </li>
                <li>
                  Dal telefono (stessa Wi‑Fi) apri:{' '}
                  <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 border border-gray-200 rounded-[10px]">
                    http://&lt;nome-mac&gt;.local:8080
                  </code>
                </li>
                <li>
                  Per renderlo “un link fisso”: imposta il “Nome computer”
                  in macOS (Generali → Condivisione) e salva quel link tra i
                  preferiti.
                </li>
              </ul>
              <p className="text-[12px] text-gray-500">
                Nota: se il Mac è spento o in stop profondo, il link non
                risponde. Per un uso “always‑on” serve un dispositivo sempre
                acceso (Raspberry/NAS/mini‑PC).
              </p>
            </div>
          </Section>

          <Section title="Per sviluppatori (repo)">
            <div className="text-[13px] text-gray-700 space-y-3 leading-relaxed">
              <p>
                Se preferisci “fare da te”, puoi clonare la repo e servire la
                webapp in LAN. Quando la WAN è giù, i dati arrivano lo stesso
                perché la iliadbox è raggiungibile in rete locale.
              </p>
              <p>
                Repository:{' '}
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-700 underline"
                >
                  {REPO_URL}
                </a>
              </p>

              <div>
                <p className="text-[12px] text-gray-500 uppercase tracking-wider mb-2">
                  Docker (consigliato)
                </p>
                <pre className="font-mono text-[11px] bg-gray-50 border border-gray-200 rounded-[10px] px-3 py-2 whitespace-pre-wrap">
                  {`git clone ${REPO_URL}
cd status-iliad
docker compose up -d`}
                </pre>
              </div>

              <div>
                <p className="text-[12px] text-gray-500 uppercase tracking-wider mb-2">
                  Senza Docker (Mac)
                </p>
                <p className="text-[12px] text-gray-600 leading-relaxed mb-2">
                  Se non vuoi Docker, puoi avviare un piccolo server locale
                  che serve la build e fa da proxy <code className="font-mono">/api</code>{' '}
                  verso la iliadbox.
                </p>
                <pre className="font-mono text-[11px] bg-gray-50 border border-gray-200 rounded-[10px] px-3 py-2 whitespace-pre-wrap">
                  {`pnpm install
pnpm lan`}
                </pre>
                <p className="text-[12px] text-gray-500 leading-relaxed mt-2">
                  In alternativa, doppio click su{' '}
                  <code className="font-mono">scripts/mac-lan-start-no-docker.command</code>.
                </p>
              </div>

              <div>
                <p className="text-[12px] text-gray-500 uppercase tracking-wider mb-2">
                  Dev server
                </p>
                <pre className="font-mono text-[11px] bg-gray-50 border border-gray-200 rounded-[10px] px-3 py-2 whitespace-pre-wrap">
                  {`pnpm install
pnpm dev`}
                </pre>
              </div>

              <p className="text-[12px] text-gray-500">
                Nota: <code className="font-mono">localhost</code> funziona
                solo sul tuo computer. Per aprirlo dal telefono devi usare
                l’IP del Mac o <code className="font-mono">.local</code>.
              </p>
            </div>
          </Section>

          <Section title="Cosa fare la prima volta">
            <ol className="text-[13px] text-gray-700 space-y-1.5 list-decimal pl-5 leading-relaxed">
              <li>
                Torna alla{' '}
                <a href="#/" className="text-red-700 underline">
                  pagina iniziale
                </a>{' '}
                e premi <span className="font-semibold">Avvia
                autenticazione</span>.
              </li>
              <li>
                Vai vicino alla iliadbox: sul piccolo schermo del router
                comparirà la scritta{' '}
                <em>"Iliad Network Monitor — Autorizzare?"</em>.
              </li>
              <li>
                Usa la rotella (o le frecce) del router per scegliere{' '}
                <span className="font-semibold">Sì</span> e premi il tasto
                di conferma. Hai circa 30 secondi.
              </li>
              <li>
                Torna al computer: la dashboard si apre da sola, senza dover
                fare altro.
              </li>
            </ol>
            <p className="text-[12px] text-gray-500 mt-3 leading-relaxed">
              Questo passaggio si fa una volta sola. Le volte successive che
              apri l'app, entri direttamente nella dashboard.
            </p>
          </Section>

          <Section title="Per cambiare la password Wi-Fi">
            <p className="text-[13px] text-gray-700 leading-relaxed mb-2">
              Per leggere lo stato della linea bastano i permessi base, ma
              per <strong>modificare la password Wi-Fi</strong> o{' '}
              <strong>accendere/spegnere una rete</strong> l'app deve avere
              il permesso "Modifica impostazioni".
            </p>
            <p className="text-[13px] text-gray-700 leading-relaxed mb-2">
              Se nella sezione Wi-Fi vedi scritto <em>"Sola lettura"</em>:
            </p>
            <ol className="text-[13px] text-gray-700 space-y-1 list-decimal pl-5 leading-relaxed">
              <li>
                Apri il browser su{' '}
                <a
                  href="http://mafreebox.freebox.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-700 underline"
                >
                  mafreebox.freebox.fr
                </a>
                .
              </li>
              <li>Entra con il tuo account Iliad.</li>
              <li>
                Cerca la sezione <em>"Gestione degli accessi"</em>.
              </li>
              <li>
                Trova l'app <em>"Iliad Network Monitor"</em> nell'elenco.
              </li>
              <li>
                Abilita la voce{' '}
                <em>"Modifica delle impostazioni della Freebox"</em>.
              </li>
              <li>
                Torna sull'app: il pulsante "Cambia password" diventa
                attivo.
              </li>
            </ol>
          </Section>

          <Section title="Se qualcosa non funziona">
            <dl className="text-[13px] text-gray-700 space-y-3 leading-relaxed">
              <div>
                <dt className="font-semibold text-black">
                  Vedo scritto "iliadbox non raggiungibile"
                </dt>
                <dd className="text-gray-600 mt-0.5">
                  Significa che il computer non riesce a parlare con il
                  router. Controlla di essere collegato alla Wi-Fi di casa
                  (non a quella di un vicino o ai dati del cellulare) e che
                  il router sia acceso e con le luci normali.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-black">
                  Vedo scritto "Autorizzazione rifiutata"
                </dt>
                <dd className="text-gray-600 mt-0.5">
                  Sul router hai scelto "No" oppure hai premuto il tasto
                  sbagliato. Premi di nuovo "Avvia autenticazione" e
                  riprova.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-black">
                  Vedo scritto "Tempo scaduto"
                </dt>
                <dd className="text-gray-600 mt-0.5">
                  Il router aspetta solo una trentina di secondi prima di
                  rinunciare. Premi di nuovo e questa volta vai subito a
                  confermare sul router.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-black">
                  Voglio togliere l'accesso a questa app
                </dt>
                <dd className="text-gray-600 mt-0.5">
                  Vai sul pannello del router (di solito{' '}
                  <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 border border-gray-200 rounded-[10px]">
                    mafreebox.freebox.fr
                  </code>{' '}
                  dal browser) e cerca la sezione{' '}
                  <em>"Gestione degli accessi"</em>: lì puoi cancellare
                  l'app in qualsiasi momento.
                </dd>
              </div>
            </dl>
          </Section>
        </div>
      </div>

      <HowItWorks />
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
    <div>
      <h2 className="text-[11px] font-semibold text-black uppercase tracking-wider mb-2">
        {title}
      </h2>
      {children}
    </div>
  )
}
