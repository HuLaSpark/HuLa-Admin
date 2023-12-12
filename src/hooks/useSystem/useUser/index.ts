import { nextTick, ref } from 'vue'
import { AddUser, DeleteBatch, DeleteUser, EditUser, UserPage } from '@/api/user'
import type { deleteId, User } from '@/interface/IUser'
import paging from '@/hooks/usePaging'
import typeState from '@/hooks/useState'
import useModal from '@/hooks/useModal'
import axios from 'axios'
import { userStore } from '@/stores/user'
import { i18n } from '@/i18n'
import { useAction } from '@/hooks/useAction'
import { getAllRole } from '@/api/role'

//定义初始化数据
const tableData = ref([])
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
  drawer,
  showModal,
  AddOrEdit,
  ruleFormRef,
  state,
  deleteDisabled,
  originalForm,
  alertType,
  alert,
  alertTitle,
  alertContent,
  complexityShow
} = typeState
/*记录原头像地址*/
const originalAvatarUrl = ref<any>(null)
/*记录原始的用户名*/
const originalUserName = ref<any>()
/*角色数组*/
const roles = ref()

/*用户抽屉框关闭*/
const userClose = () => {
  /*模态框取消和确认*/
  const { close } = useModal()
  close().then(() => {
    complexityShow.value = false
    drawer.value = false
  })
}

const file = ref<any>(null)

//预览图片方法
const beforeUpload = (val: File) => {
  // 预览图片
  const reader = new FileReader()
  reader.readAsDataURL(val)
  reader.onload = () => {
    state.form.url = reader.result as string
  }
  disabled.value = false
  // 保存文件对象
  file.value = val
  // 禁止自动上传
  return false
}

//等用户确定保存的时候再上传
const onSuccess = async (resolve: any) => {
  const VITE_SERVICE_URL = import.meta.env.VITE_SERVICE_URL
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
    .post(VITE_SERVICE_URL + 'file/avatarUpload/' + originalUserName.value, formData, { headers })
    .then((r) => {
      // ElMessage.success('上传头像成功')
      state.form.url = r.data.msg
      resolve()
    })
    .catch(() => {
      // ElMessage.error('上传头像失败')
    })
}

