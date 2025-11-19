<template>
  <!-- 用户画像弹窗 - 微博风格 -->
  <n-modal
    v-model:show="showProfileModal"
    :mask-closable="true"
    :close-on-esc="true"
    :bordered="false"
    style="width: 480px"
    transform-origin="center">
    <n-card
      class="user-profile-card"
      :bordered="false"
      size="small"
      :segmented="{
        content: false,
        footer: false
      }">
      <!-- 顶部背景区域 -->
      <div class="profile-header">
        <!-- 背景渐变 -->
        <div class="header-bg"></div>
        <!-- 装饰性圆点 -->
        <div class="decoration-dot decoration-dot-1"></div>
        <div class="decoration-dot decoration-dot-2"></div>
        <div class="decoration-dot decoration-dot-3"></div>
        <!-- 关闭按钮 -->
        <div class="close-btn" @click="closeModal">
          <span class="close-icon">✕</span>
        </div>
      </div>

      <!-- 主体内容区 -->
      <div class="profile-content">
        <!-- 头像区域 - 向上偏移 -->
        <div class="avatar-section">
          <n-avatar
            class="user-avatar"
            round
            :size="90"
            :src="userProfile?.avatar || '/logoD.png'"
            fallback-src="/logoD.png" />
          <!-- 状态指示器 -->
          <div :class="['status-dot', userProfile?.status === 1 ? 'status-online' : 'status-offline']"></div>
        </div>

        <!-- 用户名和账号 -->
        <div class="user-info">
          <h2 class="user-name">{{ userProfile?.nickName || userProfile?.userName || '未知用户' }}</h2>
          <p class="user-id">ID: {{ userProfile?.userName || '-' }}</p>
        </div>

        <!-- 统计数据 - 微博风格 -->
        <div class="stats-section">
          <div class="stat-item" @click="handleStatClick('integrity')">
            <div class="stat-value">{{ calculateIntegrity(userProfile) }}%</div>
            <div class="stat-label">资料完整度</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item" @click="handleStatClick('role')">
            <div class="stat-value">{{ getRoleText(userProfile?.role) }}</div>
            <div class="stat-label">用户角色</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item" @click="handleStatClick('status')">
            <div :class="['stat-value', userProfile?.status === 1 ? 'text-success' : 'text-error']">
              {{ userProfile?.status === 1 ? '启用' : '禁用' }}
            </div>
            <div class="stat-label">账号状态</div>
          </div>
        </div>

        <!-- 详细信息卡片 -->
        <div class="info-cards">
          <!-- 联系方式 -->
          <div v-if="userProfile?.mobile || userProfile?.email" class="info-card">
            <div class="card-title">
              <span class="title-icon">📞</span>
              <span>联系方式</span>
            </div>
            <div class="card-content">
              <div v-if="userProfile?.mobile" class="info-row">
                <span class="info-label">手机号</span>
                <span class="info-value">{{ userProfile.mobile }}</span>
              </div>
              <div v-if="userProfile?.email" class="info-row">
                <span class="info-label">邮箱</span>
                <span class="info-value">{{ userProfile.email }}</span>
              </div>
            </div>
          </div>

          <!-- 账号信息 -->
          <div class="info-card">
            <div class="card-title">
              <span class="title-icon">ℹ️</span>
              <span>账号信息</span>
            </div>
            <div class="card-content">
              <div class="info-row">
                <span class="info-label">注册时间</span>
                <span class="info-value">{{ formatDate(userProfile?.createTime) }}</span>
              </div>
              <div v-if="userProfile?.updateTime" class="info-row">
                <span class="info-label">更新时间</span>
                <span class="info-value">{{ formatDate(userProfile?.updateTime) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <n-button
            class="action-btn"
            type="primary"
            size="large"
            strong
            @click="handleEdit">
            <template #icon>
              <span style="font-size: 18px">✏️</span>
            </template>
            编辑资料
          </n-button>
        </div>
      </div>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { pageUser } from '@/services/types'
import { RoleEnum } from '@/enums'
import { handRelativeTime } from '@/utils/Day'

const showProfileModal = ref(false)
const userProfile = ref<pageUser | null>(null)

const emit = defineEmits<{
  edit: [user: pageUser]
}>()

// 打开弹窗
const openProfile = (user: pageUser) => {
  userProfile.value = user
  showProfileModal.value = true
}

// 关闭弹窗
const closeModal = () => {
  showProfileModal.value = false
}

// 获取角色文本
const getRoleText = (role?: string) => {
  switch (role) {
    case RoleEnum.HL_ROOT:
      return '超级管理员'
    case RoleEnum.HL_SYS_MANAGE:
      return '系统管理员'
    default:
      return '普通用户'
  }
}

// 计算资料完整度
const calculateIntegrity = (user: pageUser | null) => {
  if (!user) return 0
  const nullCount = Object.values(user).filter((value) => value === null).length
  const totalDataCount = Object.keys(user).length
  return Math.round((1 - nullCount / totalDataCount) * 100)
}

// 格式化日期
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return handRelativeTime(dateStr)
}

// 处理编辑
const handleEdit = () => {
  if (userProfile.value) {
    emit('edit', userProfile.value)
    closeModal()
  }
}

// 处理统计项点击
const handleStatClick = (type: string) => {
  // 可以在这里添加统计项点击的逻辑
  console.log('Stat clicked:', type)
}

defineExpose({
  openProfile
})
</script>

<style scoped lang="scss">
.user-profile-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  animation: fadeInScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  :deep(.n-card__content) {
    padding: 0 !important;
  }
}

