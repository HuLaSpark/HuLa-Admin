<template>
  <div class="p-4 space-y-4">
    <n-card title="黑名单列表">
      <template #header-extra>
        <n-button type="primary" @click="openAddModal">
          拉黑用户
        </n-button>
      </template>
      <!-- 查询条件 -->
      <div class="mb-4">
        <n-form inline :model="query">
          <n-form-item label="类型">
            <n-select
              v-model:value="query.type"
              :options="typeOptions"
              class="w-52"
              clearable
              placeholder="全部"
            />
          </n-form-item>
          <n-form-item label="目标">
            <n-input
              v-model:value="query.target"
              class="w-52"
              clearable
              placeholder="请输入 UID / IP"
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

      <!-- 黑名单表格 -->
      <n-data-table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :bordered="false"
        :row-key="rowKey"
        :pagination="pagination"
        :max-height="600"
      />
    </n-card>

    <n-modal
      v-model:show="showAddModal"
      preset="card"
      title="拉黑用户"
      :mask-closable="false"
      :bordered="false"
      :segmented="{ content: 'soft', footer: 'soft' }"
      style="width: 520px; max-width: 100%"
    >
      <n-form
        :model="blackForm"
        label-placement="left"
        label-width="88"
        class="mt-2 space-y-2"
      >
        <n-form-item label="拉黑类型">
          <n-select
            v-model:value="blackForm.type"
            :options="[
              { label: '用户（UID）', value: 2 },
              { label: 'IP地址', value: 1 }
            ]"
            placeholder="选择拉黑类型"
            @update:value="handleTypeChange"
          />
        </n-form-item>
        <n-form-item v-if="blackForm.type === 2" label="选择用户">
          <div class="flex flex-col gap-1 w-full">
            <n-select
              v-model:value="blackForm.target"
              :options="userOptions"
              :loading="userSearchLoading"
              filterable
              remote
              clearable
              placeholder="搜索用户（昵称/UID）"
              :consistent-menu-width="false"
              @search="handleUserSearch"
            />
            <span class="text-xs text-gray-500">搜索并选择要拉黑的用户。</span>
          </div>
        </n-form-item>
        <n-form-item v-else label="IP地址">
          <div class="flex flex-col gap-1 w-full">
            <n-input
              v-model:value="blackForm.target"
              placeholder="请输入IP地址，例如：192.168.1.1"
              clearable
            />
            <span class="text-xs text-gray-500">请输入要拉黑的IP地址。</span>
          </div>
        </n-form-item>
        <n-form-item label="截止时间">
          <div class="flex flex-col gap-1 w-full">
            <div class="flex items-center gap-2 w-full">
              <n-input-number
                v-model:value="blackForm.deadline"
                :min="0"
                :max="525600"
                class="flex-1"
              >
                <template #suffix>
                  <span class="text-xs text-gray-500">分钟</span>
                </template>
              </n-input-number>
            </div>
            <span class="text-xs text-gray-500">0 表示永久拉黑，建议根据违规程度合理设置时长。</span>
          </div>
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="flex justify-start gap-2">
          <n-button type="primary" :loading="submitLoading" @click="handleBlack">
            确认拉黑
          </n-button>
          <n-button @click="handleBlackCancel">
            取消
          </n-button>
        </div>
      </template>
    </n-modal>

    <!-- 编辑黑名单弹窗 -->
    <n-modal
      v-model:show="showEditModal"
      preset="card"
      title="编辑黑名单"
      :mask-closable="false"
      :bordered="false"
      :segmented="{ content: 'soft', footer: 'soft' }"
      style="width: 520px; max-width: 100%"
    >
      <n-form
        :model="editForm"
        label-placement="left"
        label-width="88"
        class="mt-2 space-y-2"
      >
        <n-form-item label="类型">
          <n-select
            v-model:value="editForm.type"
            :options="[
              { label: 'UID', value: 2 },
              { label: 'IP', value: 1 }
            ]"
            placeholder="选择类型"
          />
        </n-form-item>
        <n-form-item label="目标">
          <div v-if="editForm.type === 2" class="flex flex-col gap-1 w-full">
            <n-select
              v-model:value="editForm.target"
              :options="editUserOptions"
              :loading="editUserSearchLoading"
              filterable
              remote
              clearable
              placeholder="搜索用户（昵称/UID）"
              :consistent-menu-width="false"
              @search="handleEditUserSearch"
            />
            <span class="text-xs text-gray-500">搜索并选择要拉黑的用户。</span>
          </div>
          <n-input
            v-else
            v-model:value="editForm.target"
            placeholder="请输入 IP"
            clearable
          />
        </n-form-item>
        <n-form-item label="截止时间">
          <div class="flex flex-col gap-1 w-full">
            <n-date-picker
              v-model:value="editForm.deadlineTimestamp"
              type="datetime"
              clearable
              placeholder="选择截止时间"
              class="w-full"
              :is-date-disabled="(ts: number) => ts < Date.now()"
            />
            <span class="text-xs text-gray-500">不选择表示永久拉黑。</span>
          </div>
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="flex justify-start gap-2">
          <n-button type="primary" :loading="editLoading" @click="handleEditSave">
            保存
          </n-button>
          <n-button @click="showEditModal = false">
            取消
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, reactive, ref } from 'vue'
import type { DataTableColumns, PaginationProps, SelectOption } from 'naive-ui'
import { NButton } from 'naive-ui'
import { getImBlackPage, addImBlack, editImBlack, removeImBlack, type ImBlackItem } from '@/api/imBlack'
import { searchUserByNicknameApi } from '@/api/user'

