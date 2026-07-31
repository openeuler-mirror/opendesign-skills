/**
 * 值 → Token 反向映射。
 *
 * 所有映射从 @opensig/opendesign-token 的 CSS 产物动态构建，
 * 永远与实际包版本同步——无硬编码映射表。
 *
 * 两张反向表：
 *   colorReverseMap:  "r,g,b"  →  [tokenNames]  （颜色 RGB 反查）
 *   valueReverseMap:  "16px"   →  [tokenNames]  （尺寸/时长/缓动/阴影等）
 *
 * 反查后调用 lookupToken 校验 token 真实存在。
 */

import { lookupToken, getMetadata } from './lookup.mjs';

// ---------------------------------------------------------------------------
// 工具：RGB 解析
// ---------------------------------------------------------------------------

/**
 * 将十六进制颜色解析为 [r, g, b]。
 * 支持 #RGB 和 #RRGGBB。
 */
export function hexToRgb(hex) {
  let h = hex.replace(/^#/, '');
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  if (h.length !== 6) return null;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return [r, g, b];
}

/**
 * 解析各种颜色输入（hex / rgb() / rgba()）为 { rgb, alpha }。
 * rgb 为 [r, g, b]，alpha 缺省为 1。
 */
export function parseColorInput(str) {
  const s = str.trim();

  // #hex
  if (s.startsWith('#')) {
    const rgb = hexToRgb(s);
    if (rgb) return { rgb, alpha: 1 };
    return null;
  }

  // rgb(r, g, b) / rgb(r,g,b)
  const rgbMatch = s.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    const alpha = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;
    return { rgb: [r, g, b], alpha };
  }

  // rgb(r g b / a) — modern space-separated syntax
  const rgbSpaceMatch = s.match(/^rgba?\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(?:\/\s*([\d.]+)\s*)?\)$/i);
  if (rgbSpaceMatch) {
    const r = parseInt(rgbSpaceMatch[1], 10);
    const g = parseInt(rgbSpaceMatch[2], 10);
    const b = parseInt(rgbSpaceMatch[3], 10);
    const alpha = rgbSpaceMatch[4] !== undefined ? parseFloat(rgbSpaceMatch[4]) : 1;
    return { rgb: [r, g, b], alpha };
  }

  return null;
}

function rgbKey(rgb) {
  return `${rgb[0]},${rgb[1]},${rgb[2]}`;
}

/**
 * 判断 CSS 值字符串是否为 RGB 元组（如 "255, 255, 255"）。
 */
function isRgbTuple(value) {
  return /^\d+,\s*\d+,\s*\d+$/.test(value.trim());
}

function parseRgbTuple(value) {
  const parts = value.trim().split(',').map((s) => parseInt(s.trim(), 10));
  if (parts.length === 3 && parts.every((n) => !isNaN(n))) {
    return parts;
  }
  return null;
}

// ---------------------------------------------------------------------------
// 引用解析（var(--o-x) 链追踪）
// ---------------------------------------------------------------------------

/**
 * 追踪 var(--o-x) 引用链，返回最终值。
 * 用于将语义 token（如 --o-color-primary1: var(--o-kleinblue-6)）
 * 解析为其底层 RGB 值。
 *
 * visited 防止循环引用。
 */
