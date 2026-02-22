<template>
  <div>
    <component :is />
  </div>
</template>
<script setup>
  const { is } = vueVersion({
    A1: () => import('@/components/A1/User/Transaction/index.vue'),
  });
</script>
