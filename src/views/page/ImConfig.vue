<template>
  <div class="p-4">
    <n-card title="IM 配置">
      <n-tabs type="line" animated>
        <!-- 系统配置 -->
        <n-tab-pane name="system" tab="系统配置">
          <div class="py-4">
            <div class="mb-4 flex justify-end">
              <n-button type="primary" @click="handleSaveSystemConfig" :loading="saving">
                <template #icon>
                  <n-icon><SaveOutline /></n-icon>
                </template>
                保存配置
              </n-button>
            </div>

            <n-form
              ref="systemFormRef"
              :model="systemConfig"
              label-placement="left"
              label-width="150px"
              class="max-w-4xl">
              <n-divider title-placement="left">基础配置</n-divider>

              <n-form-item label="系统名称" path="systemName">
                <n-input v-model:value="systemConfig.systemName" placeholder="请输入系统名称" />
              </n-form-item>

              <n-form-item label="系统 Logo" path="logo">
                <n-input v-model:value="systemConfig.logo" placeholder="请输入 Logo URL" />
              </n-form-item>

              <n-form-item label="大群 ID" path="roomGroupId">
                <n-input v-model:value="systemConfig.roomGroupId" placeholder="请输入大群 ID" />
              </n-form-item>

              <n-divider title-placement="left">七牛云配置</n-divider>

              <n-form-item label="七牛云 CDN 域名" path="qnStorageCDN">
                <n-input v-model:value="systemConfig.qnStorageCDN" placeholder="https://cdn.example.com" />
              </n-form-item>

              <n-form-item label="分片大小" path="fragmentSize">
                <n-input v-model:value="systemConfig.fragmentSize" placeholder="分片大小（MB）" />
              </n-form-item>

              <n-form-item label="转存大小阈值" path="turnSharSize">
                <n-input v-model:value="systemConfig.turnSharSize" placeholder="转存大小阈值（MB）" />
              </n-form-item>
            </n-form>
          </div>
        </n-tab-pane>

        <!-- 配置列表 -->
        <n-tab-pane name="list" tab="所有配置项">
          <div class="py-4">
            <div class="mb-4">
              <n-form inline :model="searchForm">
                <n-form-item label="配置键/名称">
                  <n-input
                    v-model:value="searchKey"
                    class="w-52"
                    clearable
                    placeholder="请输入配置键或名称" />
                </n-form-item>
                <n-form-item>
                  <n-space>
                    <n-button type="primary" @click="handleSearch">
                      查询
                    </n-button>
                    <n-button @click="handleResetSearch">
                      重置
                    </n-button>
                    <n-button type="primary" @click="handleAddConfig">
                      <template #icon>
                        <n-icon><AddOutline /></n-icon>
                      </template>
                      添加配置
                    </n-button>
                  </n-space>
                </n-form-item>
              </n-form>
            </div>

            <n-data-table
              :columns="configColumns"
              :data="displayConfigList"
              :loading="loading"
              :pagination="pagination"
              :bordered="false"
              striped />
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-card>

    <!-- 配置编辑弹窗 -->
    <n-modal
      v-model:show="showConfigModal"
      preset="card"
      :title="configModalTitle"
      style="width: 600px"
      :mask-closable="false">
      <n-form
        ref="configFormRef"
        :model="configForm"
        :rules="configRules"
        label-placement="left"
        label-width="100px">
        <n-form-item label="配置类型" path="type">
          <n-input v-model:value="configForm.type" placeholder="如: system, qiniu_up_config" />
        </n-form-item>
        <n-form-item label="配置名称" path="configName">
          <n-input v-model:value="configForm.configName" placeholder="请输入配置名称" />
        </n-form-item>
        <n-form-item label="配置键" path="configKey">
          <n-input
            v-model:value="configForm.configKey"
            placeholder="如: systemName, logo"
            :disabled="!!configForm.id" />
        </n-form-item>
        <n-form-item label="配置值" path="configValue">
          <n-input
            v-model:value="configForm.configValue"
            type="textarea"
            placeholder="请输入配置值"
            :rows="5" />
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <n-button @click="showConfigModal = false">取消</n-button>
          <n-button type="primary" @click="handleSaveConfig" :loading="configSaving">保存</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted, computed } from 'vue'
import { NButton, useMessage, type DataTableColumns } from 'naive-ui'
import { SaveOutline, AddOutline } from '@vicons/ionicons5'
import { getSystemInit, getConfigList, batchUpdateConfig, updateConfig, type SysConfigItem } from '@/api/sysConfig'

const message = useMessage()

// 系统配置表单
const systemFormRef = ref()
const saving = ref(false)
const systemConfig = ref({
  systemName: '',
  logo: '',
  roomGroupId: '',
  qnStorageCDN: '',
  fragmentSize: '',
  turnSharSize: ''
})

// 配置映射（用于保存时找到对应的配置ID）
const configMap = ref<Map<string, SysConfigItem>>(new Map())

// 配置列表
const configList = ref<SysConfigItem[]>([])
const loading = ref(false)
const searchKey = ref('')
const searchForm = ref({
  searchKey: ''
})

// 配置编辑
const showConfigModal = ref(false)
const configFormRef = ref()
const configSaving = ref(false)
const configForm = ref<Partial<SysConfigItem>>({
  id: undefined,
  type: '',
  configName: '',
  configKey: '',
  configValue: ''
})
const configModalTitle = computed(() => (configForm.value.id ? '编辑配置' : '添加配置'))

