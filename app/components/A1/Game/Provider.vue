<template>
  <section>
    <div
      class="relative overflow-hidden rounded-[16px] bg-[#0f1f2a]/70 ring-1 ring-white/10 backdrop-blur shadow-[0_14px_50px_-26px_rgba(0,0,0,0.65)]">
      <div
        class="pointer-events-none absolute -bottom-16 left-10 h-36 w-105 rounded-full bg-white/4 blur-3xl" />
      <div class="relative px-4 sm:px-5 py-4">
        <div class="flex items-center gap-3">
          <div
            class="h-9 w-9 rounded-xl bg-[#0f1f2a]/60 ring-1 ring-white/10 grid place-items-center">
            <span class="i-material-symbols:dashboard text-[20px] text-white/80" />
          </div>
          <div class="space-y-0.5">
            <div class="text-white font-semibold tracking-wide text-[14px]">遊戲廠商</div>
            <div class="text-white/55 text-[12px]">合作供應商 Logo 牆</div>
          </div>
        </div>
      </div>
      <div class="relative px-3 sm:px-4 pb-5">
        <div class="grid gap-3 grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10">
          <div
            v-for="(p, idx) in providers"
            :key="p.name"
            class="relative overflow-hidden rounded-2xl bg-[#0f1f2a]/50 ring-1 ring-white/10 backdrop-blur shadow-[0_14px_50px_-28px_rgba(0,0,0,0.65)] px-3 py-3">
            <div
              class="pointer-events-none absolute inset-0 opacity-[0.25] bg-linear-to-r from-transparent via-white/16 to-transparent -translate-x-[60%] animate-pulse" />
            <div
              class="relative grid place-items-center rounded-xl bg-[#0f1f2a]/55 ring-1 ring-white/10 h-13">
              <NuxtImg
                :src="p.logo"
                :alt="p.name"
                loading="lazy"
                class="h-7.5 w-auto max-w-[90%] object-contain opacity-90" />
            </div>
            <div class="mt-2 text-center text-[10px] tracking-wider text-white/50 truncate">
              {{ p.name }}
            </div>
            <div class="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/6" />
            <div
              class="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/6 blur-2xl"
              :class="idx % 3 === 0 ? 'opacity-100' : 'opacity-60'" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
  const { data = [] } = defineProps<{
    data?: ProviderLogoItem[];
  }>();

  const { provider: defaultProvider } = useGame();

  const providers = computed<ProviderLogoItem[]>(() => {
    return data?.length ? data : defaultProvider;
  });
</script>
