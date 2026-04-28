import type { SystemInfo as SystemInfoType } from '../api/types'
import { formatUptime } from '../lib/format'

type Props = {
  data: SystemInfoType | null
  error: string | null
}

export function SystemInfo({ data, error }: Props) {
  const cpuTemp = data?.sensors.find(
    (s) => s.id.includes('cpu') || s.name.toLowerCase().includes('cpu'),
  )
  const fan = data?.fans?.[0]

  return (
    <div className="bg-white border border-gray-200 h-full">
      <div className="border-b border-gray-200 px-5 py-3">
        <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Sistema
        </h2>
      </div>

      <div className="px-5 py-4">
        {error && !data && (
          <p className="text-sm text-red-700">Errore — {error}</p>
        )}

        {!data && !error && (
          <p className="text-sm text-gray-500">Caricamento…</p>
        )}

        {data && (
          <div className="space-y-4">
            <div>
              <div className="text-base font-semibold text-black">
                {data.model_info?.pretty_name ?? data.board_name}
              </div>
              <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                fw {data.firmware_version}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
              <Field label="Uptime" value={formatUptime(data.uptime_val)} />
              {cpuTemp && (
                <Field label={cpuTemp.name} value={`${cpuTemp.value} °C`} />
              )}
              {fan && <Field label={fan.name} value={`${fan.value} RPM`} />}
              <Field label="MAC" value={data.mac} mono />
            </div>

            {data.sensors.length > 0 && (
              <div className="pt-3 border-t border-gray-100">
                <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">
                  Sensori
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {data.sensors.map((s) => (
                    <span
                      key={s.id}
                      className="text-[11px] px-2 py-1 bg-gray-100 text-black border border-gray-200"
                    >
                      {s.name}:{' '}
                      <span className="font-mono">{s.value}°</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
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
      <div className={`text-sm text-black ${mono ? 'font-mono text-[12px]' : ''}`}>
        {value}
      </div>
    </div>
  )
}
