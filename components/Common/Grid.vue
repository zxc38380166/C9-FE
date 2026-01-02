<template>
  <div ref="rootRef" class="w-full">
    <!-- Header -->
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-2 text-lg font-semibold text-white">
        <i v-if="titleIcon" :class="titleIcon" />
        <span>{{ title }}</span>
      </div>

      <!-- Arrow（桌機才顯示/可用） -->
      <div v-if="showArrow" class="flex gap-2">
        <button
          type="button"
          :disabled="!isDesktop || currentIndex === 0"
          @click="prev"
          class="flex h-8 w-8 items-center justify-center rounded-full text-white border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] transition-all duration-200 ease-out enabled:hover:bg-white/10 enabled:hover:border-white/35 enabled:hover:shadow-[0_6px_18px_rgba(0,0,0,0.35)] enabled:hover:-translate-y-[1px] enabled:active:translate-y-0 enabled:active:shadow-[0_3px_10px_rgba(0,0,0,0.25)] disabled:opacity-35 disabled:cursor-not-allowed disabled:grayscale-[0.4]">
          <i class="mdi mdi-chevron-left" />
        </button>

        <button
          type="button"
          :disabled="!isDesktop || isEnd"
          @click="next"
          class="flex h-8 w-8 items-center justify-center rounded-full text-white border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] transition-all duration-200 ease-out enabled:hover:bg-white/10 enabled:hover:border-white/35 enabled:hover:shadow-[0_6px_18px_rgba(0,0,0,0.35)] enabled:hover:-translate-y-[1px] enabled:active:translate-y-0 enabled:active:shadow-[0_3px_10px_rgba(0,0,0,0.25)] disabled:opacity-35 disabled:cursor-not-allowed disabled:grayscale-[0.4]">
          <i class="mdi mdi-chevron-right" />
        </button>
      </div>
    </div>

    <!-- Viewport -->
    <div
      ref="viewportRef"
      class="py-[5px] overflow-x-auto md:overflow-hidden snap-x snap-mandatory md:snap-none [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div class="flex md:transition-transform md:duration-300" :style="trackStyle">
        <!-- Card -->
        <div
          v-for="(item, idx) in items"
          :key="idKey ? item?.[idKey] || '' : idx"
          :data-index="idx"
          :style="cardWrapperStyle"
          :class="[
            'relative z-0 shrink-0 [will-change:transform] transition-transform duration-300 ease-out',
            // 手機：每張卡 snap 到左邊
            'snap-start',
            hoverEffect ? 'group hover:z-20 hover:scale-[1.025]' : '',
          ]">
          <!-- Card Inner（負責裁切） -->
          <ClientOnly>
            <div
              class="cursor-pointer overflow-hidden bg-[#1b2d38]"
              :class="[hoverEffect ? 'transition-shadow duration-300' : '']"
              :style="cardStyle">
              <img :src="getImg(item, idx)" class="h-full w-full object-cover" />
            </div>
            <!-- Bottom text -->
            <div class="mt-2 flex items-center gap-2 text-sm text-white">
              <span class="h-2 w-2 rounded-full bg-green-500" />
              {{ getBottomText(item, idx) }}
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  /* ---------- Types ---------- */
  interface GridItem {
    id: string | number;
    image: string;
    [key: string]: any;
  }

  /* ---------- Props ---------- */
  const props = defineProps<{
    title: string;
    titleIcon?: string;

    items: any;

    columns?: number; // 手動指定顯示數
    gap?: number;
    cardWidth?: number;
    cardRadius?: number;

    idKey?: string;
    bottomTextKey?: string;
    bottomTextValue?: (item: any, idx: number) => string;
    imgKey?: string;
    imgValue?: (item: any, idx: number) => string;
    showArrow?: boolean;
    hoverEffect?: boolean;
  }>();

  const getBottomText = (item: any, idx: number) => {
    if (props.bottomTextKey) return item?.[props.bottomTextKey] ?? '';
    if (typeof props.bottomTextValue === 'function') return props.bottomTextValue(item, idx) ?? '';
    return '';
  };

  const getImg = (item: any, idx: number) => {
    if (props.imgKey) return item?.[props.imgKey] ?? '';
    if (typeof props.imgValue === 'function') return props.imgValue(item, idx) ?? '';
    return '';
  };

  /* ---------- Refs ---------- */
  const rootRef = ref<HTMLElement | null>(null);
  const viewportRef = ref<HTMLElement | null>(null);

  const currentIndex = ref(0);
  const autoColumns = ref(1);

  const isDesktop = ref(false);

  /* ---------- Computed ---------- */
  const gap = computed(() => props.gap ?? 16);
  const cardWidth = computed(() => props.cardWidth ?? 160);

  /**
   * 真正使用的 columns
   * - 桌機：可自動算或 props.columns
   * - 手機：捲動模式其實不需要 columns（但 maxIndex/isEnd 還是可用）
   */
  const columns = computed(() => props.columns ?? autoColumns.value);

  const maxIndex = computed(() => Math.max(props.items.length - columns.value, 0));
  const isEnd = computed(() => currentIndex.value >= maxIndex.value);

  // ✅ 桌機才用 translateX；手機用原生 scroll，不做 transform
  const trackStyle = computed(() => {
    const style: Record<string, string> = { gap: `${gap.value}px` };

    if (isDesktop.value) {
      style.transform = `translateX(-${currentIndex.value * (cardWidth.value + gap.value)}px)`;
    } else {
      style.transform = `translateX(0px)`;
    }
    return style;
  });

  const cardWrapperStyle = computed(() => ({
    width: `${cardWidth.value}px`,
  }));

  const cardStyle = computed(() => ({
    height: 'auto',
    borderRadius: `${props.cardRadius ?? 12}px`,
  }));

  /* ---------- Helpers ---------- */
  const calcIsDesktop = () => {
    isDesktop.value = window.matchMedia('(min-width: 768px)').matches; // Tailwind md
  };

  const calcAutoColumns = () => {
    if (props.columns) return;
    if (!isDesktop.value) {
      // 手機捲動不需要算 columns，但給個保底避免 maxIndex 算錯
      autoColumns.value = 1;
      return;
    }

    const width = rootRef.value?.clientWidth ?? 0;
    if (!width) return;

    autoColumns.value = Math.max(
      Math.floor((width + gap.value) / (cardWidth.value + gap.value)),
      1,
    );
  };

  const scrollToIndex = (idx: number) => {
    const el = viewportRef.value;
    if (!el) return;

    // 每張卡寬度 + gap
    const step = cardWidth.value + gap.value;
    el.scrollTo({ left: idx * step, behavior: 'smooth' });
  };

  // 手機：捲動時同步 currentIndex，讓 disabled/isEnd 正常
  let rafId = 0;
  const onViewportScroll = () => {
    if (isDesktop.value) return;

    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const el = viewportRef.value;
      if (!el) return;

      const step = cardWidth.value + gap.value;
      const idx = Math.round(el.scrollLeft / step);
      currentIndex.value = Math.max(0, Math.min(idx, props.items.length - 1));
    });
  };

  /* ---------- Methods ---------- */
  const prev = () => {
    const nextIdx = Math.max(currentIndex.value - 1, 0);
    currentIndex.value = nextIdx;

    if (!isDesktop.value) {
      scrollToIndex(nextIdx);
    }
  };

  const next = () => {
    const nextIdx = Math.min(currentIndex.value + 1, maxIndex.value);
    currentIndex.value = nextIdx;

    if (!isDesktop.value) {
      scrollToIndex(nextIdx);
    }
  };

  /* ---------- Lifecycle ---------- */
  onMounted(async () => {
    calcIsDesktop();
    await nextTick();
    calcAutoColumns();

    window.addEventListener('resize', calcIsDesktop);
    window.addEventListener('resize', calcAutoColumns);

    viewportRef.value?.addEventListener('scroll', onViewportScroll, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener('resize', calcIsDesktop);
    window.removeEventListener('resize', calcAutoColumns);

    viewportRef.value?.removeEventListener('scroll', onViewportScroll);
    cancelAnimationFrame(rafId);
  });

  /* ---------- Watch ---------- */
  watch(
    () => [props.cardWidth, props.gap, props.columns, props.items.length],
    async () => {
      await nextTick();
      calcIsDesktop();
      calcAutoColumns();

      currentIndex.value = 0;

      // 切換資料/尺寸時，把手機 scroll 拉回起點
      if (!isDesktop.value) {
        viewportRef.value?.scrollTo({ left: 0, behavior: 'auto' });
      }
    },
  );
</script>
