<template>
  <div class="flex justify-between items-center">
    <div class="flex items-center gap-2 font-black">
      <Icon :name="leftIcon" class="text-[24px]" />
      <span class="text-[20px]">{{ leftText }}</span>
    </div>
    <div class="text-[30px] flex items-center gap-2" :class="ui.right">
      <slot name="right">
        <span v-if="rightText" class="text-[16px] font-black">{{ rightText }}</span>
        <Icon :name="rightIcon" />
      </slot>
    </div>
  </div>
</template>
<script setup lang="ts">
  const {
    leftIcon = 'material-symbols:settings-backup-restore',
    leftText = '',
    rightIcon = 'material-symbols:arrow-circle-left',
    rightText = '',
    ui = { right: '' },
  } = defineProps<{
    leftIcon?: string;
    leftText?: string;
    rightIcon?: string;
    rightText?: string;
    ui?: Record<string, string>;
  }>();
</script>
