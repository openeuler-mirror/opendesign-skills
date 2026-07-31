#!/usr/bin/env node
/**
 * check-tokens.mjs — 向后兼容入口。
 *
 * 本文件已重构为统一 CLI 的一部分。
 * 所有逻辑已提取到 lib/ 目录下的共享模块，入口统一为 bin.mjs。
 *
 * 用法不变：
 *   node check-tokens.mjs check --o-color-fill2
 *   node check-tokens.mjs scan src/App.vue --strict
 *   node check-tokens.mjs list "--o-color-*"
 *
 * 新增命令（convert）请用 bin.mjs：
 *   node bin.mjs convert '#FFFFFF'
 *   node bin.mjs convert 16px
 */

import { main } from './bin.mjs';

main(process.argv.slice(2));
