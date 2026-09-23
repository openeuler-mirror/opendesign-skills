/**
 * @description OFooter 数据配置。
 *   按 @opendesign-plus/components 已发布版本（0.0.1-rc.62）的 props 结构组织。
 *   scaffold 仅提供最小化数据作为示例，业务扩展时按需增加。
 */

/** 快速导航 —— 页脚多列链接 */
export const quickNav = [
  {
    title: '关于 OpenDesign',
    children: [
      { title: '项目介绍', href: '/about' },
      { title: '技术栈', href: '/about' },
      { title: '设计规范', href: 'https://opendesign.opensig.com', target: '_blank' },
    ],
  },
  {
    title: '文档与资源',
    children: [
      { title: '组件文档', href: 'https://opendesign.opensig.com', target: '_blank' },
      { title: '设计令牌', href: 'https://opendesign.opensig.com', target: '_blank' },
      { title: 'CLI 工具', href: 'https://opendesign.opensig.com', target: '_blank' },
    ],
  },
  {
    title: '社区',
    children: [
      { title: 'GitHub', href: 'https://github.com/opensig', target: '_blank' },
      { title: '问题反馈', href: 'https://github.com/opensig', target: '_blank' },
    ],
  },
]

/** 友情链接 */
export const friendshipLink = {
  title: '友情链接',
  children: [
    { title: 'OpenDesign', href: 'https://opendesign.opensig.com', target: '_blank' },
    { title: 'openEuler', href: 'https://www.openeuler.org/zh/', target: '_blank' },
  ],
}

/** 底部 Logo + 联系邮箱 */
export const footerLogo = {
  logo: '', // 在 AppFooter 中用 import 覆盖
  email: 'contact@example.com',
}

/** 法律链接 + 版权 + 备案 */
export const footerOption = {
  children: [
    { title: '品牌', href: '#' },
    { title: '隐私声明', href: '#' },
    { title: '法律声明', href: '#' },
  ],
  licenseText: '遵循',
  licenseInfo: '木兰宽松许可证第2版（MulanPSL2）',
  copyright: `版权所有 © ${new Date().getFullYear()} OpenDesign 保留一切权利`,
  beianInfo1: '',
  beianInfo2: '',
  beianLink: '',
  policeIcon: '',
}


