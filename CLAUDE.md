# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio (deployed at https://mathi3u.com), built with **Astro** as a fully static site. All content (profile, links, experiences, educations, projects, UI translations, locales) comes from a separate **Strapi 5 CMS** that lives outside this repo, in `/home/mmarcelino/PortfolioCMS` (run it with `npx strapi start` there, port 1337).

Strapi is queried **only at build time**. Visitors receive plain HTML: no API calls, and no token in the browser.

## Commands

Node ≥ 22.23.4 is required by Astro 7 (`.nvmrc`; run `nvm use` first, the machine default is Node 20).

```bash
npm run dev       # dev server on http://localhost:4321 (Strapi must be running)
npm run build     # generate the static site into dist/ (fails if Strapi is unreachable)
npm run preview   # serve dist/
npm run check     # type-check (astro check)
npm run lint      # ESLint (typescript-eslint + eslint-plugin-astro)
```

There is no test suite yet.

## Environment

`.env` (gitignored, template in `.env.exemple`), validated by the `astro:env` schema in `astro.config.mjs`, server context only:
- `STRAPI_URL`: Strapi base URL used by the build
- `STRAPI_TOKEN`: optional read-only API token
- `STRAPI_MEDIA_URL`: optional public base URL for `/uploads/...` media, when it differs from `STRAPI_URL` (e.g. build through an internal Docker network)

**CORS** only matters for the Strapi admin now. Strapi's allowlist is built from `PUBLIC_URL` and `PUBLIC_FRONTEND_URL` in the CMS `.env` (`PortfolioCMS/config/middlewares.ts`).

## Architecture

**Strapi REST → `src/lib/` (build time) → `src/pages/[...lang].astro` → components.**

- `src/lib/strapi.ts`: `fetchStrapi<T>(path, params)` builds `/api/<path>` URLs, serializes array params as `key[0]=…` (Strapi `sort`), adds the token, unwraps `json.data`, and **throws on any error** so a broken CMS fails the build instead of shipping an empty site. `resolveMediaUrl` turns relative media paths into absolute public URLs.
- `src/lib/content.ts`: `getLocales()` and `getPageData(locale)` fetch everything for one language in parallel and map raw `Strapi*` types to the view types in `src/lib/types.ts`. Profile Markdown is rendered to HTML here with `marked`.
- `src/lib/i18n.ts`: locale list (the Strapi locale with `isDefault` is served at `/`, the others at `/<code>/`), the `t(key)` translator (Strapi `translations` collection, falls back to the key), and date formatting with `Intl.DateTimeFormat`.
- `src/lib/icons.ts`: Font Awesome icons rendered to inline SVG at build time.
- `src/pages/[...lang].astro`: `getStaticPaths()` emits one page per Strapi locale.
- `src/components/<Name>/<Name>.astro` with a sibling `.css` file. The class names and CSS come unchanged from the former React app; global styles are in `src/styles/`.

The only client-side JS is two small inline scripts: closing the language `<details>` menu, and the click handler on project cards.

## Deployment

`Dockerfile` (multi-stage): `npm ci && npm run build` with `STRAPI_URL` as a build arg and `STRAPI_TOKEN` as a **BuildKit secret** (from the `.env` next to `docker-compose.yml`), then `dist/` served by `nginx.conf`. A `CACHE_BUST` build arg sits right before `npm run build`: content comes from Strapi, not from the repo, so without a changing value BuildKit would reuse the cached build and republish stale content. nginx serves `/_astro/` (hashed) as immutable, and all HTML as `no-cache`.

`docker-compose.yml` (project name pinned to `portfolio`, external `proxy` network shared with Nginx Proxy Manager and the Strapi container) has two services:
- `portfolio-app`: the nginx site.
- `portfolio-webhook` (`deploy/webhook/`): receives the Strapi publish webhook (`X-Webhook-Secret` header). It publishes no host port: Nginx Proxy Manager exposes it at `https://mathi3u.com/hooks/rebuild`, because Strapi refuses webhook URLs that resolve to private IPs in production. Through the mounted Docker socket it runs `docker compose build portfolio-app && up -d`, debouncing bursts with a lock. It never runs `git pull`: code deploys stay manual.

Setup and operations: `deploy/README.md`.
