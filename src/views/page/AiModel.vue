<template>
  <div class="p-4">
    <n-card title="AI 能力中心" class="mx-auto" style="max-width: 1400px">
      <n-tabs type="line" animated>
        <!-- API Key 管理 -->
        <n-tab-pane name="apiKey" tab="API Key 管理">
          <div class="py-4">
            <div class="mb-4">
              <n-form inline :model="apiKeySearchForm">
                <n-form-item label="名称/平台">
                  <n-input
                    v-model:value="apiKeySearchForm.keyword"
                    class="w-52"
                    clearable
                    placeholder="请输入名称或平台" />
                </n-form-item>
                <n-form-item>
                  <n-space>
                    <n-button type="primary" @click="handleApiKeySearch">查询</n-button>
                    <n-button @click="handleApiKeyReset">重置</n-button>
                    <n-button type="primary" @click="handleAddApiKey">添加 API Key</n-button>
                  </n-space>
                </n-form-item>
              </n-form>
            </div>

            <n-data-table
              :columns="apiKeyColumns"
              :data="apiKeyList"
              :loading="apiKeyLoading"
              :pagination="apiKeyPagination"
              :bordered="false"
              striped />
          </div>
        </n-tab-pane>

        <!-- AI 模型管理 -->
        <n-tab-pane name="model" tab="AI 模型管理">
          <div class="py-4">
            <div class="mb-4">
              <n-form inline :model="modelSearchForm">
                <n-form-item label="名称/标识">
                  <n-input
                    v-model:value="modelSearchForm.keyword"
                    class="w-52"
                    clearable
                    placeholder="请输入名称或标识" />
                </n-form-item>
                <n-form-item>
                  <n-space>
                    <n-button type="primary" @click="handleModelSearch">查询</n-button>
                    <n-button @click="handleModelReset">重置</n-button>
                    <n-button type="primary" @click="handleAddModel">添加模型</n-button>
                  </n-space>
                </n-form-item>
              </n-form>
            </div>

            <n-data-table
              :columns="modelColumns"
              :data="modelList"
              :loading="modelLoading"
              :pagination="modelPagination"
              :bordered="false"
              striped />
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-card>

    <!-- API Key 编辑弹窗 -->
    <n-modal
      v-model:show="showApiKeyModal"
      preset="card"
      :title="apiKeyModalTitle"
      style="width: 800px"
      :mask-closable="false">
      <n-form
        ref="apiKeyFormRef"
        :model="apiKeyForm"
        :rules="apiKeyRules"
        label-placement="left"
        label-width="100px">
        <n-form-item label="名称" path="name">
          <n-input v-model:value="apiKeyForm.name" placeholder="请输入名称" />
        </n-form-item>
        <n-form-item label="平台" path="platform">
          <n-select
            v-model:value="apiKeyForm.platform"
            :options="platformOptions"
            placeholder="请选择平台" />
        </n-form-item>
        <n-form-item label="API Key" path="apiKey">
          <n-input
            v-model:value="apiKeyForm.apiKey"
            type="textarea"
            placeholder="请输入 API Key"
            :rows="3" />
        </n-form-item>
        <n-form-item label="自定义 URL" path="url">
          <n-input v-model:value="apiKeyForm.url" placeholder="可选，自定义 API 地址" />
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-switch v-model:value="apiKeyForm.status" :checked-value="0" :unchecked-value="1">
            <template #checked>启用</template>
            <template #unchecked>禁用</template>
          </n-switch>
        </n-form-item>
        <n-form-item label="公开状态" path="publicStatus">
          <n-switch v-model:value="apiKeyForm.publicStatus">
            <template #checked>公开</template>
            <template #unchecked>私有</template>
          </n-switch>
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <n-button @click="showApiKeyModal = false">取消</n-button>
          <n-button type="primary" @click="handleSaveApiKey" :loading="apiKeySaving">保存</n-button>
        </div>
      </template>
    </n-modal>

    <!-- 模型编辑弹窗 -->
    <n-modal
      v-model:show="showModelModal"
      preset="card"
      :title="modelModalTitle"
      style="width: 800px"
      :mask-closable="false">
      <n-form
        ref="modelFormRef"
        :model="modelForm"
        :rules="modelRules"
        label-placement="left"
        label-width="100px">
        <n-form-item label="模型名称" path="name">
          <n-input v-model:value="modelForm.name" placeholder="请输入模型名称" />
        </n-form-item>
        <n-form-item label="模型标识" path="model">
          <n-input v-model:value="modelForm.model" placeholder="如: gpt-3.5-turbo" />
        </n-form-item>
        <n-form-item label="平台" path="platform">
          <n-select
            v-model:value="modelForm.platform"
            :options="platformOptions"
            placeholder="请选择平台" />
        </n-form-item>
        <n-form-item label="API Key" path="keyId">
          <n-select
            v-model:value="modelForm.keyId"
            :options="apiKeySimpleOptions"
            placeholder="请选择 API Key" />
        </n-form-item>
        <n-form-item label="模型类型" path="type">
          <n-select
            v-model:value="modelForm.type"
            :options="modelTypeOptions"
            placeholder="请选择模型类型" />
        </n-form-item>
        <n-form-item label="思考模式" path="supportsReasoning">
          <n-switch v-model:value="modelForm.supportsReasoning">
            <template #checked>开启</template>
            <template #unchecked>关闭</template>
          </n-switch>
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-switch v-model:value="modelForm.status" :checked-value="0" :unchecked-value="1">
            <template #checked>启用</template>
            <template #unchecked>禁用</template>
          </n-switch>
        </n-form-item>
        <n-form-item label="公开状态" path="publicStatus">
          <n-switch v-model:value="modelForm.publicStatus" :checked-value="0" :unchecked-value="1">
            <template #checked>公开</template>
            <template #unchecked>私有</template>
          </n-switch>
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <n-button @click="showModelModal = false">取消</n-button>
          <n-button type="primary" @click="handleSaveModel" :loading="modelSaving">保存</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted, computed } from 'vue'
