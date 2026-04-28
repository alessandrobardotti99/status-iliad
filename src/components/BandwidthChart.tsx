import { useEffect, useRef, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ConnectionStatus } from '../api/types'
import { formatBitRate } from '../lib/format'

type Point = {
  t: number
  label: string
  down: number
  up: number
}

const MAX_POINTS = 60

type Props = {
  data: ConnectionStatus | null
}

export function BandwidthChart({ data }: Props) {
  const [series, setSeries] = useState<Point[]>([])
  const lastRef = useRef<string | null>(null)

  useEffect(() => {
    if (!data) return
    const now = new Date()
    const label = now.toLocaleTimeString('it-IT', { hour12: false })
    const point: Point = {
      t: now.getTime(),
      label,
      down: data.rate_down * 8,
      up: data.rate_up * 8,
    }
    const sig = `${label}|${point.down}|${point.up}`
    if (lastRef.current === sig) return
    lastRef.current = sig
    setSeries((prev) => [...prev.slice(-MAX_POINTS + 1), point])
  }, [data])

  const current = series[series.length - 1]

  return (
    <div className="bg-white border border-gray-200 h-full">
      <div className="border-b border-gray-200 px-5 py-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Banda in Tempo Reale
        </h2>
        <div className="flex gap-6 text-right">
          <Stat
            color="text-red-600"
            label="Download"
            value={current ? formatBitRate(current.down / 8) : '—'}
          />
          <Stat
            color="text-black"
            label="Upload"
            value={current ? formatBitRate(current.up / 8) : '—'}
          />
        </div>
      </div>

      <div className="px-2 py-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={series}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="grad-down" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dc2626" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="grad-up" x1="0" y1="0" x2="0" y2="1">
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
              dataKey="label"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              minTickGap={32}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(v: number) => formatBitRate(v / 8)}
              width={80}
            />
            <Tooltip
              contentStyle={{
                background: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: 0,
                fontSize: 12,
                color: '#111111',
              }}
              labelStyle={{ color: '#6b7280' }}
              formatter={(value, name) => [
                formatBitRate(Number(value) / 8),
                name === 'down' ? 'Download' : 'Upload',
              ]}
            />
            <Area
              type="monotone"
              dataKey="down"
              stroke="#dc2626"
              strokeWidth={1.75}
              fill="url(#grad-down)"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="up"
              stroke="#111111"
              strokeWidth={1.75}
              fill="url(#grad-up)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function Stat({
  color,
  label,
  value,
}: {
  color: string
  label: string
  value: string
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-gray-500">
        {label}
      </div>
      <div className={`text-sm font-semibold tabular-nums ${color}`}>
        {value}
      </div>
    </div>
  )
}
