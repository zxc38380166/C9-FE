<template>
  <header
    class="h-[60px] w-full bg-gradient-to-b from-[#1a2c38] to-[#0f212e] border-b border-white/5 shadow-[0_6px_10px_-2px_rgba(0,0,0,0.6)]">
    <div class="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4">
      <!-- Logo -->
      <NuxtImg src="/a1/logo.png" class="size-[97px]" />

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <button class="rounded-md bg-[#2f4553] px-4 py-2 text-sm text-white hover:bg-[#3b5668]">
          登錄
        </button>
        <button
          class="rounded-md bg-[#1a7af8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1566d8]">
          註冊
        </button>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
  // 之後可接登入狀態、router、modal
</script>
