<template>
  <div
    class="rounded-[12px] sm:rounded-[16px] bg-[#131f30] ring-1 ring-white/8 p-3 sm:p-5 space-y-4 sm:space-y-5">
    <!-- 頁面標題 -->
    <div class="flex items-center gap-2.5 sm:gap-3">
      <div
        class="size-8 sm:size-10 rounded-[10px] sm:rounded-[12px] bg-linear-to-br from-cyan-500/20 to-cyan-700/10 ring-1 ring-cyan-500/30 flex items-center justify-center">
        <Icon name="i-lucide-dices" class="size-4 sm:size-5 text-cyan-400" />
      </div>
      <div>
        <div class="text-[18px] sm:text-[22px] font-bold text-white tracking-wide">
          {{ $t('betRecord.title') }}
        </div>
        <div class="text-[11px] sm:text-[12px] text-white/40">{{ $t('betRecord.subtitle') }}</div>
      </div>
    </div>

    <div class="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

    <!-- Filter bar -->
    <div class="flex flex-col gap-3">
      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
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
        <div class="flex items-center gap-2 flex-1">
          <div class="relative flex-1 sm:flex-none sm:w-40">
            <Icon
              name="i-lucide-calendar"
              class="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-white/40 pointer-events-none z-1" />
            <input
              v-model="startDate"
              type="date"
              class="w-full h-[34px] sm:h-[36px] rounded-[10px] bg-slate-800 ring-1 ring-white/10 text-white text-[12px] sm:text-[13px] pl-8 pr-2 outline-none focus:ring-cyan-500/50 transition-shadow scheme-dark"
              :placeholder="$t('common.startDate')"
              @change="onDateChange" />
          </div>
          <span class="text-white/30 text-[12px]">~</span>
          <div class="relative flex-1 sm:flex-none sm:w-40">
            <Icon
              name="i-lucide-calendar"
              class="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-white/40 pointer-events-none z-1" />
            <input
              v-model="endDate"
              type="date"
              class="w-full h-[34px] sm:h-[36px] rounded-[10px] bg-slate-800 ring-1 ring-white/10 text-white text-[12px] sm:text-[13px] pl-8 pr-2 outline-none focus:ring-cyan-500/50 transition-shadow scheme-dark"
              :placeholder="$t('common.endDate')"
              @change="onDateChange" />
          </div>
        </div>
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

    <!-- Summary cards -->
    <div v-if="summary" class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      <div class="rounded-[10px] bg-white/4 ring-1 ring-white/8 p-3 space-y-1">
        <div class="text-[11px] text-white/40">{{ $t('betRecord.totalBets') }}</div>
        <div class="text-[16px] font-bold text-white tabular-nums">{{ summary.totalBetCount }}</div>
      </div>
      <div class="rounded-[10px] bg-white/4 ring-1 ring-white/8 p-3 space-y-1">
        <div class="text-[11px] text-white/40">{{ $t('betRecord.betAmount') }}</div>
        <div class="text-[16px] font-bold text-white tabular-nums">
          {{ fmtAmount(summary.betAmount) }}
        </div>
      </div>
      <div class="rounded-[10px] bg-white/4 ring-1 ring-white/8 p-3 space-y-1">
        <div class="text-[11px] text-white/40">{{ $t('betRecord.effectiveBet') }}</div>
        <div class="text-[16px] font-bold text-amber-400 tabular-nums">
          {{ fmtAmount(summary.betEffective) }}
        </div>
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
      <!-- 手機版：卡片展開 -->
      <div class="sm:hidden space-y-2">
        <div
          v-for="item in records"
          :key="item.id"
          class="rounded-[10px] bg-white/4 ring-1 ring-white/8 overflow-hidden">
          <button
            class="w-full flex items-center justify-between p-3 text-left cursor-pointer"
            @click="mobileExpandedId = mobileExpandedId === item.id ? null : item.id">
            <div class="flex items-center gap-2 min-w-0">
              <Icon name="i-lucide-gamepad-2" class="size-4 text-cyan-400 shrink-0" />
              <span class="text-[13px] font-medium text-white truncate">{{ item.gameName }}</span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span
                class="text-[13px] font-bold tabular-nums"
                :class="Number(item.winLose) >= 0 ? 'text-emerald-400' : 'text-rose-400'">
                {{ Number(item.winLose) >= 0 ? '+' : '' }}{{ fmtAmount(item.winLose) }}
              </span>
              <Icon
                name="i-lucide-chevron-down"
                class="size-4 text-white/40 transition-transform duration-200"
                :class="mobileExpandedId === item.id ? 'rotate-180' : ''" />
            </div>
          </button>
          <div v-show="mobileExpandedId === item.id" class="border-t border-white/6 p-3 space-y-2">
            <div class="flex justify-between text-[12px]">
              <span class="text-white/40">{{ $t('betRecord.betAmount') }}</span>
              <span class="text-white/80 tabular-nums">{{ fmtAmount(item.betAmount) }}</span>
            </div>
            <div class="flex justify-between text-[12px]">
              <span class="text-white/40">{{ $t('betRecord.effectiveBet') }}</span>
              <span class="text-amber-400 tabular-nums">{{ fmtAmount(item.betEffective) }}</span>
            </div>
            <div class="flex justify-between text-[12px]">
              <span class="text-white/40">{{ $t('transaction.statusLabel') }}</span>
              <UBadge
                :color="(STATUS_MAP[item.status] ?? { color: 'neutral' as const }).color"
                variant="subtle"
                size="xs">
                {{ (STATUS_MAP[item.status] ?? { label: item.status }).label }}
              </UBadge>
            </div>
            <div class="flex justify-between text-[12px]">
              <span class="text-white/40">{{ $t('betRecord.betTime') }}</span>
              <span class="text-white/50 tabular-nums">{{ formatDateTime(item.betDatetime) }}</span>
            </div>
            <button
              class="w-full mt-1 py-1.5 rounded-[8px] bg-cyan-500/10 text-cyan-400 text-[12px] font-medium hover:bg-cyan-500/20 transition-colors cursor-pointer"
              @click="onMobileRowSelect(item)">
              {{ $t('betRecord.detailTitle') }}
            </button>
          </div>
        </div>
      </div>

      <!-- 桌面版：UTable -->
      <div class="hidden sm:block rounded-[12px] ring-1 ring-white/6">
        <UTable
          :data="records"
          :columns="columns"
          :ui="{
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
          {{
            $t('transaction.paginationInfo', {
              total: pagination.total,
              page: pagination.page,
              totalPages: pagination.totalPages,
            })
          }}
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
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-2">
            <Icon name="i-lucide-list" class="size-5 text-cyan-400" />
            <span class="text-[16px] font-bold text-white">{{ $t('betRecord.detailTitle') }}</span>
          </div>
          <button
            class="size-8 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
            @click="detailOpen = false">
            <Icon name="i-lucide-x" class="size-4 text-white/60" />
          </button>
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
              <div class="text-[12px] text-white/40">
                {{ $t('betRecord.round') }} #{{ d.roundNo }}
              </div>
              <div class="text-[11px] text-white/30">{{ formatDateTime(d.createdAt) }}</div>
            </div>
            <div class="text-right space-y-0.5">
              <div class="text-[12px] text-white/60">
                {{ $t('betRecord.betAmount') }}: {{ fmtAmount(d.betAmount) }}
              </div>
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
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 30);
  const startDate = ref(sevenDaysAgo.toISOString().slice(0, 10));
  const endDate = ref(today.toISOString().slice(0, 10));
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  // Mobile expand
  const mobileExpandedId = ref<number | string | null>(null);

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
      if (startDate.value) params.startDate = startDate.value;
      if (endDate.value) params.endDate = endDate.value;

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

  const onDateChange = () => {
    pagination.page = 1;
    fetchRecords();
  };

  const onPageChange = (page: number) => {
    pagination.page = page;
    fetchRecords();
  };

  const fetchDetail = async (id: number | string) => {
    detailOpen.value = true;
    detailLoading.value = true;
    details.value = [];
    try {
      const resp = await useApi().getBetRecordDetails(id);
      if (resp?.code === 200 && resp.result) {
        details.value = resp.result;
      }
    } catch {
    } finally {
      detailLoading.value = false;
    }
  };

  const onRowSelect = async (_e: Event, row: { original: BetRecordItem }) => {
    fetchDetail(row.original.id);
  };

  const onMobileRowSelect = (item: BetRecordItem) => {
    fetchDetail(item.id);
  };

  onMounted(() => {
    fetchRecords();
  });
</script>
