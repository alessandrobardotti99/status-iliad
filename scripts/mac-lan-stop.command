#!/bin/zsh
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v docker >/dev/null 2>&1; then
  osascript -e 'display dialog "Docker non trovato." buttons {"OK"} with icon caution'
  exit 1
fi

echo "Stop Iliad Network Monitor..."
docker compose down

echo ""
echo "Fatto."
read "?Premi INVIO per chiudere..."

