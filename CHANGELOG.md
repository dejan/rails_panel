# Changelog

All notable changes to the **Rails Panel** Chrome extension are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.2] — 2026-08-06

### Added

- **Nested params leaf diff** — object/array params expand to paths (`post.status`); All / Changed / Added / Removed see every leaf
- **Compact SQL rows** — Settings → Compare: one-line SQL preview in the table (Expand for full query)
- **View in Params** from Filter? Expand — jumps to the matching Compare Params row
- Near-match list preview: clause snippet + `B · …` SQL line

### Changed

- **Filter? (F?)** only applies to SELECT-like SQL (not INSERT / UPDATE / DELETE / TRANSACTION)
- Near-match SQL rows participate in **Slower / Faster / Added / Removed** filters
- Compare SQL layout: type + Copy/Expand on one row; SQL below (better narrow widths)
- Expand SQL / Database query modals: single card borders (header + body), SQL A|B and binds side-by-side on wide screens
- Δ Count / Δ Time visually stronger than absolute Count / Time
- SQL preview wraps on spaces (less mid-identifier chopping)

### Examples

#### Nested params

Compare `PostsController#create` 201 vs 422 → Params shows `post.title` changed while `post.body` / `post.status` stay as same leaves under **All**.

#### Compact SQL

Settings → enable **Compact SQL rows** → Compare SQL patterns show a single truncated line; use **Expand** for the full query.

## [2.5.1] — 2026-08-03

### Added

- **Near-match SQL (≈)** — pairs only-A / only-B patterns with the same shape (e.g. extra `WHERE`) into one **A≈B** row, with a clause snippet (`+` / `−` / `≠`)
- **Filter? params in Expand** — when **F?** is set, Expand shows candidate params with **A / B** values
- Filters **≈ SQL** and **Filter?** on Compare SQL
- Demo pair **Posts#index** plain vs `status=published` (standalone Compare seed) to exercise ≈ + F?

### Changed

- Near-match pairs collapse to a **single** Compare row (counts/times from both sides)
- SQL Expand shows SQL A and SQL B for near-matches

### Examples

#### Near-match + Filter?

1. Run `npm run dev` in `extension/`.
2. Open Compare (pre-seeded with the two `PostsController#index` requests).
3. SQL filter **≈ SQL** or **Filter?** → one **A≈B** row with `+ clause WHERE "posts"."status" = ?` and `F? status`.
4. Expand → possible filter params with A/B values, plus both SQL samples.

## [2.5.0] — 2026-08-03

### Added

- **Richer standalone demo fixtures** — pairs of the same action for Compare (`#show` / `#update` fast vs slow), N+1 `PostsController#index`, `PostsController#create` 201/422, and a kitchen-sink `OrdersController#checkout` covering DB / views / cache / logs / exception
- **Compare row copy** — copy SQL, cache keys, and template paths from Compare tables; SQL detail panel with copy
- Standalone demo pre-selects `#show` fast/slow as Compare A/B on first load

### Fixed

- **Exception backtraces** — multiline / multi-frame stacks render as separate lines in Error and Timeline (one frame per line, including multiline `call` payloads)

### Examples

#### Demo Compare without a Rails app

1. Run `npm run dev` in `extension/`.
2. Open http://localhost:5173/ — Compare opens with two `DiagramsController#show` requests.
3. Switch filters to **Slower** / **Diff** to see timing and extra SQL.

#### Validation 422 with stack

Select `PostsController#create` (422) → **Error** shows `ActiveRecord::RecordInvalid` plus a multi-frame backtrace.

## [2.4.0] — 2026-07-31

### Added

- **Click-through from Compare** — click a Params / SQL / Cache / Views / Exceptions row to open the matching detail tab on A or B, with the same highlight + scroll behavior as Timeline
- **Collapsible Compare sections** — Params, SQL, Cache, Views, and Exceptions collapse/expand while keeping the `(filtered/total)` count in the header
- **Compare time noise settings** — Settings → *Compare time noise*:
  - Diff / Slower / Faster use `|Δ| > max(ms, % × max(time A, time B))`
  - Defaults: `1` ms and `5%`

### Changed

- Compare **Diff** filter includes significant time deltas (not only add/remove/count)
- SQL / Cache / Views item layout: type/name on its own line above the value
- Filter chip label **Filter?** (row badge stays **F?**)
- Side badges vertically centered with more spacing between badges

