<template>
  <div class="p-6">
    <div class="text-sm opacity-70">處理第三方登入中...</div>
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

        console.log(code, state, 'code, state ');

        await useApi()
          .loginGoogle({ code, state })
          .then(async (res) => {
            console.log(res, 'res');
            await setToken(res.result.token);
            await refreshUserData();
            const to = safePath(String(res?.redirectAfter || '/'));
            // await navigateTo(to, { replace: true });
          });
      },
      line: async () => {},
    };

    console.log(action, 'action');

    handlers[action]?.();
    console.log(handlers[action], 'handlers[action]');
  });
</script>
