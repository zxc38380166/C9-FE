<template>
  <div class="w-full">
    <div class="flex items-center gap-2.5 mb-4">
      <div
        class="size-8 rounded-[10px] bg-purple-500/15 ring-1 ring-purple-500/25 flex items-center justify-center">
        <Icon name="i-lucide-percent" class="size-4 text-purple-400" />
      </div>
      <div class="text-[18px] font-bold text-white">{{ $t('transaction.dividendRecord') }}</div>
    </div>
    <div class="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-4" />
    <div class="flex flex-col items-center justify-center py-16 space-y-4">
      <div
        class="size-16 rounded-full bg-purple-500/8 ring-1 ring-purple-500/15 flex items-center justify-center">
        <Icon name="i-lucide-construction" class="size-8 text-purple-400/40" />
      </div>
      <div class="text-center">
        <div class="text-[15px] font-medium text-white/50">{{ $t('transaction.featureInDev') }}</div>
        <div class="text-[12px] text-white/30 mt-1">{{ $t('transaction.dividendComingSoon') }}</div>
      </div>
    </div>
  </div>
</template>
