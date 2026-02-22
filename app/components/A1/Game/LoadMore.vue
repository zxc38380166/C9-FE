<template>
  <div v-if="canShowMore" class="pt-2 flex justify-center">
    <UButton
      :ui="{ base: 'justify-center' }"
      size="xl"
      variant="ghost"
      :class="[
        `
            group cursor-pointer relative overflow-hidden rounded-[10px] bg-slate-900/70 ring-1 ring-white/10 backdrop-blur 
            px-6 h-12.5 min-w-55 text-white/80 hover:text-white hover:bg-white/6 transition-colors duration-200 
            shadow-[0_14px_50px_-26px_rgba(0,0,0,0.65)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00df72]/35
        `,
        disabled ? 'opacity-60 pointer-events-none' : '',
      ]"
      :disabled="disabled"
      @click="handleClick">
      <span
        class="pointer-events-none absolute inset-0 opacity-[0.20] bg-linear-to-r from-transparent via-white/18 to-transparent -translate-x-[60%] group-hover:translate-x-[60%] transition-transform duration-700" />
      <span class="relative inline-flex items-center gap-2">
        <slot name="label">
          <span class="text-[13px] font-semibold tracking-wide">{{ label }}</span>
        </slot>
        <span
          class="inline-flex items-center rounded-full bg-white/4 ring-1 ring-white/10 px-2.5 py-1 text-[13px] text-white/60">
          {{ modelValue }} / {{ total }}
        </span>
        <span class="i-material-symbols:expand-more text-[18px] text-white/70" />
      </span>
    </UButton>
  </div>
</template>
<script setup lang="ts">
  const {
    modelValue,
    total,
    step = 50,
    label = '展示更多',
    disabled = false,
    autoIncrement = true,
  } = defineProps<{
    modelValue: number;
    total: number;
    step?: number;
    label?: string;
    disabled?: boolean;
    autoIncrement?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', v: number): void;
    (e: 'load', payload: LoadMorePayload): void;
  }>();

  const canShowMore = computed(() => total > modelValue);

  const handleClick = () => {
    if (disabled) return;
    const prevCount = modelValue;
    const nextCount = Math.min(total, prevCount + step);
    emit('load', { prevCount, nextCount, total, step });
    if (autoIncrement) emit('update:modelValue', nextCount);
  };
</script>
