<template>
  <div class="flex h-screen bg-[#1a2c38] overflow-hidden">
    <!-- Aside -->
    <aside class="fixed left-0 top-0 h-screen z-40">
      <A1LayoutMenu v-model:collapse="isCollapse" :asideWidth />
    </aside>

    <!-- Main -->
    <div class="flex flex-col flex-1 overflow-hidden" :style="{ marginLeft: asideWidth }">
      <!-- Sticky Header -->
      <header class="sticky top-0 z-30 bg-gradient-to-b from-[#1a2c38] to-[#0f212e]">
        <A1LayoutHeader />
      </header>

      <!-- 真正捲動區 -->
      <main class="flex-1 overflow-y-auto overscroll-contain bg-[#1a2c38]">
        <slot />
        <footer><A1LayoutFooter /></footer>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';

  const isCollapse = ref(false);
  const asideWidth = computed(() => (isCollapse.value ? '64px' : '250px'));
</script>
<style scoped>
  .a1-layout {
    background: #1a2c38;
    min-height: 100vh;
  }

  /* 固定左側 */
  .a1-aside {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 50;
    transition: width 0.2s ease;
  }

  /* 右側內容跟著推 */
  .a1-main {
    min-height: 100vh;
    transition: margin-left 0.2s ease;
  }

  /* 如果 header 也要固定頂部可改 sticky */
  .a1-header {
    padding: 0;
  }

  /* 內容區 */
  .a1-content {
    padding: 0;
  }
</style>
