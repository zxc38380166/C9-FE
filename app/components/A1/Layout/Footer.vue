<template>
  <div>
    <UFooterColumns
      :columns="columns"
      :ui="{ root: 'bg-[#0f172b] p-14 ring-1 ring-white/10 xl:grid-cols-2' }">
    </UFooterColumns>
    <UPageLogos
      :ui="{
        root: 'bg-[#0f172b] pb-16 grid place-items-center',
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
        { label: 'footer.casino.slots', to: '/casino/slots' },
        { label: 'footer.casino.live', to: '/casino/live' },
        { label: 'footer.casino.roulette', to: '/casino/roulette' },
        { label: 'footer.casino.blackjack', to: '/casino/blackjack' },
        { label: 'footer.casino.providers', to: '/casino/providers' },
        { label: 'footer.casino.promotions', to: '/casino/promotions' },
        {
          label: 'footer.casino.originals',
          to: '/casino/C9Originals',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        {
          label: 'footer.casino.suppliers',
          to: '/casino/C9Suppliers',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      ],
    },
    {
      label: 'footer.sports.title',
      children: [
        { label: 'footer.sports.sportsbook', to: '/sports/sportsbook' },
        { label: 'footer.sports.live', to: '/sports/liveBetting' },
        { label: 'footer.sports.football', to: '/sports/football' },
        { label: 'footer.sports.basketball', to: '/sports/basketball' },
        { label: 'footer.sports.esports', to: '/sports/esports' },
        { label: 'footer.sports.bonuses', to: '/sports/bonuses' },
        { label: 'footer.sports.rules', to: '/sports/rules' },
      ],
    },
    {
      label: 'footer.support.title',
      children: [
        {
          label: 'footer.support.help',
          to: '/support/help',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        { label: 'footer.support.fairness', to: '/support/fairness' },
        { label: 'footer.support.responsible', to: '/support/responsible' },
        {
          label: 'footer.support.gamblingHelp',
          to: '/support/gamblingHelp',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        { label: 'footer.support.online', to: '/support/onlineSupport' },
        { label: 'footer.support.selfExclude', to: '/support/selfExclude' },
        { label: 'footer.support.law', to: '/support/law' },
      ],
    },
    {
      label: 'footer.about.title',
      children: [
        { label: 'footer.about.vip', to: '/about/vip' },
        { label: 'footer.about.affiliate', to: '/about/affiliate' },
        { label: 'footer.about.privacy', to: '/about/privacy' },
        { label: 'footer.about.aml', to: '/about/aml' },
        { label: 'footer.about.terms', to: '/about/terms' },
      ],
    },
    {
      label: 'footer.payments.title',
      children: [
        { label: 'footer.payments.deposit', to: '/payments/deposit' },
        { label: 'footer.payments.withdraw', to: '/payments/withdraw' },
        { label: 'footer.payments.currency', to: '/payments/currency' },
        { label: 'footer.payments.crypto', to: '/payments/crypto' },
        { label: 'footer.payments.vault', to: '/payments/vault' },
        { label: 'footer.payments.bet', to: '/payments/betting' },
      ],
    },
    {
      label: 'footer.faq.title',
      children: [
        { label: 'footer.faq.guide', to: '/faq/guide' },
        { label: 'footer.faq.liveCasino', to: '/faq/liveCasino' },
        { label: 'footer.faq.sportsGuide', to: '/faq/sportsGuide' },
        { label: 'footer.faq.stream', to: '/faq/stream' },
        { label: 'footer.faq.vipGuide', to: '/faq/vipGuide' },
        { label: 'footer.faq.houseEdge', to: '/faq/houseEdge' },
      ],
    },
  ];
</script>
