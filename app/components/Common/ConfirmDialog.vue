<template>
  <UModal :title="title || $t('common.confirmAction')" :ui="{ title: 'text-[18px]' }">
    <template #body>
      <div class="text-[14px] text-white/70">{{ description || $t('common.confirmActionDesc') }}</div>
    </template>
    <template #footer="{ close }">
      <div class="flex justify-end gap-2 w-full">
        <UButton variant="soft" color="neutral" class="cursor-pointer" @click="close">
          {{ cancelLabel || $t('common.cancel') }}
        </UButton>
        <UButton :color="confirmColor" class="cursor-pointer" @click="onConfirm(close)">
          {{ confirmLabel || $t('common.confirm') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
  const {
    title = '',
    description = '',
    confirmLabel = '',
    cancelLabel = '',
    confirmColor = 'error',
    onSuccess = () => {},
  } = defineProps<{
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmColor?: 'error' | 'primary' | 'warning';
    onSuccess?: Function;
  }>();

  const onConfirm = (close: () => void) => {
    onSuccess();
    close();
  };
</script>
