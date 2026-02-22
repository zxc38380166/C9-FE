<template>
  <Teleport to="body">
  <div class="lg:hidden fixed bottom-0 inset-x-0 z-40" style="pointer-events: none">
    <div class="relative">
      <!-- 中央凸出 Logo (絕對定位浮在導航列上方) -->
      <div class="absolute left-1/2 -translate-x-1/2 -top-5 z-10 pointer-events-auto">
        <div class="relative">
          <div class="absolute inset-0 rounded-full bg-emerald-500/25 animate-ping-slow" />
          <button
            class="relative size-11 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center ring-[3px] ring-slate-900 shadow-[0_0_16px_rgba(16,185,129,0.4)] cursor-pointer hover:shadow-[0_0_22px_rgba(16,185,129,0.55)] transition-shadow active:scale-95"
            @click="router.push('/game')">
            <Icon name="noto:gem-stone" class="text-[16px] drop-shadow-lg" />
          </button>
        </div>
      </div>

      <!-- 底部導航列 -->
      <div
        class="bg-slate-900/95 backdrop-blur-xl border-t border-white/8"
        style="pointer-events: auto">
        <div
          class="grid grid-cols-5 items-center px-1 pt-1.5"
          style="padding-bottom: max(0.375rem, env(safe-area-inset-bottom))">
          <!-- 存款 -->
          <button
            class="flex flex-col items-center gap-0.5 py-1 transition-colors cursor-pointer"
            :class="isDepositActive ? 'text-emerald-400' : 'text-white/50'"
            @click="router.push('/user/deposit')">
            <Icon name="i-lucide-arrow-down-to-line" class="size-5" />
            <span class="text-[10px] font-medium">{{ $t('nav.deposit') }}</span>
          </button>

          <!-- 活動 -->
          <button
            class="flex flex-col items-center gap-0.5 py-1 transition-colors cursor-pointer"
            :class="isPromoActive ? 'text-emerald-400' : 'text-white/50'"
            @click="router.push('/promo')">
            <Icon name="i-lucide-party-popper" class="size-5" />
            <span class="text-[10px] font-medium">{{ $t('nav.promoCenter') }}</span>
          </button>

          <!-- 中央佔位 -->
          <div class="flex flex-col items-center gap-0.5 py-1">
            <span class="size-5" />
            <span
              class="text-[10px] font-medium transition-colors"
              :class="isCasinoActive ? 'text-emerald-400' : 'text-white/50'">
              {{ $t('nav.casino') }}
            </span>
          </div>

          <!-- 體育 -->
          <button
            class="flex flex-col items-center gap-0.5 py-1 transition-colors cursor-pointer"
            :class="isSportsActive ? 'text-emerald-400' : 'text-white/50'"
            @click="router.push('/game?tab=sports')">
            <Icon name="material-symbols-light:sports-volleyball" class="size-5" />
            <span class="text-[10px] font-medium">{{ $t('game.sports') }}</span>
          </button>

          <!-- 獎金 -->
          <button
            class="flex flex-col items-center gap-0.5 py-1 transition-colors cursor-pointer text-white/50"
            @click="router.push('/promo')">
            <Icon name="i-lucide-trophy" class="size-5" />
            <span class="text-[10px] font-medium">{{ $t('nav.bonus') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  </Teleport>
</template>

<script setup lang="ts">
  const router = useRouter();
  const route = useRoute();

  const isDepositActive = computed(() => route.path === '/user/deposit');
  const isPromoActive = computed(() => route.path.startsWith('/promo'));
  const isCasinoActive = computed(
    () => route.path.startsWith('/game') && route.query.tab !== 'sports',
  );
  const isSportsActive = computed(
    () => route.path.startsWith('/game') && route.query.tab === 'sports',
  );
</script>

<style scoped>
  @keyframes ping-slow {
    0% {
      transform: scale(1);
      opacity: 0.4;
    }
    75%,
    100% {
      transform: scale(1.4);
      opacity: 0;
    }
  }

  .animate-ping-slow {
    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
</style>
