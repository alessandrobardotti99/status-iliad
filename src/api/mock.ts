import type {
  ConnectionStatus,
  LanHost,
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

function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms))
}

function jitter(base: number, variance: number): number {
  return Math.max(0, Math.round(base + (Math.random() - 0.5) * 2 * variance))
}

function elapsedSeconds(): number {
  return Math.floor((Date.now() - STARTED_AT) / 1000)
}

function mockConnection(): ConnectionStatus {
  const t = elapsedSeconds()
  const downBase = 12_500_000 + Math.sin(t / 7) * 8_000_000
  const upBase = 1_800_000 + Math.cos(t / 5) * 1_200_000
  return {
    state: 'up',
    type: 'ethernet',
    media: 'ftth',
    ipv4: '80.180.42.117',
    ipv6: '2a04:cec0:1234:5678::1',
    rate_down: jitter(downBase, 1_500_000),
    rate_up: jitter(upBase, 400_000),
    bandwidth_down: 5_000_000_000,
    bandwidth_up: 700_000_000,
    bytes_down: 4_872_315_092_413 + t * 14_000_000,
    bytes_up: 412_098_443_217 + t * 1_800_000,
  }
}

function mockSystem(): SystemInfo {
  const uptime = 18 * 86400 + 4 * 3600 + 12 * 60 + elapsedSeconds()
  return {
    firmware_version: '4.8.13',
    mac: 'F4:CA:E5:6F:AE:90',
    serial: '2451908123456',
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

let mockHosts: LanHost[] = [
  {
    id: 'ether-aa:bb:cc:11:22:33',
    primary_name: 'MacBook-Pro-Alessandro',
    primary_name_manual: false,
    host_type: 'workstation',
    active: true,
    persistent: true,
    reachable: true,
    last_time_reachable: Math.floor(Date.now() / 1000),
    vendor_name: 'Apple, Inc.',
    l2ident: { id: 'AA:BB:CC:11:22:33', type: 'mac_address' },
    l3connectivities: [
      {
        af: 'ipv4',
        active: true,
        reachable: true,
        last_time_reachable: 0,
        address: '192.168.1.42',
      },
    ],
  },
  {
    id: 'wifi-aa:bb:cc:44:55:66',
    primary_name: 'iPhone di Alessandro',
    primary_name_manual: true,
    host_type: 'smartphone',
    active: true,
    persistent: true,
    reachable: true,
    last_time_reachable: Math.floor(Date.now() / 1000),
    vendor_name: 'Apple, Inc.',
    l2ident: { id: 'AA:BB:CC:44:55:66', type: 'mac_address' },
    l3connectivities: [
      {
        af: 'ipv4',
        active: true,
        reachable: true,
        last_time_reachable: 0,
        address: '192.168.1.51',
      },
    ],
  },
  {
    id: 'wifi-dd:ee:ff:11:22:33',
    primary_name: 'Apple TV',
    primary_name_manual: true,
    host_type: 'multimedia_device',
    active: true,
    persistent: true,
    reachable: true,
    last_time_reachable: Math.floor(Date.now() / 1000),
    vendor_name: 'Apple, Inc.',
    l2ident: { id: 'DD:EE:FF:11:22:33', type: 'mac_address' },
    l3connectivities: [
      {
        af: 'ipv4',
        active: true,
        reachable: true,
        last_time_reachable: 0,
        address: '192.168.1.78',
      },
    ],
  },
  {
    id: 'wifi-12:34:56:78:9a:bc',
    primary_name: 'Samsung-TV-Salotto',
    primary_name_manual: true,
    host_type: 'tv',
    active: true,
    persistent: true,
    reachable: true,
    last_time_reachable: Math.floor(Date.now() / 1000),
    vendor_name: 'Samsung Electronics',
    l2ident: { id: '12:34:56:78:9A:BC', type: 'mac_address' },
    l3connectivities: [
      {
        af: 'ipv4',
        active: true,
        reachable: true,
        last_time_reachable: 0,
        address: '192.168.1.85',
      },
    ],
  },
  {
    id: 'wifi-9a:bc:de:f0:12:34',
    primary_name: 'Echo-Dot-Cucina',
    primary_name_manual: true,
    host_type: 'smart_speaker',
    active: true,
    persistent: true,
    reachable: true,
    last_time_reachable: Math.floor(Date.now() / 1000),
    vendor_name: 'Amazon Technologies',
    l2ident: { id: '9A:BC:DE:F0:12:34', type: 'mac_address' },
    l3connectivities: [
      {
        af: 'ipv4',
        active: true,
        reachable: true,
        last_time_reachable: 0,
        address: '192.168.1.92',
      },
    ],
  },
  {
    id: 'wifi-f0:12:34:56:78:9a',
    primary_name: 'Philips-Hue-Bridge',
    primary_name_manual: true,
    host_type: 'iot',
    active: true,
    persistent: true,
    reachable: true,
    last_time_reachable: Math.floor(Date.now() / 1000),
    vendor_name: 'Signify Netherlands',
    l2ident: { id: 'F0:12:34:56:78:9A', type: 'mac_address' },
    l3connectivities: [
      {
        af: 'ipv4',
        active: true,
        reachable: true,
        last_time_reachable: 0,
        address: '192.168.1.20',
      },
    ],
  },
  {
    id: 'wifi-56:78:9a:bc:de:f0',
    primary_name: 'PlayStation 5',
    primary_name_manual: true,
    host_type: 'multimedia_device',
    active: false,
    persistent: true,
    reachable: false,
    last_time_reachable: Math.floor(Date.now() / 1000) - 3600 * 4,
    vendor_name: 'Sony Interactive Ent.',
    l2ident: { id: '56:78:9A:BC:DE:F0', type: 'mac_address' },
    l3connectivities: [
      {
        af: 'ipv4',
        active: false,
        reachable: false,
        last_time_reachable: 0,
        address: '192.168.1.110',
      },
    ],
  },
  {
    id: 'wifi-be:ef:de:ad:00:01',
    primary_name: 'Stampante-Brother',
    primary_name_manual: true,
    host_type: 'printer',
    active: true,
    persistent: true,
    reachable: true,
    last_time_reachable: Math.floor(Date.now() / 1000),
    vendor_name: 'Brother Industries',
    l2ident: { id: 'BE:EF:DE:AD:00:01', type: 'mac_address' },
    l3connectivities: [
      {
        af: 'ipv4',
        active: true,
        reachable: true,
        last_time_reachable: 0,
        address: '192.168.1.65',
      },
    ],
  },
  {
    id: 'wifi-ca:fe:00:00:00:01',
    primary_name: 'iPad-Cucina',
    primary_name_manual: true,
    host_type: 'tablet',
    active: false,
    persistent: true,
    reachable: false,
    last_time_reachable: Math.floor(Date.now() / 1000) - 3600 * 18,
    vendor_name: 'Apple, Inc.',
    l2ident: { id: 'CA:FE:00:00:00:01', type: 'mac_address' },
    l3connectivities: [],
  },
]

let mockBssList: WifiBss[] = [
  {
    id: 'F4:CA:E5:6F:AE:90',
    phy_id: 0,
    config: {
      enabled: true,
      use_default_config: false,
      ssid: 'CasaAlessandro',
      hide_ssid: false,
      encryption: 'wpa2_psk',
      key: 'PasswordSegreta2024!',
      eapol_version: 2,
    },
    status: {
      state: 'active',
      sta_count: 6,
      authorized_sta_count: 6,
      is_main_bss: true,
    },
  },
  {
    id: 'F4:CA:E5:6F:AE:91',
    phy_id: 1,
    config: {
      enabled: true,
      use_default_config: false,
      ssid: 'CasaAlessandro-5G',
      hide_ssid: false,
      encryption: 'wpa12_psk',
      key: 'PasswordSegreta2024!',
      eapol_version: 2,
    },
    status: {
      state: 'active',
      sta_count: 4,
      authorized_sta_count: 4,
      is_main_bss: false,
    },
  },
  {
    id: 'F4:CA:E5:6F:AE:92',
    phy_id: 0,
    config: {
      enabled: false,
      use_default_config: false,
      ssid: 'CasaAlessandro-Ospiti',
      hide_ssid: false,
      encryption: 'wpa2_psk',
      key: 'OspitiBenvenuti123',
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

function mockRrd(req: RrdRequest): RrdResponse {
  const totalSeconds = Math.max(60, req.date_end - req.date_start)
  const targetSamples = 200
  const step = Math.max(1, Math.floor(totalSeconds / targetSamples))
  const data: RrdSample[] = []

  for (let t = req.date_start; t <= req.date_end; t += step) {
    const hour = ((t / 3600) % 24 + 24) % 24
    const dayFactor = 0.4 + Math.max(0, Math.sin(((hour - 6) / 24) * Math.PI * 2)) * 0.9

    if (req.db === 'net') {
      data.push({
        time: t,
        rate_down: Math.round(8_000_000 * dayFactor + Math.random() * 5_000_000),
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
