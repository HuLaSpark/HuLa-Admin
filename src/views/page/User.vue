<template>
  <n-space vertical>
    <n-card :bordered="false" size="small">
      <n-form inline :model="query">
        <n-form-item label="关键词">
          <n-input v-model:value="query.keyword" placeholder="姓名/用户ID" class="w-52" />
        </n-form-item>
        <n-form-item>
          <n-space>
            <n-button type="primary" @click="handleSearch">查询</n-button>
            <n-button @click="handleReset">重置</n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-card>

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
import paging from '@/hooks/usePaging'
import { Response } from '@/services/types'
import { i18n } from '@/i18n'
import { RotateClockwise2 } from '@vicons/tabler'
import { employeeTable } from '@/views/composables/table/employeeTable'

const { t } = i18n.global
const { pageNum, pageSize } = paging
const loadingBarTargetRef = ref()
const { pagingLoad, tableData, loading, NoAccess, total } = useBase()
const { columns } = employeeTable(tableData)
const pagination = reactive({
  page: pageNum.value,
  pageSize: pageSize.value,
  pageSizes: [10, 20, 50],
  showSizePicker: true,
  showQuickJumper: true,
  itemCount: 0,
  onChange: (p: number) => {
    pagination.page = p
    query.pageNum = p
    reload()
  },
  onUpdatePageSize: (s: number) => {
    pagination.pageSize = s
    query.pageSize = s
    query.pageNum = 1
    pagination.page = 1
    reload()
  }
})
const query = reactive<{ keyword?: string; pageNum: number; pageSize: number }>({ pageNum: pageNum.value, pageSize: pageSize.value })

const reload = async () => {
  await pagingLoad(async () => {
    return await apis.employeePage({
      pageSize: query.pageSize,
      pageNum: query.pageNum,
      userName: query.keyword || ''
    })
  })
  ;(pagination as any).itemCount = Number(total.value || 0)
}

/**使用defineComponent重新构建组件*/
const LoadingBarTrigger = defineComponent({
  setup() {
    /**useLoadingBar必须要在n-loading-bar-provider包裹里*/
    const loadingBar = useLoadingBar()
    pagingLoad(async () => {
      try {
        return await apis.employeePage({
          pageSize: query.pageSize,
          pageNum: query.pageNum,
          userName: query.keyword || ''
        })
      } catch (error) {
        loadingBar.error()
        return {} as Response
      }
    }, loadingBar).then(() => {
      ;(pagination as any).itemCount = Number(total.value || 0)
    })
  },
  render() {
    return null
  }
})

const rowKey = (row: any) => row.id
const handleSearch = () => {
  query.pageNum = 1
  pagination.page = 1
  reload()
}
const handleReset = () => {
  query.keyword = ''
  query.pageNum = 1
  pagination.page = 1
  reload()
}

 
</script>

<style lang="scss" scoped>
@use '@/styles/scss/user';

:deep(.user-avatar-wrapper) {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(1.05);
  }
}
</style>
