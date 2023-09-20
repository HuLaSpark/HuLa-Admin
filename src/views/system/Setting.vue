<template>
  <Pagination :total="total" v-model:page="pageNum" v-model:limit="pageSize" @pagination="null" />
</template>

<script setup lang="ts">
import Pagination from '@/components/paging/index.vue'
import paging from '@/hooks/usePaging'

/*解构分页参数*/
const { pageNum, pageSize, total } = paging
</script>

<style scoped></style>
