<template>
  <div class="login">
    <h1>{{ t('login') }} HuLa</h1>
    <!-- 登录错误提示框 -->
    <div style="padding: 0 10px 10px 5px">
      <AlertIze
        img-url="./src/assets/svg/error.svg"
        :text="loginErrorText"
        :title="loginErrorTitle"
        :show="loginErrorMsg"
        :enter-active="'animate__animated animate__bounceIn'"
        :leave-active="'animate__animated animate__hinge'"
        @alertOff="loginErrorMsg = false" />
    </div>
    <!-- 登录表单 -->
    <n-card class="form">
      <n-form ref="formRef" :show-require-mark="false" :rules="rules as any" :model="ruleForm">
        <div style="margin: 10px 0">
          <!--租户选中框-->
          <n-form-item path="tenantName" :label="t('tenant')" label-style="font-size: 14px;color: #cccccc">
            <n-select
              v-model:value="ruleForm.tenantName"
              v-model:show="showSelect"
              :placeholder="t('select')"
              :loading="loadingSelect"
              @focus="handleShowSelect"
              :render-label="renderLabel"
              :render-tag="renderSingleSelectTag"
              @updateValue="handleUpdateValue"
              clearable
              remote
              :options="selectData">
              <template #arrow>
                <transition name="slide-left">
                  <Cloud v-if="showSelect" />
                  <BuildingSkyscraper v-else />
                </transition>
              </template>
            </n-select>
          </n-form-item>
          <!--用户名输入框-->
          <n-form-item path="userName" :label="t('un_or_el')" label-style="font-size: 14px;color: #cccccc">
            <n-input
              clearable
              :allow-input="Common.noSideSpace"
              @keydown.enter="SignIn(formRef)"
              v-model:value="ruleForm.userName"
              style="border-radius: 8px"
              :placeholder="t('input_username_email')">
              <template #prefix>
                <n-icon color="#000"><User /></n-icon>
              </template>
            </n-input>
          </n-form-item>
          <!--忘记密码-->
          <div class="paw-title">
            <p style="font-size: 14px; color: #cccccc">{{ t('password') }}</p>
            <n-popover trigger="hover">
              <template #trigger>
                <p style="font-size: 12px; color: #337ecc; cursor: pointer" @click="changePawBox">
                  {{ t('forgot_password') }}
                </p>
              </template>
              <img src="@/assets/svg/forgotPwd.svg" style="width: 140px; height: 140px" alt="" />
            </n-popover>
          </div>
          <!--密码输入框-->
          <n-form-item :validation-status="ValidationStatus" path="password" :label="t('password')" :show-label="false">
            <n-input
              show-password-on="mousedown"
              type="password"
              clearable
              :allow-input="Common.noSideSpace"
              :loading="loadingPaw"
              @keydown.enter="SignIn(formRef)"
              v-model:value="ruleForm.password"
              style="border-radius: 8px"
              :placeholder="t('input_paw')">
              <template #prefix>
                <n-icon color="#000"><Lock /></n-icon>
              </template>
            </n-input>
          </n-form-item>
          <!--记住我-->
          <n-checkbox
            :on-update:checked="() => (rememberOption = !rememberOption)"
            :checked="rememberOption"
            style="margin: 5px 0 10px 5px">
            <n-text depth="3">{{ t('remember_me') }}</n-text>
          </n-checkbox>
        </div>

        <n-button
          @click="SignIn(formRef)"
          :disabled="disabled"
          :loading="signInLoading"
          type="primary"
          style="width: 100%; border-radius: 10px">
          {{ loginText }}
        </n-button>
      </n-form>
    </n-card>
    <n-card class="FirstVisit" hoverable>
      <n-space>
        <h1>{{ t('et_problems') }}</h1>
        <h2>{{ t('contact_admin') }}</h2>
      </n-space>
    </n-card>
    <div class="BottomBar">
      <div style="display: flex; margin: 20px 10px 20px 10px; justify-content: center">
        <n-popover placement="top" trigger="hover">
          <template #trigger>
            <n-a style="font-size: 12px; margin: 0 10px">{{ t('author') }}</n-a>
          </template>
          <template #default>
            <div class="link-content">
              <h1>{{ t('lead_developer') }}：</h1>
              <p>nyh</p>
            </div>
          </template>
        </n-popover>
        <n-popover placement="top" trigger="hover">
          <template #trigger>
            <n-a style="font-size: 12px; margin: 0 10px" type="primary">{{ t('contact') }}</n-a>
          </template>
          <template #default>
            <div class="link-content">
              <h1>QQ：</h1>
              <p>2439646234</p>
            </div>
          </template>
        </n-popover>
        <n-popover placement="top" trigger="hover">
          <template #trigger>
            <n-a style="font-size: 12px; margin: 0 10px" type="info">{{ t('technology') }}</n-a>
          </template>
          <template #default>
            <div class="Technology-content">
              <div>
                <h1>{{ t('frontend') }}</h1>
                <n-a type="success" @click="linkOpen(vue3)">Vue3</n-a><br />
                <n-a type="success" @click="linkOpen(vite)">Vite4</n-a><br />
                <n-a type="success" @click="linkOpen(TypeScript)">TypeScript</n-a><br />
                <n-a type="success" @click="linkOpen(pinia)">Pinia</n-a><br />
              </div>
              <div>
                <h1>{{ t('backend') }}</h1>
                <n-a type="primary" @click="linkOpen(SpringBoot)">SpringBoot3.X</n-a><br />
                <n-a type="primary" @click="linkOpen(redis)">Redis</n-a><br />
                <n-a type="primary" @click="linkOpen(MP)">MybatisPlus</n-a><br />
                <n-a type="primary" @click="linkOpen(druid)">Druid</n-a><br />
                <n-a type="primary" @click="linkOpen(saToken)">Sa-token</n-a><br />
              </div>
            </div>
          </template>
        </n-popover>
      </div>
      <p>Copyright © 2023-2024 HuLa.All Rights Reserved.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { i18n } from '@/i18n'
