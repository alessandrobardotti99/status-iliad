import { useCallback, useEffect, useState } from 'react'
import { getWifiBssList, updateWifiBss } from '../api/freebox'
import type { Permissions, WifiBss } from '../api/types'
import { ChangePasswordModal } from './ChangePasswordModal'
import { ConfirmModal } from './ui/confirm-modal'

type Props = {
  permissions: Permissions | null
  permissionsLoading: boolean
}

export function WifiCard({ permissions, permissionsLoading }: Props) {
  const [bssList, setBssList] = useState<WifiBss[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<WifiBss | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [revealId, setRevealId] = useState<string | null>(null)
  const [confirmDisable, setConfirmDisable] = useState<WifiBss | null>(null)

  const canWrite = permissions?.settings === true

  const reload = useCallback(async () => {
    try {
      const list = await getWifiBssList()
      setBssList(list)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }, [])

  useEffect(() => {
    if (permissionsLoading) return
    reload()
  }, [reload, permissionsLoading])

  const requestToggleBss = (bss: WifiBss) => {
    if (bss.config.enabled && bss.status?.is_main_bss) {
      setConfirmDisable(bss)
      return
    }
    void toggleBss(bss)
  }

  const toggleBss = async (bss: WifiBss) => {
    setBusyId(bss.id)
    try {
      await updateWifiBss(bss.id, { enabled: !bss.config.enabled })
      await reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-[10px] shadow-sm">
      <div className="border-b border-gray-200 px-5 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/icone/router.png"
            alt=""
            aria-hidden="true"
            className="w-10 h-10 object-contain shrink-0"
          />
          <div className="min-w-0">
            <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Reti Wi-Fi
            </h2>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Gestisci nome, password e stato delle reti
            </p>
          </div>
        </div>
        {!canWrite && !permissionsLoading && (
          <span className="text-[10px] uppercase tracking-wider text-gray-500 border border-gray-300 rounded-[10px] px-2 py-1">
            Sola lettura
          </span>
        )}
      </div>

      {!canWrite && !permissionsLoading && (
        <div className="border-l-2 border-red-600 bg-gray-50 rounded-[10px] px-5 py-3">
          <p className="text-[13px] text-black font-semibold">
            Permesso di modifica non concesso
          </p>
          <p className="text-[12px] text-gray-700 mt-1 leading-relaxed">
            Per cambiare la password Wi-Fi questa app deve avere il permesso
            "Modifica impostazioni". Vai sul pannello{' '}
            <a
              href="http://mafreebox.freebox.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-red-700"
            >
              mafreebox.freebox.fr
            </a>{' '}
            → <em>Gestione degli accessi</em> → seleziona{' '}
            <em>"Iliad Network Monitor"</em> e abilita la modifica delle
            impostazioni.
          </p>
        </div>
      )}

      <div className="px-5 py-4">
        {error && (
          <p className="text-sm text-red-700 mb-3">Errore — {error}</p>
        )}

        {permissionsLoading && (
          <p className="text-sm text-gray-500">Caricamento…</p>
        )}

        {!permissionsLoading && bssList === null && !error && (
          <p className="text-sm text-gray-500">Caricamento…</p>
        )}

        {bssList && bssList.length === 0 && (
          <p className="text-sm text-gray-500">Nessuna rete configurata</p>
        )}

        {bssList && bssList.length > 0 && (
          <ul className="divide-y divide-gray-100 -my-2">
            {bssList.map((bss) => {
              const revealed = revealId === bss.id
              return (
                <li key={bss.id} className="py-3">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-black truncate">
                          {bss.config.ssid || '(senza nome)'}
                        </span>
                        {bss.config.hide_ssid && (
                          <Badge>Nascosta</Badge>
                        )}
                        <Badge>{labelEncryption(bss.config.encryption)}</Badge>
                      </div>
                      <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                        {bss.id} · {bss.status?.sta_count ?? 0} client
                      </div>
                    </div>
                    <div
                      className={`shrink-0 text-[10px] uppercase tracking-wider rounded-[10px] px-2 py-1 ${
                        bss.config.enabled
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {bss.config.enabled ? 'Attiva' : 'Spenta'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100">
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                        Password
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-[12px] font-mono text-black truncate">
                          {revealed
                            ? bss.config.key || '(vuota)'
                            : '••••••••••••'}
                        </code>
                        <button
                          onClick={() =>
                            setRevealId(revealed ? null : bss.id)
                          }
                          className="text-[10px] uppercase tracking-wider text-gray-600 hover:text-black"
                        >
                          {revealed ? 'Nascondi' : 'Mostra'}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setEditing(bss)}
                        disabled={!canWrite || busyId === bss.id}
                        className="text-[11px] uppercase tracking-wider px-3 py-1.5 border border-gray-300 hover:border-black hover:bg-black hover:text-white text-gray-700 rounded-[10px] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-700"
                      >
                        Cambia password
                      </button>
                      <button
                        onClick={() => requestToggleBss(bss)}
                        disabled={!canWrite || busyId === bss.id}
                        className="text-[11px] uppercase tracking-wider px-3 py-1.5 border border-gray-300 hover:border-red-600 hover:text-red-700 text-gray-700 rounded-[10px] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-700"
                      >
                        {busyId === bss.id
                          ? '…'
                          : bss.config.enabled
                            ? 'Spegni'
                            : 'Accendi'}
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {editing && (
        <ChangePasswordModal
          bss={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            reload()
          }}
        />
      )}

      <ConfirmModal
        open={confirmDisable !== null}
        title="Spegnere questa rete Wi-Fi?"
        destructive
        confirmLabel="Sì, spegni"
        message={
          <div className="space-y-2">
            <p>
              Stai per spegnere la rete principale{' '}
              <strong className="text-black">
                {confirmDisable?.config.ssid}
              </strong>
              .
            </p>
            <p className="text-gray-600">
              Tutti i dispositivi connessi via Wi-Fi (incluso questo, se sei
              connesso senza cavo) perderanno la connessione. Per riaccenderla
              dovrai usare un cavo Ethernet o il pannello iliadbox.
            </p>
          </div>
        }
        busy={busyId === confirmDisable?.id}
        onCancel={() => setConfirmDisable(null)}
        onConfirm={async () => {
          if (!confirmDisable) return
          const bss = confirmDisable
          setConfirmDisable(null)
          await toggleBss(bss)
        }}
      />
    </div>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-[10px]">
      {children}
    </span>
  )
}

function labelEncryption(enc: string): string {
  switch (enc) {
    case 'wpa2_psk':
      return 'WPA2'
    case 'wpa12_psk':
      return 'WPA/WPA2'
    case 'wpa_psk':
      return 'WPA'
    case 'wep':
      return 'WEP'
    case 'open':
      return 'Aperta'
    default:
      return enc
  }
}
