<template>
  <div>
    <!--操作选项-->
    <HeadOperation :load="load">
      <template #insert-button><span style="overflow: hidden"></span></template>
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
      <el-table-column prop="id" sortable label="Id" align="center" width="100"></el-table-column>
      <el-table-column prop="username" :label="t('user_name')"></el-table-column>
      <el-table-column prop="operation" :label="t('operation')"></el-table-column>
      <el-table-column prop="method" :label="t('method')"></el-table-column>
      <el-table-column prop="requestPath" :label="t('request_path')"></el-table-column>
      <el-table-column prop="result" :label="t('result')"></el-table-column>
      <el-table-column prop="time" :label="t('time')">
        <template #default="scope">
          <el-tag type="success">{{ scope.row.time }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="t('create_time')"></el-table-column>
      <!--操作表格栏-->
      <!--            <el-table-column v-if="auths.includes('dict.delete') || auths.includes('dict.edit')" fixed="right" :label="t('operation')" width="120" align="center">-->
      <!--                <template #default="scope">-->

      <!--                </template>-->
      <!--            </el-table-column>-->
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

    <!--        &lt;!&ndash;  模态框&ndash;&gt;-->
    <!--        <Teleport to="body">-->
    <!--            &lt;!&ndash; 使用这个 modal 组件，传入 prop &ndash;&gt;-->
    <!--            <modal :show="showModal" width="300px" @close="showModal = false">-->
    <!--                <template #header>-->
    <!--                    <h3>{{ t('confirm_close') }}</h3>-->
    <!--                </template>-->
    <!--                <template #body>-->
    <!--                    <p>{{ t('no_save') }}</p>-->
    <!--                </template>-->
    <!--                <template #footer>-->
    <!--                    <el-button text type="info" @click="cancel">{{ t('cancel') }}</el-button>-->
    <!--                    <el-button class="modal-default-button" text type="danger" @click="userClose">{{ t('close') }}</el-button>-->
    <!--                </template>-->
    <!--            </modal>-->
    <!--        </Teleport>-->
  </div>
</template>

<script setup lang="ts">
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
import useLog from '@/hooks/useSystem/useLog'

const { t } = i18n.global
const user = userStore()
/*获取权限数据*/
const auths = user.getAuths
const { validateIsNull } = check()

const { loading, tableData, pageNum, pageSize, total, state, showModal, input, alert, load, tableRow } = useLog()

const { cancel } = useModal()

/*适配小屏幕*/
const maxHeight = ref('580px')
onMounted(() => {
  const width = window.innerWidth
  maxHeight.value = width >= 1920 ? '580px' : '330px'
})

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
