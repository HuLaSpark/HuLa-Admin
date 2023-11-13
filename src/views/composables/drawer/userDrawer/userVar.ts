import { i18n } from '@/i18n'
import { FormInst, SelectGroupOption, SelectOption } from 'naive-ui'
import { ButtonType, pageUser, UpdateUser } from '@/services/types'
import { CircleCheck } from '@vicons/tabler'

const { t } = i18n.global
const input = ref()
const showModal = ref<boolean>(false)
const drawerShow = ref<boolean>(false)
const formRef = ref(<FormInst>{})
const showSelect = ref<boolean>(false)
const loadingSelect = ref<boolean>(false)
const loadingBut = ref<boolean>(false)
const butText = ref()
const butType = ref<ButtonType>('primary')
const butIcon = shallowRef<object>(CircleCheck)
const iconShow = ref(false)
const selectData = ref<Array<SelectOption | SelectGroupOption>>([])
/*编辑框中的数据*/
const editedData = ref(<pageUser>{})
/*没有进行编辑时的数据*/
const rawData = ref(<pageUser>{})
// /*表格的数据*/
// const state = reactive({
//   form: {} as User
// })
/*校验规则*/
const rules = reactive({
  userName: { required: true, message: t('user_name') + t('no_null'), trigger: 'blur' },
  email: { required: true, message: t('email') + t('no_null'), trigger: 'blur' }
})

export default () => ({
  input,
  showModal,
  showSelect,
  formRef,
  loadingSelect,
  loadingBut,
  butText,
  butType,
  butIcon,
  iconShow,
  selectData,
  rules,
  drawerShow,
  editedData,
  rawData
})
