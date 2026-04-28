import { openSession } from './auth'
import { DEMO_TOKEN, getDemoPermissions, mockHandle } from './mock'
import type { FreeboxResponse, Permissions } from './types'

const API_BASE = '/api/v8'

let sessionToken: string | null = null
let appToken: string | null = null
let permissions: Permissions | null = null
let refreshing: Promise<string> | null = null
const permissionsListeners = new Set<(p: Permissions | null) => void>()

export function setAppToken(token: string | null) {
  appToken = token
  sessionToken = null
  if (token === DEMO_TOKEN) {
    sessionToken = 'demo-session'
    permissions = getDemoPermissions()
  } else {
    permissions = null
  }
  notifyPermissions()
}

export function getAppToken(): string | null {
  return appToken
}

export function isDemoMode(): boolean {
  return appToken === DEMO_TOKEN
}

export function getPermissions(): Permissions | null {
  return permissions
}

export function onPermissionsChange(
  listener: (p: Permissions | null) => void,
): () => void {
  permissionsListeners.add(listener)
  return () => {
    permissionsListeners.delete(listener)
  }
}

function notifyPermissions() {
  permissionsListeners.forEach((l) => l(permissions))
}

async function refreshSession(): Promise<string> {
  if (!appToken) throw new Error('Missing app_token')
  if (appToken === DEMO_TOKEN) {
    sessionToken = 'demo-session'
    permissions = getDemoPermissions()
    notifyPermissions()
    return sessionToken
  }
  if (!refreshing) {
    refreshing = openSession(appToken)
      .then((r) => {
        sessionToken = r.session_token
        permissions = r.permissions ?? {}
        notifyPermissions()
        return r.session_token
      })
      .finally(() => {
        refreshing = null
      })
  }
  return refreshing
}

export async function ensureSession(): Promise<void> {
  if (!sessionToken) await refreshSession()
}

export async function apiGet<T>(path: string): Promise<T> {
  return apiCall<T>(path, { method: 'GET' })
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  return apiCall<T>(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  return apiCall<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function apiDelete<T>(path: string): Promise<T> {
  return apiCall<T>(path, { method: 'DELETE' })
}

async function apiCall<T>(path: string, init: RequestInit): Promise<T> {
  if (appToken === DEMO_TOKEN) {
    return mockHandle<T>(path, init)
  }

  if (!sessionToken) await refreshSession()

  const doFetch = async () => {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'X-Fbx-App-Auth': sessionToken!,
        ...(init.headers ?? {}),
      },
    })
    if (!res.ok && res.status !== 403) {
      throw new Error(`HTTP ${res.status} on ${path}`)
    }
    return (await res.json()) as FreeboxResponse<T>
  }

  let body = await doFetch()
  if (!body.success && body.error_code === 'auth_required') {
    sessionToken = null
    await refreshSession()
    body = await doFetch()
  }
  if (!body.success || body.result === undefined) {
    throw new Error(body.msg ?? body.error_code ?? `Freebox error on ${path}`)
  }
  return body.result
}
