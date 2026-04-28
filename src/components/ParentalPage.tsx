import { useCallback, useEffect, useState } from 'react'
import {
  deleteParentalFilter,
  getLanHosts,
  getParentalFilters,
  updateParentalFilter,
} from '../api/freebox'
import type { LanHost, ParentalFilter } from '../api/types'
import { FilterEditModal } from './parental/FilterEditModal'
import { ScheduleGrid } from './parental/ScheduleGrid'
import { ConfirmModal } from './ui/confirm-modal'

export function ParentalPage() {
  const [filters, setFilters] = useState<ParentalFilter[] | null>(null)
  const [hosts, setHosts] = useState<LanHost[]>([])
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<ParentalFilter | null | undefined>(
    undefined,
  )
  const [busyId, setBusyId] = useState<number | null>(null)
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [confirmDelete, setConfirmDelete] = useState<ParentalFilter | null>(
    null,
  )

  const reload = useCallback(async () => {
    try {
      const [f, h] = await Promise.all([getParentalFilters(), getLanHosts()])
      setFilters(f)
      setHosts(h)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const toggleEnabled = async (filter: ParentalFilter) => {
    setBusyId(filter.id)
    try {
      await updateParentalFilter(filter.id, { enabled: !filter.enabled })
      await reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (filter: ParentalFilter) => {
    setBusyId(filter.id)
    try {
      await deleteParentalFilter(filter.id)
      await reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusyId(null)
    }
  }

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <main className="max-w-7xl w-full mx-auto p-6 space-y-6">
      <div className="bg-white border border-gray-200 rounded shadow-sm">
        <div className="border-b border-gray-200 px-5 py-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Controllo Parentale
            </h2>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Limita l'accesso a internet per dispositivi specifici in
              determinate fasce orarie
            </p>
          </div>
          <button
            onClick={() => setEditing(null)}
            className="text-[11px] uppercase tracking-wider px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors"
          >
            + Nuovo filtro
          </button>
        </div>

        <div className="px-5 py-4">
          {error && (
            <div className="border-l-2 border-red-600 bg-gray-50 rounded px-3 py-2 text-[12px] text-red-700 mb-3">
              {error}
            </div>
          )}

          {filters === null && !error && (
            <p className="text-sm text-gray-500">Caricamento…</p>
          )}

          {filters && filters.length === 0 && (
            <div className="text-center py-10">
              <p className="text-sm text-gray-700 mb-1">
                Nessun filtro configurato.
              </p>
              <p className="text-[12px] text-gray-500">
                Crea un filtro per limitare quando i dispositivi possono
                accedere a internet.
              </p>
            </div>
          )}

          {filters && filters.length > 0 && (
            <ul className="divide-y divide-gray-100 -my-3">
              {filters.map((f) => (
                <FilterRow
                  key={f.id}
                  filter={f}
                  hosts={hosts}
                  expanded={expanded.has(f.id)}
                  busy={busyId === f.id}
                  onToggleExpand={() => toggleExpand(f.id)}
                  onToggleEnabled={() => toggleEnabled(f)}
                  onEdit={() => setEditing(f)}
                  onDelete={() => setConfirmDelete(f)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      {editing !== undefined && (
        <FilterEditModal
          filter={editing}
          hosts={hosts}
          onClose={() => setEditing(undefined)}
          onSaved={() => {
            setEditing(undefined)
            reload()
          }}
        />
      )}

      <ConfirmModal
        open={confirmDelete !== null}
        title="Eliminare il filtro?"
        destructive
        confirmLabel="Sì, elimina"
        message={
          <p>
            Stai per eliminare il filtro{' '}
            <strong className="text-black">{confirmDelete?.name}</strong>. I
            dispositivi a cui era applicato torneranno a navigare senza
            restrizioni. L'operazione non è reversibile.
          </p>
        }
        busy={busyId === confirmDelete?.id}
        onCancel={() => setConfirmDelete(null)}
        onConfirm={async () => {
          if (!confirmDelete) return
          const f = confirmDelete
          setConfirmDelete(null)
          await remove(f)
        }}
      />
    </main>
  )
}

type FilterRowProps = {
  filter: ParentalFilter
  hosts: LanHost[]
  expanded: boolean
  busy: boolean
  onToggleExpand: () => void
  onToggleEnabled: () => void
  onEdit: () => void
  onDelete: () => void
}

function FilterRow({
  filter,
  hosts,
  expanded,
  busy,
  onToggleExpand,
  onToggleEnabled,
  onEdit,
  onDelete,
}: FilterRowProps) {
  const blockedHours = filter.planning.filter((v) => !v).length
  const targetHosts = hosts.filter((h) =>
    filter.macs.includes(h.l2ident.id),
  )

  return (
    <li className="py-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-black">
              {filter.name}
            </span>
            <span
              className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
                filter.enabled
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {filter.enabled ? 'Attivo' : 'Disattivato'}
            </span>
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            {filter.description ? `${filter.description} · ` : ''}
            {blockedHours}h bloccate · {filter.macs.length} dispositiv
            {filter.macs.length === 1 ? 'o' : 'i'}
          </div>
          {targetHosts.length > 0 && (
            <div className="text-[11px] text-gray-600 mt-1 flex flex-wrap gap-1">
              {targetHosts.map((h) => (
                <span
                  key={h.id}
                  className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded"
                >
                  {h.primary_name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={onToggleExpand}
            className="text-[11px] uppercase tracking-wider px-3 py-1.5 border border-gray-300 hover:border-gray-400 text-gray-700 rounded transition-colors"
          >
            {expanded ? 'Chiudi' : 'Schedule'}
          </button>
          <button
            onClick={onToggleEnabled}
            disabled={busy}
            className="text-[11px] uppercase tracking-wider px-3 py-1.5 border border-gray-300 hover:border-gray-400 text-gray-700 rounded transition-colors disabled:opacity-40"
          >
            {busy ? '…' : filter.enabled ? 'Disattiva' : 'Attiva'}
          </button>
          <button
            onClick={onEdit}
            className="text-[11px] uppercase tracking-wider px-3 py-1.5 border border-gray-300 hover:border-black hover:bg-black hover:text-white text-gray-700 rounded transition-colors"
          >
            Modifica
          </button>
          <button
            onClick={onDelete}
            disabled={busy}
            className="text-[11px] uppercase tracking-wider px-3 py-1.5 border border-gray-300 hover:border-red-600 hover:text-red-700 text-gray-700 rounded transition-colors disabled:opacity-40"
          >
            Elimina
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <ScheduleGrid value={filter.planning} onChange={() => {}} readonly />
        </div>
      )}
    </li>
  )
}