//创建用户
const AddInfo = async (formEl: any) => {
  showIcon.value = false
  verify.value = true
  if (!formEl) return
  await formEl.validate((valid: any) => {
    if (valid) {
      AddUser(state.form).then((res) => {
        if (res.code === '00000') {
          load()
          drawer.value = false
          // ElMessage({
          // 	message: '创建成功',
          // 	grouping: true,
          // 	type: 'success',
          // })
          //清空输入框内容
          formEl.resetFields()
          showIcon.value = true
          verify.value = false
        } else {
          drawer.value = false
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

//编辑用户信息
const EditInfo = async (formEl: any) => {
  // 检查表单内容是否被修改的方法
  const { checkModification } = useAction()
  if (checkModification(state.form)) {
    const currentAvatarUrl = state.form.url // 获取当前选择的头像文件URL
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
      EditUser(state.form).then((res) => {
        if (res.code === '00000') {
          load()
          drawer.value = false
          // ElMessage({
          // 	message: res.msg,
          // 	grouping: true,
          // 	type: 'success',
          // })
          formEl.resetFields()
          state.form.value = {}
          showIcon.value = true
          verify.value = false
        } else {
          drawer.value = false
          // ElMessage({
          // 	message: res.msg,
          // 	grouping: true,
          // 	type: 'error',
          // })
          formEl.resetFields()
          state.form.value = {}
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
  complexityShow.value = false
  if (AddOrEdit.value === 'Add') {
    JSON.stringify(state.form) === '{}' ? (drawer.value = false) : (showModal.value = true)
  } else {
    JSON.stringify(state.form) === JSON.stringify(originalForm.value)
      ? (drawer.value = false)
      : (showModal.value = true)
    alert.value = false
  }
}
// const tableRow = ({}: {}) => {
// 	return ''
// }
//判断表格中的数据是否符合标准
export let tableRowClassName: ({ row, rowIndex }: { row: User; rowIndex: number }) => void = ({
  row
}: {
  row: User
  rowIndex: number
}) => {
  if (row.role === 'sys_admin') {
    return 'danger-row animate__animated animate__backInDown'
  } else if (row.role === 'sys_gl') {
    return 'success-row animate__animated animate__backInDown'
  }
  return 'animate__animated animate__backInDown'
}

//加载数据 使用async/await es6语法糖来实现异步加载
const load = async () => {
  loading.value = true
  const res = await UserPage({
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    username: input.value
  })
  if (res.code === '00000') {
    setTimeout(() => {
      tableData.value = res.data.records
      total.value = res.data.total
      nextTick(() => {
        loading.value = false
      })
    }, 500)
  } else {
    // ElMessage({
    // 	message: res.msg,
    // 	grouping: true,
    // 	type: 'error',
    // })
  }
  // 加载角色列表
  await EditUserGetRole()
}

//删除方法
const confirmDelete = async (userId: deleteId, userName: any, uid: any) => {
  deleteDisabled.value = true
  await DeleteUser(userId, userName, uid).then((res) => {
    if (res.code === '00000') {
      load()
      // ElMessage({
      // 	message: res.data.msg,
      // 	grouping: true,
      // 	type: 'success',
      // })
      nextTick(() => {
        deleteDisabled.value = false
      })
      tableRowClassName = ({ row }: { row: User }) => {
        if (row.id === userId) {
          return 'animate__animated animate__bounceOutRight'
        }
        if (row.role === 'sys_admin') {
          return 'danger-row animate__animated animate__backInDown'
        } else if (row.role === 'sys_gl') {
          return 'success-row animate__animated animate__backInDown'
        }
        return 'animate__animated animate__backInDown'
      }
    } else {
      // ElMessage({
      // 	message: res.msg,
      // 	grouping: true,
      // 	type: 'error',
      // })
      deleteDisabled.value = false
    }
  })
}

//获取批量删除的数组
const handleDelAll = (val: number[]) => {
  multipleSelection.value = val
}

//批量删除
const deleteBatch = async () => {
  deleteDisabled.value = true
  const ids = multipleSelection.value.map((v) => (v as any).id)
  const usernames = multipleSelection.value.map((v) => (v as any).userName)
  const uids = multipleSelection.value.map((v) => (v as any).uid)
  if (ids.length === 0) {
    // ElMessage({
    // 	message: t('choose_id'),
    // 	grouping: true,
    // 	type: 'error',
    // })
    await nextTick(() => {
      deleteDisabled.value = false
    })
    return false
  }
  await DeleteBatch({ ids: ids, usernames: usernames, uids: uids }).then((res) => {
    if (res.code === '00000') {
      load()
      // ElMessage({
      // 	message: res.data.msg,
      // 	grouping: true,
      // 	type: 'success',
      // })
      nextTick(() => {
        deleteDisabled.value = false
      })
      tableRowClassName = ({ row }: { row: User }) => {
        for (let i = 0; i < ids.length; i++) {
          if (row.id === ids[i]) {
            return 'animate__animated animate__bounceOutRight'
          }
        }
        if (row.id >= 12) {
          return 'warning-row animate__animated animate__backInDown'
        } else if (row.userName === 'wmy') {
          return 'success-row animate__animated animate__backInDown'
        } else if (row.userName === 'nyh') {
          return 'danger-row animate__animated animate__backInDown'
        }
        return 'animate__animated animate__backInDown'
      }
    } else {
      // ElMessage({
      // 	message: res.msg,
      // 	grouping: true,
      // 	type: 'error',
      // })
      deleteDisabled.value = false
    }
  })
}

// 获取角色列表
const EditUserGetRole = async () => {
  await getAllRole().then((res) => {
    roles.value = res.data
  })
}

export default () => ({
  AddOrEdit,
  disabled,
  ruleFormRef,
  showModal,
  state,
  verify,
  showIcon,
  drawer,
  input,
  loading,
  tableData,
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
  complexityShow,
  roles,
  userClose,
  AddInfo,
  EditInfo,
  handleClose,
  // tableRow,
  load,
  handleDelAll,
  close,
  confirmDelete,
  deleteBatch,
  beforeUpload
})
