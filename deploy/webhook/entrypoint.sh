#!/bin/sh
set -eu

# Sans secret (ou avec un secret trop court), le récepteur refuse de démarrer :
# il ne doit jamais accepter de requêtes non authentifiées.
secret="${WEBHOOK_SECRET:-}"
if [ "${#secret}" -lt 32 ]; then
  echo "WEBHOOK_SECRET manquant ou trop court (32 caractères minimum)." >&2
  echo "Générer une valeur avec : openssl rand -hex 32" >&2
  exit 1
fi

mkdir -p "${STATE_DIR:-/run/rebuild}"

exec webhook -hooks /etc/webhook/hooks.yaml -template -port 9000 -verbose
