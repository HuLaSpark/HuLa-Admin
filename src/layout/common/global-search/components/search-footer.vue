<template>
  <n-space align="center" style="padding: 5px 20px">
    <n-space align="center" :size="5">
      <n-icon :size="18"><ArrowBack /></n-icon>
      <span>确认</span>
    </n-space>
    <n-space align="center" :size="5">
      <n-icon :size="18"><ArrowUp /></n-icon>
      <n-icon :size="18"><ArrowDown /></n-icon>
      <span>切换</span>
    </n-space>
    <n-space align="center" :size="5">
      <n-icon :size="20"><Click /></n-icon>
      <span>关闭</span>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
import { ArrowBack, ArrowUp, ArrowDown, Click } from '@vicons/tabler'
defineOptions({ name: 'SearchFooter' })
</script>
<style scoped>
:deep(.n-icon) {
  display: flex;
  align-items: center;
}
</style>
