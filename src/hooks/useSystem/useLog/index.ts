import { nextTick, ref } from 'vue'
import paging from '@/hooks/usePaging'
import typeState from '@/hooks/useState'
import { Log } from '@/interface/ILog'
import { logPage } from '@/api/log'

/*解构分页参数*/
const { pageNum, pageSize, total } = paging
/*解构状态类型参数*/
const { loading, showModal, state, alert } = typeState
const input = ref<string>('')
const tableData = ref<any>([])

// const tableRow = ({}: {}) => {
// 	return ''
// }
//判断表格中的数据是否符合标准
export const tableRowClassName: ({ row, rowIndex }: { row: Log; rowIndex: number }) => void = ({
  row
}: {
  row: Log
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

//加载方法
const load = async () => {
  loading.value = true
  const res = await logPage({
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
}

export default () => ({
  loading,
  tableData,
  pageNum,
  pageSize,
  total,
  state,
  showModal,
  input,
  alert,
  load,
  tableRowClassName
  // tableRow,
})
