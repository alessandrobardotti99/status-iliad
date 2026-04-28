const STORAGE_KEY = 'iliadbox.device_aliases'

type AliasMap = Record<string, string>

function readAll(): AliasMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed as AliasMap
  } catch {
    return {}
  }
}

function writeAll(map: AliasMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // ignore: storage disabled/quota
  }
}

export function getDeviceAlias(mac: string): string | null {
  const aliases = readAll()
  const v = aliases[mac]
  return typeof v === 'string' && v.trim() ? v.trim() : null
}

export function setDeviceAlias(mac: string, alias: string) {
  const nextAlias = alias.trim()
  const aliases = readAll()
  if (!nextAlias) {
    delete aliases[mac]
  } else {
    aliases[mac] = nextAlias
  }
  writeAll(aliases)
}

