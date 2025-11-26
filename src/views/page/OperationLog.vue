<template>
  <div class="p-4 space-y-4">
  <n-card title="操作日志" :bordered="false" size="small">
      <div class="mb-4">
        <n-form inline :model="query">
          <n-form-item label="IP">
            <n-input v-model:value="query.requestIp" class="w-52" placeholder="IP" />
          </n-form-item>
          <n-form-item label="方法名">
            <n-input v-model:value="query.actionMethod" class="w-52" placeholder="方法名" />
          </n-form-item>
          <n-form-item label="路径关键词">
            <n-input v-model:value="query.requestUri" class="w-52" placeholder="路径关键词" />
          </n-form-item>
          <n-form-item label="HTTP方法">
            <n-select v-model:value="query.httpMethod" :options="httpOptions" class="w-52" clearable placeholder="全部" />
          </n-form-item>
          <n-form-item label="类型">
            <n-select v-model:value="query.type" :options="typeOptions" class="w-52" clearable placeholder="全部" />
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
import { NTag, NText } from 'naive-ui'
import { formatTime } from '@/utils/time'
import { getOperationLogPage, clearOperationLog, type OperationLogItem } from '@/api/operationLog'

const rows = ref<OperationLogItem[]>([])
const loading = ref(false)
const query = ref<{ pageNum: number; pageSize: number; requestIp?: string; actionMethod?: string; requestUri?: string; httpMethod?: string; type?: string }>({ pageNum: 1, pageSize: 10 })
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
  { title: '模块', key: 'classPath' },
  { title: '方法', key: 'actionMethod' },
  { title: '路径', key: 'requestUri' },
  { title: '操作人', key: 'createBy', render: (row: any) => row.createBy || '-' },
  {
    title: '状态',
    key: 'type',
    render: (row: any) => {
      const text = row.echoMap?.type || (row.type === 'OPT' ? '正常' : '异常')
      const type = text === '正常' ? 'success' : 'error'
      return h(NTag, { bordered: false, type, style: { borderRadius: '6px' } }, { default: () => text })
    }
  },
  { title: 'IP', key: 'requestIp' },
  { title: '位置', key: 'location', render: () => '-' },
  { title: '时间', key: 'createTime', render: (row: any) => formatTime(row.createTime) }
]

const httpOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' }
]
const typeOptions = [
  { label: '正常', value: 'OPT' },
  { label: '异常', value: 'EXC' }
]

const load = async () => {
  loading.value = true
  const data = await getOperationLogPage({
    pageNum: query.value.pageNum,
    pageSize: query.value.pageSize,
    requestIp: query.value.requestIp,
    actionMethod: query.value.actionMethod,
    requestUri: query.value.requestUri,
    httpMethod: query.value.httpMethod,
    type: query.value.type
  })
  rows.value = data.records || []
  totalCount.value = Number((data as any).total || 0)
  pagination.value.page = Number((data as any).current || pagination.value.page)
  pagination.value.pageSize = Number((data as any).size || pagination.value.pageSize)
  ;(pagination.value as any).itemCount = Number((data as any).total || 0)
  loading.value = false
}

const handleClear = async (type?: number) => {
  await clearOperationLog(type)
  window.$message?.success('已清理')
  load()
}

onMounted(() => {
  load()
})

 

const handleSearch = () => {
  query.value.pageNum = 1
  pagination.value.page = 1
  load()
}

const handleReset = () => {
  query.value.requestIp = ''
  query.value.actionMethod = ''
  query.value.requestUri = ''
  query.value.httpMethod = undefined
  query.value.type = undefined
  query.value.pageNum = 1
  pagination.value.page = 1
  load()
}
</script>

<style scoped></style>