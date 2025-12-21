<template>
  <div class="w-full space-y-[var(--dd-gap)]" :style="wrapStyle">
    <div
      v-for="item in items"
      :key="String(item.value)"
      class="overflow-hidden rounded-xl border bg-[var(--dd-item-bg)] border-[var(--dd-item-border)] shadow-[var(--dd-item-shadow)]">
      <!-- Header -->
      <button
        type="button"
        class="flex w-full items-center justify-between px-[var(--dd-header-px)] h-[55px] py-[var(--dd-header-py)] text-left transition-colors duration-200 hover:bg-[var(--dd-header-hover-bg)]"
        :class="item.disabled ? 'cursor-not-allowed opacity-40 grayscale-[0.4]' : 'cursor-pointer'"
        :disabled="item.disabled"
        @click="toggle(item)">
        <!-- Left -->
        <div class="flex items-center gap-[var(--dd-icon-gap)]">
          <slot name="left" :item="item" :active="isOpen(item)">
            <i
              v-if="item.icon"
              :class="item.icon"
              class="text-[length:var(--dd-left-icon-size)] text-[var(--dd-left-icon-color)]"
              aria-hidden="true" />
          </slot>

          <span
            class="text-[length:var(--dd-title-size)] font-semibold text-[var(--dd-title-color)]">
            <slot name="title" :item="item" :active="isOpen(item)">
              {{ item.title }}
            </slot>
          </span>
        </div>

        <!-- Right Chevron -->
        <i
          :class="chevronIcon"
          class="text-[length:var(--dd-chevron-size)] text-[var(--dd-chevron-color)] transition-transform duration-200"
          :style="isOpen(item) ? 'transform: rotate(180deg);' : ''"
          aria-hidden="true" />
      </button>

      <!-- Content (Smooth) -->
      <Transition name="dd">
        <div v-if="isOpen(item)">
          <!-- Divider -->
          <div class="h-px bg-[var(--dd-divider-color)]"></div>

          <!-- Body -->
          <div
            class="px-[var(--dd-body-px)] py-[var(--dd-body-py)] text-[length:var(--dd-body-size)] leading-relaxed"
            style="word-break: break-word">
            <div class="text-[var(--dd-body-color)]">
              <slot name="content" :item="item">
                {{ item.content }}
              </slot>
            </div>

            <div v-if="$slots.footer" class="mt-3">
              <slot name="footer" :item="item" />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
  type ItemValue = string | number;

  export interface DropdownItem {
    value: ItemValue;
    title: string;
    content?: string;
    icon?: string;
    disabled?: boolean;
  }

  const props = withDefaults(
    defineProps<{
      modelValue?: ItemValue | ItemValue[];
      items: DropdownItem[];

      accordion?: boolean;
      defaultOpenFirst?: boolean;

      chevronIcon?: string;

      gap?: string;
      headerPx?: string;
      headerPy?: string;
      bodyPx?: string;
      bodyPy?: string;

      titleSize?: string;
      bodySize?: string;
      leftIconSize?: string;
      chevronSize?: string;
      iconGap?: string;

      itemBg?: string;
      itemBorder?: string;
      itemShadow?: string;
      headerHoverBg?: string;

      titleColor?: string;
      bodyColor?: string;
      dividerColor?: string;
      leftIconColor?: string;
      chevronColor?: string;

      /** ✅ 動畫參數（絲滑感調整） */
      expandMaxHeight?: string; // 例如 '360px'（內容很長可拉大）
      expandDurationMs?: number; // 例如 260
    }>(),
    {
      accordion: true,
      defaultOpenFirst: true,

      chevronIcon: 'mdi mdi-chevron-down',

      gap: '12px',
      headerPx: '18px',
      headerPy: '16px',
      bodyPx: '18px',
      bodyPy: '16px',

      titleSize: '16px',
      bodySize: '14px',
      leftIconSize: '18px',
      chevronSize: '18px',
      iconGap: '10px',

      itemBg: '#233B47',
      itemBorder: '#FFFFFF14',
      itemShadow: '0 10px 20px #00000026',

      headerHoverBg: '#FFFFFF08',

      titleColor: '#FFFFFF',
      bodyColor: '#FFFFFFB3',
      dividerColor: '#FFFFFF14',

      leftIconColor: '#FFFFFFCC',
      chevronColor: '#FFFFFFCC',

      expandMaxHeight: '420px',
      expandDurationMs: 260,
    },
  );

  const emit = defineEmits<{
    (e: 'update:modelValue', v: ItemValue | ItemValue[]): void;
    (e: 'change', openValues: ItemValue | ItemValue[], item: DropdownItem): void;
  }>();

  const openValues = ref<ItemValue[]>([]);

  const normalizeModel = (v: typeof props.modelValue) => {
    if (v === undefined) return null;
    return Array.isArray(v) ? v : [v];
  };

  watch(
    () => props.modelValue,
    (v) => {
      const normalized = normalizeModel(v);
      if (normalized) openValues.value = [...normalized];
    },
    { immediate: true },
  );

  watch(
    () => props.items,
    (list) => {
      if (props.modelValue !== undefined) return;
      if (!props.defaultOpenFirst) return;
      if (openValues.value.length) return;
      if (list?.length && list[0]) openValues.value = [list[0].value];
    },
    { immediate: true },
  );

  const isOpen = (item: DropdownItem) => openValues.value.includes(item.value);

  const toggle = (item: DropdownItem) => {
    if (item.disabled) return;

    const exists = isOpen(item);
    let next: ItemValue[] = [];

    if (props.accordion) {
      next = exists ? [] : [item.value];
    } else {
      next = exists
        ? openValues.value.filter((v) => v !== item.value)
        : [...openValues.value, item.value];
    }

    openValues.value = next;

    emit('update:modelValue', props.accordion ? (next[0] ?? ('' as any)) : next);
    emit('change', props.accordion ? (next[0] ?? ('' as any)) : next, item);
  };

  const wrapStyle = computed(
    () =>
      ({
        '--dd-gap': props.gap,

        '--dd-header-px': props.headerPx,
        '--dd-header-py': props.headerPy,
        '--dd-body-px': props.bodyPx,
        '--dd-body-py': props.bodyPy,

        '--dd-title-size': props.titleSize,
        '--dd-body-size': props.bodySize,
        '--dd-left-icon-size': props.leftIconSize,
        '--dd-chevron-size': props.chevronSize,
        '--dd-icon-gap': props.iconGap,

        '--dd-item-bg': props.itemBg,
        '--dd-item-border': props.itemBorder,
        '--dd-item-shadow': props.itemShadow,

        '--dd-header-hover-bg': props.headerHoverBg,

        '--dd-title-color': props.titleColor,
        '--dd-body-color': props.bodyColor,

        '--dd-divider-color': props.dividerColor,

        '--dd-left-icon-color': props.leftIconColor,
        '--dd-chevron-color': props.chevronColor,

        /** 動畫用 */
        '--dd-expand-max-h': props.expandMaxHeight,
        '--dd-expand-dur': `${props.expandDurationMs}ms`,
      }) as Record<string, string>,
  );
</script>
<style scoped>
  /* ✅ 只保留 Transition 必要 CSS（無法純 Tailwind） */
  .dd-enter-active,
  .dd-leave-active {
    overflow: hidden;
    transition:
      max-height var(--dd-expand-dur) cubic-bezier(0.2, 0.8, 0.2, 1),
      opacity calc(var(--dd-expand-dur) - 40ms) ease,
      transform calc(var(--dd-expand-dur) - 40ms) ease;
  }

  .dd-enter-from,
  .dd-leave-to {
    max-height: 0;
    opacity: 0;
    transform: translateY(-4px);
  }

  .dd-enter-to,
  .dd-leave-from {
    max-height: var(--dd-expand-max-h);
    opacity: 1;
    transform: translateY(0);
  }
</style>