const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref<ImBlackItem[]>([])
const showAddModal = ref(false)
const showEditModal = ref(false)
const editLoading = ref(false)

const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)

const query = reactive<{
  type: number
  target: string
}>({
  type: 0,
  target: ''
})

const blackForm = reactive<{
  type: number
  target: string
  deadline: number
}>({
  type: 2, // 默认拉黑用户（UID）
  target: '',
  deadline: 60
})

const editForm = reactive<{
  id: string
  type: number
  target: string
  deadlineTimestamp: number | null
}>({
  id: '',
  type: 2,
  target: '',
  deadlineTimestamp: null
})

// 用户搜索相关
const userSearchLoading = ref(false)
const userOptions = ref<SelectOption[]>([])
let searchTimer: ReturnType<typeof setTimeout> | null = null

// 编辑弹窗的用户搜索相关
const editUserSearchLoading = ref(false)
const editUserOptions = ref<SelectOption[]>([])
let editSearchTimer: ReturnType<typeof setTimeout> | null = null

const typeOptions = [
  { label: '全部', value: 0 },
  { label: 'UID', value: 2 },
  { label: 'IP', value: 1 }
]

const columns: DataTableColumns<ImBlackItem> = [
  {
    title: '类型',
    key: 'type',
    width: 100,
    render(row) {
      if (row.type === 1) return 'IP'
      if (row.type === 2) return 'UID'
      return '-'
    }
  },
  {
    title: '目标',
    key: 'target',
    minWidth: 160
  },
  {
    title: '用户昵称',
    key: 'userName',
    minWidth: 140,
    render(row) {
      if (row.type === 2 && row.userName) {
        return row.userName
      }
      return '-'
    }
  },
  {
    title: '截止时间',
    key: 'deadline',
    minWidth: 180,
    render(row) {
      if (!row.deadline) return '永久'
      const date = new Date(row.deadline)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
  },
  {
    title: '创建时间',
    key: 'createTime',
    minWidth: 180,
    render(row) {
      if (!row.createTime) return '-'
      const date = new Date(row.createTime)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 160,
    render(row) {
      return h(
        'div',
        { class: 'flex gap-2' },
        [
          h(
            NButton,
            {
              size: 'small',
              quaternary: true,
              type: 'primary',
              onClick: () => openEditModal(row)
            },
            { default: () => '编辑' }
          ),
          h(
            NButton,
            {
              size: 'small',
              quaternary: true,
              type: 'error',
              onClick: () => handleRemoveBlack(row)
            },
            { default: () => '移除' }
          )
        ]
      )
    }
  }
]

const rowKey = (row: ImBlackItem) => row.id

const pagination = computed<PaginationProps>(() => ({
  page: pageNo.value,
  pageSize: pageSize.value,
  itemCount: total.value,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page: number) => {
    pageNo.value = page
    loadData()
  },
  onUpdatePageSize: (size: number) => {
    pageSize.value = size
    pageNo.value = 1
    loadData()
  }
}))

async function loadData() {
  loading.value = true
  try {
    const res = await getImBlackPage({
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      type: query.type === 0 ? undefined : query.type,
      target: query.target || undefined
    })
    tableData.value = res.list || []
    total.value = res.totalRecords || 0
  } catch (error: any) {
    const msg = (error && (error.msg || error.message)) || '获取黑名单列表失败'
    window.$message?.error(msg)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pageNo.value = 1
  loadData()
}

function handleReset() {
  query.type = 0
  query.target = ''
  handleSearch()
}

function openAddModal() {
  handleBlackReset()
  showAddModal.value = true
}

function handleBlackCancel() {
  showAddModal.value = false
}

async function handleBlack() {
  if (!blackForm.target) {
    const msg = blackForm.type === 2 ? '请选择要拉黑的用户' : '请输入要拉黑的IP地址'
    window.$message?.warning(msg)
    return
  }

  if (blackForm.deadline == null || Number.isNaN(blackForm.deadline) || blackForm.deadline < 0) {
    window.$message?.warning('请输入正确的截止时间（分钟）')
    return
  }

  submitLoading.value = true
  try {
    await addImBlack({
      type: blackForm.type,
      target: blackForm.target,
      deadline: blackForm.deadline
    })
    window.$message?.success('拉黑成功')
    // 拉黑后刷新列表
    handleBlackCancel()
    pageNo.value = 1
    await loadData()
  } catch (error: any) {
    const msg = (error && (error.msg || error.message)) || '拉黑失败'
    window.$message?.error(msg)
  } finally {
    submitLoading.value = false
  }
}

function handleBlackReset() {
  blackForm.type = 2
  blackForm.target = ''
  blackForm.deadline = 60
  userOptions.value = []
}

// 类型切换时清空目标
function handleTypeChange() {
  blackForm.target = ''
  userOptions.value = []
}

// 打开编辑弹窗
async function openEditModal(row: ImBlackItem) {
  editForm.id = row.id
  editForm.type = row.type
  editForm.target = row.target

  // 设置截止时间
  if (row.deadline) {
    editForm.deadlineTimestamp = new Date(row.deadline).getTime()
  } else {
    editForm.deadlineTimestamp = null
  }

  // 如果是UID类型，编辑时仅从黑名单分页查询回显
  if (row.type === 2) {
    try {
      const res = await getImBlackPage({
        pageNo: 1,
        pageSize: 20,
        target: row.target
      })
      editUserOptions.value = (res.list || []).map((item) => ({
        label: `${item.userName || item.target} (${item.target})`,
        value: item.target || ''
      }))
    } catch (error) {
      console.error('加载黑名单信息失败:', error)
      editUserOptions.value = []
    }
  }

  showEditModal.value = true
}

// 保存编辑
async function handleEditSave() {
  if (!editForm.target) {
    window.$message?.warning('请输入目标')
    return
  }

  editLoading.value = true
  try {
    // 将时间戳转换为标准格式字符串
    let deadlineStr = ''
    if (editForm.deadlineTimestamp) {
      const date = new Date(editForm.deadlineTimestamp)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      deadlineStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }

    await editImBlack({
      id: editForm.id,
      type: editForm.type,
      target: editForm.target,
      deadline: deadlineStr
    })
    window.$message?.success('编辑成功')
    showEditModal.value = false
    editUserOptions.value = []
    await loadData()
  } catch (error: any) {
    const msg = (error && (error.msg || error.message)) || '编辑失败'
    window.$message?.error(msg)
  } finally {
    editLoading.value = false
  }
}

// 编辑弹窗的用户搜索
async function handleEditUserSearch(keyword: string) {
  if (editSearchTimer) {
    clearTimeout(editSearchTimer)
  }

  if (!keyword || keyword.trim() === '') {
    editUserOptions.value = []
    return
  }

  editSearchTimer = setTimeout(async () => {
    editUserSearchLoading.value = true
    try {
      const res = await getImBlackPage({
        pageNo: 1,
        pageSize: 20,
        target: keyword.trim()
      })
      editUserOptions.value = (res.list || []).map((item) => ({
        label: `${item.userName || item.target} (UID: ${item.target})`,
        value: String(item.target || '')
      }))
    } catch (error: any) {
      const msg = (error && (error.msg || error.message)) || '搜索黑名单失败'
      window.$message?.error(msg)
      editUserOptions.value = []
    } finally {
      editUserSearchLoading.value = false
    }
  }, 300)
}

// 编辑弹窗的用户下拉框获得焦点时加载默认列表
// 编辑弹窗的用户选择框获得焦点时不做任何操作
// 用户需要输入关键词才会搜索

// 移除黑名单
async function handleRemoveBlack(row: ImBlackItem) {
  window.$dialog?.warning({
    title: '确认移除',
    content: `确定要将 ${row.target} 从黑名单中移除吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await removeImBlack({ id: row.id })
        window.$message?.success('移除成功')
        await loadData()
      } catch (error: any) {
        const msg = (error && (error.msg || error.message)) || '移除失败'
        window.$message?.error(msg)
      }
    }
  })
}

// 用户搜索处理
async function handleUserSearch(query: string) {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }

  if (!query || query.trim() === '') {
    // 如果没有搜索词，清空选项列表
    userOptions.value = []
    return
  }

  searchTimer = setTimeout(async () => {
    userSearchLoading.value = true
    try {
      const res = await searchUserByNicknameApi({
        pageNo: 1,
        pageSize: 20,
        keyword: query.trim()
      })

      userOptions.value = (res.list || []).map((user) => ({
        label: `${user.name || user.account || ''} (UID: ${user.uid})`,
        value: String(user.uid || '')
      }))
    } catch (error: any) {
      const msg = (error && (error.msg || error.message)) || '搜索用户失败'
      window.$message?.error(msg)
      userOptions.value = []
    } finally {
      userSearchLoading.value = false
    }
  }, 300)
}

// 新增弹窗的用户选择框获得焦点时不做任何操作
// 用户需要输入关键词才会搜索

onMounted(() => {
  loadData()
})
</script>
