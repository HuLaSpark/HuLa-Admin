<template>
  <n-modal
    v-model:show="show"
    :segmented="{ footer: 'soft' }"
    :closable="false"
    preset="card"
    footer-style="padding: 0; margin: 0"
    style="position: fixed; top: 50px; width: 500px; left: calc(50% - (250px)); border-radius: 8px"
    @after-leave="handleClose">
    <n-space vertical>
      <n-input-group>
        <n-input
          style="border-radius: 10px"
          ref="inputRef"
          v-model:value="keyword"
          clearable
          placeholder="请输入关键词搜索"
          @input="handleSearch">
          <template #prefix>
            <n-icon :component="Search" />
          </template>
        </n-input>
      </n-input-group>

      <n-empty style="margin-top: 10px" v-if="resultOptions.length === 0" description="暂无搜索结果" />
      <search-result v-else v-model:value="activePath" :options="resultOptions" @enter="handleEnter" />
    </n-space>
    <template #footer>
      <search-footer />
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { onKeyStroke, useDebounceFn } from '@vueuse/core'
import SearchResult from './search-result.vue'
import SearchFooter from './search-footer.vue'
import { userStore } from '@/stores/user'
import { delay } from 'lodash-es'
import { Search } from '@vicons/tabler'

defineOptions({ name: 'SearchModal' })

interface Props {
  /** 弹窗显隐 */
  value: boolean
}

const props = defineProps<Props>()

interface Emits {
  (e: 'update:value', val: boolean): void
}

const emit = defineEmits<Emits>()

const router = useRouter()
const menusStore = userStore().getMenus
const keyword = ref('')
const activePath = ref('')
const resultOptions = shallowRef<any>([])
const inputRef = ref<HTMLInputElement>()

/*使用vueUse中的防抖*/
const handleSearch = useDebounceFn(search, 300)

const show = computed({
  get() {
    return props.value
  },
  set(val: boolean) {
    emit('update:value', val)
  }
})

watch(show, async (val) => {
  if (val) {
    /** 自动聚焦 */
    await nextTick()
    inputRef.value?.focus()
  }
})

/** 查询 */
function search() {
  /*清空值的时候还原*/
  if (!keyword.value) {
    resultOptions.value = []
    return false
  }
  // 定义一个递归函数来搜索子菜单并将匹配项添加到 resultOptions.value
  const searchInChildren = (menu: any, keyword: string) => {
    const keywordLowerCase = keyword.toLocaleLowerCase().trim()
    /*只查询type为2的(页面)*/
    if (menu.name.toLocaleLowerCase().includes(keywordLowerCase) && menu.type === 2) {
      resultOptions.value.push(menu)
    }

    if (menu.children) {
      for (const child of menu.children) {
        if (child.type === 2) {
          searchInChildren(child, keyword)
        }
      }
    }
  }
  // 清空 resultOptions.value，以便开始新的搜索
  resultOptions.value = []
  // 使用递归函数来搜索匹配的菜单项
  menusStore.forEach((menu: string) => searchInChildren(menu, keyword.value))
  if (resultOptions.value.length > 0) {
    activePath.value = '/' + resultOptions.value[0].path
  } else {
    activePath.value = ''
  }
}

const handleClose = () => {
  show.value = false
  /** 延时处理防止用户看到某些操作 */
  delay(() => {
    resultOptions.value = []
    keyword.value = ''
  }, 200)
}

/** key up */
const handleUp = () => {
  const { length } = resultOptions.value
  if (length === 0) return
  const index = resultOptions.value.findIndex((item: any) => item.path === activePath.value)
  if (index === 0) {
    activePath.value = resultOptions.value[length - 1].path
  } else {
    activePath.value = resultOptions.value[index - 1].path
  }
}

/** key down */
const handleDown = () => {
  const { length } = resultOptions.value
  if (length === 0) return
  const index = resultOptions.value.findIndex((item: any) => item.path === activePath.value)
  if (index + 1 === length) {
    activePath.value = resultOptions.value[0].path
  } else {
    activePath.value = resultOptions.value[index + 1].path
  }
}

/** key enter */
const handleEnter = () => {
  const { length } = resultOptions.value
  if (length === 0 || activePath.value === '') return
  const routeItem = resultOptions.value.find((item: any) => item.path === activePath.value)
  if (routeItem?.meta?.href) {
    window.open(activePath.value, '__blank')
  } else {
    router.push(activePath.value)
    handleClose()
  }
}

onKeyStroke('Escape', handleClose)
onKeyStroke('Enter', handleEnter)
onKeyStroke('ArrowUp', handleUp)
onKeyStroke('ArrowDown', handleDown)
</script>
