/**
 * CSS 解析 + Token 注册表构建。
 *
 * CSS 产物是唯一真值源——变量名、值、@media 断点是使用者实际依赖的稳定契约。
 * JSON 仅作为可选富化（补充 CSS 注释缺失的 @name、断点标签映射等），
 * JSON schema 变更或缺失不影响核心功能。
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { THEMES, THEME_JSON_NAME, MODE_FILE_SUFFIX } from './package-resolver.mjs';

// ---------------------------------------------------------------------------
// CSS 解析
// ---------------------------------------------------------------------------

const CSS_VAR_REGEX = /^\s*(--o-[a-z0-9_-]+)\s*:\s*([^;]+);/;
const ANNOTATION_PATTERNS = {
  name: /\*?\s*@name\s+(.*)/,
  type: /\*?\s*@type\s+(.*)/,
  group: /\*?\s*@group\s+(.*)/,
  description: /\*?\s*@description\s+(.*)/,
};

/**
 * Parse CSS content, preserving full context: @media blocks and JSDoc-style
 * annotations preceding each variable declaration.
 *
 * Returns entry array:
 *   { name, value, media, sectionLabel, annotations }
 */
export function parseCssWithContext(cssContent) {
  const entries = [];
  const lines = cssContent.split(/\r?\n/);
  let currentMedia = null;
  let inMediaBlock = false;
  let braceDepth = 0;
  let pendingAnnotations = {};
  let lastSectionLabel = null;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // --- @media block start ---
    const mediaMatch = line.match(/@media\s+([^{]+?)\s*\{/);
    if (mediaMatch) {
      currentMedia = mediaMatch[1].trim();
      inMediaBlock = true;
      braceDepth = 1;
      const rest = line.slice(mediaMatch.index + mediaMatch[0].length);
      for (const ch of rest) {
        if (ch === '{') braceDepth++;
        else if (ch === '}') braceDepth--;
      }
      if (braceDepth <= 0) {
        currentMedia = null;
        inMediaBlock = false;
      }
      i++;
      continue;
    }

    // --- Track brace depth for @media block end ---
    if (inMediaBlock) {
      const opens = (line.match(/\{/g) || []).length;
      const closes = (line.match(/\}/g) || []).length;
      braceDepth += opens - closes;
      if (braceDepth <= 0) {
        currentMedia = null;
        inMediaBlock = false;
        braceDepth = 0;
      }
    }

    // --- JSDoc comment block start ---
    if (line.includes('/**')) {
      pendingAnnotations = {};
    }

    // --- Extract annotations from JSDoc lines ---
    for (const [key, re] of Object.entries(ANNOTATION_PATTERNS)) {
      const m = line.match(re);
      if (m) pendingAnnotations[key] = m[1].trim();
    }

    // --- Capture single-line /* ... */ section labels (non-JSDoc) ---
    const sectionMatch = line.match(/^\s*\/\*(?!\*).*?\*\/\s*$/);
    if (sectionMatch) {
      const text = sectionMatch[0]
        .replace(/^\s*\/\*\s*/, '')
        .replace(/\s*\*\/\s*$/, '')
        .trim();
      if (text) lastSectionLabel = text;
    }

    // --- Variable declaration ---
    const varMatch = CSS_VAR_REGEX.exec(line);
    if (varMatch) {
      let value = varMatch[2].trim();
      // Handle multi-line values (e.g., calc(...) spanning lines).
      while (i + 1 < lines.length && !value.endsWith(';') && !lines[i].endsWith(';')) {
        i++;
        value += ' ' + lines[i].trim();
        if (lines[i].includes(';')) {
          value = value.replace(/;[\s\S]*$/, '').trim();
          break;
        }
      }
      value = value.replace(/;$/, '').trim();

      entries.push({
        name: varMatch[1],
        value,
        media: currentMedia,
        sectionLabel: inMediaBlock ? lastSectionLabel : null,
        annotations: {
          name: pendingAnnotations.name || '',
          type: pendingAnnotations.type || '',
          group: pendingAnnotations.group || '',
          description: pendingAnnotations.description || '',
        },
      });
      pendingAnnotations = {};
    }

    i++;
  }

  return entries;
}

export function entriesToValueMap(entries) {
  const map = new Map();
  for (const e of entries) {
    map.set(e.name, e.value);
  }
  return map;
}

export function entriesToResponsiveMap(entries) {
  const map = new Map();
  for (const e of entries) {
    if (!map.has(e.name)) map.set(e.name, []);
    map.get(e.name).push({
      media: e.media,
      value: e.value,
      sectionLabel: e.sectionLabel,
    });
  }
  return map;
}

export function entriesToMetadataMap(entries) {
  const map = new Map();
  for (const e of entries) {
    const a = e.annotations;
    if (!a.group && !a.name && !a.description && !a.type) continue;
    if (!map.has(e.name)) {
      map.set(e.name, {
        category: a.group || '',
        name: a.name || '',
        description: a.description || '',
        type: a.type || '',
        typeName: '',
      });
    }
  }
  return map;
}

// ---------------------------------------------------------------------------
// 注册表构建
// ---------------------------------------------------------------------------

/**
 * Build a token registry from the extracted package directory.
 *
 * Structure:
 * {
 *   version,
 *   themes: { e: { light: Map, dark: Map }, ... },
 *   responsive: Map<varName, Array<{media, value, sectionLabel}>>,
 *   responsiveBreakpoints: [],
 *   metadata: Map<varName, {...}>,
 *   allVars: Set<varName>,
 * }
 */
export async function buildTokenRegistry(extractDir, version) {
  const themesDir = join(extractDir, 'themes');
  const tokensDir = join(extractDir, 'tokens');

  const registry = {
    version,
    themes: {},
    responsive: new Map(),
    responsiveBreakpoints: [],
    metadata: new Map(),
    allVars: new Set(),
  };

  // --- Parse theme CSS ---
  for (const t of THEMES) {
    registry.themes[t] = { light: new Map(), dark: new Map() };
    for (const mode of ['light', 'dark']) {
      const candidates = [
        join(themesDir, `${t}.${MODE_FILE_SUFFIX[mode]}.token.css`),
        join(themesDir, THEME_JSON_NAME[t], `${t}.${MODE_FILE_SUFFIX[mode]}.token.css`),
        join(themesDir, THEME_JSON_NAME[t], 'default.token.css'),
        join(themesDir, `${t}.token.css`),
      ];
      const skipDefault = mode !== 'light';
      let cssPath = null;
      for (const cand of candidates) {
        if (skipDefault && /default\.token\.css$/.test(cand)) continue;
        if (existsSync(cand)) {
          cssPath = cand;
          break;
        }
      }
      if (!cssPath) continue;
      const css = readFileSync(cssPath, 'utf-8');
      const entries = parseCssWithContext(css);
      for (const e of entries) {
        if (e.name.startsWith('--o-r-')) continue;
        registry.themes[t][mode].set(e.name, e.value);
        registry.allVars.add(e.name);
      }
      mergeMetadata(registry.metadata, entriesToMetadataMap(entries));
    }
  }

  // --- Parse responsive CSS ---
  const respCssPath = join(themesDir, 'responsive.token.css');
  if (existsSync(respCssPath)) {
    const css = readFileSync(respCssPath, 'utf-8');
    const entries = parseCssWithContext(css);
    registry.responsive = entriesToResponsiveMap(
      entries.filter((e) => e.name.startsWith('--o-r-')),
    );
    for (const name of registry.responsive.keys()) {
      registry.allVars.add(name);
    }
    mergeMetadata(registry.metadata, entriesToMetadataMap(entries));
  }

  // --- Optional JSON enrichment ---
  enrichMetadataFromJson(registry, tokensDir);

  return registry;
}

function mergeMetadata(target, source) {
  for (const [k, v] of source) {
    if (!target.has(k)) {
      target.set(k, v);
    } else {
      const existing = target.get(k);
      for (const field of ['category', 'name', 'description', 'type', 'typeName']) {
        if (!existing[field] && v[field]) {
          existing[field] = v[field];
        }
      }
    }
  }
}

function enrichMetadataFromJson(registry, tokensDir) {
  // Theme JSON: fill metadata gaps.
  for (const t of THEMES) {
    const jsonName = THEME_JSON_NAME[t];
    const candidates = [
      join(tokensDir, `${jsonName}-token.json`),
      join(tokensDir, `${jsonName.replace(/^open/, 'Open')}-token.json`),
    ];
    let jsonPath = null;
    for (const cand of candidates) {
      if (existsSync(cand)) {
        jsonPath = cand;
        break;
      }
    }
    if (!jsonPath) continue;
    let json;
    try {
      json = JSON.parse(readFileSync(jsonPath, 'utf-8'));
    } catch {
      continue;
    }
    for (const [cat, catData] of Object.entries(json)) {
      const items = Array.isArray(catData?.value) ? catData.value : [];
      for (const item of items) {
        if (!item.key) continue;
        const varName = item.key.startsWith('--o-') ? item.key : `--o-${item.key}`;
        if (!registry.metadata.has(varName)) {
          registry.metadata.set(varName, {
            category: cat,
            name: item.name || '',
            description: item.description || '',
            type: catData.type || '',
            typeName: catData.typeName || '',
          });
        } else {
          const existing = registry.metadata.get(varName);
          if (!existing.category && cat) existing.category = cat;
          if (!existing.name && item.name) existing.name = item.name;
          if (!existing.description && item.description) existing.description = item.description;
          if (!existing.type && catData.type) existing.type = catData.type;
          if (!existing.typeName && catData.typeName) existing.typeName = catData.typeName;
        }
      }
    }
  }

  // Responsive JSON: breakpoint labels only.
  const respJsonPath = join(tokensDir, 'responsive-token.json');
  if (existsSync(respJsonPath)) {
    try {
      const json = JSON.parse(readFileSync(respJsonPath, 'utf-8'));
      registry.responsiveBreakpoints = (json.breakpoints || []).map((b) => ({
        label: b.label || '',
        range: b.range || '',
        media: b.media || '',
      }));
      for (const group of json.groups || []) {
        for (const row of group.rows || []) {
          for (const v of row.vars || []) {
            if (!v.key) continue;
            if (!registry.metadata.has(v.key)) {
              registry.metadata.set(v.key, {
                category: `responsive-${v.group || group.type || ''}`,
                name: row.name || '',
                description: row.description || '',
                type: 'responsive',
                typeName: group.title || '',
              });
            } else {
              const existing = registry.metadata.get(v.key);
              if (!existing.category) existing.category = `responsive-${v.group || group.type || ''}`;
              if (!existing.name && row.name) existing.name = row.name;
              if (!existing.description && row.description) existing.description = row.description;
            }
          }
        }
      }
    } catch {
      // CSS @media blocks already provide breakpoint values; labels are optional.
    }
  }

  // Grid JSON: grid column variable metadata if CSS didn't provide.
  const gridJsonPath = join(tokensDir, 'grid-token.json');
  if (existsSync(gridJsonPath)) {
    try {
      const json = JSON.parse(readFileSync(gridJsonPath, 'utf-8'));
      const prefix = json.variablePrefix || 'o-r-grid';
      const maxCol = json.maxColumnCount || 24;
      for (let n = 1; n <= maxCol; n++) {
        const varName = `--${prefix}-${n}`;
        if (!registry.metadata.has(varName)) {
          registry.metadata.set(varName, {
            category: 'responsive-grid',
            name: `Grid ${n} columns`,
            description: `Width of ${n} grid columns`,
            type: 'grid',
            typeName: '栅格',
          });
        }
      }
    } catch {
      // CSS already defines grid variables; metadata is optional.
    }
  }
}

// ---------------------------------------------------------------------------
// Breakpoint label mapping
// ---------------------------------------------------------------------------

/**
 * Map a raw @media query string to a readable label.
 * Fallback: JSON breakpoint match → CSS section label → raw media string.
 */
export function labelForMedia(media, sectionLabel, breakpoints) {
  if (!media) {
    const bpNoMedia = breakpoints.find((b) => !b.media);
    if (bpNoMedia && bpNoMedia.label) return bpNoMedia.label;
    return sectionLabel || 'base';
  }
  for (const bp of breakpoints) {
    if (bp.media && bp.media === media) return bp.label || media;
  }
  const normalized = media.replace(/^screen and\s+/i, '');
  for (const bp of breakpoints) {
    if (bp.media && bp.media === normalized) return bp.label || media;
  }
  if (sectionLabel) return sectionLabel;
  return media;
}
