<template>
  <div>
    <!--操作选项-->
    <HeadOperation :load="load">
      <template #action>
        <el-button
          v-show="auths.includes('auth.add')"
          type="success"
          :icon="Plus"
          text
          bg
          @click="action('Add', true, null, InitParam)"
          >{{ t('add') }}</el-button
        >
      </template>
      <template #insert-button>
        <!--  收缩/展开  -->
        <el-tooltip :content="expandText" placement="top">
          <el-button text bg type="danger" :icon="DCaret" @click="handleExpand">{{ expandText }}</el-button>
        </el-tooltip>
      </template>
      <template #input><span style="overflow: hidden"></span></template>
    </HeadOperation>

    <!--表格 -->
    <el-table
      style="width: 100%"
      v-if="refreshTable"
      v-loading="loading"
      :max-height="maxHeight"
      row-key="name"
      :default-expand-all="isExpand"
      :element-loading-text="t('loading')"
      :element-loading-spinner="svg"
      element-loading-svg-view-box="-10, -10, 50, 50"
      element-loading-background="rgba(122, 122, 122, 0.4)"
      :data="tableData"
      :header-row-style="tableRow"
      :row-class-name="tableRowPermissionClassName"
      border>
      <!--内容左边表格-->
      <el-table-column prop="name" :label="t('name')" width="200"></el-table-column>
      <el-table-column prop="path" :label="t('path')" width="200"></el-table-column>
      <el-table-column prop="orders" :label="t('orders')" width="200"></el-table-column>
      <el-table-column prop="icon" :label="t('icon')" width="100">
        <template #default="scope">
          <el-icon v-if="scope.row.icon"><component :is="scope.row.icon" /></el-icon>
          <el-icon v-else><SemiSelect /></el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="page" :label="t('page_path')" width="200"></el-table-column>
      <el-table-column prop="auth" :label="t('auth')" width="200"></el-table-column>
      <el-table-column prop="pid" :label="t('pid')" width="100"></el-table-column>
      <el-table-column prop="type" :label="t('auth_type')" width="180">
        <template #default="scope">
          <el-tag type="danger" v-show="scope.row.type === 1">菜单目录</el-tag>
          <el-tag type="warning" v-show="scope.row.type === 2">菜单页面</el-tag>
          <el-tag type="success" v-show="scope.row.type === 3">页面权限</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="hide" :label="t('if_hide')" width="120">
        <template #default="scope">
          <el-switch v-model="scope.row.hide" @change="changeHide(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="t('create_time')" width="500"></el-table-column>
      <el-table-column prop="updateTime" :label="t('update_time')" width="500"></el-table-column>

      <!--操作表格栏-->
      <el-table-column
        v-if="auths.includes('auth.delete') || auths.includes('auth.edit')"
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
            @confirm="confirmDeletePermission(scope.row.id)">
            <template #reference>
              <div style="display: inline-block">
                <el-tooltip :content="t('delete')" placement="top">
                  <el-icon v-show="auths.includes('auth.delete')" size="18" color="#f56c6c" class="operation"
                    ><Delete
                  /></el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-popconfirm>

          <!--编辑-->
          <el-tooltip :content="t('edit')" placement="top">
            <el-icon
              v-show="auths.includes('auth.edit')"
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
            <!--  创建权限类型单选框 -->
            <el-form-item :label="t('auth_type')">
              <el-radio-group
                :disabled="AddOrEdit === 'Edit'"
                v-model="state.form.type"
                style="padding: 0 20px 20px 25px">
                <el-radio-button :label="1">{{ t('menu_directory') }}</el-radio-button>
                <el-radio-button :label="2">{{ t('menu_page') }}</el-radio-button>
                <el-radio-button :label="3">{{ t('page_auth') }}</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item :label="t('name')" required prop="name">
              <el-input clearable v-model="state.form.name" autocomplete="off" />
            </el-form-item>
            <el-form-item :label="t('path')" required prop="path" v-if="state.form.type === 2">
              <el-input clearable v-model="state.form.path" autocomplete="off" />
            </el-form-item>
            <el-form-item
              :label="t('orders')"
              required
              prop="orders"
              v-if="state.form.type === 1 || state.form.type === 2">
              <el-input-number v-model="state.form.orders" :min="1" />
            </el-form-item>
            <el-form-item :label="t('icon')" required prop="icon" v-if="state.form.type === 1 || state.form.type === 2">
              <el-select v-model="state.form.icon" filterable :placeholder="t('select')">
                <el-option v-for="item in icons" :key="item.id" :label="item.code" :value="item.value">
                  <el-icon><component :is="item.value" /></el-icon>
                  <spen style="margin: 1.5rem">{{ item.code }}</spen>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="t('page_path')" required prop="page" v-if="state.form.type === 2">
              <el-input clearable v-model="state.form.page" autocomplete="off" />
            </el-form-item>
            <el-form-item :label="t('auth')" required prop="auth" v-if="state.form.type === 3">
              <el-input clearable v-model="state.form.auth" autocomplete="off" />
            </el-form-item>
            <el-form-item
              :label="t('pid')"
              required
              prop="pid"
              v-if="AddOrEdit === 'Add' ? state.form.type !== 1 : state.form.pid">
              <el-select v-if="state.form.type === 2" v-model="state.form.pid" :placeholder="t('select')">
                <el-option v-for="item in MenuPidOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
              <el-select v-if="state.form.type === 3" v-model="state.form.pid" :placeholder="t('select')">
                <el-option v-for="item in BtnPidOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>

              <!--                        <el-tree-select  style="width: 100%" v-model="state.form.pid" :data="pidOptions"-->
              <!--                                         :props="{label:'name',value:'id'}" check-strictly @visible-change="getCorrespondAuth(state.form.type)"-->
              <!--                                         :render-after-expand="false" />-->
            </el-form-item>
            <el-form-item v-show="AddOrEdit === 'Edit'" :label="t('create_time')">
              <el-input v-model="state.form.createTime" disabled autocomplete="off" />
            </el-form-item>
            <el-form-item v-show="AddOrEdit === 'Edit'" :label="t('update_time')">
              <el-input v-model="state.form.updateTime" disabled autocomplete="off" />
            </el-form-item>
          </el-form>
        </el-scrollbar>

        <template #footer>
          <el-button
            style="width: 100%; margin-left: 0"
            color="#2da34e"
            v-show="showButton"
            :loading="verify"
            @click="handleClick(ruleFormRef, AddPermission, EditPermissions)">
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
import { i18n } from '@/i18n'
import usePermission, { tableRowPermissionClassName } from '@/hooks/useSystem/usePermission'
import { svg } from '@/components/svg'
import Modal from '@/components/modal/index.vue'
import { useAction } from '@/hooks/useAction'
import useModal from '@/hooks/useModal'
import check from '@/hooks/useCheck'
import { onMounted, reactive, ref, watch } from 'vue'
import HeadOperation from '@/components/headOperation/index.vue'
import { userStore } from '@/stores/user'

