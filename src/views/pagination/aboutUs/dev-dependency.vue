<template>
  <n-card hoverable :bordered="false" size="small" style="border-radius: 8px" v-if="dev.show">
    <n-blockquote style="display: flex; align-items: center; gap: 10px">
      <n-text depth="3">{{ dev.title }}</n-text>
      <n-popover trigger="hover">
        <template #trigger>
          <n-icon style="cursor: pointer" :component="Help" />
        </template>
        <n-text depth="3">
          <n-space vertical>
            <span> <n-text type="warning">黄色</n-text>表示当前库的版本更新到第一个数字中的最新版本 </span>
            <span> <n-text type="success">绿色</n-text>表示固定版本 </span>
          </n-space>
        </n-text>
      </n-popover>
    </n-blockquote>
    <n-descriptions label-placement="left" bordered size="small">
      <n-descriptions-item v-for="item in devDependencies" :key="item.name" :label="item.name">
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
import { pkgJson } from '@/common/model.ts'
import { Help } from '@vicons/tabler'

defineOptions({ name: 'DevDependency' })

const { devDependencies } = pkgJson

const dev = reactive({
  title: '开发环境依赖',
  show: true
})
const emit = defineEmits(['devEmit'])
const devEmit = () => {
  emit('devEmit', dev)
}
devEmit()
</script>

<style scoped></style>
