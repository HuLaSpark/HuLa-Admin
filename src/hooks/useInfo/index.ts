import { nextTick, ref } from 'vue'
import { EditUser, getUserInfo } from '@/api/user'
import paging from '@/hooks/usePaging'
import typeState from '@/hooks/useState'
import axios from 'axios'
import { userStore } from '@/stores/user'
import { i18n } from '@/i18n'
import { useAction } from '@/hooks/useAction'
import { getAllRole } from '@/api/role'
import { animation } from '@/components/modal/type'
import router from '@/router'

//定义初始化数据
const infoDrawer = ref<boolean>()
const showInfoModal = ref<boolean>()
const { t } = i18n.global
const multipleSelection = ref<number[]>([])
const input = ref<string>('')
/*解构分页参数*/
const { pageNum, pageSize, total } = paging
/*解构状态类型参数*/
const {
  disabled,
  showIcon,
  verify,
  loading,
  AddOrEdit,
  ruleFormRef,
  state,
  deleteDisabled,
  originalForm,
  alertType,
  alert,
  alertTitle,
  alertContent
} = typeState
/*记录原头像地址*/
const originalAvatarUrl = ref<any>(null)
/*记录原始的用户名*/
const originalUserName = ref<any>()
/*角色数组*/
const roles = ref()
/*获取到pinia中保存的用户uid*/
const userInfoStore = userStore()
const user = userInfoStore.getUser
const { uid } = user
/*用户信息*/
const userInfo = ref()

/*用户抽屉框关闭*/
const userClose = () => {
  /*模态框取消和确认*/
  close().then(() => {
    infoDrawer.value = false
  })
}

const file = ref<any>(null)

//预览图片方法
const beforeUpload = (val: File) => {
  // 预览图片
  const reader = new FileReader()
  reader.readAsDataURL(val)
  reader.onload = () => {
    userInfo.value.url = reader.result as string
  }
  disabled.value = false
  // 保存文件对象
  file.value = val
  // 禁止自动上传
  return false
}

//等用户确定保存的时候再上传
const onSuccess = async (resolve: any) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL
  const user = userStore()
  const token = user.getBearerToken
  // 将file.value转为Blob类型
  const blob = new Blob([file.value as BlobPart], { type: file.value?.type })
  const files = new File([blob], file.value.name, { type: 'image/png' })
  const formData = new FormData()
  formData.append('file', files)
  const headers = { 'Content-Type': 'form-data', Authorization: `${token}` }
  /*这里传入原始的用户名*/
  await axios
    .post(BASE_URL + 'file/avatarUpload/' + originalUserName.value, formData, { headers })
    .then((r) => {
      // ElMessage.success('上传头像成功')
      userInfo.value.url = r.data.msg
      resolve()
    })
    .catch(() => {
      // ElMessage.error('上传头像失败')
    })
}

//编辑用户信息
const EditInfo = async (formEl: any) => {
  // 检查表单内容是否被修改的方法
  const { checkModification } = useAction()
  if (checkModification(userInfo.value)) {
    const currentAvatarUrl = userInfo.value.url // 获取当前选择的头像文件URL
    if (originalAvatarUrl.value !== currentAvatarUrl) {
      // 判断是否修改了头像
      await new Promise((resolve) => {
        onSuccess(resolve) // 执行上传头像操作
      })
    }
    await handleEdit(formEl)
  }
}

// 编辑用户信息主要方法
const handleEdit = async (formEl: any) => {
  showIcon.value = false
  verify.value = true
  if (!formEl) return
  await formEl.validate((valid: any) => {
    if (valid) {
      EditUser(userInfo.value).then((res) => {
        if (res.code === '00000') {
          load().then(() => {
            userInfoStore.setUser(userInfo.value)
            // TODO 暂时使用这个来刷新用户信息
            router.go(0)
          })
          infoDrawer.value = false
          // ElMessage({
          // 	message: res.msg,
          // 	grouping: true,
          // 	type: 'success',
          // })
          formEl.resetFields()
          showIcon.value = true
          verify.value = false
        } else {
          infoDrawer.value = false
          // ElMessage({
          // 	message: res.msg,
          // 	grouping: true,
          // 	type: 'error',
          // })
          formEl.resetFields()
          showIcon.value = true
          verify.value = false
        }
      })
    } else {
      showIcon.value = true
      verify.value = false
    }
  })
}

//判断用户是否已经输入内容，如果已经输入内容就弹出提示框
const handleClose = () => {
  JSON.stringify(userInfo.value) === JSON.stringify(originalForm.value)
    ? (infoDrawer.value = false)
    : (showInfoModal.value = true)
  alert.value = false
}

//加载数据
const load = async () => {
  await getUserInfo(uid).then((res) => {
    userInfo.value = res.data
  })
  // 加载角色列表
  await EditUserGetRole()
}

// 获取角色列表
const EditUserGetRole = async () => {
  await getAllRole().then((res) => {
    roles.value = res.data
  })
}

const cancel = async () => {
  /*取消后的动画*/
  animation.value = 'modal-container animate__animated animate__fadeOutDownBig'
  /*等待动画结束后才执行关闭模态框*/
  await nextTick(() => {
    showInfoModal.value = false
    /*重新初始化动画*/
    animation.value = 'modal-container animate__animated animate__shakeX'
  })
}
/*处理关闭模态框,关闭的时候初始化表单中的数据*/
const close = async () => {
  animation.value = 'modal-container animate__animated animate__fadeOutLeftBig'
  await nextTick(() => {
    showInfoModal.value = false
    animation.value = 'modal-container animate__animated animate__shakeX'
  })
}

export default () => ({
  AddOrEdit,
  disabled,
  ruleFormRef,
  showInfoModal,
  state,
  verify,
  showIcon,
  infoDrawer,
  input,
  loading,
  userInfo,
  total,
  pageNum,
  pageSize,
  deleteDisabled,
  originalAvatarUrl,
  originalUserName,
  alert,
  alertTitle,
  alertContent,
  alertType,
  roles,
  userClose,
  EditInfo,
  handleClose,
  cancel,
  load,
  beforeUpload
})
