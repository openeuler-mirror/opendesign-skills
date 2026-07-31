/**
 * Token lookup, normalization, and suggestion utilities.
 *
 * Shared between check-tokens and convert-to-token — both need to
 * normalize user input, look up tokens in the registry, and compute
 * closest-match suggestions for invalid names.
 */

// ---------------------------------------------------------------------------
// Token name normalization
// ---------------------------------------------------------------------------

/**
 * Normalize various input forms to a canonical --o-* variable name.
 * Accepts: "var(--o-color-primary1)", "--o-color-primary1", "color-primary1".
 */
export function normalizeTokenName(input) {
  if (!input) return null;
  let s = String(input).trim();
  // Strip var(...) wrapper.
  const varMatch = s.match(/^var\(\s*(--[^)]+?)\s*(?:,[^)]*)?\)$/i);
  if (varMatch) s = varMatch[1];
  // Strip leading --o- / -- (will re-add canonical prefix).
  s = s.replace(/^--+/, '');
  if (!s.startsWith('o-') && !s.startsWith('o')) {
    if (!s.startsWith('o-')) s = 'o-' + s;
  }
  return '--' + s;
}

// ---------------------------------------------------------------------------
// Token lookup
// ---------------------------------------------------------------------------

/**
 * Look up a token in the registry.
 * Returns { exists, value, scope, note? }.
 */
export function lookupToken(registry, tokenName, theme, mode) {
  // Responsive variables are theme-independent.
  if (tokenName.startsWith('--o-r-')) {
    const entries = registry.responsive.get(tokenName);
    if (entries && entries.length > 0) {
      const base = entries.find((e) => e.media === null) || entries[0];
      return { exists: true, value: base.value, scope: 'responsive' };
    }
    return { exists: false };
  }
  // Theme-specific variables.
  const t = registry.themes[theme];
  if (!t) return { exists: false };
  const modeVars = t[mode];
  if (modeVars && modeVars.has(tokenName)) {
    return { exists: true, value: modeVars.get(tokenName), scope: `${theme}.${mode}` };
  }
  // Some tokens only exist in one mode (rare); check the other mode.
  const otherMode = mode === 'light' ? 'dark' : 'light';
  if (t[otherMode] && t[otherMode].has(tokenName)) {
    return {
      exists: true,
      value: t[otherMode].get(tokenName),
      scope: `${theme}.${otherMode}`,
      note: `not defined in ${mode} mode, using ${otherMode}`,
    };
  }
  return { exists: false };
}

/**
 * Get metadata for a token from the registry.
 */
export function getMetadata(registry, tokenName) {
  return registry.metadata.get(tokenName) || null;
}

// ---------------------------------------------------------------------------
// Levenshtein distance & closest-match suggestions
// ---------------------------------------------------------------------------

export function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = new Array(n + 1);
  let curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1,    // insertion
        prev[j] + 1,        // deletion
        prev[j - 1] + cost, // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

export function commonPrefixLength(a, b) {
  const min = Math.min(a.length, b.length);
  let i = 0;
  while (i < min && a[i] === b[i]) i++;
  return i;
}

export function trailingDigits(s) {
  const m = s.match(/(\d+)$/);
  return m ? m[1] : '';
}

/**
 * Find closest matches to `token` from `candidates`.
 * Returns { name, distance, prefix? }[] sorted by:
 *   1. Levenshtein distance (asc)
 *   2. Same numeric suffix (true first)
 *   3. Common prefix length (desc)
 *   4. Name (alpha)
 */
export function findClosest(token, candidates, maxResults = 3, maxDistance = 4) {
  const inputSuffix = trailingDigits(token);
  const results = [];
  for (const c of candidates) {
    if (c === token) continue;
    const d = levenshtein(token, c);
    if (d <= maxDistance) {
      results.push({
        name: c,
        distance: d,
        prefixLen: commonPrefixLength(token, c),
        suffixMatch: inputSuffix !== '' && trailingDigits(c) === inputSuffix,
      });
    }
  }
  // Also check prefix matches.
  for (const c of candidates) {
    if (c === token) continue;
    if (c.startsWith(token) || token.startsWith(c)) {
      if (!results.find((r) => r.name === c)) {
        const d = Math.abs(c.length - token.length);
        results.push({
          name: c,
          distance: d,
          prefixLen: commonPrefixLength(token, c),
          suffixMatch: inputSuffix !== '' && trailingDigits(c) === inputSuffix,
          prefix: true,
        });
      }
    }
  }
  results.sort(
    (a, b) =>
      a.distance - b.distance ||
      (b.suffixMatch ? 1 : 0) - (a.suffixMatch ? 1 : 0) ||
      b.prefixLen - a.prefixLen ||
      a.name.localeCompare(b.name),
  );
  return results.slice(0, maxResults);
}
