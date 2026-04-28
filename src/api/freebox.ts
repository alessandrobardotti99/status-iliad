import { apiDelete, apiGet, apiPost, apiPut } from './client'
import type {
  ConnectionStatus,
  LanHost,
  ParentalConfig,
  ParentalFilter,
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

export function getParentalConfig() {
  return apiGet<ParentalConfig>('/parental/config/')
}

export function updateParentalConfig(config: Partial<ParentalConfig>) {
  return apiPut<ParentalConfig>('/parental/config/', config)
}

export function getParentalFilters() {
  return apiGet<ParentalFilter[]>('/parental/filter/')
}

export function createParentalFilter(filter: Omit<ParentalFilter, 'id'>) {
  return apiPost<ParentalFilter>('/parental/filter/', filter)
}

export function updateParentalFilter(
  id: number,
  filter: Partial<Omit<ParentalFilter, 'id'>>,
) {
  return apiPut<ParentalFilter>(`/parental/filter/${id}`, filter)
}

export function deleteParentalFilter(id: number) {
  return apiDelete<void>(`/parental/filter/${id}`)
}
