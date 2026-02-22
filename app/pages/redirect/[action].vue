<template>
  <div class="p-6">
    <div class="text-sm opacity-70">{{ $t('auth.processingThirdParty') }}</div>
    <div v-if="errMsg" class="mt-3 text-red-600 text-sm">{{ errMsg }}</div>
  </div>
</template>
<script setup lang="ts">
  const route = useRoute();
  const { setToken, refreshUserData } = useAuth();

  const errMsg = ref('');

  const str = (v: unknown) =>
    typeof v === 'string' ? v : Array.isArray(v) ? String(v[0] ?? '') : '';

  const safePath = (p: string) => {
    if (!p) return '/';
    if (!p.startsWith('/')) return '/';
    if (p.startsWith('//')) return '/';
    return p;
  };

  onMounted(async () => {
    const action = str(route.params.action);
    const error = str(route.query.error);
    const errorDesc = str(route.query.error_description);

    if (error) {
      errMsg.value = `${action || 'oauth'} error: ${errorDesc}`;
      return;
    }

    const handlers: Record<string, () => Promise<void>> = {
      google: async () => {
        const code = str(route.query.code);
        const state = str(route.query.state);

        await useApi()
          .loginGoogle({ code, state })
          .then(async (res) => {
            await setToken(res.result.token);
            await refreshUserData();
            const to = safePath(String(res?.redirectAfter || '/'));
            // await navigateTo(to, { replace: true });
          });
      },
      line: async () => {},
    };

    handlers[action]?.();
  });
</script>
