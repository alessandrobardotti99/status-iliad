import { useInstallPrompt } from '../hooks/useInstallPrompt'

export function InstallButton() {
  const { available, promptInstall } = useInstallPrompt()

  if (!available) return null

  return (
    <button
      onClick={() => promptInstall()}
      className="text-[11px] uppercase tracking-wider px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors"
      title="Installa l'app sul tuo dispositivo"
    >
      Installa app
    </button>
  )
}
