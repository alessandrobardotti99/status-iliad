import { apiGet, apiPost, apiPut } from './client'
import type {
  ConnectionStatus,
  LanHost,
  RrdRequest,
  RrdResponse,
  SystemInfo,
  WifiBss,
  WifiBssConfig,
} from './types'

export function getConnection() {
  return apiGet<ConnectionStatus>('/connection/')
}

export function getLanHosts() {
  return apiGet<LanHost[]>('/lan/browser/pub/')
}

export function getSystem() {
  return apiGet<SystemInfo>('/system/')
}

export function getWifiBssList() {
  return apiGet<WifiBss[]>('/wifi/bss/')
}

export function updateWifiBss(id: string, config: Partial<WifiBssConfig>) {
  return apiPut<WifiBss>(`/wifi/bss/${id}`, { config })
}

export function getRrd(req: RrdRequest) {
  return apiPost<RrdResponse>('/rrd/', req)
}
