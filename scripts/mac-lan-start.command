#!/bin/zsh
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v docker >/dev/null 2>&1; then
  osascript -e 'display dialog "Docker non trovato. Installa Docker Desktop e riapri questo file." buttons {"OK"} with icon caution'
  exit 1
fi

# Ensure Docker Desktop is running (best-effort)
open -g -a "Docker" >/dev/null 2>&1 || true

echo "Avvio Iliad Network Monitor in LAN..."
docker compose up -d

echo ""
echo "Fatto."
echo "Apri dal telefono (stessa Wi-Fi): http://<nome-mac>.local:8080"
echo "Suggerimento: macOS → Generali → Condivisione → Nome computer"
echo ""
read "?Premi INVIO per chiudere..."

