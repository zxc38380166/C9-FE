<template>
  <div class="space-y-5 sm:space-y-8">
    <!-- 頁面標題 -->
    <div
      class="flex items-center gap-3 rounded-2xl bg-[#131f30] ring-1 ring-white/8 px-5 py-4 sm:px-6 sm:py-5">
      <div
        class="size-10 sm:size-12 rounded-xl bg-linear-to-br from-amber-500/20 to-amber-700/10 ring-1 ring-amber-500/30 flex items-center justify-center">
        <Icon name="noto:crown" class="text-[20px] sm:text-[24px]" />
      </div>
      <div>
        <span class="text-[16px] sm:text-[20px] font-bold text-white">{{ $t('vip.title') }}</span>
        <p class="text-[11px] sm:text-[12px] text-white/40">{{ $t('vip.subtitle') }}</p>
      </div>
    </div>

    <!-- Loading skeleton -->
    <template v-if="loading">
      <div class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-8 animate-pulse space-y-5">
        <div class="flex items-center gap-4">
          <div class="size-16 rounded-2xl bg-white/5" />
          <div class="space-y-2 flex-1">
            <div class="h-6 w-40 bg-white/5 rounded-lg" />
            <div class="h-4 w-60 bg-white/5 rounded-lg" />
          </div>
        </div>
        <div class="h-3 w-full bg-white/5 rounded-full" />
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div v-for="i in 4" :key="i" class="h-20 bg-white/5 rounded-xl" />
        </div>
      </div>
    </template>

    <!-- 未登入提示 -->
    <template v-else-if="!isLogin">
      <div
        class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-8 sm:p-12 flex flex-col items-center gap-5">
        <Icon name="i-lucide-lock" class="size-12 text-white/20" />
        <div class="text-center space-y-2">
          <div class="text-[16px] sm:text-[18px] font-bold text-white/70">
            {{ $t('vip.loginRequired') }}
          </div>
          <div class="text-[13px] text-white/40">{{ $t('vip.loginHint') }}</div>
        </div>
        <button
          class="px-8 py-3 rounded-xl text-[14px] font-bold bg-linear-to-r from-amber-500 to-amber-600 text-white shadow-[0_0_24px_-4px_rgba(245,158,11,0.4)] hover:from-amber-400 hover:to-amber-500 cursor-pointer transition-all"
          @click="openLoginModal()">
          <Icon name="i-lucide-log-in" class="size-4 inline mr-1.5" />
          {{ $t('vip.loginBtn') }}
        </button>
      </div>
    </template>

    <!-- VIP 內容 -->
    <template v-else-if="status">
      <!-- 當前等級卡片 -->
      <div class="rounded-2xl ring-1 ring-white/8 overflow-hidden" :class="tierBgClass">
        <div class="p-5 sm:p-8 space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <!-- 等級 badge -->
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
                {{ $t('vip.memberSince') }} {{ formatDate(userData?.createdAt) }}
              </div>
            </div>
          </div>

          <!-- 進度條 -->
          <div v-if="nextLevel" class="space-y-2.5">
            <div class="flex items-center justify-between text-[12px] sm:text-[13px]">
              <span class="text-white/50">
                {{ $t('vip.progressLabel') }}
              </span>
              <span class="font-bold" :class="tierTextClass"> {{ progressPercent }}% </span>
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

      <!-- 當前返水比例 -->
      <div class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-8 space-y-4">
        <div class="flex items-center gap-2">
          <Icon name="noto:money-with-wings" class="text-[20px] sm:text-[24px]" />
          <span class="text-[16px] sm:text-[20px] font-bold text-white">{{
            $t('vip.myRebates')
          }}</span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div
            v-for="rebate in status.rebates"
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

      <!-- 全部等級一覽 -->
      <div class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-8 space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon name="noto:chart-increasing" class="text-[20px] sm:text-[24px]" />
            <span class="text-[16px] sm:text-[20px] font-bold text-white">{{
              $t('vip.allLevels')
            }}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <button
              class="size-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              :class="
                canScrollLeft
                  ? 'bg-white/8 hover:bg-white/12 text-white/70'
                  : 'bg-white/3 text-white/15 cursor-not-allowed'
              "
              :disabled="!canScrollLeft"
              @click="scrollLevels('left')">
              <Icon name="i-lucide-chevron-left" class="size-4" />
            </button>
            <button
              class="size-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              :class="
                canScrollRight
                  ? 'bg-white/8 hover:bg-white/12 text-white/70'
                  : 'bg-white/3 text-white/15 cursor-not-allowed'
              "
              :disabled="!canScrollRight"
              @click="scrollLevels('right')">
              <Icon name="i-lucide-chevron-right" class="size-4" />
            </button>
          </div>
        </div>
        <div
          ref="levelScrollRef"
          class="overflow-x-auto scrollbar-hide -mx-1 px-1"
          @scroll="updateScrollState">
          <div class="flex gap-3 py-1 w-max">
            <div
              v-for="lv in status.allLevels"
              :key="lv.level"
              class="w-37.5 shrink-0 rounded-xl p-4 space-y-2.5 transition-all duration-300"
              :class="
                lv.level === status.level
                  ? `${getTierBgClass(lv.tier)} ring-2 ${getTierRingClass(lv.tier)} shadow-lg`
                  : 'bg-white/3 ring-1 ring-white/6'
              ">
              <div class="flex items-center justify-between">
                <UBadge :color="getTierBadgeColor(lv.tier)" variant="solid" class="text-[10px]">
                  Lv.{{ lv.level }}
                </UBadge>
                <Icon
                  v-if="lv.level === status.level"
                  name="i-lucide-check-circle"
                  class="size-4 text-emerald-400" />
                <Icon
                  v-else-if="lv.level < status.level"
                  name="i-lucide-circle-check-big"
                  class="size-4 text-white/20" />
              </div>
              <div class="text-[14px] sm:text-[15px] font-bold text-white">
                {{ lv.name }}
              </div>
              <div class="text-[11px] text-white/40">
                {{ $t('vip.minDeposit') }}: ${{ formatNumber(lv.minChip) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 返水比例總表 -->
      <div class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-8 space-y-4">
        <div class="flex items-center gap-2">
          <Icon name="noto:bar-chart" class="text-[20px] sm:text-[24px]" />
          <span class="text-[16px] sm:text-[20px] font-bold text-white">{{
            $t('vip.rebateTable')
          }}</span>
        </div>
        <div class="text-[12px] sm:text-[13px] text-white/40">
          {{ $t('vip.rebateDesc') }}
        </div>
        <div class="overflow-x-auto scrollbar-hide -mx-2 px-2">
          <table class="w-full min-w-150 border-collapse text-[12px] sm:text-[13px]">
            <thead>
              <tr>
                <th
                  class="text-left py-3 px-3 sm:px-4 bg-white/5 rounded-tl-lg text-white/70 font-semibold">
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
                v-for="lv in status.allLevels"
                :key="lv.level"
                class="border-t border-white/5 transition-colors"
                :class="lv.level === status.level ? 'bg-emerald-500/8' : 'hover:bg-white/2'">
                <td class="py-2.5 px-3 sm:px-4 font-semibold whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <span
                      v-if="lv.level === status.level"
                      class="size-1.5 rounded-full bg-emerald-400" />
                    <span :class="lv.level === status.level ? 'text-emerald-400' : 'text-white/70'">
                      {{ lv.name }}
                    </span>
                  </div>
                </td>
                <td
                  v-for="gt in gameTypes"
                  :key="gt.key"
                  class="text-center py-2.5 px-2 sm:px-3"
                  :class="
                    lv.level === status.level ? 'text-emerald-400 font-bold' : 'text-white/50'
                  ">
                  {{ getRebateForLevel(lv.level, gt.key) }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- VIP 特權說明 -->
      <div class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-8 space-y-4">
        <div class="flex items-center gap-2">
          <Icon name="noto:star" class="text-[20px] sm:text-[24px]" />
          <span class="text-[16px] sm:text-[20px] font-bold text-white">{{
            $t('vip.benefits')
          }}</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div
            v-for="(benefit, idx) in benefits"
            :key="idx"
            class="rounded-xl bg-white/3 ring-1 ring-white/6 p-4 sm:p-5 space-y-2.5">
            <div class="flex items-center gap-2.5">
              <div
                class="size-8 sm:size-9 rounded-lg flex items-center justify-center"
                :class="benefit.bgClass">
                <Icon :name="benefit.icon" class="size-4 sm:size-4.5" :class="benefit.iconClass" />
              </div>
              <span class="text-[14px] sm:text-[15px] font-bold text-white">{{
                benefit.title
              }}</span>
            </div>
            <p class="text-[12px] sm:text-[13px] text-white/50 leading-relaxed">
              {{ benefit.desc }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  const { t } = useI18n();
  const { isLogin } = useAuth();
  const { openLoginModal } = useLayout();
  const store = useStore();

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

  interface AllRebate {
    level: number;
    gameType: string;
    rebateRate: string;
  }

  const loading = ref(true);
  const status = ref<VipStatus | null>(null);
  const allRebates = ref<AllRebate[]>([]);

  const userData = computed(() => store.getUserDetail);

  // ---- Tier 樣式 ----
  interface TierStyle {
    bg: string;
    badge: string;
    bar: string;
    text: string;
    ring: string;
    badgeColor: string;
    icon: string;
  }
  const tierStyles: {
    [K: string]: TierStyle;
    bronze: TierStyle;
    gold: TierStyle;
    platinum: TierStyle;
    diamond: TierStyle;
  } = {
    bronze: {
      bg: 'bg-linear-to-br from-[#2a1f14] to-[#131f30]',
      badge: 'bg-linear-to-br from-amber-700/30 to-amber-900/20 ring-1 ring-amber-600/30',
      bar: 'bg-linear-to-r from-amber-700 to-amber-500',
      text: 'text-amber-500',
      ring: 'ring-amber-600/40',
      badgeColor: 'warning',
      icon: 'noto:3rd-place-medal',
    },
    gold: {
      bg: 'bg-linear-to-br from-[#2a2414] to-[#131f30]',
      badge: 'bg-linear-to-br from-amber-500/30 to-amber-700/20 ring-1 ring-amber-400/30',
      bar: 'bg-linear-to-r from-amber-500 to-amber-300',
      text: 'text-amber-400',
      ring: 'ring-amber-400/40',
      badgeColor: 'warning',
      icon: 'noto:1st-place-medal',
    },
    platinum: {
      bg: 'bg-linear-to-br from-[#1a1f2e] to-[#131f30]',
      badge: 'bg-linear-to-br from-blue-500/30 to-blue-700/20 ring-1 ring-blue-400/30',
      bar: 'bg-linear-to-r from-blue-500 to-blue-300',
      text: 'text-blue-400',
      ring: 'ring-blue-400/40',
      badgeColor: 'info',
      icon: 'noto:gem-stone',
    },
    diamond: {
      bg: 'bg-linear-to-br from-[#1f142a] to-[#131f30]',
      badge: 'bg-linear-to-br from-purple-500/30 to-purple-700/20 ring-1 ring-purple-400/30',
      bar: 'bg-linear-to-r from-purple-500 to-purple-300',
      text: 'text-purple-400',
      ring: 'ring-purple-400/40',
      badgeColor: 'error',
      icon: 'noto:crown',
    },
  };

  const getStyle = (tier: string): TierStyle => {
    return tierStyles[tier] ?? tierStyles.bronze;
  };

  const currentTierStyle = computed(() => getStyle(status.value?.tier || 'bronze'));
  const tierBgClass = computed(() => currentTierStyle.value.bg);
  const tierBadgeClass = computed(() => currentTierStyle.value.badge);
  const tierBarClass = computed(() => currentTierStyle.value.bar);
  const tierTextClass = computed(() => currentTierStyle.value.text);
  const tierIcon = computed(() => currentTierStyle.value.icon);
  const tierBadgeColor = computed(() => currentTierStyle.value.badgeColor as any);

  const tierLabel = computed(() => {
    const labels: Record<string, string> = {
      bronze: '青銅',
      gold: '黃金',
      platinum: '鉑金',
      diamond: '鑽石',
    };
    return labels[status.value?.tier || 'bronze'] || status.value?.tier || '';
  });

  const getTierBgClass = (tier: string) => getStyle(tier).bg;
  const getTierRingClass = (tier: string) => getStyle(tier).ring;
  const getTierBadgeColor = (tier: string) => getStyle(tier).badgeColor as any;

  // ---- 等級捲動 ----
  const levelScrollRef = ref<HTMLElement | null>(null);
  const canScrollLeft = ref(false);
  const canScrollRight = ref(false);

  const updateScrollState = () => {
    const el = levelScrollRef.value;
    if (!el) return;
    canScrollLeft.value = el.scrollLeft > 0;
    canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
  };

  const scrollLevels = (dir: 'left' | 'right') => {
    const el = levelScrollRef.value;
    if (!el) return;
    const step = 330;
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  watch(
    () => status.value?.allLevels,
    () => nextTick(updateScrollState),
  );

  // ---- 進度 ----
  const progressPercent = computed(() => {
    const p = Number(status.value?.progress || 0);
    return Math.min(100, Math.round(p * 100));
  });

  const nextLevel = computed(() => {
    if (!status.value?.allLevels) return null;
    return status.value.allLevels.find((lv) => lv.level === status.value!.level + 1) || null;
  });

  const maxRebateRate = computed(() => {
    if (!status.value?.rebates?.length) return '0.00';
    return Math.max(...status.value.rebates.map((r) => Number(r.rebateRate))).toFixed(2);
  });

  // ---- 遊戲類型 ----
  const gameTypes = [
    {
      key: 'live',
      label: t('vip.gameType.live'),
      icon: 'i-lucide-tv',
      bg: 'bg-rose-500/15 text-rose-400',
    },
    {
      key: 'slots',
      label: t('vip.gameType.slots'),
      icon: 'i-lucide-cherry',
      bg: 'bg-purple-500/15 text-purple-400',
    },
    {
      key: 'cards',
      label: t('vip.gameType.cards'),
      icon: 'i-lucide-spade',
      bg: 'bg-blue-500/15 text-blue-400',
    },
    {
      key: 'crypto',
      label: t('vip.gameType.crypto'),
      icon: 'i-lucide-bitcoin',
      bg: 'bg-amber-500/15 text-amber-400',
    },
    {
      key: 'sports',
      label: t('vip.gameType.sports'),
      icon: 'i-lucide-trophy',
      bg: 'bg-emerald-500/15 text-emerald-400',
    },
    {
      key: 'bonus',
      label: t('vip.gameType.bonus'),
      icon: 'i-lucide-gift',
      bg: 'bg-pink-500/15 text-pink-400',
    },
  ];

  const gameTypeIcon = (type: string) =>
    gameTypes.find((g) => g.key === type)?.icon || 'i-lucide-gamepad-2';
  const gameTypeIconBg = (type: string) =>
    gameTypes.find((g) => g.key === type)?.bg || 'bg-white/10 text-white/60';
  const gameTypeName = (type: string) => gameTypes.find((g) => g.key === type)?.label || type;

  // ---- 返水表格 ----
  const rebateMap = computed(() => {
    const map = new Map<string, string>();
    allRebates.value.forEach((r) => {
      map.set(`${r.level}-${r.gameType}`, r.rebateRate);
    });
    return map;
  });

  const getRebateForLevel = (level: number, gameType: string) => {
    return rebateMap.value.get(`${level}-${gameType}`) || '0.00';
  };

  // ---- VIP 特權 ----
  const benefits = computed(() => [
    {
      icon: 'i-lucide-percent',
      title: t('vip.benefit.rebate.title'),
      desc: t('vip.benefit.rebate.desc'),
      bgClass: 'bg-emerald-500/15',
      iconClass: 'text-emerald-400',
    },
    {
      icon: 'i-lucide-headset',
      title: t('vip.benefit.cs.title'),
      desc: t('vip.benefit.cs.desc'),
      bgClass: 'bg-blue-500/15',
      iconClass: 'text-blue-400',
    },
    {
      icon: 'i-lucide-arrow-up-circle',
      title: t('vip.benefit.upgrade.title'),
      desc: t('vip.benefit.upgrade.desc'),
      bgClass: 'bg-amber-500/15',
      iconClass: 'text-amber-400',
    },
    {
      icon: 'i-lucide-cake',
      title: t('vip.benefit.birthday.title'),
      desc: t('vip.benefit.birthday.desc'),
      bgClass: 'bg-rose-500/15',
      iconClass: 'text-rose-400',
    },
    {
      icon: 'i-lucide-zap',
      title: t('vip.benefit.withdraw.title'),
      desc: t('vip.benefit.withdraw.desc'),
      bgClass: 'bg-purple-500/15',
      iconClass: 'text-purple-400',
    },
    {
      icon: 'i-lucide-ticket',
      title: t('vip.benefit.event.title'),
      desc: t('vip.benefit.event.desc'),
      bgClass: 'bg-pink-500/15',
      iconClass: 'text-pink-400',
    },
  ]);

  // ---- Utils ----
  const formatNumber = (val: string | number) => {
    const n = Number(val || 0);
    return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // ---- 載入資料 ----
  const fetchData = async () => {
    loading.value = true;
    try {
      const [statusRes, rebatesRes] = await Promise.all([
        useApi().getVipStatus(),
        useApi().getVipRebates(),
      ]);
      if (statusRes?.code === 200) status.value = statusRes.result;
      if (rebatesRes?.code === 200) allRebates.value = rebatesRes.result || [];
    } catch (e) {
      console.error('[VIP] fetch failed', e);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    if (isLogin.value) {
      fetchData();
    } else {
      loading.value = false;
    }
  });

  watch(isLogin, (val) => {
    if (val) fetchData();
  });
</script>
