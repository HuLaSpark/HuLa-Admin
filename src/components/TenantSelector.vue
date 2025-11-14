<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    :close-on-esc="false"
    preset="card"
    title="选择企业"
    class="tenant-selector-modal"
    :style="{ width: '600px' }"
  >
    <n-spin :show="loading">
      <div class="tenant-list">
        <n-empty v-if="tenantList.length === 0 && !loading" description="暂无可用企业" />
        <div
          v-for="tenant in tenantList"
          :key="tenant.id"
          class="tenant-item"
          :class="{ selected: selectedTenantId === tenant.id, disabled: !tenant.state || tenant.status !== 0 }"
          @click="handleSelectTenant(tenant)"
        >
          <div class="tenant-info">
            <div class="tenant-name">
              <n-text strong>{{ tenant.name }}</n-text>
              <n-tag v-if="tenant.isDefault" type="success" size="small" :bordered="false">默认</n-tag>
              <n-tag v-if="!tenant.state" type="error" size="small" :bordered="false">已禁用</n-tag>
            </div>
            <div class="tenant-detail">
              <n-text depth="3" v-if="tenant.abbreviation">简称：{{ tenant.abbreviation }}</n-text>
              <n-text depth="3" v-if="tenant.contactPerson">联系人：{{ tenant.contactPerson }}</n-text>
              <n-text depth="3" v-if="tenant.contactPhone">电话：{{ tenant.contactPhone }}</n-text>
            </div>
          </div>
          <div class="tenant-action">
            <n-icon v-if="selectedTenantId === tenant.id" size="24" color="#18a058">
              <CheckmarkCircle />
            </n-icon>
          </div>
        </div>
      </div>
    </n-spin>

    <template #footer>
      <div class="modal-footer">
        <n-button @click="handleCancel">取消</n-button>
        <n-button type="primary" :disabled="!selectedTenantId" :loading="confirming" @click="handleConfirm">
          确定
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { NModal, NSpin, NEmpty, NText, NTag, NIcon, NButton } from 'naive-ui'
import { CheckmarkCircle } from '@vicons/ionicons5'
import type { TenantInfo } from '@/types/api'

interface Props {
  show: boolean
  tenantList: TenantInfo[]
  loading?: boolean
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'confirm', tenantId: string): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

const showModal = ref(props.show)
const selectedTenantId = ref<string>('')
const confirming = ref(false)

watch(
  () => props.show,
  (val) => {
    showModal.value = val
    if (val) {
      // 如果有默认租户，自动选中
      const defaultTenant = props.tenantList.find((t) => t.isDefault)
      if (defaultTenant) {
        selectedTenantId.value = defaultTenant.id
      } else if (props.tenantList.length === 1) {
        // 如果只有一个租户，自动选中
        selectedTenantId.value = props.tenantList[0].id
      }
    }
  }
)

watch(showModal, (val) => {
  emit('update:show', val)
})

const handleSelectTenant = (tenant: TenantInfo) => {
  // 禁用的租户不能选择
  // status: 0-正常 1-审核中 2-停用 3-待初始化租户
  if (!tenant.state || tenant.status !== 0) {
    window.$message.warning('该企业已被禁用，无法选择')
    return
  }
  selectedTenantId.value = tenant.id
}

const handleConfirm = async () => {
  if (!selectedTenantId.value) {
    window.$message.warning('请选择一个企业')
    return
  }

  confirming.value = true
  try {
    emit('confirm', selectedTenantId.value)
  } finally {
    confirming.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped lang="scss">
.tenant-selector-modal {
  .tenant-list {
    max-height: 500px;
    overflow-y: auto;

    .tenant-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      margin-bottom: 12px;
      border: 2px solid #e0e0e6;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover:not(.disabled) {
        border-color: #18a058;
        background-color: #f0f9ff;
      }

      &.selected {
        border-color: #18a058;
        background-color: #f0f9ff;
      }

      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: #f5f5f5;
      }

      .tenant-info {
        flex: 1;

        .tenant-name {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .tenant-detail {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
      }

      .tenant-action {
        margin-left: 16px;
      }
    }
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>

