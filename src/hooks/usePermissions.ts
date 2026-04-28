import { useEffect, useState } from 'react'
import {
  ensureSession,
  getPermissions,
  onPermissionsChange,
} from '../api/client'
import type { Permissions } from '../api/types'

export function usePermissions(): {
  permissions: Permissions | null
  loading: boolean
} {
  const [permissions, setPermissions] = useState<Permissions | null>(
    getPermissions(),
  )
  const [loading, setLoading] = useState(permissions === null)

  useEffect(() => {
    const unsubscribe = onPermissionsChange((p) => {
      setPermissions(p)
      setLoading(false)
    })
    if (permissions === null) {
      ensureSession()
        .catch(() => {})
        .finally(() => setLoading(false))
    }
    return unsubscribe
  }, [permissions])

  return { permissions, loading }
}
