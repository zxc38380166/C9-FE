<template>
  <div
    class="relative h-[300px] overflow-hidden rounded-2xl border border-[#829bae]/60 bg-[#0B1E2B]/70 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
    <!-- 背景層次（弧形光暈） -->
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -left-28 -top-28 h-[360px] w-[360px] rounded-full bg-white/8 blur-2xl" />
      <div
        class="absolute -right-28 -bottom-28 h-[380px] w-[380px] rounded-full bg-black/35 blur-2xl" />
      <div
        class="absolute inset-0"
        style="
          background:
            radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.06), transparent 55%),
            radial-gradient(circle at 70% 85%, rgba(0, 0, 0, 0.45), transparent 55%);
        " />
    </div>

    <!-- Header -->
    <div class="relative flex items-start justify-between">
      <div class="min-w-0">
        <div class="flex items-center gap-3">
          <!-- Avatar -->
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 shadow-[0_10px_25px_rgba(0,0,0,0.25)]">
            <i class="mdi mdi-account text-[22px]" />
          </div>

          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <div class="truncate text-[22px] font-extrabold text-white">
                {{ store?.getUserDetail?.name || '—' }}
              </div>

              <span
                class="shrink-0 inline-flex items-center rounded-full border border-[#829bae]/40 bg-white/5 px-2 py-0.5 text-[12px] font-bold text-white/70">
                ID: {{ userIdText }}
              </span>
            </div>

            <div class="mt-1 flex items-center gap-2 text-[13px] text-white/60">
              <i class="mdi mdi-shield-check-outline text-[16px]" />
              <span>已登录</span>
              <span class="h-1 w-1 rounded-full bg-white/25" />
              <span>VIP 资料</span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition"
        @click="toggleFav">
        <i
          :class="isFav ? 'mdi mdi-star text-[#D6B06A]' : 'mdi mdi-star-outline'"
          class="text-[22px]" />
        <span
          v-if="isFav"
          class="pointer-events-none absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#D6B06A] shadow-[0_0_0_3px_rgba(11,30,43,0.9)]" />
      </button>
    </div>

    <!-- 分隔線 -->
    <div
      class="relative my-5 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

    <!-- VIP Progress -->
    <div class="relative">
      <div class="flex items-center justify-between">
        <button type="button" class="flex items-center gap-2 text-[16px] font-extrabold text-white">
          <span>您的 VIP 进度</span>
          <i class="mdi mdi-chevron-right text-[20px] text-white/70"></i>
        </button>

        <div class="flex items-center gap-3">
          <div class="text-[16px] font-extrabold text-white">
            {{ progressText }}
          </div>

          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/80 ring-1 ring-white/10 hover:bg-white/10 transition"
            @click="onInfo">
            <i class="mdi mdi-information-variant text-[16px]" />
          </button>
        </div>
      </div>

      <!-- Progress meta -->
      <div class="mt-2 flex items-center justify-between text-[12px] text-white/55">
        <div class="flex items-center gap-2">
          <i class="mdi mdi-speedometer text-[16px]" />
          <span>本月累计</span>
          <span class="text-white/70 font-semibold">{{ progressValueText }}</span>
        </div>
        <div class="flex items-center gap-2">
          <i class="mdi mdi-flag-checkered text-[16px]" />
          <span>目标</span>
          <span class="text-white/70 font-semibold">100%</span>
        </div>
      </div>

      <!-- Progress bar (美化：外框 + 內部漸層 + 高光) -->
      <div class="mt-4">
        <div
          class="relative h-[14px] w-full overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
          <div
            class="h-full rounded-full transition-[width] duration-300"
            :style="{
              width: `${progressClamped}%`,
              background: 'linear-gradient(90deg, rgba(59,130,246,0.75), rgba(214,176,106,0.85))',
            }" />
          <div
            class="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 to-transparent" />
        </div>

        <div class="mt-3 flex items-center justify-between">
          <!-- Left level -->
          <div class="flex items-center gap-2 text-white/85">
            <span
              class="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
              <i class="mdi mdi-star-outline text-[16px] text-white/35"></i>
            </span>
            <div class="text-[13px] font-extrabold">暂无级别</div>
          </div>

          <!-- Right level -->
          <div class="flex items-center gap-2 text-white/85">
            <span
              class="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
              <i class="mdi mdi-star text-[16px] text-[#D6B06A]"></i>
            </span>
            <div class="text-[13px] font-extrabold">青铜</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const store = useStore();

  const isFav = ref(false);

  const toggleFav = () => {
    isFav.value = !isFav.value;
  };

  const onInfo = () => {
    // 你可改成打開 Tooltip / Dialog
    console.log('[UserCard] info');
  };

  // 你可以改成 store 裡的值，例如 store.vipProgress
  const progress = computed(() => Number(store?.getUserDetail?.vipProgress ?? 0));

  const progressClamped = computed(() => {
    const n = Number(progress.value);
    if (!Number.isFinite(n)) return 0;
    return Math.min(100, Math.max(0, n));
  });

  const progressText = computed(() => `${progressClamped.value.toFixed(2)}%`);
  const progressValueText = computed(() => `${progressClamped.value.toFixed(2)}%`);

  // 下面三個只是示意，你可替換成 store 實際欄位
  const userIdText = computed(() => String(store?.getUserDetail?.id ?? '--'));
  const balanceText = computed(() => String(store?.getUserDetail?.balance ?? '--'));
  const rebateText = computed(() => String(store?.getUserDetail?.rebate ?? '--'));
  const pointsText = computed(() => String(store?.getUserDetail?.points ?? '--'));
</script>
