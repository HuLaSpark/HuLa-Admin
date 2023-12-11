<template>
  <n-space :vertical="true" :size="16">
    <n-card hoverable :bordered="false" size="small" style="border-radius: 8px">
      <n-blockquote style="display: flex; align-items: center; justify-content: space-between">
        <n-text depth="3">项目信息</n-text>
        <div class="clone">
          <n-popselect trigger="hover">
            <template #empty>
              <n-space vertical>
                <n-checkbox @update:checked="handleDev" :checked="dev.show">{{ dev.title }}</n-checkbox>
                <n-checkbox @update:checked="handlePro" :checked="pro.show">{{ pro.title }}</n-checkbox>
              </n-space>
            </template>
            <n-icon color="#656565" :size="18"><AdjustmentsHorizontal /></n-icon>
          </n-popselect>
        </div>
      </n-blockquote>
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
    <pro-dependency @proEmit="(ePro) => (pro = ePro)" />
    <dev-dependency @devEmit="(eDev) => (dev = eDev)" />
  </n-space>
</template>

<script setup lang="ts">
import { DevDependency, ProDependency } from '@/views/pagination/aboutUs/index'
import { AdjustmentsHorizontal, BrandGit, Package, Versions } from '@vicons/tabler'
import { pkgJson } from '@/common/model.ts'
import { indexedDB } from '@/stores/indexedDB'

const aboutUsStores = indexedDB()
const gitee = 'https://gitee.com/nongyehong'
const { version } = pkgJson
const latestBuildTime = PROJECT_BUILD_TIME
const dev = ref()
const pro = ref()
const linkOpen = (val: any) => {
  window.open(val)
}

const handleDev = (val: boolean) => {
  dev.value.show = val
  aboutUsStores.setAboutUsDB('dev', { title: dev.value.title, show: val })
}

const handlePro = (val: boolean) => {
  pro.value.show = val
  aboutUsStores.setAboutUsDB('pro', { title: pro.value.title, show: val })
}

onMounted(() => {
  aboutUsStores.aboutUsDB.length().then((D) => {
    if (D > 0) {
      aboutUsStores.getAboutUsDB('dev').then((r: any) => {
        dev.value.show = r.show
      })
      aboutUsStores.getAboutUsDB('pro').then((r: any) => {
        pro.value.show = r.show
      })
    } else {
      aboutUsStores.setAboutUsDB('dev', { title: dev.value.title, show: dev.value.show })
      aboutUsStores.setAboutUsDB('pro', { title: pro.value.title, show: pro.value.show })
    }
  })
})
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
.clone {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 22px;
  height: 22px;
  border-radius: 4px;
}
.clone:hover {
  background: #ececec;
}
</style>
