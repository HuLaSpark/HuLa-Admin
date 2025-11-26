<template>
  <div class="p-4 space-y-4">
    <n-card title="在线用户" :bordered="false" size="small">
      <div class="mb-4">
        <n-form inline :model="query">
          <n-form-item label="用户名">
            <n-input v-model:value="query.username" class="w-52" placeholder="用户名" />
          </n-form-item>
          <n-form-item label="昵称">
            <n-input v-model:value="query.nickName" class="w-52" placeholder="昵称" />
          </n-form-item>
          <n-form-item label="系统">
            <n-select v-model:value="query.systemType" :options="systemOptions" class="w-52" clearable placeholder="全部" />
          </n-form-item>
          <n-form-item>
            <n-space>
              <n-button type="primary" @click="handleSearch">查询</n-button>
              <n-button @click="handleReset">重置</n-button>
            </n-space>
          </n-form-item>
        </n-form>
      </div>
      <n-data-table :columns="columns" :data="rows" :bordered="false" :loading="loading" :pagination="pagination" remote />
    </n-card>

    <n-drawer v-model:show="showTokenDrawer" :width="1080" placement="right">
      <n-drawer-content title="登录终端">
        <n-data-table :columns="tokenColumns" :data="tokenRows" :bordered="false" />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { NText, NTag, NButton, NSpace, NPopconfirm } from 'naive-ui'
import { getOnlineUsersPage, getTokenSignListPage, logoutUser, kickoutUser, updateUserState, type OnlineUserItem, type TokenSignItem } from '@/api/satoken'
import { formatTime } from '@/utils/time'
import { addImBlack, getImBlackPage, removeImBlack } from '@/api/imBlack'

const query = ref<{ pageNum: number; pageSize: number; username?: string; nickName?: string; systemType?: number }>({ pageNum: 1, pageSize: 10 })
const rows = ref<OnlineUserItem[]>([])
const loading = ref(false)
const totalCount = ref(0)
const pagination = ref({ page: 1, pageSize: 10, pageSizes: [10, 20, 50], showSizePicker: true, showQuickJumper: true, prefix: () => h(NText, null, { default: () => `共 ${totalCount.value} 条` }), onUpdatePage: (p: number) => { pagination.value.page = p; query.value.pageNum = p; load() }, onUpdatePageSize: (s: number) => { pagination.value.pageSize = s; query.value.pageSize = s; query.value.pageNum = 1; pagination.value.page = 1; load() }, itemCount: 0 })

 

const columns = [
  { title: '用户名', key: 'username' },
  { title: '昵称', key: 'nickName' },
  { title: '会话ID', key: 'id' },
  { title: '系统', key: 'loginType', render: (row: any) => h(NTag, { bordered: false, type: (row.loginType === 'login' ? 'info' : 'success'), style: { borderRadius: '6px' } }, { default: () => (row.loginType === 'login' ? '后台账号' : 'IM账号') }) },
  { title: '登录时间', key: 'sessionTime', render: (row: any) => formatTime(row.sessionTime || row.createTime) },
  { title: '最近活跃', key: 'sessionStr', render: (row: any) => row.sessionStr || '-' },
  { title: '过期时间', key: 'expireTime', render: (row: any) => `${formatTime(row.expireTime)}${row.expireStr ? '（'+row.expireStr+'）' : ''}` },
  { title: '历史终端数', key: 'historyTerminalCount' },
  { title: '操作', key: 'actions', render: (row: any) => h(NSpace, { size: 8 }, { default: () => [
    h(NButton, { type: 'info', size: 'small', onClick: () => openTokenDrawer(row) }, { default: () => '查看终端' }),
    h(NPopconfirm, { onPositiveClick: () => logoutUser({ userId: row.loginId, systemType: query.value.systemType }).then(() => load()), positiveButtonProps: { type: 'error' } }, { default: () => '注销', trigger: () => h(NButton, { type: 'error', size: 'small' }, { default: () => '注销' }) }),
    h(NPopconfirm, { onPositiveClick: () => kickoutUser({ userId: row.loginId, systemType: query.value.systemType }).then(() => load()), positiveButtonProps: { type: 'error' } }, { default: () => '踢下线', trigger: () => h(NButton, { type: 'error', size: 'small' }, { default: () => '踢下线' }) }),
    row.loginId ? h(NPopconfirm, { onPositiveClick: () => handleFreeze(row.loginId!, true), positiveButtonProps: { type: 'warning' } }, { default: () => '冻结', trigger: () => h(NButton, { type: 'warning', size: 'small' }, { default: () => '冻结' }) }) : null,
    row.loginId ? h(NPopconfirm, { onPositiveClick: () => handleFreeze(row.loginId!, false), positiveButtonProps: { type: 'success' } }, { default: () => '解冻', trigger: () => h(NButton, { type: 'success', size: 'small' }, { default: () => '解冻' }) }) : null
  ].filter(Boolean) }) }
]

