<template>
  <div class="p-4 space-y-4">
    <n-card :title="pageTitle">
      <p class="mb-2 text-xs text-gray-500">
        当前路由：{{ route.path }}
      </p>
      <n-alert type="info" title="消息相关页面">
        这里是消息相关页面的占位内容，后续可以在这里接入消息列表、通知、站内信等功能。
      </n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pageTitle = computed(() => (route.meta.title as string) || '消息中心')
</script>

