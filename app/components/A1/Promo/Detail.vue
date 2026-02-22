<template>
  <div class="max-w-4xl mx-auto space-y-5 sm:space-y-6 py-4 sm:py-6">
    <!-- 返回按鈕 -->
    <NuxtLink
      to="/promo"
      class="inline-flex items-center gap-1.5 text-[13px] text-white/50 hover:text-white transition-colors">
      <Icon name="i-lucide-arrow-left" class="size-4" />
      返回活動列表
    </NuxtLink>

    <!-- Loading skeleton -->
    <template v-if="loading">
      <div class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 overflow-hidden animate-pulse">
        <div class="h-50 sm:h-72 bg-white/5" />
        <div class="p-5 sm:p-8 space-y-4">
          <div class="h-8 w-2/3 bg-white/5 rounded-lg" />
          <div class="h-4 w-1/3 bg-white/5 rounded-lg" />
          <div class="h-32 bg-white/5 rounded-lg" />
        </div>
      </div>
    </template>

    <!-- Detail content -->
    <template v-else-if="promo">
      <!-- Hero banner -->
      <div class="relative rounded-2xl overflow-hidden ring-1 ring-white/10">
        <!-- 手機版用 imgMobile，桌面用 imgPc -->
        <NuxtImg
          :src="promo.imgMobile"
          :alt="promo.title"
          class="sm:hidden w-full h-50 object-cover" />
        <NuxtImg
          :src="promo.imgPc"
          :alt="promo.title"
          class="hidden sm:block w-full h-72 object-cover" />
        <div
          class="absolute inset-0 bg-linear-to-t from-[#131f30] via-[#131f30]/40 to-transparent" />
        <div class="absolute bottom-0 inset-x-0 p-5 sm:p-8">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <UBadge :color="getTagColor(promo.tag)" variant="solid">
              {{ promo.tag }}
            </UBadge>
            <UBadge v-if="promo.isActive" color="success" variant="solid"> 進行中 </UBadge>
            <UBadge v-else color="neutral" variant="solid"> 已結束 </UBadge>
          </div>
          <h1 class="text-[22px] sm:text-[32px] font-bold text-white leading-tight">
            {{ promo.title }}
          </h1>
        </div>
      </div>

      <!-- Info cards row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <!-- 獎勵金額 -->
        <div class="rounded-xl bg-[#131f30] ring-1 ring-white/8 p-3.5 sm:p-4 space-y-1.5">
          <div class="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-white/40">
            <Icon name="i-lucide-gift" class="size-3.5 text-amber-400" />
            獎勵金額
          </div>
          <div class="text-[18px] sm:text-[22px] font-bold text-amber-400">
            ${{ Number(promo.rewardAmount || 0).toLocaleString() }}
          </div>
        </div>
        <!-- 活動條件 -->
        <div class="rounded-xl bg-[#131f30] ring-1 ring-white/8 p-3.5 sm:p-4 space-y-1.5">
          <div class="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-white/40">
            <Icon name="i-lucide-target" class="size-3.5 text-emerald-400" />
            活動條件
          </div>
          <div class="text-[14px] sm:text-[16px] font-semibold text-white/80">
            {{ conditionLabel }}
          </div>
        </div>
        <!-- 開始時間 -->
        <div class="rounded-xl bg-[#131f30] ring-1 ring-white/8 p-3.5 sm:p-4 space-y-1.5">
          <div class="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-white/40">
            <Icon name="i-lucide-calendar" class="size-3.5 text-blue-400" />
            開始時間
          </div>
          <div class="text-[13px] sm:text-[14px] font-medium text-white/70">
            {{ formatPromoDate(promo.startTime) }}
          </div>
        </div>
        <!-- 結束時間 -->
        <div class="rounded-xl bg-[#131f30] ring-1 ring-white/8 p-3.5 sm:p-4 space-y-1.5">
          <div class="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-white/40">
            <Icon name="i-lucide-clock" class="size-3.5 text-rose-400" />
            結束時間
          </div>
          <div class="text-[13px] sm:text-[14px] font-medium text-white/70">
            {{ formatPromoDate(promo.endTime) }}
          </div>
        </div>
      </div>

      <!-- 領取進度 & 按鈕 -->
      <div class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <Icon name="i-lucide-trophy" class="size-5 text-amber-400" />
              <span class="text-[16px] sm:text-[18px] font-bold text-white">領取獎勵</span>
            </div>
            <div class="text-[12px] sm:text-[13px] text-white/50">
              已領取 {{ promo.claimedCount || 0 }} / {{ promo.maxClaims || '∞' }} 次
            </div>
            <!-- 進度條 -->
            <div
              v-if="promo.maxClaims"
              class="w-full sm:w-60 h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                class="h-full rounded-full bg-linear-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                :style="{
                  width: `${Math.min(100, ((promo.claimedCount || 0) / promo.maxClaims) * 100)}%`,
                }" />
            </div>
          </div>
          <button
            :disabled="
              isLogin && (!promo.isActive || promo.isClaimed || !promo.isClaimable || claiming)
            "
            class="w-full sm:w-auto px-8 py-3 rounded-xl text-[14px] sm:text-[15px] font-bold transition-all duration-200 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            :class="claimButtonClass"
            @click="isLogin ? onClaim() : openLoginModal()">
            <Icon v-if="!isLogin" name="i-lucide-log-in" class="size-4" />
            <Icon v-else-if="claiming" name="i-lucide-loader-2" class="size-4 animate-spin" />
            {{ claimButtonText }}
          </button>
        </div>
      </div>

      <!-- 活動內容 -->
      <div class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-8 space-y-4">
        <div class="flex items-center gap-2">
          <Icon name="i-lucide-file-text" class="size-5 text-emerald-400" />
          <span class="text-[16px] sm:text-[18px] font-bold text-white">活動詳情</span>
        </div>
        <div class="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        <!-- HTML content from API -->
        <div
          v-if="promo.content"
          class="promo-content prose prose-invert max-w-none text-[13px] sm:text-[15px] leading-relaxed text-white/70"
          v-html="promo.content" />
        <!-- actionHtml from API -->
        <div
          v-if="promo.actionHtml"
          class="promo-content prose prose-invert max-w-none text-[13px] sm:text-[15px] leading-relaxed text-white/70"
          v-html="promo.actionHtml" />
        <div
          v-if="!promo.content && !promo.actionHtml"
          class="text-center py-6 text-white/30 text-[14px]">
          暫無詳細說明
        </div>
      </div>
    </template>

    <!-- Error / Not found -->
    <template v-else>
      <div class="flex flex-col items-center justify-center py-20 text-white/40 space-y-3">
        <Icon name="i-lucide-search-x" class="size-12" />
        <span class="text-[16px] font-medium">找不到該活動</span>
        <NuxtLink to="/" class="text-emerald-400 hover:text-emerald-300 text-[14px]">
          返回首頁
        </NuxtLink>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
  const { formatDate } = utsFormat();
  const { getTagColor, CONDITION_MAP } = utsPromo();

  const route = useRoute();
  const router = useRouter();
  const toast = useToast();
  const { isLogin, refreshUserData } = useAuth();
  const { openLoginModal } = useLayout();

  interface PromoDetail {
    id: number;
    title: string;
    imgPc: string;
    imgMobile: string;
    content: string;
    actionHtml: string;
    startTime: string;
    endTime: string;
    tag: string;
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

  const loading = ref(true);
  const claiming = ref(false);
  const promo = ref<PromoDetail | null>(null);

  const conditionLabel = computed(() => {
    if (!promo.value) return '';
    const type = promo.value.conditionType;
    const value = promo.value.conditionValue;
    const base = CONDITION_MAP[type] || type;
    if (type === 'deposit_threshold' && Number(value))
      return `${base} $${Number(value).toLocaleString()}`;
    if (type === 'vip_level' && Number(value)) return `${base} Lv.${value}`;
    return base;
  });

  const formatPromoDate = (dateStr: string) => formatDate(dateStr, 'YYYY/MM/DD HH:mm');

  const claimButtonText = computed(() => {
    if (!isLogin.value) return '登入參加';
    if (claiming.value) return '領取中...';
    if (!promo.value?.isActive) return '活動已結束';
    if (promo.value?.isClaimed) return '已領取';
    if (!promo.value?.isClaimable) return '未達條件';
    return '立即領取';
  });

  const claimButtonClass = computed(() => {
    if (!isLogin.value) {
      return 'bg-linear-to-r from-amber-500 to-amber-600 text-white shadow-[0_0_24px_-4px_rgba(245,158,11,0.4)] hover:from-amber-400 hover:to-amber-500 hover:shadow-[0_0_30px_-4px_rgba(245,158,11,0.5)]';
    }
    if (!promo.value?.isActive || promo.value?.isClaimed || !promo.value?.isClaimable) {
      return 'bg-white/5 text-white/30 ring-1 ring-white/8';
    }
    return 'bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-[0_0_24px_-4px_rgba(16,185,129,0.4)] hover:from-emerald-400 hover:to-emerald-500 hover:shadow-[0_0_30px_-4px_rgba(16,185,129,0.5)]';
  });

  const fetchDetail = async () => {
    const id = Number(route.params.id);
    if (!id) return;
    loading.value = true;
    try {
      const res = await useApi().getPromoById(id);
      if (res?.result) {
        promo.value = res.result;
      }
    } catch (e) {
      console.error('[Promo Detail] fetch failed', e);
    } finally {
      loading.value = false;
    }
  };

  const onClaim = async () => {
    if (!promo.value || claiming.value) return;
    claiming.value = true;
    try {
      const res = await useApi().claimPromo(promo.value.id);
      if (res?.code === 200) {
        toast.add({
          title: '領取成功',
          description: `已獲得 $${Number(res.result?.rewardAmount || 0).toLocaleString()} 獎勵！`,
          color: 'success',
        });
        promo.value.isClaimed = true;
        promo.value.claimedCount = (promo.value.claimedCount || 0) + 1;
        refreshUserData();
      }
    } catch (e) {
      console.error('[Promo Claim] failed', e);
    } finally {
      claiming.value = false;
    }
  };

  onMounted(() => {
    fetchDetail();
  });
</script>
<style scoped>
  .promo-content :deep(img) {
    border-radius: 12px;
    max-width: 100%;
    height: auto;
  }
  .promo-content :deep(a) {
    color: rgb(52, 211, 153);
    text-decoration: underline;
  }
  .promo-content :deep(h1),
  .promo-content :deep(h2),
  .promo-content :deep(h3) {
    color: white;
    font-weight: 700;
    margin-top: 1.25em;
    margin-bottom: 0.5em;
  }
  .promo-content :deep(ul),
  .promo-content :deep(ol) {
    padding-left: 1.25em;
    margin: 0.75em 0;
  }
  .promo-content :deep(li) {
    margin: 0.25em 0;
  }
  .promo-content :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
  }
  .promo-content :deep(th),
  .promo-content :deep(td) {
    padding: 0.5em 0.75em;
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-align: left;
  }
  .promo-content :deep(th) {
    background: rgba(255, 255, 255, 0.05);
    color: white;
    font-weight: 600;
  }
</style>
