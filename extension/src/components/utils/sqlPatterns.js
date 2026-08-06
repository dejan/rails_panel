/**
 * Normalize SQL so queries that differ only by binds/literals share a pattern.
 * Used for repeated-query / N+1 detection.
 */
export function normalizeSql(sql) {
  let s = String(sql || '')
  if (!s) return ''

  // Strip SQL comments
  s = s.replace(/\/\*[\s\S]*?\*\//g, ' ')
  s = s.replace(/--[^\n]*/g, ' ')

  // Normalize whitespace
  s = s.replace(/\s+/g, ' ').trim()

  // Single-quoted string literals (values)
  s = s.replace(/'(?:[^'\\]|\\.)*'/g, '?')

  // Positional / anonymous binds
  s = s.replace(/\$\d+/g, '?')
  s = s.replace(/\?/g, '?')

  // Numeric literals (keep away from identifiers by word boundary)
  s = s.replace(/\b\d+(?:\.\d+)?\b/g, '?')

  // Collapse IN (?, ?, ?) → IN (?)
  s = s.replace(/\bIN\s*\(\s*\?(?:\s*,\s*\?)*\s*\)/gi, 'IN (?)')

  // Collapse VALUES (?, ?), (?, ?) style lists somewhat
  s = s.replace(/\(\s*\?(?:\s*,\s*\?)*\s*\)(?:\s*,\s*\(\s*\?(?:\s*,\s*\?)*\s*\))+/g, '(?)')

  return s
}

export function isMetaSqlType(type) {
  const t = String(type || '')
  return (
    t === 'SCHEMA' ||
    t === 'EXPLAIN' ||
    t === 'TRANSACTION' ||
    /^TRANSACTION\b/i.test(t)
  )
}

/**
 * True for read/filter-style SQL (SELECT / WITH…SELECT), or AR type names
 * that almost always wrap SELECTs (Load, Exists?, Count, …).
 * Used so Filter? (F?) does not tag INSERT/UPDATE/DELETE/TRANSACTION.
 */
export function isSelectLikeSql({ type, pattern, sample, query } = {}) {
  const sql = String(sample || query || pattern || '').trim()
  if (/^SELECT\b/i.test(sql)) return true
  if (/^WITH\b/i.test(sql) && /\bSELECT\b/i.test(sql)) return true

  const t = String(type || '')
  if (!t || isMetaSqlType(t)) return false
  // ActiveRecord payload names for reads
  if (/\b(Load|Exists\?|Count|Pluck|Ids|Pick)\s*$/i.test(t)) return true
  if (/\b(Load|Exists\?|Count|Pluck|Ids|Pick)\b/i.test(t) && !/\b(Create|Update|Destroy|Delete|Insert)\b/i.test(t)) {
    return true
  }
  return false
}

