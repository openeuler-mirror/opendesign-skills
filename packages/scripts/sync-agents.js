#!/usr/bin/env node

/**
 * @description 同步各 AI coding agent 目录/文件，执行：
 *   1. 确保 .agents/{dir} 存在
 *   2. 创建 .claude/{dir} → .agents/{dir} 的符号链接
 *   3. 将配置的源目录（如 packages/skills + 根目录 skills/）下的子目录注入 .agents/{dir}
 *   4. 将各 AGENTS.md → 对应 CLAUDE.md 的文件级符号链接
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline';

/** 项目根目录（本文件位于 packages/scripts/，需上溯两级） */
const ROOT = path.resolve(import.meta.dirname, '..', '..');

/**
 * @description 需要同步的子目录名列表，后续新增只需追加即可
 *   这些名称既是 .agents/ 下的子目录名，也是 .claude/ 下的子目录名
 * @type {string[]}
 */
const SYNC_DIRS = ['skills'];

/**
 * @description 项目自编内容源目录映射：{ agents 子目录名 → 项目源目录相对路径 }
 *   支持字符串（单源）或字符串数组（多源，数组顺序即优先级，先出现的源优先）
 *   skills 同时同步两个源：
 *     - packages/skills：项目自编 skill（优先级高，同名子目录以此为准）
 *     - skills：根目录 skills/（补充源，覆盖 packages/skills 中未出现的子目录）
 *   未配置的 dirName 回退为同名目录（保持向后兼容）
 * @type {Record<string, string | string[]>}
 */
const PROJECT_SRC_MAP = { skills: ['packages/skills', 'skills'] };

/**
 * @description 规范化源目录配置为字符串数组
 * @param {string} dirName - 同步的子目录名（如 skills）
 * @returns {string[]} 源目录相对路径列表（按优先级降序）
 */
function normalizeSrcList(dirName) {
  const mapped = PROJECT_SRC_MAP[dirName];
  if (mapped === undefined) return [dirName];
  return Array.isArray(mapped) ? mapped : [mapped];
}

/**
 * @description agent 源目录名（存放互联网下载 + 项目注入的内容）
 *   各 AI coding agent 通过符号链接指向此目录下的子目录
 */
const AGENTS_DIR_NAME = '.agents';

/**
 * @description Claude Code 的目录名，其子目录通过符号链接指向 AGENTS_DIR_NAME
 */
const CLAUDE_DIR_NAME = '.claude';

// ─── 符号链接工具 ────────────────────────────────────────────

/**
 * @description 获取链接路径当前的 lstat，不存在返回 null
 * @param {string} linkPath - 要检查的路径（绝对路径）
 * @returns {fs.Stats | null} lstat 结果，ENOENT 时返回 null
 */
