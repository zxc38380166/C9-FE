<template>
  <UDashboardSidebar
    v-model:collapsed="collapsed"
    collapsible
    :min-size="15"
    :default-size="15"
    :max-size="15"
    :collapsed-size="0"
    class="sidebar-root"
    :ui="{
      footer: 'border-t border-white/6',
    }">
    <template #header="{ collapsed }">
      <NuxtLink to="/" class="flex items-center gap-2.5 group">
        <div v-if="!collapsed" class="flex items-center gap-2.5">
          <div
            class="size-9 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_16px_-2px_rgba(16,185,129,0.5)]">
            <Icon name="noto:gem-stone" class="text-[18px]" />
          </div>
          <div class="leading-none">
            <span class="text-[16px] font-extrabold tracking-wide text-white">C9</span>
            <span class="text-[10px] text-emerald-400/70 block font-medium tracking-widest"
              >CASINO</span
            >
          </div>
        </div>
        <div
          v-else
          class="size-9 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_16px_-2px_rgba(16,185,129,0.5)] mx-auto">
          <Icon name="noto:gem-stone" class="text-[18px]" />
        </div>
      </NuxtLink>
    </template>

    <template #default="{ collapsed }">
      <!-- 搜尋遊戲 (掛載 modal) -->
      <A1GameSearch />
      <UContentSearchButton
        :collapsed="collapsed"
        :label="i18n.t('game.searchPlaceholder')"
        :kbds="['shift', 's']"
        color="neutral"
        variant="outline"
        block
        :tooltip="collapsed ? { content: { side: 'right' } } : false" />

      <!-- 主導航 -->
      <UNavigationMenu
        :collapsed="collapsed"
        :items="mainItems"
        orientation="vertical"
        highlight
        highlight-color="success"
        color="success"
        variant="pill"
        :ui="{
          linkLabel: 'text-[14px] font-medium',
          linkLeadingIcon: 'size-[18px]',
          link: 'py-2 px-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/6 data-[active]:text-emerald-400 data-[active]:bg-emerald-500/10',
          childLink:
            'py-1.5 px-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/6 data-[active]:text-emerald-400',
          childLinkLabel: 'text-[13px]',
        }" />

      <!-- 底部操作 -->
      <UNavigationMenu
        :collapsed="collapsed"
        :items="bottomItems"
        orientation="vertical"
        class="mt-auto"
        :ui="{
          linkLabel: 'text-[14px] font-medium',
          linkLeadingIcon: 'size-[18px]',
          link: 'py-2 px-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/6',
        }" />
    </template>

    <template #footer="{}">
      <A1ModalLocale />
    </template>
  </UDashboardSidebar>
</template>