### Examples

#### Jump from Compare into Database

1. Open Compare with A/B set.
2. Click a SQL row (e.g. a slower `User Load` pattern).
3. Panel switches to **Database** on request B (or A if only-A) and highlights matching queries.

#### Tune Diff noise

Settings → Compare time noise → raise **≥ ms** to `5` and/or **≥ %** to `10` so tiny timing jitter drops out of Diff / Slower / Faster.

#### Collapse long Compare pages

Click the chevron next to **SQL patterns (12/40)** to hide the table; the count stays visible.

## [2.3.0] — 2026-07-31

### Added

- **Compare (A/B)** — pick two requests and compare B against A (baseline).
  - Summary line of total Δ (B − A)
  - Stacked duration bars + synchronized waterfall
  - Metrics table (DB, views, cache, SQL count, N+1 patterns, …)
  - Diff sections for **Params**, **SQL patterns**, **Cache keys**, **Views/partials**, and **Exceptions**
  - Filters: Diff / Added / Removed / Slower / Faster (plus N+1, F?, Hits where relevant)
  - Heuristic **F?** badge when param changes look filter-driven for SQL
  - Open A / Open B jump buttons into detail tabs
  - Export compare as text (clipboard) or JSON download
- **Compare tables** use the same resizable DataTable pattern as the rest of the panel
  - Separate columns: Count / Δ Count / Time / Δ Time
  - Sortable Side, Count, Δ Count, Time, Δ Time
  - Line wrapping for long SQL, params, cache keys, and templates
- **Syntax coloring** in Compare for Params (`pretty-print-json`) and SQL (`highlight.js`)
- **Relative template paths** in Compare Views (e.g. `app/views/...`)
- **ANSI color** support in Log and Exception compare samples

### Examples

#### Mark two requests and open Compare

1. In the request list, click **A** on the baseline request and **B** on the candidate.
2. Open the **Compare** tab.
3. Read the one-line summary, e.g. `B − A −42 ms (−12%) · SQL −3 · params 2 changed`.

#### Spot a slower SQL pattern

Filter SQL with **Slower** — rows where the pattern exists on both sides and time went up:

| Side | Pattern | Count | Δ Count | Time | Δ Time |
|------|---------|------:|--------:|------|-------:|
| A-B | `User Load · SELECT "users".* FROM ...` | 1 → 1 | 0 | 12 ms → 48 ms | **+36 ms** |

#### Filter-driven SQL (F?)

When meaningful params changed and SQL count/patterns shifted, rows may show **F?** — hint that the regression is likely from different filters/ids, not only code.

#### Params side-by-side

| Side | Name | A | B |
|------|------|---|---|
| changed | `q` | `"active"` | `"archived"` |
| B | `page` | — | `2` |

Hide framework noise with **Hide framework** (`controller`, `authenticity_token`, …).

#### Cache hit rate change

Filter Cache with **Hits** to see only keys whose hit/miss mix changed (`hitΔ`).

### Changed

- Request list Compare badges: **A**, **B**, **A-B**
- File path links can wrap when showing full relative paths

## [2.0.0] — 2026-07-30

### Added

- Waterfall **Timeline** with Slow / Heavy / Gap markers
- **N+1** detection on SQL patterns
- Configurable ERP / duration thresholds in settings
- Request memory cap
- Request **import/export** (clipboard + file), including external requests
- DevTools-safe clipboard via offscreen document
- Vue 3 + Vite + Pinia + PrimeVue panel rewrite packaging (`npm run release`)

### Packaging

- `npm run release` → `extension/releases/rails_panel-<version>.zip` (and `.crx` when Chrome is available)

## [1.x]

Earlier Chrome Web Store / classic extension builds. See git history for details.

[2.5.2]: https://github.com/smart-sgisistemas/rails_panel/releases/tag/v2.5.2
[2.5.1]: https://github.com/smart-sgisistemas/rails_panel/releases/tag/v2.5.1
[2.5.0]: https://github.com/smart-sgisistemas/rails_panel/releases/tag/v2.5.0
[2.4.0]: https://github.com/smart-sgisistemas/rails_panel/releases/tag/v2.4.0
[2.3.0]: https://github.com/smart-sgisistemas/rails_panel/releases/tag/v2.3.0
[2.0.0]: https://github.com/smart-sgisistemas/rails_panel/releases/tag/v2.0.0
