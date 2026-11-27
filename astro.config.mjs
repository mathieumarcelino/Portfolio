// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import { loadEnv } from 'vite';

// Domaine des médias Strapi : seules les images de ce domaine sont
// téléchargées et optimisées au build (.env en local, args Docker en prod).
const env = { ...loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), ''), ...process.env };
const mediaUrl = new URL(env.STRAPI_MEDIA_URL || env.STRAPI_URL || 'http://localhost:1337');

export default defineConfig({
  site: 'https://mathi3u.com',
  output: 'static',

  image: {
    remotePatterns: [
      {
        protocol: mediaUrl.protocol.replace(':', ''),
        hostname: mediaUrl.hostname,
        ...(mediaUrl.port && { port: mediaUrl.port }),
      },
    ],
  },

  // Police auto-hébergée depuis le paquet npm (aucun appel réseau, ni au build
  // ni chez le visiteur). Astro génère aussi une police de secours aux
  // métriques ajustées pour limiter le décalage au chargement (CLS).
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Parkinsans',
      cssVariable: '--font-parkinsans',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['./node_modules/@fontsource-variable/parkinsans/files/parkinsans-latin-wght-normal.woff2'],
            weight: '300 800',
            style: 'normal',
          },
        ],
      },
    },
  ],

  // Nom lisible pour la feuille de style générée : sans cela, elle hérite du
  // nom de la route [...lang] et devient « _..<hash>.css ».
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: (asset) =>
            (asset.names?.[0] ?? '').endsWith('.css') ? '_astro/styles.[hash][extname]' : '_astro/[name].[hash][extname]',
        },
      },
    },
  },

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
