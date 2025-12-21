<template>
  <div class="w-full">
    <div class="relative w-full">
      <!-- Scroll Area -->
      <div
        ref="scrollerRef"
        class="scrollable-hidden inline-flex max-w-full items-center overflow-x-auto rounded-full border bg-[var(--seg-bg)] border-[var(--seg-border)]"
        :class="showDesktopArrow ? 'px-10' : ''"
        :style="wrapStyle"
        role="tablist"
        aria-label="Segment Tabs"
        @wheel.passive="onWheel">
        <button
          v-for="item in items"
          :key="String(item.value)"
          type="button"
          role="tab"
          :aria-selected="isActive(item)"
          :disabled="item.disabled"
          @click="onSelect(item)"
          class="inline-flex shrink-0 items-center justify-center rounded-full border border-transparent transition-all duration-200 ease-out select-none px-[var(--seg-item-px)] py-[var(--seg-item-py)] text-[length:var(--seg-font-size)] font-semibold gap-[var(--seg-icon-gap)] disabled:cursor-not-allowed disabled:opacity-35 disabled:grayscale-[0.4]"
          :class="[
            isActive(item)
              ? 'bg-[var(--seg-active-bg)] text-[var(--seg-active-text)] border-[var(--seg-active-border)] shadow-[0_6px_18px_rgba(0,0,0,0.25)]'
              : 'bg-transparent text-[var(--seg-text)] hover:bg-[var(--seg-hover-bg)] hover:text-[var(--seg-hover-text)]',
          ]">
          <!-- Icon -->
          <span v-if="$slots.icon" class="inline-flex">
            <slot name="icon" :item="item" :active="isActive(item)" />
          </span>
          <i
            v-else-if="item.icon"
            :class="item.icon"
            class="text-[length:var(--seg-icon-size)] leading-none"
            aria-hidden="true" />

          <!-- Label -->
          <span class="whitespace-nowrap leading-none">
            <slot name="label" :item="item" :active="isActive(item)">
              {{ item.label }}
            </slot>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

  type TabValue = string | number;

  export interface PillTabItem {
    label: string;
    value: TabValue;
    icon?: string;
    disabled?: boolean;
  }

  const props = withDefaults(
    defineProps<{
      modelValue: TabValue;
      items: PillTabItem[];

      /** 整體容器 */
      bg?: string;
      border?: string;
      padding?: string;
      gap?: string;

      /** 一般狀態文字 */
      text?: string;

      /** hover */
      hoverBg?: string;
      hoverText?: string;

      /** active 狀態 */
      activeBg?: string;
      activeText?: string;
      activeBorder?: string;

      /** item 尺寸 */
      itemPx?: string;
      itemPy?: string;
      fontSize?: string;
      iconSize?: string;
      iconGap?: string;

      /** 桌機左右箭頭 */
      showDesktopArrow?: boolean;

      /** 每次點箭頭捲動距離（px），不傳就自動抓容器寬 0.7 倍 */
      scrollStep?: number;

      /** 點選後是否自動把 active 捲到可視範圍 */
      autoScrollToActive?: boolean;
    }>(),
    {
      bg: '#0f2633',
      border: 'rgba(255,255,255,0.12)',
      padding: '6px',
      gap: '6px',

      text: 'rgba(255,255,255,0.86)',

      hoverBg: 'rgba(255,255,255,0.06)',
      hoverText: 'rgba(255,255,255,0.92)',

      activeBg: '#5b6a74',
      activeText: '#ffffff',
      activeBorder: 'rgba(255,255,255,0.0)',

      itemPx: '14px',
      itemPy: '10px',
      fontSize: '14px',
      iconSize: '18px',
      iconGap: '8px',

      showDesktopArrow: true,
      autoScrollToActive: true,
    },
  );

  const emit = defineEmits<{
    (e: 'update:modelValue', v: TabValue): void;
    (e: 'change', v: TabValue, item: PillTabItem): void;
  }>();

  const scrollerRef = ref<HTMLElement | null>(null);

  const wrapStyle = computed(
    () =>
      ({
        '--seg-bg': props.bg,
        '--seg-border': props.border,

        '--seg-text': props.text,
        '--seg-hover-bg': props.hoverBg,
        '--seg-hover-text': props.hoverText,

        '--seg-active-bg': props.activeBg,
        '--seg-active-text': props.activeText,
        '--seg-active-border': props.activeBorder,

        '--seg-item-px': props.itemPx,
        '--seg-item-py': props.itemPy,
        '--seg-font-size': props.fontSize,
        '--seg-icon-size': props.iconSize,
        '--seg-icon-gap': props.iconGap,

        padding: props.padding,
        gap: props.gap,
      }) as Record<string, string>,
  );

  const isActive = (item: PillTabItem) => item.value === props.modelValue;

  const onSelect = async (item: PillTabItem) => {
    if (item.disabled) return;
    emit('update:modelValue', item.value);
    emit('change', item.value, item);

    if (props.autoScrollToActive) {
      await nextTick();
      scrollActiveIntoView();
    }
  };

  /** 滾輪：把垂直滾動轉成水平 */
  const onWheel = (e: WheelEvent) => {
    const el = scrollerRef.value;
    if (!el) return;

    // trackpad 會同時有 deltaX / deltaY；以最大的那個為主
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

    // 如果沒有可水平捲動就不要動
    if (el.scrollWidth <= el.clientWidth) return;

    el.scrollLeft += delta;
    updateScrollState();
  };

  const canScrollLeft = ref(false);
  const canScrollRight = ref(false);

  const updateScrollState = () => {
    const el = scrollerRef.value;
    if (!el) return;

    const maxLeft = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft;

    canScrollLeft.value = left > 2;
    canScrollRight.value = left < maxLeft - 2;
  };

  const scrollActiveIntoView = () => {
    const el = scrollerRef.value;
    if (!el) return;

    const activeBtn = el.querySelector<HTMLButtonElement>('[aria-selected="true"]');
    if (!activeBtn) return;

    // 讓 active 盡量置中
    const elRect = el.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    const offset = btnRect.left - elRect.left - (elRect.width / 2 - btnRect.width / 2);

    el.scrollTo({ left: el.scrollLeft + offset, behavior: 'smooth' });
    setTimeout(updateScrollState, 220);
  };

  const onScroll = () => updateScrollState();

  onMounted(() => {
    const el = scrollerRef.value;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateScrollState);

    if (props.autoScrollToActive) {
      nextTick(scrollActiveIntoView);
    }
  });

  onUnmounted(() => {
    const el = scrollerRef.value;
    if (el) el.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', updateScrollState);
  });

  watch(
    () => [props.items, props.modelValue],
    async () => {
      await nextTick();
      updateScrollState();
      if (props.autoScrollToActive) scrollActiveIntoView();
    },
    { deep: true },
  );
</script>
