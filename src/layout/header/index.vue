<template>
  <div :class="collapsed ? 'header-unfold' : 'header-shrink'">
    <!--标签页-->
    <Tab />

    <div class="operation-list">
      <!--全局搜索-->
      <div class="search operation-list-box">
        <GlobalSearch />
      </div>
      <n-divider vertical />
      <!--清理缓存-->
      <div class="operation-list-box">
        <n-tooltip trigger="hover" style="padding: 5px 8px 5px 8px">
          <template #trigger>
            <n-icon :size="24"><Trash /></n-icon>
          </template>
          {{ t('delete_cache') }}
        </n-tooltip>
      </div>
      <n-divider vertical />
      <!--全屏-->
      <div class="operation-list-box">
        <n-tooltip trigger="hover" style="padding: 5px 8px 5px 8px">
          <template #trigger>
            <n-icon :size="24" @click="handleMaximize" :component="fullIcon ? ArrowsMinimize : ArrowsMaximize" />
          </template>
          {{ fullIcon ? t('small_screen') : t('full_screen') }}
        </n-tooltip>
      </div>
      <n-divider vertical />
      <!--切换语言组件-->
      <div class="operation-list-box">
        <Language />
      </div>
      <n-divider vertical />
      <!--终端-->
      <div class="operation-list-box">
        <n-tooltip trigger="hover" style="padding: 5px 8px 5px 8px">
          <template #trigger>
            <n-icon :size="24" @click="handleTerminal"><Terminal2 /></n-icon>
          </template>
          {{ t('terminal') }}
        </n-tooltip>
      </div>
      <n-divider vertical />
      <!--消息-->
      <div class="operation-list-box">
        <n-tooltip trigger="hover" style="padding: 5px 8px 5px 8px">
          <template #trigger>
            <n-popover trigger="click" placement="bottom" :width="250">
              <template #trigger>
                <div style="padding-right: 10px; display: flex; align-items: center">
                  <n-icon :size="24" :component="Bell" />
                  <n-badge style="position: absolute; transform: scale(0.75)" :value="1" :max="99" :offset="[28, -9]" />
                </div>
              </template>
              <!--使用穿透不生效的时候可以在节点外套一层div-->
              <div>
                <n-tabs type="segment" :animated="true">
                  <n-tab-pane name="msg">
                    <template #tab>
                      <div style="display: flex; align-items: center; gap: 5px">
                        <n-icon size="20" :component="Mail" />
                        <span>我的消息</span>
                      </div>
                    </template>
                    <n-scrollbar style="max-height: 375px">
                      <n-list hoverable clickable>
                        <n-list-item>
                          <n-thing title="相见恨晚" content-style="margin-top: 10px;">
                            <template #description>
                              <n-space size="small" style="margin-top: 4px">
                                <n-tag :bordered="false" type="info" size="small"> 暑夜 </n-tag>
                                <n-tag :bordered="false" type="info" size="small"> 晚春 </n-tag>
                              </n-space>
                            </template>
                            奋勇呀然后休息呀<br />
                            完成你伟大的人生
                          </n-thing>
                        </n-list-item>
                        <n-list-item>
                          <n-thing title="他在时间门外" content-style="margin-top: 10px;">
                            <template #description>
                              <n-space size="small" style="margin-top: 4px">
                                <n-tag :bordered="false" type="info" size="small"> 环形公路 </n-tag>
                                <n-tag :bordered="false" type="info" size="small"> 潜水艇司机 </n-tag>
                              </n-space>
                            </template>
                            最新的打印机<br />
                            复制着彩色傀儡<br />
                            早上好我的罐头先生<br />
                            让他带你去被工厂敲击
                          </n-thing>
                        </n-list-item>
                      </n-list>
                    </n-scrollbar>
                  </n-tab-pane>
                  <n-tab-pane name="inform">
                    <template #tab>
                      <div style="display: flex; align-items: center; gap: 5px">
                        <n-icon size="20" :component="Message2" />
                        <span>系统通知</span>
                      </div>
                    </template>
                    “威尔！着火了！快来帮忙！”我听到女朋友大喊。现在一个难题在我面前——是恢复一个重要的 Amazon
                    服务，还是救公寓的火。<br /><br />
                    我的脑海中忽然出现了 Amazon
                    著名的领导力准则”客户至上“，有很多的客户还依赖我们的服务，我不能让他们失望！所以着火也不管了，女朋友喊我也无所谓，我开始
                    debug 这个线上问题。
                  </n-tab-pane>
                </n-tabs>
              </div>
            </n-popover>
          </template>
          {{ t('msg') }}
        </n-tooltip>
      </div>
      <n-divider vertical />
      <!--	头像	-->
      <div class="operation-list-box">
        <n-popover trigger="hover" placement="bottom" :width="250">
          <template #trigger>
            <n-badge :type="networkIcon" dot processing>
              <n-avatar :size="34" :src="avatar" style="border-radius: 8px" />
            </n-badge>
          </template>
          <template #header>
            <n-text depth="1">
              <n-space vertical>
                <n-tag class="info-tag" size="small" round :bordered="false" type="success">
                  {{ userInfoStore.getCompanyName }}
                </n-tag>
                <div class="info-content">
                  <n-avatar :size="64" :src="avatar" style="border-radius: 8px" />
                  <div>
                    <span>{{ userName }}</span>
                    <div>{{ email }}</div>
                  </div>
                </div>
              </n-space>
            </n-text>
          </template>
          内容
          <template #footer>
            <div style="display: flex; justify-content: space-between">
              <n-button quaternary type="tertiary"> 个人信息 </n-button>
              <n-tooltip trigger="hover" content-style="padding: 0">
                <template #trigger>
                  <n-popconfirm
                    :positive-button-props="{ type: 'error' }"
                    :positive-text="t('confirm')"
                    :negative-text="t('cancel')"
                    @positive-click="userExit">
                    <template #icon>
                      <n-icon color="#e86060"><AlertTriangle /></n-icon>
                    </template>
                    <template #trigger>
                      <n-button secondary round circle type="error">
                        <template #icon>
                          <n-icon><Power /></n-icon>
                        </template>
                      </n-button>
                    </template>
                    {{ t('out_confirm') }}
                  </n-popconfirm>
                </template>
                {{ t('logout') }}
              </n-tooltip>
            </div>
          </template>
        </n-popover>
      </div>
      <n-divider vertical />
      <!-- 设置组件 -->
      <div class="operation-list-box">
        <Settings />
      </div>
    </div>
  </div>
  <!--终端弹框-->
  <n-modal
    v-model:show="showModal"
    title="终端"
    :mask-closable="false"
    style="width: 650px; height: 650px"
    :show-icon="false"
    preset="card">
    <Terminal />
  </n-modal>
