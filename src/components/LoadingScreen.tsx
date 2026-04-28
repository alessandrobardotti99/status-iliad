import { FloatingPathsBackground } from './ui/floating-paths'

type Props = {
  message?: string
}

export function LoadingScreen({
  message = 'Verifico connessione alla iliadbox…',
}: Props) {
  return (
    <FloatingPathsBackground
      position={-1}
      className="flex-1 flex flex-col items-center justify-center px-6 py-10"
    >
      <div className="relative z-10 bg-white border border-gray-200 rounded-[10px] shadow-sm px-8 py-6 flex flex-col items-center gap-4">
        <span
          className="w-10 h-10 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"
          role="status"
          aria-label="Caricamento in corso"
        />
        <p className="text-[11px] text-gray-600 uppercase tracking-wider text-center">
          {message}
        </p>
      </div>
    </FloatingPathsBackground>
  )
}
