# Portfolio Rebuild — Spec for OpenCode

Owner: Jack Horton (github: cloudboy-jh)
Repo: https://github.com/cloudboy-jh/portfolio (branch: main)
Goal: Migrate the single static `index.html` to a **Vue 3 app** served by a **Hono worker on Cloudflare**, backed by a **GitHub-driven API** so the project list updates fluidly instead of being hand-edited.

---

## 1. Architecture

```
GitHub REST API (live facts: stars, language, pushedAt, description, homepage)
        │
        ▼
curation.json (editorial: which repos, group, status, display order, overrides)
        │
    [ merge in worker ]
        │
        ▼
   Cloudflare KV cache  ◀── stale-while-revalidate on read (background refresh)
        │
        ▼
   Hono worker  ──►  GET /api/projects   (served JSON)
        │
        ▼
   Vue 3 SPA (dark, minimal aesthetic, renders grouped cards)
```

**Decision rationale (do not "simplify" away):**
- GitHub is the source of *facts* (stars, language, last push, description, live URL). Never hardcode these.
- `curation.json` is the source of *editorial* (grouping, status, order, featured, description overrides for repos with empty GitHub descriptions). GitHub has no concept of "Flagship" or "Paused" — that lives here.
- KV + stale-while-revalidate = fast page loads + fresh data without redeploying. Refresh is triggered by real traffic (first visitor after staleness), not a scheduler. Do NOT do a live GitHub proxy on every request (rate limits, latency). Do NOT use a cron trigger — it burns invocations against a low-traffic personal site.

**Stack (already installed on this machine):** Bun 1.3.10, wrangler 4.78.0, Node 20+. Use Bun as package manager/runtime for tooling.

---

## 2. Repo layout (target)

```
portfolio/
├── src/                      # Vue 3 app (Vite)
│   ├── main.ts
│   ├── App.vue
│   ├── components/
│   │   ├── Header.vue
│   │   ├── ProjectGroup.vue
│   │   ├── ProjectCard.vue
│   │   └── LinksSection.vue
│   ├── composables/
│   │   └── useProjects.ts    # fetch /api/projects
│   └── styles/
│       └── tokens.css        # port the CSS variables from current index.html
├── worker/
│   ├── index.ts              # Hono app: GET /api/projects, serves static assets
│   ├── github.ts             # fetch + normalize GitHub repos
│   ├── merge.ts              # merge github data + curation.json
│   └── curation.json         # editorial config (SEE SECTION 4)
├── wrangler.toml             # add KV binding, assets
├── vite.config.ts
├── package.json
└── tsconfig.json
```

Keep the Cloudflare deploy (repo already has wrangler.toml + Pages). Move from Pages static to a **Worker with static assets** (`assets` directive in wrangler.toml) so the same worker serves the Vue build AND `/api/*`.

---

## 3. Design system — PRESERVE the current aesthetic

Port these exact tokens from the existing `index.html` `:root` into `src/styles/tokens.css`:

```
--bg-primary:#0c0c0c; --bg-surface:#111; --bg-elevated:#161616;
--border:#222; --border-subtle:#1a1a1a;
--text-primary:#e0e0e0; --text-secondary:#888; --text-tertiary:#555; --text-ghost:#333;
--color-success:#34d399; --color-warning:#fbbf24; --color-error:#f87171; --color-info:#60a5fa;
--font-display:"Familjen Grotesk"; --font-heading:"Manrope"; --font-body:"DM Sans"; --font-mono:"IBM Plex Mono";
```
- 640px max-width column, 64px top padding, sharp corners, no gradients.
- Keep header: name "Jack Horton", role "Product Engineer · Developer Tools", the bio, "Santa Monica, CA".
- Keep footer: "© 2026 Jack Horton · Built with sharp corners and no gradients".
- Status dots: active=success(green), building=warning(amber), shipped=tertiary(grey), paused=tertiary/error.
- Reuse `.project`, `.project-mark`, `.project-tag`, `.project-tech`, `.link-row` styles — just componentize them.

