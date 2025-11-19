import { userStore } from '@/stores/user'
import useState from '@/hooks/useState.ts'
import { i18n } from '@/i18n'
import { NForm } from 'naive-ui'
import { remember } from '@/stores/remember'
import { Loading } from 'notiflix'
import { tabs } from '@/stores/tabs.ts'
import { getEnhancedFingerprint } from '@/utils/fingerprint'
import type { LoginParams } from '@/types/api'

export const useLogin = () => {
  //定义初始化数据
  const userInfoStore = userStore()
  const tabsStore = tabs()
  const rememberStore = remember()
  const { t } = i18n.global
  const { disabled, showModal, showCode } = useState
  disabled.value = false
  const signInLoading = ref<boolean>(false)
  const formRef = ref(<InstanceType<typeof NForm>>{})
  const ruleForm = reactive({
    userName: '',
    password: '',
    tenantName: '',
    tenantId: '',
    tenantUrl: ''
  })
  const rememberOption = ref(false)
  const ruleEmail = reactive<any>({
    email: ''
  })
  /*邮箱提示框的标题*/
  const emailMsg = ref(t('change_paw'))
  /*输入验证码提示框标题*/
  const codeMsg = ref(t('code_input'))
  const loginText = ref(t('login'))
  const loginErrorMsg = ref<boolean>(false)
  const loginErrorText = ref<string>()
  const loginErrorTitle = ref<string>()
  const loginErrorType = ref<string>()
  const statusCode = ref<string>()
  /**
   * 用户登录校验
   * @param formRef 表单校验
   */
  const SignIn = async (formRef: InstanceType<typeof NForm>): Promise<{ success: boolean; needSelectTenant?: boolean } | undefined> => {
    /*使用按钮禁用的方式来实现按钮节流*/
    disabled.value = true
    /*初始化登录错误提示*/
    loginErrorMsg.value = false

    try {
      await formRef?.validate()

      loginText.value = t('in_check')
      signInLoading.value = true
      Loading.pulse()

      try {
        const { password, userName } = formRef.model
        const remember = { password, userName } as any

        // 获取设备指纹
        const clientId = await getEnhancedFingerprint()

        const loginParams: LoginParams = {
          account: userName,
          password,
          grantType: 'PASSWORD',
          clientId,
          systemType: 1, // 1-账号密码登录，2-IM聊天系统登录
          deviceType: 'PC' // PC 或 MOBILE
        }

        const result = await userInfoStore.login(loginParams)

        if (result.success) {
          // 用户是否选择记住我
          if (rememberOption.value) {
            rememberStore.setRememberUser(remember, rememberOption.value)
          } else {
            rememberStore.deleteRemember()
          }

          // 登录成功，返回 needSelectTenant 标志
          // 由登录页面处理租户选择逻辑
          loginText.value = t('login')
          signInLoading.value = false
          disabled.value = false
          Loading.remove()

          return { success: true, needSelectTenant: result.needSelectTenant }
        } else {
          // 登录失败
          Loading.remove()
          loginText.value = t('login')
          signInLoading.value = false
          disabled.value = false

          nextTick(() => {
            loginErrorMsg.value = true
            loginErrorText.value = result.message || t('login_error')
            loginErrorTitle.value = t('account_error')
          })

          return { success: false }
        }
      } catch (error: any) {
        console.error('登录失败:', error)
        Loading.remove()
        loginText.value = t('login')
        signInLoading.value = false
        disabled.value = false

        nextTick(() => {
          loginErrorMsg.value = true
          loginErrorText.value = error.message || t('login_error')
          loginErrorTitle.value = t('login_error')
        })

        return { success: false }
      }
    } catch (error) {
      // 表单验证失败
      Loading.remove()
      disabled.value = false
      return undefined
    }
  }

  /**
   * 用户注销
   * @param notifi 是否显示提示
   */
  const exit = async (notifi = true) => {
    try {
      await userInfoStore.logout()
      tabsStore.resetState()
      if (notifi) {
        window.$notification.success({
          title: t('logout'),
          duration: 1500,
          keepAliveOnHover: true
        })
      }
    } catch (error) {
      console.error('退出登录失败:', error)
      if (notifi) {
        window.$notification.error({
          title: t('logout_error'),
          duration: 1500,
          keepAliveOnHover: true
        })
      }
    }
  }
  /*弹出验证码输入框*/
  const handleCodeInput = async (formInstance: any) => {
    await formInstance?.validate().then(() => {
      // sendEmail(formInstance.model.email).then((res) => {
      //   if (res.code === RCodeEnum.OK) {
      //     /*关闭输入邮箱弹框*/
      //     showModal.value = false
      //     nextTick(() => {
      //       animation.value = 'modal-container animate__animated animate__jackInTheBox'
      //       showCode.value = true
      //     })
      //   } else {
      //     emailMsg.value = res.msg
      //   }
      // })
    })
  }

  return {
    signInLoading,
    formRef,
    ruleForm,
    loginText,
    rememberOption,
    disabled,
    loginErrorMsg,
    loginErrorText,
    loginErrorTitle,
    loginErrorType,
    statusCode,
    showModal,
    showCode,
    ruleEmail,
    emailMsg,
    codeMsg,
    SignIn,
    handleCodeInput,
    exit
  }
}
