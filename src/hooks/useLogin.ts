import { userStore } from '@/stores/user'
import useState from '@/hooks/useState'
import { i18n } from '@/i18n'
import router from '@/router'
import { FormInst } from 'naive-ui'
import { animation } from '@/components/modal/type'
import { sendEmail } from '@/api/passwordReset'
import { remember } from '@/stores/remember'
import apis from '@/services/apis'
import { RCodeEnum } from '@/enums'
import type { Response } from '@/services/types'
import { Loading } from 'notiflix'
import { delay } from 'lodash-es'

export const useLogin = () => {
  //定义初始化数据
  const userInfoStore = userStore()
  const rememberStore = remember()
  const { t } = i18n.global
  const { disabled, showModal, showCode } = useState
  disabled.value = false
  const signInLoading = ref<boolean>(false)
  const formRef = ref<FormInst | null>(null)
  const ruleForm = reactive({
    userName: '',
    password: ''
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
  const loginErrorType = ref()
  const loginErrorTitle = ref()
  const statusCode = ref()
  /**
   * 用户登录校验
   * @param formInstance 表单校验
   */
  const SignIn = async (formInstance: any) => {
    /*使用按钮禁用的方式来实现按钮节流*/
    disabled.value = true
    /*初始化登录错误提示*/
    loginErrorMsg.value = false
    await formInstance
      ?.validate()
      .then(() => {
        loginText.value = t('in_check')
        signInLoading.value = true
        Loading.pulse()
        apis.login(formInstance.model).then((res: Response) => {
          if (res.code === RCodeEnum.OK) {
            //将res中的数据传给pinia做持久化
            userInfoStore.setLoginInfo(res.data)
            // 用户是否选择记住我
            if (rememberOption.value) {
              rememberStore.setRememberUser(formInstance.model, rememberOption.value)
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
          } else {
            Loading.remove()
            loginText.value = t('login')
            signInLoading.value = false
            disabled.value = false
            nextTick(() => {
              loginErrorMsg.value = true
              loginErrorText.value = res.msg
              if (res.code === RCodeEnum.FAIL) {
                statusCode.value = res.code
                loginErrorType.value = 'warning'
                loginErrorTitle.value = t('account_error')
              } else {
                statusCode.value = res.code
                loginErrorType.value = 'error'
                loginErrorTitle.value = t('login_error')
              }
            })
          }
        })
      })
      .catch(() => {
        Loading.remove()
        disabled.value = false
      })
  }

  /**
   * 用户注销
   * @param exitUserId uid
   */
  const exit = async (exitUserId: string) => {
    await apis.logout(exitUserId).then((res) => {
      if (res.code === RCodeEnum.OK) {
        window.$notification.success({
          title: res.msg,
          duration: 1500,
          keepAliveOnHover: true
        })
      } else {
        window.$notification.error({
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
      sendEmail(formInstance.model.email).then((res) => {
        if (res.code === RCodeEnum.OK) {
          /*关闭输入邮箱弹框*/
          showModal.value = false
          nextTick(() => {
            animation.value = 'modal-container animate__animated animate__jackInTheBox'
            showCode.value = true
          })
        } else {
          emailMsg.value = res.msg
        }
      })
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
    loginErrorType,
    loginErrorTitle,
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
