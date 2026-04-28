export type FreeboxResponse<T> = {
  success: boolean
  result?: T
  error_code?: string
  msg?: string
}

export type AuthorizeResult = {
  app_token: string
  track_id: number
}

export type AuthorizeStatus =
  | 'unknown'
  | 'pending'
  | 'timeout'
  | 'granted'
  | 'denied'

export type TrackStatus = {
  status: AuthorizeStatus
  challenge: string
  password_salt?: string
}

export type ChallengeResult = {
  logged_in: boolean
  challenge: string
}

export type SessionResult = {
  session_token: string
  challenge: string
  permissions: Record<string, boolean>
}

export type ConnectionState = 'going_up' | 'up' | 'going_down' | 'down'
export type ConnectionType = 'ethernet' | 'rfc2684' | 'pppoatm' | string
export type ConnectionMedia = 'ftth' | 'xdsl' | 'ethernet' | string

export type ConnectionStatus = {
  state: ConnectionState
  type: ConnectionType
  media: ConnectionMedia
  ipv4: string
  ipv6: string
  rate_up: number
  rate_down: number
  bandwidth_up: number
  bandwidth_down: number
  bytes_up: number
  bytes_down: number
}

export type LanHostL3 = {
  af: string
  active: boolean
  reachable: boolean
  last_time_reachable: number
  address: string
}

export type LanHost = {
  id: string
  primary_name: string
  primary_name_manual: boolean
  host_type: string
  active: boolean
  persistent: boolean
  reachable: boolean
  last_time_reachable: number
  vendor_name?: string
  l2ident: {
    id: string
    type: string
  }
  l3connectivities?: LanHostL3[]
}

export type SensorReading = {
  id: string
  name: string
  value: number
}

export type SystemInfo = {
  firmware_version: string
  mac: string
  serial: string
  uptime: string
  uptime_val: number
  board_name: string
  model_info?: {
    pretty_name: string
    name: string
  }
  sensors: SensorReading[]
  fans: SensorReading[]
}

export type WifiEncryption =
  | 'wpa2_psk'
  | 'wpa12_psk'
  | 'wpa_psk'
  | 'wep'
  | 'open'

export type WifiBssConfig = {
  enabled: boolean
  use_default_config: boolean
  ssid: string
  hide_ssid: boolean
  encryption: WifiEncryption
  key: string
  eapol_version?: number
}

export type WifiBssStatus = {
  state: string
  sta_count: number
  authorized_sta_count: number
  is_main_bss: boolean
}

export type WifiBss = {
  id: string
  phy_id: number
  config: WifiBssConfig
  status: WifiBssStatus
}

export type Permissions = Record<string, boolean>

export type RrdDb = 'net' | 'temp' | 'dsl' | 'switch'

export type RrdRequest = {
  db: RrdDb
  date_start: number
  date_end: number
  precision?: number
  fields?: string[]
}

export type RrdSample = {
  time: number
  [field: string]: number
}

export type RrdResponse = {
  data: RrdSample[]
}
