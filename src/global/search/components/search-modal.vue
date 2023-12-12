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
          :maxlength="10"
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

      <!--搜索记录或者空列表-->
      <transition
        appear
        :enter-active-class="'animate__animated animate__bounceIn'"
        v-if="!resultOptions.length && !NOT_FOUND">
        <div
          v-if="!orderedArray.length"
          style="margin-top: 10px; display: flex; flex-direction: column; align-items: center; gap: 5px">
          <img src="../../../assets/svg/empty.svg" style="width: 140px; height: 140px" alt="" />
          <span style="color: #c0c0c0">暂无搜索记录</span>
        </div>

        <n-space v-else vertical justify="center" :size="2" style="margin-top: 5px">
          <span style="font-weight: bold; color: #2c964b">搜索记录</span>
          <search-record
            v-model:path="activePath"
            v-model:name="activeName"
            :options="orderedArray"
            @enter="handleEnter" />
        </n-space>
      </transition>

      <!--搜索结果-->
      <n-space v-if="resultOptions.length && !NOT_FOUND" vertical justify="center" :size="2" style="margin-top: 5px">
        <span style="font-weight: bold; color: #2c964b">路由菜单/子菜单</span>
        <search-result
          v-model:path="activePath"
          v-model:name="activeName"
          :options="resultOptions"
          @enter="handleEnter" />
      </n-space>

      <!--没有找到内容-->
      <n-space v-if="NOT_FOUND" align="center">
        <img src="../../../assets/svg/no-found.svg" style="width: 120px" alt="" />
        <n-space vertical justify="center" align="center">
          <span style="font-size: 16px">
            无法找到相关结果"
            <n-text type="error" style="font-weight: bold">{{ keyword }}</n-text>
            "
          </span>
          <div>
            可以尝试搜索：
            <span class="not-found" @click="Jump('/')">仪表板</span>
          </div>
        </n-space>
      </n-space>
    </n-space>

    <template #footer>
      <transition appear :enter-active-class="'animate__animated animate__bounceIn'">
        <search-footer />
      </transition>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { onKeyStroke, useDebounceFn } from '@vueuse/core'
import SearchResult from './search-result.vue'
import SearchFooter from './search-footer.vue'
import SearchRecord from './search-record.vue'
import { userStore } from '@/stores/user'
import { delay } from 'lodash-es'
import { Search } from '@vicons/tabler'
import { indexedDB } from '@/stores/indexedDB'

defineOptions({ name: 'SearchModal' })

const props = defineProps<{
  /** 弹窗显隐 */
  value: boolean
}>()

const emit = defineEmits<{
  (e: 'update:value', val: boolean): void
}>()
const searchStores = indexedDB()
const router = useRouter()
const menusStore = userStore().getMenus
const keyword = ref('')
const activePath = ref<string>('')
const activeName = ref<string>('')
/*是否找到内容*/
const NOT_FOUND = ref<boolean>(false)
/*搜索结果数组*/
const resultOptions = shallowRef<any>([])
const inputRef = ref<HTMLInputElement>()
type RouteItem = {
  path: string
  name: string
}
const orderedArray = ref<RouteItem[]>([])
/*获取全局搜索记录*/
searchStores.searchDB.length().then((val) => {
  if (val) {
    /*获取DB的数据*/
    searchStores.getSearchDB(val).then((r) => {
      orderedArray.value = r as RouteItem[]
    })
  }
})
/*使用vueUse中的防抖进行查询*/
const handleSearch = useDebounceFn(() => {
  /*清空值的时候还原*/
  if (!keyword.value) {
    NOT_FOUND.value = false
    resultOptions.value = []
    return
  }
  // 将输入框的值转为小写
  const keywordLowerCase = keyword.value.toLocaleLowerCase().trim()
  // 定义一个递归函数来搜索子菜单并将匹配项添加到 resultOptions.value
  const searchInChildren = (menu: any) => {
    /*只查询type为2的(页面)*/
    if (menu.name.toLocaleLowerCase().includes(keywordLowerCase) && menu.type === 2) {
      resultOptions.value.push(menu)
    }

    if (menu.children) {
      for (const child of menu.children) {
        if (child.type === 2) {
          searchInChildren(child)
        }
      }
    }
  }
  // 清空 resultOptions.value，以便开始新的搜索
  resultOptions.value = []
  // 使用递归函数来搜索匹配的菜单项
  menusStore.forEach((menu: string) => searchInChildren(menu))
  /*处理鼠标点击事件*/
  if (resultOptions.value.length > 0) {
    activePath.value = resultOptions.value[0].path
    activeName.value = resultOptions.value[0].name
  } else {
    NOT_FOUND.value = true
    activePath.value = ''
    activeName.value = ''
  }
}, 300)

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

const handleClose = () => {
  NOT_FOUND.value = false
  show.value = false
  /** 延时处理防止用户看到某些操作 */
  delay(() => {
    resultOptions.value = []
    keyword.value = ''
  }, 200)
}

/** key up */
const handleUp = () => {
  const options = Object.keys(resultOptions.value).length === 0 ? orderedArray.value : resultOptions.value
  const { length } = options
  if (length === 0) return

  const index = options.findIndex((item: any) => item.path === activePath.value)
  const newIndex = (index - 1 + length) % length

  activePath.value = options[newIndex].path
  activeName.value = options[newIndex].name
}

/** key down */
const handleDown = () => {
  const options = Object.keys(resultOptions.value).length === 0 ? orderedArray.value : resultOptions.value
  const { length } = options
  if (length === 0) return

  const index = options.findIndex((item: any) => item.path === activePath.value)
  const newIndex = (index + 1) % length

  activePath.value = options[newIndex].path
  activeName.value = options[newIndex].name
}

/** key enter */
const handleEnter = async () => {
  const { length } = resultOptions.value
  if ((length === 0 && orderedArray.value.length === 0) || activePath.value === '') return
  await router.push(activePath.value)
  handleClose()
  const index = orderedArray.value.findIndex((item) => item.path === activePath.value)
  // 把数组提出减少数组操作次数
  const newItem = { path: activePath.value, name: activeName.value }
  if (index > -1) {
    // 移动已存在的元素到数组开头，不需要两次数组操作
    orderedArray.value.splice(index, 1)
    orderedArray.value.unshift(newItem)
  } else {
    // 如果不存在，添加到数组末尾
    orderedArray.value.push(newItem)
  }
  await searchStores.setSearchDB(toRaw(orderedArray.value))
}

/*跳转到推荐页面*/
const Jump = (path: string) => {
  handleClose()
  delay(() => {
    router.push(path)
  }, 500)
}
onMounted(() => {
  onKeyStroke('Escape', handleClose)
  onKeyStroke('Enter', handleEnter)
  onKeyStroke('ArrowUp', handleUp)
  onKeyStroke('ArrowDown', handleDown)
})
</script>
<style scoped>
.not-found {
  color: #79b989;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
}
.not-found:hover {
  text-decoration: underline;
}
</style>
