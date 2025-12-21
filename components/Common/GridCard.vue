<template>
  <div class="w-full">
    <!-- Header -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-2 text-lg font-semibold text-white">
        <i v-if="titleIcon" :class="titleIcon" />
        <span>{{ title }}</span>
      </div>

      <!-- Arrows -->
      <div class="flex gap-2">
        <button
          class="nav-btn size-[36px] bg-white/10 border border-white/15 rounded-[9999px] text-[white] flex justify-center items-center disabled:opacity-35 disabled:cursor-not-allowed"
          :disabled="currentIndex === 0"
          @click="prev">
          <i class="mdi mdi-chevron-left" />
        </button>
        <button
          class="nav-btn size-[36px] bg-white/10 border border-white/15 rounded-[9999px] text-[white] flex justify-center items-center disabled:opacity-35 disabled:cursor-not-allowed"
          :disabled="isEnd"
          @click="next">
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
          class="shrink-0"
          :class="index % 2 ? 'px-3' : ''"
          :style="{ width: cardWidthPx }">
          <div class="flex h-full items-center rounded-xl bg-[#1f3642] p-5">
            <!-- Text Left -->
            <div v-if="textPosition === 'left'" class="flex-1 pr-4 text-white">
              <!-- Promo Tag -->
              <el-tag
                class="mb-2 inline-flex items-center rounded-md border !border-[#3f7a8f] !bg-[#2e5d6f]/90 px-2 py-[2px] text-xs font-semibold !text-white">
                促销活动
              </el-tag>

              <h3 class="mb-2 text-xl font-semibold">
                {{ item.title }}
              </h3>

              <p v-if="item.description" class="mb-2 text-white/70">
                {{ item.description }}
              </p>

              <span class="cursor-pointer text-sm font-semibold hover:underline"> 阅读更多 </span>
            </div>

            <!-- Image -->
            <div class="h-[120px] w-[120px] shrink-0">
              <img :src="item.image" class="h-full w-full rounded-xl object-cover" />
            </div>

            <!-- Text Right -->
            <div v-if="textPosition === 'right'" class="flex-1 pl-4 text-white">
              <!-- Promo Tag -->
              <el-tag
                class="mb-2 inline-flex items-center rounded-md border border-[#3f7a8f] bg-[#2e5d6f]/90 px-2 py-[2px] text-xs font-semibold text-white">
                促销活动
              </el-tag>

              <h3 class="mb-2 text-xl font-semibold">
                {{ item.title }}
              </h3>

              <p v-if="item.description" class="mb-2 text-white/70">
                {{ item.description }}
              </p>

              <span class="cursor-pointer text-sm font-semibold hover:underline"> 阅读更多 </span>
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
    perPage?: number;
    step?: number;
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