import { NButton, NTag, NSwitch, useMessage, useDialog, type DataTableColumns, type FormRules } from 'naive-ui'
import {
  createApiKey,
  updateApiKeyAdmin,
  deleteApiKeyAdmin,
  getApiKeyAdminPage,
  getModelAdminPage,
  createModel,
  updateModelAdmin,
  deleteModelAdmin,
  getPlatformList,
  getApiKeySimpleList,
  type ApiKeyItem,
  type ModelItem
} from '@/api/ai'

const message = useMessage()
const dialog = useDialog()

const apiKeySearchForm = ref({
  keyword: ''
})

const modelSearchForm = ref({
  keyword: ''
})

const apiKeyList = ref<ApiKeyItem[]>([])
const apiKeyLoading = ref(false)
const apiKeyPagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  onChange: (page: number) => {
    apiKeyPagination.value.page = page
    loadApiKeyList()
  }
})

const modelList = ref<ModelItem[]>([])
const modelLoading = ref(false)
const modelPagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  onChange: (page: number) => {
    modelPagination.value.page = page
    loadModelList()
  }
})

// API Key 表单
const showApiKeyModal = ref(false)
const apiKeyFormRef = ref()
const apiKeySaving = ref(false)
const apiKeyForm = ref({
  id: undefined as string | undefined,
  name: '',
  platform: '',
  apiKey: '',
  url: '',
  status: 0,
  publicStatus: false
})
const apiKeyModalTitle = computed(() => (apiKeyForm.value.id ? '编辑 API Key' : '添加 API Key'))

// 模型表单
const showModelModal = ref(false)
const modelFormRef = ref()
const modelSaving = ref(false)
const modelForm = ref({
  id: undefined as string | undefined,
  name: '',
  model: '',
  platform: '',
  keyId: undefined as string | undefined,
  type: 1,
  status: 0,
  sort: 0,
  publicStatus: 0,
  supportsReasoning: false
})
const modelModalTitle = computed(() => (modelForm.value.id ? '编辑模型' : '添加模型'))

const platformOptions = ref<Array<{ label: string; value: string }>>([])
const apiKeySimpleOptions = ref<Array<{ label: string; value: string }>>([])

const modelTypeOptions = [
  { label: '聊天模型', value: 1 },
  { label: '图片模型', value: 2 },
  { label: '音乐模型', value: 3 }
]

const loadPlatformList = async () => {
  try {
    const data = await getPlatformList()
    platformOptions.value = data.map((item) => ({
      label: item.label,
      value: item.platform
    }))
  } catch (error) {
    console.error('加载平台列表失败:', error)
  }
}