import { mainStore } from '@/stores/main'
import { remember } from '@/stores/remember'
import { tenant } from '@/stores/tenant'
import typeState from '@/hooks/useState'
import { storeToRefs } from 'pinia'
import check from '@/hooks/useCheck'
import useModal from '@/hooks/useModal'
import { useLogin } from '@/hooks/useLogin'
import { animation } from '@/components/modal/type'
import { Lock, User, BuildingSkyscraper, Cloud } from '@vicons/tabler'
import { AlertIze } from '@/customize'
import { delay } from 'lodash-es'
import apis from '@/services/apis'
import type { SelectGroupOption, SelectOption, SelectRenderTag, SelectRenderLabel } from 'naive-ui'
import { NText, NAvatar } from 'naive-ui'
import { Common } from '@/utils/Common'

const { t } = i18n.global
const store = mainStore()
const rememberStore = remember()
const tenantStore = tenant()
/*验证码输入框内容*/
const code = ref('')

const showSelect = ref()
const loadingSelect = ref(false)
const selectData = ref<Array<SelectOption | SelectGroupOption>>([])
/*选中租户之后就存入localStorage*/
const handleUpdateValue = (value: string, option: SelectOption) => {
  if (option) {
    const data = { label: option.label, value: option.value }
    tenantStore.setTenant(data)
  }
}
const renderSingleSelectTag: SelectRenderTag = ({ option }) => {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center'
      }
    },
    [
      h(NAvatar, {
        src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
        round: true,
        size: 24,
        style: {
          marginRight: '12px'
        }
      }),
      option.label as string
    ]
  )
}
const renderLabel: SelectRenderLabel = (option) => {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center'
      }
    },
    [
      h(NAvatar, {
        src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
        round: true,
        lazy: true
      }),
      h(
        'div',
        {
          style: {
            marginLeft: '12px',
            padding: '4px 0'
          }
        },
        [
          h('div', null, [option.label as string]),
          h(
            NText,
            { depth: 3, tag: 'div', style: { fontSize: '11px', transform: 'scale(1)' } },
            {
              default: () => option.address
            }
          )
        ]
      )
    ]
  )
}
/*处理输入空格事件*/
// const noSideSpace = (value: string) => {
//   return !value.startsWith(' ') && !value.endsWith(' ')
// }

