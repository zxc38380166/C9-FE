<template>
  <div
    ref="rootRef"
    class="relative inline-flex"
    :style="wrapperStyle"
    :class="{ 'opacity-50 pointer-events-none': disabled }">
    <!-- Label -->
    <div v-if="label" class="mb-2 text-sm" :style="labelStyle">
      {{ label }}
    </div>

    <!-- Select 顯示區 -->
    <div
      class="relative w-full px-3 cursor-pointer select-none flex items-center gap-2"
      :class="selectRadiusClass"
      :style="selectStyle"
      @click="toggle">
      <!-- 單選 icon -->
      <i
        v-if="!multiple && selectedOption?.icon"
        :class="selectedOption.icon"
        class="text-[16px] shrink-0" />

      <!-- 多選 icon（顯示第一個） -->
      <i
        v-if="multiple && selectedOptions[0]?.icon"
        :class="selectedOptions[0].icon"
        class="text-[16px] shrink-0" />

      <span class="truncate">
        {{ displayLabel }}
      </span>

      <!-- 右側箭頭 -->
      <div v-if="arrowIcon" class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        <i :class="arrowIcon" />
      </div>
    </div>

    <!-- Options -->
    <div
      v-if="open"
      class="absolute left-0 right-0 z-50 overflow-hidden"
      :class="optionRadiusClass"
      :style="optionWrapperStyle">
      <div
        v-for="opt in options"
        :key="opt.value"
        class="px-3 py-2 cursor-pointer flex items-center gap-2"
        :class="[optionHoverClass, isSelected(opt.value) && 'bg-white/10']"
        :style="optionItemStyle"
        @click.stop="onOptionClick(opt.value)">
        <!-- 勾選 icon（多選） -->
        <i
          v-if="multiple"
          class="text-[14px]"
          :class="
            isSelected(opt.value) ? 'mdi mdi-checkbox-marked' : 'mdi mdi-checkbox-blank-outline'
          " />

        <!-- option icon -->
        <i v-if="opt.icon" :class="opt.icon" class="text-[16px] shrink-0" />

        <span>{{ opt.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import type { CSSProperties } from 'vue';

  /* ---------- 型別 ---------- */

  interface OptionItem {
    label: string;
    value: string | number;
    icon?: string;
  }

  /* ---------- Props ---------- */

  const props = defineProps<{
    modelValue: string | number | Array<string | number>;
    options: OptionItem[];

    multiple?: boolean;
    disabled?: boolean;

    width?: number | string;
    height?: number | string;
    minWidth?: number | string;
    maxWidth?: number | string;
    minHeight?: number | string;
    maxHeight?: number | string;
    optionGap?: number | string;

    selectRadiusClass?: string;
    optionRadiusClass?: string;

    label?: string;
    labelColor?: string;

    activeBgColor?: string;
    activeTextColor?: string;
    optionBgColor?: string;
    optionTextColor?: string;

    optionHoverClass?: string;
    arrowIcon?: string;
  }>();

  /* ---------- Emits ---------- */

  const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void;
    (e: 'change', value: any): void;
    (e: 'focus'): void;
    (e: 'blur'): void;
  }>();

  /* ---------- State ---------- */

  const rootRef = ref<HTMLElement | null>(null);
  const open = ref(false);

  /* ---------- Utils ---------- */

  const toCssSize = (val?: number | string) =>
    val === undefined ? undefined : typeof val === 'number' ? `${val}px` : val;

  /* ---------- Computed ---------- */

  const selectedOption = computed(() => props.options.find((o) => o.value === props.modelValue));

  const selectedOptions = computed(() => {
    if (!props.multiple) return [];
    const values = Array.isArray(props.modelValue) ? props.modelValue : [];
    return props.options.filter((o) => values.includes(o.value));
  });

  const displayLabel = computed(() => {
    if (props.multiple) {
      return selectedOptions.value.map((o) => o.label).join(', ') || '請選擇';
    }
    return selectedOption.value?.label ?? '請選擇';
  });

  const wrapperStyle = computed<CSSProperties>(() => ({
    width: toCssSize(props.width) ?? '100%',
    minWidth: toCssSize(props.minWidth),
    maxWidth: toCssSize(props.maxWidth),
  }));

  const labelStyle = computed<CSSProperties>(() => ({
    color: props.labelColor ?? '#ffffff',
  }));

  const selectStyle = computed<CSSProperties>(() => ({
    height: toCssSize(props.height) ?? '48px',
    lineHeight: toCssSize(props.height) ?? '48px',
    backgroundColor: props.activeBgColor ?? '#0f212e',
    color: props.activeTextColor ?? '#ffffff',
  }));

  const optionWrapperStyle = computed<CSSProperties>(() => ({
    backgroundColor: props.optionBgColor ?? '#152733',
    marginTop: toCssSize(props.optionGap) ?? '10px',
    maxHeight: toCssSize(props.maxHeight),
    overflowY: props.maxHeight ? 'auto' : undefined,
  }));

  const optionItemStyle = computed<CSSProperties>(() => ({
    color: props.optionTextColor ?? '#ffffff',
  }));

  /* ---------- Methods ---------- */

  const toggle = () => {
    if (props.disabled) return;
    open.value = !open.value;
    open.value ? emit('focus') : emit('blur');
  };

  const isSelected = (value: string | number) => {
    if (!props.multiple) return props.modelValue === value;
    return Array.isArray(props.modelValue) && props.modelValue.includes(value);
  };

  const onOptionClick = (value: string | number) => {
    if (!props.multiple) {
      emit('update:modelValue', value);
      emit('change', value);
      open.value = false;
      emit('blur');
      return;
    }

    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : [];

    const index = current.indexOf(value);
    index > -1 ? current.splice(index, 1) : current.push(value);

    emit('update:modelValue', current);
    emit('change', current);
  };

  /* ---------- Click Outside ---------- */

  const onClickOutside = (e: MouseEvent) => {
    if (!rootRef.value?.contains(e.target as Node)) {
      open.value = false;
      emit('blur');
    }
  };

  onMounted(() => {
    document.addEventListener('click', onClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', onClickOutside);
  });

  /* ---------- Expose ---------- */

  defineExpose({
    open: () => (open.value = true),
    close: () => (open.value = false),
  });
</script>
