/*封装分页参数*/

//当前页码数
const pageNum = ref<number>(1)
//分页每页条数
const pageSize = ref<number>(10)
//总数量
const total = ref<any>()

export default {
  pageNum,
  pageSize,
  total
}
