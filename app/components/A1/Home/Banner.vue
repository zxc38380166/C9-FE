<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <section
      class="relative w-full overflow-hidden rounded-2xl bg-[#0b1e2b] px-7 py-8 text-white shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -left-24 -top-24 size-105 rounded-full bg-white/8 blur-[2px]" />
        <div class="absolute left-10 top-10 size-130 rounded-full bg-white/6 blur-[1px]" />
        <div class="absolute -right-40 -bottom-40 size-155 rounded-full bg-black/25 blur-[2px]" />
        <div
          class="absolute inset-0"
          style="
            background: radial-gradient(
                circle at 20% 20%,
                rgba(255, 255, 255, 0.06),
                transparent 55%
              ),
              radial-gradient(circle at 55% 10%, rgba(255, 255, 255, 0.05), transparent 60%),
              radial-gradient(circle at 70% 75%, rgba(0, 0, 0, 0.35), transparent 55%);
          " />
      </div>
      <div class="relative">
        <template v-if="isLogin">
          <h2 class="font-bold text-[30px] -translate-y-3.75">你的 VIP 進度</h2>
          <UCard
            variant="subtle"
            :ui="{
              root: 'border',
              header: 'border-[transparent]',
              body: 'border-[transparent]',
            }">
            <template #header> {{ store.getUserDetail?.account }} </template>
            <div class="pb-2">
              0.00%
              <UTooltip
                :delay-duration="0"
                text="所有已結算的體育與賽馬注單，進度以 3 倍計算。娛樂城注單進度以 1 倍計算，但 C9 遊戲的進度以 2 倍計算。已作廢的注單不列入計算。"
                :content="{ side: 'bottom', align: 'center', sideOffset: 8 }">
                <UButton
                  icon="bi:patch-exclamation-fll"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  aria-label="設定" />
              </UTooltip>
            </div>
            <UProgress
              :ui="{ indicator: 'bg-linear-to-b from-[#77cbac] to-[#1a6b52]' }"
              v-model="vipProgress" />
            <template #footer>
              <div class="flex items-center gap-3">
                下一個等級
                <UBadge class="font-bold rounded-full">青銅</UBadge>
              </div>
            </template>
          </UCard>
        </template>
        <template v-else>
          <h2 class="text-[30px] leading-[1.15] font-extrabold tracking-wide">
            世界上最大的在线赌场和体<br />育博彩
          </h2>
          <button
            type="button"
            class="mt-6 inline-flex items-center justify-center rounded-xl bg-linear-to-b from-[#77cbac] to-[#1a6b52] px-6 py-3 text-sm font-bold shadow-sm hover:brightness-110 active:brightness-95 transition"
            @click="onRegister">
            注册
          </button>
          <div class="mt-8 text-sm font-semibold text-white/70">通过其他方式注册</div>
          <div class="mt-3 flex items-center gap-3">
            <button
              v-for="p in providers"
              :key="p.key"
              type="button"
              class="group flex h-12 w-12 items-center justify-center rounded-xl bg-white/6 shadow-[0_10px_18px_rgba(0,0,0,0.22)] ring-1 ring-white/10 hover:bg-white/10 transition"
              @click="onProvider(p.key)">
              <span
                class="flex h-8 w-8 items-center justify-center rounded-lg"
                :style="{ background: p.bg }">
                <Icon :name="p.icon" size="18" />
              </span>
            </button>
          </div>
        </template>
      </div>
    </section>
    <div v-if="isDesktop" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <button
        v-for="item in items"
        :key="item.key"
        type="button"
        class="group text-left"
        @click="$emit('select', item)">
        <div
          class="relative overflow-hidden h-full rounded-2xl bg-[#253844]/90 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform duration-200 group-hover:-translate-y-0.5">
          <div
            class="pointer-events-none absolute inset-x-0 top-0 z-10 rounded-t-2xl border-2"
            :style="{
              borderColor: item.accentColor,
              height: `${imageHeight}px`,
            }" />
          <div class="relative" :style="{ height: `${imageHeight}px` }">
            <img
              :src="item.imageUrl"
              :alt="item.title"
              class="h-full w-full object-cover object-top" />
            <div
              class="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/35 to-transparent" />
          </div>
          <div class="flex py-3 items-center justify-between px-6">
            <div class="flex items-center gap-3">
              <span class="flex h-8 w-8 items-center justify-center rounded-xl text-white/70">
                <Icon :name="item.icon" class="text-[50px]" />
              </span>
              <div class="text-[16px] font-extrabold tracking-wide text-white">
                {{ item.title }}
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="h-2.5 w-2.5 rounded-full bg-[#38D25E]" />
              <div class="text-[16px] font-extrabold text-white">
                {{ item.count.toLocaleString() }}
              </div>
            </div>
          </div>
          <div
            class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style="
              background: radial-gradient(
                circle at 30% 10%,
                rgba(255, 255, 255, 0.08),
                transparent 45%
              );
            " />
        </div>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { A1ModalRegister } from '#components';

  type CategoryItem = {
    key: string;
    title: string;
    count: number | string;
    icon: string;
    imageUrl: string;
    accentColor: string;
  };

  const {
    items = [
      {
        key: 'casino',
        title: '娱乐城',
        count: 54617,
        icon: 'twemoji:slot-machine',
        imageUrl:
          'https://mediumrare.imgix.net/stake-casino-home-18-jul-25-en.png?w=700&h=460&fit=min&auto=format',
        accentColor: '#3B82F6',
      },
      {
        key: 'sport',
        title: '体育',
        count: 9402,
        icon: 'fluent-color:sport-24',
        imageUrl:
          'https://mediumrare.imgix.net/stake-sports-home-18-jul-25-zh.png?w=350&h=230&fit=min&auto=format',
        accentColor: '#22C55E',
      },
    ],
    imageHeight = 245,
  } = defineProps<{
    items?: CategoryItem[];
    imageHeight?: number;
  }>();

  const store = useStore();
  const overlay = useOverlay();
  const { isLogin } = useAuth();
  const { isDesktop } = useDevice();
  defineEmits<{ (e: 'select', item: CategoryItem): void }>();

  const registerModal = overlay.create(A1ModalRegister, {
    defaultOpen: false,
    destroyOnClose: false,
    props: { showBtn: false },
  });

  const providers = ref([
    { key: 'google', icon: 'simple-icons:google', bg: 'transparent', color: '#fff' },
    { key: 'facebook', icon: 'lineicons:facebook-original', bg: 'transparent', color: '#fff' },
    { icon: 'bi:telegram', bg: 'transparent', color: '#fff' },
  ]);

  const vipProgress = ref(40);
  const onRegister = () => {
    registerModal.open();
  };

  const onProvider = (key: string = '') => {};
</script>
