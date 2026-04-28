import { useEffect, useRef, useState } from 'react'

const DAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
const HOUR_LABELS = ['00', '06', '12', '18']

type Props = {
  value: boolean[]
  onChange: (next: boolean[]) => void
  readonly?: boolean
}

export function ScheduleGrid({ value, onChange, readonly }: Props) {
  const [paintMode, setPaintMode] = useState<boolean | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (paintMode === null) return
    const onUp = () => setPaintMode(null)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp)
    }
  }, [paintMode])

  const setCell = (day: number, hour: number, allowed: boolean) => {
    const idx = day * 24 + hour
    if (value[idx] === allowed) return
    const next = [...value]
    next[idx] = allowed
    onChange(next)
  }

  const onCellMouseDown = (day: number, hour: number) => {
    if (readonly) return
    const idx = day * 24 + hour
    const newMode = !value[idx]
    setPaintMode(newMode)
    setCell(day, hour, newMode)
  }

  const onCellMouseEnter = (day: number, hour: number) => {
    if (readonly || paintMode === null) return
    setCell(day, hour, paintMode)
  }

  const blockedCount = value.filter((v) => !v).length
  const allowedCount = 168 - blockedCount

  const setAll = (allowed: boolean) => {
    if (readonly) return
    onChange(Array.from({ length: 168 }, () => allowed))
  }

  const setNights = () => {
    if (readonly) return
    const next = [...value]
    for (let day = 0; day < 7; day++) {
      for (let h = 22; h < 24; h++) next[day * 24 + h] = false
      for (let h = 0; h < 7; h++) next[day * 24 + h] = false
    }
    onChange(next)
  }

  const setSchoolHours = () => {
    if (readonly) return
    const next = [...value]
    for (let day = 0; day < 5; day++) {
      for (let h = 8; h < 13; h++) next[day * 24 + h] = false
    }
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {!readonly && (
        <div className="flex flex-wrap gap-2">
          <PresetButton onClick={() => setAll(true)} label="Permetti tutto" />
          <PresetButton onClick={() => setAll(false)} label="Blocca tutto" />
          <PresetButton
            onClick={setNights}
            label="Blocca notte (22→7)"
          />
          <PresetButton
            onClick={setSchoolHours}
            label="Blocca scuola (Lun-Ven 8→13)"
          />
        </div>
      )}

      <div
        ref={containerRef}
        className="overflow-x-auto select-none"
        style={{ touchAction: 'none' }}
      >
        <div className="inline-block min-w-full">
          <div className="grid grid-cols-[2.5rem_repeat(24,minmax(0.7rem,1fr))] gap-px text-[9px] text-gray-500 uppercase tracking-wider">
            <div />
            {Array.from({ length: 24 }, (_, h) => (
              <div
                key={h}
                className="text-center tabular-nums"
                style={{ visibility: h % 6 === 0 ? 'visible' : 'hidden' }}
              >
                {HOUR_LABELS[h / 6] ?? ''}
              </div>
            ))}
          </div>

          {DAYS.map((dayLabel, day) => (
            <div
              key={day}
              className="grid grid-cols-[2.5rem_repeat(24,minmax(0.7rem,1fr))] gap-px mt-px"
            >
              <div className="text-[10px] text-gray-700 uppercase tracking-wider flex items-center font-semibold">
                {dayLabel}
              </div>
              {Array.from({ length: 24 }, (_, hour) => {
                const idx = day * 24 + hour
                const allowed = value[idx]
                return (
                  <button
                    key={hour}
                    type="button"
                    onMouseDown={() => onCellMouseDown(day, hour)}
                    onMouseEnter={() => onCellMouseEnter(day, hour)}
                    onTouchStart={() => onCellMouseDown(day, hour)}
                    title={`${dayLabel} ${String(hour).padStart(2, '0')}:00 — ${allowed ? 'permesso' : 'bloccato'}`}
                    disabled={readonly}
                    className={`h-6 transition-colors ${
                      allowed
                        ? 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
                        : 'bg-red-600 hover:bg-red-700 border border-red-700'
                    } ${readonly ? 'cursor-default' : ''}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-gray-500">
        <div className="flex items-center gap-3">
          <Legend color="bg-gray-100 border-gray-200" label="Permesso" />
          <Legend color="bg-red-600 border-red-700" label="Bloccato" />
        </div>
        <div className="font-mono tabular-nums">
          {allowedCount}h permesse · {blockedCount}h bloccate
        </div>
      </div>
    </div>
  )
}

function PresetButton({
  onClick,
  label,
}: {
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[10px] uppercase tracking-wider px-2 py-1 border border-gray-300 hover:border-black hover:bg-black hover:text-white text-gray-700 rounded-[10px] transition-colors"
    >
      {label}
    </button>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block w-3 h-3 border ${color}`} />
      {label}
    </span>
  )
}
