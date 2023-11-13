<template>
  <n-modal
    v-model:show="showModal"
    class="custom-card"
    preset="card"
    :style="bodyStyle"
    title="卡片预设"
    size="huge"
    :bordered="false">
    <template #header-extra> 噢! </template>
    内容
    <template #footer> 尾部 </template>
  </n-modal>
</template>

<script setup lang="ts">
const bodyStyle = ref({
  width: '600px'
})
const showModal = ref(false)
defineExpose({ showModal })
</script>

<style lang="scss" scoped></style>
