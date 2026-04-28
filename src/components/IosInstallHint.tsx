import { useState } from 'react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

const STORAGE_KEY = 'iliadbox.ios_hint_dismissed'

export function IosInstallHint() {
  const { isIos, installed } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === '1',
  )

  if (!isIos || installed || dismissed) return null

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setDismissed(true)
  }

  return (
    <div className="bg-white border border-gray-200 border-l-2 border-l-red-600 rounded shadow-sm px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="text-[12px] text-gray-700 leading-relaxed">
          <span className="font-semibold text-black">
            Aggiungi alla schermata Home.
          </span>{' '}
          Su iPhone tocca il pulsante <em>Condividi</em> nella barra di Safari
          e scegli <em>"Aggiungi a Home"</em>: l'app comparirà tra le icone
          come una qualsiasi altra applicazione.
        </div>
        <button
          onClick={handleDismiss}
          className="text-[10px] uppercase tracking-wider text-gray-500 hover:text-black px-2 py-1 shrink-0"
          aria-label="Chiudi"
        >
          Chiudi
        </button>
      </div>
    </div>
  )
}
