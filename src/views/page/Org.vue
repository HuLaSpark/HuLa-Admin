<template>
  <div class="p-4 space-y-4">
    <n-card title="组织机构" :bordered="false" size="small">
      <div class="mb-4">
        <n-form inline :model="query">
          <n-form-item label="关键词">
            <n-input v-model:value="query.keyword" placeholder="组织名称/编码" class="w-52" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatTime } from '@/utils/time'
import { getOrgPage, type OrgItem } from '@/api/org'

const query = ref<{ keyword?: string; pageNum: number; pageSize: number }>({ pageNum: 1, pageSize: 10 })
const rows = ref<OrgItem[]>([])
const loading = ref(false)
const pagination = ref({ page: 1, pageSize: 10, pageSizes: [10, 20, 50], showSizePicker: true, showQuickJumper: true, itemCount: 0, onUpdatePage: (p: number) => {
  pagination.value.page = p
  query.value.pageNum = p
  load()
}, onUpdatePageSize: (s: number) => {
  pagination.value.pageSize = s
  query.value.pageSize = s
  query.value.pageNum = 1
  pagination.value.page = 1
  load()
} })

const columns = [
  { title: '组织名称', key: 'name' },
  { title: '编码', key: 'code', render: (row: any) => row.code || '-' },
  { title: '父级ID', key: 'parentId' },
  { title: '排序', key: 'sort' },
  { title: '状态', key: 'state' },
  { title: '创建时间', key: 'createTime', render: (row: any) => formatTime(row.createTime) },
  { title: '更新时间', key: 'updateTime', render: (row: any) => formatTime(row.updateTime) }
]

const load = async () => {
  loading.value = true
  const data = await getOrgPage({ pageNum: query.value.pageNum, pageSize: query.value.pageSize, keyword: query.value.keyword })
  rows.value = data.records || []
  pagination.value.page = Number((data as any).current || pagination.value.page)
  pagination.value.pageSize = Number((data as any).size || pagination.value.pageSize)
  pagination.value.itemCount = Number((data as any).total || 0)
  loading.value = false
}

const handleSearch = () => {
  query.value.pageNum = 1
  pagination.value.page = 1
  load()
}

const handleReset = () => {
  query.value.keyword = ''
  query.value.pageNum = 1
  pagination.value.page = 1
  load()
}

onMounted(() => {
  load()
})

 
</script>

<style scoped></style>