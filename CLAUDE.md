# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio (deployed at https://mathi3u.com), a Create React App + TypeScript single page. All content (profile, links, experiences, educations, projects, UI translations, available locales) comes from a separate **Strapi 5 CMS** that lives outside this repo, in `/home/mmarcelino/PortfolioCMS` (run it with `npx strapi start` there, port 1337).

## Commands

```bash
npm start                         # dev server on http://localhost:3000
npm run build                     # production build into /build
npm test                          # Jest in watch mode (react-scripts)
npm test -- --watchAll=false src/App.test.tsx   # run one test file once
npm test -- -t "name of test"     # run tests matching a name
```

There is no separate lint script: ESLint (`react-app` config) runs inside `npm start` / `npm run build`. Type-checking also happens there (`npx tsc --noEmit` for a standalone check).

`src/App.test.tsx` is the untouched CRA boilerplate ("learn react") and fails against the current app.

## Environment

`.env` (gitignored, template in `.env.exemple`):
- `REACT_APP_STRAPI_URL`: Strapi base URL (default `http://localhost:1337`)
- `REACT_APP_STRAPI_TOKEN`: Strapi API token, sent as `Bearer`

CRA inlines `REACT_APP_*` values into the JS bundle at build time, so anything put there is readable by visitors: never use a token with write permissions. Changing `.env` requires restarting `npm start` or rebuilding.

**CORS:** if the front gets no data while the API answers fine with curl, check the CMS `.env`. Strapi's CORS allowlist is built from `PUBLIC_URL` and `PUBLIC_FRONTEND_URL` (see `PortfolioCMS/config/middlewares.ts`), and the scheme must match exactly (`http://localhost:3000` locally, not `https`).

## Architecture

Data flows in one direction: **Strapi REST → `src/services/strapi.ts` → one hook per content type in `src/hooks/` → `App.tsx` → presentational components.**

- `services/strapi.ts`: a single `fetchStrapi<T>(path, params)` helper builds `/api/<path>` URLs, serializes array params as `key[0]=…` (used for Strapi `sort`), attaches the token and unwraps `json.data`. Each content type has a `getX(locale)` function here.
- `types/*.ts`: each file defines two shapes, `StrapiX` (raw API response) and `XData` (what components consume). Hooks own the mapping from one to the other, including turning relative Strapi media URLs (`/uploads/...`) into absolute ones via a local `resolveUrl` helper (duplicated in each hook that handles images).
- `hooks/useX(language)`: returns `null` while loading, then the mapped data. They refetch when `language` changes. `App.tsx` shows a spinner until profile, experiences, educations and projects are all non-null.
- `contexts/LanguageContext.tsx`: provides `language`, `setLanguage`, the locale list from Strapi `i18n/locales`, and `t(key)`. `t` is a lookup in the Strapi `translations` collection (key/value pairs per locale) that falls back to the key itself. Experience/education hooks consume `t` through `useLanguage()` for period formatting (`utils/formatDate.ts`), so they must stay inside `LanguageProvider`.
- Components live in `src/components/<Name>/<Name>.tsx` with a sibling `.css` file; sub-pieces go in a `layers/` subfolder.

`tsconfig.json` sets `baseUrl: "src"`, so both relative imports and bare imports like `'hooks/useLink'` or `'types/i18n'` work. The codebase mixes both.

Legacy, unused: `src/Data/` (static JSON from before the Strapi migration) and the empty `server/` folder.

## Branches & deployment

- `main`: the app.
- `dockerize`: adds `Dockerfile` (multi-stage: node build → nginx), `nginx.conf` and `docker-compose.yml` (attaches to an external `proxy` network for Nginx Proxy Manager). Since the build runs inside Docker, the `REACT_APP_*` values must be available at image build time.
