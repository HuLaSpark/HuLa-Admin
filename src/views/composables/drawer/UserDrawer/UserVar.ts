import { i18n } from '@/i18n'
import { FormInst, SelectGroupOption, SelectOption } from 'naive-ui'
import { User } from '@/services/types'

const { t } = i18n.global
const input = ref()
const showModal = ref<boolean>(false)
const drawerShow = ref<boolean>(false)
const formRef = ref(<FormInst>{})
const showSelect = ref<boolean>(false)
const loadingSelect = ref<boolean>(false)
const selectData = ref<Array<SelectOption | SelectGroupOption>>([])
/*编辑框中的数据*/
const editedData = ref(<User>{})
// /*表格的数据*/
// const state = reactive({
//   form: {} as User
// })
/*校验规则*/
const rules = reactive({
  userName: { required: true, message: t('user_name') + t('no_null'), trigger: 'blur' },
  email: { required: true, message: t('email') + t('no_null'), trigger: 'blur' },
  mobile: { required: true, message: t('phone_number') + t('no_null'), trigger: 'blur' }
})

export default () => ({
  input,
  showModal,
  showSelect,
  formRef,
  loadingSelect,
  selectData,
  rules,
  drawerShow,
  editedData
})
