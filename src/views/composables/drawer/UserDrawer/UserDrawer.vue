<template>
  <!--抽屉-->
  <n-drawer v-model:show="drawerShow" :width="350" :on-mask-click="clone">
    <n-drawer-content :title="t('edit')" closable>
      <n-form ref="formRef" :model="editedData" :rules="rules" style="padding: 10px 0">
        <n-form-item :label="t('user_name')" path="userName">
          <n-input style="border-radius: 8px" v-model:value="editedData.userName" :placeholder="t('placeholder')" />
        </n-form-item>
        <n-form-item :label="t('role_flag')" path="role">
          <n-select
            style="border-radius: 8px"
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
      </n-form>
      <template #footer>
        <n-button style="width: 100%" :loading="loading" secondary type="primary">{{ t('save') }}</n-button>
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
          <n-button quaternary type="tertiary" @click="showModal = false">{{ t('cancel') }}</n-button>
          <n-button secondary type="error" @click="shutDown(formRef)">{{ t('close') }}</n-button>
        </div>
      </template>
    </modal>
  </Teleport>
</template>

<script setup lang="tsx">
import type { FormInst } from 'naive-ui'
import { NTag, SelectOption } from 'naive-ui'
import { i18n } from '@/i18n'
import Modal from '@/components/modal/index.vue'
import type { VNodeChild } from 'vue'
import { RoleEnum, RoleFixEnum } from '@/enums'
import { UserCheck, UserSearch } from '@vicons/tabler'
import { delay } from 'lodash-es'
import { useBase } from '@/hooks/useBase'
import apis from '@/services/apis'
import paging from '@/hooks/usePaging'
import UserVar from './UserVar'
import { Role, User } from '@/services/types'

defineOptions({ name: 'UserDrawer' })

const { t } = i18n.global
const { pageNum, pageSize } = paging
const { input, showModal, showSelect, formRef, loadingSelect, selectData, rules, drawerShow, editedData } = UserVar()
const { performAction, loading } = useBase()

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
          children: Array<{ label: string; value: string }>
        }
      >()

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
        existingGroup.children.push({
          label: role.name,
          value: role.flag
        })
      })

      // 最后，将 groupMap 中的数据转为一个数组，作为 selectData.value
      selectData.value = Array.from(groupMap.values())
      loadingSelect.value = false
    })
  }, 500)
}
const getLabelForRole = (flag: string) => {
  // 根据 flag 的前缀来判断权限等级
  if (flag.startsWith(RoleFixEnum.HL_ROOT)) {
    return '超级权限'
  } else if (flag.startsWith(RoleFixEnum.HL_SYS)) {
    return '高级权限'
  } else if (flag.startsWith(RoleFixEnum.HL_ORD)) {
    return '普通权限'
  } else {
    return 'Unknown'
  }
}
// const options: Array<SelectOption | SelectGroupOption> = [
//   {
//     type: 'group',
//     label: '最高权限',
//     key: 'Rubber Soul Album',
//     children: [
//       {
//         label: '超级管理员',
//         value: RoleEnum.HL_SYS_ADMIN
//       }
//     ]
//   },
//   {
//     type: 'group',
//     label: '中级权限',
//     key: 'Let It Be Album',
//     children: [
//       {
//         label: '管理员',
//         value: RoleEnum.HL_SYS_MANAGE
//       }
//     ]
//   },
//   {
//     type: 'group',
//     label: '低级权限',
//     key: 'Let It Be Album',
//     children: [
//       {
//         label: '普通用户',
//         value: RoleEnum.HL_SYS_USER
//       }
//     ]
//   }
// ]

/*选项框分组*/
const renderLabel = (option: SelectOption): VNodeChild => {
  if (option.type === 'group') return option.label + '(Cool!)'
  return (
    <NTag
      style={{ borderRadius: '6px' }}
      bordered={false}
      type={option.value === RoleEnum.HL_ROOT ? 'error' : option.value === RoleEnum.HL_SYS_MANAGE ? 'info' : 'success'}>
      {option.label as string}
    </NTag>
  )
}
// 在保存按钮点击时将临时对象的数据合并到 state.form 中
const saveData = () => {
  // 这里可以进行保存操作，然后更新表格数据
  // ...
  // 清空临时对象
  editedData.value = {} as User
}
const AddInfo = async (formEl: any) => {
  const addRoleSuccessMessage = '添加成功'
  const addRoleErrorMessage = '添加失败'
  await performAction(
    formEl,
    () => apis.addUser(editedData as any),
    addRoleSuccessMessage,
    addRoleErrorMessage,
    () =>
      apis.userPage({
        pageSize: pageSize.value,
        pageNum: pageNum.value,
        name: input.value
      })
  )
}
const clone = () => {
  showModal.value = true
  drawerShow.value = true
}

const shutDown = (formRef: FormInst) => {
  showModal.value = false
  drawerShow.value = false
  formRef.restoreValidation()
}
</script>

<style scoped>
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
