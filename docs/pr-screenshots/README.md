# PR screenshots (standalone demo)

Captured from `npm run dev` at http://localhost:5173/ (Rails Panel 2.5 fixtures).

| File | What it shows |
|------|----------------|
| `01-request-list-overview.png` | Request list with Compare A/B, N+1 badges, statuses |
| `02-compare-show-ab.png` | Compare tab: `#show` fast vs slow (+72 ms, SQL added) |
| `03-database-n-plus-one.png` | Database tab: N+1 Comment/User Load patterns |
| `04-error-422-backtrace.png` | Error tab: `RecordInvalid` multiline stack (422 create) |
| `05-timeline-kitchen-sink.png` | Timeline: checkout waterfall + exception frames |
| `06-cache-kitchen-sink.png` | Cache: read miss/write/hit/exist |
| `07-log-ar-format.png` | Log: ActiveRecord ANSI + `↳` source lines |
