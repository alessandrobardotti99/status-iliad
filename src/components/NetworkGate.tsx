import { WifiSlashIcon } from '@phosphor-icons/react'
import type { Route } from '../hooks/useRoute'
import { clearNetworkCheckCache } from '../hooks/useNetworkCheck'
import { FloatingPathsBackground } from './ui/floating-paths'

type Props = {
  onStartDemo: () => void
  onNavigate: (to: Route) => void
}

export function NetworkGate({ onStartDemo, onNavigate }: Props) {
  const retry = () => {
    clearNetworkCheckCache()
    window.location.reload()
  }

  return (
    <FloatingPathsBackground
      position={-1}
      className="flex-1 flex flex-col items-center justify-center px-6 py-10"
    >
      <div className="w-full max-w-md space-y-4 relative z-10">
        <div className="w-full bg-white border border-gray-200 rounded-[10px] shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="border-l-2 border-red-600 pl-3 min-w-0">
                <h1 className="text-base font-semibold text-black uppercase tracking-wider">
                  Rete Iliad non rilevata
                </h1>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Devi essere collegato alla tua iliadbox
                </p>
              </div>
              <WifiSlashIcon weight="fill" className="w-12 h-12 text-red-600 shrink-0" />
            </div>
          </div>

          <div className="px-6 py-6 space-y-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-black">Iliad Network Monitor</strong>{' '}
              parla direttamente con la tua iliadbox via rete locale. In
              questo momento non rilevo nessuna iliadbox raggiungibile dal
              tuo dispositivo.
            </p>

            <div className="border-l-2 border-red-600 bg-gray-50 rounded-[10px] px-4 py-3 text-[12px] text-gray-700 leading-relaxed">
              <p className="font-semibold text-black mb-1">
                Cosa puoi fare
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  Collegati alla Wi-Fi (o all'Ethernet) della tua iliadbox
                  e ricarica la pagina.
                </li>
                <li>
                  Verifica che il router sia acceso e che la pagina
                  <code className="font-mono text-[11px] bg-gray-100 px-1 py-0.5 border border-gray-200 rounded mx-1">
                    myiliadbox.iliad.it
                  </code>
                  sia raggiungibile dal tuo browser.
                </li>
                <li>
                  Se non hai una linea Iliad, puoi comunque esplorare
                  l'interfaccia in modalità demo.
                </li>
              </ul>
            </div>

            <button
              onClick={retry}
              className="w-full py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-medium uppercase tracking-wide rounded-[10px] transition-colors"
            >
              Riprova
            </button>

            <div className="flex items-center gap-3 my-2">
              <span className="flex-1 h-px bg-gray-200" />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                oppure
              </span>
              <span className="flex-1 h-px bg-gray-200" />
            </div>

            <button
              onClick={onStartDemo}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium uppercase tracking-wide rounded-[10px] transition-colors"
            >
              Prova in modalità demo
            </button>

            <p className="text-[11px] text-gray-500 text-center leading-relaxed">
              <button
                onClick={() => onNavigate('features')}
                className="text-red-700 underline"
              >
                Funzionalità
              </button>
              {' · '}
              <button
                onClick={() => onNavigate('docs')}
                className="text-red-700 underline"
              >
                Documentazione
              </button>
              {' · '}
              <button
                onClick={() => onNavigate('changelog')}
                className="text-red-700 underline"
              >
                Changelog
              </button>
            </p>
          </div>
        </div>
      </div>
    </FloatingPathsBackground>
  )
}
