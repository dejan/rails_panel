/** Secondary column: width follows content (initial size). */
export const colFit = {
  width: '1%',
  whiteSpace: 'nowrap',
  overflow: 'visible',
}

/**
 * Secondary column that can grow with content but soft-caps and ellipsizes
 * when the value is very long (paths, etc.).
 */
export function colFitMax(maxWidth) {
  return {
    width: '1%',
    whiteSpace: 'nowrap',
    maxWidth,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
}

/**
 * Principal column: takes remaining width and can shrink (ellipsis)
 * so the table stays within the panel unless the user resizes columns.
 */
export const colFill = {
  width: '100%',
  maxWidth: '0',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

/** Database: Query gets ~2/3 of the flexible space, Binds ~1/3. */
export const colFillQuery = {
  width: '70%',
  maxWidth: '0',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

export const colFillBinds = {
  width: '30%',
  maxWidth: '0',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}
