/**
 * 共享基础设施：默认选项 + 注册表单例缓存 + 输出格式化。
 *
 * getRegistry() 在同一进程内缓存注册表，避免重复解析 CSS。
 */

import { defaultCacheDir, resolvePackage } from './package-resolver.mjs';
import { buildTokenRegistry } from './registry.mjs';

// ---------------------------------------------------------------------------
// 默认选项
// ---------------------------------------------------------------------------

export function createDefaultOpts() {
  return {
    searchBase: null,
    cacheDir: defaultCacheDir(),
    theme: 'e',
    mode: 'light',
    json: false,
    offline: false,
    strict: false,
    suggest: true,
    verbose: false,
    versionFlag: null,
    // Filled by resolvePackage inside getRegistry:
    _resolvedExtractDir: null,
    _resolvedVersion: null,
    _resolvedSource: null,
  };
}

// ---------------------------------------------------------------------------
// 注册表单例缓存
// ---------------------------------------------------------------------------

let _registryCache = null;

/**
 * Get (or build) the token registry for the given opts.
 * Cached by extractDir — different local installations get independent
 * registries (their CSS content may differ).
 */
export async function getRegistry(opts) {
  if (_registryCache && _registryCache._extractDir === opts._resolvedExtractDir) {
    return _registryCache;
  }
  const pkg = await resolvePackage(opts);
  opts._resolvedExtractDir = pkg.extractDir;
  opts._resolvedVersion = pkg.version;
  opts._resolvedSource = pkg.source;
  const registry = await buildTokenRegistry(pkg.extractDir, pkg.version);
  registry._version = pkg.version;
  registry._extractDir = pkg.extractDir;
  registry._source = pkg.source;
  _registryCache = registry;
  return registry;
}

/**
 * Reset the registry cache (useful when switching themes/versions in tests).
 */
export function resetRegistryCache() {
  _registryCache = null;
}

// ---------------------------------------------------------------------------
// 输出格式化
// ---------------------------------------------------------------------------

/**
 * Format a raw CSS value for display.
 * Many color values are "R, G, B" tuples that need wrapping in rgb().
 */
export function fmtValue(raw) {
  if (!raw) return '';
  if (/^\d+,\s*\d+,\s*\d+(?:,\s*[\d.]+)?$/.test(raw)) {
    return `rgb(${raw})`;
  }
  return raw;
}

/**
 * Format a scope string for display.
 */
export function fmtScope(scope) {
  if (!scope) return '';
  if (scope === 'responsive') return 'responsive';
  if (scope.includes('.')) return `theme ${scope}`;
  return scope;
}
