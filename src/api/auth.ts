import HmacSHA1 from 'crypto-js/hmac-sha1'
import Hex from 'crypto-js/enc-hex'
import type {
  AuthorizeResult,
  ChallengeResult,
  FreeboxResponse,
  SessionResult,
  TrackStatus,
} from './types'

export const APP_ID = 'it.my-dashboard.monitor'
export const APP_NAME = 'Iliad Network Monitor'
export const APP_VERSION = '1.0.0'
export const DEVICE_NAME = 'Sviluppatore'

const API_BASE = '/api/v8'

async function freeboxFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok && res.status !== 403) {
    throw new Error(`HTTP ${res.status} on ${path}`)
  }
  const body = (await res.json()) as FreeboxResponse<T>
  if (!body.success || !body.result) {
    throw new Error(body.msg ?? body.error_code ?? `Freebox error on ${path}`)
  }
  return body.result
}

export async function requestAuthorization(): Promise<AuthorizeResult> {
  return freeboxFetch<AuthorizeResult>('/login/authorize/', {
    method: 'POST',
    body: JSON.stringify({
      app_id: APP_ID,
      app_name: APP_NAME,
      app_version: APP_VERSION,
      device_name: DEVICE_NAME,
    }),
  })
}

export async function checkTrack(trackId: number): Promise<TrackStatus> {
  return freeboxFetch<TrackStatus>(`/login/authorize/${trackId}`)
}

export async function getChallenge(): Promise<string> {
  const r = await freeboxFetch<ChallengeResult>('/login/')
  return r.challenge
}

export function signChallenge(appToken: string, challenge: string): string {
  return HmacSHA1(challenge, appToken).toString(Hex)
}

export async function openSession(appToken: string): Promise<SessionResult> {
  const challenge = await getChallenge()
  const password = signChallenge(appToken, challenge)
  return freeboxFetch<SessionResult>('/login/session/', {
    method: 'POST',
    body: JSON.stringify({ app_id: APP_ID, password }),
  })
}
