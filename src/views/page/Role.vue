<template>
  <n-space vertical>
    <!--操作栏-->
    <ActionBar @refresh="reloadRoles" />

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
        :pagination="pagination" remote>
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
</template>

<script setup lang="ts">
import { useBase } from '@/hooks/useBase'
import apis from '@/services/apis'
import paging from '@/hooks/usePaging.ts'
import { pageUser, Response } from '@/services/types'
import { i18n } from '@/i18n'
import { RotateClockwise2 } from '@vicons/tabler'
import userVar from '@/views/composables/drawer/userDrawer/userVar'
import { baseRoleTable } from '@/views/composables/table/baseRoleTable'

const { t } = i18n.global
const { pageNum, pageSize } = paging
const loadingBarTargetRef = ref()
// const title = ref('添加角色')
const { input } = userVar()
const { pagingLoad, tableData, loading, NoAccess, total } = useBase()
const { columns } = baseRoleTable(tableData)
const pagination = reactive({
  page: pageNum.value,
  pageSize: pageSize.value,
  pageSizes: [10, 20, 50],
  showSizePicker: true,
  showQuickJumper: true,
  itemCount: 0,
  onChange: (p: number) => {
    pagination.page = p
    reloadRoles(p)
  },
  onUpdatePageSize: (s: number) => {
    pagination.pageSize = s
    pagination.page = 1
    reloadRoles(1)
  }
})

/**使用defineComponent重新构建组件*/
const LoadingBarTrigger = defineComponent({
  setup() {
    /**useLoadingBar必须要在n-loading-bar-provider包裹里*/
    const loadingBar = useLoadingBar()
    pagingLoad(async () => {
      try {
        return await apis.rolePage({
          pageSize: pagination.pageSize,
          pageNum: pagination.page,
          userName: input.value
        })
      } catch (error) {
        loadingBar.error()
        return {} as Response // 返回一个默认的 Response
      }
    }, loadingBar).then(() => {
      ;(pagination as any).itemCount = Number(total.value || 0)
    })
  },
  render() {
    return null
  }
})
/*表格中每个key值*/
const rowKey = (row: any) => row.id
/*受控过滤方法*/
const reloadRoles = async (page?: number) => {
  await pagingLoad(() =>
    apis.rolePage({
      pageSize: pagination.pageSize,
      pageNum: page || pagination.page,
      userName: input.value
    })
  )
  ;(pagination as any).itemCount = Number(total.value || 0)
}
</script>

<style scoped></style>
