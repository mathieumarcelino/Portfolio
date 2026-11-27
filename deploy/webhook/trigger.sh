#!/bin/sh
# Exécuté par webhook pour chaque requête authentifiée. Il répond tout de
# suite : il marque un rebuild comme demandé et confie le travail à
# rebuild.sh en arrière-plan.
set -eu

STATE_DIR="${STATE_DIR:-/run/rebuild}"
mkdir -p "$STATE_DIR"
touch "$STATE_DIR/pending"

nohup /usr/local/bin/rebuild.sh >/dev/null 2>&1 &
