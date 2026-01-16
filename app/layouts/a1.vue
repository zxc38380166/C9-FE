<template>
  <UDashboardGroup storage="cookie" storage-key="c9-dashboard">
    <A1LayoutSidebar />
    <UDashboardPanel :ui="{ body: 'bg-[#1a2c38] !px-0 !pb-0 !pt-8' }">
      <template #header>
        <UDashboardNavbar
          title="LOGO"
          class="shadow-[0_6px_10px_-2px_rgba(0,0,0,0.4)] border-l-[#252b3a]! bg-linear-to-b from-[#1a2c38] to-[#0f212e] border-b border-white/5">
          <template #right>
            <CommonModalRegister />
            <CommonModalLogin />
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
<script setup lang="ts"></script>
