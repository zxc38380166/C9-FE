<template>
  <div class="min-h-[100dvh] bg-[#1a2c38] overflow-hidden">
    <!-- Dialogs（保持不動） -->
    <A1DialogRegister
      v-model="doms.dialogRegister.open"
      @change-lang="(lang) => (doms.dialogLang.select = lang)"
      @login="doms.dialogLogin.open = true"
      :width="isDesktop ? 520 : 360" />
    <A1DialogLogin
      v-model="doms.dialogLogin.open"
      @login="doms.dialogLogin.handleLogin"
      @forgot="doms.dialogLogin.toForgot"
      @google="doms.dialogLogin.loginWithGoogle"
      :width="isDesktop ? 520 : 360"
      @register="doms.dialogLogin.toRegister" />
    <A1DialogLang
      v-model="doms.dialogLang.open"
      v-model:selected="doms.dialogLang.select"
      title="语言"
      :langs="doms.dialogLang.options"
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
      @confirm="doms.dialogLang.applyLang" />
    <!-- ========== Desktop Layout ========== -->
    <div v-if="isDesktop" class="flex h-[100dvh] overflow-hidden">
      <aside class="fixed left-0 top-0 h-[100dvh] z-40">
        <A1LayoutMenu v-model:collapse="isCollapse" :asideWidth />
      </aside>
      <div class="flex flex-col flex-1 overflow-hidden" :style="{ marginLeft: asideWidth }">
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
    <!-- ========== Mobile Layout ========== -->
    <div v-else class="relative h-[100dvh] overflow-hidden">
      <header class="sticky top-0 z-30 bg-gradient-to-b from-[#1a2c38] to-[#0f212e]">
        <A1LayoutHeader />
      </header>
      <main
        class="absolute pt-[59px] pb-[63px] px-[20px] inset-0 scrollable-hidden overflow-y-auto overscroll-contain bg-[#1a2c38]">
        <slot />
      </main>
      <footer>
        <A1LayoutFooter />
      </footer>
    </div>
  </div>
</template>
<script setup lang="ts">
  const store = useStore();
  const { isDesktop } = useDevice();

  const isCollapse = ref(false);
  const asideWidth = computed(() => (isCollapse.value ? '64px' : '250px'));

  const doms = reactive({
    dialogLang: {
      open: false,
      select: 'zh-TW',
      applyLang() {},
      options: [
        { label: '中文(简体)', value: 'zh-CN', icon: '/common/flags/CNY.png' },
        { label: '中文(繁體)', value: 'zh-TW', icon: '/common/flags/TWD.png' },
      ],
    },
    dialogLogin: {
      open: false,
      handleLogin: ({ account, password }: { account: string; password: string }) => {
        console.log('login', account, password);
      },
      toForgot: () => console.log('forgot'),
      loginWithGoogle: () => console.log('google'),
      toRegister: () => console.log('register'),
      openDialog: () => (doms.dialogLogin.open = true),
      closeDialog: () => (doms.dialogLogin.open = false),
    },
    dialogRegister: { open: false },
  });

  onMounted(async () => {
    store.setDoms(doms);
  });
</script>
<style>
  .el-notification__content {
    color: white;
  }
</style>
