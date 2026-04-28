export function formatBitRate(bytesPerSec: number): string {
  const bits = bytesPerSec * 8
  if (bits >= 1_000_000_000) return `${(bits / 1_000_000_000).toFixed(2)} Gbps`
  if (bits >= 1_000_000) return `${(bits / 1_000_000).toFixed(2)} Mbps`
  if (bits >= 1_000) return `${(bits / 1_000).toFixed(2)} kbps`
  return `${bits.toFixed(0)} bps`
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1_099_511_627_776) return `${(bytes / 1_099_511_627_776).toFixed(2)} TiB`
  if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(2)} GiB`
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(2)} MiB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KiB`
  return `${bytes} B`
}

export function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d}g ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function formatRelativeTime(epochSeconds: number): string {
  if (!epochSeconds) return 'mai'
  const diff = Math.max(0, Math.floor(Date.now() / 1000) - epochSeconds)
  if (diff < 60) return `${diff}s fa`
  if (diff < 3600) return `${Math.floor(diff / 60)}m fa`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h fa`
  return `${Math.floor(diff / 86400)}g fa`
}
