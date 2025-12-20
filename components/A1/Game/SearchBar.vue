<template>
  <div class="border-[#2f4553] border rounded-xl">
    <CommonSelect
      v-model="category"
      width="230px"
      height="45px"
      option-gap="47px"
      select-radius-class="rounded-l-xl"
      option-radius-class="rounded-xl"
      :options="[
        { label: '娛樂城', value: 'casino', icon: 'mdi mdi-cards' },
        { label: '體育', value: 'sport', icon: 'mdi mdi-soccer' },
      ]"
      active-bg-color="#0f212e"
      active-text-color="#ffffff"
      option-bg-color="#152733"
      option-text-color="#ffffff"
      option-hover-class="hover:bg-[#2f4553]"
      arrow-icon="mdi mdi-chevron-down" />
  </div>
</template>
<script setup lang="ts">
  const category = ref<'casino' | 'sport'>('casino');
  const keyword = ref('');
</script>
<style>
  .el-select__wrapper,
  .el-input__wrapper {
    background: #0f2433;
    box-shadow: none !important;
  }
  .el-select__placeholder {
    color: white;
  }
</style>
