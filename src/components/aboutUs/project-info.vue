<template>
  <n-card :bordered="false" size="small">
    <n-blockquote><n-text depth="3">项目信息</n-text></n-blockquote>
    <n-descriptions label-placement="left" bordered size="small" :column="2">
      <n-descriptions-item label="版本">
        <n-tag class="tag" :bordered="false" type="info">
          <template #icon>
            <n-icon><Versions /></n-icon>
          </template>
          {{ version }}
        </n-tag>
      </n-descriptions-item>
      <n-descriptions-item label="最后编译时间">
        <n-tag class="tag" :color="{ textColor: '#bf8872' }" :bordered="false">
          <template #icon>
            <n-icon><Package /></n-icon>
          </template>
          <n-time time-zone="Asia/Shanghai" :time="new Date()" :to="new Date(latestBuildTime)" type="relative" />
        </n-tag>
      </n-descriptions-item>
      <n-descriptions-item label="项目地址">
        <n-tooltip trigger="hover" style="padding: 5px 8px 5px 8px">
          <template #trigger>
            <n-icon @click="linkOpen(gitee)" :size="22" class="link"><BrandGit /></n-icon>
          </template>
          gitee
        </n-tooltip>
      </n-descriptions-item>
      <n-descriptions-item label="预览地址">
        <a target="_blank">待上传</a>
      </n-descriptions-item>
    </n-descriptions>
  </n-card>
</template>

<script setup lang="ts">
import { pkgJson } from './model'
import { BrandGit, Versions, Package } from '@vicons/tabler'

defineOptions({ name: 'ProjectInfo' })

const gitee = 'https://gitee.com/nongyehong'
const { version } = pkgJson
const latestBuildTime = PROJECT_BUILD_TIME
const linkOpen = (val: any) => {
  window.open(val)
}
</script>

<style scoped>
.link {
  cursor: pointer;
  color: #cccccc;
  transition: all 0.9s ease;
}
.link:hover {
  color: #bc3f4a;
}
.tag {
  border-radius: 8px;
}
</style>
