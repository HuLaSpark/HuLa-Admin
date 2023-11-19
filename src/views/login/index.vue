<template>
  <!-- 头部操作项 -->
  <HeaderGroup />

  <!-- logo -->
  <!--	<div class="login-logo">-->
  <!--		<img src="/vue.svg" alt="" />-->
  <!--	</div>-->

  <div style="display: flex; justify-content: center; align-items: center">
    <i class="products-icon is-enter"></i>
  </div>

  <!-- 登录表单 -->
  <LoginForm />

  <!--  模态框-->
  <Teleport to="body">
    <!-- 使用这个 modal 组件，传入 prop -->
    <modal :show="showModal" @close="showModal = false">
      <template #header>
        <h3 class="msg">{{ emailMsg }}</h3>
      </template>
      <template #body>
        <n-form
          ref="formRef"
          :show-require-mark="false"
          label-placement="left"
          :model="ruleEmail"
          :rules="emailRules as any">
          <n-form-item path="email" :label="t('email')">
            <n-space>
              <n-input
                :placeholder="t('placeholder')"
                style="border-radius: 8px"
                v-model:value="ruleEmail.email"
                clearable />
              <n-button type="primary" quaternary @click="handleCodeInput(formRef)">{{ t('send') }}</n-button>
            </n-space>
          </n-form-item>
        </n-form>
      </template>
      <template #footer>
        <n-button class="close_btn" type="error" quaternary @click="emailClose">{{ t('close') }}</n-button>
      </template>
    </modal>
  </Teleport>

  <!-- 验证码输入框  -->
  <Teleport to="body">
    <!-- 使用这个 modal 组件，传入 prop -->
    <modal :show="showCode" width="350px" @close="showCode = false">
      <template #header>
        <h3 class="msg">{{ codeMsg }}</h3>
      </template>
      <template #body>
        <CodeInput :email="ruleEmail.email" @input="code" :code-length="6" :input-size="50"></CodeInput>
      </template>
      <template #footer>
        <CountDown :rule-form-ref="formRef" :time="60"></CountDown>
        <n-button quaternary type="primary" class="close_btn" @click="codeInputClose">{{ t('close') }}</n-button>
      </template>
    </modal>
  </Teleport>
</template>

<script async setup lang="ts">
import { i18n } from '@/i18n'
import { useLogin } from '@/hooks/useLogin'
import check from '@/hooks/useCheck'
import Modal from '@/components/modal/index.vue'
import useModal from '@/hooks/useModal'
import { animation } from '@/components/modal/type'
import CodeInput from '@/components/codeinput/index.vue'
import CountDown from '@/components/countdown/index.vue'
import HeaderGroup from '@/views/login/head/index.vue'
import LoginForm from '@/views/login/form/index.vue'

/*在layout中挂载需要挂载全局的hook*/
window.$message = useMessage()
window.$notification = useNotification()
const { t } = i18n.global
/*验证码输入框内容*/
const code = ref<any>('')
const { formRef, showModal, emailMsg, codeMsg, ruleEmail, showCode, handleCodeInput } = useLogin()
const { validateEmail } = check()
/*引入全局的关闭方法*/
const { close } = useModal()
const emailRules = reactive({
  email: [{ required: true, asyncValidator: validateEmail, trigger: 'blur' }]
})

/*邮箱弹出框关闭*/
const emailClose = () => {
  close().then(() => {
    emailMsg.value = t('change_paw')
    codeMsg.value = t('code_input')
  })
}

/*自定义输入验证码关闭方法*/
const codeInputClose = async () => {
  animation.value = 'modal-container animate__animated animate__rotateOutDownRight'
  await nextTick(() => {
    showCode.value = false
    animation.value = 'modal-container animate__animated animate__shakeX'
  })
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/login';
</style>
