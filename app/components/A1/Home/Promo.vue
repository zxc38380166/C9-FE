<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between px-1">
      <div class="flex items-center gap-2">
        <Icon name="noto:party-popper" class="text-[20px] sm:text-[24px]" />
        <span class="text-[16px] sm:text-[20px] font-bold text-white">{{ $t('promo.featured') }}</span>
        <UBadge color="error" variant="subtle" size="xs" class="ml-1">HOT</UBadge>
      </div>
      <div class="flex items-center gap-1.5">
        <button
          type="button"
          class="size-7 sm:size-8 flex items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          @click="promoPage > 0 && promoPage--">
          <Icon name="i-lucide-chevron-left" class="size-4" />
        </button>
        <button
          type="button"
          class="size-7 sm:size-8 flex items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          @click="promoPage < promoMaxPage && promoPage++">
          <Icon name="i-lucide-chevron-right" class="size-4" />
        </button>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <div
        v-for="i in 3"
        :key="i"
        class="rounded-xl bg-[#131f30] ring-1 ring-white/8 h-30 sm:h-40 md:h-45 animate-pulse" />
    </div>

    <!-- Promo cards -->
    <div v-else-if="promoItems.length" class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <NuxtLink
        v-for="item in currentPageItems"
        :key="item.id"
        :to="`/promo/${item.id}`"
        class="group cursor-pointer">
        <div
          class="relative overflow-hidden rounded-xl ring-1 ring-white/10 transition-all duration-300 group-hover:ring-emerald-500/30 group-hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)]">
          <!-- 手機版用 imgMobile，桌面用 imgPc -->
          <NuxtImg
            :src="item.imgMobile ?? undefined"
            :alt="item.title"
            class="sm:hidden w-full h-30 object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy" />
          <NuxtImg
            :src="item.imgPc ?? undefined"
            :alt="item.title"
            class="hidden sm:block w-full h-40 md:h-45 object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy" />
          <div
            class="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
          <div class="absolute bottom-0 inset-x-0 p-3 sm:p-4">
            <div class="flex items-center gap-1.5 mb-1.5">
              <UBadge :color="getTagColor(item.tag)" variant="solid" size="xs">
                {{ item.tag }}
              </UBadge>
              <UBadge
                v-if="item.isClaimable && !item.isClaimed"
                color="success"
                variant="solid"
                size="xs">
                {{ $t('promo.claimable') }}
              </UBadge>
            </div>
            <div class="text-[13px] sm:text-[15px] font-bold text-white leading-tight">
              {{ item.title }}
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center py-10 text-white/40">
      <Icon name="i-lucide-party-popper" class="size-10 mb-2" />
      <span class="text-[14px]">{{ $t('promo.noPromo') }}</span>
    </div>

    <!-- 頁碼指示器 -->
    <div
      v-if="promoItems.length > PROMO_PER_PAGE"
      class="flex items-center justify-center gap-1.5 pt-1">
      <button
        v-for="i in promoMaxPage + 1"
        :key="i"
        type="button"
        class="h-1.5 rounded-full transition-all duration-300"
        :class="promoPage === i - 1 ? 'w-6 bg-emerald-400' : 'w-1.5 bg-white/20 hover:bg-white/40'"
        @click="promoPage = i - 1" />
    </div>
  </div>
</template>
<script setup lang="ts">
  const { getTagColor } = utsPromo();

  const loading = ref(true);

  interface PromoItem {
    id: number;
    title: string;
    imgPc: string | null;
    imgMobile: string | null;
    tag: string;
    startTime: string;
    endTime: string;
    enabled: number;
    isActive: boolean;
    isClaimed: boolean;
    isClaimable: boolean;
    rewardAmount: string;
    conditionType: string;
    conditionValue: string;
  }

  const promoItems = ref<PromoItem[]>([]);

  const fetchPromos = async () => {
    loading.value = true;
    try {
      const res = await useApi().getPromos({ activeOnly: 1, limit: 12 });
      if (res?.result?.items) {
        promoItems.value = res.result.items;
      }
    } catch (e) {
      console.error('[Promo] fetch failed', e);
    } finally {
      loading.value = false;
    }
  };

  const promoPage = ref(0);
  const PROMO_PER_PAGE = 3;
  const promoMaxPage = computed(() =>
    Math.max(0, Math.ceil(promoItems.value.length / PROMO_PER_PAGE) - 1),
  );
  const currentPageItems = computed(() => {
    const start = promoPage.value * PROMO_PER_PAGE;
    return promoItems.value.slice(start, start + PROMO_PER_PAGE);
  });

  onMounted(() => {
    fetchPromos();
  });
</script>