const loadApiKeySimpleList = async () => {
  try {
    const data = await getApiKeySimpleList()
    apiKeySimpleOptions.value = data.map((item) => ({
      label: `${item.name} (${item.platform})`,
      value: item.id
    }))
  } catch (error) {
    console.error('加载 API Key 列表失败:', error)
  }
}

// 表单验证规则
const apiKeyRules: FormRules = {
  name: { required: true, message: '请输入名称', trigger: 'blur' },
  platform: { required: true, message: '请选择平台', trigger: 'change' },
  apiKey: { required: true, message: '请输入 API Key', trigger: 'blur' }
}

const modelRules: FormRules = {
  name: { required: true, message: '请输入模型名称', trigger: 'blur' },
  model: { required: true, message: '请输入模型标识', trigger: 'blur' },
  platform: { required: true, message: '请选择平台', trigger: 'change' },
  keyId: { required: true, message: '请选择 API Key', trigger: 'change' }
}

const apiKeyColumns: DataTableColumns<ApiKeyItem> = [
  { title: '名称', key: 'name', width: 150 },
  { title: '平台', key: 'platform', width: 120 },
  {
    title: 'API Key',
    key: 'apiKey',
    width: 480,
    ellipsis: { tooltip: true },
    render: (row) => {
      const key = row.apiKey || ''
      return key.length > 60 ? `${key.substring(0, 60)}...` : key
    }
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render: (row) =>
      h(NTag, { type: row.status === 0 ? 'success' : 'error' }, () => (row.status === 0 ? '启用' : '禁用'))
  },
  {
    title: '公开状态',
    key: 'publicStatus',
    width: 100,
    render: (row) =>
      h(NTag, { type: row.publicStatus ? 'info' : 'warning' }, () => (row.publicStatus ? '公开' : '私有'))
  },
  {
    title: '操作',
    key: 'actions',
    width: 220,
    render: (row) =>
      h('div', { class: 'flex gap-2' }, [
        h(
          NButton,
          {
            size: 'small',
            onClick: () => handleEditApiKey(row)
          },
          () => '编辑'
        ),
        h(
          NButton,
          {
            size: 'small',
            onClick: () => handleCopyApiKey(row)
          },
          () => '复制Key'
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            onClick: () => handleDeleteApiKey(row)
          },
          () => '删除'
        )
      ])
  }
]

const modelColumns: DataTableColumns<ModelItem> = [
  { title: '模型名称', key: 'name', width: 150 },
  { title: '模型标识', key: 'model', width: 180 },
  { title: '平台', key: 'platform', width: 120 },
  {
    title: '类型',
    key: 'type',
    width: 100,
    render: (row) => {
      const typeMap: Record<number, string> = { 1: '聊天', 2: '图片', 3: '音乐' }
      return typeMap[row.type] || '未知'
    }
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render: (row) =>
      h(NTag, { type: row.status === 0 ? 'success' : 'error' }, () => (row.status === 0 ? '启用' : '禁用'))
  },
  {
    title: '公开状态',
    key: 'publicStatus',
    width: 100,
    render: (row) =>
      h(NTag, { type: row.publicStatus === 0 ? 'info' : 'warning' }, () =>
        row.publicStatus === 0 ? '公开' : '私有'
      )
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render: (row) =>
      h('div', { class: 'flex gap-2' }, [
        h(
          NButton,
          {
            size: 'small',
            onClick: () => handleEditModel(row)
          },
          () => '编辑'
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            onClick: () => handleDeleteModel(row)
          },
          () => '删除'
        )
      ])
  }
]

const loadApiKeyList = async () => {
  apiKeyLoading.value = true
  try {
    const keyword = apiKeySearchForm.value.keyword.trim()
    const data = await getApiKeyAdminPage({
      pageNo: apiKeyPagination.value.page,
      pageSize: apiKeyPagination.value.pageSize,
      name: keyword || undefined
    })
    apiKeyList.value = data.list || []
    apiKeyPagination.value.itemCount = data.total || 0
  } catch (error) {
    console.error('加载 API Key 列表失败:', error)
    message.error('加载 API Key 列表失败')
  } finally {
    apiKeyLoading.value = false
  }
}

const loadModelList = async () => {
  modelLoading.value = true
  try {
    const keyword = modelSearchForm.value.keyword.trim()
    const data = await getModelAdminPage({
      pageNo: modelPagination.value.page,
      pageSize: modelPagination.value.pageSize,
      name: keyword || undefined
    })
    modelList.value = data.list || []
    modelPagination.value.itemCount = data.total || 0
  } catch (error) {
    console.error('加载模型列表失败:', error)
    message.error('加载模型列表失败')
  } finally {
    modelLoading.value = false
  }
}

