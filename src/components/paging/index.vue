<template>
  <n-pagination
    class="animate__animated animate__fadeInDown"
    background
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :layout="props.layout"
    :page-sizes="(props.pageSizes as any)"
    :total="props.total"
    v-bind="$attrs"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange" />
</template>
<script setup lang="ts">
const props = defineProps({
  total: {
    required: true,
    type: Number,
    default: 0 //赋予默认值，不然会报警告
  },
  page: {
    type: Number,
    default: 1
  },
  limit: {
    type: Number,
    default: 20
  },
  pageSizes: {
    type: Array,
    default() {
      return [10, 20, 30, 50]
    }
  },
  layout: {
    type: String,
    default: 'prev, pager, next,total'
  },
  autoScroll: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['pagination', 'update:page', 'update:limit'])

const currentPage = computed({
  get() {
    return props.page
  },
  set(val) {
    emit('update:page', val)
  }
})

const pageSize = computed({
  get() {
    return props.limit
  },
  set(val) {
    emit('update:limit', val)
  }
})

const handleSizeChange = (val: number) => {
  emit('pagination', { page: currentPage, limt: val })
}
const handleCurrentChange = (val: number) => {
  emit('pagination', { page: val, limt: pageSize })
}
</script>
