import type { AuthState } from '../hooks/useFreeboxAuth'
import { IosInstallHint } from './IosInstallHint'

type Props = {
  state: AuthState
  onStart: () => void
  onReset: () => void
}

export function AuthScreen({ state, onStart, onReset }: Props) {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-md space-y-4">
        <IosInstallHint />
      <div className="w-full bg-white border border-gray-200">
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
              <p className="text-[11px] text-gray-500 mt-4 text-center leading-relaxed">
                Per saperne di più consulta la{' '}
                <a href="#/docs" className="text-red-700 underline">
                  documentazione
                </a>
                .
              </p>
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
                <p className="text-sm font-semibold text-black mb-1">Errore</p>
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
      </div>
    </main>
  )
}
