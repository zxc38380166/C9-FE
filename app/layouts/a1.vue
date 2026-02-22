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
            <div v-if="isLogin" class="flex items-center gap-3">
              <UUser
                :name="store.getUserDetail?.account"
                :avatar="{ src: 'https://github.com/benjamincanac.png', class: 'size-[40px]' }"
                :ui="{ name: 'text-[16px] text-center font-bold', root: 'gap-3' }"
                :chip="{ color: 'primary', position: 'top-right' }">
                <template #description>
                  <div class="flex items-center gap-1">
                    <span class="text-[13px] text-amber-400 font-semibold">
                      $ {{ store.getUserDetail?.balance ?? 0 }}
                    </span>
                    <UButton
                      size="xs"
                      variant="ghost"
                      color="neutral"
                      icon="i-lucide-refresh-cw"
                      class="cursor-pointer"
                      :loading="refreshingBalance"
                      @click="onRefreshBalance" />
                  </div>
                </template>
              </UUser>
              <UDropdownMenu
                :items="userActionItems"
                :ui="{ viewport: 'w-[300px]', itemWrapper: 'text-[16px] font-bold' }">
                <UButton
                  label="儀表板"
                  icon="i-lucide-menu"
                  color="neutral"
                  size="xs"
                  variant="outline" />
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
