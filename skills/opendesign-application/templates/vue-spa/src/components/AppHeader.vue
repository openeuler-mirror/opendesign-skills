<script setup lang="ts">
/**
 * @description 顶部导航栏。使用 @opendesign-plus/components 的 OHeader / OHeaderMobile
 *   实现与 openEuler 官网一致的导航体验（Mega Menu、响应式切换、主题开关）。
 *   导航数据在 data/nav.ts 中配置，主题切换使用 OHeaderTheme。
 */
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { OHeader, OHeaderMobile, OHeaderTheme } from '@opendesign-plus/components'
import { useTheme } from '@opendesign-plus/composables'

import { useScreen } from '@opendesign-plus/composables'
import { navData } from '@/data/nav'

import logoLight from '@/assets/logo.png'
import logoDark from '@/assets/logo-dark.png'

const router = useRouter()
const route = useRoute()
const { theme, setTheme } = useTheme()
const { lePadV } = useScreen()

const isMounted = ref(false)
onMounted(() => { isMounted.value = true })

/** logo 跟随主题切换 */
const logoUrl = computed(() => theme.value === 'dark' ? logoDark : logoLight)

/** 当前激活的导航项 —— 按路由 path 匹配 navData 中的 id */
const activeIndex = computed(() => {
  const path = route.path.replace(/\/$/, '') || '/'
  for (const item of navData) {
    if (item.href === path || (item.href === '/' && path === '')) {
      return item.id
    }
  }
  return ''
})

/** 导航项点击 —— 路由跳转 */
const handleNavClick = (val: { href?: string }) => {
  if (val?.href) {
    router.push(val.href)
  }
}

/** Logo 点击 —— 回首页 */
const goHome = () => {
  router.push('/')
}

/** 主题切换 */
const currentTheme = computed(() => theme.value)
const onChangeTheme = (val: string) => {
  setTheme(val as 'light' | 'dark')
}
</script>

<template>
  <!-- 桌面端导航 -->
  <OHeader
    v-if="isMounted && !lePadV"
    :logo="logoUrl"
    :nav-data="navData"
    :active-index="activeIndex"
    community="OpenDesign"
    @go-home="goHome"
    @handle-click="handleNavClick"
  >
    <template #toolbar>
      <div class="header-toolbar">
        <OHeaderTheme
          type="common"
          :theme="currentTheme"
          @change="onChangeTheme"
        />
      </div>
    </template>
  </OHeader>

  <!-- 移动端导航 -->
  <OHeaderMobile
    v-if="isMounted && lePadV"
    :logo="logoUrl"
    :nav-data="navData"
    :active-index="activeIndex"
    community="OpenDesign"
    @go-home="goHome"
    @handle-click="handleNavClick"
  >
    <template #tool>
      <OHeaderTheme
        type="mobile"
        :theme="currentTheme"
        @change="onChangeTheme"
      />
    </template>
  </OHeaderMobile>
</template>

<style lang="scss" scoped>
.header-toolbar {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>

