<template>
  <div class="p-4 space-y-4">
    <n-card title="登录次数排行榜" :bordered="false" size="small">
      <div class="flex items-center gap-3 mb-3">
        <n-select v-model:value="rangeDays" :options="rangeOptions" style="width: 180px" />
        <n-input-number v-model:value="limit" :min="1" :max="500" style="width: 160px" />
        <n-button type="primary" size="small" @click="loadRank">查询</n-button>
      </div>
      <n-data-table :columns="columns" :data="rows" :bordered="false" />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getLoginRank } from '@/api/admin'

const rangeDays = ref<number>(30)
const limit = ref<number>(50)
const rows = ref<Array<{ username: string; nickName: string; total: number }>>([])

const rangeOptions = [
  { label: '半月', value: 15 },
  { label: '一个月', value: 30 },
  { label: '三个月', value: 90 }
]

const columns = [
  { title: '用户名', key: 'username' },
  { title: '昵称', key: 'nickName' },
  { title: '登录总次数', key: 'total' }
]

const loadRank = async () => {
  const data = await getLoginRank({ rangeDays: rangeDays.value, limit: limit.value })
  rows.value = data || []
}

onMounted(() => {
  loadRank()
})
</script>

<style scoped></style>