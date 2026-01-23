<template>
  <UModal
    v-model:open="open"
    close-icon="i-lucide-arrow-right"
    title="登入"
    :ui="{ title: 'text-[20px]' }">
    <UButton
      icon="i-solar:login-3-broken"
      color="secondary"
      variant="solid"
      size="xl"
      aria-label="Notifications"
      class="text-[white] text-[15px] font-bold cursor-pointer bg-[#2f4553]/70 hover:bg-[#2f4553] active:bg-[#2f4553]"
      label="登入" />
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
  const { setToken, refreshUserData } = useAuth();

  const UAuthFormRef = ref(null);
  const open = ref(false);

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
    {
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      onClick: () => {
        toast.add({ title: 'GitHub', description: 'Login with GitHub' });
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
        } else {
          toast.add({ title: '通知', description: res.message });
        }
      });
  };

  defineShortcuts({ l: () => (open.value = !open.value) });
</script>
