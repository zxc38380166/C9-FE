<template>
  <div class="a1-layout-menu" :style="{ width: asideWidth }" :class="{ 'is-collapse': collapse }">
    <div class="a1-layout-menu__scroll">
      <el-menu
        class="a1-el-menu !border-r-0"
        :default-openeds="defaultOpeneds"
        :collapse="collapse"
        :collapse-transition="true"
        :default-active="activeKey">
        <!-- 上方切換 -->
        <el-menu-item
          index="mode"
          class="a1-menu-top !h-[60px] relative after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[12px] after:shadow-[0_6px_12px_rgba(0,0,0,0.6)] after:pointer-events-none">
          <i
            @click.stop="toggleCollapse"
            :class="collapse ? 'mdi-menu-close' : 'mdi-menu-open'"
            class="mdi text-white text-[22px] mr-3 cursor-pointer" />
          <template #title>
            <el-radio-group
              v-if="!collapse"
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
          <el-menu-item
            v-if="item.divider"
            :index="item.key"
            disabled
            class="!cursor-default !opacity-100 !h-[10px]">
            <div class="w-full h-px bg-white/10 my-2"></div>
          </el-menu-item>
          <!-- 子選單 -->
          <el-sub-menu v-else-if="item.children" :index="item.key">
            <template #title>
              <i v-if="item.icon" :class="item.icon" class="mdi text-[18px] mr-3" />
              <span>{{ item.i18nKey ? $t(item.i18nKey) : item.key }}</span>
            </template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.key"
              :index="child.key"
              @click="child.onClick?.()">
              <i v-if="child.icon" :class="child.icon" class="mdi text-[16px] mr-3" />
              <template #title>
                {{ child.i18nKey ? $t(child.i18nKey) : child.key }}
              </template>
            </el-menu-item>
          </el-sub-menu>
          <!-- 一般選單 -->
          <el-menu-item v-else :index="item.key" @click="item.onClick?.()">
            <i v-if="item.icon" :class="item.icon" class="mdi text-[18px] mr-3" />
            <template #title>
              {{ item.i18nKey ? $t(item.i18nKey) : item.key }}
            </template>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>
<script setup lang="ts">
  const store = useStore();
  const props = defineProps<{
    collapse: boolean;
    asideWidth: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:collapse', v: boolean): void;
  }>();

  const toggleCollapse = () => {
    emit('update:collapse', !props.collapse);
  };

  const gameMode = ref<'casino' | 'sport'>('casino');
  const defaultOpeneds = ref<string[]>(['games']);
  const activeKey = ref('favorite');

  interface MenuItem {
    key: string;
    icon?: string;
    i18nKey?: string;
    divider?: boolean;
    children?: MenuItem[];
    onClick?: () => void;
  }

  const casinoMenu: MenuItem[] = [
    {
      key: 'favorite',
      icon: 'mdi-star-outline',
      i18nKey: 'menu.favorite',
      onClick: () => {},
    },
    {
      key: 'recent',
      icon: 'mdi-history',
      i18nKey: 'menu.recent',
      onClick: () => {},
    },
    {
      key: 'games',
      icon: 'mdi-gamepad-variant-outline',
      i18nKey: 'menu.games',
      children: [
        { key: 'live', icon: 'mdi-account-group-outline', i18nKey: 'menu.live', onClick: () => {} },
        { key: 'slot', icon: 'mdi-slot-machine', i18nKey: 'menu.slot', onClick: () => {} },
        { key: 'chess', icon: 'mdi-cards', i18nKey: 'menu.chess', onClick: () => {} },
        { key: 'fish', icon: 'mdi-fish', i18nKey: 'menu.fish', onClick: () => {} },
        { key: 'c9Original', icon: 'mdi-fire', i18nKey: 'menu.c9Original', onClick: () => {} },
        {
          key: 'c9Exclusive',
          icon: 'mdi-alpha-c-circle-outline',
          i18nKey: 'menu.c9Exclusive',
          onClick: () => {},
        },
      ],
    },

    {
      key: 'lang',
      icon: 'mdi-translate',
      i18nKey: 'menu.lang',
      onClick: () => {
        store.getDoms.dialogLang.open = true;
      },
    },
  ];

  const sportMenu: MenuItem[] = [];

  const menuList = computed(() => {
    return gameMode.value === 'casino' ? casinoMenu : sportMenu;
  });
</script>
<style scoped lang="scss">
  .a1-layout-menu {
    /* 由外層 layout 控制 width，但這裡也可保底 */
    height: 100vh;
    background: #0e1f2b;
    overflow: hidden; /* 外框不捲 */
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
  }

  .a1-layout-menu__scroll {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0px 0 30px 0;

    /* 隱藏 scrollbar（可選） */
    scrollbar-width: none;
  }
  .a1-layout-menu__scroll::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .a1-el-menu {
    --el-menu-bg-color: #0e1f2b;
    --el-menu-text-color: #ffffff;
    --el-menu-active-color: #5faf8e;
    --el-menu-hover-bg-color: #2f4553;
    --el-menu-hover-text-color: #ffffff;

    min-height: 100%;
    background: transparent !important;
  }

  /* 避免 icon / 文字垂直不齊 */
  .el-menu-item * {
    vertical-align: middle;
  }

  /* 頂部那行不要被 hover 影響太怪（可調） */
  .a1-menu-top {
    position: sticky;
    top: 0;
    z-index: 5;
    background: #0e1f2b;
  }
</style>
