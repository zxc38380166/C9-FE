<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <section
      class="relative w-full overflow-hidden rounded-2xl bg-slate-950 px-7 py-8 text-white shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -left-24 -top-24 size-105 rounded-full bg-white/8 blur-[2px]" />
        <div class="absolute left-10 top-10 size-130 rounded-full bg-white/6 blur-[1px]" />
        <div class="absolute -right-40 -bottom-40 size-155 rounded-full bg-black/25 blur-[2px]" />
        <div
          class="absolute inset-0"
          style="
            background: radial-gradient(
                circle at 20% 20%,
                rgba(255, 255, 255, 0.06),
                transparent 55%
              ),
              radial-gradient(circle at 55% 10%, rgba(255, 255, 255, 0.05), transparent 60%),
              radial-gradient(circle at 70% 75%, rgba(0, 0, 0, 0.35), transparent 55%);
          " />
      </div>
      <div class="relative">
        <template v-if="isLogin">
          <!-- VIP 載入中 -->
          <template v-if="vipLoading">
            <div class="animate-pulse space-y-4">
              <div class="h-7 w-48 bg-white/8 rounded-lg" />
              <div class="flex items-center gap-3">
                <div class="size-12 rounded-xl bg-white/8" />
                <div class="flex-1 space-y-2">
                  <div class="h-5 w-32 bg-white/8 rounded" />
                  <div class="h-3 w-48 bg-white/5 rounded" />
                </div>
              </div>
              <div class="h-2.5 w-full bg-white/5 rounded-full" />
              <div class="grid grid-cols-3 gap-2">
                <div v-for="i in 3" :key="i" class="h-14 bg-white/5 rounded-lg" />
              </div>
            </div>
          </template>

          <!-- VIP 資料 -->
          <template v-else-if="vipStatus">
            <!-- 標題 + 等級 badge -->
            <div class="flex items-center justify-between mb-4">
              <h2 class="font-bold text-[22px] sm:text-[26px] text-white flex items-center gap-2">
                <Icon :name="vipTierIcon" class="text-[24px] sm:text-[28px]" />
                VIP 進度
              </h2>
              <NuxtLink
                to="/user/vip"
                class="text-[12px] text-white/40 hover:text-emerald-400 transition-colors flex items-center gap-1">
                查看詳情
                <Icon name="i-lucide-chevron-right" class="size-3.5" />
              </NuxtLink>
            </div>

            <!-- 使用者 + 等級 -->
            <div class="flex items-center gap-3 mb-4">
              <div
                class="size-12 rounded-xl flex items-center justify-center"
                :class="vipBadgeClass">
                <Icon :name="vipTierIcon" class="text-[22px]" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-[16px] sm:text-[18px] font-bold text-white truncate">
                    {{ store.getUserDetail?.account }}
                  </span>
                  <UBadge :color="vipBadgeColor" variant="solid" class="text-[10px] shrink-0">
                    Lv.{{ vipStatus.level }}
                  </UBadge>
                </div>
                <div class="text-[11px] sm:text-[12px] text-white/40">
                  {{ vipTierLabel }} · 累計存款 ${{ formatVipNumber(vipStatus.currentChip) }}
                </div>
              </div>
            </div>

            <!-- 進度條 -->
            <div class="space-y-2 mb-4">
              <div class="flex items-center justify-between text-[11px] sm:text-[12px]">
                <span class="text-white/40">升級進度</span>
                <span class="font-bold" :class="vipTextClass">{{ vipProgressPercent }}%</span>
              </div>
              <div class="w-full h-2.5 rounded-full bg-white/6 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700 ease-out"
                  :class="vipBarClass"
                  :style="{ width: `${vipProgressPercent}%` }" />
              </div>
              <div class="flex items-center justify-between text-[10px] sm:text-[11px] text-white/30">
                <span>${{ formatVipNumber(vipStatus.currentChip) }}</span>
                <span v-if="vipNextLevel">
                  下一級: {{ vipNextLevel.name }} (${{ formatVipNumber(vipStatus.nextLevelMinChip) }})
                </span>
                <span v-else class="flex items-center gap-1">
                  <Icon name="i-lucide-sparkles" class="size-3 text-amber-400" />
                  已達最高等級
                </span>
              </div>
            </div>

            <!-- 快速數據 -->
            <div class="grid grid-cols-3 gap-2">
              <div class="rounded-lg bg-white/5 ring-1 ring-white/6 px-3 py-2.5 text-center">
                <div class="text-[10px] text-white/35 mb-0.5">當前等級</div>
                <div class="text-[14px] sm:text-[15px] font-bold" :class="vipTextClass">
                  {{ vipTierLabel }}
                </div>
              </div>
              <div class="rounded-lg bg-white/5 ring-1 ring-white/6 px-3 py-2.5 text-center">
                <div class="text-[10px] text-white/35 mb-0.5">最高返水</div>
                <div class="text-[14px] sm:text-[15px] font-bold text-emerald-400">
                  {{ vipMaxRebate }}%
                </div>
              </div>
              <div class="rounded-lg bg-white/5 ring-1 ring-white/6 px-3 py-2.5 text-center">
                <div class="text-[10px] text-white/35 mb-0.5">保級門檻</div>
                <div class="text-[14px] sm:text-[15px] font-bold text-rose-400">
                  ${{ formatVipNumber(vipStatus.relegationChip) }}
                </div>
              </div>
            </div>
          </template>

          <!-- VIP 載入失敗 fallback -->
          <template v-else>
            <h2 class="font-bold text-[22px] sm:text-[26px] text-white mb-3 flex items-center gap-2">
              <Icon name="noto:crown" class="text-[24px]" />
              VIP 進度
            </h2>
            <div class="text-[13px] text-white/40 mb-4">無法載入 VIP 資料</div>
            <button
              class="px-4 py-2 rounded-lg text-[13px] font-medium bg-white/8 hover:bg-white/12 text-white/70 transition-colors cursor-pointer"
              @click="fetchVipData">
              重新載入
            </button>
          </template>
        </template>
        <template v-else>
          <h2 class="text-[30px] leading-[1.15] font-extrabold tracking-wide">
            世界上最大的在线赌场和体<br />育博彩
          </h2>
          <button
            type="button"
            class="mt-6 inline-flex items-center justify-center rounded-xl bg-linear-to-b from-[#77cbac] to-[#1a6b52] px-6 py-3 text-sm font-bold shadow-sm hover:brightness-110 active:brightness-95 transition"
            @click="onRegister">
            注册
          </button>
          <div class="mt-8 text-sm font-semibold text-white/70">通过其他方式注册</div>
          <div class="mt-3 flex items-center gap-3">
            <button
              v-for="p in providers"
              :key="p.key"
              type="button"
              class="group flex h-12 w-12 items-center justify-center rounded-xl bg-white/6 shadow-[0_10px_18px_rgba(0,0,0,0.22)] ring-1 ring-white/10 hover:bg-white/10 transition"
              @click="onProvider(p.key)">
              <span
                class="flex h-8 w-8 items-center justify-center rounded-lg"
                :style="{ background: p.bg }">
                <Icon :name="p.icon" size="18" />
              </span>
            </button>
          </div>
        </template>
      </div>
    </section>
    <div v-if="isDesktop" class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <NuxtLink
        v-for="item in items"
        :key="item.key"
        :to="`/${item.key}`"
        class="group text-left focus:outline-none">
        <div
          class="entry-card relative overflow-hidden h-full rounded-2xl bg-[#131f30] ring-1 ring-white/8 transition-all duration-300"
          :style="{ boxShadow: `0 8px 24px -6px rgba(0,0,0,0.4)`, '--accent': item.accentColor }">
          <!-- 圖片 -->
          <div class="relative overflow-hidden" :style="{ height: `${imageHeight}px` }">
            <NuxtImg
              :src="item.imageUrl"
              :alt="item.title"
              class="h-full w-full object-cover object-top" />
            <!-- 底部融合漸層 -->
            <div class="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#131f30] to-transparent" />
            <!-- hover 光暈 -->
            <div
              class="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              :style="{ background: `radial-gradient(ellipse at 50% 0%, ${item.accentColor}15, transparent 65%)` }" />
          </div>
          <!-- 底部資訊 -->
          <div class="flex items-center justify-between px-5 py-3.5 bg-[#131f30]">
            <div class="flex items-center gap-3">
              <div
                class="size-9 rounded-lg flex items-center justify-center ring-1 ring-white/10"
                :style="{ background: `${item.accentColor}15` }">
                <Icon :name="item.icon" class="text-[20px]" />
              </div>
              <div>
                <div class="text-[15px] font-bold text-white tracking-wide">{{ item.title }}</div>
                <div class="text-[11px] text-white/35 group-hover:text-white/50 transition-colors">進入遊戲大廳</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="relative flex size-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span class="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span class="text-[14px] font-bold text-white/80">
                {{ typeof item.count === 'number' ? item.count.toLocaleString() : item.count }}
              </span>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { A1ModalRegister } from '#components';

  type CategoryItem = {
    key: string;
    title: string;
    count: number | string;
    icon: string;
    imageUrl: string;
    accentColor: string;
  };

  const {
    items = [
      {
        key: 'game',
        title: '娱乐城',
        count: 54617,
        icon: 'twemoji:slot-machine',
        imageUrl:
          'https://mediumrare.imgix.net/stake-casino-home-18-jul-25-en.png?w=700&h=460&fit=min&auto=format',
        accentColor: '#3B82F6',
      },
      {
        key: 'sport',
        title: '体育',
        count: 9402,
        icon: 'fluent-color:sport-24',
        imageUrl:
          'https://mediumrare.imgix.net/stake-sports-home-18-jul-25-zh.png?w=350&h=230&fit=min&auto=format',
        accentColor: '#22C55E',
      },
    ],
    imageHeight = 245,
  } = defineProps<{
    items?: CategoryItem[];
    imageHeight?: number;
  }>();

  const store = useStore();
  const router = useRouter();
  const overlay = useOverlay();
  const { isLogin } = useAuth();
  const { isDesktop } = useDevice();
  defineEmits<{ (e: 'select', item: CategoryItem): void }>();

  const registerModal = overlay.create(A1ModalRegister, {
    defaultOpen: false,
    destroyOnClose: false,
    props: { showBtn: false },
  });

  const providers = ref([
    { key: 'google', icon: 'simple-icons:google', bg: 'transparent', color: '#fff' },
    { key: 'facebook', icon: 'lineicons:facebook-original', bg: 'transparent', color: '#fff' },
    { icon: 'bi:telegram', bg: 'transparent', color: '#fff' },
  ]);

  const onRegister = () => {
    registerModal.open();
  };

  const onProvider = (key: string = '') => {};

  // ---- VIP ----
  interface VipHomeStatus {
    level: number;
    name: string;
    tier: string;
    currentChip: string;
    nextLevelMinChip: string;
    progress: string;
    relegationChip: string;
    rebates: { gameType: string; rebateRate: string }[];
    allLevels: { level: number; name: string; tier: string; minChip: string }[];
  }

  const vipLoading = ref(false);
  const vipStatus = ref<VipHomeStatus | null>(null);

  interface VipTierStyle {
    badge: string;
    bar: string;
    text: string;
    badgeColor: string;
    icon: string;
  }

  const vipTierStyles: { [K: string]: VipTierStyle; bronze: VipTierStyle; gold: VipTierStyle; platinum: VipTierStyle; diamond: VipTierStyle } = {
    bronze: {
      badge: 'bg-linear-to-br from-amber-700/30 to-amber-900/20 ring-1 ring-amber-600/30',
      bar: 'bg-linear-to-r from-amber-700 to-amber-500',
      text: 'text-amber-500',
      badgeColor: 'warning',
      icon: 'noto:3rd-place-medal',
    },
    gold: {
      badge: 'bg-linear-to-br from-amber-500/30 to-amber-700/20 ring-1 ring-amber-400/30',
      bar: 'bg-linear-to-r from-amber-500 to-amber-300',
      text: 'text-amber-400',
      badgeColor: 'warning',
      icon: 'noto:1st-place-medal',
    },
    platinum: {
      badge: 'bg-linear-to-br from-blue-500/30 to-blue-700/20 ring-1 ring-blue-400/30',
      bar: 'bg-linear-to-r from-blue-500 to-blue-300',
      text: 'text-blue-400',
      badgeColor: 'info',
      icon: 'noto:gem-stone',
    },
    diamond: {
      badge: 'bg-linear-to-br from-purple-500/30 to-purple-700/20 ring-1 ring-purple-400/30',
      bar: 'bg-linear-to-r from-purple-500 to-purple-300',
      text: 'text-purple-400',
      badgeColor: 'error',
      icon: 'noto:crown',
    },
  };

  const getVipStyle = (tier: string): VipTierStyle => vipTierStyles[tier] ?? vipTierStyles.bronze;

  const vipTierIcon = computed(() => getVipStyle(vipStatus.value?.tier || 'bronze').icon);
  const vipBadgeClass = computed(() => getVipStyle(vipStatus.value?.tier || 'bronze').badge);
  const vipBarClass = computed(() => getVipStyle(vipStatus.value?.tier || 'bronze').bar);
  const vipTextClass = computed(() => getVipStyle(vipStatus.value?.tier || 'bronze').text);
  const vipBadgeColor = computed(() => getVipStyle(vipStatus.value?.tier || 'bronze').badgeColor as any);

  const vipTierLabel = computed(() => {
    const labels: Record<string, string> = { bronze: '青銅', gold: '黃金', platinum: '鉑金', diamond: '鑽石' };
    return labels[vipStatus.value?.tier || 'bronze'] || vipStatus.value?.tier || '';
  });

  const vipProgressPercent = computed(() => {
    const p = Number(vipStatus.value?.progress || 0);
    return Math.min(100, Math.round(p * 100));
  });

  const vipNextLevel = computed(() => {
    if (!vipStatus.value?.allLevels) return null;
    return vipStatus.value.allLevels.find((lv) => lv.level === vipStatus.value!.level + 1) || null;
  });

  const vipMaxRebate = computed(() => {
    if (!vipStatus.value?.rebates?.length) return '0.00';
    return Math.max(...vipStatus.value.rebates.map((r) => Number(r.rebateRate))).toFixed(2);
  });

  const formatVipNumber = (val: string | number) => {
    const n = Number(val || 0);
    return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const fetchVipData = async () => {
    vipLoading.value = true;
    try {
      const res = await useApi().getVipStatus();
      if (res?.code === 200) vipStatus.value = res.result;
    } catch (e) {
      console.error('[Home VIP] fetch failed', e);
    } finally {
      vipLoading.value = false;
    }
  };

  onMounted(() => {
    if (isLogin.value) fetchVipData();
  });

  watch(isLogin, (val) => {
    if (val) fetchVipData();
    else vipStatus.value = null;
  });
</script>
<style scoped>
  .group:hover .entry-card {
    --tw-ring-color: color-mix(in srgb, var(--accent) 30%, transparent);
  }
</style>
