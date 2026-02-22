<template>
  <div class="w-full space-y-4">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <div
          class="size-7 sm:size-8 rounded-[8px] sm:rounded-[10px] bg-emerald-500/15 ring-1 ring-emerald-500/25 flex items-center justify-center">
          <Icon name="i-lucide-arrow-down-to-line" class="size-3.5 sm:size-4 text-emerald-400" />
        </div>
        <div class="text-[16px] sm:text-[18px] font-bold text-white">{{ $t('transaction.depositRecord') }}</div>
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
          @click="fetchOrders" />
      </div>
    </div>

    <div class="h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

    <!-- Loading -->
    <template v-if="loading && !orders.length">
      <div class="flex flex-col items-center justify-center py-16 space-y-3">
        <div
          class="size-12 rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20 flex items-center justify-center">
          <Icon name="i-lucide-loader-2" class="size-6 text-emerald-400 animate-spin" />
        </div>
        <div class="text-[13px] text-white/40">{{ $t('common.loading') }}</div>
      </div>
    </template>

    <!-- Empty -->
    <template v-else-if="!orders.length">
      <div class="flex flex-col items-center justify-center py-16 space-y-4">
        <div
          class="size-16 rounded-full bg-white/5 ring-1 ring-white/8 flex items-center justify-center">
          <Icon name="i-lucide-inbox" class="size-8 text-white/20" />
        </div>
        <div class="text-center">
          <div class="text-[15px] font-medium text-white/50">{{ $t('transaction.noRecord') }}</div>
          <div class="text-[12px] text-white/30 mt-1">{{ $t('transaction.noRecordHint') }}</div>
        </div>
      </div>
    </template>

    <!-- Table -->
    <template v-else>
      <div
        class="-mx-3 sm:mx-0 overflow-x-auto scrollbar-hide sm:rounded-[12px] ring-1 ring-white/6">
        <UTable
          :data="orders"
          :columns="columns"
          :ui="{
            root: 'min-w-[640px]',
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
  import { UBadge } from '#components';

  const { t } = useI18n();

  // ==================== Types ====================

  import type { DepositOrder } from '~/composables/useApiTypes';

  // ==================== Constants ====================

  const STATUS_MAP = computed<
    Record<string, { label: string; color: 'warning' | 'info' | 'success' | 'error' }>
  >(() => ({
    pending: { label: t('transaction.status.pending'), color: 'warning' },
    created: { label: t('transaction.status.created'), color: 'info' },
    paid: { label: t('transaction.status.paid'), color: 'success' },
    failed: { label: t('transaction.status.failed'), color: 'error' },
  }));

  const PAYMENT_METHOD_MAP = computed<Record<string, string>>(() => ({
    fiat: t('deposit.fiat'),
    credit: t('deposit.credit'),
    crypto: t('deposit.crypto'),
  }));

  const statusOptions = computed(() => [
    { label: t('transaction.allStatus'), value: '' },
    { label: t('transaction.status.pending'), value: 'pending' },
    { label: t('transaction.status.created'), value: 'created' },
    { label: t('transaction.status.paid'), value: 'paid' },
    { label: t('transaction.status.failed'), value: 'failed' },
  ]);

  // ==================== State ====================

  const orders = ref<DepositOrder[]>([]);
  const loading = ref(false);
  const statusFilter = ref('');
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  // ==================== Table Columns ====================
  const { formatNumber, formatDateTime } = utsFormat();

  const formatAmount = (v: any) => {
    const n = Number(v);
    return Number.isFinite(n) ? formatNumber(n) : '—';
  };

  const formatDate = (v: string) => (formatDateTime(v) === '-' ? '—' : formatDateTime(v));

  const columns = computed<TableColumn<DepositOrder>[]>(() => [
    {
      accessorKey: 'subOrder',
      header: t('transaction.orderNumber'),
      meta: { class: { th: 'text-center', td: 'text-center font-mono text-[12px] text-white/60' } },
    },
    {
      accessorKey: 'paymentMethod',
      header: t('transaction.paymentMethod'),
      meta: { class: { th: 'text-center', td: 'text-center' } },
      cell: ({ row }) => {
        const method = row.getValue('paymentMethod') as string;
        return h(
          UBadge,
          { variant: 'subtle', color: 'neutral' },
          () => PAYMENT_METHOD_MAP.value[method] || method,
        );
      },
    },
    {
      accessorKey: 'currency',
      header: t('transaction.currency'),
      meta: { class: { th: 'text-center', td: 'text-center font-semibold' } },
    },
    {
      accessorKey: 'orderAmount',
      header: t('transaction.orderAmount'),
      meta: { class: { th: 'text-center', td: 'text-center tabular-nums' } },
      cell: ({ row }) => formatAmount(row.getValue('orderAmount')),
    },
    {
      accessorKey: 'payAmount',
      header: t('transaction.payAmount'),
      meta: { class: { th: 'text-center', td: 'text-center tabular-nums' } },
      cell: ({ row }) => formatAmount(row.getValue('payAmount')),
    },
    {
      accessorKey: 'usdAmount',
      header: 'USD',
      meta: {
        class: { th: 'text-center', td: 'text-center tabular-nums text-amber-400 font-medium' },
      },
      cell: ({ row }) => formatAmount(row.getValue('usdAmount')),
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
      accessorKey: 'createdAt',
      header: t('transaction.createdAt'),
      meta: {
        class: { th: 'text-center', td: 'text-center text-white/50 text-[12px] tabular-nums' },
      },
      cell: ({ row }) => formatDate(row.getValue('createdAt') as string),
    },
  ]);

  // ==================== Fetch ====================

  const fetchOrders = async () => {
    loading.value = true;
    try {
      const params: Record<string, any> = {
        page: pagination.page,
        pageSize: pagination.pageSize,
      };
      if (statusFilter.value) params.status = statusFilter.value;

      const resp = await useApi().getDepositOrders(params);
      if (resp?.code === 200 && resp.result) {
        orders.value = resp.result.items || [];
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
    fetchOrders();
  };

  const onPageChange = (page: number) => {
    pagination.page = page;
    fetchOrders();
  };

  onMounted(() => {
    fetchOrders();
  });
</script>
