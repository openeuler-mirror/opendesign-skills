#!/usr/bin/env node
/**
 * OpenDesign Token CLI — 统一入口。
 *
 * 命令：
 *   check <token>       校验单个 token 名是否真实存在
 *   scan <file|dir...>  扫描文件中的无效 var(--o-*) 用法
 *   list [pattern]       列出全部（或匹配 pattern 的）token
 *   info <token>         展示 token 详情（跨主题 light/dark + 响应式各断点）
 *   convert <value>      设计稿值 → token 反查（颜色 / 尺寸 / 时长 / 缓动 / 阴影）
 *   versions             列出可用版本
 *   clear-cache          清除本地缓存
 *
 * 选项（多数命令通用）：
 *   -V, --version <ver>  指定包版本
 *   -t, --theme <theme>  主题：e|a|k|m|g|u（默认 e）
 *   -m, --mode <mode>    模式：light|dark（默认 light）
 *       --json            输出 JSON
 *       --offline         仅用缓存
 *       --strict          scan 专用：无效 token 非零退出
 *       --no-suggest      不计算建议
 *   -v, --verbose         详细输出
 *   -h, --help            显示帮助
 *
 * convert 专用选项：
 *       --color           强制按颜色解析
 *       --value           强制按普通值解析
 *       --tolerance <n>   颜色容差（默认 5）
 *       --all             显示全部匹配（不只最佳）
 */

import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PACKAGE_NAME, REGISTRY_BASE, THEMES, listCachedVersions, clearCache } from './lib/package-resolver.mjs';
import { buildTokenRegistry, labelForMedia } from './lib/registry.mjs';
import { normalizeTokenName, lookupToken, getMetadata, findClosest } from './lib/lookup.mjs';
import { extractTokenUsages, collectFiles } from './lib/file-scan.mjs';
import { createDefaultOpts, getRegistry, fmtValue, fmtScope } from './lib/shared.mjs';
import { convertColor, convertValue, convertDesignValue, validateToken } from './lib/convert.mjs';

const SCAN_EXTENSIONS = ['.vue', '.css', '.scss', '.sass', '.less', '.ts', '.tsx', '.js', '.jsx', '.html', '.svelte'];

// ---------------------------------------------------------------------------
// 帮助
// ---------------------------------------------------------------------------

function showHelp() {
  console.log(`
OpenDesign Token CLI — 校验、列举、反查 @opensig/opendesign-token 的 CSS 变量

用法：
  node bin.mjs <命令> [参数] [选项]

命令：
  check <token>          校验单个 token 名（接受 "var(--o-x)"、"--o-x" 或 "x"）
  scan <file|dir...>     扫描文件中的 var(--o-*) 用法并报告无效项
  list [pattern]         列出全部 token（可选 glob 模式，如 "--o-color-*"）
  info <token>           展示详情：分类、各主题/模式的值
  convert <value>        设计稿值 → token 反查（hex/rgb/rgba/px/ms/cubic-bezier/...）
  versions               列出可用版本（及本地缓存版本）
  clear-cache            删除所有缓存的包版本

选项：
  -V, --version <ver>   指定校验使用的包版本（默认：latest）
  -t, --theme <theme>   主题：e|a|k|m|g|u（默认：e）
  -m, --mode <mode>     模式：light|dark（默认：light）
      --json             输出 JSON（供 LLM / 程序化消费）
      --offline          仅使用缓存，不联网
      --strict           扫描到无效 token 时以非零码退出（仅 scan）
      --no-suggest       不计算最近匹配建议
      --cache-dir <dir>  自定义缓存目录
  -v, --verbose          详细输出
  -h, --help             显示帮助

convert 专用选项：
      --color            强制按颜色解析
      --value            强制按普通值解析
      --tolerance <n>    颜色容差（默认：5）
      --all              显示全部匹配（不只最佳）

示例：
  # 校验单个 token
  node bin.mjs check --o-color-fill2
  node bin.mjs check "var(--o-color-bg1)" --json

  # 扫描文件中的捏造 token
  node bin.mjs scan src/App.vue --theme e --strict
  node bin.mjs scan src/ --json

  # 列出所有颜色 token
  node bin.mjs list "--o-color-*" --json

  # 展示某 token 跨所有主题的完整信息
  node bin.mjs info --o-brand-6

  # 设计稿值 → token 反查
  node bin.mjs convert '#FFFFFF'
  node bin.mjs convert 'rgb(255, 0, 0)'
  node bin.mjs convert 16px
  node bin.mjs convert 200ms
  node bin.mjs convert 'cubic-bezier(0.2, 0, 0, 1)' --all

  # 列出可用版本
  node bin.mjs versions
`);
}

