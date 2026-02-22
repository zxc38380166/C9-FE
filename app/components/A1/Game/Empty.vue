<template>
  <div
    class="relative overflow-hidden rounded-[16px] bg-slate-900/55 ring-1 ring-white/10 backdrop-blur shadow-[0_14px_50px_-26px_rgba(0,0,0,0.65)]">
    <UEmpty
      :title="title"
      :description="description"
      variant="naked"
      :ui="{
        root: 'relative px-4 sm:px-6 py-7',
        title: 'text-white font-semibold tracking-wide text-[14px]',
        description: 'text-white/55 text-[12px] mt-1',
        actions: 'mt-4 flex flex-wrap items-center justify-center gap-2',
      }">
      <template #leading>
        <div class="flex flex-col items-center">
          <UAvatarGroup
            v-if="leadingAvatars?.length && leadingAvatars.some((a) => a?.src)"
            size="xl"
            :ui="{ root: 'justify-center' }">
            <UAvatar
              v-for="(a, idx) in leadingAvatars.slice(0, 3)"
              :key="idx"
              :ui="avatarUi"
              :src="a.src"
              :alt="a.alt || 'game'" />
          </UAvatarGroup>
          <div
            v-else
            class="mt-1 grid place-items-center h-14 w-14 rounded-2xl bg-slate-900/60 ring-1 ring-white/10 shadow-[0_12px_40px_-26px_rgba(0,0,0,0.8)]">
            <span :class="[leadingIcon]" class="text-[28px] text-white/85" />
          </div>
          <div class="mt-3 text-white/45 text-[12px] tracking-wide">
            {{ hint }}
          </div>
        </div>
      </template>
      <template #footer>
        <USeparator class="my-4 opacity-60" />
        <div class="grid grid-cols-2 gap-3 sm:gap-4">
          <UPageCard
            v-for="(item, index) in quickEntries"
            :key="index"
            :to="item.to"
            :target="item.target"
            :ui="{
              root: 'group transition-transform duration-200 hover:-translate-y-0.5',
              container:
                'relative overflow-hidden rounded-[8px] bg-slate-900/55 ring-1 ring-white/10 backdrop-blur ' +
                'shadow-[0_14px_50px_-28px_rgba(0,0,0,0.65)] sm:p-4 p-3',
            }">
            <div
              class="pointer-events-none absolute inset-0 opacity-[0.22] bg-linear-to-r from-transparent via-white/12 to-transparent -translate-x-[60%] group-hover:translate-x-[60%] transition-transform duration-700" />
            <div class="relative flex items-center gap-3">
              <div
                class="h-10 w-10 rounded-[8px] bg-slate-900/60 ring-1 ring-white/10 grid place-items-center">
                <Icon :name="item.icon" />
              </div>
              <div class="min-w-0">
                <div class="text-white/90 text-[13px] font-semibold tracking-wide truncate">
                  {{ item.title }}
                </div>
                <div class="text-white/50 text-[12px] truncate">
                  {{ item.desc }}
                </div>
              </div>
            </div>
            <div class="pointer-events-none absolute inset-0 rounded-[8px] ring-1 ring-white/6" />
            <div
              class="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/6 blur-2xl"
              :class="index % 2 === 0 ? 'opacity-100' : 'opacity-60'" />
          </UPageCard>
        </div>
      </template>
    </UEmpty>
  </div>
</template>
<script setup lang="ts">
  type QuickEntry = {
    title: string;
    desc: string;
    icon: string;
    to?: string;
    target?: string;
  };

  type LeadingAvatar = { src: string; alt?: string };

  const {
    title = '目前沒有可顯示的遊戲',
    description = '可能是尚未載入完成、條件篩選太嚴格，或該分類暫無內容。',
    hint = '試試切換分類、調整關鍵字，或返回遊戲大廳',
    leadingIcon = 'i-material-symbols:joystick',
    leadingAvatars,
    quickEntries: quickEntriesProp,
  } = defineProps<{
    title?: string;
    description?: string;
    hint?: string;
    /** 沒有 avatar 時顯示的 icon */
    leadingIcon?: string;
    /** 你想放 2~3 個小圖（例如：類別 icon / provider logo） */
    leadingAvatars?: LeadingAvatar[];
    /** Footer 快速入口卡片 */
    quickEntries?: QuickEntry[];
  }>();

  const avatarUi = {
    root: 'ring-1 ring-white/10 bg-slate-900/60 backdrop-blur',
    image: 'opacity-95',
  };

  // 預設 quick entries（如果你沒傳）
  const defaultQuickEntries: QuickEntry[] = [
    {
      title: '投注紀錄',
      desc: '查看您的歷史紀錄',
      icon: 'streamline-color:desktop-game',
      to: '#',
    },
    {
      title: '聯絡客服',
      desc: '取得內容或維護資訊',
      icon: 'streamline-color:online-medical-call-service-flat',
      to: '#',
    },
  ];

  const quickEntries = computed<QuickEntry[]>(() =>
    quickEntriesProp?.length ? quickEntriesProp : defaultQuickEntries,
  );
</script>
