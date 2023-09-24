<template>
  <!--表格-->
  <n-loading-bar-provider :to="loadingBarTargetRef" container-style="position: absolute;">
    <div ref="loadingBarTargetRef" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none" />
    <!--   表格     -->
    <n-spin :show="loading">
      <n-data-table
        striped
        :bordered="false"
        :single-line="false"
        single-column
        :row-key="rowKey"
        :columns="columns"
        :data="tableData"
        @update:filters="handleUpdateFilter"
        @update:checked-row-keys="handleCheck">
        <!--为空时表格状态-->
        <template #empty>
          <n-result v-if="!NoAccess" status="403" :title="t('403')" :description="t('403_content')"> </n-result>
          <div v-else style="display: flex; justify-content: center">
            <div style="display: flex; align-items: center; flex-direction: column">
              <img src="@/assets/svg/default.svg" alt="" style="width: 220px; height: 220px" />
              <span style="color: #c0c0c0; letter-spacing: 2px">{{ t('no_data') }}</span>
            </div>
          </div>
        </template>
      </n-data-table>
    </n-spin>
    <loading-bar-trigger />
  </n-loading-bar-provider>

  <!--抽屉-->
  <n-drawer v-model:show="drawerShow" :width="350" :on-mask-click="x">
    <n-drawer-content :title="t('edit')" closable>
      <n-form
        ref="formRef"
        :label-width="80"
        :model="state.form"
        :rules="rules"
        style="padding: 10px 0"
        label-align="left"
        require-mark-placement="left"
        label-placement="left">
        <n-form-item :label="t('user_name')" path="userName">
          <n-input
            style="border-radius: 8px"
            v-model:value="state.form.userName"
            :placeholder="t('input') + t('user_name')" />
        </n-form-item>
        <n-form-item :label="t('role_flag')" path="role">
          <n-select
            style="border-radius: 8px"
            v-model:show="showSelect"
            :placeholder="t('input') + t('role_flag')"
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
import { useBase } from '@/hooks/useBase'
import type { FormInst, DataTableColumns, DataTableRowKey, DataTableBaseColumn, DataTableFilterState } from 'naive-ui'
import apis from '@/services/apis'
import paging from '@/hooks/usePaging'
import { pageUser, Response, User } from '@/services/types'
import { i18n } from '@/i18n'
import Modal from '@/components/modal/index.vue'
import type { Ref, VNodeChild } from 'vue'
import { NIcon, NIconWrapper, NSpace, NSwitch, NTag, NTooltip, SelectOption, SelectGroupOption } from 'naive-ui'
import { RoleEnum } from '@/enums'
import { EditCircle, LetterM, LetterR, LetterU, Power, TrashX, X, UserSearch, UserCheck } from '@vicons/tabler'
import { Report } from 'notiflix'
import { useAuth } from '@/hooks/useAuth'
import { delay } from 'lodash-es'

