<template>
  <div class="border-[#2f4553] border rounded-lg flex items-center">
    <CommonSelect
      v-model="category"
      width="200px"
      height="50px"
      option-gap="52px"
      select-radius-class="rounded-l-lg"
      option-radius-class="rounded-lg"
      :options="[
        { label: '娛樂城', value: 'casino', icon: 'mdi mdi-cards' },
        { label: '體育', value: 'sport', icon: 'mdi mdi-soccer' },
      ]"
      active-bg-color="#0f212e"
      active-text-color="#ffffff"
      option-bg-color="#152733"
      option-text-color="#ffffff"
      option-hover-class="hover:bg-[#2f4553]"
      arrow-icon="mdi mdi-chevron-down text-[20px] text-white" />
    <CommonInput
      v-model="keyword"
      placeholder="請輸入遊戲"
      width="calc(100% - 200px)"
      height="50px"
      inputRadiusClass="rounded-r-lg"
      arrowIcon="mdi mdi-magnify-expand text-[#556f86] text-[20px]"
      activeBgColor="#0f212e"
      activeTextColor="#ffffff" />
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
