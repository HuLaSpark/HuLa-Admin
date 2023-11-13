<template>
  <!--抽屉-->
  <n-drawer
    to="#drawer-target"
    v-model:show="drawerShow"
    :width="350"
    :on-mask-click="clone"
    :on-esc="clone"
    :close-on-esc="false">
    <n-drawer-content :title="t('edit')" :native-scrollbar="false">
      <!--自定义警告-->
      <AlertIze
        style="margin-bottom: 10px"
        img-url="./src/assets/svg/warning.svg"
        :enter-active="'animate__animated animate__bounceIn'"
        :leave-active="'animate__animated animate__fadeOutUp'"
        :title="t('warn')"
        :text="warn"
        :show="showWarn"
        @alertOff="showWarn = false" />

      <!--上传头像-->
      <n-space vertical align="center">
        <n-upload style="border-radius: 10px" list-type="image-card" :max="1">点击上传</n-upload>
      </n-space>

      <n-form ref="formRef" :model="editedData" :rules="rules" style="padding: 10px 0">
        <n-form-item :label="t('user_name')" path="userName">
          <n-input v-model:value="editedData.userName" :placeholder="t('placeholder')" />
        </n-form-item>
        <n-form-item :label="t('nick_name')">
          <n-input
            :status="editedData.nickName ? '' : 'warning'"
            v-model:value="editedData.nickName"
            :placeholder="t('placeholder')" />
        </n-form-item>
        <n-form-item :label="t('role_flag')" path="role">
          <n-select
            :render-tag="renderTag"
            v-model:value="editedData.role"
            v-model:show="showSelect"
            :placeholder="t('select')"
            :render-label="renderLabel"
            :loading="loadingSelect"
            :on-focus="handleShowSelect"
            clearable
            remote
            :options="selectData">
            <template #arrow>
              <transition name="slide-left">
                <UserCheck v-if="showSelect" />
                <UserSearch v-else />
              </transition>
            </template>
          </n-select>
        </n-form-item>
        <n-form-item :label="t('email')" path="email">
          <n-input disabled v-model:value="editedData.email" :placeholder="t('placeholder')" />
        </n-form-item>
        <n-form-item :label="t('phone_number')">
          <n-input
            disabled
            :status="handleStatus(editedData.mobile)"
            v-model:value="editedData.mobile"
            :placeholder="t('placeholder')" />
        </n-form-item>

        <n-space vertical :size="20">
          <n-space align="center">
            <span>创建于：</span>
            <n-tag :bordered="false" style="border-radius: 10px" type="primary">
              {{ handRelativeTime(editedData.createTime) }}
            </n-tag>
          </n-space>

          <n-space align="center">
            <span>最后一次活动：</span>
            <n-tag :bordered="false" style="border-radius: 10px" type="info">
              {{ handRelativeTime(editedData.updateTime) }}
            </n-tag>
          </n-space>
        </n-space>
      </n-form>
      <template #footer>
        <n-button style="width: 100%" :type="butType" :loading="loadingBut" secondary @click="saveData(formRef)">
          <template #icon>
            <n-icon v-if="iconShow" :component="butIcon" />
          </template>
          {{ butText }}
        </n-button>
      </template>
    </n-drawer-content>
  </n-drawer>

  <!--  模态框-->
  <Teleport to="body">
    <!-- 使用这个 modal 组件，传入 prop -->
    <modal :show="showModal" width="300px" @close="showModal = false">
      <template #header>
        <h3>{{ t('confirm_close') }}</h3>
      </template>
      <template #body>
        <p>{{ t('no_save') }}</p>
      </template>
      <template #footer>
        <div style="display: flex; align-content: center; justify-content: space-between">
          <n-button quaternary type="tertiary" @click="cancel">{{ t('cancel') }}</n-button>
          <n-button secondary type="error" @click="shutDown(formRef)">{{ t('close') }}</n-button>
        </div>
      </template>
    </modal>
  </Teleport>
</template>