<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui';

  const route = useRoute();
  const i18n = useI18n();
  const collapsed = ref(false);
  const switchCollapsed = () => (collapsed.value = !collapsed.value);

  const isActive = (path: string) => route.path === path;
  const isGameActive = () => route.path.startsWith('/game');
  const isGameTabActive = (tab: string) => isGameActive() && route.query.tab === tab;
  const isHelpActive = () => route.path.startsWith('/help');
  const isHelpTabActive = (tab: string) => isHelpActive() && route.query.type === tab;

  const gameChildren = computed<NavigationMenuItem[]>(() => [
    {
      label: i18n.t('game.gameLobby'),
      icon: 'material-symbols:view-list-sharp',
      to: '/game?tab=gameLobby',
      active: isGameTabActive('gameLobby') || (isGameActive() && !route.query.tab),
    },
    {
      label: i18n.t('game.live'),
      icon: 'ic:twotone-live-tv',
      to: '/game?tab=live',
      active: isGameTabActive('live'),
    },
    {
      label: i18n.t('game.slot'),
      icon: 'mdi:slot-machine-outline',
      to: '/game?tab=slot',
      active: isGameTabActive('slot'),
    },
    {
      label: i18n.t('game.chess'),
      icon: 'fluent:chess-24-filled',
      to: '/game?tab=chess',
      active: isGameTabActive('chess'),
    },
    {
      label: i18n.t('game.sports'),
      icon: 'material-symbols-light:sports-volleyball',
      to: '/game?tab=sports',
      active: isGameTabActive('sports'),
    },
    {
      label: i18n.t('game.lottery'),
      icon: 'fluent:lottery-20-filled',
      to: '/game?tab=lottery',
      active: isGameTabActive('lottery'),
    },
    {
      label: i18n.t('game.esports'),
      icon: 'material-symbols:sports-esports',
      to: '/game?tab=esports',
      active: isGameTabActive('esports'),
    },
    {
      label: i18n.t('game.crypto'),
      icon: 'streamline-ultimate:virtual-coin-crypto-ethereum-bold',
      to: '/game?tab=crypto',
      active: isGameTabActive('crypto'),
    },
    {
      label: i18n.t('game.fish'),
      icon: 'tdesign:fish-filled',
      to: '/game?tab=fish',
      active: isGameTabActive('fish'),
    },
    {
      label: i18n.t('game.gameProvider'),
      icon: 'material-symbols:business-center-outline',
      to: '/game?tab=gameProvider',
      active: isGameTabActive('gameProvider'),
    },
  ]);

  const helpChildren = computed<NavigationMenuItem[]>(() => [
    {
      label: i18n.t('help.about.nav'),
      icon: 'i-lucide-info',
      to: '/help?type=aboutUs',
      active: isHelpTabActive('aboutUs') || (isHelpActive() && !route.query.type),
    },
    {
      label: i18n.t('help.fair.nav'),
      icon: 'i-lucide-scale',
      to: '/help?type=fair',
      active: isHelpTabActive('fair'),
    },
    {
      label: i18n.t('help.terms.nav'),
      icon: 'i-lucide-file-text',
      to: '/help?type=terms',
      active: isHelpTabActive('terms'),
    },
    {
      label: i18n.t('help.privacy.nav'),
      icon: 'i-lucide-shield',
      to: '/help?type=privacy',
      active: isHelpTabActive('privacy'),
    },
    {
      label: i18n.t('help.faq.nav'),
      icon: 'i-lucide-circle-help',
      to: '/help?type=faq',
      active: isHelpTabActive('faq'),
    },
    {
      label: i18n.t('help.gambling.nav'),
      icon: 'i-lucide-alert-triangle',
      to: '/help?type=gambling',
      active: isHelpTabActive('gambling'),
    },
    {
      label: i18n.t('help.disclaimer.nav'),
      icon: 'i-lucide-heart-handshake',
      to: '/help?type=disclaimer',
      active: isHelpTabActive('disclaimer'),
    },
  ]);

  const mainItems: ComputedRef<NavigationMenuItem[]> = computed(() => [
    {
      label: i18n.t('nav.home'),
      icon: 'i-lucide-house',
      to: '/',
      active: isActive('/'),
    },
    {
      label: i18n.t('nav.casino'),
      icon: 'i-lucide-gamepad-2',
      to: '/game',
      active: isGameActive(),
      defaultOpen: true,
      children: gameChildren.value,
    },
    {
      label: i18n.t('nav.promoCenter'),
      icon: 'i-lucide-party-popper',
      to: '/promo',
      active: route.path.startsWith('/promo'),
    },
    {
      label: i18n.t('vip.title'),
      icon: 'i-lucide-crown',
      to: '/user/vip',
      active: route.path === '/user/vip',
    },
    {
      label: i18n.t('help.title'),
      icon: 'i-lucide-life-buoy',
      to: '/help',
      active: isHelpActive(),
      defaultOpen: isHelpActive(),
      children: helpChildren.value,
    },
    {
      label: i18n.t('nav.recentGames'),
      icon: 'i-lucide-history',
      badge: '4',
    },
  ]);

  const bottomItems: ComputedRef<NavigationMenuItem[]> = computed(() => [
    {
      label: collapsed.value ? i18n.t('nav.expand') : i18n.t('nav.collapseSidebar'),
      icon: collapsed.value
        ? 'i-tabler:layout-sidebar-right-collapse'
        : 'i-tabler:layout-sidebar-left-collapse',
      onSelect: () => {
        switchCollapsed();
      },
    },
  ]);

  defineShortcuts({ c: () => (collapsed.value = !collapsed.value) });
</script>
<style scoped>
  .sidebar-root {
    background: linear-gradient(180deg, #0d1b2a 0%, #0a1628 40%, #071020 100%);
    border-right: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow:
      10px 0 40px -15px rgba(0, 0, 0, 0.7),
      inset -1px 0 0 rgba(255, 255, 255, 0.04);
  }
</style>
