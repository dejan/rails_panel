export function normalizePath(location, line = null) {
  const filename = location.replace(/^.*\/(app\/.*)$/, '$1');
  if (line === null) {
    return filename;
  } else {
    return filename + ':' + line;
  }
}
