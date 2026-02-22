<template>
  <div
    ref="containerRef"
    class="w-full select-none touch-none"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @pointerleave="onPointerUp">
    <!-- Header -->
    <div
      class="mb-1 grid items-center px-4 py-3 text-sm font-medium text-white/80 rounded-xl bg-linear-to-b from-white/5 to-white/0 border border-white/10 backdrop-blur grid-cols-[1fr_auto] md:grid-cols-[1.3fr_1fr_1fr_1fr_1fr_1fr]">
      <div class="tracking-wider">游戏</div>
      <!-- 只有桌機顯示 -->
      <div class="hidden md:block tracking-wider">玩家</div>
      <div class="hidden md:block tracking-wider">时间</div>
      <div class="hidden md:block tracking-wider">投注额</div>
      <div class="hidden md:block tracking-wider">乘数</div>
      <div class="tracking-wider text-right">支付额</div>
    </div>
    <!-- Viewport -->
    <div ref="listRef" class="relative overflow-hidden box-border" :style="viewportStyle">
      <div
        ref="trackRef"
        class="relative flex flex-col will-change-transform"
        :class="transitionEnabled ? 'transition-transform duration-500 ease-out' : ''"
        :style="trackStyle"
        @transitionend.self="onTrackTransitionEnd">
        <div
          v-for="item in renderList"
          :key="item.__loopKey"
          :ref="setRowRef as VNodeRef"
          class="grid items-center bg-[#232f42] rounded-xl px-4 py-4 text-white grid-cols-[1fr_auto] md:grid-cols-[1.3fr_1fr_1fr_1fr_1fr_1fr]">
          <!-- Game (always) -->
          <div class="flex items-center gap-3 font-semibold min-w-0">
            <i :class="item.gameIcon" class="text-xl shrink-0" />
            <span class="truncate">{{ item.gameName }}</span>
          </div>
          <!-- Player (desktop only) -->
          <div class="hidden md:flex items-center gap-2 text-white/80 min-w-0">
            <i :class="item.playerIcon" class="shrink-0" />
            <span class="truncate">{{ item.playerName }}</span>
          </div>
          <!-- Time (desktop only) -->
          <div class="hidden md:block text-white/60 truncate">
            {{ item.time }}
          </div>
          <!-- Bet (desktop only) -->
          <div class="hidden md:flex items-center gap-2 min-w-0">
            <span class="truncate">{{ item.betAmount }}</span>
            <i v-if="item.betCurrencyIcon" :class="item.betCurrencyIcon" class="shrink-0" />
          </div>
          <!-- Multiplier (desktop only) -->
          <div class="hidden md:block text-white/80 truncate">
            {{ item.multiplier }}
          </div>
          <!-- Payout (always) -->
          <div
            class="flex items-center justify-end gap-2 font-semibold min-w-0 text-right"
            :class="item.payoutPositive ? 'text-green-400' : 'text-red-400'">
            <span class="truncate">{{ item.payout }}</span>
            <i v-if="item.payoutCurrencyIcon" :class="item.payoutCurrencyIcon" class="shrink-0" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { type VNodeRef } from 'vue';

  interface RankingItem {
    id: string | number;
    gameIcon: string;
    gameName: string;
    playerIcon: string;
    playerName: string;
    time: string;
    betAmount: string;
    betCurrencyIcon?: string;
    multiplier: string;
    payout: string;
    payoutCurrencyIcon?: string;
    payoutPositive?: boolean;
  }

  type LoopItem = RankingItem & { __loopKey: string };

  const props = defineProps<{
    items: RankingItem[];
    interval?: number;
    /** 顯示幾列，預設 6 */
    visibleRows?: number;
    /** 列間距 px（用 style gap 控制） */
    rowGapPx?: number;
    /** 上下緩衝，避免圓角/陰影/字體被裁切 */
    bufferPx?: number;
  }>();

  /* ---------------- config ---------------- */
  const visibleRows = computed(() => props.visibleRows ?? 6);
  const gapPx = computed(() => props.rowGapPx ?? 16);
  const bufferPx = computed(() => props.bufferPx ?? 10);
  const intervalMs = computed(() => props.interval ?? 2000);

  /* ---------------- refs ---------------- */
  const containerRef = ref<HTMLElement | null>(null);
  const trackRef = ref<HTMLElement | null>(null);

  /** v-for row refs */
  const rowEls = ref<HTMLElement[]>([]);
  const setRowRef = (el: HTMLElement | null) => {
    if (el) rowEls.value.push(el);
  };

  /* ---------------- state ---------------- */
  const baseList = computed(() => props.items ?? []);
  const canScroll = computed(() => baseList.value.length > visibleRows.value);

  const virtualIndex = ref(0); // 0..len (len 在 clone 區第一筆)
  const transitionEnabled = ref(true);

  const timer = ref<number | null>(null);
  const isHolding = ref(false);

  /** 每一列的 offsetTop（相對 track，且不受 transform 影響） */
  const offsets = ref<number[]>([]);
  const heights = ref<number[]>([]);

  /** viewport 內容高度（不含 buffer padding） */
  const contentViewportHeight = ref(0);

  /* ---------------- render list (clone) ---------------- */
  const renderList = computed<LoopItem[]>(() => {
    const base = baseList.value;
    if (!base.length) return [];

    if (!canScroll.value) {
      return base.map((it, idx) => ({
        ...it,
        __loopKey: `${String(it.id)}-${idx}`,
      }));
    }

    const clones = base.slice(0, Math.min(visibleRows.value, base.length));
    const merged = [...base, ...clones];

    return merged.map((it, idx) => ({
      ...it,
      __loopKey: `${String(it.id)}-${idx}`,
    }));
  });

  /* ---------------- layout calc ----------------
       核心：不要用固定 rowStep，而是用 DOM 的 offsetTop
    -------------------------------------------- */
  let rafLock = 0;

  const recalcLayout = async (disableTransition = true) => {
    if (rafLock) return;
    rafLock = requestAnimationFrame(async () => {
      rafLock = 0;

      if (!trackRef.value) return;

      // 重新收集 row refs（因為 setRowRef 會累加）
      // 這裡用 querySelectorAll 確保與 DOM 同步
      const nodes = Array.from(trackRef.value.children).filter(
        (n): n is HTMLElement => n instanceof HTMLElement,
      );
      if (!nodes.length) return;

      // 動態 gap：直接用 style gap，offsetTop 會包含 gap
      trackRef.value.style.gap = `${gapPx.value}px`;

      if (disableTransition) transitionEnabled.value = false;

      offsets.value = nodes.map((el) => el.offsetTop);
      heights.value = nodes.map((el) => Math.round(el.getBoundingClientRect().height));

      // viewport 內容高度 = 前 visibleRows 筆的 bottom（最後一筆 top + height）
      const v = Math.min(visibleRows.value, nodes.length);
      const last = Math.max(v - 1, 0);
      const bottom = (offsets.value[last] ?? 0) + (heights.value[last] ?? 0);

      // 保底，避免 0
      contentViewportHeight.value = Math.max(1, Math.round(bottom));

      // 立刻校正 virtualIndex 不超界
      const len = baseList.value.length;
      if (len) {
        // 允許到 len（clone 第一筆）
        virtualIndex.value = Math.min(
          Math.max(virtualIndex.value, 0),
          canScroll.value ? len : len - 1,
        );
      } else {
        virtualIndex.value = 0;
      }

      // 下一幀再開回 transition
      if (disableTransition) {
        requestAnimationFrame(() => {
          transitionEnabled.value = true;
        });
      }
    });
  };

  /* ---------------- styles ---------------- */
  const viewportStyle = computed(() => {
    const h = contentViewportHeight.value;
    if (!h) return {};

    return {
      height: `${h + bufferPx.value * 2}px`,
      paddingTop: `${bufferPx.value}px`,
      paddingBottom: `${bufferPx.value}px`,
    } as Record<string, string>;
  });

  const trackStyle = computed(() => {
    const y = offsets.value[virtualIndex.value] ?? 0;
    return {
      transform: `translate3d(0, -${Math.round(y)}px, 0)`,
      gap: `${gapPx.value}px`, // 確保 gap 也被設定（避免初次還沒 recalc）
    } as Record<string, string>;
  });

  /* ---------------- auto scroll ---------------- */
  const stopAutoScroll = () => {
    if (timer.value) {
      window.clearInterval(timer.value);
      timer.value = null;
    }
  };

  const startAutoScroll = () => {
    stopAutoScroll();
    timer.value = window.setInterval(() => {
      if (isHolding.value) return;
      if (!canScroll.value) return;

      const len = baseList.value.length;
      if (!len) return;

      transitionEnabled.value = true;
      virtualIndex.value += 1; // 走到 len 會進 clone 區第一筆
    }, intervalMs.value);
  };

  /* ---------------- seamless loop ---------------- */
  const onTrackTransitionEnd = (e: TransitionEvent) => {
    if (e.propertyName !== 'transform') return;

    const len = baseList.value.length;
    if (!canScroll.value || !len) return;

    // 到 clone 第一筆（index = len）後，瞬跳回 0
    if (virtualIndex.value >= len) {
      transitionEnabled.value = false;
      virtualIndex.value = 0;

      requestAnimationFrame(() => {
        transitionEnabled.value = true;
      });
    }
  };

  /* ---------------- pointer drag / hold ---------------- */
  let pointerId: number | null = null;
  let startY = 0;
  let lastDelta = 0;

  const currentThreshold = () => {
    const len = baseList.value.length;
    if (!len) return 20;

    // 用「當前列高度的一半」當 threshold（動態高度才準）
    const normalized = ((virtualIndex.value % len) + len) % len;
    const h = heights.value[normalized] ?? 80;
    return Math.max(12, Math.round(h / 2));
  };

  const onPointerDown = (e: PointerEvent) => {
    if (!canScroll.value) return;

    pointerId = e.pointerId;
    containerRef.value?.setPointerCapture(pointerId);

    isHolding.value = true;
    stopAutoScroll();

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
        // 往下拖 → 上一筆（不做反向無縫，避免從 0 跳到最後造成長距離動畫）
        virtualIndex.value = Math.max(base - 1, 0);
      } else {
        // 往上拖 → 下一筆（允許到 len 進 clone 區）
        virtualIndex.value = Math.min(base + 1, len);
      }
    }

    pointerId = null;
    lastDelta = 0;
    isHolding.value = false;

    startAutoScroll();
  };

  /* ---------------- observers (動態高度保證不裁切) ---------------- */
  let ro: ResizeObserver | null = null;

  const setupResizeObserver = () => {
    if (!trackRef.value) return;

    ro?.disconnect();
    ro = new ResizeObserver(() => {
      // 任意列高度改變（字體載入、內容換行、視窗縮放）→ 重新計算 offsets
      recalcLayout(true);
    });
    ro.observe(trackRef.value);
  };

  /* ---------------- lifecycle ---------------- */
  onMounted(async () => {
    await nextTick();
    await recalcLayout(false);
    setupResizeObserver();
    startAutoScroll();

    window.addEventListener('resize', () => recalcLayout(true));
  });

  onUnmounted(() => {
    stopAutoScroll();
    ro?.disconnect();
    ro = null;
  });

  /* 當 items/visibleRows/gap 變更，重算布局 */
  watch(
    () => [props.items, props.visibleRows, props.rowGapPx, props.bufferPx],
    async () => {
      virtualIndex.value = 0;
      await nextTick();
      await recalcLayout(true);
      startAutoScroll();
    },
    { deep: true },
  );
</script>
