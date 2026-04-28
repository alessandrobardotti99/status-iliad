import { useMemo, useState } from 'react'
import type { LanHost } from '../api/types'
import { formatRelativeTime } from '../lib/format'

type Props = {
  data: LanHost[] | null
  error: string | null
}

export function DevicesList({ data, error }: Props) {
  const [showOffline, setShowOffline] = useState(false)

  const { active, total, hosts } = useMemo(() => {
    const all = data ?? []
    const sorted = [...all].sort((a, b) => {
      if (a.active !== b.active) return a.active ? -1 : 1
      return a.primary_name.localeCompare(b.primary_name)
    })
    const filtered = showOffline ? sorted : sorted.filter((h) => h.active)
    return {
      hosts: filtered,
      active: all.filter((h) => h.active).length,
      total: all.length,
    }
  }, [data, showOffline])

  return (
    <div className="bg-white border border-gray-200 rounded-[10px] shadow-sm h-full">
      <div className="border-b border-gray-200 px-5 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/icone/ethernet.png"
            alt=""
            aria-hidden="true"
            className="w-10 h-10 object-contain shrink-0"
          />
          <div className="min-w-0">
            <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Dispositivi LAN
            </h2>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {data ? `${active} attivi · ${total} totali` : '—'}
            </p>
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showOffline}
            onChange={(e) => setShowOffline(e.target.checked)}
            className="accent-red-600"
          />
          Mostra offline
        </label>
      </div>

      <div className="px-5 py-2">
        {error && !data && (
          <p className="text-sm text-red-700 py-2">
            Impossibile caricare — {error}
          </p>
        )}

        {!data && !error && (
          <p className="text-sm text-gray-500 py-2">Caricamento…</p>
        )}

        {data && hosts.length === 0 && (
          <p className="text-sm text-gray-500 py-2">Nessun dispositivo</p>
        )}

        {hosts.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {hosts.map((h) => {
              const ip = h.l3connectivities?.find(
                (c) => c.af === 'ipv4' && c.active,
              )?.address
              return (
                <li key={h.id} className="flex items-center gap-3 py-2.5">
                  <span
                    className={`h-1.5 w-1.5 shrink-0 ${
                      h.active ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-black truncate">
                      {h.primary_name || h.l2ident.id}
                    </div>
                    <div className="text-[11px] text-gray-500 font-mono truncate">
                      {h.l2ident.id}
                      {ip ? ` · ${ip}` : ''}
                    </div>
                  </div>
                  <div className="text-right text-[11px] shrink-0">
                    {h.vendor_name && (
                      <div className="text-gray-700 truncate max-w-35">
                        {h.vendor_name}
                      </div>
                    )}
                    <div className="text-gray-400 uppercase tracking-wider">
                      {h.active
                        ? 'attivo'
                        : formatRelativeTime(h.last_time_reachable)}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