const handleApiKeySearch = () => {
  apiKeyPagination.value.page = 1
  loadApiKeyList()
}

const handleApiKeyReset = () => {
  apiKeySearchForm.value.keyword = ''
  apiKeyPagination.value.page = 1
  loadApiKeyList()
}

const handleModelSearch = () => {
  modelPagination.value.page = 1
  loadModelList()
}

const handleModelReset = () => {
  modelSearchForm.value.keyword = ''
  modelPagination.value.page = 1
  loadModelList()
}

// 添加 API Key
const handleAddApiKey = () => {
  apiKeyForm.value = {
    id: undefined,
    name: '',
    platform: '',
    apiKey: '',
    url: '',
    status: 0,
    publicStatus: false
  }
  showApiKeyModal.value = true
}

// 编辑 API Key
const handleEditApiKey = (row: any) => {
  apiKeyForm.value = { ...row }
  showApiKeyModal.value = true
}

const handleSaveApiKey = async () => {
  try {
    await apiKeyFormRef.value?.validate()
    apiKeySaving.value = true

    if (apiKeyForm.value.id) {
      await updateApiKeyAdmin(apiKeyForm.value as ApiKeyItem)
    } else {
      await createApiKey(apiKeyForm.value as ApiKeyItem)
    }

    message.success('保存成功')
    showApiKeyModal.value = false
    await loadApiKeyList()
  } catch (error) {
    console.error('保存 API Key 失败:', error)
    if (error !== false) {
      message.error('保存失败')
    }
  } finally {
    apiKeySaving.value = false
  }
}

const handleDeleteApiKey = (row: ApiKeyItem) => {
  dialog.warning({
    title: '确认删除',
    content: `确定要删除 API Key "${row.name}" 吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await deleteApiKeyAdmin(row.id!)
        message.success('删除成功')
        await loadApiKeyList()
      } catch (error) {
        console.error('删除 API Key 失败:', error)
        message.error('删除失败')
      }
    }
  })
}

const handleCopyApiKey = async (row: ApiKeyItem) => {
  const key = row.apiKey || ''
  if (!key) {
    message.error('无可复制的 API Key')
    return
  }
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(key)
    } else {
      const input = document.createElement('input')
      input.value = key
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }
    message.success('已复制 API Key')
  } catch (e) {
    message.error('复制失败')
  }
}

const handleAddModel = async () => {
  await loadApiKeySimpleList()
  modelForm.value = {
    id: undefined,
    name: '',
    model: '',
    platform: '',
    keyId: undefined,
    type: 1,
    status: 0,
    sort: 0,
    publicStatus: 0,
    supportsReasoning: false
  }
  showModelModal.value = true
}

const handleEditModel = async (row: ModelItem) => {
  await loadApiKeySimpleList()
  modelForm.value = {
    id: row.id,
    name: row.name,
    model: row.model,
    platform: row.platform,
    keyId: row.keyId,
    type: row.type,
    status: row.status,
    sort: row.sort || 0,
    publicStatus: row.publicStatus || 0,
    supportsReasoning: row.supportsReasoning ?? false
  }
  showModelModal.value = true
}

const handleSaveModel = async () => {
  try {
    await modelFormRef.value?.validate()
    modelSaving.value = true

    if (modelForm.value.id) {
      await updateModelAdmin(modelForm.value as ModelItem)
    } else {
      await createModel(modelForm.value as ModelItem)
    }

    message.success('保存成功')
    showModelModal.value = false
    await loadModelList()
  } catch (error) {
    console.error('保存模型失败:', error)
    if (error !== false) {
      message.error('保存失败')
    }
  } finally {
    modelSaving.value = false
  }
}

const handleDeleteModel = (row: ModelItem) => {
  dialog.warning({
    title: '确认删除',
    content: `确定要删除模型 "${row.name}" 吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await deleteModelAdmin(row.id!)
        message.success('删除成功')
        await loadModelList()
      } catch (error) {
        console.error('删除模型失败:', error)
        message.error('删除失败')
      }
    }
  })
}

onMounted(() => {
  loadPlatformList()
  loadApiKeySimpleList()
  loadApiKeyList()
  loadModelList()
})
</script>

