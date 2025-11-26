<template>
  <div class="p-4 space-y-4">
  <n-card title="登录日志" :bordered="false" size="small">
      <div class="mb-4">
        <n-form inline :model="query">
          <n-form-item label="用户名">
            <n-input v-model:value="query.username" class="w-52" placeholder="用户名" />
          </n-form-item>
          <n-form-item label="IP">
            <n-input v-model:value="query.requestIp" class="w-52" placeholder="IP" />
          </n-form-item>
          <n-form-item label="状态">
            <n-select v-model:value="query.status" :options="statusOptions" class="w-52" clearable placeholder="全部" />
          </n-form-item>
          <n-form-item>
            <n-space>
              <n-button type="primary" @click="handleSearch">查询</n-button>
              <n-button @click="handleReset">重置</n-button>
              <n-button type="warning" @click="handleClear(1)">清空一个月前</n-button>
              <n-button type="warning" @click="handleClear(2)">清空三个月前</n-button>
              <n-button type="error" @click="handleClear(8)">清空十万条以前</n-button>
            </n-space>
          </n-form-item>
        </n-form>
      </div>
      <n-data-table :columns="columns" :data="rows" :bordered="false" :loading="loading" :pagination="pagination" remote />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { NTag } from 'naive-ui'
import { getLoginLogPage, clearLoginLog, type LoginLogItem } from '@/api/loginLog'
import { NText } from 'naive-ui'
import { formatTime } from '@/utils/time'

const rows = ref<LoginLogItem[]>([])
const loading = ref(false)
const query = ref<{ pageNum: number; pageSize: number; username?: string; requestIp?: string; status?: string }>({ pageNum: 1, pageSize: 10 })
const totalCount = ref(0)
const pagination = ref({
  page: 1,
  pageSize: 10,
  pageSizes: [10, 20, 50],
  showSizePicker: true,
  showQuickJumper: true,
  prefix: () => h(NText, null, { default: () => `共 ${totalCount.value} 条` }),
  onUpdatePage(p: number) {
    pagination.value.page = p
    query.value.pageNum = p
    load()
  },
  onUpdatePageSize(s: number) {
    pagination.value.pageSize = s
    query.value.pageSize = s
    query.value.pageNum = 1
    pagination.value.page = 1
    load()
  },
  itemCount: 0
})

const columns = [
  { title: '用户名', key: 'username' },
  { title: 'IP', key: 'requestIp' },
  { title: '位置', key: 'location', render: (row: any) => formatLocation(row.location) },
  { title: '运营商', key: 'isp' },
  {
    title: '状态',
    key: 'status',
    render: (row: any) =>
      h(
        NTag,
        { bordered: false, type: row.status === '01' ? 'success' : 'error', style: { borderRadius: '6px' } },
        { default: () => (row.status === '01' ? '成功' : '失败') }
      )
  },
  { title: '时间', key: 'createTime', render: (row: any) => formatTime(row.createTime) }
]

const statusOptions = [
  { label: '成功', value: '01' },
  { label: '失败', value: '00' }
]

const load = async () => {
  loading.value = true
  const data = await getLoginLogPage({
    pageNum: query.value.pageNum,
    pageSize: query.value.pageSize,
    username: query.value.username,
    requestIp: query.value.requestIp,
    status: query.value.status
  })
  rows.value = data.records || []
  totalCount.value = Number((data as any).total || 0)
  pagination.value.page = Number((data as any).current || pagination.value.page)
  pagination.value.pageSize = Number((data as any).size || pagination.value.pageSize)
  ;(pagination.value as any).itemCount = Number((data as any).total || 0)
  loading.value = false
}

const handleClear = async (type?: number) => {
  await clearLoginLog(type)
  window.$message?.success('已清理')
  load()
}

onMounted(() => {
  load()
})

 

function formatLocation(val: any) {
  if (!val) return '-'
  const parts = String(val).split('|')
  return parts[4] || parts[3] || parts.join(' ') || '-'
}

const handleSearch = () => {
  query.value.pageNum = 1
  pagination.value.page = 1
  load()
}

const handleReset = () => {
  query.value.username = ''
  query.value.requestIp = ''
  query.value.status = undefined
  query.value.pageNum = 1
  pagination.value.page = 1
  load()
}
</script>

<style scoped></style>