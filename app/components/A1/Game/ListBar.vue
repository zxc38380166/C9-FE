<template>
  <UCarousel
    ref="UCarouselRef"
    :slidesToScroll="1.5"
    v-slot="{ item }"
    :items="carouselItems"
    :style="{ '--spacing': '2.5px' }"
    :ui="{ item: 'basis-1/3 lg:basis-1/10' }">
    <img :src="item" class="basis-1/3 rounded-lg" />
    <div class="flex font-bold items-center gap-1 mt-1">
      <Icon name="material-symbols:person-rounded" class="text-[#36d25e]" />
      <span class="text-[12px]"> 1 <span class="text-[white]/70"> 在玩 </span> </span>
    </div>
  </UCarousel>
</template>
<script setup lang="ts">
  const { carouselItems = [] } = defineProps<{
    carouselItems: string[];
  }>();

  const UCarouselRef = useTemplateRef('UCarouselRef');

  defineExpose({ UCarouselRef });
</script>
