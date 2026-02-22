<template>
  <div class="space-y-5 sm:space-y-8">
    <!-- 頁面標題 -->
    <div
      class="flex items-center gap-3 rounded-2xl bg-[#131f30] ring-1 ring-white/8 px-5 py-4 sm:px-6 sm:py-5">
      <div
        class="size-10 sm:size-12 rounded-xl bg-linear-to-br from-amber-500/20 to-amber-700/10 ring-1 ring-amber-500/30 flex items-center justify-center">
        <Icon name="noto:crown" class="text-[20px] sm:text-[24px]" />
      </div>
      <div>
        <span class="text-[16px] sm:text-[20px] font-bold text-white">{{ $t('vip.title') }}</span>
        <p class="text-[11px] sm:text-[12px] text-white/40">{{ $t('vip.subtitle') }}</p>
      </div>
    </div>

    <!-- Loading skeleton -->
    <template v-if="loading">
      <div class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-8 animate-pulse space-y-5">
        <div class="flex items-center gap-4">
          <div class="size-16 rounded-2xl bg-white/5" />
          <div class="space-y-2 flex-1">
            <div class="h-6 w-40 bg-white/5 rounded-lg" />
            <div class="h-4 w-60 bg-white/5 rounded-lg" />
          </div>
        </div>
        <div class="h-3 w-full bg-white/5 rounded-full" />
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div v-for="i in 4" :key="i" class="h-20 bg-white/5 rounded-xl" />
        </div>
      </div>
    </template>

    <!-- 未登入提示 -->
    <template v-else-if="!isLogin">
      <div
        class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-8 sm:p-12 flex flex-col items-center gap-5">
        <Icon name="i-lucide-lock" class="size-12 text-white/20" />
        <div class="text-center space-y-2">
          <div class="text-[16px] sm:text-[18px] font-bold text-white/70">
            {{ $t('vip.loginRequired') }}
          </div>
          <div class="text-[13px] text-white/40">{{ $t('vip.loginHint') }}</div>
        </div>
        <button
          class="px-8 py-3 rounded-xl text-[14px] font-bold bg-linear-to-r from-amber-500 to-amber-600 text-white shadow-[0_0_24px_-4px_rgba(245,158,11,0.4)] hover:from-amber-400 hover:to-amber-500 cursor-pointer transition-all"
          @click="openLoginModal()">
          <Icon name="i-lucide-log-in" class="size-4 inline mr-1.5" />
          {{ $t('vip.loginBtn') }}
        </button>
      </div>
    </template>

    <!-- VIP 內容 -->
    <template v-else-if="status">
      <A1UserVipStatusCard :status="status" :created-at="userData?.createdAt" />
      <A1UserVipMyRebates :rebates="status.rebates" />
      <A1UserVipLevelList :all-levels="status.allLevels" :current-level="status.level" />
      <A1UserVipRebateTable
        :all-levels="status.allLevels"
        :current-level="status.level"
        :all-rebates="allRebates" />
      <A1UserVipBenefits />
    </template>
  </div>
</template>

<script setup lang="ts">
  const { isLogin } = useAuth();
  const { openLoginModal } = useLayout();
  const store = useStore();

  interface VipLevel {
    level: number;
    name: string;
    tier: string;
    minChip: string;
    relegationChip: string;
  }

  interface Rebate {
    gameType: string;
    rebateRate: string;
  }

  interface VipStatus {
    level: number;
    name: string;
    tier: string;
    currentChip: string;
    nextLevelMinChip: string;
    progress: string;
    relegationChip: string;
    rebates: Rebate[];
    allLevels: VipLevel[];
  }

  interface AllRebate {
    level: number;
    gameType: string;
    rebateRate: string;
  }

  const loading = ref(true);
  const status = ref<VipStatus | null>(null);
  const allRebates = ref<AllRebate[]>([]);

  const userData = computed(() => store.getUserDetail);

  const fetchData = async () => {
    loading.value = true;
    try {
      const [statusRes, rebatesRes] = await Promise.all([
        useApi().getVipStatus(),
        useApi().getVipRebates(),
      ]);
      if (statusRes?.code === 200) status.value = statusRes.result ?? null;
      if (rebatesRes?.code === 200) allRebates.value = rebatesRes.result || [];
    } catch (e) {
      console.error('[VIP] fetch failed', e);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    if (isLogin.value) {
      fetchData();
    } else {
      loading.value = false;
    }
  });

  watch(isLogin, (val) => {
    if (val) fetchData();
  });
</script>
