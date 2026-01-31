<template>
  <UModal
    v-model:open="open"
    close-icon="i-lucide-arrow-right"
    :ui="{
      overlay: 'bg-black/55 backdrop-blur-sm',
      content:
        'bg-[#0b1720]/85 ring-1 ring-white/10 backdrop-blur-xl rounded-3xl shadow-[0_30px_90px_-50px_rgba(0,0,0,0.9)]',
      header: 'px-5 py-4 border-b border-white/10',
      body: 'px-5 py-5',
    }">
    <template #header>
      <div class="flex items-start justify-between gap-3 w-full">
        <div class="flex items-center gap-3">
          <div
            class="grid place-items-center size-10 rounded-2xl bg-linear-to-br from-emerald-400/20 via-cyan-400/10 to-indigo-400/20 ring-1 ring-white/10 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.7)]">
            <Icon name="i-lucide-languages" class="text-emerald-300/90 text-[18px]" />
          </div>
          <div class="space-y-1">
            <div class="text-[18px] font-semibold tracking-tight">根據你喜好的語言來顯示</div>
            <div class="flex items-center gap-2 text-sm text-white/60">
              <UBadge
                size="sm"
                color="neutral"
                variant="soft"
                class="rounded-full ring-1 ring-white/10">
                <span class="mr-1">目前：</span>
                <span class="font-medium text-white/80">{{ locale }}</span>
              </UBadge>
              <span class="hidden sm:inline">｜快捷鍵：</span>
              <div class="flex items-center gap-1">
                <UKbd>Shift</UKbd>
                <span class="text-white/40">+</span>
                <UKbd>L</UKbd>
              </div>
            </div>
          </div>
        </div>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-x"
          class="rounded-xl"
          @click="open = false" />
      </div>
    </template>
    <UButton
      :label="i18n.t('locale')"
      color="neutral"
      variant="soft"
      :icon="getLocaleIcon(i18n.locale.value)"
      class="w-full justify-center rounded-2xl ring-1 ring-white/10 bg-white/5 hover:bg-white/8 transition shadow-[0_18px_40px_-28px_rgba(0,0,0,0.8)] active:scale-[0.99]"
      @click="open = true" />
    <template #body>
      <div class="space-y-4">
        <div
          class="rounded-2xl px-4 py-3 text-sm text-white/60 bg-white/5 ring-1 ring-white/10 backdrop-blur">
          切換語言後，介面會立即套用。若你有多語系內容，可在此快速切換。
        </div>
        <URadioGroup
          v-model="locale"
          :items="items"
          indicator="end"
          variant="card"
          :ui="{
            root: 'space-y-3',
            item: [
              'group relative overflow-hidden items-center rounded-2xl ring-1 ring-white/10',
              'bg-white/5 hover:bg-white/7 transition-all duration-200',
              'hover:-translate-y-[1px] hover:shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)]',
              'active:scale-[0.99]',
              'data-[state=checked]:bg-emerald-400/10 data-[state=checked]:ring-emerald-300/25',
            ].join(' '),
            label: 'w-full',
            indicator:
              'text-emerald-300/90 size-5 transition-transform duration-200 group-data-[state=checked]:scale-110',
          }">
          <template #label="{ item }">
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-3">
                <div
                  class="grid place-items-center size-9 rounded-xl bg-white/6 ring-1 ring-white/10 group-data-[state=checked]:bg-emerald-400/15 group-data-[state=checked]:ring-emerald-300/25 transition">
                  <Icon :name="item.icon" class="text-[18px] text-white/80" />
                </div>
                <div class="leading-tight">
                  <div class="text-[16px] font-semibold text-white/90">
                    {{ item.label }}
                  </div>
                  <div class="text-[12px] text-white/50">
                    {{ item.value }}
                  </div>
                </div>
              </div>
              <UBadge
                v-if="item.value === locale"
                size="xs"
                color="primary"
                variant="soft"
                class="rounded-full ring-1 ring-white/10">
                使用中
              </UBadge>
            </div>
          </template>
        </URadioGroup>
        <div class="flex justify-end gap-2 pt-2">
          <UButton
            color="neutral"
            variant="ghost"
            class="rounded-xl"
            icon="i-lucide-undo-2"
            @click="resetToCurrentLocale">
            還原
          </UButton>
          <UButton
            color="primary"
            variant="solid"
            class="rounded-xl shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)]"
            icon="i-lucide-check"
            @click="open = false">
            完成
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
  import type { RadioGroupItem } from '@nuxt/ui';

  const i18n = useI18n();
  const toast = useToast();

  const open = ref(false);
  const locale = ref(i18n.locale.value);
  const resetLocale: Ref = ref('');

  const getLocaleIcon = (locale: string) => {
    const [_lang, region] = locale.split('-');
    const flag = region?.toLowerCase();
    return `circle-flags:${flag}`;
  };

  type LocaleRadioItem = Omit<RadioGroupItem, 'value'> & {
    value: (typeof i18n.locales.value)[number]['code'];
    icon: string;
    label: string;
  };

  const items = computed<LocaleRadioItem[]>(() => {
    return i18n.locales.value.map((l: any) => ({
      label: l.name,
      value: l.code,
      icon: getLocaleIcon(String(l.code)),
    }));
  });

  watch(locale, (newValue, oldValue) => {
    i18n.setLocale(newValue);
    resetLocale.value = oldValue;
    toast.add({
      title: '語言已切換',
      description: `已切換至 ${newValue}`,
      icon: 'i-lucide-languages',
      color: 'primary',
    });
  });

  const resetToCurrentLocale = () => {
    locale.value = resetLocale.value;
  };

  defineShortcuts({ shift_l: () => (open.value = !open.value) });
</script>
