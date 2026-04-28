import { openSession } from './auth'
import { DEMO_TOKEN, getDemoPermissions, mockHandle } from './mock'
import type { FreeboxResponse, Permissions } from './types'

const API_BASE = '/api/v8'

export class FreeboxError extends Error {
  code?: string
  path: string
  httpStatus?: number
  response?: unknown

  constructor(opts: {
    message: string
    code?: string
    path: string
    httpStatus?: number
    response?: unknown
  }) {
    super(opts.message)
    this.name = 'FreeboxError'
    this.code = opts.code
    this.path = opts.path
    this.httpStatus = opts.httpStatus
    this.response = opts.response
  }
}

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

  const doFetch = async (): Promise<{
    body: FreeboxResponse<T>
    status: number
  }> => {
    const method = (init.method ?? 'GET').toUpperCase()
    const timeoutMs =
      method === 'PUT' || method === 'POST' ? 30_000 : method === 'DELETE' ? 15_000 : 10_000
    const timeoutSignal =
      init.signal ??
      (typeof AbortSignal !== 'undefined' &&
      'timeout' in AbortSignal &&
      typeof (
        AbortSignal as unknown as { timeout?: (ms: number) => AbortSignal }
      ).timeout === 'function'
        ? (AbortSignal as unknown as { timeout: (ms: number) => AbortSignal }).timeout(
            timeoutMs,
          )
        : undefined)
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: timeoutSignal,
      headers: {
        'Content-Type': 'application/json',
        'X-Fbx-App-Auth': sessionToken!,
        ...(init.headers ?? {}),
      },
    })
    if (!res.ok && res.status !== 403) {
      throw new Error(`HTTP ${res.status} on ${path}`)
    }
    return {
      body: (await res.json()) as FreeboxResponse<T>,
      status: res.status,
    }
  }

  let { body, status } = await doFetch()

  const maybeRefreshAndRetry = async () => {
    sessionToken = null
    await refreshSession()
    ;({ body, status } = await doFetch())
  }

  if (!body.success) {
    const effectiveCode =
      body.error_code ?? (status === 403 ? 'insufficient_rights' : undefined)

    if (effectiveCode === 'auth_required') {
      await maybeRefreshAndRetry()
    } else if (
      effectiveCode === 'insufficient_rights' ||
      effectiveCode === 'access_denied' ||
      effectiveCode === 'permission_denied'
    ) {
      // The user might have just granted extra rights in the Freebox UI.
      // Refreshing the session updates `permissions` and may fix the call.
      await maybeRefreshAndRetry()
    }
  }

  if (!body.success) {
    const effectiveCode =
      body.error_code ?? (status === 403 ? 'insufficient_rights' : undefined)

    const fallbackDetails = (() => {
      if (body.msg || effectiveCode) return null
      try {
        const json = JSON.stringify(body)
        if (json.length <= 320) return json
        return `${json.slice(0, 320)}…`
      } catch {
        return null
      }
    })()

    throw new FreeboxError({
      message:
        body.msg ??
        effectiveCode ??
        `Freebox error (HTTP ${status}) on ${path}${
          fallbackDetails ? ` — ${fallbackDetails}` : ''
        }`,
      code: effectiveCode,
      path,
      httpStatus: status,
      response: body,
    })
  }
  // Some endpoints (or firmware variants) reply with `{ success: true }`
  // without a `result` field. Treat that as an empty/void result.
  return body.result as T
}
