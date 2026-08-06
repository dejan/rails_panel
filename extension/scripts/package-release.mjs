import { mkdir, readFile, rm, cp, rename, access } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const releases = join(root, 'releases')
const packaging = join(root, 'packaging')
const pemPath = join(packaging, 'rails_panel.pem')

const chromeCandidates = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  'google-chrome',
  'chromium',
]

function findChrome() {
  for (const candidate of chromeCandidates) {
    if (candidate.includes('/') && existsSync(candidate)) return candidate
  }
  for (const candidate of chromeCandidates.filter((c) => !c.includes('/'))) {
    try {
      execFileSync('which', [candidate], { stdio: 'ignore' })
      return candidate
    } catch {
      /* continue */
    }
  }
  return null
}

if (!existsSync(dist)) {
  console.error('dist/ missing — run npm run build first')
  process.exit(1)
}

const manifest = JSON.parse(await readFile(join(dist, 'manifest.json'), 'utf8'))
const version = manifest.version || '0.0.0'
const folderName = `rails_panel-${version}`
const zipName = `${folderName}.zip`
const crxName = `${folderName}.crx`
const staging = join(releases, folderName)
const zipPath = join(releases, zipName)
const crxPath = join(releases, crxName)

await mkdir(releases, { recursive: true })
await mkdir(packaging, { recursive: true })
await rm(staging, { recursive: true, force: true })
await rm(zipPath, { force: true })
await rm(crxPath, { force: true })
await cp(dist, staging, { recursive: true })

// ZIP (unpacked sideload)
execFileSync('zip', ['-r0', zipName, folderName], { cwd: releases, stdio: 'inherit' })

// CRX (packed) via Chrome
const chrome = findChrome()
if (!chrome) {
  console.warn('\nChrome not found — skipped .crx (zip only).')
} else {
  const packArgs = [`--pack-extension=${staging}`]
  const hasPem = existsSync(pemPath)
  if (hasPem) packArgs.push(`--pack-extension-key=${pemPath}`)

  try {
    execFileSync(chrome, packArgs, { stdio: 'inherit' })
  } catch (err) {
    // Chrome pack often exits non-zero even on success; check output file.
  }

  const packedCrx = `${staging}.crx`
  const packedPem = `${staging}.pem`

  if (existsSync(packedCrx)) {
    await rename(packedCrx, crxPath)
    console.log(`\nPacked CRX: ${crxPath}`)
  } else {
    console.warn('\nCRX was not produced — check Chrome pack output above.')
  }

  // Persist signing key so updates keep the same extension id
  if (!hasPem && existsSync(packedPem)) {
    await rename(packedPem, pemPath)
    console.log(`Signing key saved: ${pemPath}`)
    console.log('Keep this .pem private and reuse it for future packs.')
  } else if (existsSync(packedPem)) {
    await rm(packedPem, { force: true })
  }
}

await rm(staging, { recursive: true, force: true })

console.log(`\nRelease ready:`)
console.log(`  ZIP: ${zipPath}`)
if (existsSync(crxPath)) console.log(`  CRX: ${crxPath}`)
console.log(`
Install:
  ZIP → unzip → chrome://extensions → Developer mode → Load unpacked
  CRX → chrome://extensions → drag the .crx onto the page (Developer mode on)

Note: modern Chrome may block CRX install outside the Web Store / enterprise policy.
If drag-and-drop fails, use the ZIP (unpacked) path — same build, more reliable for teams.
`)
