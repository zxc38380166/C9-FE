<template>
  <div class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-8 space-y-4">
    <div class="flex items-center gap-2">
      <Icon name="noto:bar-chart" class="text-[20px] sm:text-[24px]" />
      <span class="text-[16px] sm:text-[20px] font-bold text-white">{{ $t('vip.rebateTable') }}</span>
    </div>
    <div class="text-[12px] sm:text-[13px] text-white/40">
      {{ $t('vip.rebateDesc') }}
    </div>
    <div class="overflow-x-auto scrollbar-hide -mx-2 px-2">
      <table class="w-full min-w-150 border-collapse text-[12px] sm:text-[13px]">
        <thead>
          <tr>
            <th class="text-left py-3 px-3 sm:px-4 bg-white/5 rounded-tl-lg text-white/70 font-semibold">
              {{ $t('vip.level') }}
            </th>
            <th
              v-for="gt in gameTypes"
              :key="gt.key"
              class="text-center py-3 px-2 sm:px-3 bg-white/5 text-white/70 font-semibold last:rounded-tr-lg">
              {{ gt.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="lv in allLevels"
            :key="lv.level"
            class="border-t border-white/5 transition-colors"
            :class="lv.level === currentLevel ? 'bg-emerald-500/8' : 'hover:bg-white/2'">
            <td class="py-2.5 px-3 sm:px-4 font-semibold whitespace-nowrap">
              <div class="flex items-center gap-2">
                <span v-if="lv.level === currentLevel" class="size-1.5 rounded-full bg-emerald-400" />
                <span :class="lv.level === currentLevel ? 'text-emerald-400' : 'text-white/70'">
                  {{ lv.name }}
                </span>
              </div>
            </td>
            <td
              v-for="gt in gameTypes"
              :key="gt.key"
              class="text-center py-2.5 px-2 sm:px-3"
              :class="lv.level === currentLevel ? 'text-emerald-400 font-bold' : 'text-white/50'">
              {{ getRebateForLevel(lv.level, gt.key) }}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { t } = useI18n();

  interface VipLevel {
    level: number;
    name: string;
    tier: string;
    minChip: string;
    relegationChip: string;
  }

  interface AllRebate {
    level: number;
    gameType: string;
    rebateRate: string;
  }

  const props = defineProps<{
    allLevels: VipLevel[];
    currentLevel: number;
    allRebates: AllRebate[];
  }>();

  const gameTypes = [
    { key: 'live', label: t('vip.gameType.live') },
    { key: 'slots', label: t('vip.gameType.slots') },
    { key: 'cards', label: t('vip.gameType.cards') },
    { key: 'crypto', label: t('vip.gameType.crypto') },
    { key: 'sports', label: t('vip.gameType.sports') },
    { key: 'bonus', label: t('vip.gameType.bonus') },
  ];

  const rebateMap = computed(() => {
    const map = new Map<string, string>();
    props.allRebates.forEach((r) => {
      map.set(`${r.level}-${r.gameType}`, r.rebateRate);
    });
    return map;
  });

  const getRebateForLevel = (level: number, gameType: string) =>
    rebateMap.value.get(`${level}-${gameType}`) || '0.00';
</script>
