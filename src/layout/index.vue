<template>
  <div class="layout">
    <Aside @collapsed="handleCollapsed" />
    <div>
      <Header :collapsed="collapsed" />
      <Content />
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import Header from '@/layout/header/index.vue'
import Content from '@/layout/content/index.vue'
import Footer from './footer/index.vue'
import Aside from '@/layout/aside/index.vue'
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'

/*在layout中挂载需要挂载全局的hook*/
window.$message = useMessage()
window.$notification = useNotification()
const store = mainStore()
const { BGC_OTHER } = storeToRefs(store)
const collapsed = ref(false)

const handleCollapsed = (val: any) => {
  collapsed.value = val
  console.log('lay', collapsed.value)
}
</script>

<style scoped>
/*设置动态高度*/
.layout {
  display: flex;
  min-height: calc(100vh - 30px);
  background: v-bind(BGC_OTHER);
}
</style>
