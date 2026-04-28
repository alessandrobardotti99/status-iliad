import { useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getRrd } from '../api/freebox'
import type { RrdSample } from '../api/types'
import { formatBitRate } from '../lib/format'
import { DateTimePicker } from './ui/date-time-picker'

type Preset = { label: string; seconds: number }

const PRESETS: Preset[] = [
  { label: 'Ultima ora', seconds: 3600 },
  { label: 'Ultime 24 ore', seconds: 86400 },
  { label: 'Ultima settimana', seconds: 604800 },
  { label: 'Ultimo mese', seconds: 2592000 },
]

function formatTickTime(t: number, totalSeconds: number): string {
  const d = new Date(t * 1000)
  if (totalSeconds <= 86400) {
    return d.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  return d.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
  })
}

export function HistoryPage() {
  const [start, setStart] = useState(
    () => Math.floor(Date.now() / 1000) - 86400,
  )
  const [end, setEnd] = useState(() => Math.floor(Date.now() / 1000))
  const [netData, setNetData] = useState<RrdSample[] | null>(null)
  const [tempData, setTempData] = useState<RrdSample[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadedRange, setLoadedRange] = useState<[number, number] | null>(null)

  const load = async (s: number, e: number) => {
    if (s >= e) {
      setError('La data di inizio deve essere precedente a quella di fine.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const [net, temp] = await Promise.all([
        getRrd({ db: 'net', date_start: s, date_end: e }),
        getRrd({ db: 'temp', date_start: s, date_end: e }),
      ])
      setNetData(net.data)
      setTempData(temp.data)
      setLoadedRange([s, e])
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(start, end)
  }, [])

  const applyPreset = (seconds: number) => {
    const now = Math.floor(Date.now() / 1000)
    const newStart = now - seconds
    setStart(newStart)
    setEnd(now)
    load(newStart, now)
  }

  const totalSeconds = end - start

  return (
    <main className="max-w-7xl w-full mx-auto p-6 space-y-6">
      <div className="bg-white border border-gray-200 rounded shadow-sm">
        <div className="border-b border-gray-200 px-5 py-3">
          <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Intervallo
          </h2>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Seleziona un periodo per visualizzare lo storico della linea
          </p>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p.seconds)}
                disabled={loading}
                className="text-[11px] uppercase tracking-wider px-3 py-1.5 border border-gray-300 hover:border-black hover:bg-black hover:text-white text-gray-700 rounded transition-colors disabled:opacity-40"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <div>
              <label className="text-[10px] text-gray-600 uppercase tracking-wider block mb-1">
                Da
              </label>
              <DateTimePicker
                value={start}
                onChange={setStart}
                disabled={loading}
                align="left"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-600 uppercase tracking-wider block mb-1">
                A
              </label>
              <DateTimePicker
                value={end}
                onChange={setEnd}
                disabled={loading}
                align="right"
              />
            </div>
            <button
              onClick={() => load(start, end)}
              disabled={loading}
              className="text-[11px] uppercase tracking-wider px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded disabled:opacity-50 transition-colors"
            >
              {loading ? 'Carico…' : 'Carica'}
            </button>
          </div>

          {error && (
            <div className="border-l-2 border-red-600 bg-gray-50 rounded px-3 py-2 text-[12px] text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>

      <BandwidthHistoryCard
        data={netData}
        totalSeconds={totalSeconds}
        loadedRange={loadedRange}
        loading={loading}
      />

      <TemperatureHistoryCard
        data={tempData}
        totalSeconds={totalSeconds}
        loadedRange={loadedRange}
        loading={loading}
      />

      <p className="text-[11px] text-gray-500 text-center">
        I dati storici provengono dal database RRD della iliadbox: granularità
        fine sull'ultima ora, sempre più aggregata via via che si va indietro
        nel tempo.
      </p>
    </main>
  )
}

type CardProps = {
  data: RrdSample[] | null
  totalSeconds: number
  loadedRange: [number, number] | null
  loading: boolean
}

