export function useAuth() {
  // SSR + CSR 都可用
  const token = useCookie<string | null>('token', {
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    maxAge: 60 * 60 * 48, // 48 小時（秒）
  });

  const isLogin = computed(() => !!token.value);

  const setToken = (v: string | null) => {
    token.value = v; // 自動 set / clear cookie
  };

  return {
    token,
    isLogin,
    setToken,
  };
}
