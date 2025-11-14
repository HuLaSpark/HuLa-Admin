/*封装所有状态类型的变量*/

//是否禁用
const disabled = ref<boolean>(true)
//是否显示图标
const showIcon = ref<boolean>(true)
//是否显示校验状态
const verify = ref<boolean>(false)
//是否显示加载状态
const loading = ref<boolean>(false)
//是否打开模态框
const showModal = ref<boolean>(false)
//是新增还是编辑
const AddOrEdit = ref<string>('')
//数据校验状态
const ruleFormRef = ref<any>()
/*删除确认框状态*/
const deleteDisabled = ref<boolean>(false)
// 在编辑操作中保存原始表单的值
const originalForm = ref<any>({})
// 在编辑操作中保存原始的权限树
const originalTree = ref()
//表单数据
const state = reactive<any>({
  form: {}
})
// alert 提示状态
const alert = ref<boolean>(false)
// alert 标题内容
const alertTitle = ref()
// alert 提示类型
const alertType = ref()
// alert 提示内容
const alertContent = ref<string>()
// 密码复杂度提示框
const complexityShow = ref<boolean>(false)
// 是否展开树形菜单
const isExpand = ref(false)
// 是否显示表格
const refreshTable = ref(true)
// 密码复杂度的tag标签的样式
const tagType1 = ref('info')
const tagType2 = ref('info')
const tagType3 = ref('info')
/*输入密码的复杂度状态*/
const passwordComplexity = ref()
/*是否显示验证码输入框*/
const showCode = ref<boolean>(false)
/*图标下拉框数组*/
const icons = ref([])
/*交通标志下拉框数组*/
const trafficSigns = ref()
/*驾驶员信息下拉框数组*/
const drivers = ref()
/*车辆信息下拉框数组*/
const vehicles = ref()
/*车辆违章详细信息*/
const violationsInfo = ref()
/*违章是否处理*/
const isDispose = ref()
/*省份字典*/
const provinces = [
  '京',
  '津',
  '沪',
  '渝',
  '冀',
  '豫',
  '云',
  '辽',
  '黑',
  '湘',
  '皖',
  '鲁',
  '新',
  '苏',
  '浙',
  '赣',
  '鄂',
  '桂',
  '甘',
  '晋',
  '蒙',
  '陕',
  '吉',
  '闽',
  '贵',
  '粤',
  '青',
  '藏',
  '川',
  '宁',
  '琼'
]
/*输入框验证的状态*/
const ValidationStatus = ref()

export default {
  disabled,
  showIcon,
  verify,
  loading,
  showModal,
  AddOrEdit,
  ruleFormRef,
  state,
  deleteDisabled,
  originalForm,
  alert,
  alertTitle,
  alertType,
  alertContent,
  complexityShow,
  tagType1,
  tagType2,
  tagType3,
  passwordComplexity,
  showCode,
  icons,
  originalTree,
  trafficSigns,
  drivers,
  isExpand,
  refreshTable,
  vehicles,
  violationsInfo,
  isDispose,
  provinces,
  ValidationStatus
}