**New:** each ProjectCard gets TWO links — a primary live-site link (arrow →) when `homepage` exists, and a GitHub source link (mono, e.g. `↗ src`). Show a subtle star badge (mono) when stars > 0.

---

## 4. curation.json — the editorial config

This is the file Jack edits to reorganize the portfolio. Groups render top-to-bottom in this order; projects render in array order within a group. `descOverride` is used only when the GitHub description is empty. `mark` is the single-letter tile.

```json
{
  "groups": [
    {
      "id": "flagship",
      "label": "Flagship",
      "projects": [
        { "repo": "glib-code", "mark": "G", "status": "active",
          "descOverride": "A workspace where agents code in a sandbox. Your real code stays untouched until you approve.",
          "tech": "TypeScript · Agent sandbox · Cloudflare" },
        { "repo": "gittrix", "mark": "G", "status": "active",
          "tech": "TypeScript · Session orchestration · npm" },
        { "repo": "mimir", "mark": "M", "status": "active",
          "descOverride": "Headless codebase context and session memory plane utilizing git + Markdown.",
          "tech": "TypeScript · AST · Context layer" }
      ]
    },
    {
      "id": "tools",
      "label": "Developer Tools",
      "projects": [
        { "repo": "suitener", "mark": "S", "status": "active",
          "tech": "TypeScript · Bun · CLI" },
        { "repo": "shipwrkrs", "mark": "S", "status": "shipped",
          "descOverride": "Describe a Cloudflare Worker in plain English, generate code, review, and deploy from one app.",
          "tech": "Vue · Cloudflare Workers · LLM" },
        { "repo": "annotr", "mark": "A", "status": "shipped",
          "descOverride": "Fast local code-commenting CLI. AI comments in ~1-2s, local or API models, tree-sitter context.",
          "tech": "Go · Charm · tree-sitter" },
        { "repo": "pact", "mark": "P", "status": "shipped",
          "descOverride": "Cross-platform development environment manager. Configure once, run anywhere.",
          "tech": "Go · Cross-platform · CLI" }
      ]
    },
    {
      "id": "tui",
      "label": "TUI & Frameworks",
      "projects": [
        { "repo": "bentotui", "mark": "B", "status": "building",
          "descOverride": "The app framework for Bubble Tea. Fills the gap between Charm primitives and shipped apps.",
          "tech": "Go · Bubble Tea · Framework" },
        { "repo": "glib", "mark": "G", "status": "shipped",
          "descOverride": "Terminal workspace app on BentoTUI. Auth, pick repo, stage, review diffs, hand off to an agent in one shell.",
          "tech": "Go · BentoTUI" }
      ]
    },
    {
      "id": "apps",
      "label": "macOS & Small Apps",
      "projects": [
        { "repo": "resource-view-macOS", "mark": "L", "status": "shipped",
          "descOverride": "LocalPulse — tiny macOS menu-bar monitor for CPU, GPU, RAM, and uptime.",
          "tech": "Swift · SwiftUI · macOS" },
        { "repo": "open-notify", "mark": "O", "status": "shipped",
          "descOverride": "macOS SwiftUI app to edit OpenCode desktop notification text and sounds.",
          "tech": "Swift · SwiftUI · macOS" },
        { "repo": "letitrip", "mark": "L", "status": "shipped",
          "descOverride": "Let it rip — turn your CDs into a personal Spotify powered by a Raspberry Pi.",
          "tech": "Go · Raspberry Pi" }
      ]
    }
  ],
  "links": {
    "github": { "label": "GitHub", "value": "cloudboy-jh", "href": "https://github.com/cloudboy-jh" },
    "x":      { "label": "X / Twitter", "value": "@jackhortonlol", "href": "https://x.com/jackhortonlol" },
    "linkedin": { "label": "LinkedIn", "value": "Jack Horton", "href": "https://www.linkedin.com/in/jack-s-horton/" },
    "email":  { "label": "Email", "value": "jackhortonpersonalbusiness@gmail.com", "href": "mailto:jackhortonpersonalbusiness@gmail.com" }
  }
}
```

