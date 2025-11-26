<template>
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

      <n-button circle secondary type="primary" @click="handleRefresh">
        <template #icon>
          <n-icon :component="Refresh" />
        </template>
      </n-button>
    </n-space>
  </n-space>
</template>

<script setup lang="ts">
import { PlaylistX, Plus, Refresh, Search } from '@vicons/tabler'
import { i18n } from '@/i18n'
import { useBase } from '@/hooks/useBase'
import { useDebounceFn } from '@vueuse/core'
import apis from '@/services/apis'
import paging from '@/hooks/usePaging.ts'
import userVar from '@/views/composables/drawer/userDrawer/userVar'
import { userTable } from '@/views/composables/table/userTable'
import { Report } from 'notiflix'
import { RCodeEnum } from '@/enums'

const { t } = i18n.global
const { pageNum, pageSize } = paging
const { input } = userVar()
const { pagingLoad, tableData, contentData, showModal } = useBase()
const { checkedRowKeys } = userTable(tableData)
const emit = defineEmits<{ (e: 'refresh'): void }>()

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
const handleRefresh = () => {
  emit('refresh')
}
</script>

<style scoped lang="scss"></style>
