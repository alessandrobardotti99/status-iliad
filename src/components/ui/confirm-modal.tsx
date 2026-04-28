import { useEffect, useRef } from 'react'

type Props = {
  open: boolean
  title: string
  message: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Conferma',
  cancelLabel = 'Annulla',
  destructive = false,
  busy = false,
  onConfirm,
  onCancel,
}: Props) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onCancel()
      if (e.key === 'Enter' && !busy) onConfirm()
    }
    window.addEventListener('keydown', onKey)
    confirmRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open, busy, onCancel, onConfirm])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={() => !busy && onCancel()}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white border border-gray-200 rounded shadow-lg"
      >
        <div className="border-b border-gray-200 px-5 py-3">
          <div className="border-l-2 border-red-600 pl-3">
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider">
              {title}
            </h3>
          </div>
        </div>

        <div className="px-5 py-4 text-[13px] text-gray-700 leading-relaxed">
          {message}
        </div>

        <div className="border-t border-gray-200 px-5 py-3 flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="text-[11px] uppercase tracking-wider px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700 disabled:opacity-40"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`text-[11px] uppercase tracking-wider px-4 py-2 font-medium rounded disabled:opacity-50 transition-colors ${
              destructive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-black hover:bg-gray-800 text-white'
            }`}
          >
            {busy ? '…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