function resolveReference(registry, value, theme, mode, visited = new Set()) {
  if (!value) return null;

  const v = value.trim();

  // 已经是 RGB 元组 → 直接返回。
  if (isRgbTuple(v)) {
    return { type: 'rgb', rgb: parseRgbTuple(v) };
  }

  // var(--o-x) → 递归解析。
  const varRef = v.match(/^var\(\s*(--o-[a-z0-9_-]+)\s*(?:,[^)]*)?\)$/i);
  if (varRef) {
    const refName = varRef[1];
    if (visited.has(refName)) return null;
    visited.add(refName);
    const lookup = lookupToken(registry, refName, theme, mode);
    if (!lookup.exists) return null;
    return resolveReference(registry, lookup.value, theme, mode, visited);
  }

  // rgb(var(--o-x)) → 解析内部引用后包装。
  const rgbVarRef = v.match(/^rgb\(var\(\s*(--o-[a-z0-9_-]+)\s*\)\)$/i);
  if (rgbVarRef) {
    const refName = rgbVarRef[1];
    if (visited.has(refName)) return null;
    visited.add(refName);
    const lookup = lookupToken(registry, refName, theme, mode);
    if (!lookup.exists) return null;
    const inner = resolveReference(registry, lookup.value, theme, mode, visited);
    if (inner && inner.type === 'rgb') return inner;
  }

  // rgba(var(--o-x), alpha) → 解析内部引用，取 RGB（alpha 忽略）。
  // 匹配 --o-color-info1: rgba(var(--o-mixedgray-14), 1.0)
  // 匹配 --o-color-control1: rgba(var(--o-mixedgray-14), 0.25)
  const rgbaVarRef = v.match(/^rgba\(var\(\s*(--o-[a-z0-9_-]+)\s*\)\s*,\s*[\d.]+\)$/i);
  if (rgbaVarRef) {
    const refName = rgbaVarRef[1];
    if (visited.has(refName)) return null;
    visited.add(refName);
    const lookup = lookupToken(registry, refName, theme, mode);
    if (!lookup.exists) return null;
    const inner = resolveReference(registry, lookup.value, theme, mode, visited);
    if (inner && inner.type === 'rgb') return inner;
  }

  // rgba(var(--o-x)) → 无显式 alpha（等价 alpha=1）。
  const rgbaVarOnlyRef = v.match(/^rgba\(var\(\s*(--o-[a-z0-9_-]+)\s*\)\)$/i);
  if (rgbaVarOnlyRef) {
    const refName = rgbaVarOnlyRef[1];
    if (visited.has(refName)) return null;
    visited.add(refName);
    const lookup = lookupToken(registry, refName, theme, mode);
    if (!lookup.exists) return null;
    const inner = resolveReference(registry, lookup.value, theme, mode, visited);
    if (inner && inner.type === 'rgb') return inner;
  }

  // 非颜色值 → 返回原始值。
  return { type: 'other', value: v };
}

// ---------------------------------------------------------------------------
// 反向表构建
// ---------------------------------------------------------------------------

/**
 * 语义优先级排序：
 * 1. --o-color-*  (语义颜色)
 * 2. --o-r-*      (响应式)
 * 3. --o-gap-*, --o-font_size-*, --o-radius-*, --o-control_size-* 等 (语义尺寸)
 * 4. --o-kleinblue-*, --o-green-* 等 (调色板)
 * 5. --o-white, --o-black (基础色)
 */
function tokenPriority(name) {
  // Semantic colors: sub-prioritize by usage frequency
  if (name.startsWith('--o-color-')) {
    // Base colors (white/black) are rarely used directly → lowest
    if (name === '--o-color-white' || name === '--o-color-black') return 5;
    // Border/link/mask colors are less commonly the intended match
    if (name.startsWith('--o-color-control')) return 2;
    if (name.startsWith('--o-color-link')) return 2;
    if (name.startsWith('--o-color-mask')) return 2;
    // Fill, primary, success, warning, danger, info → highest
    return 0;
  }
  if (name.startsWith('--o-r-')) return 1;
  if (
    name.startsWith('--o-gap-') ||
    name.startsWith('--o-font_size-') ||
    name.startsWith('--o-line_height-') ||
    name.startsWith('--o-radius') ||
    name.startsWith('--o-control_size-') ||
    name.startsWith('--o-icon_size') ||
    name.startsWith('--o-shadow-') ||
    name.startsWith('--o-duration-') ||
    name.startsWith('--o-easing-') ||
    name.startsWith('--o-font_weight') ||
    name.startsWith('--o-font_family')
  ) return 2;
  if (name.startsWith('--o-white') || name.startsWith('--o-black')) return 4;
  return 3; // 调色板
}

function sortByPriority(tokenNames) {
  return [...tokenNames].sort((a, b) => {
    const pa = tokenPriority(a);
    const pb = tokenPriority(b);
    if (pa !== pb) return pa - pb;
    return a.localeCompare(b);
  });
}

/**
 * 构建颜色反向表：RGB → [tokenNames]。
 * 包含直接 RGB 元组和通过 var() 引用解析出的 RGB。
 */
