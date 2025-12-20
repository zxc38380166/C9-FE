<template>
  <div class="a1-layout-menu max-h-screen overflow-auto scrollable-hidden">
    <el-menu
      class="!border-r-0 min-h-[100vh]"
      :default-openeds="defaultOpeneds"
      :collapse="isCollapse"
      :default-active="activeKey">
      <!-- 上方切換 -->
      <el-menu-item index="mode">
        <i
          @click="isCollapse = !isCollapse"
          :class="isCollapse ? 'mdi-menu-close' : 'mdi-menu-open'"
          class="mdi text-white text-[22px] mr-3 cursor-pointer" />
        <template #title>
          <el-radio-group
            v-if="!isCollapse"
            v-model="gameMode"
            class="pl-3"
            fill="#5faf8e"
            text-color="#fff">
            <el-radio-button value="casino">娛樂城</el-radio-button>
            <el-radio-button value="sport">體育</el-radio-button>
          </el-radio-group>
        </template>
      </el-menu-item>
      <template v-for="item in menuList" :key="item.key">
        <!-- 分隔線 -->
        <el-menu-item v-if="item.divider" disabled class="!cursor-default !opacity-100 !h-[10px]">
          <div class="w-full h-px bg-white/10 my-2"></div>
        </el-menu-item>
        <!-- 子選單（遊戲） -->
        <el-sub-menu v-else-if="item.children" :index="item.key">
          <template #title>
            <i :class="item.icon" class="mdi text-[18px] mr-3" />
            <span>{{ $t(item.i18nKey!) }}</span>
          </template>
          <el-menu-item v-for="child in item.children" :key="child.key" :index="child.key">
            <i :class="child.icon" class="mdi text-[16px] mr-3" />
            <template #title>
              {{ $t(child.i18nKey!) }}
            </template>
          </el-menu-item>
        </el-sub-menu>
        <!-- 一般選單 -->
        <el-menu-item v-else :index="item.key">
          <i :class="item.icon" class="mdi text-[18px] mr-3" />
          <template #title>
            {{ $t(item.i18nKey!) }}
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script lang="ts" setup>
  const isCollapse = ref(false);
  const gameMode = ref<'casino' | 'sport'>('casino');
  const defaultOpeneds = ref<string[]>(['games']);

  interface MenuItem {
    key: string;
    icon?: string;
    i18nKey?: string;
    divider?: boolean;
    children?: MenuItem[];
  }

  const casinoMenu: MenuItem[] = [
    { key: 'favorite', icon: 'mdi-star-outline', i18nKey: 'menu.favorite' },
    { key: 'recent', icon: 'mdi-history', i18nKey: 'menu.recent' },
    { key: 'challenge', icon: 'mdi-trophy-outline', i18nKey: 'menu.challenge' },
    { key: 'bet', icon: 'mdi-clipboard-check-outline', i18nKey: 'menu.bet' },
    { key: 'divider-1', divider: true },
    {
      key: 'games',
      icon: 'mdi-gamepad-variant-outline',
      i18nKey: 'menu.games',
      children: [
        { key: 'live', icon: 'mdi-account-group-outline', i18nKey: 'menu.live' },
        { key: 'slot', icon: 'mdi-slot-machine', i18nKey: 'menu.slot' },
        { key: 'chess', icon: 'mdi-cards', i18nKey: 'menu.chess' },
        { key: 'fish', icon: 'mdi-fire-alert', i18nKey: 'menu.fish' },
        { key: 'c9Original', icon: 'mdi-fire', i18nKey: 'menu.c9Original' },
        { key: 'c9Exclusive', icon: 'mdi-alpha-c-circle-outline', i18nKey: 'menu.c9Exclusive' },
      ],
    },
  ];

  const activeKey = ref('favorite');
  const menuList = computed(() => {
    return casinoMenu;
  });

  const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath);
  };
  const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath);
  };
</script>
<style scoped lang="scss">
  .el-menu-item * {
    vertical-align: middle;
  }

  .a1-layout-menu {
    --el-menu-bg-color: #0e1f2b;
    --el-menu-text-color: #ffffff;
    --el-menu-active-color: #5faf8e;
    --el-menu-hover-bg-color: #2f4553;
    --el-menu-hover-text-color: #ffffff;
  }
</style>
