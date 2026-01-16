<template>
  <UDashboardSidebar
    v-model:collapsed="collapsed"
    collapsible
    :min-size="15"
    :default-size="15"
    :max-size="15"
    :collapsed-size="0"
    class="shadow-[10px_0_30px_-18px_rgba(0,0,0,0.65)] ring-1 ring-white/10"
    :ui="{ footer: 'border-t border-default' }">
    <template #header="{ collapsed }">
      <Logo v-if="!collapsed" class="h-5 w-auto shrink-0"> LOGO </Logo>
      <UIcon v-else name="i-simple-icons-nuxtdotjs" class="size-5 text-primary mx-auto" />
    </template>

    <template #default="{ collapsed }">
      <UButton
        :label="collapsed ? undefined : 'Search...'"
        icon="i-lucide-search"
        color="neutral"
        variant="outline"
        block
        :square="collapsed">
        <template v-if="!collapsed" #trailing>
          <div class="flex items-center gap-0.5 ms-auto">
            <UKbd value="meta" variant="subtle" />
            <UKbd @click="switchCollapsed" value="K" variant="subtle" />
          </div>
        </template>
      </UButton>

      <UNavigationMenu
        :collapsed="collapsed"
        :items="items[0]"
        orientation="vertical"
        :ui="{ linkLabel: 'text-[16px]' }" />

      <UNavigationMenu
        :collapsed="collapsed"
        :items="items[1]"
        orientation="vertical"
        class="mt-auto"
        :ui="{ linkLabel: 'text-[16px]' }" />
    </template>

    <template #footer="{ collapsed }">
      <UButton
        :avatar="{
          src: 'https://github.com/benjamincanac.png',
        }"
        :label="collapsed ? undefined : 'Benjamin'"
        color="neutral"
        variant="ghost"
        class="w-full"
        :block="collapsed" />
    </template>
  </UDashboardSidebar>
</template>
<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui';

  const collapsed = ref(false);
  const switchCollapsed = () => (collapsed.value = !collapsed.value);
  defineShortcuts({ c: () => (collapsed.value = !collapsed.value) });

  const items: ComputedRef<NavigationMenuItem[][]> = computed(() => {
    return [
      [
        {
          label: '首頁',
          icon: 'i-lucide-house',
          active: true,
        },
        {
          label: '近期遊戲紀錄',
          icon: 'i-lucide-inbox',
          badge: '4',
        },
        {
          label: '遊戲',
          icon: 'i-lucide-settings',
          defaultOpen: true,
          children: [
            {
              label: '真人娛樂場',
            },
            {
              label: '老虎機',
            },
            {
              label: '棋牌',
            },
          ],
        },
      ],
      [
        {
          label: '展開 / 收合',
          icon: collapsed.value
            ? 'i-tabler:layout-sidebar-right-collapse'
            : 'i-tabler:layout-sidebar-left-collapse',
          //   to: "https://github.com/nuxt-ui-templates/dashboard",
          //   target: "_blank",
          onSelect: () => {
            switchCollapsed();
          },
        },
      ],
    ];
  });
</script>
