import { useIntervalFn } from '@vueuse/core';

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
    const userDetailRes = await useApi().getUserDetailCsr({});
    if (userDetailRes.result) store.setUserDetail(userDetailRes.result);
  };

  const setToken = async (v: string | null) => {
    token.value = v; // 自動 set / clear cookie
  };

  const logout = async () => {
    await setToken(null);
    store.setUserDetail({});
  };

  const resendOtp = (options: { cooldownSeconds?: number } = {}) => {
    const cooldownSeconds = options.cooldownSeconds ?? 60;

    const remaining = ref(0);
    const isRunning = computed(() => remaining.value > 0);
    const canResend = computed(() => remaining.value <= 0);

    const { pause, resume } = useIntervalFn(
      () => {
        remaining.value -= 1;
        if (remaining.value <= 0) pause();
      },
      1000,
      { immediate: false },
    );

    const stop = () => {
      pause();
      remaining.value = 0;
    };

    const start = (sec: number = cooldownSeconds) => {
      pause();
      remaining.value = Math.max(0, Math.floor(sec));
      if (remaining.value <= 0) return;
      resume();
    };

    const format = computed(() => {
      const s = remaining.value;
      const mm = String(Math.floor(s / 60)).padStart(2, '0');
      const ss = String(s % 60).padStart(2, '0');
      return `${mm}:${ss}`;
    });

    return {
      remaining,
      isRunning,
      canResend,
      format,
      start,
      stop,
    };
  };

  return {
    resendOtp,
    token,
    isLogin,
    setToken,
    refreshUserData,
    logout,
  };
}
