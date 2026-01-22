<template>
  <UDashboardGroup storage="cookie" storage-key="c9-dashboard">
    <A1LayoutSidebar />
    <UDashboardPanel :ui="{ body: 'bg-[#1a2c38] !px-0 !pb-0 !pt-8' }">
      <template #header>
        <UDashboardNavbar
          :ui="{ root: 'lg:!px-20' }"
          class="shadow-[0_6px_10px_-2px_rgba(0,0,0,0.4)] border-l-[#252b3a]! bg-linear-to-b from-[#1a2c38] to-[#0f212e] border-b border-white/5">
          <template #title>
            <div @click="router.push('/')" class="cursor-pointer">LOGO</div>
          </template>
          <template #right>
            <UUser
              v-if="isLogin"
              :name="store.getUserDetail?.account"
              description="Software Engineer"
              :avatar="{ src: 'https://github.com/benjamincanac.png' }"
              :ui="{ name: 'text-[16px] text-center font-bold', root: 'gap-3' }"
              :chip="{ color: 'primary', position: 'top-right' }">
              <template #description>
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
              </template>
            </UUser>
            <template v-else>
              <CommonModalRegister />
              <CommonModalLogin />
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
  const { isLogin, logout } = useAuth();

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
        icon: 'i-lucide-users',
      },
      {
        label: '帳戶錢包管理',
        icon: 'i-lucide-users',
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