function rangeLabel(range: [number, number] | null): string {
  if (!range) return ''
  const [s, e] = range
  const sd = new Date(s * 1000)
  const ed = new Date(e * 1000)
  const sameDay = sd.toDateString() === ed.toDateString()
  if (sameDay) {
    return `${sd.toLocaleDateString('it-IT')} · ${sd.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} → ${ed.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`
  }
  return `${sd.toLocaleDateString('it-IT')} → ${ed.toLocaleDateString('it-IT')}`
}

function BandwidthHistoryCard({
  data,
  totalSeconds,
  loadedRange,
  loading,
}: CardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm">
      <div className="border-b border-gray-200 px-5 py-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Banda · Storico
          </h2>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {rangeLabel(loadedRange) || 'Nessun dato caricato'}
          </p>
        </div>
      </div>

      <div className="px-2 py-4 h-72">
        {loading && !data ? (
          <p className="text-sm text-gray-500 px-3">Caricamento…</p>
        ) : !data || data.length === 0 ? (
          <p className="text-sm text-gray-500 px-3">
            Nessun dato disponibile per il periodo selezionato.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="hist-down" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="hist-up" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#111111" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#111111" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="#e5e7eb"
                strokeDasharray="2 4"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                type="number"
                domain={['dataMin', 'dataMax']}
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(t: number) => formatTickTime(t, totalSeconds)}
                minTickGap={48}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(v: number) => formatBitRate(v)}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  background: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: 4,
                  fontSize: 12,
                  color: '#111111',
                }}
                labelStyle={{ color: '#6b7280' }}
                labelFormatter={(t) =>
                  new Date(Number(t) * 1000).toLocaleString('it-IT')
                }
                formatter={(value, name) => [
                  formatBitRate(Number(value)),
                  name === 'rate_down' ? 'Download' : 'Upload',
                ]}
              />
              <Area
                type="monotone"
                dataKey="rate_down"
                stroke="#dc2626"
                strokeWidth={1.5}
                fill="url(#hist-down)"
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="rate_up"
                stroke="#111111"
                strokeWidth={1.5}
                fill="url(#hist-up)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

const TEMP_SERIES: { key: string; label: string; color: string }[] = [
  { key: 'cpum', label: 'CPU M', color: '#dc2626' },
  { key: 'cpub', label: 'CPU B', color: '#111111' },
  { key: 'sw', label: 'Switch', color: '#6b7280' },
  { key: 'hdd', label: 'HDD', color: '#9ca3af' },
]

function TemperatureHistoryCard({
  data,
  totalSeconds,
  loadedRange,
  loading,
}: CardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm">
      <div className="border-b border-gray-200 px-5 py-3">
        <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Temperature · Storico
        </h2>
        <p className="text-[11px] text-gray-500 mt-0.5">
          {rangeLabel(loadedRange) || 'Nessun dato caricato'}
        </p>
      </div>

      <div className="px-2 py-4 h-72">
        {loading && !data ? (
          <p className="text-sm text-gray-500 px-3">Caricamento…</p>
        ) : !data || data.length === 0 ? (
          <p className="text-sm text-gray-500 px-3">
            Nessun dato disponibile per il periodo selezionato.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                stroke="#e5e7eb"
                strokeDasharray="2 4"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                type="number"
                domain={['dataMin', 'dataMax']}
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(t: number) => formatTickTime(t, totalSeconds)}
                minTickGap={48}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tickFormatter={(v: number) => `${v}°`}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  background: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: 4,
                  fontSize: 12,
                  color: '#111111',
                }}
                labelStyle={{ color: '#6b7280' }}
                labelFormatter={(t) =>
                  new Date(Number(t) * 1000).toLocaleString('it-IT')
                }
                formatter={(value, name) => [
                  `${Number(value).toFixed(1)} °C`,
                  String(name),
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                iconType="line"
              />
              {TEMP_SERIES.map((s) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