// ---------------------------------------------------------------------------
// 参数解析
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const opts = {
    ...createDefaultOpts(),
    command: null,
    args: [],
    forceColor: false,
    forceValue: false,
    tolerance: 5,
    all: false,
  };
  let i = 0;
  while (i < argv.length) {
    const a = argv[i];
    if (a === '-h' || a === '--help') {
      showHelp();
      process.exit(0);
    } else if (a === '--json') {
      opts.json = true; i++;
    } else if (a === '--offline') {
      opts.offline = true; i++;
    } else if (a === '--strict') {
      opts.strict = true; i++;
    } else if (a === '--no-suggest') {
      opts.suggest = false; i++;
    } else if (a === '-v' || a === '--verbose') {
      opts.verbose = true; i++;
    } else if (a === '--color') {
      opts.forceColor = true; i++;
    } else if (a === '--value') {
      opts.forceValue = true; i++;
    } else if (a === '--all') {
      opts.all = true; i++;
    } else if (a === '--tolerance') {
      opts.tolerance = parseInt(argv[i + 1], 10);
      if (isNaN(opts.tolerance)) {
        console.error('Error: --tolerance requires a number');
        process.exit(2);
      }
      i += 2;
    } else if (a === '-V' || a === '--version') {
      opts.versionFlag = argv[i + 1];
      if (!opts.versionFlag) { console.error('Error: --version requires a value'); process.exit(2); }
      i += 2;
    } else if (a === '-t' || a === '--theme') {
      opts.theme = argv[i + 1];
      if (!THEMES.includes(opts.theme)) { console.error(`Error: --theme must be one of ${THEMES.join(', ')}`); process.exit(2); }
      i += 2;
    } else if (a === '-m' || a === '--mode') {
      opts.mode = argv[i + 1];
      if (!['light', 'dark'].includes(opts.mode)) { console.error('Error: --mode must be light or dark'); process.exit(2); }
      i += 2;
    } else if (a === '--cache-dir') {
      opts.cacheDir = resolve(argv[i + 1]);
      if (!opts.cacheDir) { console.error('Error: --cache-dir requires a value'); process.exit(2); }
      i += 2;
    } else if (a === '--') {
      i++;
      while (i < argv.length) {
        if (!opts.command) opts.command = argv[i];
        else opts.args.push(argv[i]);
        i++;
      }
      break;
    } else if (!a.startsWith('-') || a.startsWith('--o-') || a.startsWith('#') || a === '-') {
      // Token names (--o-*), hex colors (#...), and standalone "-" are positional.
      if (!opts.command) opts.command = a;
      else opts.args.push(a);
      i++;
    } else {
      console.error(`Error: unknown option "${a}". See --help.`);
      process.exit(2);
    }
  }
  return opts;
}

// ---------------------------------------------------------------------------
// 子命令：check
// ---------------------------------------------------------------------------

async function cmdCheck(args, opts) {
  if (args.length === 0) {
    console.error('Error: check requires a token name. See --help.');
    process.exit(2);
  }
  const rawInput = args[0];
  const tokenName = normalizeTokenName(rawInput);
  if (!tokenName || !tokenName.startsWith('--o-')) {
    console.error(`Error: could not parse token name from "${rawInput}".`);
    process.exit(2);
  }

  const registry = await getRegistry(opts);
  const lookup = lookupToken(registry, tokenName, opts.theme, opts.mode);
  const meta = getMetadata(registry, tokenName);

  if (opts.json) {
    const result = {
      token: tokenName, input: rawInput, exists: lookup.exists,
      version: registry.version, source: registry._extractDir || null,
      theme: opts.theme, mode: opts.mode,
      value: lookup.value || null, scope: lookup.scope || null,
      category: meta?.category || null, name: meta?.name || null,
      description: meta?.description || null,
    };
    if (!lookup.exists && opts.suggest) {
      result.suggestions = findClosest(tokenName, registry.allVars);
    }
    console.log(JSON.stringify(result, null, 2));
    return lookup.exists ? 0 : 1;
  }

  if (lookup.exists) {
    const metaStr = meta ? ` [${meta.category}]` : '';
    const nameStr = meta?.name ? ` ${meta.name}` : '';
    const valStr = lookup.value ? ` = ${fmtValue(lookup.value)}` : '';
    const scopeStr = lookup.scope ? ` (${fmtScope(lookup.scope)})` : '';
    console.log(`✅ ${tokenName} exists${metaStr}${nameStr}${valStr}${scopeStr}`);
    if (meta?.description) console.log(`   ${meta.description}`);
    if (lookup.note) console.log(`   ⚠ ${lookup.note}`);
    console.log(`   version: ${registry.version} [${registry._extractDir}]`);
    return 0;
  }

  console.log(`❌ ${tokenName} does not exist in ${PACKAGE_NAME}@${registry.version}`);
  if (opts.suggest) {
    const suggestions = findClosest(tokenName, registry.allVars);
    if (suggestions.length) {
      console.log('   💡 closest matches:');
      for (const s of suggestions) {
        console.log(`      ${s.name} (distance=${s.distance}${s.prefix ? ', prefix' : ''})`);
      }
    }
  }
  if (meta) console.log(`   category: ${meta.category}`);
  return 1;
}

