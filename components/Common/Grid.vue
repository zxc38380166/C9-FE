<template>
  <div ref="rootRef" class="w-full">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2 text-white text-lg font-semibold">
        <i v-if="titleIcon" :class="titleIcon" />
        <span>{{ title }}</span>
      </div>

      <!-- Arrow -->
      <div v-if="showArrow" class="flex gap-2">
        <button class="arrow-btn" :disabled="currentIndex === 0" @click="prev">
          <i class="mdi mdi-chevron-left" />
        </button>
        <button class="arrow-btn" :disabled="isEnd" @click="next">
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
          class="shrink-0 game-card-wrapper"
          :class="{ 'hover-effect': hoverEffect }"
          :style="cardWrapperStyle">
          <!-- Card Inner（負責裁切） -->
          <div
            class="bg-[#1b2d38] overflow-hidden cursor-pointer game-card-inner"
            :style="cardStyle">
            <img :src="item.image" class="w-full h-full object-cover" />
          </div>

          <!-- Bottom text -->
          <div class="flex items-center gap-2 mt-2 text-sm text-white">
            <span class="w-2 h-2 rounded-full bg-green-500" />
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
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

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
    height: '220px',
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

<style scoped>
  /* ---------- Arrow Button ---------- */

  .arrow-btn {
    width: 32px;
    height: 32px;
    border-radius: 999px;

    background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));

    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #ffffff;

    display: flex;
    align-items: center;
    justify-content: center;

    transition:
      background-color 0.25s ease,
      transform 0.2s ease,
      box-shadow 0.25s ease,
      border-color 0.25s ease;
  }

  .arrow-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.35);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
    transform: translateY(-1px);
  }

  .arrow-btn:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
  }

  .arrow-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    filter: grayscale(0.4);
  }

  /* ---------- Card Hover Effect（外框放大） ---------- */

  .game-card-wrapper {
    position: relative;
    z-index: 1;
    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease;
    will-change: transform;
  }

  .hover-effect:hover {
    transform: scale(1.05);
    z-index: 5;
  }

  /* 內層陰影 */
  .hover-effect:hover .game-card-inner {
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.45);
  }

  /* 輕微搖晃 */
  .hover-effect:hover {
    animation: subtle-wiggle 0.35s ease-in-out;
  }

  @keyframes subtle-wiggle {
    0% {
      transform: scale(1.05) rotate(0deg);
    }
    25% {
      transform: scale(1.05) rotate(-0.5deg);
    }
    50% {
      transform: scale(1.05) rotate(0.5deg);
    }
    75% {
      transform: scale(1.05) rotate(-0.3deg);
    }
    100% {
      transform: scale(1.05) rotate(0deg);
    }
  }
</style>
