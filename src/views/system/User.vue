<template>
  <n-space vertical>
    <!--操作栏-->
    <ActionBar />

    <!--表格-->
    <n-loading-bar-provider :to="loadingBarTargetRef" container-style="position: relative">
      <div ref="loadingBarTargetRef" style="height: 2px; overflow: hidden; pointer-events: none" />
      <!--   表格     -->
      <n-data-table
        :max-height="600"
        :loading="loading"
        :bordered="false"
        single-line
        single-column
        :row-key="rowKey"
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
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
      <loading-bar-trigger />
    </n-loading-bar-provider>
  </n-space>

  <!--抽屉-->
  <userDrawer />

  <!--添加弹出框-->
  <userModal :title="title" />
</template>

<script setup lang="ts">
import { useBase } from '@/hooks/useBase'
import type { DataTableBaseColumn, DataTableFilterState } from 'naive-ui'
import apis from '@/services/apis'
import paging from '@/hooks/usePaging'
import { pageUser, Response } from '@/services/types'
import { i18n } from '@/i18n'
import { RotateClockwise2 } from '@vicons/tabler'
import userVar from '@/views/composables/drawer/userDrawer/userVar'
import { userTable } from '@/views/composables/table/userTable'

const { t } = i18n.global
const { pageNum, pageSize } = paging
const loadingBarTargetRef = ref()
const title = ref('添加用户')
const { input } = userVar()
const { pagingLoad, tableData, loading, NoAccess } = useBase()
const { handleCheck, columns, statusColumn, pagination } = userTable(tableData)

/**使用defineComponent重新构建组件*/
const LoadingBarTrigger = defineComponent({
  setup() {
    /**useLoadingBar必须要在n-loading-bar-provider包裹里*/
    const loadingBar = useLoadingBar()
    pagingLoad(async () => {
      try {
        return await apis.userPage({
          pageSize: pageSize.value,
          pageNum: pageNum.value,
          userName: input.value
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

/*表格中每个key值*/
const rowKey = (row: pageUser) => row.id

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
