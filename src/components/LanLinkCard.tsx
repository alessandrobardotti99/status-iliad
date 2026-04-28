import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'

type Props = {
  className?: string
}

function getSuggestUrl(): string {
  const origin = window.location.origin
  const base = `${origin}/#/`
  return base
}

export function LanLinkCard({ className }: Props) {
  const url = useMemo(() => getSuggestUrl(), [])
  const isHttps = window.location.protocol === 'https:'
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>(
    'idle',
  )

  useEffect(() => {
    let cancelled = false
    QRCode.toDataURL(url, {
      margin: 1,
      width: 256,
      errorCorrectionLevel: 'M',
    })
      .then((dataUrl: string) => {
        if (!cancelled) setQrDataUrl(dataUrl)
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null)
      })
    return () => {
      cancelled = true
    }
  }, [url])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 1500)
    } catch {
      setCopyState('error')
      window.setTimeout(() => setCopyState('idle'), 2000)
    }
  }

  return (
    <div
      className={`w-full bg-white border border-gray-200 rounded-[10px] shadow-sm ${className ?? ''}`}
    >
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="border-l-2 border-red-600 pl-3">
          <h2 className="text-[11px] font-semibold text-black uppercase tracking-wider">
            Link Da Salvare
          </h2>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Aprilo dal telefono quando sei sulla Wi‑Fi di casa
          </p>
        </div>
      </div>

      <div className="px-6 py-5 space-y-3">
        {isHttps ? (
          <p className="text-[12px] text-amber-900 leading-relaxed bg-amber-50 border border-amber-200 rounded-[10px] px-4 py-3">
            Sei su una versione pubblica (HTTPS). Per collegarti alla iliadbox
            devi aprire la versione in LAN (HTTP) servita dal tuo Mac/PC.
          </p>
        ) : (
          <p className="text-[12px] text-gray-700 leading-relaxed">
            Scansiona il QR dal telefono o salva questo link nei preferiti.
          </p>
        )}

        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-gray-500 mb-1">URL</div>
            <div className="font-mono text-[11px] bg-gray-50 border border-gray-200 rounded-[10px] px-3 py-2 break-all">
              {url}
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={copy}
                className="flex-1 py-2 bg-black hover:bg-gray-800 text-white text-[11px] font-medium uppercase tracking-wide rounded-[10px] transition-colors"
              >
                {copyState === 'copied'
                  ? 'Copiato'
                  : copyState === 'error'
                    ? 'Copia fallita'
                    : 'Copia link'}
              </button>
              <a
                href={url}
                className="flex-1 text-center py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-[11px] font-medium uppercase tracking-wide rounded-[10px] transition-colors"
              >
                Apri
              </a>
            </div>
          </div>

          <div className="shrink-0">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR code"
                className="w-28 h-28 bg-white border border-gray-200 rounded-[10px]"
              />
            ) : (
              <div className="w-28 h-28 bg-gray-50 border border-gray-200 rounded-[10px] flex items-center justify-center text-[10px] text-gray-500 text-center px-2">
                QR non disponibile
              </div>
            )}
          </div>
        </div>

        <p className="text-[11px] text-gray-500 leading-relaxed">
          Consiglio: rinomina il Mac in macOS (Generali → Condivisione) per
          ottenere un link semplice tipo{' '}
          <code className="font-mono">http://iliad-monitor.local:8080</code>.
        </p>
      </div>
    </div>
  )
}
