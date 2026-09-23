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

## Local check commands

```
pnpm build     # generate the static build in dist/
pnpm preview   # preview the build locally
```

## Unsupported / known issues

- No known issues at present.
