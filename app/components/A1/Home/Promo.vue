<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between px-1">
      <div class="flex items-center gap-2">
        <Icon name="noto:party-popper" class="text-[20px] sm:text-[24px]" />
        <span class="text-[16px] sm:text-[20px] font-bold text-white">精選活動</span>
        <UBadge color="error" variant="subtle" size="xs" class="ml-1">HOT</UBadge>
      </div>
      <div class="flex items-center gap-1.5">
        <button
          type="button"
          class="size-7 sm:size-8 flex items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          @click="promoPage > 0 && promoPage--">
          <UIcon name="i-lucide-chevron-left" class="size-4" />
        </button>
        <button
          type="button"
          class="size-7 sm:size-8 flex items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          @click="promoPage < promoMaxPage && promoPage++">
          <UIcon name="i-lucide-chevron-right" class="size-4" />
        </button>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <div v-for="item in currentPageItems" :key="item.title" class="group cursor-pointer">
        <div
          class="relative overflow-hidden rounded-xl ring-1 ring-white/10 transition-all duration-300 group-hover:ring-emerald-500/30 group-hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)]">
          <NuxtImg
            :src="item.img"
            :alt="item.title"
            class="w-full h-30 sm:h-40 md:h-45 object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy" />
          <div
            class="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
          <div class="absolute bottom-0 inset-x-0 p-3 sm:p-4">
            <UBadge :color="item.badgeColor" variant="subtle" size="xs" class="mb-1.5">
              {{ item.badge }}
            </UBadge>
            <div class="text-[13px] sm:text-[15px] font-bold text-white leading-tight">
              {{ item.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 頁碼指示器 -->
    <div class="flex items-center justify-center gap-1.5 pt-1">
      <button
        v-for="i in promoMaxPage + 1"
        :key="i"
        type="button"
        class="h-1.5 rounded-full transition-all duration-300"
        :class="
          promoPage === i - 1 ? 'w-6 bg-emerald-400' : 'w-1.5 bg-white/20 hover:bg-white/40'
        "
        @click="promoPage = i - 1" />
    </div>
  </div>
</template>
<script setup lang="ts">
  const promoItems = ref([
    {
      title: '首儲加碼 100% 回饋',
      badge: '限時',
      badgeColor: 'error' as const,
      img: 'https://api.gofun8.com/upload/activity/30115/pc/2c26dd392ae8695dd4a45258ef8068b273b32c18.webp?random=1',
    },
    {
      title: '每日簽到領獎金',
      badge: '每日',
      badgeColor: 'warning' as const,
      img: 'https://api.gofun8.com/upload/activity/30115/pc/2c26dd392ae8695dd4a45258ef8068b273b32c18.webp?random=2',
    },
    {
      title: '好友推薦享紅利',
      badge: '推薦',
      badgeColor: 'success' as const,
      img: 'https://api.gofun8.com/upload/activity/30115/pc/2c26dd392ae8695dd4a45258ef8068b273b32c18.webp?random=3',
    },
    {
      title: 'VIP 專屬週返水',
      badge: 'VIP',
      badgeColor: 'info' as const,
      img: 'https://api.gofun8.com/upload/activity/30115/pc/2c26dd392ae8695dd4a45258ef8068b273b32c18.webp?random=4',
    },
    {
      title: '體育賽事加碼投注',
      badge: '體育',
      badgeColor: 'success' as const,
      img: 'https://api.gofun8.com/upload/activity/30115/pc/2c26dd392ae8695dd4a45258ef8068b273b32c18.webp?random=5',
    },
    {
      title: '老虎機錦標賽',
      badge: '賽事',
      badgeColor: 'warning' as const,
      img: 'https://api.gofun8.com/upload/activity/30115/pc/2c26dd392ae8695dd4a45258ef8068b273b32c18.webp?random=6',
    },
  ]);

  const promoPage = ref(0);
  const PROMO_PER_PAGE = 3;
  const promoMaxPage = computed(() =>
    Math.max(0, Math.ceil(promoItems.value.length / PROMO_PER_PAGE) - 1),
  );
  const currentPageItems = computed(() => {
    const start = promoPage.value * PROMO_PER_PAGE;
    return promoItems.value.slice(start, start + PROMO_PER_PAGE);
  });
</script>
