<template>
  <div class="contact-page">
    <n-card title="联系人 / 好友管理" :bordered="false">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <n-input
          v-model:value="searchKeyword"
          placeholder="搜索用户名、昵称、手机号..."
          clearable
          @keyup.enter="handleSearch">
          <template #prefix>
            <span style="font-size: 16px">🔍</span>
          </template>
        </n-input>
        <n-button type="primary" @click="handleSearch">搜索</n-button>
        <n-button @click="handleReset">重置</n-button>
      </div>

      <!-- 用户列表 -->
      <n-data-table
        ref="tableRef"
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        :row-key="(row: ImUser) => row.uid"
        class="user-table" />
    </n-card>

    <!-- 好友列表弹窗 -->
    <FriendListModal ref="friendListModalRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted } from 'vue'
import { NButton, NAvatar, NSpace, useMessage, type DataTableColumns } from 'naive-ui'
import { searchImUser, type ImUser } from '@/api/imUser'
import { AvatarUtils } from '@/utils/avatar'
import paging from '@/hooks/usePaging'
import FriendListModal from '@/views/composables/modal/friendListModal/index.vue'

const message = useMessage()
const { pageNum, pageSize } = paging

// 数据
const searchKeyword = ref('')
const tableData = ref<ImUser[]>([])
const loading = ref(false)
const total = ref(0)
const friendListModalRef = ref<any>(null)

// 分页配置
const pagination = {
  page: pageNum.value,
  pageSize: pageSize.value,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 50],
  onChange: (page: number) => {
    pageNum.value = page
    loadUserList()
  },
  onUpdatePageSize: (size: number) => {
    pageSize.value = size
    pageNum.value = 1
    loadUserList()
  },
  get pageCount() {
    return Math.ceil(total.value / pageSize.value)
  }
}

// 表格列配置
const columns: DataTableColumns<ImUser> = [
  {
    title: '用户',
    key: 'name',
    width: 250,
    render: (row) => {
      return h(
        NSpace,
        { justify: 'start', align: 'center' },
        {
          default: () => [
            h(NAvatar, {
              size: 'large',
              round: true,
              src: AvatarUtils.getAvatarUrl(row.avatar),
              fallbackSrc: '/logoD.png'
            }),
            h(
              NSpace,
              { vertical: true, size: 5 },
              {
                default: () => [
                  h(
                    'p',
                    {
                      style: {
                        fontWeight: 'bold',
                        padding: 0,
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '150px'
                      }
                    },
                    row.name || row.account
                  ),
                  h(
                    'p',
                    {
                      style: {
                        color: '#ccc',
                        fontSize: '12px',
                        padding: 0,
                        margin: 0
                      }
                    },
                    row.account
                  )
                ]
              }
            )
          ]
        }
      )
    }
  },
  {
    title: 'UID',
    key: 'uid',
    width: 150,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '账号',
    key: 'account',
    width: 200,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    fixed: 'right',
    render: (row) => {
      return h(
        NButton,
        {
          size: 'small',
          type: 'primary',
          ghost: true,
          onClick: () => handleViewFriends(row)
        },
        {
          default: () => '查看好友'
        }
      )
    }
  }
]

// 加载IM用户列表
const loadUserList = async () => {
  loading.value = true
  try {
    const data = await searchImUser({
      pageNo: pageNum.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value || undefined
    })

    tableData.value = data.list || []
    total.value = data.totalRecords || 0
    pagination.page = pageNum.value
  } catch (error) {
    console.error('加载IM用户列表失败:', error)
    message.error('加载IM用户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pageNum.value = 1
  loadUserList()
}

// 重置
const handleReset = () => {
  searchKeyword.value = ''
  pageNum.value = 1
  loadUserList()
}

// 查看好友
const handleViewFriends = (user: ImUser) => {
  if (!user.uid) {
    message.warning('该用户没有UID,无法查看好友列表')
    return
  }
  // 转换为 pageUser 格式
  const pageUser = {
    id: user.uid,
    uid: user.uid,
    userName: user.account,
    nickName: user.name,
    role: '',
    status: 1,
    email: '',
    mobile: '',
    avatar: user.avatar,
    createTime: '',
    updateTime: ''
  }
  friendListModalRef.value?.openModal(pageUser)
}

// 初始化
onMounted(() => {
  loadUserList()
})
</script>

<style scoped lang="scss">
.contact-page {
  padding: 16px;

  .search-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;

    :deep(.n-input) {
      flex: 1;
      max-width: 400px;
    }
  }

  .user-table {
    :deep(.n-data-table-th) {
      font-weight: 600;
    }
  }
}
</style>
