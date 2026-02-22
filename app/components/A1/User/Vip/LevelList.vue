<template>
  <div class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-8 space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Icon name="noto:chart-increasing" class="text-[20px] sm:text-[24px]" />
        <span class="text-[16px] sm:text-[20px] font-bold text-white">{{ $t('vip.allLevels') }}</span>
      </div>
      <div class="flex items-center gap-1.5">
        <button
          class="size-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
          :class="
            canScrollLeft
              ? 'bg-white/8 hover:bg-white/12 text-white/70'
              : 'bg-white/3 text-white/15 cursor-not-allowed'
          "
          :disabled="!canScrollLeft"
          @click="scrollLevels('left')">
          <Icon name="i-lucide-chevron-left" class="size-4" />
        </button>
        <button
          class="size-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
          :class="
            canScrollRight
              ? 'bg-white/8 hover:bg-white/12 text-white/70'
              : 'bg-white/3 text-white/15 cursor-not-allowed'
          "
          :disabled="!canScrollRight"
          @click="scrollLevels('right')">
          <Icon name="i-lucide-chevron-right" class="size-4" />
        </button>
      </div>
    </div>
    <div
      ref="levelScrollRef"
      class="overflow-x-auto scrollbar-hide -mx-1 px-1"
      @scroll="updateScrollState">
      <div class="flex gap-3 py-1 w-max">
        <div
          v-for="lv in allLevels"
          :key="lv.level"
          class="w-37.5 shrink-0 rounded-xl p-4 space-y-2.5 transition-all duration-300"
          :class="
            lv.level === currentLevel
              ? `${getTierBgClass(lv.tier)} ring-2 ${getTierRingClass(lv.tier)} shadow-lg`
              : 'bg-white/3 ring-1 ring-white/6'
          ">
          <div class="flex items-center justify-between">
            <UBadge :color="getTierBadgeColor(lv.tier)" variant="solid" class="text-[10px]">
              Lv.{{ lv.level }}
            </UBadge>
            <Icon
              v-if="lv.level === currentLevel"
              name="i-lucide-check-circle"
              class="size-4 text-emerald-400" />
            <Icon
              v-else-if="lv.level < currentLevel"
              name="i-lucide-circle-check-big"
              class="size-4 text-white/20" />
          </div>
          <div class="text-[14px] sm:text-[15px] font-bold text-white">
            {{ lv.name }}
          </div>
          <div class="text-[11px] text-white/40">
            {{ $t('vip.minDeposit') }}: ${{ formatNumber(lv.minChip) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface VipLevel {
    level: number;
    name: string;
    tier: string;
    minChip: string;
    relegationChip: string;
  }

  const props = defineProps<{
    allLevels: VipLevel[];
    currentLevel: number;
  }>();

  const { formatNumber } = utsFormat();
  const { getStyle } = utsVipTier();

  // ---- Tier 樣式 ----
  const getTierBgClass = (tier: string) => getStyle(tier).bg;
  const getTierRingClass = (tier: string) => getStyle(tier).ring;
  const getTierBadgeColor = (tier: string) => getStyle(tier).badgeColor as any;

  // ---- 捲動 ----
  const levelScrollRef = useTemplateRef<HTMLElement>('levelScrollRef');
  const canScrollLeft = ref(false);
  const canScrollRight = ref(false);

  const updateScrollState = () => {
    const el = levelScrollRef.value;
    if (!el) return;
    canScrollLeft.value = el.scrollLeft > 0;
    canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
  };

  const scrollLevels = (dir: 'left' | 'right') => {
    const el = levelScrollRef.value;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -330 : 330, behavior: 'smooth' });
  };

  watch(() => props.allLevels, () => nextTick(updateScrollState));



</script>
