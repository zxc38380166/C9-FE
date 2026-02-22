<template>
  <div class="w-full space-y-4">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <div class="size-7 sm:size-8 rounded-[8px] sm:rounded-[10px] bg-amber-500/15 ring-1 ring-amber-500/25 flex items-center justify-center">
          <Icon name="i-lucide-party-popper" class="size-3.5 sm:size-4 text-amber-400" />
        </div>
        <div class="text-[16px] sm:text-[18px] font-bold text-white">優惠紀錄</div>
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
        <div class="size-12 rounded-full bg-amber-500/10 ring-1 ring-amber-500/20 flex items-center justify-center">
          <Icon name="i-lucide-loader-2" class="size-6 text-amber-400 animate-spin" />
        </div>
        <div class="text-[13px] text-white/40">載入中...</div>
      </div>
    </template>

    <!-- Empty -->
    <template v-else-if="!claims.length">
      <div class="flex flex-col items-center justify-center py-16 space-y-4">
        <div class="size-16 rounded-full bg-white/5 ring-1 ring-white/8 flex items-center justify-center">
          <Icon name="i-lucide-inbox" class="size-8 text-white/20" />
        </div>
        <div class="text-center">
          <div class="text-[15px] font-medium text-white/50">暫無優惠領取紀錄</div>
          <div class="text-[12px] text-white/30 mt-1">領取活動獎勵後紀錄將顯示於此</div>
        </div>
        <NuxtLink
          to="/promo"
          class="text-[13px] text-emerald-400 hover:text-emerald-300 transition-colors">
          前往活動中心
        </NuxtLink>
      </div>
    </template>

    <!-- Table -->
    <template v-else>
      <div class="-mx-3 sm:mx-0 overflow-x-auto sm:rounded-[12px] ring-1 ring-white/6">
        <UTable
          :data="claims"
          :columns="columns"
          :ui="{
            root: 'min-w-[480px]',
            thead: 'bg-white/3',
            th: 'text-white/50 text-center text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider',
            td: 'text-center text-white/80 text-[12px] sm:text-[13px]',
            tr: 'border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors',
          }" />
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="flex flex-col sm:flex-row items-center sm:justify-between gap-2 pt-1">
        <div class="text-[11px] sm:text-[12px] text-white/35 tabular-nums">
          共 <span class="text-white/60 font-medium">{{ pagination.total }}</span> 筆，第 {{ pagination.page }} / {{ pagination.totalPages }} 頁
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
  import { UBadge } from '#components';

  type PromoClaim = {
    id: number;
    promoId: number;
    promoTitle: string;
    promoTag: string;
    rewardAmount: string;
    claimedAt: string;
  };

  const tagColorMap: Record<string, 'error' | 'warning' | 'success' | 'info' | 'neutral'> = {
    '限時': 'error',
    '每日': 'warning',
    '推薦': 'success',
    'VIP': 'info',
    '體育': 'success',
    '賽事': 'warning',
    '新手': 'info',
    '存款': 'success',
  };

  const claims = ref<PromoClaim[]>([]);
  const loading = ref(false);
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  const formatAmount = (v: any) => {
    const n = Number(v);
    return Number.isFinite(n) ? `$${n.toLocaleString()}` : '—';
  };

  const formatDate = (v: string) => {
    if (!v) return '—';
    const d = new Date(v);
    if (isNaN(d.getTime())) return '—';
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const columns: TableColumn<PromoClaim>[] = [
    {
      accessorKey: 'promoTitle',
      header: '活動名稱',
      meta: { class: { th: 'text-center', td: 'text-center font-medium' } },
    },
    {
      accessorKey: 'promoTag',
      header: '標籤',
      meta: { class: { th: 'text-center', td: 'text-center' } },
      cell: ({ row }) => {
        const tag = row.getValue('promoTag') as string;
        const color = tagColorMap[tag] || 'neutral';
        return h(UBadge, { color, variant: 'subtle' }, () => tag);
      },
    },
    {
      accessorKey: 'rewardAmount',
      header: '獎勵金額',
      meta: { class: { th: 'text-center', td: 'text-center tabular-nums text-amber-400 font-medium' } },
      cell: ({ row }) => formatAmount(row.getValue('rewardAmount')),
    },
    {
      accessorKey: 'claimedAt',
      header: '領取時間',
      meta: { class: { th: 'text-center', td: 'text-center text-white/50 text-[12px] tabular-nums' } },
      cell: ({ row }) => formatDate(row.getValue('claimedAt') as string),
    },
  ];

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
