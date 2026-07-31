/**
 * npm 包解析：本地查找 + npm 下载 + 缓存。
 *
 * 优先级：
 * 1. --version <ver> → 下载/缓存该精确版本
 * 2. 本地 node_modules（从 searchBase 逐层向上查找）→ 直接使用
 * 3. --offline + 已缓存版本 → 使用缓存中的最高版本
 * 4. 兜底 → 从 npm registry 下载 latest
 *
 * 零外部依赖（仅用 Node.js ≥ 18 内置模块）。
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { gunzipSync } from 'node:zlib';

// ---------------------------------------------------------------------------
// 常量（registry.mjs 也需要 THEMES / THEME_JSON_NAME / MODE_FILE_SUFFIX）
// ---------------------------------------------------------------------------

export const PACKAGE_NAME = '@opensig/opendesign-token';
export const REGISTRY_BASE = 'https://registry.npmjs.org';
export const THEMES = ['e', 'a', 'k', 'm', 'g', 'u'];
export const THEME_JSON_NAME = {
  e: 'openeuler',
  a: 'ascend',
  k: 'kunpeng',
  m: 'mindspore',
  g: 'opengauss',
  u: 'openubmc',
};
// themes/ 目录下 light/dark CSS 文件名后缀（v0.0.5+ 扁平布局）。
export const MODE_FILE_SUFFIX = { light: 'light', dark: 'dark' };

// ---------------------------------------------------------------------------
// 缓存管理
// ---------------------------------------------------------------------------

export function defaultCacheDir() {
  const home = homedir();
  if (process.platform === 'win32') {
    return join(home, 'AppData', 'Local', 'opendesign-token-cache');
  }
  return join(home, '.cache', 'opendesign-token-cache');
}

export function cacheVersionDir(cacheDir, version) {
  return join(cacheDir, version);
}

export function listCachedVersions(cacheDir) {
  if (!existsSync(cacheDir)) return [];
  return readdirSync(cacheDir).filter((entry) => {
    const p = join(cacheDir, entry, 'package', 'package.json');
    return existsSync(p);
  });
}

export function compareSemver(a, b) {
  const pa = a.split('.').map((n) => parseInt(n, 10) || 0);
  const pb = b.split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const va = pa[i] || 0;
    const vb = pb[i] || 0;
    if (va !== vb) return va - vb;
  }
  return 0;
}

// ---------------------------------------------------------------------------
// 本地包查找（monorepo-aware）
// ---------------------------------------------------------------------------

/**
 * 从 `searchFrom` 起逐层向上查找本地安装的 @opensig/opendesign-token。
 * 支持普通项目、monorepo（提升）、pnpm（符号链接）、包自身仓库。
 * 返回包根目录或 null。
 */
