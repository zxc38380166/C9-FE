<template>
  <div class="space-y-4">
    <UPageCard
      class="w-full"
      title="Tailwind CSS"
      :ui="{ body: 'w-full', header: 'w-full space-y-4' }"
      description="Nuxt UI integrates with latest Tailwind CSS, bringing significant improvements.">
      <template #header>
        <div class="text-[20px] font-bold">個人資料</div>
        <USeparator />
      </template>
      <template #title>
        <div class="flex justify-between items-center w-full">
          <UUser
            :name="store.getUserDetail.name"
            :description="`帳號 : ${store.getUserDetail.account}`"
            :avatar="{
              src: 'https://github.com/benjamincanac.png',
              icon: 'i-lucide-image',
            }" />
          <UButton size="xl" class="translate-y-4 cursor-pointer">編輯</UButton>
        </div>
      </template>
    </UPageCard>
    <UPageCard
      class="w-full"
      title="Tailwind CSS"
      :ui="{ body: 'w-full', header: 'w-full space-y-4' }">
      <template #header>
        <div class="text-[20px] font-bold">聯絡資訊</div>
        <USeparator />
      </template>
      <template #title>
        <div class="flex justify-between items-center w-full">
          <UForm
            ref="UFormRef"
            class="w-full space-y-4"
            :schema="schema"
            :state="state"
            @submit="onSubmit"
            :validate-on="['input', 'blur']">
            <UFormField size="xl" name="email" :ui="{ label: 'mb-1' }" label="電子信箱驗證">
              <UInput
                v-model="state.email"
                :disabled="isVertify.email"
                :ui="{ root: 'w-full' }"
                placeholder="尚未綁定" />
              <template #hint>
                <div class="flex items-center">
                  <template v-if="isVertify.email">
                    <Icon :name="'icon-park:success'" class="text-[24px] text-[red]" />
                    <span class="text-[14px] text-white/50"> 已驗證 </span>
                  </template>
                  <template v-else>
                    <UButton
                      size="xs"
                      class="cursor-pointer"
                      loading-auto
                      @click="onVertify('email')">
                      立即驗證
                    </UButton>
                  </template>
                </div>
              </template>
            </UFormField>
            <UFormField size="xl" name="mobile" :ui="{ label: 'mb-1' }" label="電話驗證">
              <UFieldGroup class="w-full">
                <USelectMenu
                  type="button"
                  :ui="{ content: 'w-[230px]' }"
                  v-model="state.country"
                  :items="countryItems"
                  @change.stop
                  @input.stop
                  @blur.stop
                  @focus.stop
                  @keydown.stop
                  @click.stop />
                <UInput
                  v-model="state.mobile"
                  :disabled="isVertify.mobile"
                  :ui="{ root: 'w-full' }"
                  placeholder="尚未綁定" />
              </UFieldGroup>
              <template #hint>
                <div class="flex items-center">
                  <template v-if="isVertify.mobile">
                    <Icon :name="'icon-park:success'" class="text-[24px] text-[red]" />
                    <span class="text-[14px] text-white/50"> 已驗證 </span>
                  </template>
                  <template v-else>
                    <UButton
                      size="xs"
                      class="cursor-pointer"
                      loading-auto
                      @click="onVertify('mobile')">
                      立即驗證
                    </UButton>
                  </template>
                </div>
              </template>
            </UFormField>
          </UForm>
        </div>
      </template>
    </UPageCard>
  </div>
</template>
<script setup lang="ts">
  import * as z from 'zod';
  import type { FormSubmitEvent } from '@nuxt/ui';
  import { A1ModalVertifyUserInfo } from '#components';

  const UFormRef = useTemplateRef('UFormRef');

  const store = useStore();
  const toast = useToast();
  const overlay = useOverlay();

  const schema = z.object({
    country: z.string(),
    email: z.string().min(3).email('信箱格式錯誤'),
    mobile: z.string('請輸入電話').regex(/^\d+$/, '手機號碼只能輸入數字'),
  });

  type Schema = z.output<typeof schema>;

  const state = reactive<Partial<Schema>>({
    country: '886-TW-台灣',
    email: store.getUserDetail.email,
    mobile: store.getUserDetail.mobile,
  });

  const isVertify = computed(
    () =>
      ({
        email: !!store.getUserDetail.email,
        mobile: !!store.getUserDetail.mobile,
      } as const),
  );

  type VerifyAction = keyof typeof isVertify.value;
  const vertifyPayload = reactive<{
    info: string;
    actionType: VerifyAction;
    onReSend: Function;
    onSuccess: Function;
  }>({
    info: '',
    actionType: 'email',
    onReSend: async () => ({}),
    onSuccess: async () => ({}),
  });

  const onVertify = async (action: VerifyAction) => {
    if (!UFormRef.value) return Promise.resolve();
    return UFormRef.value.validate({ name: action }).then(async (values) => {
      if (action === 'email') {
        const { code, message } = await useApi().sendVertifyEmail({ email: values.email });

        if (code === 200) {
          vertifyPayload.info = values.email;
          vertifyPayload.actionType = 'email';
          vertifyPayload.onSuccess = () => modals.vertifyUserInfo.close();
          modals.vertifyUserInfo.open();
        } else {
          toast.add({ title: '通知', description: message });
        }
        return; // resolve
      }

      if (action === 'mobile') {
        const { code, message } = await useApi().sendVertifyMobile({
          mobile: values.mobile,
          country: values.country,
        });

        if (code === 200) {
          vertifyPayload.info = values.mobile;
          vertifyPayload.actionType = 'mobile';
          vertifyPayload.onSuccess = () => modals.vertifyUserInfo.close();
          modals.vertifyUserInfo.open();
        } else {
          toast.add({ title: '通知', description: message });
        }
        return; // resolve
      }
    });
  };

  const countryItems = computed(() => {
    const countryCodes = store?.getCountryCodes;
    const isArray = Array.isArray(countryCodes);
    return isArray ? countryCodes.map((i: any) => `${i.callingCode}-${i.country}-${i.name}`) : [];
  });

  const onSubmit = (event: FormSubmitEvent<Schema>) => {};

  const modals = reactive({
    vertifyUserInfo: overlay.create(A1ModalVertifyUserInfo, {
      defaultOpen: false,
      destroyOnClose: false,
      props: vertifyPayload,
    }),
  });
</script>
