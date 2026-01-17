export function useAuth() {
  const store = useStore();

  // SSR + CSR 都可用
  const token = useCookie<string | null>('token', {
    path: '/',
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    maxAge: 60 * 60 * 24, // 48 小時（秒）
  });

  const isLogin = computed(() => !!token.value);

  const refreshUserData = async () => {
    await nextTick();
    if (!isLogin.value) return;
    const userDetailRes = await useApi().getUserDetail({});
    store.setUserDetail(userDetailRes.data.value.result);
  };

  const setToken = async (v: string | null) => {
    token.value = v; // 自動 set / clear cookie
  };

  return {
    token,
    isLogin,
    setToken,
    refreshUserData,
  };
}
