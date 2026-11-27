# --- Étape 1 : build de l'application React ---
FROM node:22-alpine AS build

WORKDIR /app

# Dépendances d'abord : cette couche reste en cache tant que
# package.json et package-lock.json ne changent pas.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Variables lues par Create React App au moment du build et incluses dans
# le bundle (donc visibles par les visiteurs : jamais de secret en écriture).
# Fournies par docker-compose.yml (args) ou via --build-arg.
ARG REACT_APP_STRAPI_URL
ARG REACT_APP_STRAPI_TOKEN

RUN npm run build

# --- Étape 2 : service des fichiers statiques ---
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
