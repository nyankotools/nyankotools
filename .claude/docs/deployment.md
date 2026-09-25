# Design doc: Deployment

## Deploy target

Cloudflare Workers (static asset serving). `wrangler.jsonc` is configured as follows.

```jsonc
{
  "name": "nyankotools",
  "build": {
    "command": "pnpm build",
  },
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page",
  },
}
```

- `build.command` runs `pnpm build` automatically at deploy time to produce `dist/`.
- There is no server-side Worker code (`assets` only), consistent with the static output setup that needs no SSR adapter.
- `not_found_handling: "404-page"` makes `src/pages/404.astro` serve 404s.

## Deploy flow (GitHub Actions)

Deploys are done by the `deploy` job in `.github/workflows/ci.yml`, not by Cloudflare Workers Builds (Git integration must be disconnected in the Cloudflare dashboard, otherwise it deploys without waiting for CI).

- Pushing `develop` runs no CI and no deploy.
- Merge `develop` into `main` locally and push `main`: `test` and `e2e` run, and only if both pass does `deploy` run `wrangler deploy`.
- Required GitHub repository secrets: `CLOUDFLARE_API_TOKEN` (Workers edit permission) and `CLOUDFLARE_ACCOUNT_ID`.

## Local check commands

```
pnpm build     # generate the static build in dist/
pnpm preview   # preview the build locally
```

## Unsupported / known issues

- No known issues at present.
