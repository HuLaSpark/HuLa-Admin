<template>
  <n-space vertical>
    <n-space justify="space-between">
      <n-space align="center">
        <n-button style="border-radius: 8px" secondary type="success" @click="handleAdd">
          <template #icon><n-icon :component="Plus" /></template>
          {{ t('add') }}
        </n-button>
        <n-popconfirm
          :positive-text="t('delete')"
          :positive-button-props="{ type: 'error' }"
          placement="bottom"
          @positive-click="handleBatch">
          <template #trigger>
            <n-button style="border-radius: 8px" secondary type="error">
              <template #icon><n-icon :component="PlaylistX" /></template>
              {{ t('delete_batch') }}
            </n-button>
          </template>
          {{ t('confirm_delete_batch') }}
        </n-popconfirm>
      </n-space>

      <n-space align="center">
        <n-input
          :maxlength="10"
          style="border-radius: 10px"
          v-model:value="input"
          clearable
          placeholder="请输入关键词搜索"
          @input="handleSearch">
          <template #prefix>
            <n-icon :component="Search" />
          </template>
        </n-input>

        <n-button circle secondary type="primary">
          <template #icon>
            <n-icon :component="Refresh" />
          </template>
        </n-button>
      </n-space>
    </n-space>

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
import { RotateClockwise2, Plus, PlaylistX, Search, Refresh } from '@vicons/tabler'
import { userDrawer } from '@/views/composables/drawer/index'
import userVar from '@/views/composables/drawer/userDrawer/userVar'
import { userTable } from '@/views/composables/table/userTable'
import { userModal } from '@/views/composables/modal/index'
import { useDebounceFn } from '@vueuse/core'
import { Report } from 'notiflix'
import { RCodeEnum } from '@/enums'

const { t } = i18n.global
const { pageNum, pageSize } = paging
const loadingBarTargetRef = ref()
const title = ref('添加用户')
const { input } = userVar()
const { pagingLoad, tableData, loading, NoAccess, contentData, showModal } = useBase()
const { handleCheck, columns, statusColumn, pagination, checkedRowKeys } = userTable(tableData)

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

/*处理新增事件*/
const handleAdd = () => {
  showModal.value = true
  /*重新打开弹框的时候清空表单内容*/
  contentData.value = {}
}

/*批量删除事件*/
// TODO 考虑系统用户应该是第三方登录或者是超级管理员或者管理员创建的用户所以批量删除是否有必要存在，建议逻辑删除或者不需要删除的功能 (nyh-2023-12-02 06:27:30)
const handleBatch = async () => {
  if (checkedRowKeys.value.length === 0) {
    Report.failure(t('delete_batch_error'), t('batch_error_msg'), t('close'), {
      titleFontSize: '18px',
      messageFontSize: '16px'
    })
    return
  }
  const uids = tableData.value
    .filter((item: any) => checkedRowKeys.value.includes(item.id))
    .map((item: any) => item.uid)
  const data = { ids: checkedRowKeys.value, uids }
  const res = await apis.batchDeleteUsers(data)
  if (res.code !== RCodeEnum.OK) {
    return window.$message.error(res.code === RCodeEnum.PARAM_ERROR ? (res.data as any)[0] : res.msg)
  }
  await pagingLoad(() =>
    apis.userPage({
      pageSize: pageSize.value,
      pageNum: pageNum.value,
      userName: input.value
    })
  ).then(() => {
    window.$message.success(res.msg)
    /*初始化选中的行*/
    checkedRowKeys.value.length = 0
  })
}

/*搜索事件*/
const handleSearch = useDebounceFn(async () => {
  await pagingLoad(() => {
    return apis.userPage({
      pageSize: pageSize.value,
      pageNum: pageNum.value,
      userName: input.value
    })
  })
}, 300)

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
