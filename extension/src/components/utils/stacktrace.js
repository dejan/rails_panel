/**
 * Extract file + line from a Ruby-style stack frame, e.g.
 *   app/controllers/diagrams_controller.rb:105:in `thumbnail'
 *   /home/.../app/models/diagram.rb:21:in `find_by_short_id'
 */
export function parseStackLocation(call) {
  if (!call || typeof call !== 'string') {
    return { filepath: null, line: null }
  }

  const match = call.match(/(\S+\.rb):(\d+)/)
  if (!match) {
    return { filepath: null, line: null }
  }

  return {
    filepath: match[1],
    line: Number(match[2]),
  }
}
