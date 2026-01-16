<template>
  <div>
    <component :is />
  </div>
</template>
<script setup>
const { is } = vueVersion({
  // layoutMap 會在 vite 擷取路徑禁止使用模板語言
  A1: () => import("@/components/A1/Home/index.vue"),
  A2: () => import("@/components/A1/Home/index.vue"),
});
</script>
