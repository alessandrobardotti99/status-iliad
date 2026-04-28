import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  value: number
  onChange: (epoch: number) => void
  disabled?: boolean
  className?: string
  align?: 'left' | 'right'
}

const WEEKDAYS = ['L', 'M', 'M', 'G', 'V', 'S', 'D']
const MONTHS = [
  'Gennaio',
  'Febbraio',
  'Marzo',
  'Aprile',
  'Maggio',
  'Giugno',
  'Luglio',
  'Agosto',
  'Settembre',
  'Ottobre',
  'Novembre',
  'Dicembre',
]

const pad = (n: number) => n.toString().padStart(2, '0')

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

export function DateTimePicker({
  value,
  onChange,
  disabled,
  className,
  align = 'left',
}: Props) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const valueDate = useMemo(() => new Date(value * 1000), [value])
  const [viewYear, setViewYear] = useState(valueDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(valueDate.getMonth())

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    if (open) {
      setViewYear(valueDate.getFullYear())
      setViewMonth(valueDate.getMonth())
    }
  }, [open, valueDate])

  const display = `${pad(valueDate.getDate())}/${pad(valueDate.getMonth() + 1)}/${valueDate.getFullYear()} · ${pad(valueDate.getHours())}:${pad(valueDate.getMinutes())}`

  const updateDate = (year: number, month: number, day: number) => {
    const d = new Date(value * 1000)
    d.setFullYear(year, month, day)
    onChange(Math.floor(d.getTime() / 1000))
  }

  const updateTime = (h: number, m: number) => {
    const d = new Date(value * 1000)
    d.setHours(h, m, 0, 0)
    onChange(Math.floor(d.getTime() / 1000))
  }

  const cells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1)
    const startOffset = (firstDay.getDay() + 6) % 7
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate()

    const out: { date: Date; current: boolean }[] = []
    for (let i = startOffset; i > 0; i--) {
      out.push({
        date: new Date(viewYear, viewMonth - 1, daysInPrevMonth - i + 1),
        current: false,
      })
    }
    for (let d = 1; d <= daysInMonth; d++) {
      out.push({ date: new Date(viewYear, viewMonth, d), current: true })
    }
    while (out.length < 42) {
      const last = out[out.length - 1].date
      const next = new Date(last)
      next.setDate(last.getDate() + 1)
      out.push({ date: next, current: false })
    }
    return out
  }, [viewYear, viewMonth])

  const today = new Date()

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={cn(
          'w-full border rounded-[10px] px-3 py-2 text-sm text-left bg-white font-mono tabular-nums hover:border-gray-400 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors',
          open ? 'border-red-600' : 'border-gray-300',
        )}
      >
        {display}
      </button>

      {open && (
        <div
          className={cn(
            'absolute z-50 mt-1 bg-white border border-gray-200 rounded-[10px] shadow-lg p-3 w-[320px]',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={prevMonth}
              className="text-gray-600 hover:text-black w-7 h-7 rounded-[10px] hover:bg-gray-100 flex items-center justify-center text-base leading-none"
              aria-label="Mese precedente"
            >
              ‹
            </button>
            <div className="text-sm font-semibold text-black">
              {MONTHS[viewMonth]} {viewYear}
            </div>
            <button
              type="button"
              onClick={nextMonth}
              className="text-gray-600 hover:text-black w-7 h-7 rounded-[10px] hover:bg-gray-100 flex items-center justify-center text-base leading-none"
              aria-label="Mese successivo"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {WEEKDAYS.map((w, i) => (
              <div
                key={i}
                className="text-[10px] text-gray-500 uppercase text-center font-semibold py-1"
              >
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((cell, i) => {
              const sel = isSameDay(cell.date, valueDate)
              const isToday = isSameDay(cell.date, today)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    updateDate(
                      cell.date.getFullYear(),
                      cell.date.getMonth(),
                      cell.date.getDate(),
                    )
                  }
                  className={cn(
                    'text-xs py-1.5 rounded-[10px] transition-colors tabular-nums',
                    !cell.current && 'text-gray-300',
                    cell.current && !sel && 'text-gray-800 hover:bg-gray-100',
                    isToday && !sel && 'border border-gray-300',
                    sel && 'bg-red-600 text-white font-semibold',
                  )}
                >
                  {cell.date.getDate()}
                </button>
              )
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Orario</span>
              <span className="font-mono text-black tabular-nums">
                {pad(valueDate.getHours())}:{pad(valueDate.getMinutes())}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 h-28">
              <ScrollList
                values={Array.from({ length: 24 }, (_, i) => i)}
                selected={valueDate.getHours()}
                onSelect={(h) => updateTime(h, valueDate.getMinutes())}
                isOpen={open}
                label="Ore"
              />
              <ScrollList
                values={Array.from({ length: 60 }, (_, i) => i)}
                selected={valueDate.getMinutes()}
                onSelect={(m) => updateTime(valueDate.getHours(), m)}
                isOpen={open}
                label="Min"
              />
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                const now = Math.floor(Date.now() / 1000)
                onChange(now)
              }}
              className="text-[11px] uppercase tracking-wider px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-[10px] transition-colors"
            >
              Adesso
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[11px] uppercase tracking-wider px-3 py-1.5 bg-black hover:bg-gray-800 text-white rounded-[10px] transition-colors"
            >
              Conferma
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ScrollList({
  values,
  selected,
  onSelect,
  isOpen,
  label,
}: {
  values: number[]
  selected: number
  onSelect: (n: number) => void
  isOpen: boolean
  label: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen || !ref.current) return
    const item = ref.current.querySelector<HTMLButtonElement>(
      `[data-value="${selected}"]`,
    )
    if (item) {
      ref.current.scrollTop =
        item.offsetTop - ref.current.clientHeight / 2 + item.offsetHeight / 2
    }
  }, [selected, isOpen])

  return (
    <div className="border border-gray-200 rounded-[10px] overflow-hidden flex flex-col">
      <div className="text-[9px] text-gray-500 uppercase tracking-wider text-center py-0.5 bg-gray-50 border-b border-gray-200">
        {label}
      </div>
      <div ref={ref} className="overflow-y-auto flex-1">
        {values.map((v) => {
          const sel = v === selected
          return (
            <button
              key={v}
              type="button"
              data-value={v}
              onClick={() => onSelect(v)}
              className={cn(
                'block w-full px-3 py-1 text-xs text-center font-mono tabular-nums transition-colors',
                sel
                  ? 'bg-red-600 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100',
              )}
            >
              {pad(v)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