const { t } = i18n.global
const { pageNum, pageSize } = paging
const checkedRowKeysRef = ref<DataTableRowKey[]>([])
const input = ref()
const loadingBarTargetRef = ref<any>()
const showModal = ref<boolean>(false)
const drawerShow = ref<boolean>(false)
const formRef = ref<FormInst | null>()
const showSelect = ref<boolean>(false)
const loadingSelect = ref<boolean>(false)
const selectData = ref<Array<SelectOption | SelectGroupOption>>([])
/*表单数据*/
const state = reactive({
  form: {} as User
})
/*校验规则*/
const rules = reactive({
  userName: { required: true, message: t('user_name') + t('no_null'), trigger: 'blur' },
  mobile: { required: true, message: '请输入mobile', trigger: 'blur' }
})
const { pagingLoad, performAction, tableData, total, loading, NoAccess } = useBase()
const { judgmentRole } = useAuth()
/*点击选中框后进行异步查询选项框内容*/
const handleShowSelect = () => {
  if (selectData.value.length > 0) return
  loadingSelect.value = true
  delay(() => {
    selectData.value = options
    loadingSelect.value = false
  }, 500)
}
const options: Array<SelectOption | SelectGroupOption> = [
  {
    type: 'group',
    label: '最高权限',
    key: 'Rubber Soul Album',
    children: [
      {
        label: '超级管理员',
        value: RoleEnum.HL_SYS_ADMIN
      }
    ]
  },
  {
    type: 'group',
    label: '中级权限',
    key: 'Let It Be Album',
    children: [
      {
        label: '管理员',
        value: RoleEnum.HL_SYS_MANAGE
      }
    ]
  },
  {
    type: 'group',
    label: '低级权限',
    key: 'Let It Be Album',
    children: [
      {
        label: '普通用户',
        value: RoleEnum.HL_SYS_USER
      }
    ]
  }
]
/*选项框分组*/
const renderLabel = (option: SelectOption): VNodeChild => {
  if (option.type === 'group') return option.label + '(Cool!)'
  return (
    <NTag
      style={{ borderRadius: '6px' }}
      bordered={false}
      type={
        option.value === RoleEnum.HL_SYS_ADMIN ? 'error' : option.value === RoleEnum.HL_SYS_MANAGE ? 'info' : 'success'
      }>
      {option.label as string}
    </NTag>
  )
}
/**使用defineComponent重新构建组件*/
const LoadingBarTrigger = defineComponent({
  setup() {
    /**useLoadingBar必须要在n-loading-bar-provider包裹里*/
    const loadingBar = useLoadingBar()
    pagingLoad(async () => {
      loadingBar.start()
      try {
        return await apis.userPage({
          pageSize: pageSize.value,
          pageNum: pageNum.value,
          name: input.value
        })
      } catch (error) {
        loadingBar.error()
        return {} as Response // 返回一个默认的 Response
      }
    }, loadingBar)
  },
  render() {
    return null
  }
})
/*受控过滤器*/
const statusColumn = reactive<DataTableBaseColumn<pageUser>>({
  title: '状态',
  key: 'status',
  filterMultiple: false,
  filterOptionValue: null,
  sorter: 'default',
  filterOptions: [
    {
      label: '开启',
      value: 1
    },
    {
      label: '禁用',
      value: 0
    }
  ],
  render: (row) => {
    const active = ref<boolean>(true)
    active.value = row.status === 1
    return (
      <NSwitch
        value={active.value}
        onUpdateValue={(value: boolean) => {
          if (row.role === RoleEnum.HL_SYS_ADMIN) {
            Report.warning('不允许修改' + RoleEnum.HL_SYS_ADMIN + '角色用户', '', '好吧，算你狠')
            return false
          }
          active.value = !value
          row.status = value ? 1 : 0
        }}>
        {{
          'checked-icon': () => <NIcon component={Power} />,
          'unchecked-icon': () => <NIcon component={X} />,
          checked: () => t('enable'),
          unchecked: () => t('forbidden')
        }}
      </NSwitch>
    )
  },
  filter(value, row) {
    return row.status === value
  }
})
/*tsx渲染表格数据*/
const columns: Ref<DataTableColumns<pageUser>> = ref([
  {
    type: 'selection',
    disabled(row: pageUser) {
      return row.role === RoleEnum.HL_SYS_ADMIN
    }
  },
  {
    title: '用户名',
    key: 'userName'
  },
  {
    title: '角色',
    key: 'role',
    render: (row) => {
      const roleText = judgmentRole(row.role as RoleEnum)
      return (
        <NTag
          style={{ borderRadius: '6px' }}
          bordered={false}
          type={
            row.role === RoleEnum.HL_SYS_ADMIN ? 'error' : row.role === RoleEnum.HL_SYS_MANAGE ? 'info' : 'success'
          }>
          <NIcon
            component={
              row.role === RoleEnum.HL_SYS_ADMIN ? LetterR : row.role === RoleEnum.HL_SYS_MANAGE ? LetterM : LetterU
            }></NIcon>
          {roleText}
        </NTag>
      )
    }
  },
  statusColumn,
  {
    title: '邮箱',
    key: 'email'
  },
  {
    title: '手机号',
    key: 'mobile'
  },
  {
    title: '头像',
    key: 'avatar'
  },
  {
    title: '创建时间',
    key: 'createTime'
  },
  {
    title: '更新时间',
    key: 'updateTime'
  },
  {
    title: '操作',
    key: 'actions',
    render: (row) => {
      return (
        <NSpace justify={'space-around'}>
          <NTooltip>
            {{
              default: () => t('edit'),
              trigger: () => (
                <div onClick={() => handleEditTable(row.id)}>
                  <NIconWrapper size={26} borderRadius={6} color={'#d8eee2'} iconColor={'#189f57'}>
                    <NIcon size={22} style={{ cursor: 'pointer' }} component={EditCircle}></NIcon>
                  </NIconWrapper>
                </div>
              )
            }}
          </NTooltip>

          <NTooltip>
            {{
              default: () => t('delete'),
              trigger: () => (
                <NIconWrapper size={26} borderRadius={6} color={'#f5dce1'} iconColor={'#ce304f'}>
                  <NIcon size={22} style={{ cursor: 'pointer' }} component={TrashX}></NIcon>
                </NIconWrapper>
              )
            }}
          </NTooltip>
        </NSpace>
      )
    }
  }
])

