<template>
  <!--表格-->
  <n-loading-bar-provider :to="loadingBarTargetRef" container-style="position: absolute;">
    <div ref="loadingBarTargetRef" style="position: absolute; inset: 0; overflow: hidden; pointer-events: none" />
    <!--   表格     -->
    <n-data-table
      :loading="loading"
      striped
      :bordered="false"
      single-line
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
            <img src="@/assets/svg/noData.svg" alt="" style="width: 280px; height: 280px" />
            <span style="color: #c0c0c0">{{ t('no_data') }}</span>
          </div>
        </div>
      </template>
      <!--加载的时候展示-->
      <template #loading>
        <n-spin :show="loading">
          <template #icon><n-icon :component="RotateClockwise2" /></template>
          <template #description>{{ t('loading') }}</template>
        </n-spin>
      </template>
    </n-data-table>
    <n-tag
      v-show="checkedRowKeysRef.length > 0"
      :bordered="false"
      type="success"
      style="margin: 20px 0; padding: 0 20px; border-radius: 6px">
      选中了 {{ checkedRowKeysRef.length }} 条数据
    </n-tag>
    <loading-bar-trigger />
  </n-loading-bar-provider>
  <!--抽屉-->
  <UserDrawer />
</template>

<script setup lang="tsx">
import { useBase } from '@/hooks/useBase'
import type { DataTableBaseColumn, DataTableColumns, DataTableFilterState, DataTableRowKey } from 'naive-ui'
import {
  NIcon,
  NIconWrapper,
  NSpace,
  NSwitch,
  NTag,
  NTooltip,
  NProgress,
  NAvatar,
  NPopconfirm,
  NButton
} from 'naive-ui'
import apis from '@/services/apis'
import paging from '@/hooks/usePaging'
import { pageUser, Response } from '@/services/types'
import { i18n } from '@/i18n'
import type { Ref } from 'vue'
import { RoleEnum } from '@/enums'
import { EditCircle, LetterM, LetterR, LetterU, Power, TrashX, X, RotateClockwise2, Minus } from '@vicons/tabler'
import { Report } from 'notiflix'
import { useAuth } from '@/hooks/useAuth'
import { UserDrawer } from '@/views/composables/drawer/index'
import UserVar from '@/views/composables/drawer/UserDrawer/UserVar'
import { handRelativeTime } from '@/utils/day'

