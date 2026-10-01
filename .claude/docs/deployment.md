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
- `e2e/wrangler.e2e.jsonc` is the same config minus `build`, used only by `e2e/csp-headers.spec.ts` and `e2e/sidebar-category-persistence.spec.ts` (`wrangler dev -c`). `wrangler dev` otherwise runs `build.command` at startup and rebuilds `dist/` while other specs are served from it, causing transient 404s. Keep the `assets` settings in sync with `wrangler.jsonc`.

## Deploy flow (GitHub Actions)

Deploys are done by the `deploy` job in `.github/workflows/ci.yml`, not by Cloudflare Workers Builds (Git integration must be disconnected in the Cloudflare dashboard, otherwise it deploys without waiting for CI).

- Pushing `develop` runs no CI and no deploy.
- `main` is branch-protected (applies to admins too): direct pushes are rejected, and changes reach `main` only through a pull request from `develop` whose `check` job (`.github/workflows/pr.yml`: lint, type check, unit tests, build; no E2E) has passed. Force pushes and branch deletion are disabled.
- Only the "Create a merge commit" merge method is enabled (squash and rebase are disabled), so `develop` stays an ancestor of `main` and can be re-synced with `git merge --ff-only main`. "Automatically delete head branches" must stay off, or `develop` would be deleted on merge.
- Merging the PR pushes to `main`: `test` and `e2e` run in `ci.yml`, and only if both pass does `deploy` run `wrangler deploy`.
- Required GitHub repository secrets: `CLOUDFLARE_API_TOKEN` (Workers edit permission) and `CLOUDFLARE_ACCOUNT_ID`.

## Local check commands

```
pnpm build     # generate the static build in dist/
pnpm preview   # preview the build locally
```

## Unsupported / known issues

- No known issues at present.
