<template>
  <div class="login">
    <h1>{{ t('login') }} HuLa</h1>
    <!-- 登录错误提示框 -->
    <n-alert v-if="loginErrorMsg" class="login_alert" :title="loginErrorTitle" :type="loginErrorType" closable>
      <template #default>
        {{ loginErrorText }}
      </template>
    </n-alert>
    <!-- 登录表单 -->
    <n-card class="form">
      <n-form ref="formRef" :show-require-mark="false" :rules="rules as any" :model="ruleForm">
        <div style="margin: 10px 0">
          <n-form-item path="userName" :label="t('un_or_el')" label-style="font-size: 14px;color: #cccccc">
            <n-input
              clearable
              @keydown.enter="SignIn(formRef)"
              v-model:value="ruleForm.userName"
              style="border-radius: 8px"
              :placeholder="t('input_username_email')">
              <template #prefix>
                <n-icon color="#000"><User /></n-icon>
              </template>
            </n-input>
          </n-form-item>

          <div class="paw-title">
            <p style="font-size: 14px; color: #cccccc">{{ t('password') }}</p>
            <p style="font-size: 12px; color: #337ecc; cursor: pointer" @click="changePawBox">
              {{ t('forgot_password') }}
            </p>
          </div>
          <n-form-item :validation-status="ValidationStatus" path="password" :label="t('password')" :show-label="false">
            <n-input
              show-password-on="mousedown"
              type="password"
              clearable
              :loading="loadingPaw"
              @keydown.enter="SignIn(formRef)"
              v-model:value="ruleForm.password"
              style="border-radius: 8px"
              :placeholder="t('input_paw')">
              <template #prefix>
                <n-icon color="#000"><Lock /></n-icon>
              </template>
            </n-input>
          </n-form-item>

          <n-checkbox
            :on-update:checked="() => (rememberOption = !rememberOption)"
            :checked="rememberOption"
            style="margin: 5px 0 10px 5px">
            <n-text depth="3">{{ t('remember_me') }}</n-text>
          </n-checkbox>
        </div>

        <n-button
          @click="SignIn(formRef)"
          :disabled="disabled"
          :loading="signInLoading"
          type="primary"
          style="width: 100%; border-radius: 10px">
          {{ loginText }}
        </n-button>
      </n-form>
    </n-card>
    <n-card class="FirstVisit" hoverable>
      <n-space>
        <h1>{{ t('et_problems') }}</h1>
        <h2>{{ t('contact_admin') }}</h2>
      </n-space>
    </n-card>
    <div class="BottomBar">
      <div style="display: flex; margin: 20px 10px 20px 10px; justify-content: center">
        <n-popover placement="top" trigger="click">
          <template #trigger>
            <n-a style="font-size: 12px; margin: 0 10px">{{ t('author') }}</n-a>
          </template>
          <template #default>
            <div class="link-content">
              <h1>{{ t('lead_developer') }}：</h1>
              <p>nyh</p>
            </div>
          </template>
        </n-popover>
        <n-popover placement="top" trigger="click">
          <template #trigger>
            <n-a style="font-size: 12px; margin: 0 10px" type="primary">{{ t('contact') }}</n-a>
          </template>
          <template #default>
            <div class="link-content">
              <h1>QQ：</h1>
              <p>2439646234</p>
            </div>
          </template>
        </n-popover>
        <n-popover placement="top" trigger="click">
          <template #trigger>
            <n-a style="font-size: 12px; margin: 0 10px" type="info">{{ t('technology') }}</n-a>
          </template>
          <template #default>
            <div class="Technology-content">
              <div>
                <h1>{{ t('frontend') }}</h1>
                <n-a type="success" @click="linkOpen(vue3)">Vue3</n-a><br />
                <n-a type="success" @click="linkOpen(vite)">Vite4</n-a><br />
                <n-a type="success" @click="linkOpen(TypeScript)">TypeScript</n-a><br />
                <n-a type="success" @click="linkOpen(pinia)">Pinia</n-a><br />
              </div>
              <div>
                <h1>{{ t('backend') }}</h1>
                <n-a type="primary" @click="linkOpen(SpringBoot)">SpringBoot3.X</n-a><br />
                <n-a type="primary" @click="linkOpen(redis)">Redis</n-a><br />
                <n-a type="primary" @click="linkOpen(MP)">MybatisPlus</n-a><br />
                <n-a type="primary" @click="linkOpen(druid)">Druid</n-a><br />
                <n-a type="primary" @click="linkOpen(saToken)">Sa-token</n-a><br />
              </div>
            </div>
          </template>
        </n-popover>
      </div>
      <p>Copyright © 2023-2024 HuLa.All Rights Reserved.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { i18n } from '@/i18n'
import { mainStore } from '@/stores/main'
import { remember } from '@/stores/remember'
import typeState from '@/hooks/useState'
import { storeToRefs } from 'pinia'
import check from '@/hooks/useCheck'
import useModal from '@/hooks/useModal'
import { useLogin } from '@/hooks/useLogin'
import { animation } from '@/components/modal/type'
import { Lock, User } from '@vicons/tabler'

const { t } = i18n.global
const store = mainStore()
const rememberStore = remember()
/*验证码输入框内容*/
const code = ref('')
const { loadingPaw, ValidationStatus } = typeState
const { TEXT_COLOR, THEME, BGC } = storeToRefs(store)
const {
  signInLoading,
  formRef,
  loginText,
  loginErrorType,
  loginErrorTitle,
  showModal,
  ruleForm,
  loginErrorText,
  loginErrorMsg,
  disabled,
  ruleEmail,
  rememberOption,
  SignIn
} = useLogin()
const { validateLoginUsername, validatePassword } = check()
/*引入全局的关闭方法*/
const { close } = useModal()

const rules = reactive({
  userName: { required: true, asyncValidator: validateLoginUsername, trigger: 'blur' },
  password: { required: true, asyncValidator: validatePassword, trigger: 'blur' }
})

const linkList = reactive<any>({
  FrontEnd: [
    'https://cn.vuejs.org/',
    'http://www.vitejs.net/',
    'https://www.typescriptlang.org/',
    'https://pinia.web3doc.top/'
  ],
  BackEnd: [
    'https://spring.io/projects/spring-boot',
    'https://redis.io/',
    'https://baomidou.com/',
    'https://druid.apache.org/druid.html',
    'https://sa-token.cc/doc.html#/'
  ]
})
const [vue3, vite, TypeScript, pinia] = linkList.FrontEnd
const [SpringBoot, redis, MP, druid, saToken] = linkList.BackEnd
//使用新窗口打开链接
const linkOpen = (val: any) => {
  window.open(val)
}

/*弹出忘记密码修改框*/
const changePawBox = () => {
  ruleEmail.email = ''
  animation.value = 'modal-container animate__animated animate__flipInX'
  showModal.value = true
}

/*获取用户是否点击了记住*/
const handleRemember = () => {
  if (rememberStore.getRemember) {
    const { userName, password, rememberMe } = rememberStore.getRemember
    ruleForm.userName = userName
    ruleForm.password = password
    rememberOption.value = rememberMe
  }
}
onMounted(() => {
  handleRemember()
})
</script>

<style scoped>
@import '@/assets/css/login.css';

.login h1 {
  color: v-bind(TEXT_COLOR);
}
</style>