const configRules = {
  type: { required: true, message: '请输入配置类型', trigger: 'blur' },
  configName: { required: true, message: '请输入配置名称', trigger: 'blur' },
  configKey: { required: true, message: '请输入配置键', trigger: 'blur' },
  configValue: { required: true, message: '请输入配置值', trigger: 'blur' }
}

// 搜索过滤后的配置列表
const displayConfigList = computed(() => {
  if (!searchKey.value) return configList.value
  const key = searchKey.value.toLowerCase()
  return configList.value.filter(
    (item) =>
      item.configKey?.toLowerCase().includes(key) || item.configName?.toLowerCase().includes(key)
  )
})

const pagination = ref({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  onChange: (page: number) => {
    pagination.value.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1
  }
})

// 配置列表表格列
const configColumns: DataTableColumns<SysConfigItem> = [
  { title: '类型', key: 'type', width: 150 },
  { title: '配置名称', key: 'configName', width: 200, ellipsis: { tooltip: true } },
  { title: '配置键', key: 'configKey', width: 200, ellipsis: { tooltip: true } },
  {
    title: '配置值',
    key: 'configValue',
    ellipsis: { tooltip: true },
    render: (row: SysConfigItem) => {
      const value = row.configValue || ''
      return value.length > 50 ? `${value.substring(0, 50)}...` : value
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 100,
    render: (row: SysConfigItem) =>
      h(
        NButton,
        {
          size: 'small',
          onClick: () => handleEditConfig(row)
        },
        () => '编辑'
      )
  }
]

// 加载系统配置
const loadSystemConfig = async () => {
  try {
    const data = await getSystemInit()
    systemConfig.value = {
      systemName: data.name || '',
      logo: data.logo || '',
      roomGroupId: data.roomGroupId || '',
      qnStorageCDN: data.qiNiu?.ossDomain || '',
      fragmentSize: data.qiNiu?.fragmentSize || '',
      turnSharSize: data.qiNiu?.turnSharSize || ''
    }
  } catch (error) {
    console.error('加载系统配置失败:', error)
    message.error('加载系统配置失败')
  }
}

// 加载配置列表
const loadConfigList = async () => {
  loading.value = true
  try {
    const data = await getConfigList()
    configList.value = data || []

    // 构建配置映射
    configMap.value.clear()
    data.forEach((item) => {
      configMap.value.set(item.configKey, item)
    })

    message.success('配置列表加载成功')
  } catch (error) {
    console.error('加载配置列表失败:', error)
    message.error('加载配置列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理（包含刷新功能）
const handleSearch = async () => {
  pagination.value.page = 1
  await loadConfigList()
}

// 重置搜索
const handleResetSearch = () => {
  searchKey.value = ''
  pagination.value.page = 1
}

// 保存系统配置
const handleSaveSystemConfig = async () => {
  saving.value = true
  try {
    const updates: Partial<SysConfigItem>[] = []

    // 构建需要更新的配置项
    const configKeys = [
      { key: 'systemName', value: systemConfig.value.systemName, type: 'system' },
      { key: 'logo', value: systemConfig.value.logo, type: 'system' },
      { key: 'roomGroupId', value: systemConfig.value.roomGroupId, type: 'system' },
      { key: 'qnStorageCDN', value: systemConfig.value.qnStorageCDN, type: 'qiniu_up_config' },
      { key: 'fragmentSize', value: systemConfig.value.fragmentSize, type: 'qiniu_up_config' },
      { key: 'turnSharSize', value: systemConfig.value.turnSharSize, type: 'qiniu_up_config' }
    ]

    configKeys.forEach(({ key, value, type }) => {
      const existingConfig = configMap.value.get(key)
      if (existingConfig) {
        updates.push({
          id: existingConfig.id,
          configKey: key,
          configValue: value,
          type
        })
      }
    })

    if (updates.length > 0) {
      await batchUpdateConfig(updates)
      message.success('保存成功')
      await loadConfigList()
      await loadSystemConfig()
    } else {
      message.warning('没有需要保存的配置')
    }
  } catch (error) {
    console.error('保存配置失败:', error)
    message.error('保存配置失败')
  } finally {
    saving.value = false
  }
}

// 添加配置
const handleAddConfig = () => {
  configForm.value = {
    id: undefined,
    type: '',
    configName: '',
    configKey: '',
    configValue: ''
  }
  showConfigModal.value = true
}

// 编辑配置
const handleEditConfig = (row: SysConfigItem) => {
  configForm.value = { ...row }
  showConfigModal.value = true
}

// 保存配置
const handleSaveConfig = async () => {
  try {
    await configFormRef.value?.validate()
    configSaving.value = true

    await updateConfig(configForm.value)

    message.success('保存成功')
    showConfigModal.value = false
    await loadConfigList()
    await loadSystemConfig()
  } catch (error) {
    console.error('保存配置失败:', error)
    if (error !== false) {
      // 不是表单验证错误
      message.error('保存配置失败')
    }
  } finally {
    configSaving.value = false
  }
}

// 初始化
onMounted(async () => {
  await loadConfigList()
  await loadSystemConfig()
})
</script>
