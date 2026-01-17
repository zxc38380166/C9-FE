<template>
  <UDashboardGroup storage="cookie" storage-key="c9-dashboard">
    <A1LayoutSidebar />
    <UDashboardPanel :ui="{ body: 'bg-[#1a2c38] !px-0 !pb-0 !pt-8' }">
      <template #header>
        <UDashboardNavbar
          title="LOGO"
          class="shadow-[0_6px_10px_-2px_rgba(0,0,0,0.4)] border-l-[#252b3a]! bg-linear-to-b from-[#1a2c38] to-[#0f212e] border-b border-white/5">
          <template #right>
            <UUser
              v-if="isLogin"
              :name="store.getUserDetail.account"
              description="Software Engineer"
              :avatar="{ src: 'https://github.com/benjamincanac.png' }"
              :chip="{
                color: 'primary',
                position: 'top-right',
              }">
              <template #description>
                <UDropdownMenu :items="userActionItems">
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
        <div class="bg-[#]">
          <CommonModalBase />
          <slot />
          <A1LayoutFooter></A1LayoutFooter>
        </div>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
<script setup lang="ts">
  const store = useStore();
  const { isLogin } = useAuth();

  const userActionItems = ref([
    [
      {
        label: store.getUserDetail.account,
        avatar: {
          src: 'https://github.com/benjamincanac.png',
        },
        type: 'label',
      },
    ],
    [
      {
        label: 'Profile',
        icon: 'i-lucide-user',
      },
      {
        label: 'Billing',
        icon: 'i-lucide-credit-card',
      },
      {
        label: 'Settings',
        icon: 'i-lucide-cog',
        kbds: [','],
      },
      {
        label: 'Keyboard shortcuts',
        icon: 'i-lucide-monitor',
      },
    ],
    [
      {
        label: 'Team',
        icon: 'i-lucide-users',
      },
      {
        label: 'Invite users',
        icon: 'i-lucide-user-plus',
        children: [
          [
            {
              label: 'Email',
              icon: 'i-lucide-mail',
            },
            {
              label: 'Message',
              icon: 'i-lucide-message-square',
            },
          ],
          [
            {
              label: 'More',
              icon: 'i-lucide-circle-plus',
            },
          ],
        ],
      },
      {
        label: 'New team',
        icon: 'i-lucide-plus',
        kbds: ['meta', 'n'],
      },
    ],
    [
      {
        label: 'GitHub',
        icon: 'i-simple-icons-github',
        to: 'https://github.com/nuxt/ui',
        target: '_blank',
      },
      {
        label: 'Support',
        icon: 'i-lucide-life-buoy',
        to: '/docs/components/dropdown-menu',
      },
      {
        label: 'API',
        icon: 'i-lucide-cloud',
        disabled: true,
      },
    ],
    [
      {
        label: 'Logout',
        icon: 'i-lucide-log-out',
        kbds: ['shift', 'meta', 'q'],
      },
    ],
  ]);
</script>
