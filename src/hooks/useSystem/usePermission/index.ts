import { addPermissions, deletePermission, editPermissions, permissionTree } from '@/api/permission'
import { nextTick, ref } from 'vue'
import typeState from '@/hooks/useState'
import useModal from '@/hooks/useModal'
import type { deleteId, permission } from '@/interface/IPermission'
import { useAction } from '@/hooks/useAction'
import { getIconList } from '@/api/dict'
import { i18n } from '@/i18n'

const { t } = i18n.global
/*解构状态类型参数*/
const {
  loading,
  drawer,
  verify,
  disabled,
  AddOrEdit,
  ruleFormRef,
  showModal,
  icons,
  state,
  deleteDisabled,
  originalForm,
  alertType,
  alert,
  alertTitle,
  alertContent,
  isExpand,
  refreshTable
} = typeState
const input = ref<string>('')
const tableData = ref<any>([])
/*菜单页面父级下拉框数组*/
const MenuPidOptions = ref<any[]>([])
/*页面按钮父级下拉框数组*/
const BtnPidOptions = ref<any[]>([])
// 是否展开按钮的文字
const expandText = ref(t('expand_all'))

// const tableRow = ({}: {}) => {
// 	return ''
// }
//判断表格中的数据是否符合标准
export let tableRowPermissionClassName: ({ row, rowIndex }: { row: permission; rowIndex: number }) => void = ({
  row
}: {
  row: permission
  rowIndex: number
}) => {
  if (row.type === 1) {
    return 'danger-row animate__animated animate__backInDown'
  } else if (row.type === 2) {
    return 'warning-row animate__animated animate__backInDown'
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

// 加载方法
const load = async () => {
  loading.value = true
  const res = await permissionTree()
  if (res.code === '00000') {
    tableData.value = res.data
    /*加载时候就初始化*/
    getMenuPagePid()
    getPageBtnPid()
    await getIcons()
    await nextTick(() => {
      loading.value = false
    })
  } else {
    // ElMessage({
    // 	message: res.msg,
    // 	grouping: true,
    // 	type: 'error',
    // })
  }
}

//新增权限
const AddPermission = async (formEl: any) => {
  verify.value = true
  if (!formEl) return
  await formEl.validate((valid: any) => {
    if (valid) {
      addPermissions(state.form).then((res) => {
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
const EditPermissions = async (formEl: any) => {
  // 检查表单内容是否被修改的方法
  const { checkModification } = useAction()
  if (checkModification(state.form)) {
    verify.value = true
    if (!formEl) return
    await formEl.validate((valid: any) => {
      if (valid) {
        editPermissions(state.form).then((res) => {
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
            verify.value = false
          }
        })
      } else {
        verify.value = false
      }
    })
  }
}

// 逻辑删除权限
const confirmDeletePermission = async (userId: deleteId) => {
  deleteDisabled.value = true
  await deletePermission(userId).then((res) => {
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
      tableRowPermissionClassName = ({ row }: { row: permission }) => {
        if (row.id === userId) {
          return 'animate__animated animate__bounceOutRight'
        }
        if (row.type === 1) {
          return 'danger-row animate__animated animate__backInDown'
        } else if (row.type === 2) {
          return 'warning-row animate__animated animate__backInDown'
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

// 隐藏 权限
const changeHide = (row: any) => {
  editPermissions(row).then((res) => {
    if (res.code === '00000') {
      load()
      // ElMessage({
      // 	message: res.msg,
      // 	grouping: true,
      // 	type: 'success',
      // })
    } else {
      // ElMessage({
      // 	message: res.msg,
      // 	grouping: true,
      // 	type: 'error',
      // })
    }
  })
}

/*获取到是菜单页面的父级id*/
const getMenuPagePid = () => {
  const allData: any[] = []
  tableData.value.forEach((item: any) => {
    if (item.type === 1) {
      allData.push({ id: item.id, name: item.name, type: item.type })
      MenuPidOptions.value = allData
    }
  })
}

/*获取到是页面按钮的父级id*/
const getPageBtnPid = () => {
  const allData: any[] = []
  tableData.value.forEach((item: any) => {
    /*这里是判断是否在目录下并且是否有页面的存在，当父菜单是一个页面并且没有目录的时候那就没有必要给分配按钮权限了*/
    if (item.children && item.children.length > 0) {
      item.children.forEach((child: any) => {
        if (child.type === 2) {
          allData.push({ id: child.id, name: child.name, type: child.type })
          BtnPidOptions.value = allData
        }
      })
    }
  })
}

/*获取图标列表*/
const getIcons = async () => {
  await getIconList().then((res) => {
    icons.value = res.data
  })
}

/*控制是否展开所有子菜单*/
const handleExpand = () => {
  refreshTable.value = false
  expandText.value = isExpand.value ? t('expand_all') : t('shrink_all')
  isExpand.value = !isExpand.value
  nextTick(() => {
    refreshTable.value = true
  })
}

export default () => ({
  tableData,
  loading,
  disabled,
  drawer,
  ruleFormRef,
  verify,
  MenuPidOptions,
  BtnPidOptions,
  isExpand,
  input,
  alert,
  deleteDisabled,
  state,
  alertTitle,
  alertType,
  alertContent,
  AddOrEdit,
  showModal,
  icons,
  refreshTable,
  expandText,
  userClose,
  handleClose,
  load,
  // tableRow,
  tableRowPermissionClassName,
  AddPermission,
  EditPermissions,
  confirmDeletePermission,
  changeHide,
  handleExpand
})
