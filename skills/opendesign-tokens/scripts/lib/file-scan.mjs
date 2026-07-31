/**
 * File scanning utilities — extract var(--o-*) usages from source files.
 *
 * Used by the `scan` command to find invalid token references in code.
 */

import { readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const TOKEN_USAGE_REGEX = /var\(\s*(--o-[a-z0-9_-]+)\s*(?:,[^)]*)?\)/gi;

/**
 * Scan file content for all var(--o-*) usages.
 * Returns { token, line, column }[] (1-based line/column).
 */
export function extractTokenUsages(content) {
  const results = [];
  // Pre-compute line start offsets for line/column lookup.
  const lineStarts = [0];
  for (let i = 0; i < content.length; i++) {
    if (content.charCodeAt(i) === 0x0a) {
      // \n
      lineStarts.push(i + 1);
    }
  }
  let m;
  TOKEN_USAGE_REGEX.lastIndex = 0;
  while ((m = TOKEN_USAGE_REGEX.exec(content)) !== null) {
    const token = m[1];
    const offset = m.index;
    // Binary search for line number.
    let lo = 0;
    let hi = lineStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lineStarts[mid] <= offset) lo = mid;
      else hi = mid - 1;
    }
    const line = lo + 1; // 1-based
    const column = offset - lineStarts[lo] + 1; // 1-based
    results.push({ token, line, column });
  }
  return results;
}

/**
 * Recursively collect files matching the given extensions from a path list.
 */
export function collectFiles(paths, extensions) {
  const result = [];
  for (const p of paths) {
    const abs = resolve(p);
    let stat;
    try {
      stat = statSync(abs);
    } catch {
      continue;
    }
    if (stat.isFile()) {
      if (extensions.some((ext) => abs.toLowerCase().endsWith(ext))) {
        result.push(abs);
      }
      continue;
    }
    if (stat.isDirectory()) {
      const stack = [abs];
      while (stack.length) {
        const dir = stack.pop();
        let entries;
        try {
          entries = readdirSync(dir);
        } catch {
          continue;
        }
        for (const e of entries) {
          const full = join(dir, e);
          let s;
          try {
            s = statSync(full);
          } catch {
            continue;
          }
          if (s.isDirectory()) {
            if (e === 'node_modules' || e === '.git') continue;
            stack.push(full);
          } else if (s.isFile()) {
            if (extensions.some((ext) => full.toLowerCase().endsWith(ext))) {
              result.push(full);
            }
          }
        }
      }
    }
  }
  return result;
}

export { TOKEN_USAGE_REGEX };
