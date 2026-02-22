<template>
  <div class="w-full space-y-4">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <div
          class="size-7 sm:size-8 rounded-[8px] sm:rounded-[10px] bg-emerald-500/15 ring-1 ring-emerald-500/25 flex items-center justify-center">
          <Icon name="i-lucide-arrow-down-to-line" class="size-3.5 sm:size-4 text-emerald-400" />
        </div>
        <div class="text-[16px] sm:text-[18px] font-bold text-white">
          {{ $t('transaction.depositRecord') }}
        </div>
      </div>
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
              class="w-full h-[34px] sm:h-[36px] rounded-[10px] bg-slate-800 ring-1 ring-white/10 text-white text-[12px] sm:text-[13px] pl-8 pr-2 outline-none focus:ring-emerald-500/50 transition-shadow scheme-dark"
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
              class="w-full h-[34px] sm:h-[36px] rounded-[10px] bg-slate-800 ring-1 ring-white/10 text-white text-[12px] sm:text-[13px] pl-8 pr-2 outline-none focus:ring-emerald-500/50 transition-shadow scheme-dark"
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
      <!-- 手機版：卡片展開 -->
      <div class="sm:hidden space-y-2">
        <div
          v-for="item in orders"
          :key="item.subOrder"
          class="rounded-[10px] bg-white/4 ring-1 ring-white/8 overflow-hidden">
          <button
            class="w-full flex items-center justify-between p-3 text-left cursor-pointer"
            @click="mobileExpandedId = mobileExpandedId === item.subOrder ? null : item.subOrder">
            <div class="min-w-0">
              <div class="text-[13px] font-medium text-white truncate font-mono">
                {{ item.subOrder }}
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <UBadge
                :color="(STATUS_MAP[item.status as string] ?? { color: 'neutral' as const }).color"
                variant="subtle"
                size="xs">
                {{ (STATUS_MAP[item.status as string] ?? { label: item.status }).label }}
              </UBadge>
              <Icon
                name="i-lucide-chevron-down"
                class="size-4 text-white/40 transition-transform duration-200"
                :class="mobileExpandedId === item.subOrder ? 'rotate-180' : ''" />
            </div>
          </button>
          <div
            v-show="mobileExpandedId === item.subOrder"
            class="border-t border-white/6 p-3 space-y-2">
            <div class="flex justify-between text-[12px]">
              <span class="text-white/40">{{ $t('transaction.paymentMethod') }}</span>
              <span class="text-white/80">{{
                PAYMENT_METHOD_MAP[item.paymentMethod] || item.paymentMethod
              }}</span>
            </div>
            <div class="flex justify-between text-[12px]">
              <span class="text-white/40">{{ $t('transaction.currency') }}</span>
              <span class="text-white/80 font-semibold">{{ item.currency }}</span>
            </div>
            <div class="flex justify-between text-[12px]">
              <span class="text-white/40">{{ $t('transaction.orderAmount') }}</span>
              <span class="text-white/80 tabular-nums">{{ formatAmount(item.orderAmount) }}</span>
            </div>
            <div class="flex justify-between text-[12px]">
              <span class="text-white/40">{{ $t('transaction.payAmount') }}</span>
              <span class="text-white/80 tabular-nums">{{ formatAmount(item.payAmount) }}</span>
            </div>
            <div class="flex justify-between text-[12px]">
              <span class="text-white/40">USD</span>
              <span class="text-amber-400 font-medium tabular-nums">{{
                formatAmount(item.usdAmount)
              }}</span>
            </div>
            <div class="flex justify-between text-[12px]">
              <span class="text-white/40">{{ $t('transaction.createdAt') }}</span>
              <span class="text-white/50 tabular-nums">{{ formatDate(item.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 桌面版：UTable -->
      <div class="hidden sm:block rounded-[12px] ring-1 ring-white/6">
        <UTable
          :data="orders"
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
    { label: t('transaction.allStatus'), value: 'all' },
    { label: t('transaction.status.pending'), value: 'pending' },
    { label: t('transaction.status.created'), value: 'created' },
    { label: t('transaction.status.paid'), value: 'paid' },
    { label: t('transaction.status.failed'), value: 'failed' },
  ]);

  // ==================== State ====================

  const orders = ref<DepositOrder[]>([]);
  const loading = ref(false);
  const statusFilter = ref('all');
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 30);
  const startDate = ref(sevenDaysAgo.toISOString().slice(0, 10));
  const endDate = ref(today.toISOString().slice(0, 10));
  const mobileExpandedId = ref<string | null>(null);
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
      if (statusFilter.value && statusFilter.value !== 'all') params.status = statusFilter.value;
      if (startDate.value) params.startDate = startDate.value;
      if (endDate.value) params.endDate = endDate.value;

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

  const onDateChange = () => {
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
