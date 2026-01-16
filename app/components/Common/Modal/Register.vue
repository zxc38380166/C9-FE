<template>
  <UModal
    v-model:open="open"
    close-icon="i-lucide-arrow-right"
    title="登入"
    :ui="{ title: 'text-[20px]' }">
    <UButton
      icon="i-material-symbols:person-add-rounded"
      color="secondary"
      variant="solid"
      size="xl"
      aria-label="Settings"
      class="bg-[#2f4553]/70 text-[15px] font-bold cursor-pointer text-white hover:bg-[#2f4553] active:bg-[#2f4553]"
      label="註冊" />
    <template #body>
      <UStepper ref="UStepperRef" :items="items" />
      <div class="pt-10">
        <div class="text-xl font-extrabold tracking-wide">选择您的首选语言</div>
        <div class="text-sm text-white/70 leading-relaxed pb-6">
          我们支持多种语言。请通过以下选项在网站上个性化您的语言。
        </div>
        <ULocaleSelect size="xl" v-model="locale" :locales="[en, zh_tw]" />
        <button
          @click="UStepperRef.next()"
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
      <!-- <UPageCard class="w-full max-w-md">
        <UAuthForm
          ref="UAuthFormRef"
          :validate-on="['submit']"
          :schema="schema"
          description="請輸入您的帳號資訊以存取您的帳戶。"
          icon="i-lucide-user"
          :fields="fields"
          :providers="providers"
          @submit="onSubmit" />
      </UPageCard> -->
    </template>
  </UModal>
</template>
<script setup lang="ts">
  import * as z from 'zod';
  import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui';
  import { en, zh_tw } from '@nuxt/ui/locale';

  const locale = ref('zh-tw');
  const items = ref([
    {
      title: '客製化您的喜好',
      description: '',
      icon: 'i-material-icon-theme:i18n',
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

  const toast = useToast();
  const store = useStore();
  const { isLogin, setToken, refreshUserData } = useAuth();

  const UStepperRef = ref(null);
  const UAuthFormRef = ref(null);

  const open = ref(false);

  const fields: AuthFormField[] = [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
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
    {
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      onClick: () => {
        toast.add({ title: 'GitHub', description: 'Login with GitHub' });
      },
    },
  ];

  const schema = z.object({
    email: z.email('Invalid email'),
    password: z.string('Password is required').min(6, 'Must be at least 6 characters'),
  });

  type Schema = z.output<typeof schema>;
  const onSubmit = (payload: FormSubmitEvent<Schema>) => {
    useApi()
      .login({
        account: payload.data.email,
        password: payload.data.password,
      })
      .then(async (res) => {
        if (res.code === 200) {
          toast.add({ title: '通知', description: '登入成功' });
          await setToken(res.result.token);
          await refreshUserData();
        } else {
          toast.add({ title: '通知', description: res.message });
        }
      });
  };

  defineShortcuts({ r: () => (open.value = !open.value) });
</script>
