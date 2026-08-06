/**
 * Given timed spans, compute exclusive (self) duration by subtracting
 * direct children fully contained in each parent's time window.
 * Rails view events are inclusive of nested renders — summing them double-counts.
 */
export function withExclusiveDurations(items, {
  getStart = (item) => item.time ?? item.startMs ?? 0,
  getDuration = (item) => item.duration ?? item.durationMs ?? 0,
} = {}) {
  const nodes = items.map((item, index) => {
    const start = Number(getStart(item)) || 0
    const duration = Number(getDuration(item)) || 0
    return {
      item,
      index,
      start,
      duration,
      end: start + duration,
      hasTiming: start > 0 && duration > 0,
    }
  })

  return nodes.map((node) => {
    if (!node.hasTiming) {
      return {
        ...node.item,
        durationInclusive: node.duration,
        durationExclusive: node.duration,
        nestDepth: 0,
      }
    }

    const nested = nodes.filter(
      (other) =>
        other.index !== node.index &&
        other.hasTiming &&
        other.start >= node.start - 1e-6 &&
        other.end <= node.end + 1e-6 &&
        other.duration < node.duration - 1e-6
    )

    const directChildren = nested.filter(
      (child) =>
        !nested.some(
          (other) =>
            other.index !== child.index &&
            child.start >= other.start - 1e-6 &&
            child.end <= other.end + 1e-6 &&
            child.duration < other.duration - 1e-6
        )
    )

    const childSum = directChildren.reduce((acc, child) => acc + child.duration, 0)
    const ancestors = nodes.filter(
      (other) =>
        other.index !== node.index &&
        other.hasTiming &&
        node.start >= other.start - 1e-6 &&
        node.end <= other.end + 1e-6 &&
        node.duration < other.duration - 1e-6
    )

    return {
      ...node.item,
      durationInclusive: node.duration,
      durationExclusive: Math.max(0, node.duration - childSum),
      nestDepth: ancestors.length,
    }
  })
}

export function sumExclusive(items) {
  return items.reduce((acc, item) => {
    const ms = item.durationExclusive ?? item.durationExclusiveMs ?? 0
    return acc + (Number(ms) || 0)
  }, 0)
}
