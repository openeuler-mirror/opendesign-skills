import type { NavItemT } from '@opendesign-plus/components'

/**
 * @description 导航栏数据配置。
 *   每项对应 Header 中的一个导航标签，children 为下拉菜单中的链接列表。
 *   scaffold 仅提供「首页」和「关于」两个导航项作为示例，
 *   业务扩展时按需增加 children 和 shortcut。
 */
export const navData: NavItemT[] = [
  {
    id: 'home',
    label: '首页',
    href: '/',
    withPicture: false,
    children: [],
    shortcut: [],
  },
  {
    id: 'about',
    label: '关于',
    href: '/about',
    withPicture: false,
    children: [],
    shortcut: [],
  },
]
