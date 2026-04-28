import { useState } from 'react'
import { getConnection, getLanHosts, getSystem } from '../api/freebox'
import { usePermissions } from '../hooks/usePermissions'
import { usePolling } from '../hooks/usePolling'
import { BandwidthChart } from './BandwidthChart'
import { DevicesList } from './DevicesList'
import { HowItWorks } from './HowItWorks'
import { StatusCard } from './StatusCard'
import { SystemInfo } from './SystemInfo'
import { WifiCard } from './WifiCard'

type Props = {
  onLogout: () => void
}

export function Dashboard({ onLogout }: Props) {
  const connection = usePolling(getConnection, 5000, true)
  const devices = usePolling(getLanHosts, 15000, true)
  const system = usePolling(getSystem, 30000, true)
  const { permissions, loading: permissionsLoading } = usePermissions()

  const [showInfo, setShowInfo] = useState(false)
  const isOffline = !!connection.error && !connection.data

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="border-l-2 border-red-600 pl-3">
              <h1 className="text-sm font-semibold text-black uppercase tracking-wider">
                Iliad Network Monitor
              </h1>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {connection.data?.media?.toUpperCase() ?? 'iliadbox'} ·
                aggiornamento ogni 5s
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfo((v) => !v)}
              className="text-[11px] text-gray-600 hover:text-black px-3 py-1.5 border border-gray-300 hover:border-gray-400 uppercase tracking-wider transition-colors"
            >
              {showInfo ? 'Chiudi info' : 'Come funziona'}
            </button>
            <button
              onClick={onLogout}
              className="text-[11px] text-gray-600 hover:text-black px-3 py-1.5 border border-gray-300 hover:border-gray-400 uppercase tracking-wider transition-colors"
            >
              Disconnetti
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {isOffline && (
          <div className="bg-white border border-gray-200 border-l-2 border-l-red-600 px-4 py-3 text-sm text-black">
            <strong className="font-semibold">
              iliadbox non raggiungibile.
            </strong>{' '}
            Verificare la connessione alla rete Iliad e che{' '}
            <code className="font-mono text-xs">mafreebox.freebox.fr</code>{' '}
            risponda.
            <div className="text-xs text-gray-500 mt-1 wrap-break-word">
              {connection.error}
            </div>
          </div>
        )}

        {showInfo && <HowItWorks />}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <StatusCard data={connection.data} error={connection.error} />
          </div>
          <div className="lg:col-span-2">
            <BandwidthChart data={connection.data} />
          </div>
        </div>

        <WifiCard
          permissions={permissions}
          permissionsLoading={permissionsLoading}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DevicesList data={devices.data} error={devices.error} />
          </div>
          <div className="lg:col-span-1">
            <SystemInfo data={system.data} error={system.error} />
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-6 text-center">
        <p className="text-[11px] text-gray-400 uppercase tracking-wider">
          Iliad Network Monitor · FreeboxOS API v8
        </p>
      </footer>
    </div>
  )
}
