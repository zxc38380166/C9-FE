<template>
  <NuxtLayout :name="config($hostname).layout">
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup>
  import config from './site.config';
  const { $hostname } = useNuxtApp();
</script>
