<template>
  <UModal
    v-model:open="open"
    close-icon="i-lucide-arrow-right"
    title="登入"
    :ui="{ title: 'text-[20px]' }">
    <button
      class="group flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-[13px] sm:text-[14px] font-bold text-white/80 hover:text-white bg-white/5 ring-1 ring-white/12 hover:ring-white/25 hover:bg-white/10 transition-all duration-200 cursor-pointer">
      <Icon
        name="i-lucide-log-in"
        class="size-3.5 sm:size-4 text-white/50 group-hover:text-emerald-400 transition-colors" />
      登入
    </button>
    <template #body>
      <UPageCard class="w-full max-w-md">
        <UAuthForm
          ref="UAuthFormRef"
          :validate-on="[]"
          :schema
          description="請輸入您的帳號資訊以存取您的帳戶。"
          icon="i-lucide-user"
          :fields
          :providers
          @submit="onSubmit" />
      </UPageCard>
    </template>
  </UModal>
</template>
<script setup lang="ts">
  import * as z from 'zod';
  import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui';

  const toast = useToast();
  const store = useStore();
  const { setToken, refreshUserData } = useAuth();
  const { loginThirdParty } = useLayout();

  const UAuthFormRef = useTemplateRef('UAuthFormRef');
  const { loginModalOpen: open } = useLayout();

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
        window.location.href = store.getLoginConfig.google;
      },
    },
  ];

  const schema = z.object({
    account: z.string('Password is account'),
    password: z.string('Password is required').min(6, 'Must be at least 6 characters'),
  });

  type Schema = z.output<typeof schema>;
  const onSubmit = (payload: FormSubmitEvent<Schema>) => {
    useApi()
      .login({
        account: payload.data.account,
        password: payload.data.password,
      })
      .then(async (res) => {
        if (res.code === 200) {
          toast.add({ title: '通知', description: '登入成功' });
          await setToken(res.result.token);
          await refreshUserData();
        }
      });
  };

  defineShortcuts({ l: () => (open.value = !open.value) });
</script>