export function buildColorReverseMap(registry, { theme, mode } = {}) {
  const map = new Map(); // "r,g,b" → Set<tokenName>

  const themeData = registry.themes[theme];
  if (!themeData) return map;

  for (const modeVars of [themeData.light, themeData.dark]) {
    if (!modeVars) continue;
    for (const [tokenName, value] of modeVars) {
      // 直接 RGB 元组。
      if (isRgbTuple(value)) {
        const rgb = parseRgbTuple(value);
        if (rgb) {
          const key = rgbKey(rgb);
          if (!map.has(key)) map.set(key, new Set());
          map.get(key).add(tokenName);
        }
        continue;
      }
      // var(--o-x) 或 rgb(var(--o-x)) → 解析引用链。
      if (value.includes('var(')) {
        const resolved = resolveReference(registry, value, theme, mode);
        if (resolved && resolved.type === 'rgb') {
          const key = rgbKey(resolved.rgb);
          if (!map.has(key)) map.set(key, new Set());
          map.get(key).add(tokenName);
        }
      }
    }
  }

  // Sort by priority.
  const sorted = new Map();
  for (const [key, names] of map) {
    sorted.set(key, sortByPriority([...names]));
  }
  return sorted;
}

/**
 * 构建值反向表：valueString → [tokenNames]。
 * 涵盖尺寸、时长、缓动、阴影、字体族等非颜色值，
 * 以及 rgb(var(--o-x)) / rgba(var(--o-x), alpha) 这类复合值。
 */
export function buildValueReverseMap(registry, { theme, mode } = {}) {
  const map = new Map(); // valueString → Set<tokenName>

  const themeData = registry.themes[theme];
  if (themeData) {
    for (const modeVars of [themeData.light, themeData.dark]) {
      if (!modeVars) continue;
      for (const [tokenName, value] of modeVars) {
        // 跳过纯 RGB 元组（由 colorReverseMap 处理）。
        if (isRgbTuple(value)) continue;
        // 跳过 var(--o-x) 单引用（已由 colorReverseMap 解析）。
        if (/^var\(\s*--o-[a-z0-9_-]+\s*\)$/i.test(value)) continue;
        // 保留所有其他值（含 rgb(var(...)), rgba(var(...), a), 16px, cubic-bezier(...) 等）。
        const key = value.trim();
        if (!map.has(key)) map.set(key, new Set());
        map.get(key).add(tokenName);
      }
    }
  }

  // 响应式 token：使用 Desktop（最大断点）值。
  for (const [tokenName, entries] of registry.responsive) {
    if (!entries || entries.length === 0) continue;
    // Desktop 值通常是最后一个 @media 条目（min-width: 1681px）。
    // 回退到 base (media=null) 或第一个条目。
    const desktop =
      entries.find((e) => e.media && /1681/.test(e.media)) ||
      entries.find((e) => e.media === null) ||
      entries[entries.length - 1];
    if (desktop && desktop.value) {
      const key = desktop.value.trim();
      // 跳过 RGB 元组。
      if (!isRgbTuple(key)) {
        if (!map.has(key)) map.set(key, new Set());
        map.get(key).add(tokenName);
      }
    }
  }

  // Sort by priority.
  const sorted = new Map();
  for (const [key, names] of map) {
    sorted.set(key, sortByPriority([...names]));
  }
  return sorted;
}

// ---------------------------------------------------------------------------
// 值 → Token 转换
// ---------------------------------------------------------------------------

/**
 * 容差匹配：在 colorReverseMap 中查找最接近的 RGB 值。
 */
function findWithTolerance(rgb, colorMap, tolerance) {
  const exactKey = rgbKey(rgb);
  if (colorMap.has(exactKey)) {
    return colorMap.get(exactKey);
  }
  if (tolerance > 0) {
    let best = null;
    let bestDist = Infinity;
    for (const [key, names] of colorMap) {
      const [r, g, b] = key.split(',').map(Number);
      const dist = Math.abs(r - rgb[0]) + Math.abs(g - rgb[1]) + Math.abs(b - rgb[2]);
      if (dist <= tolerance * 3 && dist < bestDist) {
        bestDist = dist;
        best = names;
      }
    }
    return best;
  }
  return null;
}

/**
 * 将颜色值转换为 token 引用。
 * 输入：#FFFFFF, rgb(255,0,0), rgba(0,0,0,0.25) 等。
 */
