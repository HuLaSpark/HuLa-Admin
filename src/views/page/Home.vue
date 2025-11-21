<template>
  <div class="p-4 space-y-4">
    <!-- 顶部概览统计 -->
    <n-grid :cols="4" x-gap="16" y-gap="16">
      <n-grid-item v-for="card in overviewCards" :key="card.key">
        <n-card :bordered="false" size="small">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-500">{{ card.label }}</div>
              <div class="mt-2 text-2xl font-semibold">
                {{ card.value }}
              </div>
            </div>
            <n-icon :component="card.icon" :size="32" class="text-primary" />
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 快捷入口 -->
    <n-card title="快捷入口" :bordered="false" size="small">
      <n-grid :cols="4" x-gap="16" y-gap="16">
        <n-grid-item v-for="entry in quickEntries" :key="entry.key">
          <n-card
            class="cursor-pointer hover:shadow-sm transition-shadow"
            size="small"
            @click="go(entry.path)">
            <div class="flex items-center gap-3">
              <n-icon :component="entry.icon" :size="26" />
              <div>
                <div class="font-medium">{{ entry.label }}</div>
                <div class="mt-1 text-xs text-gray-500">{{ entry.desc }}</div>
              </div>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>

    <!-- 风控与告警一览 -->
    <n-grid :cols="2" x-gap="16" y-gap="16">
      <n-grid-item>
        <n-card title="风控 / 黑名单概览" :bordered="false" size="small">
          <div class="space-y-3">
            <div class="flex items-center justify-between py-2 border-b border-gray-100">
              <span class="text-sm text-gray-600">今日新增黑名单</span>
              <span class="text-lg font-semibold text-red-500">{{ blackStats.todayNew }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-gray-100">
              <span class="text-sm text-gray-600">本周新增黑名单</span>
              <span class="text-lg font-semibold">{{ blackStats.weekNew }}</span>
            </div>
            <div class="flex items-center justify-between py-2">
              <span class="text-sm text-gray-600">黑名单总数</span>
              <span class="text-lg font-semibold">{{ blackStats.total }}</span>
            </div>
            <div class="mt-4">
              <n-button type="primary" size="small" @click="go('/im/black')">查看详情</n-button>
            </div>
          </div>
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card title="AI 使用概览" :bordered="false" size="small">
          <div class="space-y-3">
            <div class="flex items-center justify-between py-2 border-b border-gray-100">
              <span class="text-sm text-gray-600">今日调用次数</span>
              <span class="text-lg font-semibold text-blue-500">{{ aiStats.todayCalls }}</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-gray-100">
              <span class="text-sm text-gray-600">本周调用次数</span>
              <span class="text-lg font-semibold">{{ aiStats.weekCalls }}</span>
            </div>
            <div class="flex items-center justify-between py-2">
              <span class="text-sm text-gray-600">活跃模型数</span>
              <span class="text-lg font-semibold">{{ aiStats.activeModels }}</span>
            </div>
            <div class="mt-4">
              <n-button type="primary" size="small" @click="go('/ai/model')">查看详情</n-button>
            </div>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import { SmartHome, Message2, BrowserX, Settings, Users, Robot } from '@vicons/tabler'
import { getHomeStats } from '@/api/admin'

const router = useRouter()

// 统计数据
const stats = ref({
  todayActiveUser: 0,
  totalGroup: 0,
  blackCount: 0,
  aiCallToday: 0,
  monthlyLogin3PlusUserCount: 0
})

// 黑名单统计
const blackStats = ref({
  todayNew: 0,
  weekNew: 0,
  total: 0
})

// AI 统计
const aiStats = ref({
  todayCalls: 0,
  weekCalls: 0,
  activeModels: 0
})

// 加载统计数据
const loadStats = async () => {
  try {
    const response = await getHomeStats()

    // 更新顶部统计数据
    stats.value = {
      todayActiveUser: response.todayActiveUser,
      totalGroup: response.totalGroup,
      blackCount: response.blackCount,
      aiCallToday: response.aiCallToday,
      monthlyLogin3PlusUserCount: response.monthlyLogin3PlusUserCount || 0
    }

    // 更新黑名单统计
    blackStats.value = {
      todayNew: response.blackStats.todayNew,
      weekNew: response.blackStats.weekNew,
      total: response.blackStats.total
    }

    // 更新 AI 统计
    aiStats.value = {
      todayCalls: response.aiStats.todayCalls,
      weekCalls: response.aiStats.weekCalls,
      activeModels: response.aiStats.activeModels
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

const overviewCards = computed(() => [
  {
    key: 'todayActiveUser',
    label: '今日活跃用户',
    value: stats.value.todayActiveUser || 0,
    icon: Users
  },
  {
    key: 'totalGroup',
    label: '群聊总数',
    value: stats.value.totalGroup || 0,
    icon: Message2
  },
  {
    key: 'blackCount',
    label: '当前黑名单数',
    value: stats.value.blackCount || 0,
    icon: BrowserX
  },
  {
    key: 'aiCallToday',
    label: '今日 AI 调用',
    value: stats.value.aiCallToday || 0,
    icon: Robot
  }
  ,
  {
    key: 'monthlyLogin3PlusUserCount',
    label: '最近一月登录≥次3的用户',
    value: stats.value.monthlyLogin3PlusUserCount || 0,
    icon: Users
  }
])

const quickEntries = computed(() => [
  {
    key: 'user',
    label: '用户 / 黑名单管理',
    desc: '管理用户、拉黑 UID / IP，风控恶意账号',
    icon: SmartHome,
    path: '/im/user'
  },
  {
    key: 'black',
    label: '黑名单列表',
    desc: '查看并维护 im_black 黑名单记录',
    icon: BrowserX,
    path: '/im/black'
  },
  {
    key: 'group',
    label: '群聊管理',
    desc: '管理 im_room_group、群成员、群公告、群管理员',
    icon: Message2,
    path: '/im/group'
  },
  {
    key: 'moment',
    label: '朋友圈管理',
    desc: '审核动态内容，处理违规内容与举报',
    icon: Message2,
    path: '/im/moment'
  },
  {
    key: 'ai',
    label: 'AI 能力中心',
    desc: '配置 AI 平台与模型，查看调用情况',
    icon: SmartHome,
    path: '/ai/model'
  },
  {
    key: 'loginRank',
    label: '登录排行',
    desc: '按时间范围查看用户登录次数排行榜',
    icon: Users,
    path: '/stats/login-rank'
  },
  {
    key: 'activeUsers',
    label: '活跃用户',
    desc: '按时间范围查看活跃用户列表',
    icon: Users,
    path: '/im/active'
  },
  {
    key: 'config',
    label: 'IM 配置',
    desc: 'im_config 配置、系统参数与高级设置',
    icon: Settings,
    path: '/im/config'
  },
  {
    key: 'friend',
    label: '联系人 / 好友管理',
    desc: '联系人、好友关系、申请记录等',
    icon: BrowserX,
    path: '/im/contact'
  }
])

const go = (path: string) => {
  if (!path) return
  router.push(path)
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped></style>
