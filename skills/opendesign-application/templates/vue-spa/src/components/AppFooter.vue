<script setup lang="ts">
/**
 * @description 页脚组件。使用 @opendesign-plus/components 的 OFooter 实现与
 *   openEuler 官网一致的深色页脚设计（快速导航、友情链接、版权信息）。
 *   数据配置在 data/footer.ts 中。
 */
import { OFooter } from '@opendesign-plus/components'
import { quickNav, friendshipLink, footerOption } from '@/data/footer'

import logoFooter from '@/assets/logo-dark.png'

const footerLogoData = {
  logo: logoFooter,
  email: 'contact@example.com',
}
</script>

<template>
  <OFooter
    :quick-nav="quickNav"
    :friendship-link="friendshipLink"
    :footer-logo="footerLogoData"
    :footer-option="footerOption"
  />
</template>
