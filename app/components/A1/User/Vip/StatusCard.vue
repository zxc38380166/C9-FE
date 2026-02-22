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

  const { formatNumber, formatDate } = utsFormat();
  const { getStyle, getLabel } = utsVipTier();

  const props = defineProps<{
    status: VipStatus;
    createdAt?: string;
  }>();

  // ---- Tier 樣式 ----
  const style = computed(() => getStyle(props.status.tier));

  const tierBgClass = computed(() => style.value.bg);
  const tierBadgeClass = computed(() => style.value.badge);
  const tierBarClass = computed(() => style.value.bar);
  const tierTextClass = computed(() => style.value.text);
  const tierIcon = computed(() => style.value.icon);
  const tierBadgeColor = computed(() => style.value.badgeColor as any);

  const tierLabel = computed(() => getLabel(props.status.tier));

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

  const formattedDate = computed(() => formatDate(props.createdAt || ''));
</script>