> NOTE for Jack to verify before ship: `porter`/`veil` intentionally dropped (stale). Re-add to curation if wanted. `mimir`/`pact`/`bentotui` marked as their real state — adjust status strings freely.

---

## 5. Worker API contract

`GET /api/projects` returns:
```json
{
  "updatedAt": "2026-07-06T...Z",
  "groups": [
    { "id": "flagship", "label": "Flagship", "projects": [
      { "name": "glib-code", "description": "...", "url": "https://github.com/cloudboy-jh/glib-code",
        "homepage": "https://glibcode.com", "language": "TypeScript", "stars": 1,
        "pushedAt": "...", "mark": "G", "status": "active", "tech": "TypeScript · Agent sandbox · Cloudflare" }
    ]}
  ]
}
```

Worker logic (`worker/index.ts` + helpers) — **stale-while-revalidate**:
1. On `GET /api/projects`: read from KV key `projects:v1`.
2. If present and fresh (`updatedAt` within `MAX_AGE`, e.g. 1h) → return it immediately.
3. If present but stale → return the stale payload immediately AND kick off a background refresh with `ctx.waitUntil(rebuild())`. Client never blocks on GitHub.
4. If missing (cold KV) → build synchronously via `rebuild()`, or return `src/fallback.json` if GitHub is unreachable, then persist whatever succeeds.
5. `rebuild()`: call `github.ts` → fetch each repo in curation via `GET /repos/cloudboy-jh/{repo}` (use an optional `GITHUB_TOKEN` secret to avoid the 60/hr unauthenticated limit; degrade gracefully without it). Normalize to `{description, url, homepage, language, stars, pushedAt}`. Then `merge.ts`: for each curation project, merge GitHub facts + curation editorial. Use `descOverride` only if GitHub `description` is empty. Preserve group + order from curation. Write merged payload (with fresh `updatedAt`) to KV (`projects:v1`).
6. Add `Cache-Control: public, max-age=600` on the response.

`wrangler.toml` additions:
- `[[kv_namespaces]]` binding `PROJECTS_KV`.
- `[assets]` directory = Vite `dist/` so the worker serves the SPA; `/api/*` handled by Hono, everything else falls through to assets.
- `[vars]` / secret: `GITHUB_TOKEN` (set via `wrangler secret put GITHUB_TOKEN`).
- No cron trigger, no `scheduled` handler — freshness is driven by read-time SWR.

---

## 6. Vue app

- Vite + Vue 3 + TypeScript. `useProjects()` composable fetches `/api/projects`, handles loading/error.
- `App.vue`: Header → v-for over `groups` (ProjectGroup with section-label) → each renders ProjectCard list → LinksSection from the API `links` (or keep links static in curation as above).
- ProjectCard props: name, description, url, homepage, language, stars, mark, status, tech. Render star badge if stars>0, live-link arrow if homepage, always a `↗ src` to url.
- Graceful fallback: if `/api/projects` fails, render a small baked snapshot committed as `src/fallback.json` so the site never shows empty.

---

## 7. Acceptance criteria

- [ ] `bun install && bun run build` produces `dist/`.
- [ ] `wrangler dev` serves the Vue SPA at `/` and `GET /api/projects` returns merged JSON.
- [ ] All four groups render with correct order; stars/language/last-push come from live GitHub, not hardcoded.
- [ ] Every card links to its real repo (and live site when present). GitHub handle shows `cloudboy-jh`. X link resolves to the real handle URL.
- [ ] Dark aesthetic visually matches the current site (same tokens, fonts, 640px column, sharp corners).
- [ ] Stale-while-revalidate: fresh KV returns instantly; stale KV returns instantly and refreshes in the background via `ctx.waitUntil`.
- [ ] Fallback JSON renders if the API is unreachable.
- [ ] Deploy: `wrangler deploy` (migrate off pure Pages to Worker-with-assets).

---

## 8. Out of scope / leave for Jack
- Final status calls on porter/veil (currently dropped).
- Adding analytics.
- Custom domain wiring (keep existing).