/** Tokenize normalized SQL for structural comparison. */
export function tokenizeSql(sql) {
  return String(sql || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

/**
 * Loose fingerprint: SELECT/FROM/JOIN shape without WHERE/ORDER/GROUP/HAVING/LIMIT body.
 * Helps pair "same query + extra AND …" across A/B.
 */
export function sqlShapeKey(normalizedSql) {
  const s = String(normalizedSql || '')
  if (!s) return ''
  const cut = s.search(/\b(?:WHERE|GROUP\s+BY|HAVING|ORDER\s+BY|LIMIT|OFFSET|UNION|INTERSECT|EXCEPT)\b/i)
  const head = cut >= 0 ? s.slice(0, cut).trim() : s
  return head.replace(/\s+/g, ' ').trim().toUpperCase()
}

/**
 * Longest common prefix/suffix token diff between two normalized patterns.
 * @returns {{ kind: 'added'|'removed'|'changed', text?: string, textA?: string, textB?: string, label: string } | null}
 */
export function diffSqlPatterns(patternA, patternB) {
  const ta = tokenizeSql(patternA)
  const tb = tokenizeSql(patternB)
  if (!ta.length || !tb.length) return null
  if (patternA === patternB) return null

  let pre = 0
  while (pre < ta.length && pre < tb.length && ta[pre].toUpperCase() === tb[pre].toUpperCase()) {
    pre += 1
  }
  let suf = 0
  while (
    suf < ta.length - pre &&
    suf < tb.length - pre &&
    ta[ta.length - 1 - suf].toUpperCase() === tb[tb.length - 1 - suf].toUpperCase()
  ) {
    suf += 1
  }

  const midA = ta.slice(pre, ta.length - suf).join(' ')
  const midB = tb.slice(pre, tb.length - suf).join(' ')
  if (!midA && !midB) return null
  if (!midA && midB) return { kind: 'added', text: midB, label: '+ clause' }
  if (midA && !midB) return { kind: 'removed', text: midA, label: '− clause' }
  return { kind: 'changed', textA: midA, textB: midB, label: '≠ clause' }
}

/**
 * True when one normalized SQL is essentially the other plus a small clause
 * (token subsequence, or same shape key with limited edit size).
 */
export function isNearSqlMatch(patternA, patternB) {
  const a = String(patternA || '')
  const b = String(patternB || '')
  if (!a || !b || a === b) return false

  const ta = tokenizeSql(a)
  const tb = tokenizeSql(b)
  if (ta.length < 4 || tb.length < 4) return false

  const [shorter, longer] = ta.length <= tb.length ? [ta, tb] : [tb, ta]
  if (longer.length > shorter.length * 2.5 && longer.length - shorter.length > 20) {
    return false
  }

  let i = 0
  for (const tok of longer) {
    if (i < shorter.length && tok.toUpperCase() === shorter[i].toUpperCase()) i += 1
  }
  if (i === shorter.length) {
    const extra = longer.length - shorter.length
    if (extra > 0 && (extra <= 16 || extra / longer.length <= 0.45)) return true
  }

  const shapeA = sqlShapeKey(a)
  const shapeB = sqlShapeKey(b)
  if (shapeA && shapeA === shapeB) {
    const snippet = diffSqlPatterns(a, b)
    if (!snippet) return false
    const editLen =
      snippet.kind === 'changed'
        ? tokenizeSql(snippet.textA).length + tokenizeSql(snippet.textB).length
        : tokenizeSql(snippet.text || '').length
    return editLen > 0 && editLen <= 24
  }

  return false
}

/** Score for pairing onlyA ↔ onlyB (lower is better). */
export function nearSqlMatchScore(patternA, patternB) {
  if (!isNearSqlMatch(patternA, patternB)) return Infinity
  const ta = tokenizeSql(patternA)
  const tb = tokenizeSql(patternB)
  const lenDiff = Math.abs(ta.length - tb.length)
  const snippet = diffSqlPatterns(patternA, patternB)
  const edit =
    snippet?.kind === 'changed'
      ? tokenizeSql(snippet.textA || '').length + tokenizeSql(snippet.textB || '').length
      : tokenizeSql(snippet?.text || '').length
  const sameShape = sqlShapeKey(patternA) === sqlShapeKey(patternB) ? 0 : 8
  return lenDiff + edit + sameShape
}

/**
 * Greedy 1:1 pairing of onlyA/onlyB sqlDiff rows that look like near-matches.
 * Mutates rows in place with nearMatch metadata.
 */
export function annotateSqlNearMatches(sqlDiffRows, { meaningfulParams = [], meaningfulParamNames = [] } = {}) {
  const rows = Array.isArray(sqlDiffRows) ? sqlDiffRows : []
  const onlyA = rows.filter((r) => r.side === 'onlyA')
  const onlyB = rows.filter((r) => r.side === 'onlyB')
  if (!onlyA.length || !onlyB.length) return rows

  const relatedParams = (
    Array.isArray(meaningfulParams) && meaningfulParams.length
      ? meaningfulParams
      : (meaningfulParamNames || []).map((name) => ({ name }))
  ).slice(0, 6)

  const pairs = []
  for (const a of onlyA) {
    for (const b of onlyB) {
      const typePenalty =
        a.type && b.type && String(a.type) !== String(b.type) ? 50 : 0
      const score = nearSqlMatchScore(a.pattern, b.pattern) + typePenalty
      if (Number.isFinite(score)) pairs.push({ a, b, score })
    }
  }
  pairs.sort((x, y) => x.score - y.score)

  const usedA = new Set()
  const usedB = new Set()
  const paramHint = relatedParams.length > 0

  for (const { a, b } of pairs) {
    if (usedA.has(a.pattern) || usedB.has(b.pattern)) continue
    usedA.add(a.pattern)
    usedB.add(b.pattern)

    const snippet = diffSqlPatterns(a.pattern, b.pattern)

    a.nearMatch = true
    a.nearMatchPartnerPattern = b.pattern
    a.nearMatchPartnerSample = b.sample
    a.nearMatchPartnerSide = 'B'
    a.sqlClauseDiff = snippet

    b.nearMatch = true
    b.nearMatchPartnerPattern = a.pattern
    b.nearMatchPartnerSample = a.sample
    b.nearMatchPartnerSide = 'A'
    b.sqlClauseDiff = snippet

    // Extra/changed WHERE while params changed → reinforce Filter? (SELECT only)
    if (
      paramHint &&
      snippet &&
      isSelectLikeSql(a) &&
      isSelectLikeSql(b)
    ) {
      a.likelyFilterDriven = true
      a.relatedParams = relatedParams
      b.likelyFilterDriven = true
      b.relatedParams = relatedParams
    }
  }

  return rows
}

/**
 * Collapse each near-match onlyA/onlyB pair into a single `side: 'near'` row.
 * Call after annotateSqlNearMatches.
 */
export function collapseSqlNearMatches(sqlDiffRows) {
  const rows = Array.isArray(sqlDiffRows) ? sqlDiffRows : []
  const onlyBByPattern = new Map()
  for (const r of rows) {
    if (r.side === 'onlyB' && r.nearMatch) onlyBByPattern.set(r.pattern, r)
  }

  const usedB = new Set()
  const out = []
  for (const a of rows) {
    if (a.side === 'onlyA' && a.nearMatch && a.nearMatchPartnerPattern) {
      const b = onlyBByPattern.get(a.nearMatchPartnerPattern)
      if (b && !usedB.has(b.pattern)) {
        usedB.add(b.pattern)
        out.push(mergeNearMatchPair(a, b))
        continue
      }
    }
    if (a.side === 'onlyB' && a.nearMatch && usedB.has(a.pattern)) continue
    out.push(a)
  }
  return out
}

function mergeNearMatchPair(a, b) {
  const countA = a.countA || 0
  const countB = b.countB || 0
  const timeA = a.timeA || 0
  const timeB = b.timeB || 0
  return {
    pattern: a.pattern,
    patternA: a.pattern,
    patternB: b.pattern,
    sample: a.sample || a.pattern,
    sampleA: a.sample || a.pattern,
    sampleB: b.sample || b.pattern,
    bindsA: a.bindsA,
    bindsB: b.bindsB,
    type: a.type || b.type || '',
    side: 'near',
    countA,
    countB,
    timeA,
    timeB,
    deltaTime: timeB - timeA,
    deltaCount: countB - countA,
    isNPlusOneA: !!a.isNPlusOneA,
    isNPlusOneB: !!b.isNPlusOneB,
    isNPlusOne: !!(a.isNPlusOne || b.isNPlusOne),
    likelyFilterDriven: !!(a.likelyFilterDriven || b.likelyFilterDriven),
    relatedParams: (a.relatedParams?.length ? a.relatedParams : b.relatedParams) || [],
    nearMatch: true,
    nearMatchPartnerPattern: b.pattern,
    nearMatchPartnerSample: b.sample || b.pattern,
    nearMatchPartnerSide: 'B',
    sqlClauseDiff: a.sqlClauseDiff || b.sqlClauseDiff || null,
  }
}

/**
 * Annotate AR query rows with repeat / N+1 metadata.
 * - isRepeated: same pattern appears ≥ 2 times
 * - isNPlusOne: same pattern appears ≥ 3 times (classic N+1 smell)
 */
export function annotateQueryRepeats(queries, { nPlusOneMin = 3, repeatMin = 2 } = {}) {
  const list = Array.isArray(queries) ? queries : []
  const groups = new Map()

  list.forEach((q, index) => {
    if (isMetaSqlType(q.type)) return
    const pattern = normalizeSql(q.query)
    if (!pattern) return
    if (!groups.has(pattern)) {
      groups.set(pattern, {
        pattern,
        indexes: [],
        totalMs: 0,
        sample: q.query,
        type: q.type,
      })
    }
    const g = groups.get(pattern)
    g.indexes.push(index)
    g.totalMs += Number(q.duration) || 0
  })

  return list.map((q, index) => {
    if (isMetaSqlType(q.type)) {
      return {
        ...q,
        sqlPattern: null,
        repeatCount: 1,
        isRepeated: false,
        isNPlusOne: false,
      }
    }
    const pattern = normalizeSql(q.query)
    const g = groups.get(pattern)
    const count = g?.indexes.length || 1
    return {
      ...q,
      sqlPattern: pattern || null,
      repeatCount: count,
      isRepeated: count >= repeatMin,
      isNPlusOne: count >= nPlusOneMin,
    }
  })
}

/** Unique N+1 pattern groups (count ≥ nPlusOneMin), sorted by total time desc. */
export function nPlusOneGroups(annotated, { nPlusOneMin = 3 } = {}) {
  const seen = new Map()
  for (const q of annotated || []) {
    if (!q.isNPlusOne || !q.sqlPattern) continue
    if (seen.has(q.sqlPattern)) continue
    seen.set(q.sqlPattern, {
      pattern: q.sqlPattern,
      sample: q.query,
      type: q.type,
      count: q.repeatCount,
      totalMs: 0,
    })
  }
  for (const q of annotated || []) {
    if (!q.sqlPattern || !seen.has(q.sqlPattern)) continue
    seen.get(q.sqlPattern).totalMs += Number(q.duration) || 0
  }
  return Array.from(seen.values())
    .filter((g) => g.count >= nPlusOneMin)
    .sort((a, b) => b.totalMs - a.totalMs || b.count - a.count)
}
