#!/bin/sh
# Reconstruit le site après une publication Strapi.
#
# - Regroupe les publications rapprochées : on attend DEBOUNCE_SECONDS après
#   la première demande, toutes celles reçues entre-temps donnent un seul build.
# - Un seul build à la fois (verrou) ; une demande reçue pendant un build en
#   déclenche un nouveau à la fin, pour publier le contenu le plus récent.
# - Si le build échoue (Strapi injoignable, erreur de données…), le conteneur
#   en service n'est pas remplacé.
set -u

STATE_DIR="${STATE_DIR:-/run/rebuild}"
DEBOUNCE_SECONDS="${DEBOUNCE_SECONDS:-30}"
COMPOSE_FILE="${COMPOSE_FILE:-/srv/portfolio/docker-compose.yml}"
SERVICE="${SERVICE:-portfolio-app}"

# Les logs vont dans la sortie du conteneur (docker logs portfolio-webhook).
exec >>/proc/1/fd/1 2>&1

log() {
  echo "[rebuild $(date '+%Y-%m-%d %H:%M:%S')] $*"
}

# Un autre rebuild.sh tient le verrou : il traitera la demande en attente.
exec 9>"$STATE_DIR/lock"
flock -n 9 || exit 0

while [ -e "$STATE_DIR/pending" ]; do
  log "publication reçue, attente de ${DEBOUNCE_SECONDS}s pour regrouper les suivantes"
  sleep "$DEBOUNCE_SECONDS"
  rm -f "$STATE_DIR/pending"

  log "build en cours"
  start=$(date +%s)
  # CACHE_BUST change à chaque build : force la relecture de Strapi.
  export CACHE_BUST="$start"
  if docker compose -f "$COMPOSE_FILE" build "$SERVICE" &&
     docker compose -f "$COMPOSE_FILE" up -d --no-deps "$SERVICE"; then
    log "site mis à jour en $(( $(date +%s) - start ))s"
  else
    log "ÉCHEC du build : la version en ligne reste inchangée"
  fi
done

# Libère le verrou, puis vérifie une dernière fois : une demande arrivée
# juste avant la libération ne doit pas être perdue.
exec 9>&-
if [ -e "$STATE_DIR/pending" ]; then
  exec "$0"
fi
