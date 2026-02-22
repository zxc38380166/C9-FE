<template>
  <div class="space-y-4">
    <div class="text-[24px] font-bold text-white">交易紀錄</div>
    <UTabs
      v-model="activeTab"
      :items="tabs"
      :unmount-on-hide="false"
      class="w-full"
      :ui="{
        root: 'w-full items-start',
        list: 'rounded-[10px] w-full bg-[#00df72]/20 ring-1 ring-white/10',
        indicator: 'bg-[#00df72]',
        trigger: 'cursor-pointer h-10 text-white/70',
        content: 'mt-4',
      }">
      <template #content>
        <A1UserTransactionDeposit v-if="activeTab === 'deposit'" />
        <A1UserTransactionWithdrawal v-else-if="activeTab === 'withdrawal'" />
        <A1UserTransactionDividend v-else-if="activeTab === 'dividend'" />
        <A1UserTransactionBonus v-else />
      </template>
    </UTabs>
  </div>
</template>
<script setup lang="ts">
  type TabValue = 'deposit' | 'withdrawal' | 'dividend' | 'bonus';

  const tabs: Array<{ label: string; value: TabValue; icon: string }> = [
    { label: '存款', value: 'deposit', icon: 'i-lucide-download' },
    { label: '提款', value: 'withdrawal', icon: 'i-lucide-upload' },
    { label: '紅利', value: 'dividend', icon: 'i-lucide-percent' },
    { label: '獎金', value: 'bonus', icon: 'i-lucide-gift' },
  ];
  const activeTab = ref<TabValue>('deposit');
</script>
