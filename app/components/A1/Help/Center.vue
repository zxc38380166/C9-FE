<template>
  <div class="space-y-5 sm:space-y-8">
    <!-- 頁面標題 -->
    <div class="flex items-center gap-3 rounded-2xl bg-[#131f30] ring-1 ring-white/8 px-5 py-4 sm:px-6 sm:py-5">
      <div
        class="size-10 sm:size-12 rounded-xl bg-linear-to-br from-emerald-500/20 to-emerald-700/10 ring-1 ring-emerald-500/30 flex items-center justify-center">
        <Icon name="noto:books" class="text-[20px] sm:text-[24px]" />
      </div>
      <div>
        <span class="text-[16px] sm:text-[20px] font-bold text-white">{{ $t('help.title') }}</span>
        <p class="text-[11px] sm:text-[12px] text-white/40">{{ site }} Help Center</p>
      </div>
    </div>

    <!-- 主體：左側導航 + 右側內容 -->
    <div class="flex flex-col lg:flex-row gap-5 sm:gap-6">
      <!-- 左側固定導航 (桌面版) -->
      <nav class="hidden lg:block lg:w-52 shrink-0">
        <div class="lg:sticky lg:top-20 rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-2.5 space-y-0.5">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer text-left"
            :class="
              activeTab === tab.key
                ? 'bg-emerald-500/12 text-emerald-400 ring-1 ring-emerald-500/25'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            "
            @click="switchTab(tab.key)">
            <Icon :name="tab.icon" class="size-4 shrink-0" />
            {{ $t(tab.label) }}
          </button>
        </div>
      </nav>

      <!-- 手機版導航 (橫向捲動) -->
      <div class="lg:hidden">
        <div
          class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide rounded-xl bg-[#131f30] ring-1 ring-white/8 p-2.5">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] sm:text-[13px] font-medium whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0"
            :class="
              activeTab === tab.key
                ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            "
            @click="switchTab(tab.key)">
            <Icon :name="tab.icon" class="size-3.5 shrink-0" />
            {{ $t(tab.label) }}
          </button>
        </div>
      </div>

      <!-- 右側內容 -->
      <div class="flex-1 min-w-0 space-y-5 sm:space-y-6">
        <!-- gambling -->
        <div v-if="activeTab === 'gambling'" class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-8">
          <SectionTitle :icon="'i-lucide-alert-triangle'" :color="'amber'">
            {{ $t('help.gambling.title') }}
          </SectionTitle>
          <Intro>{{ $t('help.gambling.intro') }}</Intro>
          <ContentBlock
            v-for="i in 5"
            :key="i"
            :title="$t(`help.gambling.s${i}.title`)"
            :content="$t(`help.gambling.s${i}.content`)" />
        </div>

        <!-- fair -->
        <div v-if="activeTab === 'fair'" class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-8">
          <SectionTitle :icon="'i-lucide-scale'" :color="'emerald'">
            {{ $t('help.fair.title', { site }) }}
          </SectionTitle>
          <Intro>{{ $t('help.fair.intro', { site }) }}</Intro>
          <ContentBlock
            v-for="i in 4"
            :key="i"
            :title="$t(`help.fair.s${i}.title`)"
            :content="$t(`help.fair.s${i}.content`, { site })" />
        </div>

        <!-- privacy -->
        <div v-if="activeTab === 'privacy'" class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-8">
          <SectionTitle :icon="'i-lucide-shield'" :color="'blue'">
            {{ $t('help.privacy.title') }}
          </SectionTitle>
          <ContentBlock
            v-for="i in 8"
            :key="i"
            :title="$t(`help.privacy.s${i}.title`)"
            :content="$t(`help.privacy.s${i}.content`, { site })" />
        </div>

        <!-- aboutUs -->
        <template v-if="activeTab === 'aboutUs'">
          <div class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-8">
            <SectionTitle :icon="'i-lucide-info'" :color="'emerald'">
              {{ $t('help.about.title') }}
            </SectionTitle>
            <div class="mt-4 mb-6 text-center">
              <div class="text-[20px] sm:text-[24px] font-bold text-white/90 tracking-widest">
                {{ $t('help.about.slogan') }}
              </div>
            </div>
            <Intro>{{ $t('help.about.intro', { site }) }}</Intro>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div
              v-for="i in 4"
              :key="i"
              class="rounded-xl bg-[#131f30] ring-1 ring-white/8 p-4 sm:p-5 text-[13px] sm:text-[14px] text-white/65 leading-relaxed">
              {{ $t(`help.about.s${i}`, { site }) }}
            </div>
          </div>
          <div class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-8">
            <ContentBlock
              :title="$t('help.about.vision.title')"
              :content="$t('help.about.vision.content', { site })" />
          </div>
        </template>

        <!-- terms -->
        <div v-if="activeTab === 'terms'" class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-8">
          <SectionTitle :icon="'i-lucide-file-text'" :color="'rose'">
            {{ $t('help.terms.title') }}
          </SectionTitle>
          <Intro>{{ $t('help.terms.intro', { site }) }}</Intro>
          <ContentBlock
            v-for="i in 11"
            :key="i"
            :title="$t(`help.terms.s${i}.title`)"
            :content="$t(`help.terms.s${i}.content`, { site })" />
        </div>

        <!-- faq -->
        <div v-if="activeTab === 'faq'" class="space-y-3 sm:space-y-4">
          <div class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-8">
            <SectionTitle :icon="'i-lucide-circle-help'" :color="'amber'">
              {{ $t('help.faq.title') }}
            </SectionTitle>
          </div>
          <div class="space-y-2.5">
            <div
              v-for="i in 7"
              :key="i"
              class="rounded-xl bg-[#131f30] ring-1 ring-white/8 overflow-hidden">
              <button
                class="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 sm:py-4 text-left cursor-pointer hover:bg-white/3 transition-colors"
                @click="toggleFaq(i)">
                <span class="text-[13px] sm:text-[15px] font-semibold text-white/85">
                  Q{{ i }}. {{ $t(`help.faq.q${i}`) }}
                </span>
                <Icon
                  name="i-lucide-chevron-down"
                  class="size-4 text-white/30 shrink-0 transition-transform duration-200"
                  :class="{ 'rotate-180': openFaq === i }" />
              </button>
              <div
                v-show="openFaq === i"
                class="px-4 sm:px-5 pb-4 text-[13px] sm:text-[14px] text-white/55 leading-relaxed border-t border-white/5 pt-3">
                {{ $t(`help.faq.a${i}`) }}
              </div>
            </div>
          </div>
        </div>

        <!-- disclaimer -->
        <template v-if="activeTab === 'disclaimer'">
          <div class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-8">
            <SectionTitle :icon="'i-lucide-heart-handshake'" :color="'rose'">
              {{ $t('help.disclaimer.title') }}
            </SectionTitle>
            <Intro>{{ $t('help.disclaimer.intro') }}</Intro>
            <ContentBlock
              :title="$t('help.disclaimer.s1.title')"
              :content="$t('help.disclaimer.s1.content')" />
          </div>
          <div class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-8">
            <h3 class="text-[15px] sm:text-[17px] font-bold text-white/90 mb-3">
              {{ $t('help.disclaimer.s2.title', { site }) }}
            </h3>
            <ul class="space-y-2.5">
              <li
                v-for="(item, idx) in disclaimerItems"
                :key="idx"
                class="flex gap-2.5 text-[13px] sm:text-[14px] text-white/60 leading-relaxed">
                <Icon
                  name="i-lucide-check-circle"
                  class="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
          <div class="rounded-2xl bg-[#131f30] ring-1 ring-white/8 p-5 sm:p-8">
            <ContentBlock
              :title="$t('help.disclaimer.s3.title')"
              :content="$t('help.disclaimer.s3.content')" />
            <ContentBlock
              :title="$t('help.disclaimer.s4.title')"
              :content="$t('help.disclaimer.s4.content')" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();

  const site = 'C9';

  const tabs = [
    { key: 'aboutUs', label: 'help.about.nav', icon: 'i-lucide-info' },
    { key: 'fair', label: 'help.fair.nav', icon: 'i-lucide-scale' },
    { key: 'terms', label: 'help.terms.nav', icon: 'i-lucide-file-text' },
    { key: 'privacy', label: 'help.privacy.nav', icon: 'i-lucide-shield' },
    { key: 'faq', label: 'help.faq.nav', icon: 'i-lucide-circle-help' },
    { key: 'gambling', label: 'help.gambling.nav', icon: 'i-lucide-alert-triangle' },
    { key: 'disclaimer', label: 'help.disclaimer.nav', icon: 'i-lucide-heart-handshake' },
  ];

  const validKeys = new Set(tabs.map((t) => t.key));
  const activeTab = ref('aboutUs');
  const openFaq = ref<number | null>(null);

  const disclaimerItems = computed(() => {
    const items = t('help.disclaimer.s2.items');
    return Array.isArray(items) ? items : [];
  });

  const switchTab = (key: string) => {
    activeTab.value = key;
    router.replace({ query: { type: key } });
  };

  const toggleFaq = (i: number) => {
    openFaq.value = openFaq.value === i ? null : i;
  };

  // Sync tab from query
  watch(
    () => route.query.type,
    (type) => {
      const key = Array.isArray(type) ? type[0] : type;
      if (typeof key === 'string' && validKeys.has(key)) {
        activeTab.value = key;
      }
    },
    { immediate: true },
  );

  // ---- Sub-components ----
  const SectionTitle = defineComponent({
    props: { icon: String, color: String },
    setup(props, { slots }) {
      const colorClass: Record<string, string> = {
        emerald: 'bg-emerald-500/15 ring-emerald-500/25 text-emerald-400',
        amber: 'bg-amber-500/15 ring-amber-500/25 text-amber-400',
        blue: 'bg-blue-500/15 ring-blue-500/25 text-blue-400',
        rose: 'bg-rose-500/15 ring-rose-500/25 text-rose-400',
      };
      return () =>
        h('div', { class: 'flex items-center gap-3 mb-5' }, [
          h(
            'div',
            {
              class: `size-9 sm:size-10 rounded-xl ring-1 flex items-center justify-center ${colorClass[props.color || 'emerald']}`,
            },
            [h(resolveComponent('Icon'), { name: props.icon, class: 'size-4 sm:size-5' })],
          ),
          h('h2', { class: 'text-[18px] sm:text-[22px] font-bold text-white' }, slots.default?.()),
        ]);
    },
  });

  const Intro = defineComponent({
    setup(_, { slots }) {
      return () =>
        h(
          'p',
          { class: 'text-[13px] sm:text-[15px] text-white/60 leading-relaxed mb-5 pl-0.5' },
          slots.default?.(),
        );
    },
  });

  const ContentBlock = defineComponent({
    props: { title: String, content: String },
    setup(props) {
      return () =>
        h('div', { class: 'mb-5 last:mb-0' }, [
          h(
            'h3',
            {
              class:
                'text-[14px] sm:text-[16px] font-bold text-white/85 mb-2 flex items-center gap-2',
            },
            [h('span', { class: 'size-1.5 rounded-full bg-emerald-400 shrink-0' }), props.title],
          ),
          h(
            'div',
            {
              class:
                'text-[13px] sm:text-[14px] text-white/55 leading-relaxed whitespace-pre-line pl-3.5',
            },
            props.content,
          ),
        ]);
    },
  });
</script>