// const Table = (): DataTableColumns<pageUser> => {
//   // TODO 使用tsx渲染 (nyh-2023-09-24 03:21:17)
//   return [
//     {
//       type: 'selection',
//       disabled(row: pageUser) {
//         return row.role === RoleEnum.HL_SYS_ADMIN
//       }
//     },
//     {
//       title: '用户名',
//       key: 'userName'
//     },
//     {
//       title: '角色',
//       key: 'role',
//       render(row) {
//         let roleText = row.role
//         row.role === RoleEnum.HL_SYS_ADMIN
//           ? (roleText = '超级管理员')
//           : row.role === RoleEnum.HL_SYS_MANAGE
//           ? (roleText = '管理员')
//           : '普通用户'
//         return h(
//           NTag,
//           {
//             style: {
//               borderRadius: '6px'
//             },
//             type:
//               row.role === RoleEnum.HL_SYS_ADMIN ? 'error' : row.role === RoleEnum.HL_SYS_MANAGE ? 'info' : 'success',
//             bordered: false
//           },
//           {
//             default: () => [
//               h(NIcon, {
//                 component:
//                   row.role === RoleEnum.HL_SYS_ADMIN ? LetterR : row.role === RoleEnum.HL_SYS_MANAGE ? LetterM : LetterU
//               }),
//               roleText
//             ]
//           }
//         )
//       }
//     },
//     statusColumn,
//     {
//       title: '邮箱',
//       key: 'email'
//     },
//     {
//       title: '手机号',
//       key: 'mobile'
//     },
//     {
//       title: '头像',
//       key: 'avatar'
//     },
//     {
//       title: '创建时间',
//       key: 'createTime'
//     },
//     {
//       title: '更新时间',
//       key: 'updateTime'
//     },
//     {
//       title: '操作',
//       key: 'actions',
//       render(row) {
//         return h(
//           NSpace,
//           {
//             justify: 'space-around'
//           },
//           {
//             default: () => [
//               h(
//                 NTooltip,
//                 {
//                   trigger: 'hover'
//                 },
//                 {
//                   trigger: () =>
//                     h(
//                       NIconWrapper,
//                       {
//                         size: 26,
//                         borderRadius: 6,
//                         color: '#d8eee2',
//                         iconColor: '#189f57',
//                         style: {
//                           display: 'flex',
//                           alignItems: 'center'
//                         },
//                         onClick: () => {
//                           handleEditTable(row.id)
//                         }
//                       },
//                       {
//                         default: () => [
//                           h(NIcon, {
//                             size: 22,
//                             style: 'cursor: pointer',
//                             component: EditCircle
//                           })
//                         ]
//                       }
//                     ),
//                   default: () => t('edit')
//                 }
//               ),
//               h(
//                 NTooltip,
//                 {
//                   trigger: 'hover'
//                 },
//                 {
//                   trigger: () =>
//                     h(
//                       NIconWrapper,
//                       {
//                         size: 26,
//                         borderRadius: 6,
//                         color: '#f5dce1',
//                         iconColor: '#ce304f',
//                         style: {
//                           display: 'flex',
//                           alignItems: 'center'
//                         }
//                       },
//                       {
//                         default: () => [
//                           h(NIcon, {
//                             size: 22,
//                             style: 'cursor: pointer',
//                             component: TrashX
//                           })
//                         ]
//                       }
//                     ),
//                   default: () => t('delete')
//                 }
//               )
//             ]
//           }
//         )
//       }
//     }
//   ]
// }
const x = () => {
  showModal.value = true
  drawerShow.value = true
}
const shutDown = (formRef: FormInst) => {
  showModal.value = false
  drawerShow.value = false
  formRef.restoreValidation()
}
const handleEditTable = (rowId: number) => {
  drawerShow.value = true
  const findItem = tableData.value.find((item: User) => item.id === rowId)
  if (findItem) {
    setEditData(findItem)
  }
}
const setEditData = (data: User) => {
  state.form = data
}
const rowKey = (row: pageUser) => row.id
/*多选选中的方法*/
const handleCheck = (rowKeys: DataTableRowKey[]) => {
  checkedRowKeysRef.value = rowKeys
}
/*受控过滤方法*/
const handleUpdateFilter = (filters: DataTableFilterState, sourceColumn: DataTableBaseColumn) => {
  statusColumn.filterOptionValue = filters[sourceColumn.key] as number
}
/*点击表格栏事件*/
const rowProps = (row: pageUser) => {
  return {
    style: 'cursor: pointer',
    onClick: (event: MouseEvent) => {
      event.stopPropagation()
      window.$message.info(row.role)
    }
  }
}

const AddInfo = async (formEl: any) => {
  const addRoleSuccessMessage = '添加成功'
  const addRoleErrorMessage = '添加失败'
  await performAction(
    formEl,
    () => apis.addUser(state.form),
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
</script>

<style lang="scss" scoped>
@import '@/assets/scss/User';

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
