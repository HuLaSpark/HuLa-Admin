<template>
  <!-- 好友列表弹窗 -->
  <n-modal
    v-model:show="showModal"
    :mask-closable="true"
    :close-on-esc="true"
    :bordered="false"
    style="width: 600px"
    transform-origin="center">
    <n-card
      class="friend-list-modal"
      :title="`${currentUser?.nickName || currentUser?.userName || '用户'}的好友列表`"
      :bordered="false"
      size="small"
      closable
      @close="closeModal">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <n-spin size="large">
          <template #description>加载中...</template>
        </n-spin>
      </div>

      <!-- 空状态 -->
      <div v-else-if="friendList.length === 0" class="empty-container">
        <n-empty description="暂无好友" />
      </div>

      <!-- 好友列表 -->
      <div v-else class="friend-list">
        <div v-for="friend in friendList" :key="friend.uid" class="friend-item">
          <!-- 头像 -->
          <n-avatar
            class="friend-avatar"
            round
            :size="48"
            :src="AvatarUtils.getAvatarUrl(friend.avatar)"
            fallback-src="/logoD.png" />

          <!-- 好友信息 -->
          <div class="friend-info">
            <div class="friend-name">
              {{ friend.remark || friend.name }}
              <n-tag
                v-if="friend.remark"
                :bordered="false"
                size="small"
                type="info"
                class="remark-tag">
                备注
              </n-tag>
            </div>
            <div class="friend-meta">
              <span class="friend-id">UID: {{ friend.uid }}</span>
              <span class="friend-status">
                <span :class="['status-dot', friend.activeStatus === 1 ? 'online' : 'offline']"></span>
                {{ friend.activeStatus === 1 ? '在线' : '离线' }}
              </span>
            </div>
          </div>

          <!-- 权限标签 -->
          <div class="friend-permissions">
            <n-tag
              v-if="friend.hideMyPosts"
              :bordered="false"
              size="small"
              type="warning">
              不让TA看我
            </n-tag>
            <n-tag
              v-if="friend.hideTheirPosts"
              :bordered="false"
              size="small"
              type="default">
              不看TA
            </n-tag>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="!isLast && friendList.length > 0" class="load-more">
        <n-button
          :loading="loadingMore"
          text
          type="primary"
          @click="loadMore">
          加载更多
        </n-button>
      </div>

      <!-- 底部统计 -->
      <template #footer>
        <div class="modal-footer">
          <span class="friend-count">共 {{ friendList.length }} 位好友</span>
          <n-button @click="closeModal">关闭</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { pageUser } from '@/services/types'
import { getFriendList, type FriendItem } from '@/api/imFriend'
import { AvatarUtils } from '@/utils/avatar'
import { useMessage } from 'naive-ui'

const message = useMessage()
const showModal = ref(false)
const loading = ref(false)
const loadingMore = ref(false)
const currentUser = ref<pageUser | null>(null)
const friendList = ref<FriendItem[]>([])
const cursor = ref<string | undefined>(undefined)
const isLast = ref(false)

// 打开弹窗
const openModal = async (user: pageUser) => {
  currentUser.value = user
  showModal.value = true
  friendList.value = []
  cursor.value = undefined
  isLast.value = false
  await loadFriendList()
}

// 关闭弹窗
const closeModal = () => {
  showModal.value = false
}

// 加载好友列表
const loadFriendList = async () => {
  if (!currentUser.value?.uid) {
    message.error('用户UID不存在')
    return
  }

  loading.value = true
  try {
    const data = await getFriendList(currentUser.value.uid, {
      pageSize: 20,
      cursor: cursor.value
    })

    friendList.value = [...friendList.value, ...data.list]
    cursor.value = data.cursor
    isLast.value = data.isLast
  } catch (error) {
    console.error('加载好友列表失败:', error)
    message.error('加载好友列表失败')
  } finally {
    loading.value = false
  }
}

// 加载更多
const loadMore = async () => {
  if (isLast.value || loadingMore.value) return

  loadingMore.value = true
  try {
    await loadFriendList()
  } finally {
    loadingMore.value = false
  }
}

defineExpose({
  openModal
})
</script>

<style scoped lang="scss">
.friend-list-modal {
  max-height: 80vh;
  display: flex;
  flex-direction: column;

  :deep(.n-card__content) {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }

  :deep(.n-card__footer) {
    border-top: 1px solid #e8e8e8;
    padding: 12px 16px;
  }
}

.loading-container,
.empty-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.friend-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.friend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #f0f0f0;
    transform: translateX(4px);
  }

  .friend-avatar {
    flex-shrink: 0;
  }

  .friend-info {
    flex: 1;
    min-width: 0;

    .friend-name {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 600;
      color: #262626;
      margin-bottom: 4px;

      .remark-tag {
        font-size: 11px;
      }
    }

    .friend-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 12px;
      color: #8c8c8c;

      .friend-id {
        font-family: 'Courier New', monospace;
      }

      .friend-status {
        display: flex;
        align-items: center;
        gap: 4px;

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;

          &.online {
            background: #52c41a;
            box-shadow: 0 0 4px rgba(82, 196, 26, 0.5);
          }

          &.offline {
            background: #d9d9d9;
          }
        }
      }
    }
  }

  .friend-permissions {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-shrink: 0;
  }
}

.load-more {
  display: flex;
  justify-content: center;
  padding: 16px 0;
  border-top: 1px dashed #e8e8e8;
  margin-top: 12px;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .friend-count {
    font-size: 13px;
    color: #8c8c8c;
  }
}
</style>

