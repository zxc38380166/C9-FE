<template>
  <div>
    <UFooterColumns
      :columns="columns"
      :ui="{ root: 'bg-slate-900 p-14 ring-1 ring-white/10 xl:grid-cols-2' }">
    </UFooterColumns>
    <UPageLogos
      :ui="{
        root: 'bg-slate-900 pb-16 grid place-items-center',
        logos: 'max-w-[350px] lg:max-w-[500px] gap-5',
        title:
          'max-w-[350px] lg:max-w-[500px] whitespace-pre-line text-center text-[12px] text-white/60',
        logo: '!size-[15px] cursor-pointer',
      }"
      :title="$t('footer.copyright')"
      :items="[
        'i-simple-icons-github',
        'i-simple-icons-discord',
        'i-simple-icons-x',
        'i-simple-icons-instagram',
        'i-simple-icons-linkedin',
        'i-simple-icons-facebook',
      ]" />
  </div>
</template>

<script setup lang="ts">
  import type { FooterColumn } from '@nuxt/ui';

  const { t } = useI18n();

  const columns = computed<FooterColumn[]>(() => [
    {
      label: t('footer.casino.title'),
      children: [
        { label: t('footer.casino.slots'), to: '#' },
        { label: t('footer.casino.live'), to: '#' },
        { label: t('footer.casino.roulette'), to: '#' },
        { label: t('footer.casino.blackjack'), to: '#' },
        { label: t('footer.casino.providers'), to: '#' },
        { label: t('footer.casino.promotions'), to: '#' },
        { label: t('footer.casino.originals'), to: '#' },
        { label: t('footer.casino.suppliers'), to: '#' },
      ],
    },
    {
      label: t('footer.sports.title'),
      children: [
        { label: t('footer.sports.sportsbook'), to: '#' },
        { label: t('footer.sports.live'), to: '#' },
        { label: t('footer.sports.football'), to: '#' },
        { label: t('footer.sports.basketball'), to: '#' },
        { label: t('footer.sports.esports'), to: '#' },
        { label: t('footer.sports.bonuses'), to: '#' },
        { label: t('footer.sports.rules'), to: '#' },
      ],
    },
    {
      label: t('footer.support.title'),
      children: [
        { label: t('footer.support.help'), to: '/help?type=faq' },
        { label: t('footer.support.fairness'), to: '/help?type=fair' },
        { label: t('footer.support.responsible'), to: '/help?type=disclaimer' },
        { label: t('footer.support.gamblingHelp'), to: '/help?type=gambling' },
        { label: t('footer.support.online'), to: '#' },
        { label: t('footer.support.selfExclude'), to: '/help?type=disclaimer' },
        { label: t('footer.support.law'), to: '/help?type=terms' },
      ],
    },
    {
      label: t('footer.about.title'),
      children: [
        { label: t('footer.about.vip'), to: '#' },
        { label: t('footer.about.affiliate'), to: '#' },
        { label: t('footer.about.privacy'), to: '/help?type=privacy' },
        { label: t('footer.about.aml'), to: '#' },
        { label: t('footer.about.terms'), to: '/help?type=terms' },
      ],
    },
    {
      label: t('footer.payments.title'),
      children: [
        { label: t('footer.payments.deposit'), to: '#' },
        { label: t('footer.payments.withdraw'), to: '#' },
        { label: t('footer.payments.currency'), to: '#' },
        { label: t('footer.payments.crypto'), to: '#' },
        { label: t('footer.payments.vault'), to: '#' },
        { label: t('footer.payments.bet'), to: '#' },
      ],
    },
    {
      label: t('footer.faq.title'),
      children: [
        { label: t('footer.faq.guide'), to: '#' },
        { label: t('footer.faq.liveCasino'), to: '#' },
        { label: t('footer.faq.sportsGuide'), to: '#' },
        { label: t('footer.faq.stream'), to: '#' },
        { label: t('footer.faq.vipGuide'), to: '#' },
        { label: t('footer.faq.houseEdge'), to: '#' },
      ],
    },
  ]);
</script>
