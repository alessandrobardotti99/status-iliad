type Props = {
  onExit: () => void
}

export function DemoBanner({ onExit }: Props) {
  return (
    <div className="bg-white border border-gray-200 border-l-2 border-l-red-600 rounded shadow-sm px-4 py-3 flex items-center justify-between gap-3">
      <div className="text-[12px] text-gray-700 leading-relaxed">
        <span className="font-semibold text-black uppercase tracking-wider">
          Modalità demo ·
        </span>{' '}
        i dati mostrati sono simulati. Nessuna chiamata reale alla iliadbox.
      </div>
      <button
        onClick={onExit}
        className="text-[10px] uppercase tracking-wider text-gray-600 hover:text-black px-3 py-1.5 border border-gray-300 hover:border-gray-400 rounded transition-colors shrink-0"
      >
        Esci dalla demo
      </button>
    </div>
  )
}
