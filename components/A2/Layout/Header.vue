<template>
  <header
    class="sticky top-0 z-50 h-[60px] w-full bg-gradient-to-b from-[#1a2c38] to-[#0f212e] shadow-[0_4px_12px_rgba(0,0,0,0.65)] border-b border-white/5">
    <div class="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4">
      <!-- 左側 Logo -->
      <div class="flex items-center">
        <NuxtImg src="/a1/logo.png" class="size-[100px]" />
      </div>
      <!-- 右側操作 -->
      <div class="flex items-center gap-3">
        <button
          class="rounded-md bg-[#2f4553] px-4 py-2 text-sm font-medium text-white hover:bg-[#3b5668] transition">
          登錄
        </button>

        <button
          class="rounded-md bg-[#1a7af8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1566d8] transition">
          註冊
        </button>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
  // 之後可接登入狀態、router、modal
</script>
