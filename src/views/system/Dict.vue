<template>
  <div>
    <!--操作选项-->
    <HeadOperation :load="load" :delete-batch="deleteBatch" :but-auth="'dict.add'">
      <template #input>
        <el-input
          style="float: right; width: 15%"
          v-model="input"
          @input="debounce(load, 1000, false)"
          :placeholder="t('placeholder')"
          clearable />
      </template>
    </HeadOperation>

    <!--表格 -->
    <el-table
      :max-height="maxHeight"
      v-loading="loading"
      @selection-change="handleDelAll"
      :element-loading-text="t('loading')"
      :element-loading-spinner="svg"
      element-loading-svg-view-box="-10, -10, 50, 50"
      element-loading-background="rgba(122, 122, 122, 0.4)"
      :data="tableData"
      :header-row-style="tableRow"
      :row-class-name="tableRowClassName"
      border
      style="width: 100%">
      <!--内容左边表格-->
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" sortable label="Id" align="center" width="100"></el-table-column>
      <el-table-column prop="code" :label="t('coding')"></el-table-column>
      <el-table-column prop="value" :label="t('content')">
        <template #default="scope">
          <el-icon size="18"><component :is="scope.row.value" /></el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="type" :label="t('type')"></el-table-column>
      <!--操作表格栏-->
      <el-table-column
        v-if="auths.includes('dict.delete') || auths.includes('dict.edit')"
        fixed="right"
        :label="t('operation')"
        width="120"
        align="center">
        <!--  vue3中使用  v-slot element-plus中 #default 也可以   -->
        <template #default="scope">
          <!--气泡确认框-->
          <el-popconfirm
            :disabled="deleteDisabled"
            :confirm-button-text="t('confirm')"
            :cancel-button-text="t('no')"
            :icon="InfoFilled"
            icon-color="red"
            :title="t('confirm_delete')"
            @confirm="confirmDeleteDict(scope.row.id)">
            <template #reference>
              <div style="display: inline-block">
                <el-tooltip :content="t('delete')" placement="top">
                  <el-icon v-show="auths.includes('dict.delete')" size="18" color="#f56c6c" class="operation"
                    ><Delete
                  /></el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-popconfirm>

          <!--编辑-->
          <el-tooltip :content="t('edit')" placement="top">
            <el-icon
              v-show="auths.includes('dict.edit')"
              size="18"
              color="#67c23a"
              class="operation"
              @click="action('Edit', true, scope.row)"
              ><Edit
            /></el-icon>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--   分页     -->
    <div style="position: fixed; bottom: 55px; left: 50%">
      <Pagination
        v-show="total > 0"
        :total="total"
        v-model:page="pageNum"
        v-model:limit="pageSize"
        @pagination="load" />
    </div>

    <!--  抽屉框 -->
    <div>
      <el-drawer v-model="drawer" direction="rtl" size="400" :show-close="false" :before-close="handleClose">
        <template #header="{ close }">
          <div>
            <el-button class="drawer-header-close" type="danger" @click="close" :icon="CircleCloseFilled">{{
              t('close')
            }}</el-button>
            <!-- 温馨提示 -->
            <el-alert
              v-if="alert"
              :title="alertTitle"
              :type="alertType"
              :description="alertContent"
              @close="alertClose"
              show-icon />
          </div>
        </template>

        <el-scrollbar max-height="580px">
          <el-form :model="state.form" :rules="rules" ref="ruleFormRef" :label-position="'top'" style="padding: 20px">
            <el-form-item :label="t('coding')" required prop="code">
              <el-input clearable v-model="state.form.code" autocomplete="off" />
            </el-form-item>
            <el-form-item :label="t('content')" required prop="value">
              <el-input clearable v-model="state.form.value" autocomplete="off" />
            </el-form-item>
            <el-form-item :label="t('type')" required prop="type">
              <el-select v-model="state.form.type" style="width: 100%" :placeholder="t('select')">
                <el-option v-for="item in ['icon']" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-scrollbar>
        <template #footer>
          <el-button
            style="width: 100%; margin-left: 0"
            color="#2da34e"
            v-show="showButton"
            :loading="verify"
            @click="handleClick(ruleFormRef, AddDict, EditDict)">
            {{ buttonText }}
          </el-button>
        </template>
      </el-drawer>
    </div>

    <!--  模态框-->
    <Teleport to="body">
      <!-- 使用这个 modal 组件，传入 prop -->
      <modal :show="showModal" width="300px" @close="showModal = false">
        <template #header>
          <h3>{{ t('confirm_close') }}</h3>
        </template>
        <template #body>
          <p>{{ t('no_save') }}</p>
        </template>
        <template #footer>
          <el-button text type="info" @click="cancel">{{ t('cancel') }}</el-button>
          <el-button class="modal-default-button" text type="danger" @click="userClose">{{ t('close') }}</el-button>
        </template>
      </modal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import useDict from '@/hooks/useSystem/useDict'
import { useAction } from '@/hooks/useAction'
import { svg } from '@/components/svg'
import Pagination from '@/components/paging/index.vue'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import check from '@/hooks/useCheck'
import Modal from '@/components/modal/index.vue'
import useModal from '@/hooks/useModal'
import { clear, debounce } from '@/components/debounce'
import { tableRowClassName } from '@/hooks/useSystem/useDrivers'
import { i18n } from '@/i18n'
import { userStore } from '@/stores/user'
import HeadOperation from '@/components/headOperation/index.vue'

const { t } = i18n.global
const user = userStore()
/*获取权限数据*/
const auths = user.getAuths
const { validateIsNull } = check()

const {
  loading,
  tableData,
  pageNum,
  pageSize,
  total,
  drawer,
  state,
  AddOrEdit,
  verify,
  disabled,
  ruleFormRef,
  showModal,
  deleteDisabled,
  input,
  alertType,
  alert,
  alertTitle,
  alertContent,
  load,
  AddDict,
  handleClose,
  userClose,
  EditDict,
  confirmDeleteDict,
  handleDelAll,
  tableRow,
  deleteBatch
} = useDict()

const { showButton, buttonText, action, handleClick } = useAction()

const { cancel } = useModal()

/*适配小屏幕*/
const maxHeight = ref('580px')
onMounted(() => {
  const width = window.innerWidth
  maxHeight.value = width >= 1920 ? '580px' : '330px'
})

/*关闭提示框*/
const alertClose = () => {
  alert.value = false
}

const rules = reactive({
  code: [{ validator: validateIsNull, trigger: 'blur' }],
  value: [{ validator: validateIsNull, trigger: 'blur' }],
  type: [{ validator: validateIsNull, trigger: 'blur' }]
})

load()
/*页面销毁前 清除定时器*/
onBeforeUnmount(() => {
  clear()
})
</script>

<style scoped></style>
