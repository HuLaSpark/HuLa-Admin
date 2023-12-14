import paging from '@/hooks/usePaging.ts'
import typeState from '@/hooks/useState.ts'
import { ButtonType, parameter, Response, User } from '@/services/types'
import { RCodeEnum } from '@/enums'
import { delay, isEqual } from 'lodash-es'
import { CircleCheck, CircleX } from '@vicons/tabler'
import { i18n } from '@/i18n'
import { NForm } from 'naive-ui'

const { t } = i18n.global
/*表格数据*/
const tableData = ref([])
/*判断是否有权限*/
const NoAccess = ref<boolean>(true)
/*搜索框*/
const input = ref<string>('')
/*解构分页参数*/
const { pageNum, pageSize, total } = paging
/*解构状态类型参数*/
const { loading } = typeState
/*编辑框中的数据*/
const contentData = ref(<any>{})
/*没有进行编辑时的数据*/
const rawData = ref(<any>{})
/*抽屉*/
const showDrawer = ref<boolean>(false)
/*模态框*/
const showModal = ref(false)

export const useBase = () => {
  /*全局通用按钮异常提示*/
  const butText = ref(t('save'))
  const butType = ref<ButtonType>('success')
  const butIcon = shallowRef<object>(CircleCheck)
  const iconShow = ref(false)
  const warn = ref()
  const showWarn = ref(false)
  /*end*/
  const loadingBut = ref<boolean>(false)

  /*监听国际化切换时实时切换语言*/
  watchEffect(() => {
    warn.value = t('alert_warning_description')
    /*监听表单是否被修改*/
    if (!isEqual(rawData.value, contentData.value)) {
      showWarn.value = false
    }
  })
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
  // const load = async (Fn: () => Promise<Response>) => {
  //   loading.value = true
  //   const res = await Fn()
  //   if (res.code === RCodeEnum.OK) {
  //     delay(() => {
  //       tableData.value = res.data.records
  //       nextTick(() => {
  //         loading.value = false
  //       })
  //     }, 500)
  //   } else {
  //     window.$message.error(res.msg)
  //   }
  // }

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
      userName: input.value
    })
    if (res.code !== RCodeEnum.OK) {
      loadingBar.error()
      loading.value = false
      if (res.code === RCodeEnum.STATE_EXCEPTION) return false
      if (res.code === RCodeEnum.UNAUTHORIZED) return (NoAccess.value = false)
      window.$message.error(res.msg ? res.msg : t('request_failed'))
      return false
    }
    tableData.value = res.data.records
    /*如果是编辑操作传过来的id需要进行判断*/
    if (editId) {
      const data = tableData.value.find((item: any) => item.id === editId)
      Object.assign(rawData.value, data)
      Object.assign(contentData.value, data)
    }
    total.value = res.data.total
    await nextTick(() => {
      loadingBar?.finish()
      loading.value = false
    })
  }

  /**
   * 通用增加和修改函数
   * @param formRef 表单校验参数
   * @param requestFn 请求函数
   * @param fnPage 分页加载函数
   * @param successMsg 成功提示
   * @param errorMsg 错误提示
   */
  const performAction = async (
    formRef: InstanceType<typeof NForm>,
    requestFn: () => Promise<Omit<Response, 'data'> & { data: any }>,
    fnPage: (val: parameter) => Promise<Response>,
    successMsg?: string,
    errorMsg?: string
  ) => {
    loadingBut.value = true

    if (!formRef) return
    await formRef
      ?.validate()
      .then(async () => {
        const res = await requestFn()
        if (res.code !== RCodeEnum.OK) {
          const errorText = res.code === RCodeEnum.PARAM_ERROR ? res.data[0] : errorMsg ? errorMsg : res.msg
          return throwError(errorText)
        }
        successMsg ? window.$message.success(successMsg) : window.$message.success(res.msg)
        await pagingLoad(fnPage, window.$loadingBar, formRef.model.id).then(() => {
          textChange(t('save_success'), CircleCheck)
          showWarn.value = false
          showModal.value = false
        })
      })
      .catch(() => {
        textChange(t('save_error'), CircleX, 'error')
      })
      .finally(() => {
        loadingBut.value = false
      })
  }
  /*封装通用错误消息*/
  const throwError = (message: string) => {
    window.$message.error(message)
    textChange(t('save_error'), CircleX, 'error')
  }

  /**
   * 全局处理保存按钮的提示
   * @param text 按钮文字
   * @param icon 按钮图标
   * @param type 按钮类型
   */
  const textChange = (text: string, icon?: object, type?: ButtonType) => {
    butText.value = text
    iconShow.value = true
    icon ? (butIcon.value = icon) : {}
    type ? (butType.value = type) : 'success'
    delay(() => {
      butText.value = t('save')
      butType.value = 'success'
      iconShow.value = false
    }, 2000)
  }

  return {
    performAction,
    tableRowClassName,
    pagingLoad,
    textChange,
    contentData,
    rawData,
    butText,
    butType,
    butIcon,
    iconShow,
    showWarn,
    warn,
    showDrawer,
    loadingBut,
    showModal,
    tableData,
    total,
    loading,
    NoAccess
  }
}
