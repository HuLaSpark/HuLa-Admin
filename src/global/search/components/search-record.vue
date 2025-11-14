<template>
  <n-scrollbar style="max-height: 360px">
    <template v-for="item in options" :key="item.path">
      <div style="padding: 0 5px 0 5px">
        <div
          class="box"
          :style="{
            background: item.path === active.path ? '#41b782' : '#e5f3ec',
            color: item.path === active.path ? '#f2f2f2' : '#2ba764',
            fontWeight: item.path === active.path ? 600 : 400
          }"
          @click="handleTo"
          @mouseenter="handleMouse(item)">
          <n-space justify="space-between" align="center">
            <n-space align="center">
              <n-icon :size="20" :component="Clock" />
              <n-space :size="10">
                <span>{{ item.name }}</span>
                <span style="font-size: 12px" :style="item.path === active.path ? 'text-decoration: underline' : ''">
                  {{ '/' + item.path }}
                </span>
              </n-space>
            </n-space>
            <n-icon class="del" :size="20" :component="X" @click.stop="handleDel(item)" />
          </n-space>
        </div>
      </div>
    </template>
  </n-scrollbar>
</template>

<script lang="ts" setup>
import { Clock, X } from '@vicons/tabler'
import { indexedDB } from '@/stores/indexedDB'

defineOptions({ name: 'SearchRecord' })
const searchStores = indexedDB()
const { path, name, options } = defineProps<{
  path: string
  name: string
  options: { path: string; name: string }[]
}>()

const emit = defineEmits<{
  (e: 'update:path', name: string): void
  (e: 'update:name', path: string): void
  (e: 'enter'): void
}>()

const active = computed({
  get() {
    return {
      name: name,
      path: path
    }
  },
  set(val: { name: string; path: string }) {
    emit('update:path', val.path)
    emit('update:name', val.name)
  }
})

/** 鼠标移入 */
const handleMouse = async (item: any) => {
  active.value = {
    name: item.name,
    path: item.path
  }
}

const handleTo = () => {
  emit('enter')
}
/*删除历史记录*/
const handleDel = async (item: any) => {
  const indexToDelete = options.findIndex((option) => option.path === item.path)
  if (indexToDelete !== -1) {
    ;(options as any).splice(indexToDelete, 1)
    if (indexToDelete < options.length - 1) {
      ;[options[indexToDelete], options[indexToDelete + 1]] = [options[indexToDelete + 1], options[indexToDelete]]
    }
  }
  /*先清空DB中的数据然后再重新赋值*/
  await searchStores.removeSearchDBAll().then(() => {
    searchStores.setSearchDB(toRaw(options))
  })
}
</script>
<style lang="scss" scoped>
@use '@/styles/scss/global-search';
</style>
