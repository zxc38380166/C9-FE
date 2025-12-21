<template>
  <div ref="rootRef" class="w-full">
    <!-- Header -->
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-2 text-lg font-semibold text-white">
        <i v-if="titleIcon" :class="titleIcon" />
        <span>{{ title }}</span>
      </div>

      <!-- Arrow -->
      <div v-if="showArrow" class="flex gap-2">
        <button
          type="button"
          :disabled="currentIndex === 0"
          @click="prev"
          class="flex h-8 w-8 items-center justify-center rounded-full text-white border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] transition-all duration-200 ease-out enabled:hover:bg-white/10 enabled:hover:border-white/35 enabled:hover:shadow-[0_6px_18px_rgba(0,0,0,0.35)] enabled:hover:-translate-y-[1px] enabled:active:translate-y-0 enabled:active:shadow-[0_3px_10px_rgba(0,0,0,0.25)] disabled:opacity-35 disabled:cursor-not-allowed disabled:grayscale-[0.4]">
          <i class="mdi mdi-chevron-left" />
        </button>

        <button
          type="button"
          :disabled="isEnd"
          @click="next"
          class="flex h-8 w-8 items-center justify-center rounded-full text-white border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] transition-all duration-200 ease-out enabled:hover:bg-white/10 enabled:hover:border-white/35 enabled:hover:shadow-[0_6px_18px_rgba(0,0,0,0.35)] enabled:hover:-translate-y-[1px] enabled:active:translate-y-0 enabled:active:shadow-[0_3px_10px_rgba(0,0,0,0.25)] disabled:opacity-35 disabled:cursor-not-allowed disabled:grayscale-[0.4]">
          <i class="mdi mdi-chevron-right" />
        </button>
      </div>
    </div>

    <!-- Viewport -->
    <div class="overflow-hidden py-[5px]">
      <div class="flex transition-transform duration-300" :style="trackStyle">
        <!-- Card -->
        <div
          v-for="item in items"
          :key="item.id"
          :style="cardWrapperStyle"
          :class="[
            // 原本 .game-card-wrapper
            'relative z-0 shrink-0 [will-change:transform] transition-transform duration-300 ease-out',
            // hoverEffect 開關：原本 .hover-effect + 陰影
            hoverEffect ? 'group hover:z-20  hover:scale-[1.025]' : '',
          ]">
          <!-- Card Inner（負責裁切） -->
          <div
            class="cursor-pointer overflow-hidden bg-[#1b2d38]"
            :class="[hoverEffect ? 'transition-shadow duration-300 ' : '']"
            :style="cardStyle">
            <img :src="item.image" class="h-full w-full object-cover" />
          </div>

          <!-- Bottom text -->
          <div class="mt-2 flex items-center gap-2 text-sm text-white">
            <span class="h-2 w-2 rounded-full bg-green-500" />
            <span v-if="bottomTextKey">
              {{ item[bottomTextKey] }}
            </span>
          </div>
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

    items: GridItem[];

    columns?: number; // 手動指定顯示數
    gap?: number;
    cardWidth?: number;
    cardRadius?: number;

    bottomTextKey?: string;
    showArrow?: boolean;
    hoverEffect?: boolean; // 👈 hover 動畫開關
  }>();

  /* ---------- Refs ---------- */
  const rootRef = ref<HTMLElement | null>(null);
  const currentIndex = ref(0);
  const autoColumns = ref(1);

  /* ---------- Computed ---------- */
  const gap = computed(() => props.gap ?? 16);
  const cardWidth = computed(() => props.cardWidth ?? 160);

  /**
   * 真正使用的 columns
   * - 有傳 props.columns → 用它
   * - 沒傳 → 自動計算
   */
  const columns = computed(() => props.columns ?? autoColumns.value);

  const maxIndex = computed(() => Math.max(props.items.length - columns.value, 0));
  const isEnd = computed(() => currentIndex.value >= maxIndex.value);

  const trackStyle = computed(() => ({
    transform: `translateX(-${currentIndex.value * (cardWidth.value + gap.value)}px)`,
    gap: `${gap.value}px`,
  }));

  const cardWrapperStyle = computed(() => ({
    width: `${cardWidth.value}px`,
  }));

  const cardStyle = computed(() => ({
    height: 'auto',
    borderRadius: `${props.cardRadius ?? 12}px`,
  }));

  /* ---------- Methods ---------- */
  const calcAutoColumns = () => {
    if (props.columns) return;

    const width = rootRef.value?.clientWidth ?? 0;
    if (!width) return;

    autoColumns.value = Math.max(
      Math.floor((width + gap.value) / (cardWidth.value + gap.value)),
      1,
    );
  };

  const prev = () => {
    currentIndex.value = Math.max(currentIndex.value - 1, 0);
  };

  const next = () => {
    currentIndex.value = Math.min(currentIndex.value + 1, maxIndex.value);
  };

  /* ---------- Lifecycle ---------- */
  onMounted(() => {
    calcAutoColumns();
    window.addEventListener('resize', calcAutoColumns);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', calcAutoColumns);
  });

  /* ---------- Watch ---------- */
  watch(
    () => [props.cardWidth, props.gap, props.columns],
    () => {
      calcAutoColumns();
      currentIndex.value = 0;
    },
  );
</script>