<script setup lang="tsx">
import type { FormInst, SelectRenderTag, SelectOption } from 'naive-ui'
import { NTag, NIcon } from 'naive-ui'
import { i18n } from '@/i18n'
import Modal from '@/components/modal/index.vue'
import type { VNodeChild } from 'vue'
import { RCodeEnum, RoleEnum, RoleFixEnum } from '@/enums'
import { AlertCircle, LetterM, LetterR, LetterU, User, UserCheck, UserSearch } from '@vicons/tabler'
import { delay, isEqual } from 'lodash-es'
import { useBase } from '@/hooks/useBase'
import apis from '@/services/apis'
import paging from '@/hooks/usePaging'
import UserVar from './userVar'
import { ButtonType, pageUser, Response, Role, UpdateUser } from '@/services/types'
import { userStore } from '@/stores/user'
import { AlertIze, renderMessage } from '@/customize'
import { useAuth } from '@/hooks/useAuth'
import { handRelativeTime } from '@/utils/day'
import { animation } from '@/components/modal/type'

const { t } = i18n.global
const { pageNum, pageSize } = paging
const warn = ref()
const showWarn = ref(false)
const {
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
} = UserVar()
const { performAction } = useBase()
const { judgmentRole } = useAuth()
/*监听国际化切换时实时切换语言*/
watchEffect(() => {
  butText.value = t('save')
  warn.value = t('alert_warning_description')
  /*监听表单是否被修改*/
  if (!isEqual(rawData.value, editedData.value)) {
    showWarn.value = false
  }
})
function handleStatus(status: any) {
  return status === null ? 'warning' : ''
}
// const inputValidationStatus = computed(() => {
//   return createStatus(editedData.value)
// })

/*点击选中框后进行异步查询选项框内容*/
const handleShowSelect = () => {
  if (selectData.value.length > 0) return
  loadingSelect.value = true
  delay(() => {
    apis.getRoleList().then((r: any) => {
      // 使用一个 Map 来存储 group 的数据，以 flag 作为键
      const groupMap = new Map<
        string,
        {
          type: string
          label: string
          key: number
          children: Array<{ label: string; value: string; disabled?: boolean }>
        }
      >()

      // 获取当前登录用户的角色
      const userRole = userStore().getRole
      // 遍历角色数据并更新 groupMap
      r.data.forEach((role: Role) => {
        const label = getLabelForRole(role.flag)
        if (!groupMap.has(label)) {
          // 如果组不存在，创建一个新的组
          groupMap.set(label, {
            type: 'group',
            label: label,
            key: role.id,
            children: []
          })
        }
        // 找到对应的组，将数据添加到 children 中
        const existingGroup = groupMap.get(label) as any
        const disabled = userRole !== 'hl_root' && role.flag === RoleEnum.HL_ROOT
        existingGroup.children.push({
          label: role.name,
          value: role.flag,
          disabled
        })
      })

      // 最后，将 groupMap 中的数据转为一个数组，作为 selectData.value
      selectData.value = Array.from(groupMap.values())
      loadingSelect.value = false
    })
  }, 500)
}
/*判断用户的等级*/
const getLabelForRole = (flag: string) => {
  // 根据 flag 的前缀来判断权限等级
  if (flag.startsWith(RoleFixEnum.HL_ROOT)) {
    return t('super_per')
  } else if (flag.startsWith(RoleFixEnum.HL_SYS)) {
    return t('advanced_per')
  } else if (flag.startsWith(RoleFixEnum.HL_ORD)) {
    return t('common_per')
  } else {
    return 'Unknown'
  }
}
/*选项框分组*/
const renderLabel = (option: SelectOption): VNodeChild => {
  if (option.type === 'group') return option.label + '(Cool!)'
  return (
    <div
      onClick={() => {
        if (option.disabled) {
          handleDisableValue(option.label as string)
        }
      }}>
      <NTag
        disabled={option.disabled}
        style={{ borderRadius: '6px' }}
        bordered={false}
        type={
          option.value === RoleEnum.HL_ROOT ? 'error' : option.value === RoleEnum.HL_SYS_MANAGE ? 'info' : 'success'
        }>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <NIcon
            component={
              option.value === RoleEnum.HL_ROOT ? LetterR : option.value === RoleEnum.HL_SYS_MANAGE ? LetterM : LetterU
            }></NIcon>
          {option.label as string}
        </div>
      </NTag>
    </div>
  )
}
/*渲染默认角色标签*/
const renderTag: SelectRenderTag = ({ option }) => {
  const roleText = judgmentRole(option.value as RoleEnum)
  return (
    <NTag
      style={{ borderRadius: '6px' }}
      bordered={false}
      type={option.value === RoleEnum.HL_ROOT ? 'error' : option.value === RoleEnum.HL_SYS_MANAGE ? 'info' : 'success'}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <NIcon
          component={
            option.value === RoleEnum.HL_ROOT ? LetterR : option.value === RoleEnum.HL_SYS_MANAGE ? LetterM : LetterU
          }></NIcon>
        {roleText as string}
      </div>
    </NTag>
  )
}
/*保存事件*/
const saveData = async (form: any) => {
  // 判断是否修改了数据
  if (isEqual(rawData.value, editedData.value)) {
    showWarn.value = true
    warn.value = t('alert_warning_description')
    textChange(t('save_warning'), AlertCircle, 'warning')
    return
  }
  loadingBut.value = true
  await performAction(
    form,
    () => apis.editUser(editedData.value),
    () =>
      apis.userPage({
        pageSize: pageSize.value,
        pageNum: pageNum.value,
        name: input.value
      })
  )
  delay(() => {
    loadingBut.value = false
    showWarn.value = false
  }, 1000)
  // 这里可以进行保存操作，然后更新表格数据
  // ...
  // 清空临时对象
  // editedData.value = {} as pageUser
}
/*新增事件*/
const AddInfo = async (formEl: any) => {
  const addRoleSuccessMessage = '添加成功'
  const addRoleErrorMessage = '添加失败'
  await performAction(
    formEl,
    () => apis.addUser(editedData as any),
    () =>
      apis.userPage({
        pageSize: pageSize.value,
        pageNum: pageNum.value,
        name: input.value
      }),
    addRoleSuccessMessage,
    addRoleErrorMessage
  )
}

