import { useEffect, useState } from 'react'
import { updateWifiBss } from '../api/freebox'
import type { WifiBss } from '../api/types'

type Props = {
  bss: WifiBss
  onClose: () => void
  onSaved: () => void
}

export function ChangePasswordModal({ bss, onClose, onSaved }: Props) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [reveal, setReveal] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, busy])

  const validate = (): string | null => {
    if (password.length < 8)
      return 'La password Wi-Fi deve avere almeno 8 caratteri.'
    if (password.length > 63)
      return 'La password Wi-Fi non può superare i 63 caratteri.'
    if (password !== confirm) return 'Le due password non coincidono.'
    return null
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (v) {
      setError(v)
      return
    }
    setBusy(true)
    setError(null)
    try {
      await updateWifiBss(bss.id, { key: password })
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={() => !busy && onClose()}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white border border-gray-200 rounded-[10px] shadow-lg"
      >
        <div className="border-b border-gray-200 px-5 py-3">
          <div className="border-l-2 border-red-600 pl-3">
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider">
              Cambia password Wi-Fi
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Rete: <span className="font-mono">{bss.config.ssid}</span>
            </p>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="border-l-2 border-gray-300 bg-gray-50 rounded-[10px] px-4 py-3">
            <p className="text-[12px] text-gray-700 leading-relaxed">
              <span className="font-semibold text-black">Attenzione:</span>{' '}
              cambiando la password tutti i dispositivi connessi verranno
              disconnessi e dovrai inserire la nuova password su ognuno di
              loro (telefoni, smart TV, lampadine smart, ecc.).
            </p>
          </div>

          <div>
            <label className="text-[10px] text-gray-600 uppercase tracking-wider block mb-1">
              Nuova password (8–63 caratteri)
            </label>
            <input
              type={reveal ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              disabled={busy}
              minLength={8}
              maxLength={63}
              className="w-full border border-gray-300 rounded-[10px] px-3 py-2 text-sm font-mono focus:outline-none focus:border-red-600 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-600 uppercase tracking-wider block mb-1">
              Conferma nuova password
            </label>
            <input
              type={reveal ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={busy}
              minLength={8}
              maxLength={63}
              className="w-full border border-gray-300 rounded-[10px] px-3 py-2 text-sm font-mono focus:outline-none focus:border-red-600 disabled:bg-gray-100"
            />
          </div>

          <label className="flex items-center gap-2 text-[12px] text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={reveal}
              onChange={(e) => setReveal(e.target.checked)}
              className="accent-red-600"
            />
            Mostra password mentre digito
          </label>

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
            {busy ? 'Salvataggio…' : 'Conferma cambio'}
          </button>
        </div>
      </form>
    </div>
  )
}
