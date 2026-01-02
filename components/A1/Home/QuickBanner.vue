<template>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <button
      v-for="item in items"
      :key="item.key"
      type="button"
      class="group text-left"
      @click="$emit('select', item)">
      <div
        class="relative overflow-hidden h-full rounded-2xl bg-[#253844]/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform duration-200 group-hover:-translate-y-[2px]">
        <!-- 只框圖片區（不含底部資訊列） -->
        <div
          class="pointer-events-none absolute inset-x-0 top-0 z-10 rounded-t-2xl border-2"
          :style="{
            borderColor: item.accentColor,
            height: `${imageHeight}px`,
          }" />

        <!-- 圖片區 -->
        <div class="relative" :style="{ height: `${imageHeight}px` }">
          <img
            :src="item.imageUrl"
            :alt="item.title"
            class="h-full w-full object-cover object-top" />

          <!-- 圖片底部一點暗遮罩（更像示意圖的層次） -->
          <div
            class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/35 to-transparent" />
        </div>

        <!-- 底部資訊列 -->
        <div class="flex py-3 items-center justify-between px-6">
          <div class="flex items-center gap-3">
            <span
              class="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-white/70">
              <i :class="item.icon" class="text-[16px]" />
            </span>

            <div class="text-[16px] font-extrabold tracking-wide text-white">
              {{ item.title }}
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="h-2.5 w-2.5 rounded-full bg-[#38D25E]" />
            <div class="text-[16px] font-extrabold text-white">
              {{ formatNumber(item.count) }}
            </div>
          </div>
        </div>

        <!-- hover 亮度 -->
        <div
          class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style="
            background: radial-gradient(
              circle at 30% 10%,
              rgba(255, 255, 255, 0.08),
              transparent 45%
            );
          " />
      </div>
    </button>
  </div>
</template>
<script setup lang="ts">
  type CategoryItem = {
    key: string;
    title: string;
    count: number | string;
    icon: string; // mdi class
    imageUrl: string;
    accentColor: string; // 例如 '#3B82F6' / '#22C55E'
  };

  const props = withDefaults(
    defineProps<{
      items?: CategoryItem[];
      imageHeight?: number; // 圖片高度
    }>(),
    {
      items: () => [
        {
          key: 'casino',
          title: '娱乐城',
          count: 54617,
          icon: 'mdi mdi-cards-playing-outline',
          imageUrl:
            'https://mediumrare.imgix.net/stake-casino-home-18-jul-25-en.png?w=700&h=460&fit=min&auto=format',
          accentColor: '#3B82F6', // 藍框
        },
        {
          key: 'sport',
          title: '体育',
          count: 9402,
          icon: 'mdi mdi-basketball',
          imageUrl:
            'https://mediumrare.imgix.net/stake-sports-home-18-jul-25-zh.png?w=350&h=230&fit=min&auto=format',
          accentColor: '#22C55E', // 綠框
        },
      ],
      imageHeight: 245,
    },
  );

  defineEmits<{
    (e: 'select', item: CategoryItem): void;
  }>();

  const imageHeight = props.imageHeight;

  function formatNumber(val: number | string) {
    const n = typeof val === 'string' ? Number(val.replace(/,/g, '')) : val;
    if (!Number.isFinite(n)) return String(val);
    return n.toLocaleString('en-US');
  }
</script>
