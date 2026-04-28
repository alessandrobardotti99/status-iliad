export function DemoBanner() {
  return (
    <div className="bg-white border border-gray-200 border-l-2 border-l-red-600 rounded shadow-sm px-4 py-3">
      <div className="text-[12px] text-gray-700 leading-relaxed">
        <span className="font-semibold text-black uppercase tracking-wider">
          Modalità demo ·
        </span>{' '}
        i dati mostrati sono simulati. Nessuna chiamata reale alla iliadbox.
      </div>
    </div>
  )
}
