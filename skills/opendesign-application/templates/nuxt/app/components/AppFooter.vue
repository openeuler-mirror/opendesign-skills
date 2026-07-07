<script setup lang="ts">
/**
 * @description 页脚组件。内含版权信息，使用 o-r-grid-container 做水平居中，
 *   消费设计令牌承担页脚间距与排版规范。
 */
</script>

<template>
  <footer class="o-r-grid-container page-footer">
    <slot>
      <div class="footer-inner">
        <span class="footer-text">
          Powered by
          <a
            href="https://www.npmjs.com/package/@opensig/opendesign-token"
            target="_blank"
            rel="noopener"
          >@opensig/opendesign-token</a>
        </span>
      </div>
    </slot>
  </footer>
</template>

<style lang="scss" scoped>
.page-footer {
  margin-bottom: 0;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: var(--o-gap-5);
  padding-bottom: var(--o-gap-5);
  border-top: 1px solid var(--o-color-control1);
}

.footer-text {
  @include tip1;
  color: var(--o-color-info4);

  a {
    color: var(--o-color-link1);
    text-decoration: none;
    transition: color var(--o-duration-m1) var(--o-easing-standard);

    @include hoverable {
      color: var(--o-color-link2);
      text-decoration: underline;
    }
  }
}
</style>
