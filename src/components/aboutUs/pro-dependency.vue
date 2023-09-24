<template>
  <n-card :bordered="false" size="small">
    <n-blockquote style="display: flex; align-items: center; gap: 10px">
      <n-text depth="3">生产环境依赖</n-text>
      <n-popover trigger="hover">
        <template #trigger>
          <n-icon style="cursor: pointer"><Help /></n-icon>
        </template>
        <n-text depth="3">
          <n-text type="warning">黄色</n-text>表示依赖有新版本，<n-text type="success">绿色</n-text>表示最新版
        </n-text>
      </n-popover>
    </n-blockquote>
    <n-descriptions label-placement="left" bordered size="small">
      <n-descriptions-item v-for="item in dependencies" :key="item.name" :label="item.name">
        <n-text code>
          <n-text :type="item.version.startsWith('^') ? 'warning' : 'success'">
            {{ item.version }}
          </n-text>
        </n-text>
      </n-descriptions-item>
    </n-descriptions>
  </n-card>
</template>

<script setup lang="ts">
import { pkgJson } from './model'
import { Help } from '@vicons/tabler'

defineOptions({ name: 'ProDependency' })

const { dependencies } = pkgJson
</script>

<style scoped></style>
