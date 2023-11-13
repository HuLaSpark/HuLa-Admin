import paging from '@/hooks/usePaging'
import typeState from '@/hooks/useState'
import { pageUser, parameter, Response, User } from '@/services/types'
import { RCodeEnum } from '@/enums'
import { delay } from 'lodash-es'
import UserVar from '@/views/composables/drawer/userDrawer/userVar'

/*表格数据*/
const tableData = ref([])
/*判断是否有权限*/
const NoAccess = ref<boolean>(true)
/*搜索框*/
const input = ref<string>('')
/*解构分页参数*/
const { pageNum, pageSize, total } = paging
/*解构状态类型参数*/
const { verify, loading } = typeState
/*通用变量*/
const { editedData, rawData } = UserVar()

export const useBase = () => {
  const tableRowClassName: ({ row, rowIndex }: { row: User; rowIndex: number }) => void = ({
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

  /**
   * 普通加载数据方法
   * @param Fn 函数
   */
  const load = async (Fn: () => Promise<Response>) => {
    loading.value = true
    const res = await Fn()
    if (res.code === RCodeEnum.OK) {
      delay(() => {
        tableData.value = res.data.records
        nextTick(() => {
          loading.value = false
        })
      }, 500)
    } else {
      window.$message.error(res.msg)
    }
  }

  /**
   * 分页加载数据
   * @param fnPage 传递分页请求方法(需要传分页参数)
   * @param loadingBar 加载条
   * @param editId 编辑的数据的id
   */
  const pagingLoad = async (fnPage: (val: parameter) => Promise<Response>, loadingBar?: any, editId?: any) => {
    loadingBar?.start()
    loading.value = true
    const res = await fnPage({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      name: input.value
    })
    if (res.code !== RCodeEnum.OK) {
      loadingBar.error()
      loading.value = false
      if (res.code === RCodeEnum.FREEZE) return false
      if (res.code === RCodeEnum.UNAUTHORIZED) return (NoAccess.value = false)
      window.$message.error(res.msg)
      return false
    }
    delay(() => {
      tableData.value = res.data.records
      /*如果是编辑操作传过来的id需要进行判断*/
      if (editId) {
        const data = tableData.value.find((item: pageUser) => item.id === editId)
        Object.assign(rawData.value, data)
        Object.assign(editedData.value, data)
      }
      total.value = res.data.total
      nextTick(() => {
        loadingBar?.finish()
        loading.value = false
      })
    }, 500)
  }

  /**
   * 通用CRUD函数
   * @param formEl 表单校验参数
   * @param requestFn CRUD请求函数
   * @param fnPage 分页加载函数
   * @param successMsg 成功提示
   * @param errorMsg 错误提示
   */
  const performAction = async (
    formEl: any,
    requestFn: () => Promise<Omit<Response, 'data'> & { data: any }>,
    fnPage: (val: parameter) => Promise<Response>,
    successMsg?: string,
    errorMsg?: string
  ) => {
    verify.value = true

    if (!formEl) return
    await formEl?.validate().then(async () => {
      const res = await requestFn()
      if (res.code !== RCodeEnum.OK) {
        if (res.code === RCodeEnum.PARAM_ERROR) {
          return window.$message.error(res.data[0])
        }
        // 显示错误消息
        errorMsg ? window.$message.error(errorMsg) : window.$message.error(res.msg)
        return (verify.value = false)
      }
      successMsg ? window.$message.success(successMsg) : window.$message.success(res.msg)
      await pagingLoad(fnPage, window.$loadingBar, formEl.model.id)
    })
  }
  return {
    performAction,
    tableRowClassName,
    pagingLoad,
    tableData,
    total,
    loading,
    NoAccess
  }
}