.profile-header {
  position: relative;
  height: 120px;
  overflow: hidden;

  .header-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    background-size: 200% 200%;
    animation: gradientShift 10s ease infinite;
  }

  .decoration-dot {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
    animation: float 3s ease-in-out infinite;

    &-1 {
      top: 20px;
      right: 60px;
      width: 24px;
      height: 24px;
      animation-delay: 0s;
    }

    &-2 {
      bottom: 20px;
      left: 40px;
      width: 18px;
      height: 18px;
      animation-delay: 1s;
    }

    &-3 {
      top: 50%;
      left: 20px;
      width: 14px;
      height: 14px;
      animation-delay: 2s;
    }
  }

  .close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    color: white;
    z-index: 10;

    .close-icon {
      font-size: 20px;
      font-weight: bold;
      line-height: 1;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.4);
      transform: scale(1.15) rotate(90deg);
    }

    &:active {
      transform: scale(1.05) rotate(90deg);
    }
  }
}

.profile-content {
  position: relative;
  padding: 0 24px 24px;
}

.avatar-section {
  position: relative;
  margin-top: -50px;
  margin-bottom: 16px;
  text-align: center;

  .user-avatar {
    border: 5px solid white;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
    }
  }

  .status-dot {
    position: absolute;
    bottom: 8px;
    right: 50%;
    transform: translateX(35px);
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    &.status-online {
      background: #52c41a;
      animation: pulse 2s ease-in-out infinite;
    }

    &.status-offline {
      background: #d9d9d9;
    }
  }
}

.user-info {
  text-align: center;
  margin-bottom: 20px;

  .user-name {
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 8px 0;
    letter-spacing: 0.5px;
  }

  .user-id {
    font-size: 14px;
    color: #8c8c8c;
    margin: 0;
    font-family: 'Courier New', monospace;
  }
}

.stats-section {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  padding: 0;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .stat-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 16px 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      background: rgba(255, 255, 255, 0.6);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }

    .stat-value {
      font-size: 18px;
      font-weight: 700;
      color: #1a1a1a;
      line-height: 1;

      &.text-success {
        color: #52c41a;
      }

      &.text-error {
        color: #ff4d4f;
      }
    }

    .stat-label {
      font-size: 12px;
      color: #8c8c8c;
      font-weight: 500;
    }
  }

  .stat-divider {
    width: 1px;
    background: linear-gradient(to bottom, transparent, #d9d9d9, transparent);
    margin: 12px 0;
  }
}

.info-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;

  .info-card {
    background: white;
    border: 1px solid #e8e8e8;
    border-radius: 10px;
    padding: 14px 16px;
    transition: all 0.3s ease;

    &:hover {
      border-color: #d9d9d9;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      transform: translateY(-1px);
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 14px;
      font-weight: 600;
      color: #262626;

      .title-icon {
        font-size: 16px;
      }
    }

    .card-content {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;

        .info-label {
          color: #8c8c8c;
          font-weight: 500;
        }

        .info-value {
          color: #262626;
          font-weight: 500;
          text-align: right;
          max-width: 60%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}

.action-buttons {
  display: flex;
  gap: 10px;

  .action-btn {
    flex: 1;
    height: 44px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(24, 144, 255, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// 卡片入场动画
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

// 渐变背景动画
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

// 浮动动画
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

// 脉冲动画
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>

