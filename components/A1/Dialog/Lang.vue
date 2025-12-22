<template>
  <el-dialog
    v-model="visibleProxy"
    :show-close="false"
    :close-on-click-modal="closeOnMask"
    :close-on-press-escape="closeOnEsc"
    :lock-scroll="lockScroll"
    :width="width"
    :append-to-body="appendToBody"
    class="lang-dialog"
    :style="dialogInlineStyle"
    :header-class="headerClass"
    :body-class="bodyClass"
    :footer-class="footerClass">
    <!-- Header -->
    <template #header>
      <div class="flex items-center justify-between">
        <div class="text-white font-semibold text-base">
          {{ title }}
        </div>

        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full border"
          :style="closeBtnStyle"
          @click="onClose">
          <i class="mdi mdi-close text-xl" />
        </button>
      </div>
    </template>

    <!-- Content -->
    <div class="space-y-3" :style="{ color: textColor }">
      <button
        v-for="item in langs"
        :key="String(item.value)"
        type="button"
        class="w-full rounded-xl border px-4 py-3 flex items-center justify-between text-left transition-all duration-200"
        :style="getRowStyle(isSelected(item.value), hoverValue === item.value)"
        @click="select(item.value)"
        @mouseenter="hoverValue = item.value"
        @mouseleave="hoverValue = null">
        <!-- Left -->
        <div class="flex items-center gap-3">
          <img
            v-if="item.icon"
            :src="item.icon"
            class="h-6 w-6 rounded-full object-cover"
            :alt="item.label" />
          <span class="text-base font-semibold">
            {{ item.label }}
          </span>
        </div>

        <!-- Right Radio -->
        <span
          class="relative inline-flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-200"
          :style="getRadioStyle(isSelected(item.value))">
          <span
            v-if="isSelected(item.value)"
            class="h-2.5 w-2.5 rounded-full"
            :style="{ background: activeDot }" />
        </span>
      </button>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="flex justify-end gap-2">
        <el-button
          v-if="showCancel"
          @click="onClose"
          class="!border-0"
          :style="{ background: cancelBg, color: cancelText }">
          {{ cancelTextLabel }}
        </el-button>

        <el-button
          type="success"
          @click="onConfirm"
          class="!border-0"
          :style="{ background: confirmBg, color: confirmText }">
          {{ confirmTextLabel }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  type LangValue = string | number;

  interface LanguageItem {
    label: string;
    value: LangValue;
    icon?: string;
  }

  const props = withDefaults(
    defineProps<{
      modelValue: boolean;
      selected: LangValue;

      title?: string;
      langs: LanguageItem[];

      width?: string | number;

      closeOnMask?: boolean;
      closeOnEsc?: boolean;
      lockScroll?: boolean;
      appendToBody?: boolean;

      /** 顏色（HEX / #RRGGBBAA） */
      dialogBg?: string;
      dialogBorder?: string;
      dialogShadow?: string;
      dialogRadius?: string; // '16px'

      rowBg?: string;
      rowBorder?: string;
      rowHoverBg?: string;

      activeRowBg?: string;
      activeRowBorder?: string;

      textColor?: string;

      radioBorder?: string;
      activeRadioBorder?: string;
      activeDot?: string;

      closeBg?: string;
      closeBorder?: string;
      closeIcon?: string;

      /** Footer */
      showCancel?: boolean;
      cancelTextLabel?: string;
      confirmTextLabel?: string;
      cancelBg?: string;
      cancelText?: string;
      confirmBg?: string;
      confirmText?: string;
    }>(),
    {
      title: '选择语言',
      width: 350,

      closeOnMask: true,
      closeOnEsc: true,
      lockScroll: true,
      appendToBody: true,

      dialogBg: '#2C2C2CE6',
      dialogBorder: '#FFFFFF14',
      dialogShadow: '0 18px 40px #00000066',
      dialogRadius: '16px',

      rowBg: '#0000001F',
      rowBorder: '#FFFFFF14',
      rowHoverBg: '#FFFFFF0A',

      activeRowBg: '#00000026',
      activeRowBorder: '#00E5FFB3',

      textColor: '#FFFFFF',

      radioBorder: '#FFFFFF4D',
      activeRadioBorder: '#00E5FF',
      activeDot: '#00E5FF',

      closeBg: '#00000026',
      closeBorder: '#FFFFFF1A',
      closeIcon: '#FFFFFF',

      showCancel: false,
      cancelTextLabel: '取消',
      confirmTextLabel: '确认',
      cancelBg: '#FFFFFF14',
      cancelText: '#FFFFFF',
      confirmBg: '#5fae8e',
      confirmText: '#001018',
    },
  );

  const emit = defineEmits<{
    (e: 'update:modelValue', v: boolean): void;
    (e: 'update:selected', v: LangValue): void;
    (e: 'confirm', v: LangValue): void;
    (e: 'close'): void;
  }>();

  const visibleProxy = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v),
  });

  const hoverValue = ref<LangValue | null>(null);

  const headerClass = 'px-4 py-3 !mr-0';
  const bodyClass = 'px-4 py-3';
  const footerClass = 'px-4 py-4';

  const dialogInlineStyle = computed(() => ({
    background: props.dialogBg,
    border: `1px solid ${props.dialogBorder}`,
    borderRadius: props.dialogRadius,
    boxShadow: props.dialogShadow,
    overflow: 'hidden',
  }));

  const closeBtnStyle = computed(() => ({
    background: props.closeBg,
    borderColor: props.closeBorder,
    color: props.closeIcon,
  }));

  const isSelected = (v: LangValue) => v === props.selected;

  const select = (v: LangValue) => {
    emit('update:selected', v);
  };

  const onClose = () => {
    emit('update:modelValue', false);
    emit('close');
  };

  const onConfirm = () => {
    emit('confirm', props.selected);
    emit('update:modelValue', false);
  };

  const getRowStyle = (active: boolean, hover: boolean) => {
    const bg = active ? props.activeRowBg : hover ? props.rowHoverBg : props.rowBg;
    const borderColor = active ? props.activeRowBorder : props.rowBorder;

    return {
      background: bg,
      borderColor,
      color: props.textColor,
    } as Record<string, string>;
  };

  const getRadioStyle = (active: boolean) => {
    return {
      borderColor: active ? props.activeRadioBorder : props.radioBorder,
    } as Record<string, string>;
  };
</script>
