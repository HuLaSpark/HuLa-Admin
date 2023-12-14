import { userStore } from '@/stores/user'
import useState from '@/hooks/useState.ts'
import { i18n } from '@/i18n'
import router from '@/router'
import { NForm } from 'naive-ui'
import { remember } from '@/stores/remember'
import apis from '@/services/apis'
import { RCodeEnum } from '@/enums'
import { Loading } from 'notiflix'
import { delay } from 'lodash-es'
import { tenant } from '@/stores/tenant'
import { RSA } from '@/utils/RSA'
import { tabs } from '@/stores/tabs.ts'

export const useLogin = () => {
  //定义初始化数据
  const userInfoStore = userStore()
  const tabsStore = tabs()
  const rememberStore = remember()
  const tenantStore = tenant()
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
  /*加密的数据*/
  const cipherData = ref()
  /**
   * 用户登录校验
   * @param formRef 表单校验
   */
  const SignIn = async (formRef: InstanceType<typeof NForm>) => {
    /*使用按钮禁用的方式来实现按钮节流*/
    disabled.value = true
    /*初始化登录错误提示*/
    loginErrorMsg.value = false
    await formRef
      ?.validate()
      .then(async () => {
        loginText.value = t('in_check')
        signInLoading.value = true
        Loading.pulse()
        const { password, userName } = formRef.model
        const remember = { password, userName } as any
        const { value } = tenantStore.getTenant
        /*获取公钥*/
        const res = await apis.getPublicKey()
        if (res.code !== RCodeEnum.OK) {
          return window.$message.error(res.msg)
        }
        cipherData.value = RSA.encryptByPublicKey(JSON.stringify({ password, userName, tenantId: value }), res.msg)
        apis.login({ cipherData: cipherData.value }).then((res) => {
          if (res.code !== RCodeEnum.OK) {
            Loading.remove()
            loginText.value = t('login')
            signInLoading.value = false
            disabled.value = false
            nextTick(() => {
              loginErrorMsg.value = true
              loginErrorText.value = res.msg
              statusCode.value = res.code
              loginErrorTitle.value = res.code === RCodeEnum.FAIL ? t('account_error') : t('login_error')
            })
            return false
          }
          //将res中的数据传给pinia做持久化
          userInfoStore.setLoginInfo(res.data)
          // 用户是否选择记住我
          if (rememberOption.value) {
            rememberStore.setRememberUser(remember, rememberOption.value)
          } else {
            rememberStore.deleteRemember()
          }
          loginText.value = t('login')
          signInLoading.value = false
          /*登录成功后放开按钮禁用*/
          disabled.value = false
          delay(() => {
            Loading.remove()
            router.push('/')
            window.$notification.success({
              title: t('login_success'),
              duration: 1500,
              keepAliveOnHover: true
            })
          }, 300)
        })
      })
      .catch(() => {
        Loading.remove()
        disabled.value = false
      })
  }

  /**
   * 用户注销
   * @param notifi 是否显示提示
   */
  const exit = async (notifi = true) => {
    await apis.logout().then((res) => {
      if (res.code !== RCodeEnum.OK) {
        window.$notification.error({
          title: res.msg ? res.msg : t('logout_error'),
          duration: 1500,
          keepAliveOnHover: true
        })
        return false
      }
      userInfoStore.logout()
      tabsStore.resetState()
      if (notifi) {
        window.$notification.success({
          title: res.msg,
          duration: 1500,
          keepAliveOnHover: true
        })
      }
    })
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
