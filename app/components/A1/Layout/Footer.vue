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
      :title="'© 2025 C9.com | 版权所有 \n C9 由 Medium Rare N.V. 运营，如需协助请联系 support@C9.com \n C9 致力于负责任博彩，了解更多请访问 Gamblingtherapy.org'"
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

  const columns: FooterColumn[] = [
    {
      label: 'footer.casino.title',
      children: [
        { label: 'footer.casino.slots', to: '#' },
        { label: 'footer.casino.live', to: '#' },
        { label: 'footer.casino.roulette', to: '#' },
        { label: 'footer.casino.blackjack', to: '#' },
        { label: 'footer.casino.providers', to: '#' },
        { label: 'footer.casino.promotions', to: '#' },
        { label: 'footer.casino.originals', to: '#' },
        { label: 'footer.casino.suppliers', to: '#' },
      ],
    },
    {
      label: 'footer.sports.title',
      children: [
        { label: 'footer.sports.sportsbook', to: '#' },
        { label: 'footer.sports.live', to: '#' },
        { label: 'footer.sports.football', to: '#' },
        { label: 'footer.sports.basketball', to: '#' },
        { label: 'footer.sports.esports', to: '#' },
        { label: 'footer.sports.bonuses', to: '#' },
        { label: 'footer.sports.rules', to: '#' },
      ],
    },
    {
      label: 'footer.support.title',
      children: [
        { label: 'footer.support.help', to: '/help?type=faq' },
        { label: 'footer.support.fairness', to: '/help?type=fair' },
        { label: 'footer.support.responsible', to: '/help?type=disclaimer' },
        { label: 'footer.support.gamblingHelp', to: '/help?type=gambling' },
        { label: 'footer.support.online', to: '#' },
        { label: 'footer.support.selfExclude', to: '/help?type=disclaimer' },
        { label: 'footer.support.law', to: '/help?type=terms' },
      ],
    },
    {
      label: 'footer.about.title',
      children: [
        { label: 'footer.about.vip', to: '#' },
        { label: 'footer.about.affiliate', to: '#' },
        { label: 'footer.about.privacy', to: '/help?type=privacy' },
        { label: 'footer.about.aml', to: '#' },
        { label: 'footer.about.terms', to: '/help?type=terms' },
      ],
    },
    {
      label: 'footer.payments.title',
      children: [
        { label: 'footer.payments.deposit', to: '#' },
        { label: 'footer.payments.withdraw', to: '#' },
        { label: 'footer.payments.currency', to: '#' },
        { label: 'footer.payments.crypto', to: '#' },
        { label: 'footer.payments.vault', to: '#' },
        { label: 'footer.payments.bet', to: '#' },
      ],
    },
    {
      label: 'footer.faq.title',
      children: [
        { label: 'footer.faq.guide', to: '#' },
        { label: 'footer.faq.liveCasino', to: '#' },
        { label: 'footer.faq.sportsGuide', to: '#' },
        { label: 'footer.faq.stream', to: '#' },
        { label: 'footer.faq.vipGuide', to: '#' },
        { label: 'footer.faq.houseEdge', to: '#' },
      ],
    },
  ];
</script>
