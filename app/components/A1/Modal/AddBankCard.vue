<template>
  <UModal :title="$t('bankCard.addTitle')" :ui="{ title: 'text-[20px]' }">
    <template #body>
      <UForm
        ref="formRef"
        class="space-y-4"
        :schema
        :state
        :validate-on="['blur', 'input']"
        @submit="onSubmit">
        <UFormField :label="$t('bankCard.bankCode')" name="bankCode" :ui="{ label: 'text-white/70 mb-1' }">
          <USelectMenu
            v-model="state.bankCode"
            :items="bankOptions"
            searchable
            :search-attributes="['label', 'value']"
            :ui="{
              base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
              content: 'w-full bg-slate-900 ring-1 ring-white/10',
            }"
            icon="i-lucide-landmark"
            :placeholder="$t('bankCard.selectBank')"
            value-key="value" />
        </UFormField>

        <UFormField :label="$t('bankCard.bankAccount')" name="bankAccount" :ui="{ label: 'text-white/70 mb-1' }">
          <UInput
            v-model="state.bankAccount"
            :placeholder="$t('bankCard.enterAccount')"
            icon="i-lucide-hash"
            :ui="{
              base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
            }" />
        </UFormField>

        <UFormField :label="$t('bankCard.branch')" name="branch" :ui="{ label: 'text-white/70 mb-1' }">
          <USelectMenu
            v-model="state.branch"
            :items="branchOptions"
            searchable
            :search-attributes="['label', 'value']"
            :disabled="!state.bankCode"
            :ui="{
              base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
              content: 'w-full bg-slate-900 ring-1 ring-white/10',
            }"
            icon="i-lucide-building"
            :placeholder="$t('bankCard.selectBankFirst')"
            value-key="value" />
        </UFormField>

        <UFormField :label="$t('bankCard.holderName')" name="holderName" :ui="{ label: 'text-white/70 mb-1' }">
          <UInput
            v-model="state.holderName"
            :placeholder="$t('bankCard.enterHolderName')"
            icon="i-lucide-user"
            :ui="{
              base: 'w-full h-[44px] rounded-[10px] bg-slate-900 ring-1 ring-white/10 text-white',
            }" />
        </UFormField>

        <!-- 身分證正面 -->
        <UFormField :label="$t('bankCard.idCardFront')" name="idCardFront" :ui="{ label: 'text-white/70 mb-1' }">
          <div
            class="relative flex flex-col items-center justify-center rounded-xl bg-slate-900/50 ring-1 ring-white/10 ring-dashed p-4 cursor-pointer hover:ring-[#00df72]/50 transition-colors min-h-30"
            @click="triggerUpload('idCardFront')"
            @dragover.prevent
            @drop.prevent="onDrop($event, 'idCardFront')">
            <template v-if="previews.idCardFront">
              <NuxtImg :src="previews.idCardFront" class="max-h-25 rounded-lg object-contain" />
              <span class="mt-1 text-[12px] text-white/50">{{ $t('common.clickReselect') }}</span>
            </template>
            <template v-else>
              <Icon name="i-lucide-upload" class="text-[24px] text-white/40" />
              <span class="mt-1 text-[13px] text-white/50">{{ $t('common.dragOrUpload') }}</span>
            </template>
            <input
              ref="idCardFrontInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onFileChange($event, 'idCardFront')" />
          </div>
        </UFormField>

        <!-- 身分證反面 -->
        <UFormField :label="$t('bankCard.idCardBack')" name="idCardBack" :ui="{ label: 'text-white/70 mb-1' }">
          <div
            class="relative flex flex-col items-center justify-center rounded-xl bg-slate-900/50 ring-1 ring-white/10 ring-dashed p-4 cursor-pointer hover:ring-[#00df72]/50 transition-colors min-h-30"
            @click="triggerUpload('idCardBack')"
            @dragover.prevent
            @drop.prevent="onDrop($event, 'idCardBack')">
            <template v-if="previews.idCardBack">
              <NuxtImg :src="previews.idCardBack" class="max-h-25 rounded-lg object-contain" />
              <span class="mt-1 text-[12px] text-white/50">{{ $t('common.clickReselect') }}</span>
            </template>
            <template v-else>
              <Icon name="i-lucide-upload" class="text-[24px] text-white/40" />
              <span class="mt-1 text-[13px] text-white/50">{{ $t('common.dragOrUpload') }}</span>
            </template>
            <input
              ref="idCardBackInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onFileChange($event, 'idCardBack')" />
          </div>
        </UFormField>

        <!-- 銀行存摺封面 -->
        <UFormField :label="$t('bankCard.passbookCover')" name="passbookCover" :ui="{ label: 'text-white/70 mb-1' }">
          <div
            class="relative flex flex-col items-center justify-center rounded-xl bg-slate-900/50 ring-1 ring-white/10 ring-dashed p-4 cursor-pointer hover:ring-[#00df72]/50 transition-colors min-h-30"
            @click="triggerUpload('passbookCover')"
            @dragover.prevent
            @drop.prevent="onDrop($event, 'passbookCover')">
            <template v-if="previews.passbookCover">
              <NuxtImg :src="previews.passbookCover" class="max-h-25 rounded-lg object-contain" />
              <span class="mt-1 text-[12px] text-white/50">{{ $t('common.clickReselect') }}</span>
            </template>
            <template v-else>
              <Icon name="i-lucide-upload" class="text-[24px] text-white/40" />
              <span class="mt-1 text-[13px] text-white/50">{{ $t('common.dragOrUpload') }}</span>
            </template>
            <input
              ref="passbookCoverInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onFileChange($event, 'passbookCover')" />
          </div>
        </UFormField>

        <UButton
          type="submit"
          block
          size="xl"
          :loading
          class="cursor-pointer rounded-[12px]"
          :ui="{
            base: 'bg-linear-to-b from-[#77cbac] to-[#1a6b52] hover:from-[#8ad5b8] hover:to-[#1f7d5f] text-white ring-1 ring-white/10',
          }">
          {{ loading ? $t('common.submitting') : $t('common.confirmAdd') }}
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
  import * as z from 'zod';
  import type { FormSubmitEvent } from '@nuxt/ui';

  const { onSuccess = () => {} } = defineProps<{
    onSuccess: Function;
  }>();

  const { t } = useI18n();
  const toast = useToast();
  const loading = ref(false);

  type BankCodeItem = { value: string; label: string; child?: { value: string; label: string }[] };

  const bankCodeData = ref<BankCodeItem[]>([]);

  const bankOptions = computed(() =>
    bankCodeData.value.map((b) => ({ label: b.label, value: b.value })),
  );

  const branchOptions = computed(() => {
    if (!state.bankCode) return [];
    const bank = bankCodeData.value.find((b) => b.value === state.bankCode);
    return (bank?.child || []).map((c) => ({ label: c.label, value: c.value }));
  });

  onMounted(async () => {
    try {
      const data = await $fetch<BankCodeItem[]>('/bankCode.json');
      bankCodeData.value = data;
    } catch (e) {
      // 靜默處理
    }
  });

  const schema = z.object({
    bankCode: z.string().min(1, t('validation.selectBank')),
    bankAccount: z.string().regex(/^\d+$/, t('validation.bankAccountDigitOnly')).min(8, t('validation.accountMin8')),
    branch: z.string().min(1, t('validation.enterBranch')),
    holderName: z.string().min(2, t('validation.enterHolderName')),
    idCardFront: z.instanceof(File, { message: t('validation.uploadIdFront') }),
    idCardBack: z.instanceof(File, { message: t('validation.uploadIdBack') }),
    passbookCover: z.instanceof(File, { message: t('validation.uploadPassbook') }),
  });

  type Schema = z.output<typeof schema>;

  const state = reactive<Partial<Schema>>({
    bankCode: undefined,
    bankAccount: '',
    branch: '',
    holderName: '',
    idCardFront: undefined,
    idCardBack: undefined,
    passbookCover: undefined,
  });

  watch(
    () => state.bankCode,
    () => {
      state.branch = undefined;
    },
  );

  const previews = reactive<Record<string, string>>({
    idCardFront: '',
    idCardBack: '',
    passbookCover: '',
  });

  const idCardFrontInput = useTemplateRef<HTMLInputElement>('idCardFrontInput');
  const idCardBackInput = useTemplateRef<HTMLInputElement>('idCardBackInput');
  const passbookCoverInput = useTemplateRef<HTMLInputElement>('passbookCoverInput');

  const inputRefs: Record<string, Ref<HTMLInputElement | null>> = {
    idCardFront: idCardFrontInput,
    idCardBack: idCardBackInput,
    passbookCover: passbookCoverInput,
  };

  const triggerUpload = (field: string) => {
    inputRefs[field]?.value?.click();
  };

  const setFile = (field: string, file: File) => {
    (state as any)[field] = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previews[field] = (e.target?.result as string) || '';
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (event: Event, field: string) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) setFile(field, file);
  };

  const onDrop = (event: DragEvent, field: string) => {
    const file = event.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) setFile(field, file);
  };

  const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    loading.value = true;
    try {
      const formData = new FormData();
      formData.append('bankCode', event.data.bankCode);
      formData.append('bankAccount', event.data.bankAccount);
      formData.append('branch', event.data.branch);
      formData.append('holderName', event.data.holderName);
      formData.append('idCardFront', event.data.idCardFront);
      formData.append('idCardBack', event.data.idCardBack);
      formData.append('passbookCover', event.data.passbookCover);

      const { code } = await useApi().addBankCard(formData);
      if (code === 200) {
        toast.add({ title: t('common.notify'), description: t('bankCard.addSuccess') });
        onSuccess();
      }
    } catch {
    } finally {
      loading.value = false;
    }
  };
</script>
