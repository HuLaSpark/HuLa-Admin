<template>
  <!--操作选项-->
  <HeadOperation :load="load">
    <template #insert-button><span style="overflow: hidden"></span></template>
    <template #input><span style="overflow: hidden"></span></template>
  </HeadOperation>

  <!--   表格     -->
  <el-table
    v-loading="loading"
    :max-height="maxHeight"
    :element-loading-text="t('loading')"
    :element-loading-spinner="svg"
    element-loading-svg-view-box="-10, -10, 50, 50"
    element-loading-background="rgba(122, 122, 122, 0.4)"
    :data="tableData"
    border
    :row-class-name="tableRowClassNameOnline"
    style="width: 100%">
    <!--内容左边表格-->
    <el-table-column fixed prop="userInfo.id" sortable label="Id" align="center"></el-table-column>
    <el-table-column prop="userInfo.userName" :label="t('user_name')" width="500"></el-table-column>
    <el-table-column prop="userInfo.url" :label="t('avatar')" align="center" width="200">
      <template #default="scope">
        <el-avatar v-if="scope.row.userInfo.url" @error="errorHandler" :src="scope.row.userInfo.url"></el-avatar>
        <el-avatar v-else @error="errorHandler">{{ scope.row.userInfo.userName }}</el-avatar>
      </template>
    </el-table-column>
    <el-table-column prop="userInfo.email" :label="t('email')" width="500"></el-table-column>

    <!--操作表格栏-->
    <el-table-column fixed="right" :label="t('operation')" width="320" align="center">
      <!--  vue3中使用  v-slot element-plus中 #default 也可以   -->
      <template #default="scope">
        <div style="display: inline-flex">
          <div v-if="scope.row.userInfo.uid !== userUid">
            <el-button v-show="auths.includes('user.kick')" type="success" link @click="kick(scope.row.userInfo)">{{
              t('kick')
            }}</el-button>
            <el-button v-show="auths.includes('user.ban')" type="danger" link @click="onlineBan(scope.row.userInfo)">{{
              t('ban')
            }}</el-button>
          </div>
          <div style="margin-left: 12px">
            <el-button type="info" link @click="checkInfo(scope.row)">{{ t('look_info') }}</el-button>
          </div>
        </div>
      </template>
    </el-table-column>
  </el-table>

  <!--  模态框-->
  <Teleport to="body">
    <!-- 使用这个 modal 组件，传入 prop -->
    <modal :show="showModal" @close="showModal = false">
      <template #header>
        <div class="header">
          <h3 class="msg">{{ t('user_info') }}</h3>
          <img :src="modalUserInfo.userInfo.url" alt="" />
        </div>
      </template>
      <template #body>
        <!-- 内容描述 -->
        <el-descriptions :column="2" :size="size" border>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle"><user /></el-icon>{{ t('user_name') }}
              </div>
            </template>
            {{ modalUserInfo.userInfo.userName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle"><Message /></el-icon>{{ t('email') }}
              </div>
            </template>
            {{ modalUserInfo.userInfo.email }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle"><Avatar /></el-icon>{{ t('role_name') }}
              </div>
            </template>
            <el-tag effect="light" round :type="judgmentAuth(modalUserInfo.userInfo.role as any)">{{
              modalUserInfo.userInfo.roleName
            }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle"><Timer /></el-icon>{{ t('login_time') }}
              </div>
            </template>
            <el-tag size="small">{{ modalUserInfo.loginTime }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle"><Timer /></el-icon>{{ t('online_time') }}
              </div>
            </template>
            <el-tag size="small" type="warning" effect="plain">{{ modalUserInfo.continuousTime }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                {{ t('device_status') }}
              </div>
            </template>
            <div style="text-align: center">
              <el-icon v-if="modalUserInfo.device === 'default-device'"><Monitor /></el-icon>
              <el-icon v-else><Iphone /></el-icon>
              <div class="active">
                <div class="dot"></div>
                <p v-if="modalUserInfo.alive">{{ t('active_true') }}</p>
                <p v-else>{{ t('active_false') }}</p>
              </div>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </template>
      <template #footer>
        <div class="modal-default-button">
          <el-button text type="danger" @click="close">{{ t('close') }}</el-button>
        </div>
      </template>
    </modal>
  </Teleport>
</template>

<script setup lang="ts">
import { useOnline } from '@/hooks/useOnline'
import { svg } from '@/components/svg'
import { userStore } from '@/stores/user'
import Modal from '@/components/modal/index.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { animation } from '@/components/modal/type'
import useModal from '@/hooks/useModal'
import { i18n } from '@/i18n'
import { useAuth } from '@/hooks/useAuth'
import HeadOperation from '@/components/headOperation/index.vue'

const { t } = i18n.global
const userInfo = userStore()
/*获取权限数据*/
const auths = userInfo.getAuths
const userUid = userInfo.getUserUId
const modalUserInfo = reactive({
  alive: Boolean,
  loginTime: Date,
  device: String,
  continuousTime: Number,
  userInfo: { userName: String, email: String, url: String, roleName: String, role: String }
})
const activeColor: any = ref<string>()
const errorHandler = () => true

const {
  pageSize,
  total,
  disabled,
  verify,
  loading,
  showModal,
  tableData,
  load,
  kick,
  onlineBan,
  tableRowClassNameOnline
} = useOnline()

const { judgmentAuth } = useAuth()

const { close } = useModal()

/*适配小屏幕*/
const maxHeight = ref('580px')
onMounted(() => {
  const width = window.innerWidth
  maxHeight.value = width >= 1920 ? '580px' : '330px'
})

/*查看信息*/
const checkInfo = (info: any) => {
  animation.value = 'modal-container animate__animated animate__fadeInDown'
  showModal.value = true
  modalUserInfo.userInfo = info.userInfo
  // loginTime.value = new Date(info.loginTime).toLocaleString() 后端不做时间戳处理前端就需要处理
  modalUserInfo.loginTime = info.loginTime
  modalUserInfo.device = info.device
  modalUserInfo.continuousTime = info.continuousTime
  modalUserInfo.alive = info.alive
  info.alive ? (activeColor.value = '#2c964b') : (activeColor.value = '#bc3f4a')
}

const size = ref('')
const iconStyle = computed(() => {
  const marginMap: any = {
    large: '8px',
    default: '6px',
    small: '4px'
  }
  return {
    marginRight: marginMap[size.value] || marginMap.default
  }
})

load()
</script>

<style scoped>
.header {
  text-align: center;
}

.header img {
  width: 80px;
  height: 80px;
  margin: 20px 0;
  border-radius: 50%;
}

.cell-item {
  display: flex;
  align-items: center;
  font-weight: 700;
}

.modal-default-button {
  text-align: center;
  margin-top: 50px;
}

/*用户活跃样式*/
.active {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: v-bind(activeColor);
}

/*详情用户标题样式*/
.msg {
  background: #fdeae8;
  height: 40px;
  margin: 0;
  padding: 0;
  line-height: 40px;
  font-weight: bold;
  font-size: 15px;
  border-radius: 5px;
}

/*用户活跃圆点样式*/
.dot {
  width: 8px;
  height: 8px;
  margin: 0 5px;
  border-radius: 100%;
  background: v-bind(activeColor);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
}

/*修改默认表格栏颜色*/
:deep(.el-table .warning-row) {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

:deep(.el-table .success-row) {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