const showTokenDrawer = ref(false)
const tokenRows = ref<TokenSignItem[]>([])
const tokenColumns = [
  { title: 'Token', key: 'tokenValue' },
  { title: '设备类型', key: 'deviceType', width: 220 },
  { title: '创建时间', key: 'createTime', render: (row: any) => formatTime(row.createTime) },
  { title: '最近活跃', key: 'sessionStr', width: 200, render: (row: any) => row.sessionStr || '-' },
  { title: '活跃时间', key: 'sessionTime', render: (row: any) => formatTime(row.sessionTime) },
  { title: '过期时间', key: 'expireTime', render: (row: any) => `${formatTime(row.expireTime)}${row.expireStr ? '（'+row.expireStr+'）' : ''}` },
  { title: '操作', key: 'actions', render: (row: any) => h(NSpace, { size: 8 }, { default: () => [
    h(NPopconfirm, { onPositiveClick: () => logoutUser({ token: row.tokenValue, systemType: query.value.systemType }).then(() => load()), positiveButtonProps: { type: 'error' } }, { default: () => '注销', trigger: () => h(NButton, { type: 'error', size: 'small' }, { default: () => '注销' }) }),
    h(NPopconfirm, { onPositiveClick: () => kickoutUser({ token: row.tokenValue, systemType: query.value.systemType }).then(() => load()), positiveButtonProps: { type: 'error' } }, { default: () => '踢下线', trigger: () => h(NButton, { type: 'error', size: 'small' }, { default: () => '踢下线' }) })
  ] }) }
]

const openTokenDrawer = async (row: OnlineUserItem) => {
  showTokenDrawer.value = true
  const data = await getTokenSignListPage({ pageNum: 1, pageSize: 50, sessionId: (row as any).id, systemType: query.value.systemType })
  tokenRows.value = data.records || []
}

const systemOptions = [ { label: '后台账号', value: 1 }, { label: 'IM账号', value: 2 } ]

const handleFreeze = async (userId: string, freeze: boolean) => {
  if (query.value.systemType === 2) {
    if (freeze) {
      await addImBlack({ type: 2, target: userId, deadline: 0 })
    } else {
      const page = await getImBlackPage({ pageNo: 1, pageSize: 1, type: 2, target: userId })
      const id = page.list && page.list.length ? page.list[0].id : ''
      if (id) await removeImBlack({ id })
    }
  } else {
    await updateUserState({ id: userId, state: !freeze, systemType: query.value.systemType })
  }
  load()
}

const load = async () => {
  loading.value = true
  const data = await getOnlineUsersPage({ pageNum: query.value.pageNum, pageSize: query.value.pageSize, username: query.value.username, nickName: query.value.nickName, systemType: query.value.systemType })
  rows.value = data.records || []
  totalCount.value = Number((data as any).total || 0)
  pagination.value.page = Number((data as any).current || pagination.value.page)
  pagination.value.pageSize = Number((data as any).size || pagination.value.pageSize)
  ;(pagination.value as any).itemCount = Number((data as any).total || 0)
  loading.value = false
}

const handleSearch = () => { query.value.pageNum = 1; pagination.value.page = 1; load() }
const handleReset = () => { query.value.username = ''; query.value.nickName = ''; query.value.systemType = undefined; query.value.pageNum = 1; pagination.value.page = 1; load() }

onMounted(() => { load() })
</script>

<style scoped></style>