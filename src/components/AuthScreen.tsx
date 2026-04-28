import { WaveSineIcon } from '@phosphor-icons/react'
import type { AuthState } from '../hooks/useFreeboxAuth'
import { useInternetStatus } from '../hooks/useInternetStatus'
import { DevSetupCard } from './DevSetupCard'
import { LanLinkCard } from './LanLinkCard'
import { FloatingPathsBackground } from './ui/floating-paths'
import { IosInstallHint } from './IosInstallHint'

type Props = {
  state: AuthState
  onStart: () => void
  onStartDemo: () => void
  onReset: () => void
  onImportToken: (token: string) => void
}

export function AuthScreen({
  state,
  onStart,
  onStartDemo,
  onReset,
  onImportToken,
}: Props) {
  const internet = useInternetStatus()
  const isHttps = window.location.protocol === 'https:'

  const handleImportFile = async (file: File) => {
    const text = await file.text()
    const token = parseTokenBackup(text)
    onImportToken(token)
  }

  return (
    <FloatingPathsBackground
      position={-1}
      className="flex-1 flex flex-col items-center justify-center px-6 py-10"
    >
      <div className="w-full max-w-md space-y-4 relative z-10">
        <IosInstallHint />
        <LanLinkCard />
        <DevSetupCard />
        {(internet === 'offline' || isHttps) && (
          <div className="w-full bg-amber-50 border border-amber-200 rounded-[10px] px-4 py-3 text-[12px] text-amber-950 leading-relaxed">
            <p className="font-semibold mb-1">
              {internet === 'offline'
                ? 'Internet non disponibile'
                : 'Modalità pubblica (HTTPS)'}
            </p>
            <p>
              Per collegarti alla iliadbox serve una versione{' '}
              <strong>in LAN</strong> (HTTP), perché il router espone l’API
              localmente e il browser blocca le chiamate da HTTPS verso HTTP.
              Se sei sulla Wi‑Fi della iliadbox, apri la webapp dal tuo Mac
              (es. <code className="font-mono">http://&lt;nome-mac&gt;.local:8080</code>)
              e la dashboard funzionerà anche quando la WAN è giù.
            </p>
            <div className="flex gap-2 mt-3">
              <a
                href="#/docs"
                className="flex-1 text-center py-2 bg-black hover:bg-gray-800 text-white text-[11px] font-medium uppercase tracking-wide rounded-[10px] transition-colors"
              >
                Guida LAN
              </a>
              <button
                onClick={onStartDemo}
                className="flex-1 text-center py-2 border border-amber-300 hover:bg-amber-100 text-amber-950 text-[11px] font-medium uppercase tracking-wide rounded-[10px] transition-colors"
              >
                Usa demo
              </button>
            </div>
          </div>
        )}
        <div className="w-full bg-white border border-gray-200 rounded-[10px] shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="border-l-2 border-red-600 pl-3 min-w-0">
                <h1 className="text-base font-semibold text-black uppercase tracking-wider">
                  Iliad Network Monitor
                </h1>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Autenticazione iliadbox
                </p>
              </div>
              <WaveSineIcon
                weight="fill"
                className="w-12 h-12 text-black shrink-0"
              />
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
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium uppercase tracking-wide rounded-[10px] transition-colors"
                >
                  Avvia autenticazione
                </button>

                <div className="flex items-center gap-3 my-4">
                  <span className="flex-1 h-px bg-gray-200" />
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                    oppure
                  </span>
                  <span className="flex-1 h-px bg-gray-200" />
                </div>

                <button
                  onClick={onStartDemo}
                  className="w-full py-2.5 border border-gray-300 hover:border-black hover:bg-gray-50 text-gray-700 text-sm font-medium uppercase tracking-wide rounded-[10px] transition-colors"
                >
                  Prova in modalità demo
                </button>

                <ImportTokenButton onImport={handleImportFile} />
                <p className="text-[11px] text-gray-500 mt-2 text-center leading-relaxed">
                  La modalità demo mostra dati simulati per esplorare
                  l'interfaccia senza una iliadbox.
                </p>

                <p className="text-[11px] text-gray-500 mt-6 text-center leading-relaxed">
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
                <div className="border-l-2 border-red-600 bg-gray-50 rounded-[10px] px-4 py-3">
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
                  className="w-full py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-medium uppercase tracking-wide rounded-[10px] transition-colors"
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
                  className="w-full py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-medium uppercase tracking-wide rounded-[10px] transition-colors"
                >
                  Riprova
                </button>
              </div>
            )}

            {state.phase === 'error' && (
              <div className="space-y-4">
                <div className="border-l-2 border-red-600 bg-gray-50 rounded-[10px] px-4 py-3">
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
                    className="flex-1 py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-medium uppercase tracking-wide rounded-[10px] transition-colors"
                  >
                    Riprova
                  </button>
                  <button
                    onClick={onReset}
                    className="flex-1 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium uppercase tracking-wide rounded-[10px] transition-colors"
                  >
                    Reset token
                  </button>
                </div>
                <ImportTokenButton onImport={handleImportFile} />
              </div>
            )}
          </div>
        </div>
      </div>
    </FloatingPathsBackground>
  )
}

function ImportTokenButton({
  onImport,
}: {
  onImport: (file: File) => void | Promise<void>
}) {
  return (
    <label className="block w-full mt-3">
      <input
        type="file"
        accept="application/json,text/plain"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) return
          void Promise.resolve(onImport(file)).finally(() => {
            // Allow importing the same file twice.
            e.currentTarget.value = ''
          })
        }}
      />
      <span className="block w-full text-center py-2.5 border border-gray-300 hover:border-black hover:bg-gray-50 text-gray-700 text-sm font-medium uppercase tracking-wide rounded-[10px] transition-colors cursor-pointer">
        Importa accesso (backup)
      </span>
    </label>
  )
}

function parseTokenBackup(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) throw new Error('Backup vuoto')
  if (trimmed.startsWith('{')) {
    const parsed = JSON.parse(trimmed) as { app_token?: unknown }
    if (typeof parsed.app_token === 'string' && parsed.app_token.trim()) {
      return parsed.app_token.trim()
    }
  }
  // Fallback: allow importing a plain token string.
  return trimmed
}
