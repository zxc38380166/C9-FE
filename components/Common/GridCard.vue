<template>
  <div class="w-full">
    <!-- Header -->
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-2 text-lg font-semibold text-white">
        <i v-if="titleIcon" :class="titleIcon" />
        <span>{{ title }}</span>
      </div>

      <!-- Arrows（桌機顯示，手機可選：目前手機隱藏） -->
      <div class="gap-2 flex">
        <button
          class="size-[28px] md:size-[36px] rounded-full border border-white/15 bg-white/10 text-white flex items-center justify-center disabled:opacity-35 disabled:cursor-not-allowed"
          :disabled="isBeginning"
          @click="goPrev">
          <i class="mdi mdi-chevron-left" />
        </button>
        <button
          class="size-[28px] md:size-[36px] rounded-full border border-white/15 bg-white/10 text-white flex items-center justify-center disabled:opacity-35 disabled:cursor-not-allowed"
          :disabled="isEnd"
          @click="goNext">
          <i class="mdi mdi-chevron-right" />
        </button>
      </div>
    </div>

    <!-- Splide -->
    <ClientOnly>
      <Splide
        ref="splideRef"
        :options="splideOptions"
        @splide:mounted="onSplideMounted"
        @splide:moved="onSplideMoved"
        @splide:updated="onSplideMoved"
        class="promo-splide">
        <SplideSlide v-for="item in items" :key="item.id">
          <div
            class="h-full cursor-pointer rounded-xl bg-[#1f3642] p-5"
            @click="$emit('select', item)">
            <div class="flex items-center">
              <!-- Text Left -->
              <div v-if="textPosition === 'left'" class="flex-1 pr-4 text-white">
                <el-tag
                  class="mb-2 inline-flex items-center rounded-md border !border-[#3f7a8f] !bg-[#2e5d6f]/90 px-2 py-[2px] text-xs font-semibold !text-white">
                  促销活动
                </el-tag>

                <h3 class="mb-2 text-xl font-semibold">{{ item.title }}</h3>

                <p v-if="item.description" class="mb-2 text-white/70 line-clamp-2">
                  {{ item.description }}
                </p>

                <span class="text-sm font-semibold hover:underline">阅读更多</span>
              </div>

              <!-- Image -->
              <div class="h-[120px] w-[120px] shrink-0">
                <img
                  :src="item.image"
                  class="h-full w-full rounded-xl object-cover"
                  loading="lazy" />
              </div>

              <!-- Text Right -->
              <div v-if="textPosition === 'right'" class="flex-1 pl-4 text-white">
                <el-tag
                  class="mb-2 inline-flex items-center rounded-md border !border-[#3f7a8f] !bg-[#2e5d6f]/90 px-2 py-[2px] text-xs font-semibold !text-white">
                  促销活动
                </el-tag>

                <h3 class="mb-2 text-xl font-semibold">{{ item.title }}</h3>

                <p v-if="item.description" class="mb-2 text-white/70 line-clamp-2">
                  {{ item.description }}
                </p>

                <span class="text-sm font-semibold hover:underline">阅读更多</span>
              </div>
            </div>
          </div>
        </SplideSlide>
      </Splide>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
  type PromoItem = {
    id: string | number;
    image: string;
    title: string;
    description?: string;
  };

  const { isDesktop } = useDevice();

  const props = withDefaults(
    defineProps<{
      title: string;
      titleIcon?: string;
      items: PromoItem[];

      textPosition?: 'left' | 'right';

      /** 桌機顯示幾張 */
      desktopPerPage?: number;

      /** 手機顯示幾張（可用小數：1.2 代表露出下一張） */
      mobilePerPage?: number;

      /** 每次移動幾張（建議 1） */
      perMove?: number;

      /** gap(px) */
      gap?: number;

      /** 手機左右 padding（讓內容不要貼邊） */
      mobilePadding?: number;
    }>(),
    {
      textPosition: 'left',
      desktopPerPage: 2,
      mobilePerPage: 1,
      perMove: 1,
      gap: 16,
      mobilePadding: 16,
    },
  );

  defineEmits<{
    (e: 'select', item: PromoItem): void;
  }>();

  const splideRef = ref<any>(null);

  const isBeginning = ref(true);
  const isEnd = ref(false);

  const splideOptions = computed(() => {
    return {
      type: 'slide',
      rewind: false,
      pagination: false,
      arrows: false,
      drag: true,
      speed: 420,

      gap: `${props.gap}px`,
      perMove: props.perMove,

      // ✅ 桌機：perPage
      perPage: props.desktopPerPage,

      // ✅ 手機：同樣用 perPage（百分比寬度），填滿容器
      breakpoints: {
        767: {
          perPage: props.mobilePerPage,
          // 讓手機左右有內距（視覺更像你原本 padding）
          padding: { left: `${props.mobilePadding}px`, right: `${props.mobilePadding}px` },
          gap: `${props.gap}px`,
        },
      },
    };
  });

  const syncEdgeState = () => {
    const splide = splideRef.value?.splide;
    if (!splide) return;

    const idx = splide.index ?? 0;
    const end = splide.length ? splide.length - 1 : 0;

    // 注意：Splide perPage 可能是小數（例如 1.2），我們用 floor 計算最合理
    const perPage = Number(splide.options?.perPage ?? 1);
    const perPageInt = Math.max(1, Math.floor(perPage));
    const maxStart = Math.max(end - (perPageInt - 1), 0);

    isBeginning.value = idx <= 0;
    isEnd.value = idx >= maxStart;
  };

  const onSplideMounted = () => syncEdgeState();
  const onSplideMoved = () => syncEdgeState();

  const goPrev = () => {
    splideRef.value?.splide?.go('<');
  };

  const goNext = () => {
    splideRef.value?.splide?.go('>');
  };
</script>

<style scoped>
  .promo-splide :deep(.splide__slide) {
    outline: none;
  }
</style>
