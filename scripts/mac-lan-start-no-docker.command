#!/bin/zsh
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v node >/dev/null 2>&1; then
  osascript -e 'display dialog "Node.js non trovato. Installa Node (o usa Docker) e riapri questo file." buttons {"OK"} with icon caution'
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm non trovato: provo ad abilitarlo via Corepack..."
  corepack enable >/dev/null 2>&1 || true
  corepack prepare pnpm@latest --activate >/dev/null 2>&1 || true
fi

echo "Install dipendenze (può richiedere qualche minuto la prima volta)..."
pnpm install

echo ""
echo "Build + avvio server LAN..."
echo "Lascia questa finestra aperta mentre usi la dashboard dal telefono."
echo ""
pnpm lan

