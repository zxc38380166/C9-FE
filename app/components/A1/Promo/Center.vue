<template>
  <div class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-4 sm:p-6 space-y-5 sm:space-y-6">
    <!-- 頁面標題 -->
    <div class="flex items-center gap-2.5">
      <div
        class="size-10 sm:size-12 rounded-2xl bg-linear-to-br from-amber-500/20 to-amber-700/10 ring-1 ring-amber-500/30 flex items-center justify-center">
        <Icon name="noto:party-popper" class="text-[22px] sm:text-[26px]" />
      </div>
      <div>
        <h1 class="text-[22px] sm:text-[28px] font-bold text-white tracking-wide">活動中心</h1>
        <p class="text-[12px] sm:text-[13px] text-white/40">探索所有優惠活動，領取專屬獎勵</p>
      </div>
    </div>

    <div class="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

    <!-- 篩選列 -->
    <div>
      <div
        class="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <button
          v-for="filter in filters"
          :key="filter.value"
          type="button"
          class="shrink-0 px-3.5 sm:px-4 py-2 rounded-lg text-[12px] sm:text-[13px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap"
          :class="
            activeFilter === filter.value
              ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25'
              : 'bg-white/5 text-white/50 ring-1 ring-white/8 hover:bg-white/8 hover:text-white/70'
          "
          @click="activeFilter = filter.value">
          {{ filter.label }}
        </button>
      </div>
    </div>

    <div class="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

    <!-- 內容區 -->
    <div>
      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <div v-for="i in 6" :key="i" class="rounded-xl bg-white/5 overflow-hidden animate-pulse">
          <div class="h-40 sm:h-48 bg-white/3" />
          <div class="p-4 space-y-3">
            <div class="h-5 w-2/3 bg-white/3 rounded" />
            <div class="h-4 w-1/2 bg-white/3 rounded" />
            <div class="h-8 w-full bg-white/3 rounded-lg" />
          </div>
        </div>
      </div>

      <!-- 活動列表 -->
      <template v-else-if="filteredItems.length">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <NuxtLink
            v-for="item in filteredItems"
            :key="item.id"
            :to="`/promo/${item.id}`"
            class="group">
            <div
              class="rounded-xl bg-white/3 ring-1 ring-white/6 overflow-hidden transition-all duration-300 hover:ring-emerald-500/25 hover:shadow-[0_8px_40px_-12px_rgba(16,185,129,0.15)]"
              :class="{ 'card-claimable': item.isClaimable && !item.isClaimed }">
              <!-- 圖片區 -->
              <div class="relative overflow-hidden">
                <NuxtImg
                  :src="item.imgMobile"
                  :alt="item.title"
                  class="sm:hidden w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy" />
                <NuxtImg
                  :src="item.imgPc"
                  :alt="item.title"
                  class="hidden sm:block w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy" />
                <div
                  class="absolute inset-0 bg-linear-to-t from-[#131f30] via-transparent to-transparent opacity-60" />
                <!-- 狀態角標 -->
                <div class="absolute top-3 right-3 flex flex-col items-end gap-1">
                  <UBadge v-if="item.isActive" color="success" variant="solid" size="xs">
                    進行中
                  </UBadge>
                  <UBadge v-else color="neutral" variant="solid" size="xs"> 已結束 </UBadge>
                  <UBadge v-if="item.isClaimed" color="neutral" variant="solid" size="xs">
                    已領取
                  </UBadge>
                  <UBadge v-else-if="item.isClaimable" color="warning" variant="solid" size="xs">
                    可領取
                  </UBadge>
                </div>
                <!-- tag -->
                <div class="absolute top-3 left-3">
                  <UBadge :color="getTagColor(item.tag)" variant="solid" size="xs">
                    {{ item.tag }}
                  </UBadge>
                </div>
              </div>

              <!-- 內容區 -->
              <div class="p-4 sm:p-5 space-y-3">
                <h3
                  class="text-[15px] sm:text-[17px] font-bold text-white leading-snug group-hover:text-emerald-400 transition-colors">
                  {{ item.title }}
                </h3>

                <!-- 獎勵 & 時間 -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <Icon name="i-lucide-gift" class="size-3.5 text-amber-400" />
                    <span class="text-[13px] sm:text-[14px] font-semibold text-amber-400">
                      ${{ Number(item.rewardAmount || 0).toLocaleString() }}
                    </span>
                  </div>
                  <div class="flex items-center gap-1 text-[11px] sm:text-[12px] text-white/35">
                    <Icon name="i-lucide-clock" class="size-3" />
                    {{ formatDateShort(item.endTime) }}
                  </div>
                </div>

                <!-- 進度條 -->
                <div v-if="item.maxClaims" class="space-y-1.5">
                  <div class="flex items-center justify-between text-[11px] text-white/35">
                    <span>已領取</span>
                    <span>{{ item.claimedCount }} / {{ item.maxClaims }}</span>
                  </div>
                  <div class="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      class="h-full rounded-full bg-linear-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                      :style="{
                        width: `${Math.min(100, (item.claimedCount / item.maxClaims) * 100)}%`,
                      }" />
                  </div>
                </div>

                <!-- 底部操作 -->
                <div class="flex items-center justify-between pt-1">
                  <div class="flex items-center gap-1.5">
                    <Icon name="i-lucide-target" class="size-3 text-white/30" />
                    <span class="text-[11px] sm:text-[12px] text-white/40">{{
                      getConditionLabel(item)
                    }}</span>
                  </div>
                  <!-- 未登入：登入參加 -->
                  <button
                    v-if="!isLogin"
                    class="relative z-10 flex items-center gap-1 px-3 py-1 rounded-lg text-[12px] sm:text-[13px] font-bold bg-linear-to-r from-amber-500 to-amber-600 text-white shadow-[0_0_12px_-2px_rgba(245,158,11,0.4)] hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer"
                    @click.prevent="openLoginModal()">
                    <Icon name="i-lucide-log-in" class="size-3.5" />
                    登入參加
                  </button>
                  <!-- 已登入 + 可領取 -->
                  <button
                    v-else-if="item.isClaimable && !item.isClaimed && item.isActive"
                    class="relative z-10 flex items-center gap-1 px-3 py-1 rounded-lg text-[12px] sm:text-[13px] font-bold bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-[0_0_12px_-2px_rgba(16,185,129,0.4)] hover:from-emerald-400 hover:to-emerald-500 transition-all cursor-pointer disabled:opacity-50"
                    :disabled="claimingId === item.id"
                    @click.prevent="onQuickClaim(item)">
                    <Icon v-if="claimingId === item.id" name="i-lucide-loader-2" class="size-3.5 animate-spin" />
                    <Icon v-else name="i-lucide-gift" class="size-3.5" />
                    {{ claimingId === item.id ? '領取中' : '立即領取' }}
                  </button>
                  <!-- 其他：查看詳情 -->
                  <div
                    v-else
                    class="flex items-center gap-1 text-emerald-400 text-[12px] sm:text-[13px] font-medium group-hover:gap-2 transition-all">
                    查看詳情
                    <Icon name="i-lucide-arrow-right" class="size-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- 分頁 -->
        <div v-if="pagination.totalPages > 1" class="flex items-center justify-center gap-2 pt-6">
          <button
            :disabled="pagination.page <= 1"
            class="size-9 rounded-lg bg-white/5 ring-1 ring-white/8 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            @click="goToPage(pagination.page - 1)">
            <Icon name="i-lucide-chevron-left" class="size-4" />
          </button>
          <template v-for="p in paginationRange" :key="p">
            <span v-if="p === '...'" class="px-1 text-white/30 text-[13px]">...</span>
            <button
              v-else
              class="size-9 rounded-lg text-[13px] font-medium flex items-center justify-center transition-all cursor-pointer"
              :class="
                pagination.page === p
                  ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25'
                  : 'bg-white/5 ring-1 ring-white/8 text-white/50 hover:bg-white/10 hover:text-white'
              "
              @click="goToPage(p as number)">
              {{ p }}
            </button>
          </template>
          <button
            :disabled="pagination.page >= pagination.totalPages"
            class="size-9 rounded-lg bg-white/5 ring-1 ring-white/8 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            @click="goToPage(pagination.page + 1)">
            <Icon name="i-lucide-chevron-right" class="size-4" />
          </button>
        </div>
      </template>

      <!-- 空狀態 -->
      <div v-else class="flex flex-col items-center justify-center py-20 space-y-3">
        <div
          class="size-16 rounded-2xl bg-white/5 ring-1 ring-white/8 flex items-center justify-center">
          <Icon name="i-lucide-search-x" class="size-8 text-white/20" />
        </div>
        <span class="text-[15px] font-medium text-white/40">沒有符合條件的活動</span>
        <button
          v-if="activeFilter !== 'all'"
          class="text-[13px] text-emerald-400 hover:text-emerald-300 cursor-pointer"
          @click="activeFilter = 'all'">
          查看所有活動
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  interface PromoItem {
    id: number;
    title: string;
    imgPc: string;
    imgMobile: string;
    tag: string;
    startTime: string;
    endTime: string;
    enabled: number;
    conditionType: string;
    conditionValue: string;
    rewardAmount: string;
    maxClaims: number;
    claimedCount: number;
    isActive: boolean;
    isClaimed: boolean;
    isClaimable: boolean;
  }

  const toast = useToast();
  const { isLogin, refreshUserData } = useAuth();
  const { openLoginModal } = useLayout();

  const loading = ref(true);
  const claimingId = ref<number | null>(null);
  const promoItems = ref<PromoItem[]>([]);
  const activeFilter = ref('all');
  const pagination = reactive({ page: 1, pageSize: 9, total: 0, totalPages: 1 });

  const filters = [
    { label: '全部', value: 'all' },
    { label: '進行中', value: 'active' },
    { label: '可領取', value: 'claimable' },
    { label: '限時', value: '限時' },
    { label: '新手', value: '新手' },
    { label: '存款', value: '存款' },
    { label: 'VIP', value: 'VIP' },
  ];

  const tagColorMap: Record<string, string> = {
    限時: 'error',
    每日: 'warning',
    推薦: 'success',
    VIP: 'info',
    體育: 'success',
    賽事: 'warning',
    新手: 'info',
    存款: 'success',
  };

  const conditionMap: Record<string, string> = {
    none: '無條件',
    first_deposit: '首次存款',
    deposit_threshold: '存款門檻',
    vip_level: 'VIP 等級',
  };

  const getTagColor = (tag: string) => (tagColorMap[tag] || 'neutral') as any;

  const getConditionLabel = (item: PromoItem) => {
    const base = conditionMap[item.conditionType] || item.conditionType;
    if (item.conditionType === 'deposit_threshold' && Number(item.conditionValue))
      return `${base} $${Number(item.conditionValue).toLocaleString()}`;
    if (item.conditionType === 'vip_level' && Number(item.conditionValue))
      return `${base} Lv.${item.conditionValue}`;
    return base;
  };

  const formatDateShort = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      return (
        new Date(dateStr).toLocaleDateString('zh-TW', {
          month: '2-digit',
          day: '2-digit',
        }) + ' 截止'
      );
    } catch {
      return dateStr;
    }
  };

  const filteredItems = computed(() => {
    if (activeFilter.value === 'all') return promoItems.value;
    if (activeFilter.value === 'active') return promoItems.value.filter((i) => i.isActive);
    if (activeFilter.value === 'claimable')
      return promoItems.value.filter((i) => i.isClaimable && !i.isClaimed);
    return promoItems.value.filter((i) => i.tag === activeFilter.value);
  });

  const paginationRange = computed(() => {
    const total = pagination.totalPages;
    const current = pagination.page;
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | string)[] = [];
    pages.push(1);
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  });

  const fetchPromos = async (page = 1) => {
    loading.value = true;
    try {
      const res = await useApi().getPromos({ page, pageSize: pagination.pageSize });
      if (res?.result) {
        promoItems.value = res.result.items || [];
        if (res.result.pagination) {
          pagination.page = res.result.pagination.page;
          pagination.total = res.result.pagination.total;
          pagination.totalPages = res.result.pagination.totalPages;
        }
      }
    } catch (e) {
      console.error('[Promo List] fetch failed', e);
    } finally {
      loading.value = false;
    }
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchPromos(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onQuickClaim = async (item: PromoItem) => {
    if (claimingId.value) return;
    claimingId.value = item.id;
    try {
      const res = await useApi().claimPromo(item.id);
      if (res?.code === 200) {
        toast.add({
          title: '領取成功',
          description: `已獲得 $${Number(res.result?.rewardAmount || 0).toLocaleString()} 獎勵！`,
          color: 'success',
        });
        item.isClaimed = true;
        item.claimedCount = (item.claimedCount || 0) + 1;
        refreshUserData();
      }
    } catch (e) {
      console.error('[Promo Claim] failed', e);
    } finally {
      claimingId.value = null;
    }
  };

  onMounted(() => {
    fetchPromos();
  });
</script>
<style scoped>
  .card-claimable {
    animation: card-wobble 3s ease-in-out infinite;
    box-shadow:
      0 0 8px rgba(245, 158, 11, 0.3),
      0 0 20px rgba(245, 158, 11, 0.15),
      0 0 40px rgba(245, 158, 11, 0.08);
    --tw-ring-color: rgba(245, 158, 11, 0.3);
  }

  @keyframes card-wobble {
    0%, 100% { transform: translateY(0) scale(1); }
    25% { transform: translateY(-2px) scale(1.008); }
    50% { transform: translateY(0) scale(1); }
    75% { transform: translateY(-1px) scale(1.004); }
  }
</style>
