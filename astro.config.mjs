// @ts-check
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  site: 'https://mathi3u.com',
  output: 'static',

  // Variables lues uniquement au build (context: 'server') : elles ne sont
  // jamais incluses dans les fichiers servis aux visiteurs.
  env: {
    schema: {
      // URL utilisée par le build pour interroger l'API Strapi
      STRAPI_URL: envField.string({ context: 'server', access: 'secret', url: true }),
      // Token API en lecture seule (optionnel si le rôle Public a les droits)
      STRAPI_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      // URL publique des médias (/uploads/…), si elle diffère de STRAPI_URL
      // (ex. build via le réseau Docker interne, médias servis en https)
      STRAPI_MEDIA_URL: envField.string({ context: 'server', access: 'secret', url: true, optional: true }),
    },
  },
});
