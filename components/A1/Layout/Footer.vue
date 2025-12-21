<template>
  <footer class="bg-[#071d2a] text-white/80 px-4">
    <!-- 上方連結區 -->
    <div class="mx-auto max-w-[1440px] px-4 py-12">
      <div class="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        <div v-for="group in footerLinks" :key="group.key">
          <h4 class="mb-4 text-sm font-semibold text-white">
            {{ $t(group.title) }}
          </h4>

          <ul class="space-y-3 text-sm">
            <li v-for="item in group.items" :key="item.key">
              <a
                :href="item.href || '#'"
                target="_blank"
                rel="noopener"
                class="hover:text-white transition">
                {{ $t(item.label) }}
                <span v-if="item.external" class="ml-1 opacity-60">↗</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 社群 -->
    <div class="flex justify-center gap-6 py-6">
      <a
        v-for="icon in socialIcons"
        :key="icon.key"
        :href="icon.href"
        target="_blank"
        class="text-white/70 hover:text-white transition text-lg">
        <i :class="icon.icon" />
      </a>
    </div>

    <!-- 分隔線 -->
    <div class="mx-auto max-w-[1440px] px-4">
      <div class="h-px w-full bg-white/10" />
    </div>

    <!-- 法律文字 -->
    <div
      class="mx-auto max-w-[1440px] px-4 py-8 text-center text-xs leading-relaxed text-white/60 space-y-4">
      <p>© 2025 Stake.com | {{ $t('footer.allRightsReserved') }}</p>

      <p>
        {{ $t('footer.license') }}
        <a href="mailto:support@stake.com" class="underline hover:text-white">
          support@stake.com
        </a>
      </p>

      <p>
        {{ $t('footer.responsibleGambling') }}
        <a
          href="https://www.gamblingtherapy.org"
          target="_blank"
          class="underline hover:text-white">
          Gamblingtherapy.org
        </a>
      </p>

      <p class="pt-2 text-white/50">1 BTC = $88,105.73</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
  /* ---------- footer link data ---------- */

  interface FooterItem {
    key: string;
    label: string;
    href?: string; // ✅ 明確宣告可選
    external?: boolean; // ✅ 明確宣告可選
  }

  interface FooterGroup {
    key: string;
    title: string;
    items: FooterItem[];
  }

  const footerLinks: FooterGroup[] = [
    {
      key: 'casino',
      title: 'footer.casino.title',
      items: [
        { key: 'slots', label: 'footer.casino.slots' },
        { key: 'live', label: 'footer.casino.live' },
        { key: 'roulette', label: 'footer.casino.roulette' },
        { key: 'blackjack', label: 'footer.casino.blackjack' },
        { key: 'providers', label: 'footer.casino.providers' },
        { key: 'promotions', label: 'footer.casino.promotions' },
        { key: 'stakeOriginals', label: 'footer.casino.originals', external: true },
        { key: 'stakeSuppliers', label: 'footer.casino.suppliers', external: true },
      ],
    },
    {
      key: 'sports',
      title: 'footer.sports.title',
      items: [
        { key: 'sportsbook', label: 'footer.sports.sportsbook' },
        { key: 'liveBetting', label: 'footer.sports.live' },
        { key: 'football', label: 'footer.sports.football' },
        { key: 'basketball', label: 'footer.sports.basketball' },
        { key: 'esports', label: 'footer.sports.esports' },
        { key: 'bonuses', label: 'footer.sports.bonuses' },
        { key: 'rules', label: 'footer.sports.rules' },
      ],
    },
    {
      key: 'support',
      title: 'footer.support.title',
      items: [
        { key: 'help', label: 'footer.support.help', external: true },
        { key: 'fairness', label: 'footer.support.fairness' },
        { key: 'responsible', label: 'footer.support.responsible' },
        { key: 'gamblingHelp', label: 'footer.support.gamblingHelp', external: true },
        { key: 'onlineSupport', label: 'footer.support.online' },
        { key: 'selfExclude', label: 'footer.support.selfExclude' },
        { key: 'law', label: 'footer.support.law' },
      ],
    },
    {
      key: 'about',
      title: 'footer.about.title',
      items: [
        { key: 'vip', label: 'footer.about.vip' },
        { key: 'affiliate', label: 'footer.about.affiliate' },
        { key: 'privacy', label: 'footer.about.privacy' },
        { key: 'aml', label: 'footer.about.aml' },
        { key: 'terms', label: 'footer.about.terms' },
      ],
    },
    {
      key: 'payments',
      title: 'footer.payments.title',
      items: [
        { key: 'deposit', label: 'footer.payments.deposit' },
        { key: 'withdraw', label: 'footer.payments.withdraw' },
        { key: 'currency', label: 'footer.payments.currency' },
        { key: 'crypto', label: 'footer.payments.crypto' },
        { key: 'vault', label: 'footer.payments.vault' },
        { key: 'betting', label: 'footer.payments.bet' },
      ],
    },
    {
      key: 'faq',
      title: 'footer.faq.title',
      items: [
        { key: 'guide', label: 'footer.faq.guide' },
        { key: 'liveCasino', label: 'footer.faq.liveCasino' },
        { key: 'sportsGuide', label: 'footer.faq.sportsGuide' },
        { key: 'stream', label: 'footer.faq.stream' },
        { key: 'vipGuide', label: 'footer.faq.vipGuide' },
        { key: 'houseEdge', label: 'footer.faq.houseEdge' },
      ],
    },
  ];

  /* ---------- social ---------- */
  const socialIcons = [
    { key: 'telegram', icon: 'mdi mdi-telegram', href: '#' },
    { key: 'chat', icon: 'mdi mdi-message-text-outline', href: '#' },
    { key: 'facebook', icon: 'mdi mdi-facebook', href: '#' },
    { key: 'x', icon: 'mdi mdi-twitter', href: '#' },
    { key: 'instagram', icon: 'mdi mdi-instagram', href: '#' },
    { key: 'youtube', icon: 'mdi mdi-youtube', href: '#' },
  ];
</script>
