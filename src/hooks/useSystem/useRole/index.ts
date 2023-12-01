import { addRole, deleteRole, editRole, rolePage } from '@/api/role'
import { nextTick, ref } from 'vue'
import paging from '@/hooks/usePaging'
import typeState from '@/hooks/useState'
import useModal from '@/hooks/useModal'
import type { deleteId, Role } from '@/interface/IRole'
import { useAction } from '@/hooks/useAction'
import { permissionTree } from '@/api/permission'
import { useLogin } from '@/hooks/useLogin'
import { userStore } from '@/stores/user'

/*解构分页参数*/
const { pageNum, pageSize, total } = paging
/*解构状态类型参数*/
const {
  loading,
  verify,
  disabled,
  AddOrEdit,
  ruleFormRef,
  showModal,
  state,
  deleteDisabled,
  originalForm,
  alertType,
  alert,
  alertTitle,
  alertContent
} = typeState
const input = ref<string>('')
const tableData = ref<any>([])
const roleTreeData = ref([])
/*选中权限节点的信息*/
const permissionTreeRef = ref()
/*获取用户的uid*/
const userInfoStore = userStore()
const uid = userInfoStore.getUserUId

// const tableRow = ({}: {}) => {
// 	return ''
// }
//判断表格中的数据是否符合标准
export let tableRowRoleClassName: ({ row, rowIndex }: { row: Role; rowIndex: number }) => void = ({
  row
}: {
  row: Role
  rowIndex: number
}) => {
  if (row.id >= 12) {
    return 'warning-row animate__animated animate__backInDown'
  } else if (row.flag === 'sys_admin') {
    return 'success-row animate__animated animate__backInDown'
  } else if (row.flag === 'sys_user') {
    return 'danger-row animate__animated animate__backInDown'
  }
  return 'animate__animated animate__backInDown'
}

/*用户抽屉框关闭*/
const userClose = () => {
  /*模态框取消和确认*/
  const { close } = useModal()
  close().then(() => {
    drawer.value = false
  })
}

//模态框
const handleClose = () => {
  AddOrEdit.value === 'Add'
    ? JSON.stringify(state.form) === '{}'
      ? (drawer.value = false)
      : (showModal.value = true)
    : JSON.stringify(state.form) === JSON.stringify(originalForm.value)
    ? (drawer.value = false)
    : (showModal.value = true)
}

//加载方法
const load = async () => {
  loading.value = true
  const res = await rolePage({
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    name: input.value
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
  /*获取角色权限*/
  await getRoleList()
}

//新增角色
const AddRoleInfo = async (formEl: any) => {
  verify.value = true
  if (!formEl) return
  await formEl.validate((valid: any) => {
    if (valid) {
      saveRole()
      addRole(state.form).then((res) => {
        if (res.code === '00000') {
          load()
          drawer.value = false
          // ElMessage({
          // 	message: '创建成功',
          // 	grouping: true,
          // 	type: 'success',
          // })
          verify.value = false
        } else {
          drawer.value = false
          // ElMessage({
          // 	message: res.msg,
          // 	grouping: true,
          // 	type: 'error',
          // })
          verify.value = false
        }
      })
    } else {
      disabled.value = false
      verify.value = false
    }
  })
}

//编辑角色信息
const EditRoleInfo = async (formEl: any) => {
  // 检查表单内容是否被修改的方法
  saveRole()
  const { checkTreeModification } = useAction()
  if (checkTreeModification()) {
    verify.value = true
    if (!formEl) return
    await formEl.validate((valid: any) => {
      if (valid) {
        editRole(state.form).then((res) => {
          if (res.code === '00000') {
            /*如果修改的角色是当前登录的用户的角色就重新登录*/
            if (userInfoStore.getRole === state.form.flag) {
              drawer.value = false
              // ElMessage({
              // 	message: '修改成功,请重新登录',
              // 	grouping: true,
              // 	type: 'success',
              // })
              formEl.resetFields()
              state.form.value = {}
              verify.value = false
              nextTick(() => {
                userInfoStore.logout()
                useLogin().exit()
              })
            } else {
              load()
              drawer.value = false
              // ElMessage({
              // 	message: '修改成功',
              // 	grouping: true,
              // 	type: 'success',
              // })
              formEl.resetFields()
              state.form.value = {}
              verify.value = false
            }
          } else {
            drawer.value = false
            // ElMessage({
            // 	message: res.msg,
            // 	grouping: true,
            // 	type: 'error',
            // })
            formEl.resetFields()
            state.form.value = {}
            verify.value = false
          }
        })
      } else {
        verify.value = false
      }
    })
  }
}

//删除角色
const confirmDeleteRole = async (userId: deleteId) => {
  deleteDisabled.value = true
  await deleteRole(userId).then((res) => {
    if (res.code === '00000') {
      load()
      // ElMessage({
      // 	message: res.msg,
      // 	grouping: true,
      // 	type: 'success',
      // })
      nextTick(() => {
        deleteDisabled.value = false
      })
      tableRowRoleClassName = ({ row }: { row: Role }) => {
        if (row.id === userId) {
          return 'animate__animated animate__bounceOutRight'
        }
        if (row.id >= 12) {
          return 'warning-row animate__animated animate__backInDown'
        } else if (row.flag === 'sys_admin') {
          return 'success-row animate__animated animate__backInDown'
        } else if (row.flag === 'sys_user') {
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

// 获取角色权限列表
const getRoleList = async () => {
  await permissionTree().then((res) => {
    roleTreeData.value = res.data
    /*禁用仪表盘的多选框*/
    roleTreeData.value[0] = Object.assign({}, roleTreeData.value[0], { disabled: true })
  })
}

// 保存角色信息
const saveRole = () => {
  // 目前选中的节点
  const checked = permissionTreeRef.value.getCheckedKeys()
  // 半选中节点
  const halfChecked = permissionTreeRef.value.getHalfCheckedKeys()
  // 组合全部节点
  // checked.unshift.apply(checked, halfChecked)
  state.form.permissionIds = checked
}

export default () => ({
  loading,
  tableData,
  pageNum,
  pageSize,
  total,
  drawer,
  state,
  AddOrEdit,
  verify,
  disabled,
  ruleFormRef,
  showModal,
  deleteDisabled,
  input,
  alertType,
  alert,
  alertTitle,
  alertContent,
  roleTreeData,
  permissionTreeRef,
  load,
  AddRoleInfo,
  handleClose,
  userClose,
  EditRoleInfo,
  tableRowRoleClassName,
  confirmDeleteRole
  // tableRow,
})
