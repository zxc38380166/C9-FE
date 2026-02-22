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
            <div v-if="isLogin" class="flex items-center gap-2.5">
              <!-- 餘額卡片 -->
              <div class="flex items-center gap-2 rounded-full bg-white/5 ring-1 ring-white/10 pl-3 pr-1.5 py-1.5">
                <UIcon name="i-lucide-coins" class="size-4 text-amber-400" />
                <span class="text-[13px] font-bold text-amber-400 tabular-nums">
                  $ {{ Number(store.getUserDetail?.balance ?? 0).toLocaleString() }}
                </span>
                <button
                  class="size-7 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
                  :class="{ 'animate-spin': refreshingBalance }"
                  @click="onRefreshBalance">
                  <UIcon name="i-lucide-refresh-cw" class="size-3.5 text-white/50" />
                </button>
              </div>

              <!-- 存款快捷 -->
              <button
                class="flex items-center gap-1.5 rounded-full bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 px-4 py-2 text-[13px] font-bold text-white shadow-[0_0_16px_-2px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
                @click="router.push('/user/deposit')">
                <UIcon name="i-lucide-plus" class="size-3.5" />
                存款
              </button>

              <!-- 使用者頭像 + 下拉選單 -->
              <UDropdownMenu
                :items="userActionItems"
                :ui="{ viewport: 'w-[280px]', itemWrapper: 'text-[14px] font-medium' }">
                <button class="relative flex items-center gap-2.5 rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/8 pl-3 pr-2 py-1.5 transition-colors cursor-pointer">
                  <span class="text-[13px] font-semibold text-white/80 max-w-20 truncate">
                    {{ store.getUserDetail?.account }}
                  </span>
                  <div class="relative">
                    <img
                      src="https://github.com/benjamincanac.png"
                      class="size-8 rounded-full ring-2 ring-emerald-500/40" />
                    <div class="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
                  </div>
                </button>
              </UDropdownMenu>
            </div>
            <template v-else>
              <A1ModalRegister />
              <A1ModalLogin />
            </template>
          </template>
        </UDashboardNavbar>
      </template>
      <template #body>
        <div class="px-3.5 lg:px-10 xl:px-20">
          <CommonModalBase />
          <slot />
        </div>
        <A1LayoutFooter />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
<script setup lang="ts">
  const store = useStore();
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

  const userActionItems = ref([
    [
      {
        label: store.getUserDetail?.account || '',
        avatar: {
          src: 'https://github.com/benjamincanac.png',
        },
        type: 'label',
      },
    ],
    [
      {
        label: '個人設定',
        icon: 'i-lucide-user',
        to: '/user/setting',
      },
      {
        label: '個人驗證',
        icon: 'i-lucide-credit-card',
      },
      {
        label: '通知',
        icon: 'i-lucide-cog',
        kbds: [','],
      },
      {
        label: '存款',
        icon: 'i-lucide-monitor',
        to: '/user/deposit',
      },
      {
        label: '提款',
        icon: 'i-lucide-monitor',
      },
    ],
    [
      {
        label: '投注紀錄',
        icon: 'i-lucide-users',
      },
      {
        label: '交易紀錄',
        icon: 'i-lucide-receipt-text',
        to: '/user/transaction',
      },
      {
        label: '帳戶錢包管理',
        icon: 'i-lucide-users',
        to: '/user/wallet',
      },
      // {
      //   label: 'test',
      //   icon: 'i-lucide-user-plus',
      //   children: [
      //     [
      //       {
      //         label: 'Email',
      //         icon: 'i-lucide-mail',
      //       },
      //       {
      //         label: 'Message',
      //         icon: 'i-lucide-message-square',
      //       },
      //     ],
      //     [
      //       {
      //         label: 'More',
      //         icon: 'i-lucide-circle-plus',
      //       },
      //     ],
      //   ],
      // },
    ],
    [
      {
        label: '獎金',
        icon: 'i-lucide-users',
      },
      {
        label: '邀請好友',
        icon: 'i-lucide-users',
      },
    ],
    [
      {
        label: '登出',
        icon: 'i-lucide-log-out',
        kbds: ['shift', 'meta', 'q'],
        onSelect() {
          logout();
        },
      },
    ],
  ]);
</script>