// ---------------------------------------------------------------------------
// 子命令：scan
// ---------------------------------------------------------------------------

async function cmdScan(args, opts) {
  if (args.length === 0) {
    console.error('Error: scan requires at least one file or directory. See --help.');
    process.exit(2);
  }
  const files = collectFiles(args, SCAN_EXTENSIONS);
  if (files.length === 0) {
    console.error(`No scannable files found in: ${args.join(' ')}`);
    process.exit(2);
  }

  const registry = await getRegistry(opts);
  const report = { files: [], totalUsages: 0, validCount: 0, invalidCount: 0, invalid: [], valid: [] };

  for (const file of files) {
    let content;
    try { content = readFileSync(file, 'utf-8'); } catch (e) {
      console.error(`Warning: could not read ${file}: ${e.message}`);
      continue;
    }
    const usages = extractTokenUsages(content);
    if (usages.length === 0) continue;

    const fileReport = { file, total: usages.length, valid: [], invalid: [] };
    for (const u of usages) {
      report.totalUsages++;
      const lookup = lookupToken(registry, u.token, opts.theme, opts.mode);
      if (lookup.exists) {
        report.validCount++;
        fileReport.valid.push(u);
      } else {
        report.invalidCount++;
        const entry = { token: u.token, line: u.line, column: u.column };
        if (opts.suggest) entry.suggestions = findClosest(u.token, registry.allVars);
        report.invalid.push({ file, ...entry });
        fileReport.invalid.push(entry);
      }
    }
    report.files.push(fileReport);
  }

  if (opts.json) {
    console.log(JSON.stringify({
      version: registry.version, theme: opts.theme, mode: opts.mode,
      filesScanned: files.length, totalUsages: report.totalUsages,
      validCount: report.validCount, invalidCount: report.invalidCount,
      invalid: report.invalid,
    }, null, 2));
  } else {
    const relFiles = files.map((f) => relative(process.cwd(), f) || f);
    console.log(`Scanned ${files.length} file(s): ${relFiles.join(', ')}`);
    console.log(`Found ${report.totalUsages} token usage(s): ✅ ${report.validCount} valid, ❌ ${report.invalidCount} invalid`);
    if (report.invalid.length) {
      console.log('');
      console.log('Invalid tokens:');
      for (const inv of report.invalid) {
        const relFile = relative(process.cwd(), inv.file) || inv.file;
        console.log(`  ${relFile}:${inv.line}:${inv.column}  ${inv.token}  ❌`);
        if (inv.suggestions && inv.suggestions.length) {
          const top = inv.suggestions.slice(0, 3).map((s) => `${s.name} (d=${s.distance})`).join(', ');
          console.log(`    💡 closest: ${top}`);
        }
      }
    }
    if (report.invalidCount === 0) console.log('All tokens valid.');
  }

  if (opts.strict && report.invalidCount > 0) return 1;
  return 0;
}

// ---------------------------------------------------------------------------
// 子命令：list
// ---------------------------------------------------------------------------

