<template>
  <div class="w-full">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2 text-white text-lg font-semibold">
        <i v-if="titleIcon" :class="titleIcon" />
        <span>{{ title }}</span>
      </div>

      <!-- Arrows -->
      <div class="flex gap-2">
        <button class="nav-btn" :disabled="currentIndex === 0" @click="prev">
          <i class="mdi mdi-chevron-left" />
        </button>
        <button class="nav-btn" :disabled="isEnd" @click="next">
          <i class="mdi mdi-chevron-right" />
        </button>
      </div>
    </div>

    <!-- Viewport -->
    <div class="overflow-hidden">
      <div class="flex transition-transform duration-300" :style="trackStyle">
        <!-- Card -->
        <div
          v-for="(item, index) in items"
          :key="item.id"
          :class="[index % 2 ? 'px-3' : '']"
          class="shrink-0"
          :style="{ width: cardWidthPx }">
          <div class="bg-[#1f3642] rounded-xl p-5 h-full flex items-center">
            <!-- Text Left -->
            <div v-if="textPosition === 'left'" class="flex-1 pr-4 text-white">
              <span class="inline-block mb-2 px-2 py-1 text-xs rounded bg-white text-black">
                促销活动
              </span>

              <h3 class="text-xl font-semibold mb-2">
                {{ item.title }}
              </h3>

              <p v-if="item.description" class="text-white/70 mb-2">
                {{ item.description }}
              </p>

              <span class="text-sm font-semibold cursor-pointer"> 阅读更多 </span>
            </div>

            <!-- Image -->
            <div class="w-[120px] h-[120px] shrink-0">
              <img :src="item.image" class="w-full h-full object-cover rounded-xl" />
            </div>

            <!-- Text Right -->
            <div v-if="textPosition === 'right'" class="flex-1 pl-4 text-white">
              <span class="inline-block mb-2 px-2 py-1 text-xs rounded bg-white text-black">
                促销活动
              </span>

              <h3 class="text-xl font-semibold mb-2">
                {{ item.title }}
              </h3>

              <p v-if="item.description" class="text-white/70 mb-2">
                {{ item.description }}
              </p>

              <span class="text-sm font-semibold cursor-pointer"> 阅读更多 </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';

  /* ---------- Types ---------- */

  interface PromoItem {
    id: string | number;
    image: string;
    title: string;
    description?: string;
  }

  /* ---------- Props ---------- */

  const props = defineProps<{
    title: string;
    titleIcon?: string;

    items: PromoItem[];

    /** 每頁顯示幾張（預設 3） */
    perPage?: number;

    /** 每次滑動幾張（預設等於 perPage） */
    step?: number;

    /** 文字位置 */
    textPosition?: 'left' | 'right';
  }>();

  /* ---------- State ---------- */

  const currentIndex = ref(0);

  /* ---------- Computed ---------- */

  const perPage = computed(() => props.perPage ?? 3);
  const step = computed(() => props.step ?? perPage.value);

  const cardWidthPx = computed(() => `${100 / perPage.value}%`);

  const maxIndex = computed(() => Math.max(props.items.length - perPage.value, 0));

  const isEnd = computed(() => currentIndex.value >= maxIndex.value);

  const trackStyle = computed(() => ({
    transform: `translateX(-${(currentIndex.value * 100) / perPage.value}%)`,
  }));

  /* ---------- Methods ---------- */

  const prev = () => {
    currentIndex.value = Math.max(currentIndex.value - step.value, 0);
  };

  const next = () => {
    currentIndex.value = Math.min(currentIndex.value + step.value, maxIndex.value);
  };
</script>

<style scoped>
  .nav-btn {
    width: 36px;
    height: 36px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
</style>
