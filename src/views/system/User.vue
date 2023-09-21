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
import type { DataTableRowKey, DataTableBaseColumn, DataTableFilterState } from 'naive-ui'
import apis from '@/services/apis'
import paging from '@/hooks/usePaging'
import { pageUser, Response } from '@/services/types'
import { i18n } from '@/i18n'
import { UserTable, statusColumn } from '@/dataTable/UserTable'

const { t } = i18n.global
const { pageNum, pageSize } = paging
const checkedRowKeysRef = ref<DataTableRowKey[]>([])
const input = ref()
const loadingBarTargetRef = ref<any>()
const { pagingLoad, tableData, total, loading, NoAccess } = useBase()
const columns = UserTable()
const rowKey = (row: pageUser) => row.id
/*多选选中的方法*/
const handleCheck = (rowKeys: DataTableRowKey[]) => {
  checkedRowKeysRef.value = rowKeys
}
/*受控过滤方法*/
const handleUpdateFilter = (filters: DataTableFilterState, sourceColumn: DataTableBaseColumn) => {
  statusColumn.filterOptionValue = filters[sourceColumn.key] as number
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

<style lang="scss" scoped>
@import '@/assets/scss/User';
</style>