export function findLocalPackage(searchFrom) {
  let dir = resolve(searchFrom);
  for (let i = 0; i < 30; i++) {
    const nmPath = join(dir, 'node_modules', PACKAGE_NAME);
    const pkgJsonPath = join(nmPath, 'package.json');
    const themesPath = join(nmPath, 'themes');
    if (existsSync(pkgJsonPath) && existsSync(themesPath)) {
      return nmPath;
    }
    // Check if current dir is the package itself (dev scenario).
    const selfPkgJson = join(dir, 'package.json');
    const selfThemes = join(dir, 'themes');
    if (existsSync(selfPkgJson) && existsSync(selfThemes)) {
      try {
        const pkg = JSON.parse(readFileSync(selfPkgJson, 'utf-8'));
        if (pkg.name === PACKAGE_NAME) return dir;
      } catch {
        // package.json unreadable, continue upward.
      }
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

// ---------------------------------------------------------------------------
// 包解析
// ---------------------------------------------------------------------------

/**
 * Resolve which package source to use.
 * Returns { extractDir, version, source }.
 * source: 'local' | 'cache' | 'download' | 'cache-or-download'
 */
export async function resolvePackage(opts) {
  const searchBase = opts.searchBase || process.cwd();

  // 1. --version flag: explicit override.
  if (opts.versionFlag) {
    const result = await ensurePackage(opts.versionFlag, opts.cacheDir, {
      offline: opts.offline,
    });
    return { ...result, source: 'cache-or-download' };
  }

  // 2. Local node_modules: preferred path (no network needed).
  const localPath = findLocalPackage(searchBase);
  if (localPath) {
    try {
      const pkg = JSON.parse(readFileSync(join(localPath, 'package.json'), 'utf-8'));
      return { extractDir: localPath, version: pkg.version, source: 'local' };
    } catch {
      // package.json unreadable, fall through to download.
    }
  }

  // 3. --offline: use highest cached version.
  if (opts.offline) {
    const cached = listCachedVersions(opts.cacheDir);
    if (cached.length === 0) {
      throw new Error(
        `--offline: no local ${PACKAGE_NAME} installation found near ${searchBase}, ` +
        `and cache is empty (${opts.cacheDir}). ` +
        `Run without --offline first to populate the cache, or install the package: npm install ${PACKAGE_NAME}`,
      );
    }
    cached.sort(compareSemver);
    const version = cached[cached.length - 1];
    const result = await ensurePackage(version, opts.cacheDir, { offline: true });
    return { ...result, source: 'cache' };
  }

  // 4. Fallback: download latest (or reuse cache).
  const result = await ensurePackage('latest', opts.cacheDir, { offline: false });
  return { ...result, source: 'download' };
}

async function resolveLatestVersion() {
  const url = `${REGISTRY_BASE}/${PACKAGE_NAME}/latest`;
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to fetch latest version from ${url} (HTTP ${resp.status})`);
  }
  const data = await resp.json();
  if (!data.version) {
    throw new Error(`Unexpected response from ${url}: missing "version" field`);
  }
  return data.version;
}

// ---------------------------------------------------------------------------
// Tarball download + minimal TAR extraction (pure JS, zero deps)
// ---------------------------------------------------------------------------

async function downloadTarball(version) {
  const url = `${REGISTRY_BASE}/${PACKAGE_NAME}/${version}`;
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(
      `Failed to fetch package metadata for ${PACKAGE_NAME}@${version} (HTTP ${resp.status})`,
    );
  }
  const data = await resp.json();
  if (!data.dist || !data.dist.tarball) {
    throw new Error(`No tarball URL in metadata for ${PACKAGE_NAME}@${version}`);
  }
  const tarballUrl = data.dist.tarball;
  const tbResp = await fetch(tarballUrl);
  if (!tbResp.ok) {
    throw new Error(`Failed to download tarball ${tarballUrl} (HTTP ${tbResp.status})`);
  }
  const buf = Buffer.from(await tbResp.arrayBuffer());
  return buf;
}

/**
 * Minimal ustar TAR extractor. Handles regular files, directories,
 * PAX ('x') extended headers, and GNU long filename ('L') entries.
 */
function extractTarGz(buf, outDir) {
  const decompressed = gunzipSync(buf);
  let offset = 0;
  let pendingLongName = null;
  let pendingPax = null;
  const len = decompressed.length;

  while (offset + 512 <= len) {
    const header = decompressed.subarray(offset, offset + 512);
    // All-zero block = end of archive.
    if (header.every((b) => b === 0)) {
      offset += 512;
      continue;
    }
    const name = header.toString('utf8', 0, 100).replace(/\0[\s\S]*$/, '');
    const sizeStr = header
      .toString('utf8', 124, 136)
      .replace(/\0[\s\S]*$/, '')
      .trim();
    const size = parseInt(sizeStr || '0', 8);
    const type = String.fromCharCode(header[156] || 0x30); // '0' default
    offset += 512;
    if (offset + size > len) break;
    const content = decompressed.subarray(offset, offset + size);
    const dataBlocks = Math.ceil(size / 512) * 512;
    offset += dataBlocks;

    if (type === 'L') {
      // GNU long filename.
      pendingLongName = content.toString('utf8').replace(/\0[\s\S]*$/, '');
      continue;
    }
    if (type === 'x' || type === 'g') {
      // PAX extended header.
      pendingPax = parsePaxHeader(content.toString('utf8'), pendingPax || {});
      continue;
    }
    if (type === '5') {
      // Directory entry.
      const dirPath = join(outDir, pendingLongName || name);
      mkdirSync(dirPath, { recursive: true });
      pendingLongName = null;
      pendingPax = null;
      continue;
    }
    if (type === '0' || type === '\0' || type === '') {
      // Regular file.
      let finalName = pendingLongName || name;
      const paxPath = pendingPax && pendingPax.path;
      if (paxPath) finalName = paxPath;
      pendingLongName = null;
      pendingPax = null;
      if (!finalName) continue;
      const fullPath = join(outDir, finalName);
      mkdirSync(dirname(fullPath), { recursive: true });
      writeFileSync(fullPath, content);
      continue;
    }
    // Ignore other entry types (symlinks, etc.).
    pendingLongName = null;
    pendingPax = null;
  }
}

function parsePaxHeader(text, into) {
  const result = { ...into };
  let i = 0;
  while (i < text.length) {
    const spaceIdx = text.indexOf(' ', i);
    if (spaceIdx < 0) break;
    const lenStr = text.slice(i, spaceIdx);
    const recLen = parseInt(lenStr, 10);
    if (!recLen || recLen <= 0 || i + recLen > text.length) break;
    const record = text.slice(i + lenStr.length + 1, i + recLen).replace(/\n$/, '');
    const eqIdx = record.indexOf('=');
    if (eqIdx >= 0) {
      const k = record.slice(0, eqIdx);
      const v = record.slice(eqIdx + 1);
      if (k === 'path') result.path = v;
      else if (k === 'size') result.size = v;
      else result[k] = v;
    }
    i += recLen;
  }
  return result;
}

// ---------------------------------------------------------------------------
// 包获取：下载（或复用缓存）→ 解压
// ---------------------------------------------------------------------------

export async function ensurePackage(version, cacheDir, { offline }) {
  if (version === 'latest') {
    if (offline) {
      const cached = listCachedVersions(cacheDir);
      if (cached.length === 0) {
        throw new Error(
          `--offline requires a cached package, but cache is empty (${cacheDir}). Run without --offline first to populate.`,
        );
      }
      cached.sort(compareSemver);
      version = cached[cached.length - 1];
    } else {
      version = await resolveLatestVersion();
    }
  }

  const dir = cacheVersionDir(cacheDir, version);
  const sentinel = join(dir, 'package', 'package.json');
  if (existsSync(sentinel)) {
    return { extractDir: join(dir, 'package'), version };
  }
  if (offline) {
    throw new Error(
      `--offline: ${PACKAGE_NAME}@${version} not in cache (${dir}). Run without --offline first to populate.`,
    );
  }
  mkdirSync(dir, { recursive: true });
  const tarball = await downloadTarball(version);
  extractTarGz(tarball, dir);
  if (!existsSync(sentinel)) {
    throw new Error(
      `Package extraction did not produce expected structure at ${sentinel}. Version ${version} may not be a valid ${PACKAGE_NAME} release.`,
    );
  }
  return { extractDir: join(dir, 'package'), version };
}

/**
 * Clear the entire cache directory.
 */
export function clearCache(cacheDir) {
  if (!existsSync(cacheDir)) {
    return 0;
  }
  const entries = readdirSync(cacheDir);
  for (const entry of entries) {
    const p = join(cacheDir, entry);
    rmSync(p, { recursive: true, force: true });
  }
  return entries.length;
}
