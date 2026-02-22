<template>
  <div class="w-full space-y-4">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <div
          class="size-7 sm:size-8 rounded-[8px] sm:rounded-[10px] bg-cyan-500/15 ring-1 ring-cyan-500/25 flex items-center justify-center">
          <Icon name="i-lucide-dices" class="size-3.5 sm:size-4 text-cyan-400" />
        </div>
        <div class="text-[16px] sm:text-[18px] font-bold text-white">{{ $t('betRecord.title') }}</div>
      </div>
      <div class="flex items-center gap-2">
        <USelectMenu
          v-model="statusFilter"
          :items="statusOptions"
          :ui="{
            base: 'w-full sm:w-[140px] h-[34px] sm:h-[36px] rounded-[10px] bg-slate-800 ring-1 ring-white/10 text-white text-[12px] sm:text-[13px]',
            content: 'bg-slate-800 ring-1 ring-white/10',
          }"
          icon="i-lucide-filter"
          value-key="value"
          @update:model-value="onStatusChange" />
        <UButton
          size="sm"
          variant="ghost"
          color="neutral"
          icon="i-lucide-refresh-cw"
          class="cursor-pointer shrink-0 rounded-[10px] ring-1 ring-white/10"
          :loading="loading"
          @click="fetchRecords" />
      </div>
    </div>

    <div class="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

    <!-- Summary cards -->
    <div v-if="summary" class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      <div class="rounded-[10px] bg-white/4 ring-1 ring-white/8 p-3 space-y-1">
        <div class="text-[11px] text-white/40">{{ $t('betRecord.totalBets') }}</div>
        <div class="text-[16px] font-bold text-white tabular-nums">{{ summary.totalBetCount }}</div>
      </div>
      <div class="rounded-[10px] bg-white/4 ring-1 ring-white/8 p-3 space-y-1">
        <div class="text-[11px] text-white/40">{{ $t('betRecord.betAmount') }}</div>
        <div class="text-[16px] font-bold text-white tabular-nums">{{ fmtAmount(summary.betAmount) }}</div>
      </div>
      <div class="rounded-[10px] bg-white/4 ring-1 ring-white/8 p-3 space-y-1">
        <div class="text-[11px] text-white/40">{{ $t('betRecord.effectiveBet') }}</div>
        <div class="text-[16px] font-bold text-amber-400 tabular-nums">{{ fmtAmount(summary.betEffective) }}</div>
      </div>
      <div class="rounded-[10px] bg-white/4 ring-1 ring-white/8 p-3 space-y-1">
        <div class="text-[11px] text-white/40">{{ $t('betRecord.winLose') }}</div>
        <div
          class="text-[16px] font-bold tabular-nums"
          :class="Number(summary.winLose) >= 0 ? 'text-emerald-400' : 'text-rose-400'">
          {{ Number(summary.winLose) >= 0 ? '+' : '' }}{{ fmtAmount(summary.winLose) }}
        </div>
      </div>
    </div>

    <!-- Loading -->
    <template v-if="loading && !records.length">
      <div class="flex flex-col items-center justify-center py-16 space-y-3">
        <div
          class="size-12 rounded-full bg-cyan-500/10 ring-1 ring-cyan-500/20 flex items-center justify-center">
          <Icon name="i-lucide-loader-2" class="size-6 text-cyan-400 animate-spin" />
        </div>
        <div class="text-[13px] text-white/40">{{ $t('common.loading') }}</div>
      </div>
    </template>

    <!-- Empty -->
    <template v-else-if="!records.length">
      <div class="flex flex-col items-center justify-center py-16 space-y-4">
        <div
          class="size-16 rounded-full bg-white/5 ring-1 ring-white/8 flex items-center justify-center">
          <Icon name="i-lucide-inbox" class="size-8 text-white/20" />
        </div>
        <div class="text-center">
          <div class="text-[15px] font-medium text-white/50">{{ $t('betRecord.noRecord') }}</div>
          <div class="text-[12px] text-white/30 mt-1">{{ $t('betRecord.noRecordHint') }}</div>
        </div>
      </div>
    </template>

    <!-- Table -->
    <template v-else>
      <div
        class="-mx-3 sm:mx-0 overflow-x-auto scrollbar-hide sm:rounded-[12px] ring-1 ring-white/6">
        <UTable
          :data="records"
          :columns="columns"
          :ui="{
            root: 'min-w-[720px]',
            thead: 'bg-white/3',
            th: 'text-white/50 text-center text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider',
            td: 'text-center text-white/80 text-[12px] sm:text-[13px]',
            tr: 'border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors cursor-pointer',
          }"
          @select="onRowSelect" />
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

    <!-- Detail Slideover -->
    <USlideover v-model:open="detailOpen" :ui="{ content: 'bg-[#0f1923] ring-1 ring-white/10' }">
      <template #header>
        <div class="flex items-center gap-2">
          <Icon name="i-lucide-list" class="size-5 text-cyan-400" />
          <span class="text-[16px] font-bold text-white">{{ $t('betRecord.detailTitle') }}</span>
        </div>
      </template>
      <template #body>
        <div v-if="detailLoading" class="flex items-center justify-center py-12">
          <Icon name="i-lucide-loader-2" class="size-8 text-white/40 animate-spin" />
        </div>
        <div v-else-if="!details.length" class="text-center py-12 text-white/40 text-[14px]">
          {{ $t('betRecord.noDetail') }}
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="d in details"
            :key="d.id"
            class="rounded-[10px] bg-white/4 ring-1 ring-white/8 p-3 flex items-center justify-between">
            <div class="space-y-0.5">
              <div class="text-[12px] text-white/40">{{ $t('betRecord.round') }} #{{ d.roundNo }}</div>
              <div class="text-[11px] text-white/30">{{ formatDateTime(d.createdAt) }}</div>
            </div>
            <div class="text-right space-y-0.5">
              <div class="text-[12px] text-white/60">{{ $t('betRecord.betAmount') }}: {{ fmtAmount(d.betAmount) }}</div>
              <div
                class="text-[13px] font-bold tabular-nums"
                :class="Number(d.winLose) >= 0 ? 'text-emerald-400' : 'text-rose-400'">
                {{ Number(d.winLose) >= 0 ? '+' : '' }}{{ fmtAmount(d.winLose) }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
  import type { TableColumn } from '@nuxt/ui';
  import type { BetRecordItem, BetRecordDetail, BetRecordSummary } from '~/composables/useApiTypes';
  import { UBadge } from '#components';

  const { t } = useI18n();
  const { formatNumber, formatDateTime } = utsFormat();

  // ==================== Constants ====================

  const STATUS_MAP = computed<
    Record<string, { label: string; color: 'success' | 'error' | 'warning' }>
  >(() => ({
    valid: { label: t('betRecord.status.valid'), color: 'success' },
    invalid: { label: t('betRecord.status.invalid'), color: 'error' },
    cancelled: { label: t('betRecord.status.cancelled'), color: 'warning' },
  }));

  const statusOptions = computed(() => [
    { label: t('transaction.allStatus'), value: '' },
    { label: t('betRecord.status.valid'), value: 'valid' },
    { label: t('betRecord.status.invalid'), value: 'invalid' },
    { label: t('betRecord.status.cancelled'), value: 'cancelled' },
  ]);

  // ==================== State ====================

  const records = ref<BetRecordItem[]>([]);
  const summary = ref<BetRecordSummary | null>(null);
  const loading = ref(false);
  const statusFilter = ref('');
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  // Detail
  const detailOpen = ref(false);
  const detailLoading = ref(false);
  const details = ref<BetRecordDetail[]>([]);

  // ==================== Helpers ====================

  const fmtAmount = (v: any) => {
    const n = Number(v);
    return Number.isFinite(n) ? formatNumber(n) : '—';
  };

  // ==================== Table Columns ====================

  const columns = computed<TableColumn<BetRecordItem>[]>(() => [
    {
      accessorKey: 'gameName',
      header: t('betRecord.gameName'),
      meta: { class: { th: 'text-center', td: 'text-center font-medium text-[12px]' } },
    },
    {
      accessorKey: 'betAmount',
      header: t('betRecord.betAmount'),
      meta: { class: { th: 'text-center', td: 'text-center tabular-nums' } },
      cell: ({ row }) => fmtAmount(row.getValue('betAmount')),
    },
    {
      accessorKey: 'betEffective',
      header: t('betRecord.effectiveBet'),
      meta: { class: { th: 'text-center', td: 'text-center tabular-nums text-amber-400' } },
      cell: ({ row }) => fmtAmount(row.getValue('betEffective')),
    },
    {
      accessorKey: 'winLose',
      header: t('betRecord.winLose'),
      meta: { class: { th: 'text-center', td: 'text-center tabular-nums font-medium' } },
      cell: ({ row }) => {
        const v = Number(row.getValue('winLose'));
        const cls = v >= 0 ? 'text-emerald-400' : 'text-rose-400';
        return h('span', { class: cls }, `${v >= 0 ? '+' : ''}${fmtAmount(v)}`);
      },
    },
    {
      accessorKey: 'status',
      header: t('transaction.statusLabel'),
      meta: { class: { th: 'text-center', td: 'text-center' } },
      cell: ({ row }) => {
        const s = STATUS_MAP.value[row.getValue('status') as string] ?? {
          label: row.getValue('status'),
          color: 'neutral' as const,
        };
        return h(UBadge, { color: s.color, variant: 'subtle' }, () => s.label);
      },
    },
    {
      accessorKey: 'betDatetime',
      header: t('betRecord.betTime'),
      meta: {
        class: { th: 'text-center', td: 'text-center text-white/50 text-[12px] tabular-nums' },
      },
      cell: ({ row }) => formatDateTime(row.getValue('betDatetime') as string),
    },
  ]);

  // ==================== Fetch ====================

  const fetchRecords = async () => {
    loading.value = true;
    try {
      const params: Record<string, any> = {
        page: pagination.page,
        pageSize: pagination.pageSize,
      };
      if (statusFilter.value) params.status = statusFilter.value;

      const resp = await useApi().getBetRecords(params);
      if (resp?.code === 200 && resp.result) {
        records.value = resp.result.items || [];
        summary.value = {
          totalBetCount: resp.result.totalBetCount,
          betAmount: resp.result.betAmount,
          betEffective: resp.result.betEffective,
          winLose: resp.result.winLose,
        };
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

  const onStatusChange = () => {
    pagination.page = 1;
    fetchRecords();
  };

  const onPageChange = (page: number) => {
    pagination.page = page;
    fetchRecords();
  };

  const onRowSelect = async (_e: Event, row: { original: BetRecordItem }) => {
    detailOpen.value = true;
    detailLoading.value = true;
    details.value = [];
    try {
      const resp = await useApi().getBetRecordDetails(row.original.id);
      if (resp?.code === 200 && resp.result) {
        details.value = resp.result;
      }
    } catch {
    } finally {
      detailLoading.value = false;
    }
  };

  onMounted(() => {
    fetchRecords();
  });
</script>