const { t } = i18n.global
/*异步组件示例*/
/*const UserDrawer = defineAsyncComponent(() =>{import('@/views/composables/drawer/UserDrawer/UserDrawer.vue')})*/
const { pageNum, pageSize } = paging
const checkedRowKeysRef = ref<DataTableRowKey[]>([])
const loadingBarTargetRef = ref()
const { input, editedData, drawerShow } = UserVar()
const { pagingLoad, tableData, total, loading, NoAccess } = useBase()
const { judgmentRole } = useAuth()

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
        size={'small'}
        value={active.value}
        onUpdateValue={(value: boolean) => {
          if (row.role === RoleEnum.HL_ROOT) {
            Report.warning('不允许修改' + RoleEnum.HL_ROOT + '角色用户', '', '好吧，算你狠')
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
      return row.role === RoleEnum.HL_ROOT
    }
  },
  {
    title: '用户',
    key: 'userName',
    render: (row) => {
      return (
        <NSpace justify={'start'} align={'center'}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <NAvatar size={'large'}></NAvatar>
          </div>
          <NSpace vertical size={5}>
            <p style={{ fontWeight: 'bold', padding: 0, margin: 0 }}>{row.nickName ? row.nickName : row.email}</p>
            <p style={{ color: '#ccc', fontSize: '12px', transform: 'scale(1)', padding: 0, margin: 0 }}>
              {row.userName}
            </p>
          </NSpace>
        </NSpace>
      )
    }
  },
  {
    title: '邮箱',
    key: 'email'
  },
  {
    title: '手机号',
    key: 'mobile',
    render: (row) => {
      return row.mobile ? row.mobile : <NIcon component={Minus} />
    }
  },
  {
    title: '头像',
    key: 'avatar',
    render: (row) => {
      return row.avatar ? row.avatar : <NIcon component={Minus} />
    }
  },
  {
    title: '创建时间',
    key: 'createTime',
    render: (row) => {
      return (
        <NTooltip>
          {{
            default: () => row.createTime,
            trigger: () => <p style={{ fontWeight: 'bold' }}>{handRelativeTime(row.createTime)}</p>
          }}
        </NTooltip>
      )
    }
  },
  {
    title: '更新时间',
    key: 'updateTime',
    render: (row) => {
      return (
        <NTooltip>
          {{
            default: () => row.updateTime,
            trigger: () => <p style={{ fontWeight: 'bold' }}>{handRelativeTime(row.updateTime)}</p>
          }}
        </NTooltip>
      )
    }
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
          type={row.role === RoleEnum.HL_ROOT ? 'error' : row.role === RoleEnum.HL_SYS_MANAGE ? 'info' : 'success'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <NIcon
              component={
                row.role === RoleEnum.HL_ROOT ? LetterR : row.role === RoleEnum.HL_SYS_MANAGE ? LetterM : LetterU
              }></NIcon>
            {roleText}
          </div>
        </NTag>
      )
    }
  },
  {
    title: '资料完整度',
    key: 'integrity',
    minWidth: 140,
    render: (row) => {
      // 统计null值的数量
      const nullCount = Object.values(row).filter((value) => value === null).length
      // 计算资料完整度的占比
      const totalDataCount = Object.keys(row).length
      const integrity = (1 - nullCount / totalDataCount) * 100

      const color = integrity > 80 ? 'rgb(33,163,93)' : integrity > 40 ? 'rgb(238,159,32)' : 'rgb(212,75,103)'
      const railColor =
        integrity > 80 ? 'rgba(33,163,93,0.2)' : integrity > 40 ? 'rgba(238,159,32,0.2)' : 'rgba(212,75,103,0.2)'
      const show = integrity <= 80 ? 'hover' : ''
      return (
        <NPopconfirm trigger={show as any} negative-text={null} positive-text={null}>
          {{
            default: () => '请补全资料信息',
            trigger: () => (
              <NProgress
                style={{ cursor: integrity <= 80 ? 'pointer' : '' }}
                height={8}
                color={color}
                status={(integrity === 100 ? 'success' : integrity <= 80 ? 'warning' : '') as any}
                rail-color={railColor}
                percentage={integrity}
                processing={integrity !== 100}></NProgress>
            ),
            action: () => (
              <NButton quaternary type={'warning'} size={'tiny'} onClick={() => handleEditTable(row.id)}>
                去修改
              </NButton>
            )
          }}
        </NPopconfirm>
      )
    }
  },
  statusColumn,
  {
    title: '操作',
    key: 'actions',
    minWidth: 80,
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
const handleEditTable = (rowId: number) => {
  drawerShow.value = true
  const findItem = tableData.value.find((item: pageUser) => item.id === rowId)
  if (findItem) {
    editedData.value = { ...(findItem as pageUser) }
  }
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
// const rowProps = (row: pageUser) => {
//   return {
//     style: 'cursor: pointer',
//     onClick: (event: MouseEvent) => {
//       event.stopPropagation()
//       if ('Notification' in window) {
//         // 请求通知权限
//         Notification.requestPermission().then((permission) => {
//           if (permission === 'granted') {
//             // 用户同意通知权限
//             new Notification('Hello, World!', {
//               body: row.role,
//               icon: 'icon.png' // 可以替换成你的图标路径
//             })
//           } else if (permission === 'denied') {
//             // 用户拒绝通知权限
//             console.warn('用户拒绝了通知权限。')
//           } else {
//             // 用户还未做出选择
//             console.warn('用户尚未做出通知权限选择。')
//           }
//         })
//       }
//     }
//   }
// }
</script>

<style lang="scss" scoped>
@import '@/assets/scss/user';
</style>
