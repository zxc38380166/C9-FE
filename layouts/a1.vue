<template>
  <div class="flex h-screen bg-[#1a2c38] overflow-hidden">
    <!-- Aside -->
    <A1DialogLang
      v-model="open"
      v-model:selected="selectedLang"
      title="语言"
      :langs="langs"
      :show-cancel="true"
      confirm-text-label="确认"
      dialog-bg="#071d2a"
      dialog-border="#FFFFFF14"
      row-bg="#0000001F"
      row-border="#FFFFFF14"
      row-hover-bg="#FFFFFF0A"
      active-row-border="#5fae8e"
      active-dot="#5fae8e"
      active-radio-border="#5fae8e"
      @confirm="applyLang as any" />

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
      <main class="flex-1 scrollable-hidden overflow-y-auto overscroll-contain bg-[#1a2c38]">
        <slot />
        <footer>
          <A1LayoutFooter />
        </footer>
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
  const isCollapse = ref(false);
  const asideWidth = computed(() => (isCollapse.value ? '64px' : '250px'));

  const open = ref(false);
  const selectedLang = ref('zh-TW');

  const langs = [
    { label: '中文(简体)', value: 'zh-CN', icon: '/flags/cn.png' },
    { label: '日本語', value: 'ja', icon: '/flags/jp.png' },
    { label: '한국어', value: 'ko', icon: '/flags/kr.png' },
    { label: 'แบบไทย', value: 'th', icon: '/flags/th.png' },
    { label: '中文(繁體)', value: 'zh-TW', icon: '/flags/hk.png' },
    { label: 'English', value: 'en', icon: '/flags/us.png' },
    { label: 'Tiếng Việt', value: 'vi', icon: '/flags/vn.png' },
  ];

  const applyLang = (lang: string) => {
    // 你這裡接 nuxt-i18n / vue-i18n 切語系即可
    console.log('apply lang =>', lang);
  };
</script>
