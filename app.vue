<template>
  <NuxtLayout :name="config($hostname).layout">
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup>
  usePreventZoom();
  import config from './site.config';
  const { $hostname } = useNuxtApp();

  const store = useStore();

  try {
    const [userDetailRes, gameProviderRes] = await Promise.all([
      useApi().getUserDetail({}),
      useApi().getGameProvider({ test: 'asdf' }),
    ]);

    store.setUserDetail(userDetailRes.data.value.data);
    console.log(userDetailRes.data.value.data, 'r1');
  } catch (err) {
    console.error('[prefetch] failed', err);
  }
</script>
