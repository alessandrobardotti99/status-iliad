import type { AuthState } from '../hooks/useFreeboxAuth'
import { HowItWorks } from './HowItWorks'

type Props = {
  state: AuthState
  onStart: () => void
  onReset: () => void
}

export function AuthScreen({ state, onStart, onReset }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="border-l-2 border-red-600 pl-3">
              <h1 className="text-base font-semibold text-black uppercase tracking-wider">
                Iliad Network Monitor
              </h1>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Autenticazione iliadbox
              </p>
            </div>
          </div>

          <div className="px-6 py-6">
            {state.phase === 'idle' && (
              <>
                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                  Per iniziare il monitoraggio è necessario autorizzare
                  l'applicazione sulla iliadbox. Verrà richiesta una conferma
                  fisica sul display del router.
                </p>
                <button
                  onClick={onStart}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium uppercase tracking-wide transition-colors"
                >
                  Avvia autenticazione
                </button>
              </>
            )}

            {state.phase === 'requesting' && (
              <p className="text-sm text-gray-700">Richiesta in corso…</p>
            )}

            {state.phase === 'pending' && (
              <div className="space-y-4">
                <div className="border-l-2 border-red-600 bg-gray-50 px-4 py-3">
                  <p className="text-sm font-semibold text-black mb-1">
                    Conferma richiesta sul router
                  </p>
                  <p className="text-xs text-gray-700 wrap-break-word leading-relaxed">
                    Premere il tasto sul display della iliadbox per autorizzare
                    l'applicazione "Iliad Network Monitor".
                  </p>
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  In attesa di autorizzazione…
                </p>
              </div>
            )}

            {state.phase === 'denied' && (
              <div className="space-y-4">
                <p className="text-sm text-red-700 font-medium">
                  Autorizzazione rifiutata.
                </p>
                <button
                  onClick={onStart}
                  className="w-full py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-medium uppercase tracking-wide transition-colors"
                >
                  Riprova
                </button>
              </div>
            )}

            {state.phase === 'timeout' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-700">
                  Tempo scaduto. Nessuna risposta dalla iliadbox.
                </p>
                <button
                  onClick={onStart}
                  className="w-full py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-medium uppercase tracking-wide transition-colors"
                >
                  Riprova
                </button>
              </div>
            )}

            {state.phase === 'error' && (
              <div className="space-y-4">
                <div className="border-l-2 border-red-600 bg-gray-50 px-4 py-3">
                  <p className="text-sm font-semibold text-black mb-1">
                    Errore
                  </p>
                  <p className="text-xs text-gray-700 wrap-break-word leading-relaxed">
                    {state.error ?? 'Errore sconosciuto'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Verificare che la iliadbox sia raggiungibile su{' '}
                    <code className="font-mono">mafreebox.freebox.fr</code>.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onStart}
                    className="flex-1 py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-medium uppercase tracking-wide transition-colors"
                  >
                    Riprova
                  </button>
                  <button
                    onClick={onReset}
                    className="flex-1 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium uppercase tracking-wide transition-colors"
                  >
                    Reset token
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <HowItWorks />

        <Documentation />
      </div>
    </div>
  )
}

function Documentation() {
  return (
    <div className="bg-white border border-gray-200">
      <div className="border-b border-gray-200 px-5 py-3">
        <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Guida · Come collegarsi alla iliadbox
        </h2>
      </div>

      <div className="px-5 py-5 space-y-5">
        <Section title="Prima di iniziare">
          <ul className="text-[13px] text-gray-700 space-y-1.5 list-disc pl-5 leading-relaxed">
            <li>
              Devi essere collegato alla rete di casa (Wi-Fi della iliadbox o
              cavo di rete).
            </li>
            <li>
              Devi poter raggiungere fisicamente la iliadbox per premere un
              tasto sul suo schermo.
            </li>
            <li>
              Non serve installare nulla sul router e non servono password.
            </li>
          </ul>
        </Section>

        <Section title="Cosa fare passo per passo">
          <ol className="text-[13px] text-gray-700 space-y-1.5 list-decimal pl-5 leading-relaxed">
            <li>
              Premi il pulsante{' '}
              <span className="font-semibold">Avvia autenticazione</span> qui
              sopra.
            </li>
            <li>
              Vai vicino alla iliadbox. Sul piccolo schermo del router vedrai
              comparire la scritta{' '}
              <em>"Iliad Network Monitor — Autorizzare?"</em>.
            </li>
            <li>
              Usa la rotella o le frecce del router per scegliere{' '}
              <span className="font-semibold">Sì</span> e premi il tasto di
              conferma. Hai circa 30 secondi di tempo.
            </li>
            <li>
              Torna al computer: la dashboard si apre da sola, senza dover fare
              altro.
            </li>
          </ol>
          <p className="text-[12px] text-gray-500 mt-3 leading-relaxed">
            Questo passaggio si fa una volta sola. Le volte successive che
            apri l'app, entri direttamente nella dashboard.
          </p>
        </Section>

        <Section title="Se qualcosa non funziona">
          <dl className="text-[13px] text-gray-700 space-y-3 leading-relaxed">
            <div>
              <dt className="font-semibold text-black">
                Vedo scritto "iliadbox non raggiungibile"
              </dt>
              <dd className="text-gray-600 mt-0.5">
                Significa che il computer non riesce a parlare con il router.
                Controlla di essere collegato alla Wi-Fi di casa (non a quella
                di un vicino o ai dati del cellulare) e che il router sia
                acceso e con le luci normali.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-black">
                Vedo scritto "Autorizzazione rifiutata"
              </dt>
              <dd className="text-gray-600 mt-0.5">
                Sul router hai scelto "No" oppure hai premuto il tasto
                sbagliato. Premi di nuovo "Avvia autenticazione" e riprova.
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
                <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 border border-gray-200">
                  mafreebox.freebox.fr
                </code>{' '}
                dal browser) e cerca la sezione{' '}
                <em>"Gestione degli accessi"</em>: lì puoi cancellare l'app in
                qualsiasi momento.
              </dd>
            </div>
          </dl>
        </Section>
      </div>
    </div>
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
      <h3 className="text-[11px] font-semibold text-black uppercase tracking-wider mb-2">
        {title}
      </h3>
      {children}
    </div>
  )
}
