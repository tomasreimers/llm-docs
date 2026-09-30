# AGENTS.md

## Cursor Cloud specific instructions

This is a **static documentation site** (Frontend Docs) built with Next.js 14 + Nextra + MDX. No backend, no database, no Docker.

### Key commands

| Task | Command |
|------|---------|
| Install deps | `yarn install` |
| Dev server | `yarn dev` (serves on `http://localhost:3000`) |
| Lint | `yarn lint` (ESLint for `.ts`, `.tsx`, `.mdx`) |
| Build | `yarn build` (static export to `dist/`, runs pagefind postbuild) |

### Notes

- Uses Yarn 1.x (classic). The lockfile is `yarn.lock`.
- The build uses `output: "export"` (fully static). The dev server (`yarn dev`) is the only service needed for development.
- Lint has 3 pre-existing `@typescript-eslint/no-explicit-any` warnings — these are expected and not errors.
- Search (Pagefind) indexing only runs as a postbuild step after `yarn build`. It is not needed during dev.
- The first page load on the dev server can take ~30s to compile; subsequent pages are faster due to caching.
