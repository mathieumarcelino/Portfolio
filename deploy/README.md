# Rebuild automatique à la publication Strapi

Quand tu cliques sur **« Publier »** dans Strapi, le site est régénéré et mis en ligne automatiquement, en général en moins d'une minute.

```
Strapi (Publier / Dépublier / Supprimer)
  └─ POST http://portfolio-webhook:9000/hooks/rebuild  + en-tête X-Webhook-Secret
       └─ portfolio-webhook : attend 30 s pour regrouper les publications rapprochées
            └─ docker compose build portfolio-app && docker compose up -d portfolio-app
                 └─ si le build échoue, la version en ligne reste inchangée
```

`portfolio-webhook` n'est joignable que sur le réseau Docker interne `proxy`, partagé avec Strapi et Nginx Proxy Manager. Il n'est pas exposé sur Internet et n'a besoin d'aucune configuration dans Nginx Proxy Manager.

---

## 1. Mise en place sur le VPS

Prérequis : Docker Compose v2 (`docker compose`) et buildx, déjà installés.

```bash
cd ~/Portfolio
git pull

# Générer le secret partagé avec Strapi
openssl rand -hex 32
```

Ajouter dans `~/Portfolio/.env` :

```env
STRAPI_URL=https://cms.mathi3u.com
STRAPI_TOKEN=<token Strapi en lecture seule>
WEBHOOK_SECRET=<la valeur générée ci-dessus>
# Optionnel : délai de regroupement des publications, en secondes (30 par défaut)
# REBUILD_DEBOUNCE_SECONDS=30
```

Démarrer les deux services :

```bash
docker compose up -d --build
docker ps --filter name=portfolio-          # portfolio-app et portfolio-webhook : "Up"
docker logs portfolio-webhook               # "serving hooks on http://0.0.0.0:9000/hooks/{id}"
```

Sans `WEBHOOK_SECRET` (ou avec moins de 32 caractères), `docker compose` refuse de démarrer et indique la commande pour en générer un.

## 2. Configuration dans l'admin Strapi

**Settings → Webhooks → Create new webhook**

| Champ | Valeur |
|---|---|
| Name | `Rebuild portfolio` |
| Url | `http://portfolio-webhook:9000/hooks/rebuild` |
| Headers | clé `X-Webhook-Secret`, valeur : le `WEBHOOK_SECRET` du `.env` |
| Events | **Entry** : `Publish`, `Unpublish`, `Delete` · **Media** : `Update`, `Delete` |

Ne coche **pas** `Entry: Create` ni `Entry: Update` : ces événements partent à chaque enregistrement de brouillon et déclencheraient des rebuilds inutiles.

Enregistre, puis clique sur **Trigger** pour tester. Dans les logs :

```bash
docker logs -f portfolio-webhook
# [rebuild …] publication reçue, attente de 30s pour regrouper les suivantes
# [rebuild …] build en cours
# [rebuild …] site mis à jour en 12s
```

## 3. Utilisation au quotidien

| Besoin | Commande |
|---|---|
| Publier du contenu | Rien à faire : « Publier » dans Strapi |
| Suivre les rebuilds | `docker logs -f portfolio-webhook` |
| Forcer un rebuild du contenu | `docker exec portfolio-webhook /usr/local/bin/trigger.sh` |
| Déployer une nouvelle version du code | `git pull && docker compose up -d --build` |

Un clic sur « Publier » ne fait **pas** de `git pull` : il régénère le contenu avec le code déjà déployé. Les mises à jour de code restent un déploiement manuel et volontaire.

## 4. Dépannage

| Symptôme | Cause probable |
|---|---|
| Strapi indique un échec du webhook (403) | `X-Webhook-Secret` différent du `WEBHOOK_SECRET` du `.env` |
| Strapi n'arrive pas à joindre l'URL | `portfolio-webhook` arrêté, ou Strapi absent du réseau `proxy` |
| `ÉCHEC du build` dans les logs | Lire les lignes juste au-dessus : Strapi injoignable, token refusé (401/403), erreur de données… Le site en ligne n'a pas changé. |
| Le site ne reflète pas une modification | Contenu enregistré mais pas **publié**, ou événement non coché dans le webhook |

## 5. Sécurité

- `portfolio-webhook` monte `/var/run/docker.sock` pour lancer le build : c'est un accès équivalent à root sur l'hôte. Il n'est joignable que depuis le réseau interne, exige le secret, et n'exécute qu'une seule action (rebuild de `portfolio-app`).
- Pour changer le secret : nouvelle valeur dans `.env`, puis `docker compose up -d portfolio-webhook`, et mise à jour de l'en-tête dans Strapi.
- Le token Strapi est transmis au build comme secret BuildKit : il n'apparaît ni dans le site, ni dans l'image, ni dans son historique.
