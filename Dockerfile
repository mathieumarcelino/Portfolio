# syntax=docker/dockerfile:1
# --- Étape 1 : génération du site statique (Astro) ---
FROM node:22-alpine AS build

WORKDIR /app

# Dépendances d'abord : cette couche reste en cache tant que
# package.json et package-lock.json ne changent pas.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Variables lues par Astro au moment du build pour interroger Strapi.
# Fournies par docker-compose.yml ; ni le site généré ni l'image finale
# ne les contiennent.
ARG STRAPI_URL
ARG STRAPI_MEDIA_URL

# Le contenu vient de Strapi, pas des fichiers copiés : sans cette valeur
# changeante, BuildKit réutiliserait le résultat en cache de npm run build
# et republierait l'ancien contenu. Le rebuild automatique lui donne
# l'horodatage courant (npm ci, plus haut, reste en cache).
ARG CACHE_BUST

# Le token est un secret BuildKit : il n'existe que le temps de cette
# commande et n'apparaît ni dans l'historique ni dans le cache de l'image.
# Si Strapi est injoignable, le build échoue et l'image en service
# n'est pas remplacée.
RUN --mount=type=secret,id=strapi_token,env=STRAPI_TOKEN \
    npm run build

# --- Étape 2 : service des fichiers statiques ---
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
