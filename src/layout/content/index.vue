<template>
  <div>
    <div v-if="!pagination" class="content" v-show="show">
      <div class="animate__animated animate__fadeInRight">
        <div class="routerView">
          <n-scrollbar style="max-height: calc(100vh - 152px)">
            <router-view />
          </n-scrollbar>
        </div>
      </div>
    </div>

    <div v-if="pagination" v-show="show">
      <div v-if="$route.path === '/odometer'" class="odometer">
        <Odometer />
      </div>

      <div v-else class="animate__animated animate__fadeInRight">
        <n-scrollbar style="max-height: calc(100vh - 118px)">
          <div class="pagination">
            <router-view />
          </div>
        </n-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Odometer from '@/views/system/Odometer.vue'
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import Mit from '@/utils/Bus'

const store = mainStore()
const { BGC_OTHER, BGC } = storeToRefs(store)
const show = ref(false)
/*页面是否是分块*/
const pagination = ref<boolean>(false)

// 接收指定事件传递的值
Mit.on('pagination', (value) => {
  pagination.value = value as boolean
})

onMounted(() => {
  show.value = true
})
</script>

<style scoped>
.routerView {
  background: v-bind(BGC);
  padding: 10px 10px 15px 10px;
  border-radius: 10px;
  min-height: calc(100vh - 152px);
}

.odometer {
  flex: 1;
  padding: 10px 0 15px 10px;
  background: v-bind(BGC_OTHER);
}

.pagination {
  flex: 1;
  padding: 10px 10px 15px 10px;
  border-radius: 10px;
  min-height: calc(100vh - 152px);
  background: v-bind(BGC_OTHER);
}

/*兼容不同分辨率的电脑*/
@media screen and (max-width: 2560px) {
  .content {
    flex: 1;
    min-width: 2310px;
    padding: 10px;
    background: v-bind(BGC_OTHER);
  }
}

@media screen and (max-width: 1920px) {
  .content {
    flex: 1;
    min-width: 1670px;
    padding: 10px;
    background: v-bind(BGC_OTHER);
  }
}

@media screen and (max-width: 1680px) {
  .content {
    flex: 1;
    min-width: 1430px;
    padding: 10px;
    background: v-bind(BGC_OTHER);
  }
}

@media screen and (max-width: 1600px) {
  .content {
    flex: 1;
    min-width: 1350px;
    padding: 10px;
    background: v-bind(BGC_OTHER);
  }
}

@media screen and (max-width: 1366px) {
  .content {
    flex: 1;
    min-width: 1116px;
    padding: 10px;
    background: v-bind(BGC_OTHER);
  }
}

@media screen and (max-width: 1360px) {
  .content {
    flex: 1;
    min-width: 1110px;
    padding: 10px;
    background: v-bind(BGC_OTHER);
  }
}

@media screen and (max-width: 1280px) {
  .content {
    flex: 1;
    min-width: 1030px;
    padding: 10px;
    background: v-bind(BGC_OTHER);
  }
}
</style>
