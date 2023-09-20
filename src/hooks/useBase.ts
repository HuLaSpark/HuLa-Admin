import paging from '@/hooks/usePaging'
import typeState from '@/hooks/useState'
import { parameter, Response } from '@/services/types'
import { RCodeEnum } from '@/enums'
import { User } from '@/interface/IUser'
import { delay } from 'lodash-es'

export const useBase = () => {
  /*表格数据*/
  const tableData = ref([])
  /*判断是否有权限*/
  const NoAccess = ref<boolean>(true)
  /*搜索框*/
  const input = ref<string>('')
  /*解构分页参数*/
  const { pageNum, pageSize, total } = paging
  /*解构状态类型参数*/
  const { showIcon, verify, loading, drawer, state } = typeState

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
   */
  const pagingLoad = async (fnPage: (val: parameter) => Promise<Response>, loadingBar: any) => {
    loading.value = true
    const res = await fnPage({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      name: input.value
    })
    if (res.code === RCodeEnum.OK) {
      delay(() => {
        tableData.value = res.data.records
        total.value = res.data.total
        nextTick(() => {
          loadingBar.finish()
          loading.value = false
        })
      }, 500)
    } else {
      loadingBar.error()
      loading.value = false
      if (res.code === RCodeEnum.TIMEOUT) {
        return false
      }
      if (res.code === RCodeEnum.UNAUTHORIZED) {
        NoAccess.value = false
        return false
      } else {
        window.$message.error(res.msg)
      }
    }
  }

  /**
   * 通用CRUD函数
   * @param formEl 表单校验参数
   * @param requestFn CRUD请求函数
   * @param successMsg 成功提示
   * @param errorMsg 错误提示
   * @param fnPage 分页加载函数
   */
  const performAction = async (
    formEl: any,
    requestFn: (form: object) => Promise<Response>,
    successMsg: string,
    errorMsg: string,
    fnPage: (val: parameter) => Promise<Response>
  ) => {
    showIcon.value = false
    verify.value = true

    if (!formEl) return
    await formEl.validate(async (valid: any) => {
      if (valid) {
        const res = await requestFn(state.form)
        if (res.code === RCodeEnum.OK) {
          pagingLoad(fnPage, window.$loadingBar).then(() => {
            drawer.value = false
            // 显示成功消息
            if (successMsg) {
              window.$message.success(res.msg)
            }
            // 清空输入框内容
            formEl.resetFields()
            showIcon.value = true
          })
        } else {
          drawer.value = false
          // 显示错误消息
          if (errorMsg) {
            window.$message.error(res.msg)
          }
          formEl.resetFields()
          showIcon.value = true
          verify.value = false
        }
      } else {
        showIcon.value = true
        verify.value = false
      }
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
