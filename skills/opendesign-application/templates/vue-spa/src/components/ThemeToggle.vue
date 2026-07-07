<script setup lang="ts">
/**
 * @description 主题切换开关组件。使用 OSwitch 实现 light / dark 模式切换，
 *   滑块内嵌太阳/月亮图标，右侧标签也用图标表示目标模式。
 *   v-model 直接绑定 store 的 isDark（writable computed）。
 */
import { OSwitch, OIconSun, OIconMoon } from '@opensig/opendesign'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'

const { isDark } = storeToRefs(useThemeStore())
</script>

<template>
  <OSwitch class="theme-toggle" v-model="isDark" :checked-value="false" :unchecked-value="true">
    <template #inactive><OIconMoon /></template>
    <template #active><OIconSun /></template>
    <template #off><OIconSun /></template>
    <template #on><OIconMoon /></template>
  </OSwitch>
</template>

<style lang="scss" scoped>
.theme-toggle {
  --switch-color: var(--o-color-info4);
}
</style>
