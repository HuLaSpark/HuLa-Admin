<template>
  <!-- 头部操作项 -->
  <HeaderGroup />

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

  <!-- 租户选择弹窗 -->
  <TenantSelector
    v-model:show="showTenantSelector"
    :tenant-list="tenantList"
    :loading="tenantLoading"
    @confirm="handleTenantConfirm"
    @cancel="handleTenantCancel"
  />
</template>

<script async setup lang="ts">
import { i18n } from '@/i18n'
import { useLogin } from '@/hooks/useLogin'
import check from '@/hooks/useCheck.ts'
import Modal from '@/components/modal/index.vue'
import useModal from '@/hooks/useModal.ts'
import { animation } from '@/components/modal/type'
import CodeInput from '@/components/codeinput/index.vue'
import CountDown from '@/components/countdown/index.vue'
import HeaderGroup from '@/views/login/head/index.vue'
import LoginForm from '@/views/login/form/index.vue'
import TenantSelector from '@/components/TenantSelector.vue'
import { initFingerprint } from '@/utils/fingerprint'
import { userStore } from '@/stores/user'
import { tenant } from '@/stores/tenant'
import router from '@/router'
import { Loading } from 'notiflix'
import type { TenantInfo } from '@/types/api'

/*在layout中挂载需要挂载全局的hook*/
window.$message = useMessage()
window.$notification = useNotification()
const { t } = i18n.global
const userInfoStore = userStore()
const tenantStore = tenant()

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

/*租户选择相关*/
const showTenantSelector = ref(false)
const tenantList = ref<TenantInfo[]>([])
const tenantLoading = ref(false)

/*处理租户选择确认*/
const handleTenantConfirm = async (tenantId: string) => {
  Loading.pulse()
  try {
    const selectedTenant = tenantList.value.find((t) => t.id === tenantId)
    if (selectedTenant) {
      tenantStore.setTenant({
        tenantName: selectedTenant.name,
        tenantId: String(tenantId),
        tenantUrl: selectedTenant.website || ''
      })
    }

    // 设置租户并初始化用户信息
    const result = await userInfoStore.setTenantAndInit(tenantId)

    if (result.success) {
      showTenantSelector.value = false
      Loading.remove()

      // 根据后端返回的菜单，选择第一个可访问的页面作为默认跳转
      const menus = (userInfoStore.loginInfo.menus || []) as any[]
      const findFirstPath = (items: any[]): string | undefined => {
        for (const item of items) {
          if (item.children && item.children.length) {
            const childPath = findFirstPath(item.children)
            if (childPath) return childPath
          } else if (item.path) {
            return item.path as string
          }
        }
        return undefined
      }
      const defaultPath = findFirstPath(menus) || '/home'

      router.push(defaultPath)

      window.$notification.success({
        title: t('login_success'),
        duration: 1500,
        keepAliveOnHover: true
      })
    } else {
      Loading.remove()
      window.$message.error(result.message || '设置租户失败')
    }
  } catch (error: any) {
    Loading.remove()
    console.error('设置租户失败:', error)
    window.$message.error(error.message || '设置租户失败')
  }
}

/*处理租户选择取消*/
const handleTenantCancel = () => {
  showTenantSelector.value = false
  userInfoStore.logout()
}

/*页面加载时初始化设备指纹*/
onMounted(() => {
  initFingerprint()
})

/*监听登录成功事件，显示租户选择弹窗*/
provide('onLoginSuccess', async () => {
  tenantLoading.value = true
  showTenantSelector.value = true

  try {
    const list = await userInfoStore.getUserTenantList()
    tenantList.value = list

    if (list.length === 0) {
      window.$message.error('您没有可用的企业，请联系管理员')
      showTenantSelector.value = false
      userInfoStore.logout()
    } else if (list.length === 1) {
      // 如果只有一个租户，自动选择
      await handleTenantConfirm(list[0].id)
    }
  } catch (error) {
    console.error('获取租户列表失败:', error)
    window.$message.error('获取租户列表失败')
    showTenantSelector.value = false
    userInfoStore.logout()
  } finally {
    tenantLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/scss/login';
</style>