type Itenant = {
  companyName: string
  tenantId: string
  address: string
  packageId: string
  status: '0' | '1'
  expireTime: string
}
/*点击选中框后进行异步查询选项框内容*/
const handleShowSelect = () => {
  if (selectData.value.length > 0) return
  loadingSelect.value = true
  delay(() => {
    apis.getTenantList().then((r: any) => {
      // 使用一个 Map 来存储 group 的数据，以 flag 作为键
      const groupMap = new Array<{ label: string; value: string; address?: string; disabled?: boolean }>()
      // 遍历角色数据并更新 groupMap
      r.data.forEach((value: Itenant) => {
        // 找到对应的组，将数据添加到 children 中
        groupMap.push({
          label: value.companyName,
          value: value.tenantId,
          address: value.address,
          disabled: value.status === '1'
        })
      })
      selectData.value = Array.from(groupMap.values())
      loadingSelect.value = false
    })
  }, 300)
}
const { loadingPaw, ValidationStatus } = typeState
const { TEXT_COLOR } = storeToRefs(store)
const {
  signInLoading,
  formRef,
  loginText,
  loginErrorTitle,
  showModal,
  ruleForm,
  loginErrorText,
  loginErrorMsg,
  disabled,
  ruleEmail,
  rememberOption,
  SignIn
} = useLogin()
const { validateLoginUsername, validatePassword } = check()
/*引入全局的关闭方法*/
const { close } = useModal()

const rules = reactive({
  userName: { required: true, asyncValidator: validateLoginUsername, trigger: 'blur' },
  password: { required: true, asyncValidator: validatePassword, trigger: 'blur' },
  tenantName: { required: true, message: t('choose'), trigger: ['blur', 'change'] }
})

const linkList = reactive<any>({
  FrontEnd: [
    'https://cn.vuejs.org/',
    'http://www.vitejs.net/',
    'https://www.typescriptlang.org/',
    'https://pinia.web3doc.top/'
  ],
  BackEnd: [
    'https://spring.io/projects/spring-boot',
    'https://redis.io/',
    'https://baomidou.com/',
    'https://druid.apache.org/druid.html',
    'https://sa-token.cc/doc.html#/'
  ]
})
const [vue3, vite, TypeScript, pinia] = linkList.FrontEnd
const [SpringBoot, redis, MP, druid, saToken] = linkList.BackEnd
//使用新窗口打开链接
const linkOpen = (val: any) => {
  window.open(val)
}

/*弹出忘记密码修改框*/
const changePawBox = () => {
  ruleEmail.email = ''
  animation.value = 'modal-container animate__animated animate__flipInX'
  showModal.value = true
}

/*获取用户是否点击了记住*/
const handleRemember = () => {
  if (rememberStore.getRemember) {
    const { userName, password, rememberMe } = rememberStore.getRemember
    ruleForm.userName = userName
    ruleForm.password = password
    rememberOption.value = rememberMe
  }
}
/*获取存储本地的租户*/
const handleTenant = () => {
  if (tenantStore.getTenant) {
    const { value, label } = tenantStore.getTenant
    ruleForm.tenantName = label
    ruleForm.tenantId = value
  }
}

onMounted(() => {
  handleRemember()
  handleTenant()
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/login';

.login h1 {
  color: v-bind(TEXT_COLOR);
}
/*选择框样式*/
:deep(.n-base-selection) {
  border-radius: 8px;
}
</style>
