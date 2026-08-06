RailsPanel
===========

RailsPanel is a Chrome extension for Rails development that will end your tailing of development.log. Have all information about your Rails app requests in the browser — in the Developer Tools panel. Provides insight into db / rendering / total times, parameter list, rendered views, SQL, cache, logs, and more.

<img width="640" alt="rails_panel" src="https://github.com/dejan/rails_panel/assets/4494/f41b18b9-444c-419f-93fb-163481f53f82">

## Highlights (2.x)

- **Timeline** — waterfall of the request with Slow / Heavy / Gap markers
- **N+1 detection** — repeated SQL patterns called out in Database and Compare
- **Compare (A/B)** — baseline vs candidate: params, SQL, cache, views, exceptions; click a row to jump into the detail tab with highlight; collapsible sections; copy SQL / cache / views from Compare
- **Near-match SQL (≈)** — almost-identical patterns (e.g. extra `WHERE`) collapse to one **A≈B** row with the differing clause
- **Filter? (F?)** — likely filter-driven **SELECT** SQL; Expand shows candidate params with A/B values and jump to Params
- **Nested params** — Compare expands JSON params to leaf paths (`post.status`) for All / Diff filters
- **Compare time noise** — configurable ms / % threshold for Diff / Slower / Faster (Settings); optional compact SQL rows
- **Share requests** — copy/export and import requests (including external captures)
- **Syntax highlighting** — SQL and params colored in detail views and Compare
- **Standalone demos** — richer fixtures (Compare pairs including filter ≈/F?, N+1, 422 + stack, kitchen-sink request)
### Compare at a glance

1. Mark one request as **A** (baseline) and another as **B** (after your change).
2. Open the **Compare** tab.
3. Use filters such as **Diff**, **Slower**, **Faster**, **N+1**, **≈ SQL**, or **Filter?** (likely filter-driven SQL).

Example SQL row (B slower than A):

```text
Side  Pattern                         Count    Δ Count   Time              Δ Time
A-B   User Load · SELECT "users".* …  1 → 1    0         12 ms → 48 ms     +36 ms
```

Example params:

```text
Side     Name   A           B
changed  q      "active"    "archived"
B        page   —           2
```

Full release notes: [CHANGELOG.md](CHANGELOG.md).

## Installation

To use this extension you need to add meta_request gem to your app's Gemfile:

```ruby
group :development do
  gem 'meta_request'
end
```

After this, install RailsPanel extension for [Chrome](https://chrome.google.com/webstore/detail/railspanel/gjpfobpafnhjhbajcjgccbbdofdckggg). This is the recommended way of installing the extension, since it will auto-update on every new version.

You can also install a packaged build from [GitHub Releases](https://github.com/smart-sgisistemas/rails_panel/releases) (ZIP → Load unpacked).

The extension works with requests on any host (HTTP or HTTPS, any port).

## Install unpacked version

### From a release ZIP

1. Download `rails_panel-<version>.zip` from [Releases](https://github.com/smart-sgisistemas/rails_panel/releases).
2. Unzip it.
3. Chrome → Extensions → Developer mode → **Load unpacked** → select the unzipped folder.

### From source (latest / hacking)

```bash
cd extension
npm install
npm run build
```

Then in Chrome → Extensions → Developer mode → **Load unpacked** → select `extension/dist`.

For a zip/crx package locally:

```bash
cd extension
npm run release
# → extension/releases/rails_panel-<version>.zip
```

See [extension/README.md](extension/README.md) for packaging details.

## Supported environments

* Rails 5, 6, 7 and 8
* Ruby 3 and 4

## Licence

Copyright (c) 2012 Dejan Simic

MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
