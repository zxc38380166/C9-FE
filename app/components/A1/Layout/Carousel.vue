<template>
  <UCarousel
    v-slot="{ item }"
    :items="items"
    loop
    :autoplay="{ delay: 2000 }"
    wheel-gestures
    :prev="{ variant: 'solid' }"
    :next="{ variant: 'solid' }"
    :ui="{ item: 'lg:basis-1/3 xl:basis-1/3 2xl:basis-1/3' }">
    <img :src="item" class="rounded-lg h-50 w-full" height="200" />
  </UCarousel>
</template>
<script setup lang="ts">
  const items = [
    'https://api.gofun8.com/upload/activity/30115/pc/2c26dd392ae8695dd4a45258ef8068b273b32c18.webp?random=1',
    'https://api.gofun8.com/upload/activity/30115/pc/2c26dd392ae8695dd4a45258ef8068b273b32c18.webp?random=1',
    'https://api.gofun8.com/upload/activity/30115/pc/2c26dd392ae8695dd4a45258ef8068b273b32c18.webp?random=1',
    'https://api.gofun8.com/upload/activity/30115/pc/2c26dd392ae8695dd4a45258ef8068b273b32c18.webp?random=1',
    'https://api.gofun8.com/upload/activity/30115/pc/2c26dd392ae8695dd4a45258ef8068b273b32c18.webp?random=1',
    'https://api.gofun8.com/upload/activity/30115/pc/2c26dd392ae8695dd4a45258ef8068b273b32c18.webp?random=1',
  ];
</script>
