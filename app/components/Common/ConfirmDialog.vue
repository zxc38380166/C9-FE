<template>
  <UModal :title :ui="{ title: 'text-[18px]' }">
    <template #body>
      <div class="text-[14px] text-white/70">{{ description }}</div>
    </template>
    <template #footer="{ close }">
      <div class="flex justify-end gap-2 w-full">
        <UButton variant="soft" color="neutral" class="cursor-pointer" @click="close">
          {{ cancelLabel }}
        </UButton>
        <UButton :color="confirmColor" class="cursor-pointer" @click="onConfirm(close)">
          {{ confirmLabel }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
  const {
    title = '確認操作',
    description = '確定要執行此操作嗎？',
    confirmLabel = '確認',
    cancelLabel = '取消',
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
