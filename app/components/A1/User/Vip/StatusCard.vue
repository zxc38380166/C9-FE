<template>
  <!-- 當前等級卡片 -->
  <div class="rounded-2xl ring-1 ring-white/8 overflow-hidden" :class="tierBgClass">
    <div class="p-5 sm:p-8 space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div
          class="size-16 sm:size-20 rounded-2xl flex items-center justify-center shrink-0"
          :class="tierBadgeClass">
          <Icon :name="tierIcon" class="text-[28px] sm:text-[36px]" />
        </div>
        <div class="flex-1 space-y-1.5">
          <div class="flex items-center gap-2.5">
            <span class="text-[22px] sm:text-[28px] font-extrabold text-white">
              {{ status.name }}
            </span>
            <UBadge :color="tierBadgeColor" variant="solid" class="text-[11px]">
              Lv.{{ status.level }}
            </UBadge>
          </div>
          <div class="text-[12px] sm:text-[13px] text-white/50">
            {{ $t('vip.memberSince') }} {{ formattedDate }}
          </div>
        </div>
      </div>

      <!-- 進度條 -->
      <div v-if="nextLevel" class="space-y-2.5">
        <div class="flex items-center justify-between text-[12px] sm:text-[13px]">
          <span class="text-white/50">{{ $t('vip.progressLabel') }}</span>
          <span class="font-bold" :class="tierTextClass">{{ progressPercent }}%</span>
        </div>
        <div class="w-full h-3 rounded-full bg-white/5 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-700 ease-out"
            :class="tierBarClass"
            :style="{ width: `${progressPercent}%` }" />
        </div>
        <div class="flex items-center justify-between text-[11px] sm:text-[12px] text-white/40">
          <span>${{ formatNumber(status.currentChip) }}</span>
          <span>
            {{ $t('vip.nextLevel') }}: {{ nextLevel.name }} (${{
              formatNumber(status.nextLevelMinChip)
            }})
          </span>
        </div>
      </div>
      <div v-else class="text-[13px] text-white/50 flex items-center gap-2">
        <Icon name="i-lucide-sparkles" class="size-4 text-amber-400" />
        {{ $t('vip.maxLevel') }}
      </div>
    </div>
  </div>

  <!-- 數據卡片 -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
    <div class="rounded-xl bg-[#131f30] ring-1 ring-white/8 p-3.5 sm:p-4 space-y-1.5">
      <div class="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-white/40">
        <Icon name="i-lucide-coins" class="size-3.5 text-amber-400" />
        {{ $t('vip.totalDeposit') }}
      </div>
      <div class="text-[18px] sm:text-[22px] font-bold text-amber-400">
        ${{ formatNumber(status.currentChip) }}
      </div>
    </div>
    <div class="rounded-xl bg-[#131f30] ring-1 ring-white/8 p-3.5 sm:p-4 space-y-1.5">
      <div class="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-white/40">
        <Icon name="i-lucide-trophy" class="size-3.5 text-emerald-400" />
        {{ $t('vip.currentTier') }}
      </div>
      <div class="text-[18px] sm:text-[22px] font-bold text-emerald-400">
        {{ tierLabel }}
      </div>
    </div>
    <div class="rounded-xl bg-[#131f30] ring-1 ring-white/8 p-3.5 sm:p-4 space-y-1.5">
      <div class="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-white/40">
        <Icon name="i-lucide-percent" class="size-3.5 text-blue-400" />
        {{ $t('vip.maxRebate') }}
      </div>
      <div class="text-[18px] sm:text-[22px] font-bold text-blue-400">{{ maxRebateRate }}%</div>
    </div>
    <div class="rounded-xl bg-[#131f30] ring-1 ring-white/8 p-3.5 sm:p-4 space-y-1.5">
      <div class="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-white/40">
        <Icon name="i-lucide-shield-check" class="size-3.5 text-rose-400" />
        {{ $t('vip.relegation') }}
      </div>
      <div class="text-[18px] sm:text-[22px] font-bold text-rose-400">
        ${{ formatNumber(status.relegationChip) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface VipLevel {
    level: number;
    name: string;
    tier: string;
    minChip: string;
    relegationChip: string;
  }

  interface Rebate {
    gameType: string;
    rebateRate: string;
  }

  interface VipStatus {
    level: number;
    name: string;
    tier: string;
    currentChip: string;
    nextLevelMinChip: string;
    progress: string;
    relegationChip: string;
    rebates: Rebate[];
    allLevels: VipLevel[];
  }

  const props = defineProps<{
    status: VipStatus;
    createdAt?: string;
  }>();

  // ---- Tier 樣式 ----
  interface TierStyle {
    bg: string;
    badge: string;
    bar: string;
    text: string;
    icon: string;
    badgeColor: string;
  }

  const tierStyles: Record<string, TierStyle> = {
    bronze: {
      bg: 'bg-linear-to-br from-[#2a1f14] to-[#131f30]',
      badge: 'bg-linear-to-br from-amber-700/30 to-amber-900/20 ring-1 ring-amber-600/30',
      bar: 'bg-linear-to-r from-amber-700 to-amber-500',
      text: 'text-amber-500',
      badgeColor: 'warning',
      icon: 'noto:3rd-place-medal',
    },
    gold: {
      bg: 'bg-linear-to-br from-[#2a2414] to-[#131f30]',
      badge: 'bg-linear-to-br from-amber-500/30 to-amber-700/20 ring-1 ring-amber-400/30',
      bar: 'bg-linear-to-r from-amber-500 to-amber-300',
      text: 'text-amber-400',
      badgeColor: 'warning',
      icon: 'noto:1st-place-medal',
    },
    platinum: {
      bg: 'bg-linear-to-br from-[#1a1f2e] to-[#131f30]',
      badge: 'bg-linear-to-br from-blue-500/30 to-blue-700/20 ring-1 ring-blue-400/30',
      bar: 'bg-linear-to-r from-blue-500 to-blue-300',
      text: 'text-blue-400',
      badgeColor: 'info',
      icon: 'noto:gem-stone',
    },
    diamond: {
      bg: 'bg-linear-to-br from-[#1f142a] to-[#131f30]',
      badge: 'bg-linear-to-br from-purple-500/30 to-purple-700/20 ring-1 ring-purple-400/30',
      bar: 'bg-linear-to-r from-purple-500 to-purple-300',
      text: 'text-purple-400',
      badgeColor: 'error',
      icon: 'noto:crown',
    },
  };

  const getStyle = (tier: string) => (tierStyles[tier] ?? tierStyles.bronze)!;
  const style = computed(() => getStyle(props.status.tier));

  const tierBgClass = computed(() => style.value.bg);
  const tierBadgeClass = computed(() => style.value.badge);
  const tierBarClass = computed(() => style.value.bar);
  const tierTextClass = computed(() => style.value.text);
  const tierIcon = computed(() => style.value.icon);
  const tierBadgeColor = computed(() => style.value.badgeColor as any);

  const tierLabel = computed(() => {
    const labels: Record<string, string> = { bronze: '青銅', gold: '黃金', platinum: '鉑金', diamond: '鑽石' };
    return labels[props.status.tier] || props.status.tier || '';
  });

  const progressPercent = computed(() => {
    const p = Number(props.status.progress || 0);
    return Math.min(100, Math.round(p * 100));
  });

  const nextLevel = computed(() =>
    props.status.allLevels.find((lv) => lv.level === props.status.level + 1) || null,
  );

  const maxRebateRate = computed(() => {
    if (!props.status.rebates?.length) return '0.00';
    return Math.max(...props.status.rebates.map((r) => Number(r.rebateRate))).toFixed(2);
  });

  const formatNumber = (val: string | number) => {
    const n = Number(val || 0);
    return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const formattedDate = computed(() => {
    if (!props.createdAt) return '-';
    try {
      return new Date(props.createdAt).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return props.createdAt;
    }
  });
</script>
