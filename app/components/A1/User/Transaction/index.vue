<template>
  <div class="rounded-[12px] sm:rounded-[16px] bg-[#131f30] ring-1 ring-white/8 p-3 sm:p-5 space-y-4 sm:space-y-5">
    <!-- 頁面標題 -->
    <div class="flex items-center gap-2.5 sm:gap-3">
      <div class="size-8 sm:size-10 rounded-[10px] sm:rounded-[12px] bg-linear-to-br from-emerald-500/20 to-emerald-700/10 ring-1 ring-emerald-500/30 flex items-center justify-center">
        <Icon name="i-lucide-receipt-text" class="size-4 sm:size-5 text-emerald-400" />
      </div>
      <div>
        <div class="text-[18px] sm:text-[22px] font-bold text-white tracking-wide">交易紀錄</div>
        <div class="text-[11px] sm:text-[12px] text-white/40">查看您的所有交易明細</div>
      </div>
    </div>

    <div class="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

    <!-- Tab 導航 -->
    <div class="flex gap-1.5 sm:gap-2 rounded-[10px] sm:rounded-[12px] bg-white/4 ring-1 ring-white/6 p-1 sm:p-1.5">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="group relative flex flex-1 items-center justify-center gap-1.5 sm:gap-2 px-2 py-2 sm:px-4 sm:py-2.5 rounded-[8px] sm:rounded-[10px] text-[12px] sm:text-[14px] font-semibold transition-all duration-200 cursor-pointer"
        :class="activeTab === tab.value
          ? 'bg-linear-to-b from-emerald-500/25 to-emerald-600/10 text-emerald-400 ring-1 ring-emerald-500/30 shadow-[0_0_20px_-4px_rgba(16,185,129,0.25)]'
          : 'text-white/40 hover:bg-white/5 hover:text-white/60'"
        @click="activeTab = tab.value">
        <Icon :name="tab.icon" class="size-3.5 sm:size-4" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab 內容 -->
    <A1UserTransactionDeposit v-if="activeTab === 'deposit'" />
    <A1UserTransactionWithdrawal v-else-if="activeTab === 'withdrawal'" />
    <A1UserTransactionDividend v-else-if="activeTab === 'dividend'" />
    <A1UserTransactionPromo v-else />
  </div>
</template>
<script setup lang="ts">
  type TabValue = 'deposit' | 'withdrawal' | 'dividend' | 'promo';

  const tabs: Array<{ label: string; value: TabValue; icon: string }> = [
    { label: '存款', value: 'deposit', icon: 'i-lucide-download' },
    { label: '提款', value: 'withdrawal', icon: 'i-lucide-upload' },
    { label: '紅利', value: 'dividend', icon: 'i-lucide-percent' },
    { label: '優惠', value: 'promo', icon: 'i-lucide-party-popper' },
  ];
  const activeTab = ref<TabValue>('deposit');
</script>
