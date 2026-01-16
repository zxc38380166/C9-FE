<template>
  <!-- 主要容器：管理 sidebar 狀態（收合/寬度/記憶） -->
  <UDashboardGroup storage="cookie" storage-key="c9-dashboard">
    <!-- 左側 Sidebar -->
    <A1LayoutSidebar />
    <!-- 右側主內容區：上面 header、下面 footer -->
    <UDashboardPanel :ui="{ body: 'bg-[#1a2c38]' }">
      <!-- Panel 的 header slot：放 Navbar 當上方 Header -->
      <template #header>
        <UDashboardNavbar
          title="LOGO"
          class="shadow-[0_6px_10px_-2px_rgba(0,0,0,0.4)] !border-l !border-l-[#252b3a] bg-gradient-to-b from-[#1a2c38] to-[#0f212e] border-b border-white/5"
        >
          <template #right>
            <UButton
              icon="i-material-symbols:person-add-rounded"
              color="secondary"
              variant="solid"
              size="xl"
              aria-label="Settings"
              to="/settings"
              class="bg-[#2f4553]/70 cursor-pointer text-white hover:bg-[#2f4553] active:bg-[#2f4553]"
              label="註冊"
            />
            <UButton
              icon="i-solar:login-3-broken"
              color="secondary"
              variant="solid"
              size="xl"
              aria-label="Notifications"
              class="text-[white] cursor-pointer bg-[#00df72]/70 hover:bg-[#00df72] active:bg-[#00df72]"
              label="登入"
            />
          </template>
        </UDashboardNavbar>
      </template>
      <template #body>
        <div class="bg-[#]">
          <slot />
        </div>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
<script setup lang="ts">
const links = [
  { label: "Dashboard", icon: "i-heroicons-home", to: "/" },
  { label: "Orders", icon: "i-heroicons-receipt-percent", to: "/orders" },
  { label: "Users", icon: "i-heroicons-users", to: "/users" },
  { label: "Settings", icon: "i-heroicons-cog-6-tooth", to: "/settings" },
];
</script>
