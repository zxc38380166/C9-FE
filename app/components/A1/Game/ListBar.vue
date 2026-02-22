<template>
  <UCarousel
    ref="UCarouselRef"
    :slidesToScroll="1.5"
    v-slot="{ item }"
    :items="items"
    :style="{ '--spacing': '2.5px' }"
    :ui="{ item: 'basis-1/3 lg:basis-1/10' }">
    <NuxtImg :src="getGameMappingImg(item)" class="basis-1/3 rounded-lg" />
    <div class="flex font-bold items-center gap-1 mt-1">
      <Icon name="material-symbols:person-rounded" class="text-[#36d25e]" />
      <span class="text-[12px]"> 1 <span class="text-[white]/70"> {{ $t('game.playing') }} </span> </span>
    </div>
  </UCarousel>
</template>
<script setup lang="ts">
  type Action = 'prev' | 'next';

  const { items } = defineProps<{
    items: GameItem[];
  }>();

  const { getGameMappingImg } = useGame();
  const UCarouselRef = useTemplateRef('UCarouselRef');

  function getApi() {
    const api = (UCarouselRef.value as any)?.emblaApi;
    return api || null;
  }

  const toggle = (action: Action) => {
    const api = getApi();
    if (!api) return { canPrev: false, canNext: false };

    const canPrev = api.canScrollPrev();
    const canNext = api.canScrollNext();

    if (action === 'prev' && canPrev) api.scrollPrev();
    if (action === 'next' && canNext) api.scrollNext();

    // scroll 後再讀一次最新狀態
    return new Promise<{ canPrev: boolean; canNext: boolean }>((resolve) => {
      nextTick(() => {
        resolve({
          canPrev: api.canScrollPrev(),
          canNext: api.canScrollNext(),
        });
      });
    });
  };

  export type GameListBarExposed = {
    toggle: (
      action: 'prev' | 'next',
    ) => Promise<{ canPrev: boolean; canNext: boolean }> | { canPrev: boolean; canNext: boolean };
  };

  defineExpose({
    UCarouselRef,
    toggle,
  });
</script>
