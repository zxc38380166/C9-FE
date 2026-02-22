<template>
  <UModal
    v-model:open="open"
    close-icon="i-lucide-arrow-right"
    title="登入"
    :ui="{ title: 'text-[20px]' }">
    <UButton
      v-if="showBtn"
      icon="i-material-symbols:person-add-rounded"
      color="secondary"
      variant="solid"
      size="xl"
      aria-label="Settings"
      class="bg-linear-to-b from-[#77cbac] to-[#1a6b52] text-[15px] font-bold cursor-pointer text-white hover:bg-slate-700 active:bg-slate-700"
      label="註冊" />
    <template #body>
      <UStepper
        v-model="currentStep"
        color="neutral"
        ref="UStepperRef"
        :items="stepperItem"
        :ui="{
          root: 'pb-5',
          indicator: '!text-[white]',
          trigger: `bg-linear-to-b from-slate-700 to-slate-700 rounded-[50%]
             group-data-[state=active]:!from-[#77cbac] group-data-[state=active]:!to-[#1a6b52] text-white
             group-data-[state=completed]:!from-[#77cbac] group-data-[state=completed]:!to-[#1a6b52]`,
          icon: '!text-[white]',
        }" />
      <div v-if="currentStep === 0" class="pt-10">
        <div class="text-xl font-extrabold tracking-wide">选择您的首选语言</div>
        <div class="text-sm text-white/70 leading-relaxed pb-6">
          我们支持多种语言。请通过以下选项在网站上个性化您的语言。
        </div>
        <ULocaleSelect size="xl" v-model="locale" :locales="[en, zh_tw]" />
        <button
          @click="toggleStepper('next')"
          class="mt-8 h-11 w-full rounded-xl font-bold tracking-wide transition disabled:opacity-70 disabled:cursor-not-allowed bg-linear-to-b from-[#77cbac] to-[#1a6b52] text-white hover:brightness-110 active:brightness-95">
          確認
        </button>
        <div class="pt-1 mt-3 flex items-center justify-center gap-2">
          <span class="text-sm text-white/55">已有账户？</span>
          <button
            type="button"
            class="text-sm font-semibold text-white/90 hover:underline underline-offset-2 disabled:opacity-70 disabled:cursor-not-allowed">
            登录
          </button>
        </div>
      </div>
      <UPageCard v-if="currentStep === 1" class="w-full max-w-md">
        <UAuthForm
          ref="UAuthFormRef"
          :validate-on="[]"
          :schema
          description="請輸入您的帳號資訊以存取您的帳戶。"
          icon="i-lucide-user"
          :fields
          :providers
          @submit="onSubmit">
          <template #submit>
            <button
              type="submit"
              class="h-11 w-full rounded-xl font-bold tracking-wide transition disabled:opacity-70 disabled:cursor-not-allowed bg-linear-to-b from-[#77cbac] to-[#1a6b52] text-white hover:brightness-110 active:brightness-95">
              確認
            </button>
          </template>
        </UAuthForm>
      </UPageCard>
      <div v-if="currentStep === 2" class="pt-8">
        <div
          class="w-full max-w-md mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <div class="flex flex-col items-center text-center">
            <div
              class="h-16 w-16 rounded-full bg-linear-to-b from-[#77cbac] to-[#1a6b52] flex items-center justify-center shadow-lg">
              <UIcon name="i-lucide-check" class="text-white text-3xl" />
            </div>
            <div class="mt-5 text-2xl font-extrabold tracking-wide text-white">註冊成功！</div>
            <div class="mt-2 text-sm text-white/70 leading-relaxed">
              歡迎加入，我們已為你完成帳號建立。<br />
            </div>
            <div class="mt-6 w-full space-y-3">
              <button
                type="button"
                @click="closeModal"
                class="h-11 w-full rounded-xl font-bold tracking-wide transition bg-linear-to-b from-[#77cbac] to-[#1a6b52] text-white hover:brightness-110 active:brightness-95">
                立即開始
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
  import * as z from 'zod';
  import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui';
  import { en, zh_tw } from '@nuxt/ui/locale';
  import type { StepperItem } from '@nuxt/ui';

  const { showBtn = true } = defineProps<{ showBtn?: boolean }>();

  const toast = useToast();
  const { setToken, refreshUserData } = useAuth();

  const UStepperRef = useTemplateRef('UStepperRef');
  const UAuthFormRef = useTemplateRef('UAuthFormRef');

  const open = ref(false);
  const locale = ref('zh-tw');

  const currentStep = ref(0);
  const stepperItem: Ref<StepperItem[]> = ref([
    {
      title: '客製化您的喜好',
      description: '',
      icon: 'i-material-icon-theme:folder-i18n',
    },
    {
      title: '輸入您的資料',
      description: '',
      icon: 'i-material-symbols:article-person-rounded',
    },
    {
      title: '確認送出資料',
      description: '',
      icon: 'i-material-symbols:check-circle-rounded',
    },
  ]);

  const toggleStepper = (action: 'prev' | 'next') => {
    if (UStepperRef.value) {
      if (action === 'prev' && UStepperRef.value.hasPrev) UStepperRef.value.prev();
      if (action === 'next' && UStepperRef.value.hasNext) UStepperRef.value.next();
    }
  };

  const closeModal = () => {
    open.value = false;
    currentStep.value = 0;
  };

  const fields: AuthFormField[] = [
    {
      name: 'account',
      type: 'text',
      label: '帳號',
      placeholder: 'Enter your account',
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
      required: true,
    },
    {
      name: 'remember',
      label: 'Remember me',
      type: 'checkbox',
    },
  ];

  const providers = [
    {
      label: 'Google',
      icon: 'i-simple-icons-google',
      onClick: () => {
        toast.add({ title: 'Google', description: 'Login with Google' });
      },
    },
  ];

  const schema = z.object({
    account: z.string('account is required'),
    password: z.string('Password is required').min(6, 'Must be at least 6 characters'),
  });

  type Schema = z.output<typeof schema>;
  const onSubmit = (payload: FormSubmitEvent<Schema>) => {
    useApi()
      .register({
        account: payload.data.account,
        password: payload.data.password,
        name: '',
        birthday: '',
        phone: '',
        referralCode: '',
        lang: locale.value,
      })
      .then(async (res) => {
        if (res.code === 200) {
          toggleStepper('next');
          toast.add({ title: '通知', description: '註冊成功' });
          await setToken(res.result.token);
          await refreshUserData();
        }
      });
  };

  defineShortcuts({ r: () => (open.value = !open.value) });
</script>
