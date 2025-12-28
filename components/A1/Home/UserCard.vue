<template>
  <div class="border border-[#829bae] h-[200px] rounded-xl p-5 bg-[#0B1E2B]/60">
    <!-- Top: 使用者 + 收藏 -->
    <div class="flex justify-between text-white text-[22px]">
      <div class="font-bold truncate pr-3">
        {{ store.getUserDetail.name }}
      </div>
      <button type="button" class="shrink-0">
        <i class="mdi mdi-star-outline text-[#829bae] text-[24px]"></i>
      </button>
    </div>

    <!-- Middle: VIP progress area -->
    <div class="mt-8">
      <!-- Row: title + % + info -->
      <div class="flex items-center justify-between text-white">
        <button type="button" class="flex items-center gap-2 text-[16px] font-bold">
          <span>您的 VIP 进度</span>
          <i class="mdi mdi-chevron-right text-[20px] text-white/70"></i>
        </button>

        <div class="flex items-center gap-3">
          <div class="text-[16px] font-bold">
            {{ progressText }}
          </div>
          <span class="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
            <i class="mdi mdi-information-variant text-[16px] text-white/80"></i>
          </span>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="mt-4 h-[14px] w-full overflow-hidden rounded-full bg-white/15">
        <div
          class="h-full rounded-full bg-white/30 transition-[width] duration-300"
          :style="{ width: `${progressClamped}%` }" />
      </div>

      <!-- Bottom: level left / right -->
      <div class="mt-2 flex items-center justify-between">
        <div class="flex items-center gap-3 text-white/90">
          <i class="mdi mdi-star-outline text-[16px] text-white/35"></i>
          <div class="text-[14px] font-bold">暂无级别</div>
        </div>

        <div class="flex items-center gap-3 text-white/90">
          <i class="mdi mdi-star-outline text-[16px] text-[#D6B06A]"></i>
          <div class="text-[14px] font-bold">青铜</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  const store = useStore();

  // 你可以改成 store 裡的值，例如 store.vipProgress
  const progress = computed(() => Number(store?.getUserDetail?.vipProgress ?? 0));

  const progressClamped = computed(() => {
    const n = Number(progress.value);
    if (!Number.isFinite(n)) return 0;
    return Math.min(100, Math.max(0, n));
  });

  const progressText = computed(() => `${progressClamped.value.toFixed(2)}%`);
</script>
