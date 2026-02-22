<template>
  <div class="w-full space-y-4">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <div
          class="size-7 sm:size-8 rounded-[8px] sm:rounded-[10px] bg-amber-500/15 ring-1 ring-amber-500/25 flex items-center justify-center">
          <Icon name="i-lucide-party-popper" class="size-3.5 sm:size-4 text-amber-400" />
        </div>
        <div class="text-[16px] sm:text-[18px] font-bold text-white">{{ $t('transaction.promoRecord') }}</div>
      </div>
      <UButton
        size="sm"
        variant="ghost"
        color="neutral"
        icon="i-lucide-refresh-cw"
        class="cursor-pointer shrink-0 rounded-[10px] ring-1 ring-white/10"
        :loading="loading"
        @click="fetchClaims" />
    </div>

    <div class="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

    <!-- Loading -->
    <template v-if="loading && !claims.length">
      <div class="flex flex-col items-center justify-center py-16 space-y-3">
        <div
          class="size-12 rounded-full bg-amber-500/10 ring-1 ring-amber-500/20 flex items-center justify-center">
          <Icon name="i-lucide-loader-2" class="size-6 text-amber-400 animate-spin" />
        </div>
        <div class="text-[13px] text-white/40">{{ $t('common.loading') }}</div>
      </div>
    </template>

    <!-- Empty -->
    <template v-else-if="!claims.length">
      <div class="flex flex-col items-center justify-center py-16 space-y-4">
        <div
          class="size-16 rounded-full bg-white/5 ring-1 ring-white/8 flex items-center justify-center">
          <Icon name="i-lucide-inbox" class="size-8 text-white/20" />
        </div>
        <div class="text-center">
          <div class="text-[15px] font-medium text-white/50">{{ $t('transaction.noPromoRecord') }}</div>
          <div class="text-[12px] text-white/30 mt-1">{{ $t('transaction.promoRecordHint') }}</div>
        </div>
        <NuxtLink
          to="/promo"
          class="text-[13px] text-emerald-400 hover:text-emerald-300 transition-colors">
          {{ $t('transaction.goPromoCenter') }}
        </NuxtLink>
      </div>
    </template>

    <!-- Table -->
    <template v-else>
      <!-- 手機版：卡片展開 -->
      <div class="sm:hidden space-y-2">
        <div
          v-for="item in claims"
          :key="item.id"
          class="rounded-[10px] bg-white/4 ring-1 ring-white/8 overflow-hidden">
          <button
            class="w-full flex items-center justify-between p-3 text-left cursor-pointer"
            @click="mobileExpandedId = mobileExpandedId === item.id ? null : item.id">
            <div class="min-w-0 flex-1 mr-2">
              <div class="text-[13px] font-medium text-white truncate">{{ item.promoTitle }}</div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-[13px] font-bold text-amber-400 tabular-nums">{{ fmtAmount(item.rewardAmount) }}</span>
              <Icon
                name="i-lucide-chevron-down"
                class="size-4 text-white/40 transition-transform duration-200"
                :class="mobileExpandedId === item.id ? 'rotate-180' : ''" />
            </div>
          </button>
          <div v-show="mobileExpandedId === item.id" class="border-t border-white/6 p-3 space-y-2">
            <div class="flex justify-between text-[12px]">
              <span class="text-white/40">{{ $t('transaction.promoTag') }}</span>
              <UBadge :color="TAG_COLOR_MAP[item.promoTag] || 'neutral'" variant="subtle" size="xs">
                {{ item.promoTag }}
              </UBadge>
            </div>
            <div class="flex justify-between text-[12px]">
              <span class="text-white/40">{{ $t('transaction.turnoverProgress') }}</span>
              <span
                class="tabular-nums"
                :class="item.turnoverCompleted === 1 ? 'text-emerald-400' : 'text-white/60'">
                {{ Number(item.requiredTurnover || 0) ? `${fmtAmount(item.completedTurnover || 0)} / ${fmtAmount(item.requiredTurnover)}` : '—' }}
              </span>
            </div>
            <div class="flex justify-between text-[12px]">
              <span class="text-white/40">{{ $t('transaction.claimedAt') }}</span>
              <span class="text-white/50 tabular-nums">{{ formatDateTime(item.claimedAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 桌面版：UTable -->
      <div class="hidden sm:block rounded-[12px] ring-1 ring-white/6">
        <UTable
          :data="claims"
          :columns="columns"
          :ui="{
            thead: 'bg-white/3',
            th: 'text-white/50 text-center text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider',
            td: 'text-center text-white/80 text-[12px] sm:text-[13px]',
            tr: 'border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors',
          }" />
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination.totalPages > 1"
        class="flex flex-col sm:flex-row items-center sm:justify-between gap-2 pt-1">
        <div class="text-[11px] sm:text-[12px] text-white/35 tabular-nums">
          {{ $t('transaction.paginationInfo', { total: pagination.total, page: pagination.page, totalPages: pagination.totalPages }) }}
        </div>
        <UPagination
          :model-value="pagination.page"
          :total="pagination.total"
          :items-per-page="pagination.pageSize"
          :ui="{ root: 'gap-0.5 sm:gap-1' }"
          @update:page="onPageChange" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import type { TableColumn } from '@nuxt/ui';
  import type { PromoClaim } from '~/composables/useApiTypes';
  import { UBadge } from '#components';

  const { t } = useI18n();
  const { formatNumber, formatDateTime } = utsFormat();
  const { TAG_COLOR_MAP } = utsPromo();

  const claims = ref<PromoClaim[]>([]);
  const loading = ref(false);
  const mobileExpandedId = ref<number | string | null>(null);
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  const fmtAmount = (v: any) => {
    const n = Number(v);
    return Number.isFinite(n) ? `$${formatNumber(n)}` : '—';
  };

  const columns = computed<TableColumn<PromoClaim>[]>(() => [
    {
      accessorKey: 'promoTitle',
      header: t('transaction.promoTitle'),
      meta: { class: { th: 'text-center', td: 'text-center font-medium' } },
    },
    {
      accessorKey: 'promoTag',
      header: t('transaction.promoTag'),
      meta: { class: { th: 'text-center', td: 'text-center' } },
      cell: ({ row }) => {
        const tag = row.getValue('promoTag') as string;
        const color = TAG_COLOR_MAP[tag] || 'neutral';
        return h(UBadge, { color, variant: 'subtle' }, () => tag);
      },
    },
    {
      accessorKey: 'rewardAmount',
      header: t('transaction.rewardAmount'),
      meta: {
        class: { th: 'text-center', td: 'text-center tabular-nums text-amber-400 font-medium' },
      },
      cell: ({ row }) => fmtAmount(row.getValue('rewardAmount')),
    },
    {
      accessorKey: 'requiredTurnover',
      header: t('transaction.turnoverProgress'),
      meta: {
        class: { th: 'text-center', td: 'text-center tabular-nums text-[12px]' },
      },
      cell: ({ row }) => {
        const required = Number(row.original.requiredTurnover || 0);
        if (!required) return '—';
        const completed = Number(row.original.completedTurnover || 0);
        const done = row.original.turnoverCompleted === 1;
        return h('span', { class: done ? 'text-emerald-400' : 'text-white/60' },
          `${fmtAmount(completed)} / ${fmtAmount(required)}`);
      },
    },
    {
      accessorKey: 'claimedAt',
      header: t('transaction.claimedAt'),
      meta: {
        class: { th: 'text-center', td: 'text-center text-white/50 text-[12px] tabular-nums' },
      },
      cell: ({ row }) => formatDateTime(row.getValue('claimedAt') as string),
    },
  ]);

  const fetchClaims = async () => {
    loading.value = true;
    try {
      const resp = await useApi().getPromoClaims({
        page: pagination.page,
        pageSize: pagination.pageSize,
      });
      if (resp?.code === 200 && resp.result) {
        claims.value = resp.result.items || [];
        const p = resp.result.pagination;
        if (p) {
          pagination.total = p.total || 0;
          pagination.totalPages = p.totalPages || 0;
        }
      }
    } catch {
    } finally {
      loading.value = false;
    }
  };

  const onPageChange = (page: number) => {
    pagination.page = page;
    fetchClaims();
  };

  onMounted(() => {
    fetchClaims();
  });
</script>
