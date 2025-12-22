<template>
  <div
    class="relative inline-flex"
    :style="wrapperStyle"
    :class="{ 'opacity-50 pointer-events-none': disabled }">
    <!-- Label -->
    <div v-if="label" class="mb-2 text-sm" :style="labelStyle">
      {{ label }}
    </div>

    <!-- Input Wrapper -->
    <div
      class="relative w-full flex items-center gap-2 px-3"
      :class="inputRadiusClass"
      :style="inputWrapperStyle"
      @click="focusInput">
      <!-- Right Icon（為了與原 Select API 相容） -->
      <div v-if="arrowIcon" class="pointer-events-none">
        <i :class="arrowIcon" />
      </div>
      <!-- Input -->
      <input
        ref="inputRef"
        v-model="innerValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        class="bg-transparent outline-none flex-1 text-sm"
        :style="inputStyle"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
  import type { CSSProperties } from 'vue';

  /* ---------- Props ---------- */

  const props = defineProps<{
    modelValue: string | number;
    type?: string;
    placeholder?: string;
    disabled?: boolean;

    width?: number | string;
    height?: number | string;
    minWidth?: number | string;
    maxWidth?: number | string;

    label?: string;
    labelColor?: string;

    activeBgColor?: string;
    activeTextColor?: string;

    inputRadiusClass?: string;
    arrowIcon?: string;
  }>();

  /* ---------- Emits ---------- */

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
    (e: 'change', value: string | number): void;
    (e: 'focus'): void;
    (e: 'blur'): void;
  }>();

  /* ---------- Refs ---------- */

  const inputRef = ref<HTMLInputElement | null>(null);
  const innerValue = ref<string | number>('');

  /* ---------- Utils ---------- */

  const toCssSize = (v?: number | string) =>
    v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;

  /* ---------- v-model 同步 ---------- */

  watch(
    () => props.modelValue,
    (val) => {
      innerValue.value = val;
    },
    { immediate: true },
  );

  /* ---------- Styles ---------- */

  const wrapperStyle = computed<CSSProperties>(() => ({
    width: toCssSize(props.width) ?? '100%',
    minWidth: toCssSize(props.minWidth),
    maxWidth: toCssSize(props.maxWidth),
  }));

  const labelStyle = computed<CSSProperties>(() => ({
    color: props.labelColor ?? '#ffffff',
  }));

  const inputWrapperStyle = computed<CSSProperties>(() => ({
    height: toCssSize(props.height) ?? '48px',
    backgroundColor: props.activeBgColor ?? '#0f212e',
  }));

  const inputStyle = computed<CSSProperties>(() => ({
    color: props.activeTextColor ?? '#ffffff',
  }));

  /* ---------- Methods ---------- */

  const focusInput = () => {
    if (props.disabled) return;
    inputRef.value?.focus();
  };

  const onInput = () => {
    emit('update:modelValue', innerValue.value);
    emit('change', innerValue.value);
  };

  const onFocus = () => {
    emit('focus');
  };

  const onBlur = () => {
    emit('blur');
  };

  /* ---------- Expose ---------- */

  defineExpose({
    focus: () => inputRef.value?.focus(),
    blur: () => inputRef.value?.blur(),
  });
</script>
