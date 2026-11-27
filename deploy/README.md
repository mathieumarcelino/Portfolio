# Rebuild automatique à la publication Strapi

Quand tu cliques sur **« Publier »** dans Strapi, le site est régénéré et mis en ligne automatiquement, en général en moins d'une minute.

```
Strapi (Publier / Dépublier / Supprimer)
  └─ POST https://mathi3u.com/hooks/rebuild  + en-tête X-Webhook-Secret
       └─ Nginx Proxy Manager ─► portfolio-webhook:9000 (réseau Docker « proxy »)
            └─ attend 30 s pour regrouper les publications rapprochées
                 └─ docker compose build portfolio-app && docker compose up -d portfolio-app
                      └─ si le build échoue, la version en ligne reste inchangée
```

**Pourquoi une URL publique ?** En production, Strapi refuse d'enregistrer un webhook dont l'adresse se résout en IP privée (protection contre les requêtes vers le réseau interne, sans option pour la désactiver). L'URL interne `http://portfolio-webhook:9000` est donc refusée : on passe par Nginx Proxy Manager. Le conteneur ne publie toujours aucun port sur l'hôte. Seul NPM le joint, et chaque requête doit porter le secret.

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

## 2. Exposer le récepteur via Nginx Proxy Manager

**Proxy Hosts → `mathi3u.com` → Edit → Custom Locations → Add location**

| Champ | Valeur |
|---|---|
| Define location | `/hooks/` |
| Scheme | `http` |
| Forward Hostname / IP | `portfolio-webhook` |
| Forward Port | `9000` |

Enregistre, puis vérifie depuis n'importe où (sans secret, la requête doit être refusée) :

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://mathi3u.com/hooks/rebuild   # 403
```

## 3. Configuration dans l'admin Strapi

**Settings → Webhooks → Create new webhook**

| Champ | Valeur |
|---|---|
| Name | `Rebuild portfolio` |
| Url | `https://mathi3u.com/hooks/rebuild` |
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

## 4. Utilisation au quotidien

| Besoin | Commande |
|---|---|
| Publier du contenu | Rien à faire : « Publier » dans Strapi |
| Suivre les rebuilds | `docker logs -f portfolio-webhook` |
| Forcer un rebuild du contenu | `docker exec portfolio-webhook /usr/local/bin/trigger.sh` |
| Déployer une nouvelle version du code | `git pull && docker compose up -d --build` |

Un clic sur « Publier » ne fait **pas** de `git pull` : il régénère le contenu avec le code déjà déployé. Les mises à jour de code restent un déploiement manuel et volontaire.

## 5. Dépannage

| Symptôme | Cause probable |
|---|---|
| Strapi indique un échec du webhook (403) | `X-Webhook-Secret` différent du `WEBHOOK_SECRET` du `.env` |
| Strapi n'arrive pas à joindre l'URL (502/504) | `portfolio-webhook` arrêté, ou custom location `/hooks/` absente dans NPM |
| « Url is not supported because it isn't reachable over the public internet » | URL interne saisie : utiliser `https://mathi3u.com/hooks/rebuild` |
| `ÉCHEC du build` dans les logs | Lire les lignes juste au-dessus : Strapi injoignable, token refusé (401/403), erreur de données… Le site en ligne n'a pas changé. |
| Le site ne reflète pas une modification | Contenu enregistré mais pas **publié**, ou événement non coché dans le webhook |

## 6. Sécurité

- L'URL est publique : toute la protection repose sur le secret (64 caractères hexadécimaux, transmis en HTTPS). Sans lui, la réponse est 403 et rien n'est déclenché. Si le secret a pu être vu (capture d'écran, partage…), régénère-le.
- `portfolio-webhook` monte `/var/run/docker.sock` pour lancer le build : c'est un accès équivalent à root sur l'hôte. Il ne publie aucun port, n'est joint que par NPM, exige le secret, et n'exécute qu'une seule action (rebuild de `portfolio-app`), sans aucun paramètre venant de la requête.
- Pour changer le secret : nouvelle valeur dans `.env`, puis `docker compose up -d portfolio-webhook`, et mise à jour de l'en-tête dans Strapi.
- Le token Strapi est transmis au build comme secret BuildKit : il n'apparaît ni dans le site, ni dans l'image, ni dans son historique.