export function convertColor(value, registry, opts = {}) {
  const { theme = 'e', mode = 'light', tolerance = 5 } = opts;
  const parsed = parseColorInput(value);
  if (!parsed) return null;

  const colorMap = buildColorReverseMap(registry, { theme, mode });

  // 有 alpha 且非 1 → 优先查 valueReverseMap（如 rgba(var(--o-mixedgray-14), 0.25)）。
  if (parsed.alpha !== 1) {
    const valueMap = buildValueReverseMap(registry, { theme, mode });
    // 尝试精确匹配完整 rgba 字符串。
    const normalized = `rgba(${parsed.rgb[0]}, ${parsed.rgb[1]}, ${parsed.rgb[2]}, ${parsed.alpha})`;
    const candidates = [
      normalized,
      `rgba(${parsed.rgb.join(',')},${parsed.alpha})`,
    ];
    for (const candidate of candidates) {
      if (valueMap.has(candidate)) {
        return makeResult(value, 'color', parsed.rgb, valueMap.get(candidate), registry, opts);
      }
    }
    // 也尝试在 colorMap 中按 RGB 匹配（忽略 alpha）。
  }

  // 按 RGB 元组匹配。
  const matches = findWithTolerance(parsed.rgb, colorMap, tolerance);
  if (matches && matches.length > 0) {
    return makeResult(value, 'color', parsed.rgb, matches, registry, opts);
  }

  return {
    input: value,
    type: 'color',
    rgb: parsed.rgb,
    alpha: parsed.alpha,
    matches: [],
    validated: false,
  };
}

/**
 * 将普通值（尺寸、时长、缓动、阴影等）转换为 token 引用。
 * 输入：16px, 200ms, cubic-bezier(0.2,0,0,1), 0 3px 8px rgba(...) 等。
 */
export function convertValue(value, registry, opts = {}) {
  const { theme = 'e', mode = 'light' } = opts;
  const valueMap = buildValueReverseMap(registry, { theme, mode });

  const v = value.trim();
  if (valueMap.has(v)) {
    return makeResult(value, 'value', null, valueMap.get(v), registry, opts);
  }

  // 尝试宽容匹配：去掉多余空格。
  const normalized = v.replace(/\s+/g, ' ');
  if (normalized !== v && valueMap.has(normalized)) {
    return makeResult(value, 'value', null, valueMap.get(normalized), registry, opts);
  }

  return {
    input: value,
    type: 'value',
    matches: [],
    validated: false,
  };
}

/**
 * 智能转换：先尝试颜色，再尝试普通值。
 */
export function convertDesignValue(value, registry, opts = {}) {
  // 颜色输入特征：# 或 rgb/rgba。
  // 如果输入是颜色格式，始终返回颜色结果（即使无匹配，也保留 RGB 信息）。
  if (value.includes('#') || /^rgba?\(/i.test(value)) {
    const result = convertColor(value, registry, opts);
    if (result) return result;
  }

  // 普通值。
  const result = convertValue(value, registry, opts);
  if (result && result.matches.length > 0) return result;

  // 颜色 fallback（非颜色格式的输入也尝试作为颜色解析）。
  if (!value.includes('#') && !/^rgba?\(/i.test(value)) {
    const colorResult = convertColor(value, registry, opts);
    if (colorResult && colorResult.matches.length > 0) return colorResult;
  }

  return {
    input: value,
    type: 'unknown',
    matches: [],
    validated: false,
  };
}

// ---------------------------------------------------------------------------
// 校验
// ---------------------------------------------------------------------------

/**
 * 校验 token 名是否真实存在于注册表中。
 * 使用 lookupToken 进行权威校验。
 */
export function validateToken(tokenName, registry, opts = {}) {
  const { theme = 'e', mode = 'light' } = opts;
  const lookup = lookupToken(registry, tokenName, theme, mode);
  const meta = getMetadata(registry, tokenName);
  return {
    token: tokenName,
    exists: lookup.exists,
    value: lookup.value || null,
    scope: lookup.scope || null,
    note: lookup.note || null,
    category: meta?.category || null,
    name: meta?.name || null,
    description: meta?.description || null,
  };
}

// ---------------------------------------------------------------------------
// 结果组装
// ---------------------------------------------------------------------------

function makeResult(input, type, rgb, tokenNames, registry, opts = {}) {
  const { theme = 'e', mode = 'light' } = opts;
  const matches = tokenNames.map((name) => {
    const v = validateToken(name, registry, { theme, mode });
    return {
      token: name,
      var: `var(${name})`,
      exists: v.exists,
      category: v.category,
      name: v.name,
      description: v.description,
      priority: tokenPriority(name),
    };
  });

  return {
    input,
    type,
    rgb,
    matches,
    validated: true,
  };
}
