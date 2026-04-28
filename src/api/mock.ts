import type {
  ConnectionStatus,
  LanHost,
  ParentalConfig,
  ParentalFilter,
  Permissions,
  RrdRequest,
  RrdResponse,
  RrdSample,
  SystemInfo,
  WifiBss,
  WifiBssConfig,
} from './types'

export const DEMO_TOKEN = '__demo__'

const STARTED_AT = Date.now()

// ─── Helpers ─────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms))
}

function jitter(base: number, variance: number): number {
  return Math.max(0, Math.round(base + (Math.random() - 0.5) * 2 * variance))
}

function elapsedSeconds(): number {
  return Math.floor((Date.now() - STARTED_AT) / 1000)
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randHex(len: number): string {
  return Array.from({ length: len }, () => randInt(0, 15).toString(16))
    .join('')
    .toUpperCase()
}

function randMacByte(): string {
  return randInt(0, 255).toString(16).padStart(2, '0').toUpperCase()
}

function randMac(): string {
  return Array.from({ length: 6 }, randMacByte).join(':')
}

function randString(len: number): string {
  const chars =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from(
    { length: len },
    () => chars[randInt(0, chars.length - 1)],
  ).join('')
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randInt(0, i)
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// ─── Per-session randomized identity ─────────────────────────────────────────

const DEMO_IPV4 = `${randInt(78, 95)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(2, 254)}`
const DEMO_IPV6 = `2a04:cec0:${randHex(4).toLowerCase()}:${randHex(4).toLowerCase()}::${randHex(2).toLowerCase()}`
const DEMO_ROUTER_MAC = `F4:CA:E5:${randMacByte()}:${randMacByte()}:${randMacByte()}`
const DEMO_SERIAL = randString(13).toUpperCase()
const DEMO_SSID_TAG = randHex(6)
const DEMO_WIFI_PASSWORD = randString(14)
const DEMO_GUEST_PASSWORD = randString(12)
const DEMO_BYTES_DOWN_BASE = randInt(800_000_000_000, 6_500_000_000_000)
const DEMO_BYTES_UP_BASE = randInt(80_000_000_000, 600_000_000_000)
const DEMO_UPTIME_BASE =
  randInt(2, 60) * 86400 + randInt(0, 23) * 3600 + randInt(0, 59) * 60

// ─── Connection ─────────────────────────────────────────────────────────────

function mockConnection(): ConnectionStatus {
  const t = elapsedSeconds()
  const downBase = 12_500_000 + Math.sin(t / 7) * 8_000_000
  const upBase = 1_800_000 + Math.cos(t / 5) * 1_200_000
  return {
    state: 'up',
    type: 'ethernet',
    media: 'ftth',
    ipv4: DEMO_IPV4,
    ipv6: DEMO_IPV6,
    rate_down: jitter(downBase, 1_500_000),
    rate_up: jitter(upBase, 400_000),
    bandwidth_down: 5_000_000_000,
    bandwidth_up: 700_000_000,
    bytes_down: DEMO_BYTES_DOWN_BASE + t * 14_000_000,
    bytes_up: DEMO_BYTES_UP_BASE + t * 1_800_000,
  }
}

// ─── System ─────────────────────────────────────────────────────────────────

function mockSystem(): SystemInfo {
  const uptime = DEMO_UPTIME_BASE + elapsedSeconds()
  return {
    firmware_version: '4.8.13',
    mac: DEMO_ROUTER_MAC,
    serial: DEMO_SERIAL,
    uptime: `${Math.floor(uptime / 86400)} giorni`,
    uptime_val: uptime,
    board_name: 'fbxgw7r',
    model_info: { pretty_name: 'Iliadbox', name: 'fbxgw7r' },
    sensors: [
      { id: 'temp_cpub', name: 'CPU B', value: jitter(54, 3) },
      { id: 'temp_cpum', name: 'CPU M', value: jitter(52, 3) },
      { id: 'temp_sw', name: 'Switch', value: jitter(48, 2) },
      { id: 'temp_hdd', name: 'HDD', value: jitter(41, 2) },
    ],
    fans: [{ id: 'fan0_speed', name: 'Ventola', value: jitter(2150, 50) }],
  }
}

// ─── LAN hosts ──────────────────────────────────────────────────────────────

type DeviceTemplate = {
  name: string
  host_type: string
  vendor_name: string
}

const DEVICE_POOL: DeviceTemplate[] = [
  { name: 'iPhone', host_type: 'smartphone', vendor_name: 'Apple, Inc.' },
  { name: 'iPad', host_type: 'tablet', vendor_name: 'Apple, Inc.' },
  { name: 'MacBook Pro', host_type: 'workstation', vendor_name: 'Apple, Inc.' },
  { name: 'MacBook Air', host_type: 'workstation', vendor_name: 'Apple, Inc.' },
  { name: 'Apple TV', host_type: 'multimedia_device', vendor_name: 'Apple, Inc.' },
  { name: 'Apple Watch', host_type: 'smartphone', vendor_name: 'Apple, Inc.' },
  { name: 'Galaxy S24', host_type: 'smartphone', vendor_name: 'Samsung Electronics' },
  { name: 'Galaxy Tab', host_type: 'tablet', vendor_name: 'Samsung Electronics' },
  { name: 'Smart TV Samsung', host_type: 'tv', vendor_name: 'Samsung Electronics' },
  { name: 'Smart TV LG', host_type: 'tv', vendor_name: 'LG Electronics' },
  { name: 'Smart TV Sony', host_type: 'tv', vendor_name: 'Sony Corporation' },
  { name: 'Pixel 8', host_type: 'smartphone', vendor_name: 'Google Inc.' },
  { name: 'Chromecast', host_type: 'multimedia_device', vendor_name: 'Google Inc.' },
  { name: 'Nest Mini', host_type: 'smart_speaker', vendor_name: 'Google Inc.' },
  { name: 'Echo Dot', host_type: 'smart_speaker', vendor_name: 'Amazon Technologies' },
  { name: 'Echo Show', host_type: 'smart_speaker', vendor_name: 'Amazon Technologies' },
  { name: 'Fire TV Stick', host_type: 'multimedia_device', vendor_name: 'Amazon Technologies' },
  { name: 'Sonos One', host_type: 'smart_speaker', vendor_name: 'Sonos Inc.' },
  { name: 'PlayStation 5', host_type: 'multimedia_device', vendor_name: 'Sony Interactive Ent.' },
  { name: 'Xbox Series X', host_type: 'multimedia_device', vendor_name: 'Microsoft' },
  { name: 'Nintendo Switch', host_type: 'multimedia_device', vendor_name: 'Nintendo' },
  { name: 'Philips Hue Bridge', host_type: 'iot', vendor_name: 'Signify Netherlands' },
  { name: 'Tapo P100', host_type: 'iot', vendor_name: 'TP-Link Corporation' },
  { name: 'Ring Doorbell', host_type: 'iot', vendor_name: 'Ring LLC' },
  { name: 'Aqara Hub', host_type: 'iot', vendor_name: 'Aqara' },
  { name: 'Stampante HP', host_type: 'printer', vendor_name: 'HP Inc.' },
  { name: 'Stampante Brother', host_type: 'printer', vendor_name: 'Brother Industries' },
  { name: 'Stampante Epson', host_type: 'printer', vendor_name: 'Seiko Epson' },
  { name: 'NAS Synology', host_type: 'nas', vendor_name: 'Synology Inc.' },
  { name: 'NAS QNAP', host_type: 'nas', vendor_name: 'QNAP Systems' },
  { name: 'Raspberry Pi', host_type: 'workstation', vendor_name: 'Raspberry Pi Foundation' },
  { name: 'Laptop Dell', host_type: 'workstation', vendor_name: 'Dell Inc.' },
  { name: 'Laptop Lenovo', host_type: 'workstation', vendor_name: 'Lenovo' },
]

function generateHosts(): LanHost[] {
  const count = randInt(7, 13)
  const selected = shuffle(DEVICE_POOL).slice(0, count)
  const usedIps = new Set<number>()
  const now = Math.floor(Date.now() / 1000)

  return selected.map((d, i) => {
    const mac = randMac()
    let lastByte: number
    do {
      lastByte = randInt(20, 220)
    } while (usedIps.has(lastByte))
    usedIps.add(lastByte)
    const ip = `192.168.1.${lastByte}`

    const isActive = Math.random() > 0.25
    const lastReachable = isActive
      ? now
      : now - randInt(600, 7 * 86400)

    return {
      id: `host-${i}-${mac.replace(/:/g, '')}`,
      primary_name: d.name,
      primary_name_manual: false,
      host_type: d.host_type,
      active: isActive,
      persistent: true,
      reachable: isActive,
      last_time_reachable: lastReachable,
      vendor_name: d.vendor_name,
      l2ident: { id: mac, type: 'mac_address' },
      l3connectivities: isActive
        ? [
            {
              af: 'ipv4',
              active: true,
              reachable: true,
              last_time_reachable: 0,
              address: ip,
            },
          ]
        : [],
    }
  })
}

let mockHosts: LanHost[] = generateHosts()

// ─── Wi-Fi BSSes ────────────────────────────────────────────────────────────

function bssMac(offset: number): string {
  const parts = DEMO_ROUTER_MAC.split(':')
  const last = parseInt(parts[5], 16)
  parts[5] = ((last + offset) % 256).toString(16).padStart(2, '0').toUpperCase()
  return parts.join(':')
}

let mockBssList: WifiBss[] = [
  {
    id: bssMac(0),
    phy_id: 0,
    config: {
      enabled: true,
      use_default_config: false,
      ssid: `Freebox-${DEMO_SSID_TAG}`,
      hide_ssid: false,
      encryption: 'wpa2_psk',
      key: DEMO_WIFI_PASSWORD,
      eapol_version: 2,
    },
    status: {
      state: 'active',
      sta_count: randInt(2, 8),
      authorized_sta_count: randInt(2, 8),
      is_main_bss: true,
    },
  },
  {
    id: bssMac(1),
    phy_id: 1,
    config: {
      enabled: true,
      use_default_config: false,
      ssid: `Freebox-${DEMO_SSID_TAG}-5G`,
      hide_ssid: false,
      encryption: 'wpa12_psk',
      key: DEMO_WIFI_PASSWORD,
      eapol_version: 2,
    },
    status: {
      state: 'active',
      sta_count: randInt(1, 6),
      authorized_sta_count: randInt(1, 6),
      is_main_bss: false,
    },
  },
  {
    id: bssMac(2),
    phy_id: 0,
    config: {
      enabled: false,
      use_default_config: false,
      ssid: `Freebox-Ospiti-${randHex(4)}`,
      hide_ssid: false,
      encryption: 'wpa2_psk',
      key: DEMO_GUEST_PASSWORD,
      eapol_version: 2,
    },
    status: {
      state: 'inactive',
      sta_count: 0,
      authorized_sta_count: 0,
      is_main_bss: false,
    },
  },
]

// ─── Parental Control ───────────────────────────────────────────────────────

function emptyPlanning(allowed = true): boolean[] {
  return Array.from({ length: 168 }, () => allowed)
}

function blockHours(
  planning: boolean[],
  days: number[],
  startHour: number,
  endHour: number,
): boolean[] {
  const out = [...planning]
  for (const day of days) {
    if (startHour <= endHour) {
      for (let h = startHour; h < endHour; h++) {
        out[day * 24 + h] = false
      }
    } else {
      for (let h = startHour; h < 24; h++) out[day * 24 + h] = false
      for (let h = 0; h < endHour; h++) out[day * 24 + h] = false
    }
  }
  return out
}

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6]
const WEEKDAYS = [0, 1, 2, 3, 4]

let mockParentalConfig: ParentalConfig = { default_filter_mode: 'allowed' }

function pickHostMacByType(host_types: string[], n: number): string[] {
  const matching = mockHosts
    .filter((h) => host_types.includes(h.host_type))
    .map((h) => h.l2ident.id)
  return matching.slice(0, n)
}

let nextFilterId = 1
let mockParentalFilters: ParentalFilter[] = (() => {
  const filters: ParentalFilter[] = []

  const consoleMacs = pickHostMacByType(['multimedia_device'], 3)
  if (consoleMacs.length > 0) {
    filters.push({
      id: nextFilterId++,
      name: 'Console giochi',
      description: 'Notte e mattino: console bloccate',
      enabled: true,
      default_filter_mode: 'allowed',
      current_filter_mode: 'allowed',
      macs: consoleMacs,
      planning: blockHours(emptyPlanning(), ALL_DAYS, 22, 7),
    })
  }

  const tabletMacs = pickHostMacByType(['tablet', 'smartphone'], 2)
  if (tabletMacs.length > 0) {
    filters.push({
      id: nextFilterId++,
      name: 'Orario scolastico',
      description: 'Lun-Ven dalle 8 alle 13 niente schermi',
      enabled: true,
      default_filter_mode: 'allowed',
      current_filter_mode: 'allowed',
      macs: tabletMacs,
      planning: blockHours(
        blockHours(emptyPlanning(), WEEKDAYS, 8, 13),
        ALL_DAYS,
        22,
        7,
      ),
    })
  }

  return filters
})()

// ─── RRD ────────────────────────────────────────────────────────────────────

function mockRrd(req: RrdRequest): RrdResponse {
  const totalSeconds = Math.max(60, req.date_end - req.date_start)
  const targetSamples = 200
  const step = Math.max(1, Math.floor(totalSeconds / targetSamples))
  const data: RrdSample[] = []

  for (let t = req.date_start; t <= req.date_end; t += step) {
    const hour = (((t / 3600) % 24) + 24) % 24
    const dayFactor =
      0.4 + Math.max(0, Math.sin(((hour - 6) / 24) * Math.PI * 2)) * 0.9

    if (req.db === 'net') {
      data.push({
        time: t,
        rate_down: Math.round(
          8_000_000 * dayFactor + Math.random() * 5_000_000,
        ),
        rate_up: Math.round(900_000 * dayFactor + Math.random() * 600_000),
        bw_down: 5_000_000_000,
        bw_up: 700_000_000,
      })
    } else if (req.db === 'temp') {
      const drift = Math.sin(t / 1800) * 4
      data.push({
        time: t,
        cpum: Math.round((52 + drift + Math.random() * 2) * 10) / 10,
        cpub: Math.round((54 + drift + Math.random() * 2) * 10) / 10,
        sw: Math.round((48 + Math.cos(t / 2200) * 2) * 10) / 10,
        hdd: Math.round((41 + Math.sin(t / 2400) * 1.5) * 10) / 10,
        fan_speed: Math.round(2100 + Math.cos(t / 1500) * 80),
      })
    } else {
      data.push({ time: t })
    }
  }

  return { data }
}

// ─── Permissions ────────────────────────────────────────────────────────────

const fullPermissions: Permissions = {
  settings: true,
  contacts: true,
  calls: true,
  explorer: true,
  downloader: true,
  parental: true,
  pvr: true,
}

export function getDemoPermissions(): Permissions {
  return { ...fullPermissions }
}

// ─── Dispatch ───────────────────────────────────────────────────────────────

export async function mockHandle<T>(
  path: string,
  init: RequestInit,
): Promise<T> {
  await delay(120 + Math.random() * 80)
  const method = (init.method ?? 'GET').toUpperCase()

  if (method === 'GET' && path === '/connection/') {
    return mockConnection() as T
  }
  if (method === 'GET' && path === '/lan/browser/pub/') {
    return mockHosts as T
  }
  if (method === 'GET' && path === '/system/') {
    return mockSystem() as T
  }
  if (method === 'GET' && path === '/wifi/bss/') {
    return mockBssList as T
  }
  if (method === 'POST' && path === '/rrd/') {
    const body = init.body ? JSON.parse(init.body as string) : {}
    return mockRrd(body as RrdRequest) as T
  }

  if (method === 'GET' && path === '/parental/config/') {
    return mockParentalConfig as T
  }
  if (method === 'PUT' && path === '/parental/config/') {
    const body = init.body ? JSON.parse(init.body as string) : {}
    mockParentalConfig = { ...mockParentalConfig, ...body }
    return mockParentalConfig as T
  }
  if (method === 'GET' && path === '/parental/filter/') {
    return mockParentalFilters as T
  }
  if (method === 'POST' && path === '/parental/filter/') {
    const body = init.body ? JSON.parse(init.body as string) : {}
    const filter: ParentalFilter = {
      id: nextFilterId++,
      enabled: true,
      default_filter_mode: 'allowed',
      current_filter_mode: 'allowed',
      planning: emptyPlanning(),
      macs: [],
      name: 'Nuovo filtro',
      ...body,
    }
    mockParentalFilters = [...mockParentalFilters, filter]
    return filter as T
  }
  const parentalDetailMatch = path.match(/^\/parental\/filter\/(\d+)$/)
  if (parentalDetailMatch) {
    const id = parseInt(parentalDetailMatch[1], 10)
    const idx = mockParentalFilters.findIndex((f) => f.id === id)
    if (idx === -1) throw new Error(`Demo: filtro ${id} non trovato`)
    if (method === 'PUT') {
      const body = init.body ? JSON.parse(init.body as string) : {}
      const updated: ParentalFilter = {
        ...mockParentalFilters[idx],
        ...body,
        id,
      }
      mockParentalFilters = [
        ...mockParentalFilters.slice(0, idx),
        updated,
        ...mockParentalFilters.slice(idx + 1),
      ]
      return updated as T
    }
    if (method === 'DELETE') {
      mockParentalFilters = mockParentalFilters.filter((f) => f.id !== id)
      return undefined as T
    }
  }

  const wifiPutMatch = path.match(/^\/wifi\/bss\/(.+)$/)
  if (method === 'PUT' && wifiPutMatch) {
    const id = decodeURIComponent(wifiPutMatch[1])
    const body = init.body ? JSON.parse(init.body as string) : {}
    const partial = (body.config ?? {}) as Partial<WifiBssConfig>
    const idx = mockBssList.findIndex((b) => b.id === id)
    if (idx === -1) throw new Error(`Demo: rete ${id} non trovata`)
    const updated: WifiBss = {
      ...mockBssList[idx],
      config: { ...mockBssList[idx].config, ...partial },
    }
    mockBssList = [
      ...mockBssList.slice(0, idx),
      updated,
      ...mockBssList.slice(idx + 1),
    ]
    return updated as T
  }

  throw new Error(`Demo: nessun mock per ${method} ${path}`)
}
