<template>
  <div class="space-y-3">
    <!-- 標題列 -->
    <div class="flex items-center justify-between gap-3 px-1">
      <div class="flex items-center gap-2">
        <Icon name="noto:trophy" class="text-[20px] sm:text-[24px]" />
        <span class="text-[16px] sm:text-[20px] font-bold text-white">排行榜</span>
      </div>
    </div>
    <!-- Tabs -->
    <div class="flex items-center gap-1.5 sm:gap-2">
      <button
        v-for="(tab, idx) in rankingTabs"
        :key="idx"
        type="button"
        class="flex-1 min-w-0 py-2 rounded-lg text-[11px] sm:text-[13px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap text-center"
        :class="
          activeTab === idx
            ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25'
            : 'bg-white/5 text-white/50 ring-1 ring-white/8 hover:bg-white/8 hover:text-white/70'
        "
        @click="switchTab(idx)">
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-2">
      <div v-for="i in 6" :key="i" class="animate-pulse h-14 rounded-xl bg-white/5" />
    </div>

    <!-- 所有排行（統一自動捲動） -->
    <template v-else>
      <div v-if="!rankingList.length" class="text-center py-12 text-white/30 text-[13px]">
        暫無排行資料
      </div>
      <div
        v-else
        ref="containerRef"
        class="w-full select-none touch-none"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @pointerleave="onPointerUp">
        <!-- Header -->
        <div
          class="mb-3 grid items-center px-4 py-3 text-sm font-medium text-white/80 rounded-xl bg-linear-to-b from-white/5 to-white/0 border border-white/10 backdrop-blur"
          :class="gridClass">
          <div v-if="showRank" class="text-center tracking-wider">#</div>
          <template v-if="isTotal">
            <div class="tracking-wider">玩家</div>
            <div class="tracking-wider text-right">累積提領</div>
          </template>
          <template v-else>
            <div class="tracking-wider">遊戲</div>
            <div class="hidden md:block tracking-wider">玩家</div>
            <div class="hidden md:block tracking-wider">時間</div>
            <div class="hidden md:block tracking-wider">投注額</div>
            <div class="hidden md:block tracking-wider">乘數</div>
            <div class="tracking-wider text-right">支付額</div>
          </template>
        </div>
        <!-- Viewport -->
        <div class="relative overflow-hidden box-border" :style="viewportStyle">
          <div
            ref="trackRef"
            class="relative flex flex-col will-change-transform"
            :class="transitionEnabled ? 'transition-transform duration-500 ease-out' : ''"
            :style="trackStyle"
            @transitionend.self="onTrackTransitionEnd">
            <div
              v-for="item in renderList"
              :key="item.__loopKey"
              class="grid items-center bg-[#232f42] rounded-xl px-4 py-2 text-white"
              :class="gridClass">
              <!-- Rank -->
              <div v-if="showRank" class="text-center">
                <span
                  v-if="item.__originalIndex < 3"
                  class="inline-flex items-center justify-center size-6 rounded-full text-[11px] font-bold"
                  :class="[
                    item.__originalIndex === 0
                      ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30'
                      : '',
                    item.__originalIndex === 1
                      ? 'bg-slate-400/20 text-slate-300 ring-1 ring-slate-400/30'
                      : '',
                    item.__originalIndex === 2
                      ? 'bg-orange-600/20 text-orange-400 ring-1 ring-orange-500/30'
                      : '',
                  ]">
                  {{ item.__originalIndex + 1 }}
                </span>
                <span v-else class="text-[12px] text-white/40">{{ item.__originalIndex + 1 }}</span>
              </div>

              <!-- 累積提領 row -->
              <template v-if="isTotal">
                <div class="flex items-center gap-2 min-w-0">
                  <Icon name="i-lucide-user" class="size-4 text-white/40 shrink-0" />
                  <span class="truncate text-[13px] sm:text-[14px] font-medium">{{
                    item.playerName
                  }}</span>
                </div>
                <div class="text-right text-[14px] sm:text-[15px] font-bold text-emerald-400">
                  {{ item.payout }}
                </div>
              </template>

              <!-- 一般排行 row -->
              <template v-else>
                <div class="flex items-center gap-3 font-semibold min-w-0">
                  <i :class="item.gameIcon" class="text-xl shrink-0" />
                  <span class="truncate">{{ item.gameName }}</span>
                </div>
                <div class="hidden md:flex items-center gap-2 text-white/80 min-w-0">
                  <i :class="item.playerIcon" class="shrink-0" />
                  <span class="truncate">{{ item.playerName }}</span>
                </div>
                <div class="hidden md:block text-white/60 truncate">{{ item.time }}</div>
                <div class="hidden md:flex items-center gap-2 min-w-0">
                  <span class="truncate">{{ item.betAmount }}</span>
                </div>
                <div class="hidden md:block text-white/80 truncate">{{ item.multiplier }}</div>
                <div
                  class="flex items-center justify-end gap-2 font-semibold min-w-0 text-right"
                  :class="item.payoutPositive ? 'text-green-400' : 'text-red-400'">
                  <span class="truncate">{{ item.payout }}</span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
  import { useIntervalFn, useResizeObserver, useEventListener } from '@vueuse/core';

  const { formatAmount, formatTime } = utsFormat();

  // ---- API response types ----
  interface RankingBet {
    id: number;
    gameName: string;
    playerName: string;
    time: string;
    betAmount: string;
    multiplier: string;
    payout: string;
    isAnonymous: boolean;
  }

  interface RankingTotal {
    playerAccount: string;
    totalPayout: string;
  }

  interface RankingItem {
    id: string | number;
    gameIcon: string;
    gameName: string;
    playerIcon: string;
    playerName: string;
    time: string;
    betAmount: string;
    multiplier: string;
    payout: string;
    payoutPositive?: boolean;
  }

  type LoopItem = RankingItem & { __loopKey: string; __originalIndex: number };

  // ---- tabs & state ----
  const activeTab = ref(0);
  const loading = ref(false);
  const rankingList = ref<RankingItem[]>([]);

  const defaultTab = { label: '即時投注', value: 'realtime' };
  const rankingTabs = [
    defaultTab,
    { label: '每日排行', value: 'daily' },
    { label: '每週排行', value: 'weekly' },
    { label: '每月排行', value: 'monthly' },
    { label: '累積提領', value: 'total' },
  ];

  const currentTab = computed(() => rankingTabs[activeTab.value] ?? defaultTab);
  const isTotal = computed(() => currentTab.value.value === 'total');
  const showRank = computed(() => currentTab.value.value !== 'realtime');
  const maxVisibleRows = 10;

  const gridClass = computed(() => {
    if (isTotal.value) return 'grid-cols-[2rem_1fr_auto]';
    if (showRank.value)
      return 'grid-cols-[2rem_1fr_auto] md:grid-cols-[2rem_1.2fr_1fr_1fr_1fr_1fr_1fr]';
    return 'grid-cols-[1fr_auto] md:grid-cols-[1.3fr_1fr_1fr_1fr_1fr_1fr]';
  });

  // ---- template refs ----
  const containerRef = useTemplateRef<HTMLElement>('containerRef');
  const trackRef = useTemplateRef<HTMLElement>('trackRef');

  // ---- 遊戲名 → icon 映射 ----
  const gameIconMap: Record<string, string> = {
    blackjack: 'mdi mdi-cards',
    baccarat: 'mdi mdi-cards-diamond',
    roulette: 'mdi mdi-cards-heart',
    poker: 'mdi mdi-poker-chip',
    slots: 'mdi mdi-slot-machine',
    dice: 'mdi mdi-dice-6',
    plinko: 'mdi mdi-dots-triangle',
  };

  const guessGameIcon = (name: string): string => {
    const lower = name.toLowerCase();
    for (const [key, icon] of Object.entries(gameIconMap)) {
      if (lower.includes(key)) return icon;
    }
    return 'mdi mdi-gamepad-variant';
  };

  // ---- 轉換 API 回應 → RankingItem ----
  const transformBet = (item: RankingBet): RankingItem => {
    const payout = Number(item.payout || 0);
    const bet = Number(item.betAmount || 0);
    const isPositive = payout >= bet;

    return {
      id: item.id,
      gameIcon: guessGameIcon(item.gameName),
      gameName: item.gameName,
      playerIcon: item.isAnonymous ? 'mdi mdi-incognito' : 'mdi mdi-account',
      playerName: item.playerName,
      time: formatTime(item.time),
      betAmount: `$${formatAmount(item.betAmount)}`,
      multiplier: `${Number(item.multiplier || 0).toFixed(2)}x`,
      payout: isPositive ? `$${formatAmount(payout)}` : `-$${formatAmount(Math.abs(payout))}`,
      payoutPositive: isPositive,
    };
  };

  const transformTotal = (item: RankingTotal, idx: number): RankingItem => ({
    id: `total-${idx}`,
    gameIcon: '',
    gameName: '',
    playerIcon: '',
    playerName: item.playerAccount,
    time: '',
    betAmount: '',
    multiplier: '',
    payout: `$${formatAmount(item.totalPayout)}`,
    payoutPositive: true,
  });

  // ---- 載入資料 ----
  const fetchRanking = async () => {
    const type = currentTab.value.value;
    loading.value = true;

    try {
      const res = await useApi().getRanking({ type, limit: 20 });

      if (res?.code === 200) {
        const data = res.result || [];
        rankingList.value = type === 'total' ? data.map(transformTotal) : data.map(transformBet);
      }
    } catch (e) {
      console.error('[Ranking] fetch failed', e);
    } finally {
      loading.value = false;
    }
  };

  const switchTab = (idx: number) => {
    if (activeTab.value === idx) return;
    activeTab.value = idx;
    fetchRanking();
  };

  // ====================== 自動捲動邏輯 ======================

  const gapPx = 8;
  const intervalMs = 2000;

  const baseList = computed(() => rankingList.value);
  const canScroll = computed(() => baseList.value.length > maxVisibleRows);

  const virtualIndex = ref(0);
  const transitionEnabled = ref(true);
  const isHolding = ref(false);

  const offsets = ref<number[]>([]);
  const heights = ref<number[]>([]);
  const contentViewportHeight = ref(0);

  // ---- render list (clone for seamless loop) ----
  const renderList = computed<LoopItem[]>(() => {
    const base = baseList.value;
    if (!base.length) return [];

    if (!canScroll.value) {
      return base.map((it, idx) => ({
        ...it,
        __loopKey: `${String(it.id)}-${idx}`,
        __originalIndex: idx,
      }));
    }

    const clones = base.slice(0, Math.min(maxVisibleRows, base.length));
    const merged = [...base, ...clones];

    return merged.map((it, idx) => ({
      ...it,
      __loopKey: `${String(it.id)}-${idx}`,
      __originalIndex: idx % base.length,
    }));
  });

  // ---- layout calc ----
  let rafLock = 0;

  const recalcLayout = (disableTransition = true) => {
    if (rafLock) return;
    rafLock = requestAnimationFrame(() => {
      rafLock = 0;

      if (!trackRef.value) return;

      const nodes = Array.from(trackRef.value.children).filter(
        (n): n is HTMLElement => n instanceof HTMLElement,
      );
      if (!nodes.length) return;

      trackRef.value.style.gap = `${gapPx}px`;

      if (disableTransition) transitionEnabled.value = false;

      offsets.value = nodes.map((el) => el.offsetTop);
      heights.value = nodes.map((el) => Math.round(el.getBoundingClientRect().height));

      const v = Math.min(maxVisibleRows, nodes.length);
      const last = Math.max(v - 1, 0);
      const bottom = (offsets.value[last] ?? 0) + (heights.value[last] ?? 0);

      contentViewportHeight.value = Math.max(1, Math.round(bottom));

      const len = baseList.value.length;
      if (len) {
        virtualIndex.value = Math.min(
          Math.max(virtualIndex.value, 0),
          canScroll.value ? len : len - 1,
        );
      } else {
        virtualIndex.value = 0;
      }

      if (disableTransition) {
        requestAnimationFrame(() => {
          transitionEnabled.value = true;
        });
      }
    });
  };

  // ---- styles ----
  const viewportStyle = computed(() => {
    const h = contentViewportHeight.value;
    if (!h) return {};
    return { height: `${h}px` } as Record<string, string>;
  });

  const trackStyle = computed(() => {
    const y = offsets.value[virtualIndex.value] ?? 0;
    return {
      transform: `translate3d(0, -${Math.round(y)}px, 0)`,
      gap: `${gapPx}px`,
    } as Record<string, string>;
  });

  // ---- auto scroll (useIntervalFn) ----
  const { pause: pauseScroll, resume: resumeScroll } = useIntervalFn(
    () => {
      if (isHolding.value || !canScroll.value) return;
      const len = baseList.value.length;
      if (!len) return;
      transitionEnabled.value = true;
      virtualIndex.value += 1;
    },
    intervalMs,
    { immediate: false },
  );

  // ---- seamless loop ----
  const onTrackTransitionEnd = (e: TransitionEvent) => {
    if (e.propertyName !== 'transform') return;

    const len = baseList.value.length;
    if (!canScroll.value || !len) return;

    if (virtualIndex.value >= len) {
      transitionEnabled.value = false;
      virtualIndex.value = 0;

      requestAnimationFrame(() => {
        transitionEnabled.value = true;
      });
    }
  };

  // ---- pointer drag / hold ----
  let pointerId: number | null = null;
  let startY = 0;
  let lastDelta = 0;

  const currentThreshold = () => {
    const len = baseList.value.length;
    if (!len) return 20;

    const normalized = ((virtualIndex.value % len) + len) % len;
    const h = heights.value[normalized] ?? 80;
    return Math.max(12, Math.round(h / 2));
  };

  const onPointerDown = (e: PointerEvent) => {
    if (!canScroll.value) return;

    pointerId = e.pointerId;
    containerRef.value?.setPointerCapture(pointerId);

    isHolding.value = true;
    pauseScroll();

    startY = e.clientY;
    lastDelta = 0;
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isHolding.value) return;
    if (pointerId !== e.pointerId) return;

    lastDelta = e.clientY - startY;
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!isHolding.value) return;
    if (pointerId !== null && pointerId !== e.pointerId) return;

    try {
      if (pointerId !== null) containerRef.value?.releasePointerCapture(pointerId);
    } catch {
      // ignore
    }

    const len = baseList.value.length;

    if (len && Math.abs(lastDelta) > currentThreshold()) {
      const base = ((virtualIndex.value % len) + len) % len;

      transitionEnabled.value = true;

      if (lastDelta > 0) {
        virtualIndex.value = Math.max(base - 1, 0);
      } else {
        virtualIndex.value = Math.min(base + 1, len);
      }
    }

    pointerId = null;
    lastDelta = 0;
    isHolding.value = false;

    resumeScroll();
  };

  // ---- resize observer (useResizeObserver) ----
  useResizeObserver(trackRef, () => recalcLayout(true));

  // ---- window resize (useEventListener) ----
  useEventListener('resize', () => recalcLayout(true));

  // ---- realtime 自動更新 (useIntervalFn) ----
  const { pause: pauseRefresh, resume: resumeRefresh } = useIntervalFn(fetchRanking, 15000, {
    immediate: false,
  });

  const startRefresh = () => {
    pauseRefresh();
    if (currentTab.value.value === 'realtime') {
      resumeRefresh();
    }
  };

  // ---- lifecycle ----
  onMounted(fetchRanking);
  onMounted(startRefresh);

  watch(activeTab, () => startRefresh());

  watch(rankingList, async () => {
    virtualIndex.value = 0;
    await nextTick();
    recalcLayout(true);
    resumeScroll();
  });
</script>
