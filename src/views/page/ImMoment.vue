<template>
  <div class="p-4 space-y-4">
    <n-card title="朋友圈管理">
      <div class="mb-4">
        <n-form inline :model="query">
          <n-form-item label="用户昵称">
            <n-input
              v-model:value="query.userName"
              class="w-52"
              clearable
              placeholder="请输入用户昵称"
            />
          </n-form-item>
          <n-form-item>
            <n-space>
              <n-button type="primary" @click="handleSearch">
                查询
              </n-button>
              <n-button @click="handleReset">
                重置
              </n-button>
            </n-space>
          </n-form-item>
        </n-form>
      </div>

      <n-data-table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :bordered="false"
        :row-key="rowKey"
      />

      <div class="mt-4 flex items-center justify-center">
        <n-button v-if="!isLast" :loading="loading" @click="loadMore">
          加载更多
        </n-button>
        <span v-else class="text-xs text-gray-400">已加载全部数据</span>
      </div>
    </n-card>

    <n-modal
      v-model:show="showCommentModal"
      preset="card"
      title="朋友圈评论"
      :mask-closable="true"
      :bordered="false"
      :segmented="{ content: 'soft', footer: 'soft' }"
      style="width: 880px; max-width: 100%"
    >
      <div class="space-y-4">
        <div class="p-4 bg-gray-50 rounded">
          <div class="flex items-center gap-3 mb-3">
            <n-avatar
              :src="currentFeed?.userAvatar"
              :size="44"
              round
              :fallback-src="'https://api.dicebear.com/7.x/avataaars/svg?seed=' + currentFeed?.userName"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <div class="text-sm font-medium truncate">{{ currentFeed?.userName }}</div>
                <div class="text-xs text-gray-500">{{ currentFeed?.createTime }}</div>
              </div>
              <div class="text-sm text-gray-700 mt-2 break-words">{{ currentFeed?.content }}</div>
            </div>
          </div>
        </div>

        <div v-if="commentLoading" class="text-center py-8">
          <n-spin size="medium" />
        </div>

        <div v-else-if="commentList.length === 0" class="text-center py-8 text-gray-400">
          暂无评论
        </div>

        <div v-else class="space-y-3 max-h-[520px] overflow-y-auto">
          <div
            v-for="comment in commentList"
            :key="comment.id"
            class="p-3 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start gap-3">
              <n-avatar
                :src="comment.userAvatar"
                :size="38"
                round
                :fallback-src="'https://api.dicebear.com/7.x/avataaars/svg?seed=' + comment.userName"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 min-w-0">
                    <div class="text-sm font-medium truncate">{{ comment.userName }}</div>
                    <div class="text-xs text-gray-500 truncate">UID: {{ comment.uid }}</div>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="text-xs text-gray-400">{{ comment.createTime }}</div>
                    <n-popconfirm @positive-click="handleDeleteComment(comment.id)">
                      <template #trigger>
                        <n-button size="tiny" type="error" quaternary>
                          删除
                        </n-button>
                      </template>
                      确定删除该评论吗？
                    </n-popconfirm>
                  </div>
                </div>
                <div v-if="comment.replyUserName" class="text-xs text-gray-500 mt-1">
                  回复 @{{ comment.replyUserName }}
                </div>
                <div class="text-sm text-gray-700 mt-2 break-words">{{ comment.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { h, onMounted, ref } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NButton, NSpace } from 'naive-ui'
import {
  deleteImFeed,
  deleteImFeedComment,
  getImFeedComments,
  getImFeedList,
  type ImFeedItem
} from '@/api/imFeed'

const loading = ref(false)
const tableData = ref<ImFeedItem[]>([])
const cursor = ref<string | null>(null)
const isLast = ref(false)
const pageSize = ref(10)

const query = ref({
  userName: ''
})

const showCommentModal = ref(false)
const commentLoading = ref(false)
const commentList = ref<any[]>([])
const currentFeed = ref<ImFeedItem | null>(null)

const columns: DataTableColumns<ImFeedItem> = [
  {
    title: '用户昵称',
    key: 'userName',
    width: 200
  },
  {
    title: '内容',
    key: 'content',
    minWidth: 240
  },
  {
    title: '媒体类型',
    key: 'mediaType',
    width: 100,
    render(row) {
      if (row.mediaType === 1) return '图片'
      if (row.mediaType === 2) return '视频'
      return '文本'
    }
  },
  {
    title: '权限',
    key: 'permission',
    width: 140,
    render(row) {
      const map: Record<string, string> = {
        privacy: '仅自己可见',
        open: '公开',
        partVisible: '部分可见',
        notAnyone: '不给谁看'
      }
      return map[row.permission] || row.permission || '-'
    }
  },
  {
    title: '点赞数',
    key: 'likeCount',
    width: 80
  },
  {
    title: '评论数',
    key: 'commentCount',
    width: 80
  },
  {
    title: '操作',
    key: 'actions',
    width: 180,
    render(row) {
      return h(
        NSpace,
        { size: 'small' },
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                type: 'primary',
                quaternary: true,
                onClick: () => handleViewComments(row)
              },
              { default: () => '查看评论' }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                quaternary: true,
                onClick: () => handleDelete(row)
              },
              { default: () => '删除' }
            )
          ]
        }
      )
    }
  }
]

const rowKey = (row: ImFeedItem) => `${row.id}`

async function fetchList(reset = false) {
  if (loading.value) return
  loading.value = true
  try {
    const res = await getImFeedList({
      pageSize: pageSize.value,
      cursor: reset ? undefined : cursor.value || undefined,
      userName: query.value.userName.trim() || undefined
    })
    cursor.value = res.cursor
    isLast.value = !!res.isLast

    const list = res.list || []
    tableData.value = reset ? list : [...tableData.value, ...list]
  } catch (error: any) {
    const msg = (error && (error.msg || error.message)) || '获取朋友圈列表失败'
    window.$message?.error(msg)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  cursor.value = null
  isLast.value = false
  fetchList(true)
}

function handleReset() {
  query.value.userName = ''
  cursor.value = null
  isLast.value = false
  fetchList(true)
}

function loadMore() {
  if (isLast.value) return
  fetchList(false)
}

async function handleViewComments(row: ImFeedItem) {
  if (!row.id) return
  currentFeed.value = row
  showCommentModal.value = true
  commentLoading.value = true
  commentList.value = []

  try {
    const res = await getImFeedComments(row.id)
    commentList.value = res || []
  } catch (error: any) {
    const msg = (error && (error.msg || error.message)) || '获取评论列表失败'
    window.$message?.error(msg)
  } finally {
    commentLoading.value = false
  }
}

async function handleDeleteComment(commentId: string) {
  try {
    await deleteImFeedComment(commentId)
    window.$message?.success('删除成功')
    commentList.value = commentList.value.filter(c => c.id !== commentId)
  } catch (error: any) {
    const msg = (error && (error.msg || error.message)) || '删除评论失败'
    window.$message?.error(msg)
  }
}

async function handleDelete(row: ImFeedItem) {
  if (!row.id) return
  const ok = window.confirm('确定删除该朋友圈吗？')
  if (!ok) return

  try {
    loading.value = true
    await deleteImFeed(row.id)
    window.$message?.success('删除成功')
    // 删除后重新加载列表，从第一页开始
    cursor.value = null
    isLast.value = false
    await fetchList(true)
  } catch (error: any) {
    const msg = (error && (error.msg || error.message)) || '删除朋友圈失败'
    window.$message?.error(msg)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchList(true)
})
</script>
