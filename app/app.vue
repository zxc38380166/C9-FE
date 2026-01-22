<template>
  <div>
    <UApp :toaster="{ position: 'top-right' }">
      <NuxtLayout :name="useConfig().layout">
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>
<script setup>
  usePreventZoom();

  const store = useStore();

  try {
    const [userDetailRes, gameProviderRes, enumsRes, countryCodesRes] = await Promise.all([
      useApi().getUserDetailSsr({}),
      useApi().getGameProvider({}),
      useApi().getEnums({}),
      useApi().getCountryCodesSsr(),
    ]);

    store.setUserDetail(userDetailRes.data.value.result);
    store.setCountryCodes(countryCodesRes.data.value.result);
    store.setEnums(enumsRes.data.value.result);
    store.setIsReady(true);
  } catch (err) {
    console.error('[prefetch] failed', err);
  }
</script>
