import { PulseIcon } from '@phosphor-icons/react'
import type { ConnectionStatus } from '../api/types'
import { formatBitRate, formatBytes } from '../lib/format'

type Props = {
  data: ConnectionStatus | null
  error: string | null
}

const STATE_LABEL: Record<string, string> = {
  up: 'ONLINE',
  going_up: 'CONNESSIONE',
  going_down: 'DISCONNESSIONE',
  down: 'OFFLINE',
}

export function StatusCard({ data, error }: Props) {
  const isUp = data?.state === 'up'
  const stateLabel = data ? STATE_LABEL[data.state] ?? data.state : '—'

  return (
    <div className="bg-white border border-gray-200 rounded-[10px] shadow-sm h-full">
      <div className="border-b border-gray-200 px-5 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <PulseIcon weight="fill" className="w-10 h-10 text-black shrink-0" />
          <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Stato Connessione
          </h2>
        </div>
        <span
          className={`inline-block h-2 w-2 rounded-[10px] shrink-0 ${
            isUp ? 'bg-green-500' : 'bg-red-600'
          }`}
        />
      </div>

      <div className="px-5 py-4">
        {error && !data && (
          <p className="text-sm text-red-700">
            iliadbox non raggiungibile — {error}
          </p>
        )}

        {data && (
          <div className="space-y-4">
            <div>
              <div
                className={`text-2xl font-semibold tracking-tight ${
                  isUp ? 'text-black' : 'text-red-700'
                }`}
              >
                {stateLabel}
              </div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                {data.media} · {data.type}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-3 border-t border-gray-100">
              <Field label="IPv4" value={data.ipv4 || '—'} mono />
              <Field
                label="Banda max ↓"
                value={formatBitRate(data.bandwidth_down / 8)}
              />
              <Field label="Totale ↓" value={formatBytes(data.bytes_down)} />
              <Field
                label="Banda max ↑"
                value={formatBitRate(data.bandwidth_up / 8)}
              />
              <Field label="Totale ↑" value={formatBytes(data.bytes_up)} />
            </div>
          </div>
        )}

        {!data && !error && (
          <div className="text-sm text-gray-500">Caricamento…</div>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div>
      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">
        {label}
      </div>
      <div
        className={`text-sm text-black ${mono ? 'font-mono text-[12px]' : ''}`}
      >
        {value}
      </div>
    </div>
  )
}
