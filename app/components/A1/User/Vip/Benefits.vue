<template>
  <div class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-8 space-y-4">
    <div class="flex items-center gap-2">
      <Icon name="noto:star" class="text-[20px] sm:text-[24px]" />
      <span class="text-[16px] sm:text-[20px] font-bold text-white">{{ $t('vip.benefits') }}</span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <div
        v-for="(benefit, idx) in benefits"
        :key="idx"
        class="rounded-xl bg-white/3 ring-1 ring-white/6 p-4 sm:p-5 space-y-2.5">
        <div class="flex items-center gap-2.5">
          <div
            class="size-8 sm:size-9 rounded-lg flex items-center justify-center"
            :class="benefit.bgClass">
            <Icon :name="benefit.icon" class="size-4 sm:size-4.5" :class="benefit.iconClass" />
          </div>
          <span class="text-[14px] sm:text-[15px] font-bold text-white">{{ benefit.title }}</span>
        </div>
        <p class="text-[12px] sm:text-[13px] text-white/50 leading-relaxed">
          {{ benefit.desc }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { t } = useI18n();

  const benefits = computed(() => [
    {
      icon: 'i-lucide-percent',
      title: t('vip.benefit.rebate.title'),
      desc: t('vip.benefit.rebate.desc'),
      bgClass: 'bg-emerald-500/15',
      iconClass: 'text-emerald-400',
    },
    {
      icon: 'i-lucide-headset',
      title: t('vip.benefit.cs.title'),
      desc: t('vip.benefit.cs.desc'),
      bgClass: 'bg-blue-500/15',
      iconClass: 'text-blue-400',
    },
    {
      icon: 'i-lucide-arrow-up-circle',
      title: t('vip.benefit.upgrade.title'),
      desc: t('vip.benefit.upgrade.desc'),
      bgClass: 'bg-amber-500/15',
      iconClass: 'text-amber-400',
    },
    {
      icon: 'i-lucide-cake',
      title: t('vip.benefit.birthday.title'),
      desc: t('vip.benefit.birthday.desc'),
      bgClass: 'bg-rose-500/15',
      iconClass: 'text-rose-400',
    },
    {
      icon: 'i-lucide-zap',
      title: t('vip.benefit.withdraw.title'),
      desc: t('vip.benefit.withdraw.desc'),
      bgClass: 'bg-purple-500/15',
      iconClass: 'text-purple-400',
    },
    {
      icon: 'i-lucide-ticket',
      title: t('vip.benefit.event.title'),
      desc: t('vip.benefit.event.desc'),
      bgClass: 'bg-pink-500/15',
      iconClass: 'text-pink-400',
    },
  ]);
</script>
