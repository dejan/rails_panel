## Development mode

```bash
npm run dev
```

## Preview the extension

```bash
npm run build
```

In Chrome → Extensions → Load unpacked → select the `dist` directory.

## Create installable packages (share with others)

```bash
npm run release
```

Creates in `releases/`:

- `rails_panel-<version>.zip` — **recommended** for teams  
  Unzip → Chrome → Extensions → Developer mode → **Load unpacked**
- `rails_panel-<version>.crx` — packed extension  
  Developer mode on → drag the `.crx` onto `chrome://extensions`

GitHub Releases for this fork attach the same ZIP (see repo [Releases](https://github.com/smart-sgisistemas/rails_panel/releases) and root [CHANGELOG.md](../CHANGELOG.md)).

Signing key (for stable extension id across packs) is stored at
`packaging/rails_panel.pem` and is gitignored — back it up privately.

**Note:** Chrome often blocks `.crx` installs outside the Web Store. If drag-and-drop
fails, use the ZIP / Load unpacked path (same build).
