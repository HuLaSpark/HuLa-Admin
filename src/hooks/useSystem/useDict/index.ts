import { nextTick, ref } from 'vue'
import paging from '@/hooks/usePaging'
import typeState from '@/hooks/useState'
import useModal from '@/hooks/useModal'
import { useAction } from '@/hooks/useAction'
import { deleteId, Dict } from '@/interface/IDict'
import { addDict, deleteBatchDict, deleteDict, dictPage, editDict } from '@/api/dict'
import { i18n } from '@/i18n'

/*解构分页参数*/
const { pageNum, pageSize, total } = paging
/*解构状态类型参数*/
const {
  loading,
  drawer,
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
const multipleSelection = ref<number[]>([])
const { t } = i18n.global

// const tableRow = ({}: {}) => {
// 	return ''
// }
//判断表格中的数据是否符合标准
export let tableRowClassName: ({ row, rowIndex }: { row: Dict; rowIndex: number }) => void = ({
  row
}: {
  row: Dict
  rowIndex: number
}) => {
  if (row.id >= 12) {
    return 'warning-row animate__animated animate__backInDown'
  } else if (row.id > 5) {
    return 'success-row animate__animated animate__backInDown'
  } else if (row.id > 10) {
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
  const res = await dictPage({
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    code: input.value
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
}

//新增字典
const AddDict = async (formEl: any) => {
  verify.value = true
  if (!formEl) return
  await formEl.validate((valid: any) => {
    if (valid) {
      addDict(state.form).then((res) => {
        if (res.code === '00000') {
          load()
          drawer.value = false
          // ElMessage({
          // 	message: t('add_success'),
          // 	grouping: true,
          // 	type: 'success',
          // })
          verify.value = false
        } else {
          drawer.value = false
          // ElMessage({
          // 	message: t('add_error'),
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

//编辑字典
const EditDict = async (formEl: any) => {
  // 检查表单内容是否被修改的方法
  const { checkModification } = useAction()
  if (checkModification(state.form)) {
    verify.value = true
    if (!formEl) return
    await formEl.validate((valid: any) => {
      if (valid) {
        editDict(state.form).then((res) => {
          if (res.code === '00000') {
            load()
            drawer.value = false
            // ElMessage({
            // 	message: t('edit_success'),
            // 	grouping: true,
            // 	type: 'success',
            // })
            formEl.resetFields()
            state.form.value = {}
            verify.value = false
          } else {
            drawer.value = false
            // ElMessage({
            // 	message: t('edit_error'),
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

//删除字典
const confirmDeleteDict = async (userId: deleteId) => {
  deleteDisabled.value = true
  await deleteDict(userId).then((res) => {
    if (res.code === '00000') {
      load()
      // ElMessage({
      // 	message: t('delete_success'),
      // 	grouping: true,
      // 	type: 'success',
      // })
      nextTick(() => {
        deleteDisabled.value = false
      })
      tableRowClassName = ({ row }: { row: Dict }) => {
        if (row.id === userId) {
          return 'animate__animated animate__bounceOutRight'
        }
        if (row.id >= 12) {
          return 'warning-row animate__animated animate__backInDown'
        } else if (row.id > 5) {
          return 'success-row animate__animated animate__backInDown'
        } else if (row.id > 10) {
          return 'danger-row animate__animated animate__backInDown'
        }
        return 'animate__animated animate__backInDown'
      }
    } else {
      // ElMessage({
      // 	message: t('delete_error'),
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
  await deleteBatchDict({ ids: ids }).then((res) => {
    if (res.code === '00000') {
      load()
      // ElMessage({
      // 	message: t('delete_batch_success'),
      // 	grouping: true,
      // 	type: 'success',
      // })
      nextTick(() => {
        deleteDisabled.value = false
      })
      tableRowClassName = ({ row }: { row: Dict }) => {
        for (let i = 0; i < ids.length; i++) {
          if (row.id === ids[i]) {
            return 'animate__animated animate__bounceOutRight'
          }
        }
        if (row.id >= 12) {
          return 'warning-row animate__animated animate__backInDown'
        } else if (row.id > 5) {
          return 'success-row animate__animated animate__backInDown'
        } else if (row.id > 10) {
          return 'danger-row animate__animated animate__backInDown'
        }
        return 'animate__animated animate__backInDown'
      }
    } else {
      // ElMessage({
      // 	message: t('delete_batch_error'),
      // 	grouping: true,
      // 	type: 'error',
      // })
      deleteDisabled.value = false
    }
  })
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
  load,
  AddDict,
  handleClose,
  userClose,
  EditDict,
  tableRowClassName,
  confirmDeleteDict,
  // tableRow,
  handleDelAll,
  deleteBatch
})
