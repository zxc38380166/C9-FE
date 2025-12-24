<template>
  <el-dialog
    v-model="visibleProxy"
    :show-close="false"
    :close-on-click-modal="closeOnMask"
    :close-on-press-escape="closeOnEsc"
    :lock-scroll="lockScroll"
    :width="width"
    :append-to-body="appendToBody"
    :align-center="true"
    top="0"
    class="register-dialog"
    :style="dialogInlineStyle"
    :header-class="headerClass"
    :body-class="bodyClass"
    :footer-class="footerClass">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="select-none text-white text-[34px] font-extrabold leading-none tracking-wide">
          {{ logoText }}
        </div>
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition"
          @click="onClose">
          <i class="mdi mdi-close text-xl" />
        </button>
      </div>
      <div class="mt-3 flex items-center justify-between gap-3">
        <el-steps
          :active="activeStep"
          finish-status="success"
          class="stake-steps flex-1"
          :align-center="true">
          <el-step v-for="i in totalSteps" :key="i" :title="''" />
        </el-steps>
        <div class="text-xs text-white/65 whitespace-nowrap">
          {{ stepText }} {{ activeStep + 1 }} / {{ totalSteps }}
        </div>
      </div>
    </template>
    <!-- Body -->
    <div class="text-white overflow-auto h-[calc(100vh-350px)] scrollable-hidden">
      <!-- Step 1: language -->
      <div v-show="activeStep === 0" class="space-y-4">
        <div class="space-y-2">
          <div class="text-xl font-extrabold tracking-wide">
            {{ step1Title }}
          </div>
          <div class="text-sm text-white/70 leading-relaxed">
            {{ step1Desc }}
          </div>
        </div>

        <div class="space-y-2">
          <div class="text-sm text-white/80">{{ languageLabel }}</div>
          <CommonSelect
            v-model="selectedLang"
            selectClass="!border-[white]/10 rounded-xl !border"
            width="100%"
            height="50px"
            option-gap="52px"
            select-radius-class="rounded-l-lg"
            option-radius-class="rounded-lg"
            :options="langs"
            active-bg-color="#0f212e"
            active-text-color="#ffffff"
            option-bg-color="#152733"
            option-text-color="#ffffff"
            option-hover-class="hover:bg-[#2f4553]"
            arrow-icon="mdi mdi-chevron-down text-[20px] text-white" />
        </div>

        <button
          type="button"
          class="h-11 w-full rounded-xl font-bold tracking-wide transition disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-b from-[#77cbac] to-[#1a6b52] text-white hover:brightness-110 active:brightness-95"
          :disabled="loading || disabled || !selectedLang"
          @click="goNextFromLang">
          {{ confirmLangText }}
        </button>

        <div class="pt-1 flex items-center justify-center gap-2">
          <span class="text-sm text-white/55">{{ alreadyAccountText }}</span>
          <button
            type="button"
            class="text-sm font-semibold text-white/90 hover:underline underline-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            :disabled="loading"
            @click="emit('login')">
            {{ loginText }}
          </button>
        </div>
      </div>

      <!-- Step 2: form -->
      <div v-show="activeStep === 1" class="space-y-4">
        <div class="flex items-center gap-2 text-white/80 text-sm">
          <button
            type="button"
            class="inline-flex items-center gap-1 hover:text-white transition"
            :disabled="loading"
            @click="activeStep = 0">
            <i class="mdi mdi-chevron-left text-lg" />
            {{ backText }}
          </button>
        </div>

        <div class="space-y-2">
          <div class="text-xl font-extrabold tracking-wide">
            {{ step2Title }}
          </div>
        </div>

        <!-- Email -->
        <div>
          <div class="pb-[6px] text-white/85">
            {{ emailLabel }} <span class="text-red-400">*</span>
          </div>
          <div class="relative">
            <input
              :value="emailValue"
              @input="setFieldValue('email', ($event.target as HTMLInputElement).value)"
              @blur="emailBlur"
              :placeholder="emailPlaceholder"
              :disabled="disabled || loading"
              autocomplete="email"
              class="w-full h-11 rounded-xl px-4 pr-10 outline-none transition bg-[#081620]/35 border border-white/10 text-white/90 placeholder:text-white/35 focus:border-white/20 focus:ring-2 focus:ring-white/10 disabled:opacity-70 disabled:cursor-not-allowed"
              :class="
                errors.email
                  ? 'border-red-400/90 focus:border-red-400/90 focus:ring-red-400/20'
                  : ''
              " />
            <button
              v-if="String(emailValue || '').length > 0 && !(disabled || loading)"
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10 transition"
              @click="setFieldValue('email', '')"
              aria-label="clear email">
              <i class="mdi mdi-close text-lg text-white/80" />
            </button>
          </div>
          <div v-if="errors.email" class="mt-1 text-red-400 text-sm">{{ errors.email }}</div>
        </div>

        <!-- Username -->
        <div>
          <div class="pb-[6px] text-white/85">
            {{ usernameLabel }} <span class="text-red-400">*</span>
          </div>
          <div class="relative">
            <input
              :value="usernameValue"
              @input="setFieldValue('username', ($event.target as HTMLInputElement).value)"
              @blur="usernameBlur"
              :placeholder="usernamePlaceholder"
              :disabled="disabled || loading"
              autocomplete="username"
              class="w-full h-11 rounded-xl px-4 outline-none transition bg-[#081620]/35 border border-white/10 text-white/90 placeholder:text-white/35 focus:border-white/20 focus:ring-2 focus:ring-white/10 disabled:opacity-70 disabled:cursor-not-allowed"
              :class="
                errors.username
                  ? 'border-red-400/90 focus:border-red-400/90 focus:ring-red-400/20'
                  : ''
              " />
          </div>
          <div v-if="errors.username" class="mt-1 text-red-400 text-sm">{{ errors.username }}</div>
        </div>

        <!-- Password -->
        <div>
          <div class="pb-[6px] text-white/85">
            {{ passwordLabel }} <span class="text-red-400">*</span>
          </div>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              :value="passwordValue"
              @input="setFieldValue('password', ($event.target as HTMLInputElement).value)"
              @blur="passwordBlur"
              :placeholder="passwordPlaceholder"
              :disabled="disabled || loading"
              autocomplete="new-password"
              class="w-full h-11 rounded-xl px-4 pr-12 outline-none transition bg-[#081620]/35 border border-white/10 text-white/90 placeholder:text-white/35 focus:border-white/20 focus:ring-2 focus:ring-white/10 disabled:opacity-70 disabled:cursor-not-allowed"
              :class="
                errors.password
                  ? 'border-red-400/90 focus:border-red-400/90 focus:ring-red-400/20'
                  : ''
              " />
            <button
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="disabled || loading"
              @click="showPassword = !showPassword"
              aria-label="toggle password">
              <i
                class="mdi text-lg text-white/80"
                :class="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" />
            </button>
          </div>
          <div v-if="errors.password" class="mt-1 text-red-400 text-sm">{{ errors.password }}</div>
        </div>

        <!-- Birthday -->
        <div>
          <div class="pb-[6px] text-white/85">
            {{ birthdayLabel }} <span class="text-red-400">*</span>
          </div>

          <el-date-picker
            v-model="birthdayProxy"
            type="date"
            value-format="YYYY-MM-DD"
            format="YYYY/MM/DD"
            class="w-full"
            :placeholder="birthdayPlaceholder"
            :disabled="disabled || loading" />

          <div v-if="errors.birthday" class="mt-1 text-red-400 text-sm">{{ errors.birthday }}</div>
        </div>

        <!-- Optional checkboxes -->
        <div class="space-y-2 pt-1">
          <el-checkbox v-model="showPhone" :disabled="disabled || loading">
            <span class="text-white/80">{{ phoneToggleText }}</span>
          </el-checkbox>

          <div v-if="showPhone" class="pl-6">
            <div class="pb-[6px] text-white/85">{{ phoneLabel }}</div>
            <input
              :value="phoneValue"
              @input="setFieldValue('phone', ($event.target as HTMLInputElement).value)"
              @blur="phoneBlur"
              :placeholder="phonePlaceholder"
              :disabled="disabled || loading"
              inputmode="tel"
              class="w-full h-11 rounded-xl px-4 outline-none transition bg-[#081620]/35 border border-white/10 text-white/90 placeholder:text-white/35 focus:border-white/20 focus:ring-2 focus:ring-white/10 disabled:opacity-70 disabled:cursor-not-allowed"
              :class="
                errors.phone
                  ? 'border-red-400/90 focus:border-red-400/90 focus:ring-red-400/20'
                  : ''
              " />
            <div v-if="errors.phone" class="mt-1 text-red-400 text-sm">{{ errors.phone }}</div>
          </div>

          <el-checkbox v-model="showReferral" :disabled="disabled || loading">
            <span class="text-white/80">{{ referralToggleText }}</span>
          </el-checkbox>

          <div v-if="showReferral" class="pl-6">
            <div class="pb-[6px] text-white/85">{{ referralLabel }}</div>
            <input
              :value="referralValue"
              @input="setFieldValue('referralCode', ($event.target as HTMLInputElement).value)"
              @blur="referralBlur"
              :placeholder="referralPlaceholder"
              :disabled="disabled || loading"
              class="w-full h-11 rounded-xl px-4 outline-none transition bg-[#081620]/35 border border-white/10 text-white/90 placeholder:text-white/35 focus:border-white/20 focus:ring-2 focus:ring-white/10 disabled:opacity-70 disabled:cursor-not-allowed"
              :class="
                errors.referralCode
                  ? 'border-red-400/90 focus:border-red-400/90 focus:ring-red-400/20'
                  : ''
              " />
            <div v-if="errors.referralCode" class="mt-1 text-red-400 text-sm">
              {{ errors.referralCode }}
            </div>
          </div>
        </div>

        <button
          type="button"
          class="h-11 w-full rounded-xl font-bold tracking-wide transition disabled:opacity-70 disabled:cursor-not-allowed bg-[#2d7ef7] text-white hover:brightness-110 active:brightness-95"
          :disabled="disabled || loading"
          @click="goNextFromForm">
          {{ continueText }}
        </button>
      </div>

      <!-- Step 3: confirm & submit -->
      <div v-show="activeStep === 2" class="space-y-4">
        <div class="flex items-center gap-2 text-white/80 text-sm">
          <button
            type="button"
            class="inline-flex items-center gap-1 hover:text-white transition"
            :disabled="loading"
            @click="activeStep = 1">
            <i class="mdi mdi-chevron-left text-lg" />
            {{ backText }}
          </button>
        </div>

        <div class="space-y-1">
          <div class="text-xl font-extrabold tracking-wide">{{ step3Title }}</div>
          <div class="text-sm text-white/70">{{ step3Desc }}</div>
        </div>

        <div class="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2 text-sm">
          <div class="flex items-center justify-between">
            <span class="text-white/60">{{ languageLabel }}</span>
            <span class="text-white/90 font-semibold">{{ currentLangLabel }}</span>
          </div>

          <div class="h-px bg-white/10 my-2" />

          <div class="flex items-center justify-between">
            <span class="text-white/60">{{ emailLabel }}</span>
            <span class="text-white/90 font-semibold">{{ values.email || '-' }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-white/60">{{ usernameLabel }}</span>
            <span class="text-white/90 font-semibold">{{ values.username || '-' }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-white/60">{{ birthdayLabel }}</span>
            <span class="text-white/90 font-semibold">{{ values.birthday || '-' }}</span>
          </div>
          <div v-if="values.phone" class="flex items-center justify-between">
            <span class="text-white/60">{{ phoneLabel }}</span>
            <span class="text-white/90 font-semibold">{{ values.phone }}</span>
          </div>
          <div v-if="values.referralCode" class="flex items-center justify-between">
            <span class="text-white/60">{{ referralLabel }}</span>
            <span class="text-white/90 font-semibold">{{ values.referralCode }}</span>
          </div>
        </div>

        <button
          type="button"
          class="h-11 w-full rounded-xl font-bold tracking-wide transition disabled:opacity-70 disabled:cursor-not-allowed bg-[#5fae8e] text-white hover:brightness-110 active:brightness-95"
          :disabled="disabled || loading"
          @click="submitRegister">
          <span v-if="!loading">{{ submitText }}</span>
          <span v-else class="inline-flex items-center gap-2">
            <i class="mdi mdi-loading mdi-spin text-lg" />
            {{ loadingText }}
          </span>
        </button>

        <div class="pt-1 flex items-center justify-center gap-2">
          <span class="text-sm text-white/55">{{ alreadyAccountText }}</span>
          <button
            type="button"
            class="text-sm font-semibold text-white/90 hover:underline underline-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            :disabled="loading"
            @click="emit('login')">
            {{ loginText }}
          </button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
  import * as yup from 'yup';
  import { useForm, useField } from 'vee-validate';

  type LangOption = { label: string; value: string };

  type RegisterPayload = {
    lang: string;
    email: string;
    username: string;
    password: string;
    birthday: string; // YYYY-MM-DD
    phone?: string;
    referralCode?: string;
  };

  const store = useStore();
  const props = withDefaults(
    defineProps<{
      modelValue: boolean;
      width?: string | number;
      closeOnMask?: boolean;
      closeOnEsc?: boolean;
      lockScroll?: boolean;
      appendToBody?: boolean;
      disabled?: boolean;

      // ui text
      logoText?: string;

      stepText?: string;
      totalSteps?: number;

      // step 1
      step1Title?: string;
      step1Desc?: string;
      languageLabel?: string;
      languagePlaceholder?: string;
      confirmLangText?: string;

      // step 2
      step2Title?: string;
      backText?: string;
      continueText?: string;

      emailLabel?: string;
      emailPlaceholder?: string;

      usernameLabel?: string;
      usernamePlaceholder?: string;

      passwordLabel?: string;
      passwordPlaceholder?: string;

      birthdayLabel?: string;
      birthdayPlaceholder?: string;

      phoneToggleText?: string;
      phoneLabel?: string;
      phonePlaceholder?: string;

      referralToggleText?: string;
      referralLabel?: string;
      referralPlaceholder?: string;

      // step 3
      step3Title?: string;
      step3Desc?: string;
      submitText?: string;
      loadingText?: string;

      // bottom
      alreadyAccountText?: string;
      loginText?: string;

      // theme
      dialogBg?: string;
      dialogBorder?: string;
      dialogShadow?: string;
      dialogRadius?: string;

      // options
      langs?: LangOption[];

      // behavior
      clearOnOpen?: boolean;
    }>(),
    {
      width: 520,
      closeOnMask: true,
      closeOnEsc: true,
      lockScroll: true,
      appendToBody: true,
      disabled: false,

      logoText: 'Stake',

      stepText: '步骤',
      totalSteps: 3,

      step1Title: '选择您的首选语言',
      step1Desc: '我们支持多种语言。请通过以下选项在网站上个性化您的语言。',
      languageLabel: '语言',
      languagePlaceholder: '请选择语言',
      confirmLangText: '确认',

      step2Title: '创建账户',
      backText: '上一页',
      continueText: '继续',

      emailLabel: '电邮地址',
      emailPlaceholder: '请输入电邮地址',

      usernameLabel: '用户名',
      usernamePlaceholder: '请输入用户名',

      passwordLabel: '密码',
      passwordPlaceholder: '请输入密码',

      birthdayLabel: '出生日期',
      birthdayPlaceholder: '年 / 月 / 日',

      phoneToggleText: '手机号码（可选）',
      phoneLabel: '手机号码',
      phonePlaceholder: '请输入手机号码',

      referralToggleText: '转介码（可选）',
      referralLabel: '转介码',
      referralPlaceholder: '请输入转介码',

      step3Title: '确认资料',
      step3Desc: '确认无误后提交注册。',
      submitText: '提交注册',
      loadingText: '处理中',

      alreadyAccountText: '已有账户？',
      loginText: '登录',

      dialogBg: 'linear-gradient(180deg, #163040 0%, #0B1A26)',
      dialogBorder: 'rgba(255,255,255,0.06)',
      dialogShadow: '0 18px 40px rgba(0,0,0,0.55)',
      dialogRadius: '16px',

      langs: () => [
        { label: '中文（简体）', value: 'zh-CN' },
        { label: '中文（繁體）', value: 'zh-TW' },
        { label: 'English', value: 'en-US' },
      ],

      clearOnOpen: true,
    },
  );

  const emit = defineEmits<{
    (e: 'update:modelValue', v: boolean): void;
    (e: 'close'): void;
    (e: 'login'): void;
    (e: 'change-lang', lang: string): void;
    (e: 'submit', payload: RegisterPayload): void;
  }>();

  const visibleProxy = computed({
    get: () => props.modelValue,
    set: (v) => emit('update:modelValue', v),
  });

  const headerClass = 'px-4 pt-3 pb-2 !mr-0';
  const bodyClass = 'px-4 pb-5 pt-3';
  const footerClass = 'px-4 py-4';

  const dialogInlineStyle = computed(() => ({
    background: props.dialogBg,
    border: `1px solid ${props.dialogBorder}`,
    borderRadius: props.dialogRadius,
    boxShadow: props.dialogShadow,
    overflow: 'hidden',
  }));

  const totalSteps = computed(() => props.totalSteps ?? 3);

  // step state
  const activeStep = ref(0);

  // lang
  const selectedLang = ref<string>(props.langs?.[0]?.value || 'zh-CN');
  const currentLangLabel = computed(() => {
    const hit = (props.langs || []).find((x) => x.value === selectedLang.value);
    return hit?.label || selectedLang.value;
  });

  // optional fields toggles
  const showPhone = ref(false);
  const showReferral = ref(false);

  // validation
  const initialValues: RegisterPayload = {
    lang: selectedLang.value,
    email: '',
    username: '',
    password: '',
    birthday: '',
    phone: '',
    referralCode: '',
  };

  const schema = yup.object({
    lang: yup.string().required(),
    email: yup.string().trim().required('请输入电邮地址').email('电邮格式不正确'),
    username: yup
      .string()
      .trim()
      .required('请输入用户名')
      .min(3, '用户名至少 3 个字符')
      .max(20, '用户名最多 20 个字符'),
    password: yup
      .string()
      .required('请输入密码')
      .min(8, '密码至少 8 位')
      .matches(/[A-Za-z]/, '密码需包含字母')
      .matches(/[0-9]/, '密码需包含数字'),
    birthday: yup.string().required('请选择出生日期'),
    phone: yup
      .string()
      .optional()
      .test('phone-optional', '手机号码格式不正确', (v) => {
        if (!showPhone.value) return true;
        if (!v) return true;
        return /^[0-9+\-\s()]{6,20}$/.test(v);
      }),
    referralCode: yup
      .string()
      .optional()
      .test('ref-optional', '转介码格式不正确', (v) => {
        if (!showReferral.value) return true;
        if (!v) return true;
        return /^[A-Za-z0-9_-]{3,30}$/.test(v);
      }),
  });

  const { values, errors, validate, resetForm, setFieldValue } = useForm<RegisterPayload>({
    validationSchema: schema,
    initialValues,
  });

  const { value: emailValue, handleBlur: emailBlur } = useField<string>('email');
  const { value: usernameValue, handleBlur: usernameBlur } = useField<string>('username');
  const { value: passwordValue, handleBlur: passwordBlur } = useField<string>('password');
  const { value: phoneValue, handleBlur: phoneBlur } = useField<string>('phone');
  const { value: referralValue, handleBlur: referralBlur } = useField<string>('referralCode');

  // date picker proxy
  const birthdayProxy = computed<string | undefined>({
    get: () => values.birthday || undefined,
    set: (v) => setFieldValue('birthday', v || ''),
  });

  const loading = ref(false);
  const showPassword = ref(false);

  watch(
    () => props.modelValue,
    (open) => {
      if (!open) return;

      activeStep.value = 0;
      showPassword.value = false;

      if (props.clearOnOpen) {
        selectedLang.value = props.langs?.[0]?.value || selectedLang.value;
        showPhone.value = false;
        showReferral.value = false;

        resetForm({
          values: {
            ...initialValues,
            lang: selectedLang.value,
          },
        });
      } else {
        setFieldValue('lang', selectedLang.value);
      }
    },
  );

  watch(selectedLang, (v) => {
    setFieldValue('lang', v);
  });

  const onClose = () => {
    emit('update:modelValue', false);
    emit('close');
  };

  // Step actions
  const goNextFromLang = () => {
    if (!selectedLang.value) return;
    emit('change-lang', selectedLang.value);
    activeStep.value = 1;
  };

  const goNextFromForm = async () => {
    const result = await validate();
    if (!result.valid) return;
    activeStep.value = 2;
  };

  const submitRegister = async () => {
    const result = await validate();
    if (!result.valid) {
      activeStep.value = 1;
      return;
    }

    if (props.disabled || loading.value) return;

    try {
      loading.value = true;

      const res = await useHttp(useApi().register, {
        method: 'POST',
        body: {
          account: values.email,
          name: values.username,
          password: values.password,
          birthday: values.birthday,
          phone: showPhone.value ? values.phone || '' : '',
          referralCode: showReferral.value ? values.referralCode || '' : '',
          lang: values.lang,
        },
      });

      if (res.code === 200) {
        useMsg().success('註冊成功');
        store.getDoms.dialogRegister.open = false;
      } else {
        useMsg().error(res.message);
      }
    } finally {
      loading.value = false;
    }
  };
</script>
