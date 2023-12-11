import { i18n } from '@/i18n'
import { NForm, SelectGroupOption, SelectOption } from 'naive-ui'

const { t } = i18n.global
const input = ref()
const showModal = ref<boolean>(false)
const formRef = ref(<InstanceType<typeof NForm>>{})
const showSelect = ref<boolean>(false)
const loadingSelect = ref<boolean>(false)
const selectData = ref<Array<SelectOption | SelectGroupOption>>([])
// /*表格的数据*/
// const state = reactive({
//   form: {} as User
// })
/*校验规则*/
// TODO 角色校验规则待完善 (nyh-2023-11-24 07:40:26)
const rules = reactive({
  userName: {
    required: true,
    renderMessage: () => {
      return t('user_name') + t('no_null')
    },
    trigger: 'blur'
  },
  password: {
    required: true,
    renderMessage: () => {
      return t('password') + t('no_null')
    },
    trigger: 'blur'
  },
  role: {
    required: true,
    renderMessage: () => {
      return t('role_flag') + t('no_null')
    },
    trigger: ['blur', 'change']
  },
  email: {
    required: true,
    renderMessage: () => {
      return t('email') + t('no_null')
    },
    trigger: ['blur', 'change']
  }
})

export default () => ({
  input,
  showModal,
  showSelect,
  formRef,
  loadingSelect,
  selectData,
  rules
})
