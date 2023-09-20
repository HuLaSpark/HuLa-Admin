<template>
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
          <n-result v-if="!NoAccess" status="403" title="403 禁止访问" description="总有些门是对你关闭的"> </n-result>
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
</template>

<script setup lang="ts">
import { useBase } from '@/hooks/useBase'
import { LetterR, LetterM, LetterU, X, Power, TrashX, EditCircle } from '@vicons/tabler'
import type { DataTableColumns, DataTableRowKey, DataTableBaseColumn, DataTableFilterState } from 'naive-ui'
import { NTag, NIcon, NSwitch, NIconWrapper, NSpace, NTooltip } from 'naive-ui'
import apis from '@/services/apis'
import paging from '@/hooks/usePaging'
import { pageUser, Response } from '@/services/types'
import { RoleEnum } from '@/enums'
import { i18n } from '@/i18n'
import { Report } from 'notiflix'

const { t } = i18n.global
const { pageNum, pageSize } = paging
const checkedRowKeysRef = ref<DataTableRowKey[]>([])
const input = ref()
const loadingBarTargetRef = ref<any>()
const { pagingLoad, tableData, total, loading, NoAccess } = useBase()
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
/*表格栏数据*/
const createColumns = (): DataTableColumns<pageUser> => {
  return [
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
      render(row) {
        let roleText = row.role
        row.role === RoleEnum.HL_SYS_ADMIN
          ? (roleText = '超级管理员')
          : row.role === RoleEnum.HL_SYS_MANAGE
          ? (roleText = '管理员')
          : '普通用户'
        return h(
          NTag,
          {
            style: {
              borderRadius: '6px'
            },
            type:
              row.role === RoleEnum.HL_SYS_ADMIN ? 'error' : row.role === RoleEnum.HL_SYS_MANAGE ? 'info' : 'success',
            bordered: false
          },
          {
            default: () => [
              h(NIcon, {
                component:
                  row.role === RoleEnum.HL_SYS_ADMIN ? LetterR : row.role === RoleEnum.HL_SYS_MANAGE ? LetterM : LetterU
              }),
              roleText
            ]
          }
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
      render() {
        return h(
          NSpace,
          {
            justify: 'space-around'
          },
          {
            default: () => [
              h(
                NTooltip,
                {
                  trigger: 'hover'
                },
                {
                  trigger: () =>
                    h(
                      NIconWrapper,
                      {
                        size: 26,
                        borderRadius: 6,
                        color: '#d8eee2',
                        iconColor: '#189f57',
                        style: {
                          display: 'flex',
                          alignItems: 'center'
                        }
                      },
                      h(NIcon, {
                        size: 22,
                        style: 'cursor: pointer',
                        component: EditCircle
                      })
                    ),
                  default: () => t('edit')
                }
              ),
              h(
                NTooltip,
                {
                  trigger: 'hover'
                },
                {
                  trigger: () =>
                    h(
                      NIconWrapper,
                      {
                        size: 26,
                        borderRadius: 6,
                        color: '#f5dce1',
                        iconColor: '#ce304f',
                        style: {
                          display: 'flex',
                          alignItems: 'center'
                        }
                      },
                      h(NIcon, {
                        size: 22,
                        style: 'cursor: pointer',
                        component: TrashX
                      })
                    ),
                  default: () => t('delete')
                }
              )
            ]
          }
        )
      }
    }
  ]
}

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
  render(row) {
    const active = ref<boolean>(true)
    active.value = row.status === 1
    return h(
      NSwitch,
      {
        value: active.value,
        'onUpdate:value': (value: boolean) => {
          if (row.role === RoleEnum.HL_SYS_ADMIN) {
            Report.warning('不允许修改' + RoleEnum.HL_SYS_ADMIN + '角色用户', '', '好吧，算你狠')
            return false
          }
          active.value = !value
          row.status = value ? 1 : 0
        }
      },
      {
        'checked-icon': () =>
          h(NIcon, {
            component: Power
          }),
        'unchecked-icon': () =>
          h(NIcon, {
            component: X
          }),
        checked: () => {
          return t('enable')
        },
        unchecked: () => {
          return t('forbidden')
        }
      }
    )
  },
  filter(value, row) {
    return row.status === value
  }
})
const columns = createColumns()
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
// const AddInfo = async (formEl: any) => {
//   const addRoleSuccessMessage = '添加成功'
//   const addRoleErrorMessage = '添加失败'
//   await performAction(
//     formEl,
//     () => apis.addUser(state.form),
//     addRoleSuccessMessage,
//     addRoleErrorMessage,
//     () =>
//       apis.userPage({
//         pageSize: pageSize.value,
//         pageNum: pageNum.value,
//         name: input.value
//       })
//   )
// }
</script>

<style scoped>
@import '@/assets/css/drawer.css';

/*表格标签样式*/
:deep(.n-tag__content) {
  display: flex;
  align-items: center;
  gap: 5px;
}
/*表格开关的颜色样式*/
:deep(.n-switch .n-switch__rail) {
  background: #ce304f;
  border: #f4e4e8;
}
:deep(.n-switch.n-switch--active .n-switch__rail) {
  background: #189f57;
}
/*end*/
</style>
