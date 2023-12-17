<template>
  <div>
    <div v-if="!$route.meta.pagination" class="content" v-show="show">
      <div class="animate__animated animate__fadeInRight" style="display: flex">
        <!-- id="drawer-target"挂载抽屉 -->
        <div class="routerView" id="drawer-target">
          <n-scrollbar style="max-height: calc(100vh - 152px)">
            <router-view />
          </n-scrollbar>
        </div>
      </div>
    </div>

    <div v-if="$route.meta.pagination" v-show="show">
      <div class="animate__animated animate__fadeInRight">
        <n-scrollbar style="max-height: calc(100vh - 118px); min-height: calc(100vh - 100px)">
          <div class="pagination">
            <router-view />
          </div>
        </n-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'

const store = mainStore()
const { BGC_OTHER, BGC } = storeToRefs(store)
const show = ref(false)

onMounted(() => {
  show.value = true
})
</script>

<style scoped>
.content {
  padding: 10px;
  background: v-bind(BGC_OTHER);
}
.routerView {
  flex: 1;
  background: v-bind(BGC);
  padding: 10px 10px 15px 10px;
  border-radius: 10px;
  min-height: calc(100vh - 150px);
}
.pagination {
  flex: 1;
  padding: 10px 10px 15px 10px;
  border-radius: 10px;
  min-height: calc(100vh - 152px);
  background: v-bind(BGC_OTHER);
}
/*抽屉遮罩样式*/
:deep(.n-drawer-mask),
:deep(.n-drawer) {
  border-radius: 10px;
}
/*end*/
</style>