const { t, locale } = i18n.global
const user = userStore()
/*获取权限数据*/
const auths = user.getAuths
const { validateIsNull } = check()

const {
  loading,
  disabled,
  ruleFormRef,
  verify,
  drawer,
  input,
  alert,
  tableData,
  icons,
  MenuPidOptions,
  BtnPidOptions,
  deleteDisabled,
  state,
  alertTitle,
  alertType,
  alertContent,
  AddOrEdit,
  showModal,
  refreshTable,
  expandText,
  isExpand,
  load,
  tableRow,
  userClose,
  handleClose,
  AddPermission,
  changeHide,
  EditPermissions,
  confirmDeletePermission,
  handleExpand
} = usePermission()

const { showButton, buttonText, action, handleClick } = useAction()

const { cancel } = useModal()

/*适配小屏幕*/
const maxHeight = ref('580px')
onMounted(() => {
  const width = window.innerWidth
  maxHeight.value = width >= 1920 ? '580px' : '330px'
})

/*初始化参数选项*/
const InitParam = () => {
  state.form = { type: 1, orders: 1, ...state.form }
}

/*监听语言是否被切换，如何发生变化则调用i18n修改loginText*/
watch(locale, () => {
  expandText.value = t('expand_all')
})

/*关闭提示框*/
const alertClose = () => {
  alert.value = false
}

const rules = reactive({
  name: [{ validator: validateIsNull, trigger: 'blur' }],
  orders: [{ validator: validateIsNull, trigger: 'blur' }],
  type: [{ validator: validateIsNull, trigger: 'blur' }],
  icon: [{ validator: validateIsNull, trigger: 'blur' }],
  path: [{ validator: validateIsNull, trigger: 'blur' }],
  pid: [{ validator: validateIsNull, trigger: 'blur' }],
  page: [{ validator: validateIsNull, trigger: 'blur' }],
  auth: [{ validator: validateIsNull, trigger: 'blur' }]
})

load()
</script>

<style scoped>
@import '@/assets/css/drawer.css';

/*更改单选框样式*/
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  color: var(--el-radio-button-checked-text-color, var(--el-color-white));
  background-color: #2c964b;
  border-color: #2c964b;
  box-shadow: -1px 0 0 0 #2c964b;
}

/*更改单选框hover样式*/
:deep(.el-radio-button__inner:hover) {
  color: #2c964b;
}

/*数值选项框圆角样式*/
:deep(.el-input-number__increase) {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
:deep(.el-input-number__decrease) {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
</style>
