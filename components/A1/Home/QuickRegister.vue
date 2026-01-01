<!-- components/QuickRegisterPanel.vue -->
<template>
  <section
    class="relative w-full overflow-hidden rounded-2xl bg-[#0b1e2b] px-7 py-8 text-white shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
    <!-- 背景圓弧層（做出截圖那種深色弧形） -->
    <div class="pointer-events-none absolute inset-0">
      <div
        class="absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-white/8 blur-[2px]" />
      <div class="absolute left-10 top-10 h-[520px] w-[520px] rounded-full bg-white/6 blur-[1px]" />
      <div
        class="absolute -right-40 -bottom-40 h-[620px] w-[620px] rounded-full bg-black/25 blur-[2px]" />
      <div
        class="absolute inset-0"
        style="
          background:
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.06), transparent 55%),
            radial-gradient(circle at 55% 10%, rgba(255, 255, 255, 0.05), transparent 60%),
            radial-gradient(circle at 70% 75%, rgba(0, 0, 0, 0.35), transparent 55%);
        " />
    </div>

    <div class="relative">
      <!-- Title -->
      <h2 class="text-[30px] leading-[1.15] font-extrabold tracking-wide">
        世界上最大的在线赌场和体<br />育博彩
      </h2>

      <!-- CTA -->
      <button
        type="button"
        class="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-[#77cbac] to-[#1a6b52] px-6 py-3 text-sm font-bold shadow-sm hover:brightness-110 active:brightness-95 transition"
        @click="onRegister">
        注册
      </button>

      <!-- Other methods -->
      <div class="mt-8 text-sm font-semibold text-white/70">通过其他方式注册</div>

      <div class="mt-3 flex items-center gap-3">
        <button
          v-for="p in providers"
          :key="p.key"
          type="button"
          class="group flex h-12 w-12 items-center justify-center rounded-xl bg-white/6 shadow-[0_10px_18px_rgba(0,0,0,0.22)] ring-1 ring-white/10 hover:bg-white/10 transition"
          @click="onProvider(p.key)">
          <span
            class="flex h-8 w-8 items-center justify-center rounded-lg"
            :style="{ background: p.bg }">
            <i :class="p.icon" class="text-[18px]" :style="{ color: p.color }" />
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
  // 不從父層傳、行為都在組件內
  const providers = ref([
    { key: 'google', icon: 'mdi mdi-google', bg: 'transparent', color: '#fff' },
    { key: 'facebook', icon: 'mdi mdi-facebook', bg: 'transparent', color: '#fff' },
    { key: 'line', icon: 'mdi mdi-message-processing', bg: 'transparent', color: '#fff' },
    { key: 'twitch', icon: 'mdi mdi-twitch', bg: 'transparent', color: '#fff' },
  ]);

  const onRegister = () => {
    // 你可改成開啟註冊 dialog / 導頁 / 觸發 store
    // navigateTo('/register')
    console.log('[QuickRegisterPanel] register');
  };

  const onProvider = (key) => {
    // 你可改成第三方 OAuth
    // location.href = `/api/auth/${key}`
    console.log('[QuickRegisterPanel] provider:', key);
  };
</script>
