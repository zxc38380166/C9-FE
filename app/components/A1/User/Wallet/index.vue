<template>
  <div class="space-y-4">
    <div class="text-[24px] font-bold text-white">帳戶錢包管理</div>
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
        <A1UserWalletFiat v-if="activeTab === 'fiat'" />
        <A1UserWalletCredit v-else-if="activeTab === 'credit'" />
        <A1UserWalletCrypto v-else />
      </template>
    </UTabs>
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
</script>
