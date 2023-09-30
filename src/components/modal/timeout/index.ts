import { animation } from '@/components/modal/type'
import router from '@/router'
import { userStore } from '@/stores/user'
import apis from '@/services/apis'
import { RCodeEnum } from '@/enums'

const show = ref<boolean>(false)
const msg = ref<string>()
const ruleForm = reactive({
  userName: '',
  password: ''
})
export const handleVerify = (Msg: any) => {
  show.value = true
  msg.value = Msg
}
/*验证密码是否正确*/
const verify = async () => {
  /*要在方法创建完成后才可以获取到pinia*/
  /*获取到pinia中的userInfoStore*/
  const userInfoStore = userStore()
  /*使用userInfoStore中的getUser获取用户信息*/
  const user = userInfoStore.getUser
  /*把user中的用户名赋值给ruleForm中*/
  ruleForm.userName = user.userName
  await apis.renew(ruleForm).then((res) => {
    if (res.code === RCodeEnum.OK) {
      animation.value = 'modal-container animate__animated animate__fadeOutLeftBig'
      window.$message.success(res.msg)
      nextTick(() => {
        show.value = false
        /*重定向到当前页面*/
        // router.push(window.location.pathname)
        router.go(0)
      })
    } else if (res.code === RCodeEnum.FAIL) {
      animation.value = 'modal-container animate__animated animate__fadeOutLeftBig'
      nextTick(() => {
        show.value = false
      })
    }
  })
}

export default () => ({
  show,
  msg,
  ruleForm,
  verify
})
