import { getConnection, getLanHosts, getSystem } from '../api/freebox'
import { usePermissions } from '../hooks/usePermissions'
import { usePolling } from '../hooks/usePolling'
import { BandwidthChart } from './BandwidthChart'
import { DemoBanner } from './DemoBanner'
import { DevicesList } from './DevicesList'
import { IosInstallHint } from './IosInstallHint'
import { StatusCard } from './StatusCard'
import { SystemInfo } from './SystemInfo'
import { WifiCard } from './WifiCard'

type Props = {
  demo: boolean
  onExitDemo: () => void
}

export function Dashboard({ demo, onExitDemo }: Props) {
  const connection = usePolling(getConnection, 2000, true)
  const devices = usePolling(getLanHosts, 15000, true)
  const system = usePolling(getSystem, 30000, true)
  const { permissions, loading: permissionsLoading } = usePermissions()

  const isOffline = !!connection.error && !connection.data

  return (
    <main className="max-w-7xl w-full mx-auto p-6 space-y-6">
      {demo && <DemoBanner onExit={onExitDemo} />}

      <IosInstallHint />

      {isOffline && (
        <div className="bg-white border border-gray-200 border-l-2 border-l-red-600 rounded shadow-sm px-4 py-3 text-sm text-black">
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
  )
}
