<template>
  <div class="rounded-[16px] bg-[#131f30] ring-1 ring-white/8 p-5 space-y-5">
    <!-- 頁面標題 -->
    <div class="flex items-center gap-3">
      <div class="size-10 rounded-[12px] bg-linear-to-br from-emerald-500/20 to-emerald-700/10 ring-1 ring-emerald-500/30 flex items-center justify-center">
        <UIcon name="i-lucide-arrow-down-to-line" class="size-5 text-emerald-400" />
      </div>
      <div>
        <div class="text-[22px] font-bold text-white tracking-wide">存款</div>
        <div class="text-[12px] text-white/40">選擇支付方式進行存款</div>
      </div>
    </div>

    <div class="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

    <!-- Tab 導航 -->
    <div class="flex gap-2 rounded-[12px] bg-white/4 ring-1 ring-white/6 p-1.5">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="group relative flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] text-[14px] font-semibold transition-all duration-200 cursor-pointer"
        :class="activeTab === tab.value
          ? 'bg-linear-to-b from-emerald-500/25 to-emerald-600/10 text-emerald-400 ring-1 ring-emerald-500/30 shadow-[0_0_20px_-4px_rgba(16,185,129,0.25)]'
          : 'text-white/40 hover:bg-white/5 hover:text-white/60'"
        @click="activeTab = tab.value">
        <UIcon :name="tab.icon" class="size-4" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab 內容 -->
    <A1UserDepositFiat v-if="activeTab === 'fiat'" />
    <A1UserDepositCredit v-else-if="activeTab === 'credit'" />
    <A1UserDepositCrypto v-else />
  </div>
</template>

<script setup lang="ts">
  type TabValue = 'fiat' | 'credit' | 'crypto';

  const tabs: Array<{ label: string; value: TabValue; icon: string }> = [
    { label: '法幣', value: 'fiat', icon: 'i-lucide-banknote' },
    { label: '信用卡', value: 'credit', icon: 'i-lucide-credit-card' },
    { label: '虛擬貨幣', value: 'crypto', icon: 'i-lucide-bitcoin' },
  ];
  const activeTab = ref<TabValue>('fiat');

  const { init } = useCash();

  onMounted(() => {
    init();
  });
</script>
