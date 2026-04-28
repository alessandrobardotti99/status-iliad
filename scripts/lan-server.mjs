import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST_DIR = path.resolve(__dirname, '../dist')

const PORT = Number.parseInt(process.env.PORT ?? '8080', 10)
const API_TARGET = process.env.ILIADBOX_URL || 'http://myiliadbox.iliad.it'

const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.ico', 'image/x-icon'],
  ['.webmanifest', 'application/manifest+json'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
])

function setSecurityHeaders(res) {
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()',
  )
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
}

function stripHopByHop(headers) {
  const hopByHop = new Set([
    'connection',
    'keep-alive',
    'proxy-authenticate',
    'proxy-authorization',
    'te',
    'trailer',
    'transfer-encoding',
    'upgrade',
    'host',
  ])
  const out = {}
  for (const [key, value] of Object.entries(headers)) {
    if (!key) continue
    if (hopByHop.has(key.toLowerCase())) continue
    out[key] = value
  }
  return out
}

async function proxyToIliadbox(req, res) {
  const incomingUrl = new URL(req.url, 'http://localhost')
  const targetUrl = new URL(incomingUrl.pathname + incomingUrl.search, API_TARGET)

  const body =
    req.method === 'GET' || req.method === 'HEAD'
      ? undefined
      : await new Promise((resolve, reject) => {
          const chunks = []
          req.on('data', (c) => chunks.push(c))
          req.on('end', () => resolve(Buffer.concat(chunks)))
          req.on('error', reject)
        })

  const headers = stripHopByHop(req.headers)
  // Keep the upstream Host aligned (some gateways care).
  headers.Host = targetUrl.host

  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers,
    body,
    // avoid keeping long-lived connections in this tiny server
    redirect: 'manual',
  })

  res.statusCode = upstream.status
  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      // ignore cookies: auth is handled by our app token/session header
      return
    }
    res.setHeader(key, value)
  })
  setSecurityHeaders(res)

  const arrayBuffer = await upstream.arrayBuffer()
  res.end(Buffer.from(arrayBuffer))
}

async function serveFile(res, filePath) {
  const ext = path.extname(filePath)
  res.setHeader('Content-Type', mimeTypes.get(ext) || 'application/octet-stream')

  if (filePath.includes(`${path.sep}assets${path.sep}`)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
  } else if (filePath.endsWith(`${path.sep}sw.js`) || filePath.endsWith(`${path.sep}registerSW.js`)) {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
  }

  setSecurityHeaders(res)
  createReadStream(filePath).pipe(res)
}

async function tryServeStatic(req, res) {
  const url = new URL(req.url, 'http://localhost')
  const pathname = decodeURIComponent(url.pathname)

  // Disallow path traversal
  const safePath = path
    .normalize(pathname)
    .replace(/^(\.\.[/\\])+/, '')
    .replace(/^[\\/]+/, '')

  let filePath = path.join(DIST_DIR, safePath)
  try {
    const s = await stat(filePath)
    if (s.isDirectory()) {
      filePath = path.join(filePath, 'index.html')
    }
    await serveFile(res, filePath)
    return true
  } catch {
    return false
  }
}

async function serveSpaFallback(res) {
  const indexPath = path.join(DIST_DIR, 'index.html')
  const html = await readFile(indexPath, 'utf8')
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  setSecurityHeaders(res)
  res.end(html)
}

const server = http.createServer(async (req, res) => {
  try {
    if (!req.url) {
      res.statusCode = 400
      res.end('Bad Request')
      return
    }

    if (req.url.startsWith('/api/')) {
      await proxyToIliadbox(req, res)
      return
    }

    const served = await tryServeStatic(req, res)
    if (served) return

    await serveSpaFallback(res)
  } catch (err) {
    res.statusCode = 502
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end(`Proxy/server error: ${err instanceof Error ? err.message : String(err)}`)
  }
})

server.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`LAN server ready on http://0.0.0.0:${PORT}`)
  // eslint-disable-next-line no-console
  console.log(`Proxy /api/* -> ${API_TARGET}`)
})

