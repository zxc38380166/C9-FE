<template>
  <UDashboardGroup storage="cookie" storage-key="c9-dashboard">
    <A1LayoutSidebar />
    <UDashboardPanel :ui="{ body: 'bg-slate-800 !px-0 !pb-0 !pt-8' }">
      <template #header>
        <UDashboardNavbar
          :ui="{ root: 'lg:!px-20' }"
          class="shadow-[0_6px_10px_-2px_rgba(0,0,0,0.4)] border-l-slate-800! bg-linear-to-b from-slate-800 to-slate-900 border-b border-white/5">
          <template #title>
            <div @click="router.push('/')" class="cursor-pointer">LOGO</div>
          </template>
          <template #right>
            <div v-if="isLogin" class="flex items-center gap-1.5 sm:gap-2.5">
              <!-- 餘額卡片 -->
              <div class="flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/5 ring-1 ring-white/10 pl-2.5 sm:pl-3 pr-1 sm:pr-1.5 py-1 sm:py-1.5">
                <Icon name="i-lucide-coins" class="size-3.5 sm:size-4 text-amber-400" />
                <span class="text-[12px] sm:text-[13px] font-bold text-amber-400 tabular-nums">
                  $ {{ Number(store.getUserDetail?.balance ?? 0).toLocaleString() }}
                </span>
                <button
                  class="size-6 sm:size-7 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
                  :class="{ 'animate-spin': refreshingBalance }"
                  @click="onRefreshBalance">
                  <Icon name="i-lucide-refresh-cw" class="size-3 sm:size-3.5 text-white/50" />
                </button>
              </div>

              <!-- 娛樂城入口 (手機版) -->
              <button
                class="sm:hidden flex items-center justify-center size-8 rounded-full bg-amber-500/15 ring-1 ring-amber-500/25 text-amber-400 hover:bg-amber-500/25 transition-colors cursor-pointer"
                @click="router.push('/game?tab=gameLobby')">
                <Icon name="i-lucide-gamepad-2" class="size-4" />
              </button>

              <!-- 存款快捷 -->
              <button
                class="flex items-center justify-center gap-1.5 rounded-full bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 size-8 sm:size-auto sm:px-4 sm:py-2 text-[13px] font-bold text-white shadow-[0_0_16px_-2px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
                @click="router.push('/user/deposit')">
                <Icon name="i-lucide-plus" class="size-3.5" />
                <span class="hidden sm:inline">{{ $t('nav.deposit') }}</span>
              </button>

              <!-- 使用者頭像 + 下拉選單 -->
              <UDropdownMenu
                :items="userActionItems"
                :ui="{
                  content: 'bg-[#131f30] ring-1 ring-white/10 shadow-[0_16px_48px_-8px_rgba(0,0,0,0.6)] rounded-xl overflow-hidden data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in]',
                  viewport: 'w-[260px] sm:w-[280px] divide-y divide-white/6 scroll-py-1 overflow-y-auto scrollbar-hide flex-1',
                  group: 'p-1.5 isolate',
                  separator: '-mx-1 my-0 h-px bg-white/6',
                  label: 'w-full flex items-center font-semibold text-white',
                  item: 'group relative w-full flex items-center select-none outline-none rounded-lg before:absolute before:z-[-1] before:inset-px before:rounded-lg data-disabled:cursor-not-allowed data-disabled:opacity-75 text-white/70 data-highlighted:text-white data-highlighted:before:bg-white/6',
                  itemLeadingIcon: 'shrink-0 size-4 text-white/40 group-data-highlighted:text-emerald-400',
                  itemWrapper: 'flex-1 flex flex-col text-start min-w-0',
                  itemLabel: 'truncate text-[13px] font-medium p-1.5',
                  itemTrailingKbds: 'hidden lg:inline-flex items-center shrink-0',
                }">
                <button class="relative flex items-center gap-2 rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/8 p-1 sm:pl-3 sm:pr-2 sm:py-1.5 transition-colors cursor-pointer">
                  <span class="hidden sm:inline text-[13px] font-semibold text-white/80 max-w-20 truncate">
                    {{ store.getUserDetail?.account }}
                  </span>
                  <div class="relative">
                    <NuxtImg
                      src="https://github.com/benjamincanac.png"
                      class="size-7 sm:size-8 rounded-full ring-2 ring-emerald-500/40" />
                    <div class="absolute -bottom-0.5 -right-0.5 size-2.5 sm:size-3 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
                  </div>
                </button>
              </UDropdownMenu>
            </div>
            <div v-else class="flex items-center gap-2 sm:gap-3">
              <A1ModalLogin />
              <A1ModalRegister />
            </div>
          </template>
        </UDashboardNavbar>
      </template>
      <template #body>
        <div class="px-3.5 lg:px-10 xl:px-20">
          <slot />
        </div>
        <A1LayoutFooter />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
<script setup lang="ts">
  const { t } = useI18n();
  const store = useStore();
  const route = useRoute();
  const router = useRouter();
  const { isLogin, logout, refreshUserData } = useAuth();

  const refreshingBalance = ref(false);
  const onRefreshBalance = async () => {
    refreshingBalance.value = true;
    try {
      await refreshUserData();
    } finally {
      refreshingBalance.value = false;
    }
  };

  const isActive = (path: string) => route.path === path;

  const userActionItems = computed(() => [
    [
      {
        label: store.getUserDetail?.account || '',
        avatar: {
          src: 'https://github.com/benjamincanac.png',
        },
        type: 'label' as const,
      },
    ],
    [
      {
        label: t('nav.personalSetting'),
        icon: 'i-lucide-user-cog',
        to: '/user/setting',
        active: isActive('/user/setting'),
      },
      {
        label: t('nav.personalVerify'),
        icon: 'i-lucide-shield-check',
      },
      {
        label: t('nav.notification'),
        icon: 'i-lucide-bell',
        kbds: [','],
      },
    ],
    [
      {
        label: t('nav.deposit'),
        icon: 'i-lucide-arrow-down-to-line',
        to: '/user/deposit',
        active: isActive('/user/deposit'),
      },
      {
        label: t('nav.withdrawal'),
        icon: 'i-lucide-arrow-up-from-line',
      },
      {
        label: t('nav.walletManage'),
        icon: 'i-lucide-wallet',
        to: '/user/wallet',
        active: isActive('/user/wallet'),
      },
    ],
    [
      {
        label: t('nav.transactionRecord'),
        icon: 'i-lucide-receipt-text',
        to: '/user/transaction',
        active: isActive('/user/transaction'),
      },
      {
        label: t('nav.betRecord'),
        icon: 'i-lucide-scroll-text',
        to: '/user/bet-record',
        active: isActive('/user/bet-record'),
      },
      {
        label: t('nav.promoCenter'),
        icon: 'i-lucide-party-popper',
        to: '/promo',
        active: isActive('/promo'),
      },
    ],
    [
      {
        label: t('nav.bonus'),
        icon: 'i-lucide-trophy',
      },
      {
        label: t('nav.inviteFriends'),
        icon: 'i-lucide-user-plus',
      },
    ],
    [
      {
        label: t('nav.logout'),
        icon: 'i-lucide-log-out',
        kbds: ['shift', 'meta', 'q'],
        onSelect() {
          logout();
        },
      },
    ],
  ]);
</script>