async function cmdList(args, opts) {
  const registry = await getRegistry(opts);
  const pattern = args[0];
  const allVars = Array.from(registry.allVars).sort();

  let filtered = allVars;
  if (pattern) {
    const re = new RegExp('^' + pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
    filtered = allVars.filter((v) => re.test(v));
  }

  if (opts.json) {
    const result = filtered.map((v) => {
      const meta = getMetadata(registry, v);
      const lookup = lookupToken(registry, v, opts.theme, opts.mode);
      const entry = { name: v, category: meta?.category || null, description: meta?.description || meta?.name || null, value: lookup.value || null };
      if (v.startsWith('--o-r-')) {
        const entries = registry.responsive.get(v);
        if (entries && entries.length) {
          entry.valuesByBreakpoint = entries.map((e) => ({
            label: labelForMedia(e.media, e.sectionLabel, registry.responsiveBreakpoints),
            media: e.media, value: e.value,
          }));
        }
      }
      return entry;
    });
    console.log(JSON.stringify(result, null, 2));
    return 0;
  }

  const grouped = new Map();
  for (const v of filtered) {
    const meta = getMetadata(registry, v);
    const cat = meta?.category || '(uncategorized)';
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat).push(v);
  }
  console.log(`Total: ${filtered.length} token(s) [${PACKAGE_NAME}@${registry.version}]`);
  for (const [cat, vars] of Array.from(grouped.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log('');
    console.log(`[${cat}] (${vars.length})`);
    for (const v of vars) {
      const meta = getMetadata(registry, v);
      const lookup = lookupToken(registry, v, opts.theme, opts.mode);
      let valStr = '';
      if (v.startsWith('--o-r-')) {
        const entries = registry.responsive.get(v);
        if (entries && entries.length) {
          valStr = ` = ${entries.map((e) => {
            const lbl = labelForMedia(e.media, e.sectionLabel, registry.responsiveBreakpoints);
            return `${lbl}=${e.value}`;
          }).join(' / ')}`;
        } else if (lookup.value) valStr = ` = ${fmtValue(lookup.value)}`;
      } else if (lookup.value) valStr = ` = ${fmtValue(lookup.value)}`;
      const desc = meta?.description || meta?.name || '';
      const descStr = desc ? `  // ${desc}` : '';
      console.log(`  ${v}${valStr}${descStr}`);
    }
  }
  return 0;
}

// ---------------------------------------------------------------------------
// 子命令：info
// ---------------------------------------------------------------------------

async function cmdInfo(args, opts) {
  if (args.length === 0) {
    console.error('Error: info requires a token name. See --help.');
    process.exit(2);
  }
  const tokenName = normalizeTokenName(args[0]);
  if (!tokenName || !tokenName.startsWith('--o-')) {
    console.error(`Error: could not parse token name from "${args[0]}".`);
    process.exit(2);
  }

  const registry = await getRegistry(opts);
  const meta = getMetadata(registry, tokenName);

  if (opts.json) {
    const result = {
      token: tokenName, version: registry.version,
      category: meta?.category || null, name: meta?.name || null,
      description: meta?.description || null, type: meta?.type || null,
      typeName: meta?.typeName || null, exists: registry.allVars.has(tokenName),
    };
    if (tokenName.startsWith('--o-r-')) {
      result.scope = 'responsive';
      const entries = registry.responsive.get(tokenName);
      if (entries && entries.length) {
        result.valuesByBreakpoint = entries.map((e) => ({
          label: labelForMedia(e.media, e.sectionLabel, registry.responsiveBreakpoints),
          media: e.media, value: e.value,
        }));
        const base = entries.find((e) => e.media === null) || entries[0];
        result.value = base.value;
      } else result.value = null;
    } else {
      result.themes = {};
      for (const t of THEMES) {
        const entry = {};
        for (const mode of ['light', 'dark']) {
          const val = registry.themes[t]?.[mode]?.get(tokenName);
          if (val !== undefined) entry[mode] = val;
        }
        if (Object.keys(entry).length) result.themes[t] = entry;
      }
    }
    console.log(JSON.stringify(result, null, 2));
    return registry.allVars.has(tokenName) ? 0 : 1;
  }

  if (!registry.allVars.has(tokenName)) {
    console.log(`❌ ${tokenName} does not exist in ${PACKAGE_NAME}@${registry.version}`);
    if (opts.suggest) {
      const suggestions = findClosest(tokenName, registry.allVars);
      if (suggestions.length) {
        console.log('   💡 closest matches:');
        for (const s of suggestions) console.log(`      ${s.name} (distance=${s.distance})`);
      }
    }
    return 1;
  }

  console.log(`Token: ${tokenName}`);
  console.log(`Version: ${registry.version}`);
  if (meta) {
    console.log(`Category: ${meta.category}`);
    if (meta.name) console.log(`Name: ${meta.name}`);
    if (meta.description) console.log(`Description: ${meta.description}`);
    if (meta.type) console.log(`Type: ${meta.type}${meta.typeName ? ` (${meta.typeName})` : ''}`);
  } else {
    console.log('Category: (no metadata)');
  }

  if (tokenName.startsWith('--o-r-')) {
    console.log('Scope: responsive (theme-independent)');
    const entries = registry.responsive.get(tokenName);
    if (entries && entries.length) {
      const labeled = entries.map((e) => ({
        label: labelForMedia(e.media, e.sectionLabel, registry.responsiveBreakpoints),
        value: e.value, media: e.media,
      }));
      const labelWidth = Math.max(...labeled.map((p) => p.label.length));
      const valWidth = Math.max(...labeled.map((p) => fmtValue(p.value).length));
      for (const p of labeled) {
        const v = fmtValue(p.value);
        console.log(`  ${p.label.padEnd(labelWidth)} ${v.padEnd(valWidth)}  (${p.value})`);
      }
    } else {
      console.log('Value: (not defined in any @media block)');
    }
  } else {
    console.log('Scope: theme-specific');
    for (const t of THEMES) {
      const light = registry.themes[t]?.light?.get(tokenName);
      const dark = registry.themes[t]?.dark?.get(tokenName);
      if (light === undefined && dark === undefined) continue;
      console.log(`  theme ${t}:`);
      if (light !== undefined) console.log(`    light: ${fmtValue(light)}`);
      if (dark !== undefined) console.log(`    dark:  ${fmtValue(dark)}`);
    }
  }
  return 0;
}

// ---------------------------------------------------------------------------
// 子命令：convert（设计稿值 → token 反查）
// ---------------------------------------------------------------------------

async function cmdConvert(args, opts) {
  if (args.length === 0) {
    console.error('Error: convert requires a value. See --help.');
    console.error('Examples:');
    console.error('  node bin.mjs convert \'#FFFFFF\'');
    console.error('  node bin.mjs convert \'rgb(255, 0, 0)\'');
    console.error('  node bin.mjs convert 16px');
    console.error('  node bin.mjs convert 200ms');
    process.exit(2);
  }

  const value = args[0];
  const registry = await getRegistry(opts);

  let result;
  if (opts.forceColor) {
    result = convertColor(value, registry, opts);
  } else if (opts.forceValue) {
    result = convertValue(value, registry, opts);
  } else {
    result = convertDesignValue(value, registry, opts);
  }

  if (opts.json) {
    const output = {
      input: result.input,
      type: result.type,
      rgb: result.rgb || null,
      alpha: result.alpha || null,
      matches: result.matches || [],
      validated: result.validated || false,
      version: registry.version,
      theme: opts.theme,
      mode: opts.mode,
    };
    console.log(JSON.stringify(output, null, 2));
    return (result.matches && result.matches.length > 0) ? 0 : 1;
  }

  // Human-readable output.
  console.log(`🔍 Input: ${value}`);
  console.log(`   Type: ${result.type}`);
  if (result.rgb) {
    const alphaStr = result.alpha && result.alpha !== 1 ? ` (alpha: ${result.alpha})` : '';
    console.log(`   RGB: ${result.rgb.join(', ')}${alphaStr}`);
  }

  if (!result.matches || result.matches.length === 0) {
    console.log('   ❌ No matching token found.');
    if (opts.suggest) {
      console.log('   💡 Use `list` to see all available tokens.');
    }
    return 1;
  }

  const showCount = opts.all ? result.matches.length : Math.min(3, result.matches.length);
  const best = result.matches[0];
  console.log(`   ✅ ${best.var}`);
  if (best.category) console.log(`      [${best.category}]`);
  if (best.description) console.log(`      ${best.description}`);
  if (best.name && best.name !== best.description) console.log(`      name: ${best.name}`);

  if (showCount > 1) {
    console.log('   💡 Also matches:');
    for (const m of result.matches.slice(1, showCount)) {
      let line = `      ${m.var}`;
      if (m.category) line += ` [${m.category}]`;
      console.log(line);
    }
  }

  const rest = result.matches.length - showCount;
  if (rest > 0) {
    console.log(`   ...and ${rest} more (use --all to show all)`);
  }

  return 0;
}

// ---------------------------------------------------------------------------
// 子命令：versions
// ---------------------------------------------------------------------------

async function cmdVersions(args, opts) {
  if (opts.json) {
    if (opts.offline) {
      const cached = listCachedVersions(opts.cacheDir);
      console.log(JSON.stringify({ cached, latest: null }, null, 2));
      return 0;
    }
    try {
      const resp = await fetch(`${REGISTRY_BASE}/${PACKAGE_NAME}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      console.log(JSON.stringify({
        versions: Object.keys(data.versions || {}),
        latest: data['dist-tags']?.latest || null,
      }, null, 2));
      return 0;
    } catch (e) {
      console.error(`Error fetching versions: ${e.message}`);
      console.log(JSON.stringify({ cached: listCachedVersions(opts.cacheDir), latest: null, error: e.message }, null, 2));
      return 1;
    }
  }
  if (opts.offline) {
    const cached = listCachedVersions(opts.cacheDir);
    console.log(`Cached versions of ${PACKAGE_NAME}:`);
    if (cached.length === 0) console.log('  (none — run without --offline to populate)');
    for (const v of cached) console.log(`  ${v}`);
    return 0;
  }
  try {
    const resp = await fetch(`${REGISTRY_BASE}/${PACKAGE_NAME}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    const versions = Object.keys(data.versions || {});
    const latest = data['dist-tags']?.latest;
    console.log(`Available versions of ${PACKAGE_NAME}:`);
    for (const v of versions) {
      const tag = v === latest ? ' (latest)' : '';
      console.log(`  ${v}${tag}`);
    }
    const cached = listCachedVersions(opts.cacheDir);
    if (cached.length) {
      console.log('');
      console.log('Cached locally:');
      for (const v of cached) console.log(`  ${v}`);
    }
    return 0;
  } catch (e) {
    console.error(`Error fetching versions: ${e.message}`);
    const cached = listCachedVersions(opts.cacheDir);
    if (cached.length) {
      console.log('Falling back to cached versions:');
      for (const v of cached) console.log(`  ${v}`);
      return 0;
    }
    return 1;
  }
}

// ---------------------------------------------------------------------------
// 子命令：clear-cache
// ---------------------------------------------------------------------------

async function cmdClearCache(args, opts) {
  const count = clearCache(opts.cacheDir);
  if (count === 0) {
    console.log(`Cache directory does not exist: ${opts.cacheDir}`);
    return 0;
  }
  console.log(`Cleared ${count} entr${count === 1 ? 'y' : 'ies'} from ${opts.cacheDir}`);
  return 0;
}

// ---------------------------------------------------------------------------
// 主入口
// ---------------------------------------------------------------------------

export async function main(argv) {
  const opts = parseArgs(argv);
  if (!opts.command) {
    showHelp();
    process.exit(0);
  }

  // For commands that need a registry, set searchBase.
  if (['check', 'scan', 'list', 'info', 'convert'].includes(opts.command)) {
    if (opts.command === 'scan' && opts.args.length > 0) {
      opts.searchBase = resolve(opts.args[0]);
      if (existsSync(opts.searchBase) && statSync(opts.searchBase).isFile()) {
        opts.searchBase = dirname(opts.searchBase);
      }
    } else {
      opts.searchBase = process.cwd();
    }
    if (opts.verbose) {
      console.error(`[verbose] search base: ${opts.searchBase}`);
      console.error(`[verbose] cache dir: ${opts.cacheDir}`);
      console.error(`[verbose] theme: ${opts.theme}, mode: ${opts.mode}`);
    }
  }

  let exitCode = 0;
  try {
    switch (opts.command) {
      case 'check': exitCode = await cmdCheck(opts.args, opts); break;
      case 'scan': exitCode = await cmdScan(opts.args, opts); break;
      case 'list': exitCode = await cmdList(opts.args, opts); break;
      case 'info': exitCode = await cmdInfo(opts.args, opts); break;
      case 'convert': exitCode = await cmdConvert(opts.args, opts); break;
      case 'versions': exitCode = await cmdVersions([], opts); break;
      case 'clear-cache': exitCode = await cmdClearCache([], opts); break;
      default:
        console.error(`Error: unknown command "${opts.command}". See --help.`);
        exitCode = 2;
    }
  } catch (e) {
    if (opts.json) {
      console.log(JSON.stringify({ error: e.message, stack: e.stack }, null, 2));
    } else {
      console.error(`Error: ${e.message}`);
      if (opts.verbose) console.error(e.stack);
    }
    exitCode = 1;
  }
  process.exitCode = exitCode;
}

// Run when invoked directly (not when imported as a module by check-tokens.mjs).
const _isMainModule = process.argv[1] &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (_isMainModule) {
  main(process.argv.slice(2));
}
