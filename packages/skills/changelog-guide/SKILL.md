---
name: changelog-guide
description: OpenDesign Skills 仓库的变更记录维护规范。当用户完成 Skill 修改后需要写 CHANGELOG 条目、判断变更分类（新增/更新/修正/移除/破坏性）、更新 SKILL.md 的 last_update 字段，或问"破坏性变更怎么判定""CHANGELOG 条目格式""last_update 怎么写""自评后怎么同步变更记录"时，使用本 skill。
---

# Changelog Guide

本仓库通过 **CHANGELOG** 向 skill 使用者传达"最近变了什么、是否需要更新已安装的 skill"。变更记录属于**第二层（共享约定）**，必须随 skill 一起提交、分发。

完整规范见 [`references/changelog.md`](references/changelog.md)。

## 何时触发

- 用户完成 Skill 修改，需要写 CHANGELOG 条目
- 用户问"这个变更算不算破坏性"
- 用户问"last_update 字段怎么填"
- 用户问"CHANGELOG 条目格式是什么"
- 用户问"自评后怎么同步变更记录"

## 一句话速查

> **每次修改 Skill 内容后：** ① 按 `skill-gen-guide → skill-review` 做自评 → ② 把变更要点写入根 `CHANGELOG.md` → ③ 更新该 skill `SKILL.md` 的 `last_update` 字段。

## 与 skill-gen-guide 的关系

本 skill 是变更记录维护的**独立知识单元**，与 `skill-gen-guide`（Skill 生成与自评）并列。自评流程中"同步变更记录"这一步的具体操作规范由本 skill 提供，`skill-gen-guide` 不再重复。
