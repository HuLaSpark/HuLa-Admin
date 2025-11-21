<template>
  <div class="p-4 space-y-4">
    <n-card title="活跃用户" :bordered="false" size="small">
      <div class="mb-4">
        <n-form inline :model="query">
          <n-form-item label="时间范围">
            <n-select
              v-model:value="query.rangeDays"
              :options="rangeOptions"
              class="w-52"
              clearable
              placeholder="全部"
            />
          </n-form-item>
          <n-form-item label="条数">
            <n-input-number v-model:value="query.limit" :min="1" :max="500" class="w-52" />
          </n-form-item>
          <n-form-item>
            <n-space>
              <n-button type="primary" @click="handleSearch">查询</n-button>
              <n-button @click="handleReset">重置</n-button>
            </n-space>
          </n-form-item>
        </n-form>
      </div>
      <n-data-table :columns="columns" :data="rows" :bordered="false" />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { NAvatar, NSpace } from 'naive-ui'
import { getActiveUsers, type ActiveUserItem } from '@/api/admin'
import { AvatarUtils } from '@/utils/avatar'

const query = ref<{ rangeDays: number | undefined; limit: number }>({ rangeDays: 30, limit: 200 })
const rows = ref<ActiveUserItem[]>([])

const rangeOptions = [
  { label: '半月', value: 15 },
  { label: '一个月', value: 30 },
  { label: '三个月', value: 90 }
]

const columns = [
  {
    title: '用户',
    key: 'username',
    render: (row: any) =>
      h(
        NSpace,
        { justify: 'start', align: 'center' },
        {
          default: () => [
            h(NAvatar, {
              size: 'large',
              round: true,
              src: AvatarUtils.getAvatarUrl(row.avatar),
              fallbackSrc: '/logoD.png'
            }),
            h(
              NSpace,
              { vertical: true, size: 5 },
              {
                default: () => [
                  h('p', { style: { fontWeight: 'bold', padding: 0, margin: 0 } }, row.nickName || row.username),
                  h('p', { style: { color: '#ccc', fontSize: '12px', padding: 0, margin: 0 } }, row.username)
                ]
              }
            )
          ]
        }
      )
  },
  {
    title: '最后活跃时间',
    key: 'lastOptTime',
    render: (row: any) => {
      if (!row.lastOptTime) return '-'
      const date = new Date(row.lastOptTime)
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      const hh = String(date.getHours()).padStart(2, '0')
      const mm = String(date.getMinutes()).padStart(2, '0')
      const ss = String(date.getSeconds()).padStart(2, '0')
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
  },
  { title: '登录IP', key: 'ip' },
  { title: '登录地', key: 'location' },
  { title: '运营商', key: 'isp' },
  { title: '登录次数', key: 'loginTimes' }
]

const loadUsers = async () => {
  const data = await getActiveUsers({ rangeDays: query.value.rangeDays, limit: query.value.limit })
  rows.value = data || []
}

const handleSearch = () => {
  loadUsers()
}

const handleReset = () => {
  query.value.rangeDays = 30
  query.value.limit = 200
  loadUsers()
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped></style>