/*选择禁用选项的提示*/
const handleDisableValue = (label: string) => {
  window.$message.error(label, {
    render: renderMessage,
    closable: true
  })
}

const clone = () => {
  // TODO animation是全局的值，如果当其他地方的值改变了，就要在其他地方初始化的时候来初始化动画 (nyh-2023-10-03 03:56:34)
  animation.value = 'modal-container animate__animated animate__shakeX'
  showModal.value = true
  drawerShow.value = true
}

/*关闭弹框*/
const shutDown = (formRef: FormInst) => {
  animation.value = 'modal-container animate__animated animate__fadeOutLeft'
  setTimeout(() => {
    showModal.value = false
    drawerShow.value = false
    showWarn.value = false
    formRef.restoreValidation()
  }, 100)
}

/*取消*/
const cancel = () => {
  animation.value = 'modal-container animate__animated animate__fadeOutDown'
  setTimeout(() => {
    showModal.value = false
  }, 100)
}

/*处理保存按钮的提示*/
const textChange = (text: string, icon?: object, type?: ButtonType) => {
  butText.value = text
  iconShow.value = true
  icon ? (butIcon.value = icon) : {}
  type ? (butType.value = type) : ''
  delay(() => {
    butText.value = t('save')
    butType.value = 'primary'
    iconShow.value = false
  }, 2000)
}
</script>

<style scoped>
/*上传框样式*/
:deep(.n-upload-file-list .n-upload-file.n-upload-file--image-card-type),
:deep(.n-upload-trigger.n-upload-trigger--image-card .n-upload-dragger) {
  border-radius: 10px;
}
/*输入框样式*/
:deep(.n-input) {
  border-radius: 8px;
}
/*选择框样式*/
:deep(.n-base-selection) {
  border-radius: 8px;
}
:deep(.slide-left-enter-active),
:deep(.slide-left-leave-active) {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

:deep(.slide-left-enter-from),
:deep(.slide-left-leave-to) {
  position: absolute;
  opacity: 0;
}

:deep(.slide-left-enter-from) {
  transform: translateX(-10px);
}

:deep(.slide-left-leave-to) {
  transform: translateX(10px);
}
/*end*/
</style>