function readLinkStat(linkPath) {
  try {
    return fs.lstatSync(linkPath);
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

/**
 * @description 删除链接路径上的现有条目（symlink / 目录 / 文件均可）
 * @param {fs.Stats} stat - lstat 结果，用于判断删除策略
 * @param {string} linkPath - 要删除的路径（绝对路径）
 */
function removeExistingEntry(stat, linkPath) {
  if (stat.isSymbolicLink() || stat.isFile()) {
    fs.unlinkSync(linkPath);
  } else if (stat.isDirectory()) {
    fs.rmSync(linkPath, { recursive: true, force: true });
  }
}

/**
 * @description 判断已有符号链接是否指向预期目标
 *   dangling symlink（目标已不存在）时 realpathSync 抛 ENOENT，视为链接不正确
 *   使用 realpathSync 同时解析 linkPath 和 absTarget，正确处理父目录含符号链接的情况
 * @param {string} linkPath - 符号链接路径（绝对路径）
 * @param {string} absTarget - 预期目标路径（必须为绝对路径）
 * @returns {boolean} 已指向正确目标则返回 true
 */
function isSymlinkCorrect(linkPath, absTarget) {
  try {
    return fs.realpathSync(linkPath) === fs.realpathSync(absTarget);
  } catch (err) {
    if (err.code === 'ENOENT') return false;
    throw err;
  }
}

/**
 * @description 交互式确认覆盖真实文件
 *   非交互环境（stdin 非 TTY，如 git hook 管道）下默认拒绝，避免阻塞
 * @param {string} filePath - 待覆盖的文件路径
 * @returns {Promise<boolean>} 用户确认覆盖则返回 true
 */
async function confirmOverwrite(filePath) {
  if (!process.stdin.isTTY) {
    console.warn(`[sync-agents] 检测到真实文件（非符号链接），非交互环境下跳过: ${filePath}`);
    return false;
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    return await new Promise((resolve) => {
      rl.question(`[sync-agents] ${filePath} 是真实文件，是否覆盖为符号链接？(y/N) `, (answer) => {
        resolve(/^y(es)?$/i.test(answer.trim()));
      });
    });
  } finally {
    rl.close();
  }
}

/**
 * @description 安全创建符号链接，处理已存在目录 / 链接 / dangling symlink 等边界条件
 *   target 可能是相对路径（Unix）或绝对路径（Windows）：
 *     - symlinkSync 用原始 target（相对路径在链接所在目录下解析，项目整体搬迁后仍有效）
 *     - 存在性 / 正确性检查用 absTarget（绝对路径，避免 cwd 干扰）
 *   源路径不存在时，若 linkPath 上已有失效链接/文件，会先清理再跳过
 * @param {string} target - 符号链接指向的源路径（Unix 为相对路径，Windows 为绝对路径）
 * @param {string} linkPath - 要创建的符号链接路径（绝对路径）
 * @param {'dir'|'file'} kind - 链接类型，目录用 'dir'，文件用 'file'
 */
function ensureSymlink(target, linkPath, kind = 'dir') {
  // target 可能是相对路径（Unix）——检查时按链接所在目录解析为绝对路径
  const absTarget = path.isAbsolute(target)
    ? target
    : path.resolve(path.dirname(linkPath), target);

  // 源路径不存在：清理已有失效链接后跳过
  if (!fs.existsSync(absTarget)) {
    const existingStat = readLinkStat(linkPath);
    if (existingStat) {
      removeExistingEntry(existingStat, linkPath);
      console.warn(`[sync-agents] 源路径不存在，已清理失效链接: ${linkPath}`);
    } else {
      console.warn(`[sync-agents] 源路径不存在，跳过: ${absTarget}`);
    }
    return;
  }

  const stat = readLinkStat(linkPath);

  // 路径不存在 → 直接创建
  if (!stat) {
    fs.mkdirSync(path.dirname(linkPath), { recursive: true });
    createSymlink(target, linkPath, kind);
    return;
  }

  // 已是正确的符号链接 → 无需操作
  if (stat.isSymbolicLink() && isSymlinkCorrect(linkPath, absTarget)) {
    return;
  }

  // 其他情况（错误链接 / 真实目录 / 文件）→ 删除后重建
  removeExistingEntry(stat, linkPath);
  createSymlink(target, linkPath, kind);
}

/**
 * @description 创建符号链接并打印日志
 *   目录链接：Windows 用 junction，Unix 用 dir
 *   文件链接：Windows 用 file，Unix 也用 file
 * @param {string} target - 链接目标路径
 * @param {string} linkPath - 链接路径
 * @param {'dir'|'file'} kind - 链接类型，目录用 'dir'，文件用 'file'
 */
function createSymlink(target, linkPath, kind = 'dir') {
  let linkType;
  if (kind === 'file') {
    linkType = 'file';
  } else {
    linkType = process.platform === 'win32' ? 'junction' : 'dir';
  }
  fs.symlinkSync(target, linkPath, linkType);
  console.log(`[sync-agents] 创建链接: ${linkPath} → ${target}`);
}

// ─── 同步单个子目录 ──────────────────────────────────────────

/**
 * @description 计算源目录下某个子目录的链接目标路径
 *   Windows junction 需绝对路径，Unix symlink 用相对路径更健壮
 * @param {string} dirName - 同步的子目录名（如 skills），用于定位 .agents 下的链接位置
 * @param {string} srcDirName - 源目录相对路径（如 packages/skills 或 skills）
 * @param {string} subName - 源目录下的子目录名
 * @returns {string} 链接应指向的目标路径
 */
function computeLinkTarget(dirName, srcDirName, subName) {
  const srcSubPath = path.join(ROOT, srcDirName, subName);
  if (process.platform === 'win32') return srcSubPath;

  const agentsSubPath = path.join(ROOT, AGENTS_DIR_NAME, dirName, subName);
  return path.relative(path.dirname(agentsSubPath), srcSubPath);
}

/**
 * @description 扫描所有源目录的子目录，逐个在 .agents/{dir} 创建符号链接
 *   多源场景下按优先级（数组顺序）合并，先出现的源优先（first-wins）：
 *   同名子目录只采用第一个包含它的源，后续源不覆盖
 *   已有但指向失效目标的链接会被 ensureSymlink 修正为当前选定的源
 * @param {string} dirName - 同步的子目录名（如 skills）
 */
function injectProjectSubs(dirName) {
  const srcDirNames = normalizeSrcList(dirName);
  /** @type {Map<string, string>} subName → srcDirName（first-wins） */
  const subToSrc = new Map();

  for (const srcDirName of srcDirNames) {
    const srcDir = path.join(ROOT, srcDirName);
    if (!fs.existsSync(srcDir)) continue;

    const subDirs = fs
      .readdirSync(srcDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const subName of subDirs) {
      if (!subToSrc.has(subName)) {
        subToSrc.set(subName, srcDirName);
      }
    }
  }

  for (const [subName, srcDirName] of subToSrc) {
    const linkTarget = computeLinkTarget(dirName, srcDirName, subName);
    const linkPath = path.join(ROOT, AGENTS_DIR_NAME, dirName, subName);
    ensureSymlink(linkTarget, linkPath);
  }
}

/**
 * @description 清理 .agents/{dir} 下的失效符号链接（dangling symlinks）
 *   仅清理目标已不存在的符号链接，保留：
 *     - 真实目录（如 skills install 安装的 nuxt/pinia 等）
 *     - 指向有效目标的符号链接（即使不在源映射中，可能是手动创建的）
 * @param {string} dirName - 同步的子目录名（如 skills）
 */
function cleanupDanglingLinks(dirName) {
  const agentsDir = path.join(ROOT, AGENTS_DIR_NAME, dirName);
  if (!fs.existsSync(agentsDir)) return;

  const entries = fs.readdirSync(agentsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isSymbolicLink()) continue;

    const linkPath = path.join(agentsDir, entry.name);
    try {
      fs.realpathSync(linkPath);
      // 目标存在，不是 dangling，跳过
    } catch (err) {
      if (err.code === 'ENOENT') {
        fs.unlinkSync(linkPath);
        console.warn(`[sync-agents] 清理失效链接: ${linkPath}`);
      } else {
        throw err;
      }
    }
  }
}

/**
 * @description 对单个子目录执行完整同步：确保目录存在 → 链接到 .claude → 注入源 → 清理失效链接
 * @param {string} dirName - 同步的子目录名（如 skills）
 */
function syncDir(dirName) {
  const agentsDir = path.join(ROOT, AGENTS_DIR_NAME, dirName);
  const claudeDir = path.join(ROOT, CLAUDE_DIR_NAME, dirName);

  // 确保 {AGENTS_DIR_NAME}/{dir} 存在
  if (!fs.existsSync(agentsDir)) {
    fs.mkdirSync(agentsDir, { recursive: true });
    console.log(`[sync-agents] 创建目录: ${AGENTS_DIR_NAME}/${dirName}`);
  }

  // {CLAUDE_DIR_NAME}/{dir} → {AGENTS_DIR_NAME}/{dir}
  ensureSymlink(agentsDir, claudeDir);

  // 源目录子目录注入 {AGENTS_DIR_NAME}/{dir}
  injectProjectSubs(dirName);

  // 清理 .agents/{dir} 下的失效符号链接
  cleanupDanglingLinks(dirName);
}

// ─── 同步项目内所有 AGENTS.md → 同目录 CLAUDE.md 文件级符号链接 ──────

/**
 * @description 全局匹配 AGENTS.md 时需要跳过的目录名（非点号开头的依赖/构建产物目录）
 *   所有以 "." 开头的目录（.git/.idea/.agents/.claude/.vscode 等）在 exclude 中统一跳过，
 *   无需逐一列举
 * @type {Set<string>}
 */
const SKIP_DIRS = new Set(['node_modules', 'dist']);

/**
 * @description 全局匹配项目内所有 AGENTS.md 文件，在其同目录下创建 CLAUDE.md 符号链接
 *   target 始终为同目录下的 CLAUDE.md，无需手工维护配置
 *   使用 Node 内置 fs.globSync（v22+，本项目 Node 24 已稳定），
 *   默认 symbolic:false 不跟随符号链接，天然避免进入 .agents/.claude 造成循环
 *   exclude 规则：路径中任意目录段以 "." 开头（所有隐藏目录）或在 SKIP_DIRS 中
 */
const agentsMdFiles = fs
  .globSync('**/AGENTS.md', {
    cwd: ROOT,
    exclude: (relativePath) =>
      relativePath.split(/[\\/]/).some((seg) => seg.startsWith('.') || SKIP_DIRS.has(seg)),
  })
  .map((rel) => path.join(ROOT, rel));

for (const sourcePath of agentsMdFiles) {
  const targetPath = path.join(path.dirname(sourcePath), 'CLAUDE.md');
  // 文件符号链接：Windows 用绝对路径，Unix 用相对路径更健壮
  const linkTarget = process.platform === 'win32' ? sourcePath : path.relative(path.dirname(targetPath), sourcePath);

  // 真实文件（非符号链接）需用户确认后再覆盖
  const existingStat = readLinkStat(targetPath);
  if (existingStat && existingStat.isFile() && !existingStat.isSymbolicLink()) {
    const shouldOverwrite = await confirmOverwrite(targetPath);
    if (!shouldOverwrite) {
      console.log(`[sync-agents] 用户跳过，保留真实文件: ${targetPath}`);
      continue;
    }
  }

  ensureSymlink(linkTarget, targetPath, 'file');
}

// ─── 主流程 ──────────────────────────────────────────────────

for (const dirName of SYNC_DIRS) {
  syncDir(dirName);
}
console.log('[sync-agents] ✅ 同步完成');
