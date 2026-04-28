import { useEffect, useState } from 'react'
import {
  createParentalFilter,
  updateParentalFilter,
} from '../../api/freebox'
import type { LanHost, ParentalFilter } from '../../api/types'
import { ScheduleGrid } from './ScheduleGrid'

type Props = {
  filter: ParentalFilter | null
  hosts: LanHost[]
  onClose: () => void
  onSaved: () => void
}

const emptyPlanning = (): boolean[] =>
  Array.from({ length: 168 }, () => true)

export function FilterEditModal({ filter, hosts, onClose, onSaved }: Props) {
  const isNew = filter === null
  const [name, setName] = useState(filter?.name ?? '')
  const [description, setDescription] = useState(filter?.description ?? '')
  const [enabled, setEnabled] = useState(filter?.enabled ?? true)
  const [macs, setMacs] = useState<string[]>(filter?.macs ?? [])
  const [planning, setPlanning] = useState<boolean[]>(
    filter?.planning ?? emptyPlanning(),
  )
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, busy])

  const toggleMac = (mac: string) => {
    setMacs((prev) =>
      prev.includes(mac) ? prev.filter((m) => m !== mac) : [...prev, mac],
    )
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Inserisci un nome per il filtro.')
      return
    }
    if (macs.length === 0) {
      setError('Seleziona almeno un dispositivo.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        enabled,
        macs,
        planning,
        default_filter_mode: 'allowed' as const,
        current_filter_mode: 'allowed' as const,
      }
      if (isNew) {
        await createParentalFilter(payload)
      } else {
        await updateParentalFilter(filter!.id, payload)
      }
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setBusy(false)
    }
  }

  const sortedHosts = [...hosts].sort((a, b) =>
    a.primary_name.localeCompare(b.primary_name),
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={() => !busy && onClose()}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-white border border-gray-200 rounded-[10px] shadow-lg max-h-[90vh] flex flex-col"
      >
        <div className="border-b border-gray-200 px-5 py-3">
          <div className="border-l-2 border-red-600 pl-3">
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider">
              {isNew ? 'Nuovo filtro' : 'Modifica filtro'}
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Configura quali dispositivi limitare e in quali fasce orarie
            </p>
          </div>
        </div>

        <div className="px-5 py-4 space-y-5 overflow-y-auto">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-600 uppercase tracking-wider block mb-1">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={busy}
                placeholder="es. Console giochi"
                className="w-full border border-gray-300 rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:border-red-600 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-600 uppercase tracking-wider block mb-1">
                Descrizione (opzionale)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={busy}
                placeholder="es. Bloccate la sera"
                className="w-full border border-gray-300 rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:border-red-600 disabled:bg-gray-100"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="accent-red-600"
              disabled={busy}
            />
            Filtro attivo
          </label>

          <div>
            <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">
              Dispositivi a cui applicare il filtro
              <span className="ml-2 font-mono normal-case text-gray-400">
                ({macs.length} selezionati)
              </span>
            </div>
            <div className="border border-gray-200 rounded-[10px] max-h-48 overflow-y-auto divide-y divide-gray-100">
              {sortedHosts.length === 0 && (
                <p className="p-3 text-sm text-gray-500">
                  Nessun dispositivo disponibile.
                </p>
              )}
              {sortedHosts.map((h) => {
                const selected = macs.includes(h.l2ident.id)
                return (
                  <label
                    key={h.id}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleMac(h.l2ident.id)}
                      disabled={busy}
                      className="accent-red-600"
                    />
                    <span
                      className={`h-1.5 w-1.5 shrink-0 ${
                        h.active ? 'bg-red-600' : 'bg-gray-300'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-black truncate">
                        {h.primary_name}
                      </div>
                      <div className="text-[11px] text-gray-500 font-mono">
                        {h.l2ident.id}
                        {h.vendor_name && ` · ${h.vendor_name}`}
                      </div>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">
              Pianificazione settimanale
            </div>
            <ScheduleGrid value={planning} onChange={setPlanning} />
          </div>

          {error && (
            <div className="border-l-2 border-red-600 bg-gray-50 rounded-[10px] px-3 py-2 text-[12px] text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-5 py-3 flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="text-[11px] uppercase tracking-wider px-4 py-2 border border-gray-300 rounded-[10px] hover:bg-gray-50 text-gray-700 disabled:opacity-40"
          >
            Annulla
          </button>
          <button
            type="submit"
            disabled={busy}
            className="text-[11px] uppercase tracking-wider px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-[10px] disabled:opacity-50"
          >
            {busy ? 'Salvataggio…' : isNew ? 'Crea filtro' : 'Salva modifiche'}
          </button>
        </div>
      </form>
    </div>
  )
}
