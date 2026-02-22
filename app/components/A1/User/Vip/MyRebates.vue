<template>
  <div class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-8 space-y-4">
    <div class="flex items-center gap-2">
      <Icon name="noto:money-with-wings" class="text-[20px] sm:text-[24px]" />
      <span class="text-[16px] sm:text-[20px] font-bold text-white">{{ $t('vip.myRebates') }}</span>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div
        v-for="rebate in rebates"
        :key="rebate.gameType"
        class="rounded-xl bg-white/3 ring-1 ring-white/6 p-3.5 sm:p-4 flex items-center gap-3">
        <div
          class="size-9 sm:size-10 rounded-lg flex items-center justify-center"
          :class="gameTypeIconBg(rebate.gameType)">
          <Icon :name="gameTypeIcon(rebate.gameType)" class="size-4 sm:size-5" />
        </div>
        <div>
          <div class="text-[13px] sm:text-[14px] font-semibold text-white/80">
            {{ gameTypeName(rebate.gameType) }}
          </div>
          <div class="text-[16px] sm:text-[18px] font-bold text-emerald-400">
            {{ rebate.rebateRate }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { t } = useI18n();

  defineProps<{
    rebates: { gameType: string; rebateRate: string }[];
  }>();

  const gameTypes = [
    { key: 'live', label: t('vip.gameType.live'), icon: 'i-lucide-tv', bg: 'bg-rose-500/15 text-rose-400' },
    { key: 'slots', label: t('vip.gameType.slots'), icon: 'i-lucide-cherry', bg: 'bg-purple-500/15 text-purple-400' },
    { key: 'cards', label: t('vip.gameType.cards'), icon: 'i-lucide-spade', bg: 'bg-blue-500/15 text-blue-400' },
    { key: 'crypto', label: t('vip.gameType.crypto'), icon: 'i-lucide-bitcoin', bg: 'bg-amber-500/15 text-amber-400' },
    { key: 'sports', label: t('vip.gameType.sports'), icon: 'i-lucide-trophy', bg: 'bg-emerald-500/15 text-emerald-400' },
    { key: 'bonus', label: t('vip.gameType.bonus'), icon: 'i-lucide-gift', bg: 'bg-pink-500/15 text-pink-400' },
  ];

  const gameTypeIcon = (type: string) => gameTypes.find((g) => g.key === type)?.icon || 'i-lucide-gamepad-2';
  const gameTypeIconBg = (type: string) => gameTypes.find((g) => g.key === type)?.bg || 'bg-white/10 text-white/60';
  const gameTypeName = (type: string) => gameTypes.find((g) => g.key === type)?.label || type;
</script>
