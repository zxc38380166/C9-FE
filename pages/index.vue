<template>
  <div class="">
    {{ store.getUserDetail.test }}
    <p>Width: {{ width }}</p>
    <p>Height: {{ height }}</p>
  </div>
</template>
<script setup>
  import { useWindowSize } from '@vueuse/core';

  const { width, height } = useWindowSize();

  const store = useStore();
</script>
