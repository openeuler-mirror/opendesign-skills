← [SKILL.md](../SKILL.md) · [设计师指南](designer-guide.md)

# 调用填空模板与页面需求单、楼层工单格式

> 本文档定义会话全程的结构化载体：**调用填空模板**（§一，首轮发起——用户填空；信息不全时由 AI 代填递出）、**页面需求单**（§二，SKILL.md 第一步楼层规划确认用）与**楼层工单**（§三，SKILL.md 第三步逐楼层确认用）——后两者均由 AI 生成草稿、用户确认修改；熟练用户可走**快捷通道**（§四）首轮直贴手写需求单。
>
> **它们不是使用门槛**：最常用的方式仍是自然语言描述需求——怎么把需求说清楚见 [designer-guide.md](designer-guide.md)「输入清单」。AI 检查信息齐全性后生成需求单草稿供你确认，你只需要会改、会批；信息不全时，AI 会把调用填空模板递给你补空。

## 一、调用填空模板（首轮发起载体）

第一轮消息的填空版，空位对应 [designer-guide.md](designer-guide.md)「输入清单」的 ①~⑨——不想自己组织语言，直接复制填空发送；第一轮信息不全时，AI 也会把模板递给你（已知项代填、缺项留空）。社区、设备、场景（增改含站点地址）缺了 AI 会停下来要；语言不填默认中文；其余空给得越全，还原度越稳。

```text
做一个 ____ 社区（openEuler / openGauss / openUBMC / 鲲鹏 / 昇腾…）的 ____ 端页面（PC / 手机；双端分两次生成）。
场景：____（全新页面 / 在现有站点上增改；增改请给站点地址：____）
页面语言：____（中文 / 英文 / 中英双语；不填默认中文）

大致结构（从上到下，每块放什么，例「顶部导航 → 主视觉大图 → 三张能力卡片 → 页脚」）：____

内容素材（已有的贴上来；没有的留空，AI 每层开工前会来要）：
- 导航菜单项 / 页脚信息：____
- 主视觉文案（slogan / 副标题 / 按钮文字）：____
- 卡片或列表条目（标题 + 描述）：____

配图想法（例「数据库机房、紫色调、16:9」）：____
验收点（可不填，例「每层实心按钮最多一个」）：____
品牌约束（可不填，如 logo、禁用色）：____
```

填好后的样子见 [designer-guide.md](designer-guide.md)「第一轮消息示例」。AI 侧规则：

- **递出时机**：SKILL.md 第一步输入齐全性检查未过时，把模板发给用户——**已知项代填、只留缺项的空**（用户已说了「openGauss 手机端」，这两项就替他填好），不要求重填已知信息；信息齐全的首轮不递模板，直接进入需求单草稿。
- **责任边界**：模板只收意图与素材；楼层类型、Banner 等级、栅格列数、组件选型由 AI 规划（口径同 §二「字段填写责任」），禁止把楼层分类学塞回给用户填。
- **素材允许留空**：内容素材不全不阻塞规划，第三步楼层工单逐层收齐（同 SKILL.md 第一步口径）。

## 二、页面需求单（页面级确认载体）

生成时机：SKILL.md 第一步楼层规划完成后，AI 输出本单草稿；用户确认或修改后进入逐楼层循环。

```yaml
# ========== 页面需求单 ==========
# AI 生成草稿 → 用户确认；【必填】缺失时 AI 停下询问，禁止猜测

meta:
  community: openGauss        # 【必填】openEuler|openGauss|openUBMC|Kunpeng|Ascend 等社区
                              # （决定主题 Token，禁止默认 openEuler；无 Token 的社区停下询问）
  device: PC                  # 【必填】PC|MB（决定字号/间距/栅格白名单列；双端分两次生成）
  scenario: new-page          # 【必填】new-page = 全新落地页 | site-extension = 已有站点增改
  site_url: null              # scenario = site-extension 时【必填】：导航/页脚按该线上站真实结构还原
  language: zh                # zh|en|zh-en（默认 zh，草稿中显式呈现供确认）
  confirm: per-floor          # 可选，默认 per-floor = 每楼层确认后继续；auto = 确认后连跑
                              # （auto 下导航面板样式硬门禁与素材缺失仍会停下）

floors:                       # 顺序即页面顺序；首层 navigation、末层 footer 必选
  - id: nav                   # 楼层短标识，AI 起名，后续对话用它指代
    type: navigation          # navigation|banner|card-grid|feature-section|floor-card|footer|custom（无现成楼层模板）
    summary: 主导航，logo + 一级菜单 + 搜索      # 一句话意图
  - id: banner
    type: banner
    variant: XL               # banner 专用：XL|L|M —— AI 按页面定位建议，用户可改
    summary: 首页主视觉，slogan + 双按钮
  - id: features
    type: card-grid
    columns: 3                # 栅格列数，AI 按卡片数量规划，用户可改
    summary: 3 列封面卡片，展示核心特性
  - id: footer
    type: footer
    summary: 站点地图 + 版权 + 友链

acceptance:                   # 可选：全页级验收点，叠加在 SKILL.md 第八步最终验证之上
  - 每层 solid 按钮最多一个
```

### 字段填写责任

| 字段 | 谁负责 | 判定标准 |
|------|--------|----------|
| `community` / `device` / `scenario` / `site_url` | **用户意图** | 猜错会产出错误交付物（社区 / 设备 / 增改场景错了，整页从头错）——AI 缺失时必须询问，禁止猜测 |
| `language` / `confirm` | 用户可选 | 有安全默认值（zh / per-floor），草稿中显式呈现供确认 |
| `floors[].id` / `type` / `variant` / `columns` | **AI 规划** | 楼层分类学是 skill 的领域知识，AI 负责映射；用户在确认时可改 |
| `acceptance` | 用户可选 | 用户提出的验收点；AI 可建议 |
| 楼层内容素材 | **用户提供** | 在楼层工单中逐层收齐；AI 禁止编造（见 §三） |

## 三、楼层工单（楼层级确认载体）

生成时机：SKILL.md 第三步，读取组件规范前，AI 输出本单草稿；用户确认 / 补充后进入第四步。

```yaml
# ========== 楼层工单：banner ==========
floor_id: banner
type: banner
variant: XL

components:                  # AI 选型，用户可增删
  - OBanner
  - OButton

content:                     # 逐条列出；【用户素材】缺失项 AI 停下索要，禁止编造
  - 标题：开源驱动数字基础设施
  - 副标题：面向数字基础设施的开源操作系统
  - 按钮:
    - {text: 立即下载, variant: solid}
    - {text: 了解更多, variant: outline}
  - 配图：数据中心机房全景，克莱因蓝主色调，16:9   # 有文生图能力时作为生成 prompt

icons:                       # AI 从 references/assets/ 匹配，用户可指定
  - {name: search}

acceptance:                  # 可选：本层验收点，叠加在 SKILL.md 第六步自检之上
  - solid 按钮唯一且左对齐
```

## 四、快捷通道（熟练用户）

会话首轮直接粘贴填好的**页面需求单**（逐层内容素材可后补，在楼层工单阶段收齐）：

- AI 校验【必填】字段与枚举合法值：必填缺失 → 停下询问；枚举非法（如 `newPage`、`device: mobile`）→ 给出合法值请用户修正，禁止自行猜测映射
- 校验通过 → 跳过第一步规划确认，直接进入逐楼层循环
- 枚举合法取值以本文档为准（`meta` 各字段与楼层 `type` / `variant` 见 §二、§三 注释），AI 不得自行扩展
