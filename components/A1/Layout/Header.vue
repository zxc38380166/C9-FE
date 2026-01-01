<template>
  <header
    class="h-[60px] w-full bg-gradient-to-b from-[#1a2c38] to-[#0f212e] border-b border-white/5 shadow-[0_6px_10px_-2px_rgba(0,0,0,0.6)]">
    <div class="mx-auto flex h-full items-center justify-between lg:px-5 xl:px-10 2xl:px-[220px]">
      <NuxtImg src="/a1/logo.png" class="h-[95px] w-auto pr-2" />
      <div class="flex items-center gap-3">
        <!-- ========== 未登入 ========== -->
        <template v-if="!isLogin">
          <button
            @click="store.getDoms.dialogLogin.open = true"
            class="rounded-md bg-[#2f4553] px-4 py-2 text-sm text-white hover:bg-[#3b5668]">
            登錄
          </button>
          <button
            @click="store.getDoms.dialogRegister.open = true"
            class="rounded-md bg-gradient-to-b from-[#77cbac] to-[#1a6b52] px-4 py-2 text-sm font-semibold text-white">
            註冊
          </button>
        </template>
        <!-- ========== 已登入 ========== -->
        <template v-else>
          <div class="inline-flex overflow-hidden rounded-md">
            <button
              type="button"
              class="flex items-center gap-2 bg-[#0b1e2b] hover:bg-[#132a3a] px-4 py-1 text-sm text-white rounded-none border-r border-white/10 transition-colors">
              <span class="font-semibold tabular-nums">0.00000000</span>
              <NuxtImg src="/common/flags/USDT.png" class="h-4 w-4" />
              <i class="mdi mdi-chevron-down text-lg opacity-70" />
            </button>
            <button
              type="button"
              class="flex items-center justify-center bg-gradient-to-b from-[#77cbac] to-[#1a6b52] md:text-[14px] text-[12px] whitespace-nowrap px-2 py-1 font-semibold text-white rounded-none transition-colors">
              錢包
            </button>
          </div>
          <el-button v-if="isDesktop" text class="!p-0 !border-0 hover:!bg-transparent">
            <i class="mdi mdi-magnify text-[white] text-[25px]" />
          </el-button>
          <el-dropdown placement="bottom">
            <el-button text class="!p-0 !border-0 hover:!bg-transparent">
              <i class="mdi mdi-account-outline text-white text-[25px]" />
            </el-button>
            <template #dropdown>
              <div
                :style="{
                  '--el-dropdown-menuItem-hover-fill': '#2f4553',
                  '--el-dropdown-menuItem-hover-color': '#ffffff',
                  '--el-dropdown-menuItem-color': 'rgba(255,255,255,0.85)',
                }">
                <el-dropdown-menu>
                  <el-dropdown-item>Dashboard</el-dropdown-item>
                  <el-dropdown-item>Profile</el-dropdown-item>

                  <el-dropdown-item @click="setToken(null)" class="danger">
                    Logout
                  </el-dropdown-item>
                </el-dropdown-menu>
              </div>
            </template>
          </el-dropdown>
          <el-button text class="!p-0 !border-0 hover:!bg-transparent">
            <i class="mdi mdi-bell-outline text-[white] text-[22px]" />
          </el-button>
          <el-dropdown v-if="isDesktop" placement="bottom">
            <el-button text class="!p-0 !border-0 hover:!bg-transparent">
              <i class="mdi mdi-view-dashboard-variant-outline text-white text-[25px]" />
            </el-button>
            <template #dropdown>
              <div
                :style="{
                  '--el-dropdown-menuItem-hover-fill': '#2f4553',
                  '--el-dropdown-menuItem-hover-color': '#ffffff',
                  '--el-dropdown-menuItem-color': 'rgba(255,255,255,0.85)',
                }">
                <el-dropdown-menu>
                  <el-dropdown-item>Dashboard</el-dropdown-item>
                  <el-dropdown-item>Profile</el-dropdown-item>
                  <el-dropdown-item class="danger"> Logout </el-dropdown-item>
                </el-dropdown-menu>
              </div>
            </template>
          </el-dropdown>
        </template>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
  const store = useStore();
  const { isLogin, setToken } = useAuth();
  const { isDesktop } = useDevice();
</script>