</template>

<script setup lang="ts">
import { mainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'
import { userStore } from '@/stores/user'
import {
  AlertTriangle,
  ArrowsMaximize,
  ArrowsMinimize,
  Bell,
  Mail,
  Message2,
  Power,
  Terminal2,
  Trash
} from '@vicons/tabler'
import { i18n } from '@/i18n'
import Settings from '@/global/settings/index.vue'
import screenfull from 'screenfull'
import { useLogin } from '@/hooks/useLogin'
import { Loading } from 'notiflix'
import { delay } from 'lodash-es'
import GlobalSearch from '@/global/search/index.vue'
import { networkIcon } from '@/services/request'

const { t } = i18n.global
const message = useMessage()
const store = mainStore()
const userInfoStore = userStore()
const user = userInfoStore.getUser
const { userName, email, avatar } = user
const { BGC, TEXT_COLOR, BGC_OTHER } = storeToRefs(store)
const showModal = ref(false)
const fullIcon = ref(false)
const { navigator } = window

/*获取父组件传来的值*/
const { collapsed } = defineProps<{
  collapsed: boolean
}>()
/*判断当前网络状态*/
window.addEventListener('online', () => {
  console.log('设备已连接网络')
  networkIcon.value = 'success'
})
window.addEventListener('offline', () => {
  message.error(t('network_state'))
  networkIcon.value = 'error'
})

watchEffect(() => {
  networkIcon.value = navigator.onLine ? 'success' : 'error'
})

/*全屏功能*/
const handleMaximize = () => {
  if (!screenfull.isEnabled) {
    message.error('当前浏览器不支持全屏')
    return false
  }
  /*监听当前页面是否进入全屏状态*/
  document.addEventListener('fullscreenchange', () => {
    fullIcon.value = !!document.fullscreenElement
  })
  screenfull.toggle()
}
/*打开终端*/
const handleTerminal = () => {
  showModal.value = true
}

/*用户退出*/
const userExit = () => {
  Loading.hourglass()
  delay(() => {
    Loading.remove()
    useLogin().exit()
  }, 500)
}
</script>

<style lang="scss" scoped>
@use '@/styles/scss/layout-header.scss';
:deep(.n-tabs-capsule) {
  width: 122px !important;
  height: 33px !important;
  transform: translateX(0px);
}
:deep(.n-tabs .n-tabs-rail .n-tabs-tab-wrapper .n-tabs-tab.n-tabs-tab--active) {
  color: #189f57;
}
.operation-list {
  color: v-bind(TEXT_COLOR);
  background-color: v-bind(BGC);
}
.info-content {
  display: flex;
  align-items: center;
  gap: 10px;
  span {
    font-weight: bold;
  }
}
.info-tag {
  display: flex;
  justify-content: center;
}
.search {
  background: v-bind(BGC_OTHER);
}
</style>
