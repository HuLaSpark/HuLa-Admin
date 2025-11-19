<template>
  <div class="p-4 space-y-4">
    <n-card title="群聊管理">
      <template #header-extra>
        <n-space>
          <n-button size="small" :loading="loading" @click="fetchGroupList">
            刷新
          </n-button>
        </n-space>
      </template>

      <!-- 查询条件 -->
      <div class="mb-4">
        <n-form inline :model="query">
          <n-form-item label="群昵称">
            <n-input
              v-model:value="query.groupNameKeyword"
              class="w-52"
              clearable
              placeholder="请输入群昵称"
            />
          </n-form-item>
          <n-form-item label="群成员">
            <n-input
              v-model:value="query.memberNameKeyword"
              class="w-52"
              clearable
              placeholder="请输入群成员昵称"
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

      <!-- 群聊列表 -->
      <n-data-table
        :columns="columns"
        :data="groupList"
        :loading="loading"
        :bordered="false"
        :row-key="rowKey"
        :pagination="false"
      />

      <!-- 分页 -->
      <div class="mt-4 flex justify-center">
        <n-pagination
          v-model:page="groupPage"
          :page-count="groupTotalPages"
          :page-size="groupPageSize"
          @update:page="handleGroupPageChange"
        />
      </div>
    </n-card>

    <!-- 群成员弹窗 -->
    <n-modal
      v-model:show="showMemberModal"
      preset="card"
      title="群成员"
      :bordered="false"
      :segmented="{ content: 'soft', footer: 'soft' }"
      style="max-width: 1000px; width: 100%"
    >
      <template #header-extra>
        <span v-if="currentGroup" class="text-12px text-gray-500">
          {{ currentGroup.groupName }}
          <span v-if="currentGroup.account" class="ml-2">（群号：{{ currentGroup.account }}）</span>
          <span v-else class="ml-2">（房间ID：{{ currentGroup.roomId }}）</span>
        </span>
      </template>

      <div class="mb-3 flex items-center justify-between gap-3">
        <n-input
          v-model:value="memberKeyword"
          clearable
          class="w-64"
          placeholder="按昵称 / UID 搜索成员"
        />
        <n-tag v-if="currentGroup" size="small" type="info" round>
          共 {{ currentGroup.memberNum ?? memberList.length }} 人
        </n-tag>
      </div>

      <n-data-table
        :columns="memberColumns"
        :data="filteredMemberList"
        :loading="memberLoading"
        :bordered="false"
        :pagination="false"
        :row-key="memberRowKey"
        :max-height="400"
      />

      <template #footer>
        <div class="flex justify-center">
          <n-pagination
            v-model:page="memberPage"
            :page-count="memberTotalPages"
            :page-size="memberPageSize"
            @update:page="handleMemberPageChange"
          />
        </div>
      </template>
    </n-modal>

    <!-- 群公告管理弹窗 -->
    <n-modal
      v-model:show="showAnnouncementModal"
      preset="card"
      title="群公告管理"
      :bordered="false"
      :segmented="{ content: 'soft', footer: 'soft' }"
      style="max-width: 800px; width: 100%"
    >
      <template #header-extra>
        <span v-if="currentGroup" class="text-12px text-gray-500">
          {{ currentGroup.groupName }}
        </span>
      </template>

      <n-data-table
        :columns="announcementColumns"
        :data="announcementList"
        :loading="announcementLoading"
        :bordered="false"
        :pagination="false"
        :row-key="announcementRowKey"
        :max-height="400"
      />

      <template #footer>
        <div class="flex justify-center">
          <n-pagination
            v-model:page="announcementPage"
            :page-count="announcementTotalPages"
            :page-size="announcementPageSize"
            @update:page="handleAnnouncementPageChange"
          />
        </div>
      </template>
    </n-modal>

    <!-- 编辑公告弹窗 -->
    <n-modal
      v-model:show="showEditAnnouncementModal"
      preset="card"
      title="编辑公告"
      :mask-closable="false"
      :bordered="false"
      :segmented="{ content: 'soft', footer: 'soft' }"
      style="width: 720px; max-width: 100%"
    >
      <n-form
        :model="editAnnouncementForm"
        label-placement="left"
        label-width="80"
        class="mt-2"
      >
        <n-form-item label="公告内容">
          <n-input
            v-model:value="editAnnouncementForm.content"
            type="textarea"
            :rows="5"
            placeholder="请输入公告内容"
          />
        </n-form-item>
        <n-form-item label="是否置顶">
          <n-switch v-model:value="editAnnouncementForm.top" />
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="flex justify-start gap-2">
          <n-button type="primary" :loading="editAnnouncementLoading" @click="handleSaveAnnouncement">
            保存
          </n-button>
          <n-button @click="showEditAnnouncementModal = false">
            取消
          </n-button>
        </div>
      </template>
    </n-modal>

    <!-- 修改昵称弹窗 -->
    <n-modal
      v-model:show="showEditNicknameModal"
      preset="card"
      title="修改群昵称"
      :mask-closable="false"
      :bordered="false"
      :segmented="{ content: 'soft', footer: 'soft' }"
      style="width: 480px; max-width: 100%"
    >
      <n-form
        :model="editNicknameForm"
        label-placement="left"
        label-width="80"
        class="mt-2"
      >
        <n-form-item label="群昵称">
          <n-input
            v-model:value="editNicknameForm.myName"
            placeholder="请输入群昵称"
            clearable
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="flex justify-start gap-2">
          <n-button type="primary" :loading="editNicknameLoading" @click="handleSaveNickname">
            保存
          </n-button>
          <n-button @click="showEditNicknameModal = false">
            取消
          </n-button>
        </div>
      </template>
    </n-modal>

    <!-- 编辑群名弹窗 -->
    <n-modal
      v-model:show="showEditGroupNameModal"
      preset="card"
      title="编辑群名"
      :mask-closable="false"
      :bordered="false"
      :segmented="{ content: 'soft', footer: 'soft' }"
      style="width: 480px; max-width: 100%"
    >
      <n-form
        :model="editGroupNameForm"
        label-placement="left"
        label-width="80"
        class="mt-2"
      >
        <n-form-item label="群名称">
          <n-input
            v-model:value="editGroupNameForm.groupName"
            placeholder="请输入群名称"
            clearable
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="flex justify-start gap-2">
          <n-button type="primary" :loading="editGroupNameLoading" @click="handleSaveGroupName">
            保存
          </n-button>
          <n-button @click="showEditGroupNameModal = false">
            取消
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NButton, NTag, NPopconfirm, NInputNumber } from 'naive-ui'
import {
  getImGroupPage,
  getImGroupMemberPage,
  getImGroupAnnouncementList,
  editImGroupAnnouncement,
  deleteImGroupAnnouncement,
  updateMemberNickname,
  removeMember,
  addAdmin,
  revokeAdmin,
  muteMember,
  updateRoomInfo,
  disbandGroup,
  type ImGroupItem,
  type ImGroupMemberSimple,
  type ImGroupAnnouncement
} from '@/api/imGroup'

const loading = ref(false)
const groupList = ref<ImGroupItem[]>([])
const query = ref({
  groupNameKeyword: '',
  memberNameKeyword: ''
})
const groupPage = ref(1)
const groupPageSize = ref(20)
const groupTotal = ref(0)

const showMemberModal = ref(false)
const memberLoading = ref(false)
const memberList = ref<ImGroupMemberSimple[]>([])
const memberKeyword = ref('')
const currentGroup = ref<ImGroupItem | null>(null)
const memberPage = ref(1)
const memberPageSize = ref(20)
const memberTotal = ref(0)

// 群公告相关
const showAnnouncementModal = ref(false)
const announcementLoading = ref(false)
const announcementList = ref<ImGroupAnnouncement[]>([])
const announcementPage = ref(1)
const announcementPageSize = ref(10)
const announcementTotal = ref(0)

// 编辑公告相关
const showEditAnnouncementModal = ref(false)
const editAnnouncementLoading = ref(false)
const editAnnouncementForm = ref<{
  id?: string
  roomId: string
  content: string
  top: boolean
}>({
  roomId: '',
  content: '',
  top: false
})

// 修改昵称相关
const showEditNicknameModal = ref(false)
const editNicknameLoading = ref(false)
const editNicknameForm = ref<{
  roomId: string
  uid: string
  myName: string
  remark: string
}>({
  roomId: '',
  uid: '',
  myName: '',
  remark: ''
})

// 编辑群名相关
const showEditGroupNameModal = ref(false)
const editGroupNameLoading = ref(false)
const editGroupNameForm = ref<{
  roomId: string
  groupName: string
  avatar: string
  allowScanEnter: boolean
}>({
  roomId: '',
  groupName: '',
  avatar: '',
  allowScanEnter: false
})

const columns: DataTableColumns<ImGroupItem> = [
  {
    title: '群名称',
    key: 'groupName',
    minWidth: 160
  },
  {
    title: '群号',
    key: 'account',
    width: 140,
    render(row) {
      return row.account || '-'
    }
  },
  {
    title: '成员数',
    key: 'memberNum',
    width: 100,
    render(row) {
      return row.memberNum ?? '-'
    }
  },
  {
    title: '在线人数',
    key: 'onlineNum',
    width: 100,
    render(row) {
      return row.onlineNum ?? '-'
    }
  },
  {
    title: '备注',
    key: 'remark',
    minWidth: 180,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 320,
    render(row) {
      return h(
        'div',
        { class: 'flex gap-2 flex-wrap' },
        [
          h(
            NButton,
            {
              size: 'small',
              quaternary: true,
              type: 'primary',
              onClick: () => openMemberModal(row)
            },
            { default: () => '查看成员' }
          ),
          h(
            NButton,
            {
              size: 'small',
              quaternary: true,
              type: 'info',
              onClick: () => openAnnouncementModal(row)
            },
            { default: () => '群公告' }
          ),
          h(
            NButton,
            {
              size: 'small',
              quaternary: true,
              type: 'warning',
              onClick: () => openEditGroupNameModal(row)
            },
            { default: () => '编辑群名' }
          ),
          h(
            NPopconfirm,
            {
              onPositiveClick: () => handleDisbandGroup(row)
            },
            {
              default: () => '确定要解散该群聊吗？此操作不可恢复！',
              trigger: () =>
                h(
                  NButton,
                  {
                    size: 'small',
                    quaternary: true,
                    type: 'error'
                  },
                  { default: () => '解散群聊' }
                )
            }
          )
        ]
      )
    }
  }
]

const memberColumns: DataTableColumns<ImGroupMemberSimple> = [
  {
    title: '昵称',
    key: 'name',
    minWidth: 160
  },
  {
    title: '角色',
    key: 'roleId',
    width: 120,
    render(row) {
      if (row.roleId === 1) return '群主'
      if (row.roleId === 2) return '管理员'
      if (row.roleId === 3) return '普通成员'
      if (row.roleId === 4) return '已被移出'
      return '-'
    }
  },
  {
    title: '在线状态',
    key: 'activeStatus',
    width: 100,
    render(row) {
      if (row.activeStatus === 1) {
        return h(
          NTag,
          { size: 'small', type: 'success', round: true },
          { default: () => '在线' }
        )
      }
      if (row.activeStatus === 2) {
        return h(
          NTag,
          { size: 'small', type: 'default', round: true },
          { default: () => '离线' }
        )
      }
      return '-'
    }
  },
  {
    title: 'IP 归属地',
    key: 'locPlace',
    width: 140
  },
  {
    title: 'IP 地址',
    key: 'ipAddress',
    width: 140
  },
  {
    title: '操作',
    key: 'actions',
    width: 340,
    render(row) {
      return h(
        'div',
        { class: 'flex gap-2 flex-wrap' },
        [
          h(
            NButton,
            {
              size: 'small',
              quaternary: true,
              type: 'primary',
              onClick: () => openEditNicknameModal(row)
            },
            { default: () => '改昵称' }
          ),
          h(
            NButton,
            {
              size: 'small',
              quaternary: true,
              type: row.roleId === 2 ? 'warning' : 'info',
              disabled: row.roleId === 1,
              onClick: () => handleToggleAdmin(row)
            },
            { default: () => (row.roleId === 2 ? '取消管理' : '设为管理') }
          ),
          h(
            NButton,
            {
              size: 'small',
              quaternary: true,
              type: 'warning',
              disabled: row.roleId === 1,
              onClick: () => handleMuteMember(row)
            },
            { default: () => '禁言' }
          ),
          h(
            NButton,
            {
              size: 'small',
              quaternary: true,
              type: 'error',
              disabled: row.roleId === 1,
              onClick: () => handleKickMember(row)
            },
            { default: () => '踢出' }
          )
        ]
      )
    }
  }
]

const announcementColumns: DataTableColumns<ImGroupAnnouncement> = [
  {
    title: '公告内容',
    key: 'content',
    minWidth: 240,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '是否置顶',
    key: 'top',
    width: 100,
    render(row) {
      return h(
        NTag,
        { size: 'small', type: row.top ? 'success' : 'default', round: true },
        { default: () => (row.top ? '置顶' : '普通') }
      )
    }
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 180
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
              onClick: () => openEditAnnouncementModal(row)
            },
            { default: () => '编辑' }
          ),
          h(
            NPopconfirm,
            {
              onPositiveClick: () => handleDeleteAnnouncement(row.id)
            },
            {
              default: () => '确定删除此公告吗？',
              trigger: () =>
                h(
                  NButton,
                  {
                    size: 'small',
                    quaternary: true,
                    type: 'error'
                  },
                  { default: () => '删除' }
                )
            }
          )
        ]
      )
    }
  }
]

const rowKey = (row: ImGroupItem) => `${row.roomId || row.groupId}`
const memberRowKey = (row: ImGroupMemberSimple) => `${row.uid}`
const announcementRowKey = (row: ImGroupAnnouncement) => `${row.id}`

const groupTotalPages = computed(() => Math.ceil(groupTotal.value / groupPageSize.value))
const memberTotalPages = computed(() => Math.ceil(memberTotal.value / memberPageSize.value))
const announcementTotalPages = computed(() => Math.ceil(announcementTotal.value / announcementPageSize.value))

const filteredMemberList = computed(() => {
  // 使用分页接口后，搜索功能暂时在前端过滤当前页数据
  const kw = memberKeyword.value.trim().toLowerCase()
  if (!kw) return memberList.value
  return memberList.value.filter((item) => {
    const name = item.name?.toLowerCase() ?? ''
    const uid = item.uid?.toLowerCase() ?? ''
    return name.includes(kw) || uid.includes(kw)
  })
})

async function fetchGroupList() {
  if (loading.value) return
  loading.value = true
  try {
    const resp = await getImGroupPage({
      pageNo: groupPage.value,
      pageSize: groupPageSize.value,
      groupNameKeyword: query.value.groupNameKeyword.trim(),
      memberNameKeyword: query.value.memberNameKeyword.trim()
    })
    groupList.value = resp.list || []
    groupTotal.value = resp.totalRecords || 0
  } catch (error: any) {
    const msg = (error && (error.msg || error.message)) || '获取群聊列表失败'
    window.$message?.error(msg)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  groupPage.value = 1
  fetchGroupList()
}

function handleReset() {
  query.value = {
    groupNameKeyword: '',
    memberNameKeyword: ''
  }
  groupPage.value = 1
  fetchGroupList()
}

function handleGroupPageChange(page: number) {
  groupPage.value = page
  fetchGroupList()
}

async function openMemberModal(group: ImGroupItem) {
  currentGroup.value = group
  showMemberModal.value = true
  memberKeyword.value = ''
  memberList.value = []
  memberPage.value = 1
  await fetchMemberList()
}

async function fetchMemberList() {
  if (!currentGroup.value) return
  memberLoading.value = true
  try {
    const res = await getImGroupMemberPage({
      roomId: currentGroup.value.roomId,
      pageNo: memberPage.value,
      pageSize: memberPageSize.value
    })
    memberList.value = res.list || []
    memberTotal.value = res.totalRecords || 0
  } catch (error: any) {
    const msg = (error && (error.msg || error.message)) || '获取群成员列表失败'
    window.$message?.error(msg)
  } finally {
    memberLoading.value = false
  }
}

function handleMemberPageChange(page: number) {
  memberPage.value = page
  fetchMemberList()
}

// 群公告相关函数
async function openAnnouncementModal(group: ImGroupItem) {
  currentGroup.value = group
  showAnnouncementModal.value = true
  announcementList.value = []
  announcementPage.value = 1
  await fetchAnnouncementList()
}

async function fetchAnnouncementList() {
  if (!currentGroup.value) return
  announcementLoading.value = true
  try {
    const res = await getImGroupAnnouncementList({
      roomId: currentGroup.value.roomId,
      current: announcementPage.value,
      size: announcementPageSize.value
    })
    announcementList.value = res.records || []
    announcementTotal.value = res.total || 0
  } catch (error: any) {
    const msg = (error && (error.msg || error.message)) || '获取群公告列表失败'
    window.$message?.error(msg)
  } finally {
    announcementLoading.value = false
  }
}

function handleAnnouncementPageChange(page: number) {
  announcementPage.value = page
  fetchAnnouncementList()
}

function openEditAnnouncementModal(announcement: ImGroupAnnouncement) {
  editAnnouncementForm.value = {
    id: announcement.id,
    roomId: announcement.roomId,
    content: announcement.content,
    top: announcement.top
  }
  showEditAnnouncementModal.value = true
}

async function handleSaveAnnouncement() {
  if (!editAnnouncementForm.value.content.trim()) {
    window.$message?.warning('请输入公告内容')
    return
  }

  if (!editAnnouncementForm.value.id) {
    window.$message?.warning('公告ID不能为空')
    return
  }

  editAnnouncementLoading.value = true
  try {
    await editImGroupAnnouncement({
      id: editAnnouncementForm.value.id,
      roomId: editAnnouncementForm.value.roomId,
      content: editAnnouncementForm.value.content,
      top: editAnnouncementForm.value.top
    })
    window.$message?.success('保存成功')
    showEditAnnouncementModal.value = false
    await fetchAnnouncementList()
  } catch (error: any) {
    const msg = (error && (error.msg || error.message)) || '保存公告失败'
    window.$message?.error(msg)
  } finally {
    editAnnouncementLoading.value = false
  }
}

async function handleDeleteAnnouncement(id: string) {
  try {
    await deleteImGroupAnnouncement({ id })
    window.$message?.success('删除成功')
    await fetchAnnouncementList()
  } catch (error: any) {
    const msg = (error && (error.msg || error.message)) || '删除公告失败'
    window.$message?.error(msg)
  }
}

// 修改昵称相关函数
function openEditNicknameModal(member: ImGroupMemberSimple) {
  if (!currentGroup.value) return
  editNicknameForm.value = {
    roomId: currentGroup.value.roomId,
    uid: member.uid,
    myName: member.name || '',
    remark: ''
  }
  showEditNicknameModal.value = true
}

async function handleSaveNickname() {
  editNicknameLoading.value = true
  try {
    await updateMemberNickname(editNicknameForm.value)
    window.$message?.success('修改成功')
    showEditNicknameModal.value = false
    await fetchMemberList()
  } catch (error: any) {
    const msg = (error && (error.msg || error.message)) || '修改昵称失败'
    window.$message?.error(msg)
  } finally {
    editNicknameLoading.value = false
  }
}

// 设置/取消管理员
async function handleToggleAdmin(member: ImGroupMemberSimple) {
  if (!currentGroup.value) return

  if (member.roleId === 1) {
    window.$message?.warning('群主无需设置')
    return
  }

  const isAdmin = member.roleId === 2
  const action = isAdmin ? '取消管理员' : '设为管理员'

  window.$dialog?.warning({
    title: `确认${action}`,
    content: `确定要将 ${member.name || member.uid} ${action}吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        if (isAdmin) {
          await revokeAdmin({
            roomId: currentGroup.value!.roomId,
            uidList: [member.uid]
          })
        } else {
          await addAdmin({
            roomId: currentGroup.value!.roomId,
            uidList: [member.uid]
          })
        }
        window.$message?.success(`${action}成功`)
        await fetchMemberList()
      } catch (error: any) {
        const msg = (error && (error.msg || error.message)) || `${action}失败`
        window.$message?.error(msg)
      }
    }
  })
}

// 禁言相关函数
async function handleMuteMember(member: ImGroupMemberSimple) {
  if (!currentGroup.value) return

  if (member.roleId === 1) {
    window.$message?.warning('不能禁言群主')
    return
  }

  window.$dialog?.create({
    title: '禁言成员',
    content: () => {
      const duration = ref(60)
      return h('div', { class: 'space-y-4' }, [
        h('p', `确定要禁言 ${member.name || member.uid} 吗？`),
        h('div', { class: 'flex items-center gap-2' }, [
          h('span', '禁言时长：'),
          h(NInputNumber, {
            value: duration.value,
            'onUpdate:value': (val: number | null) => {
              if (val !== null) {
                duration.value = val
              }
            },
            min: 1,
            max: 525600,
            style: { width: '200px' }
          }),
          h('span', '分钟')
        ])
      ])
    },
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await muteMember({
          roomId: currentGroup.value!.roomId,
          uid: member.uid,
          duration: 60 // 默认60分钟
        })
        window.$message?.success('禁言成功')
        await fetchMemberList()
      } catch (error: any) {
        const msg = (error && (error.msg || error.message)) || '禁言失败'
        window.$message?.error(msg)
      }
    }
  })
}

// 踢人相关函数
async function handleKickMember(member: ImGroupMemberSimple) {
  if (!currentGroup.value) return

  if (member.roleId === 1) {
    window.$message?.warning('不能踢出群主')
    return
  }

  window.$dialog?.warning({
    title: '确认踢出',
    content: `确定要将 ${member.name || member.uid} 踢出群聊吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await removeMember({
          roomId: currentGroup.value!.roomId,
          uidList: [member.uid]
        })
        window.$message?.success('踢出成功')
        await fetchMemberList()
      } catch (error: any) {
        const msg = (error && (error.msg || error.message)) || '踢出成员失败'
        window.$message?.error(msg)
      }
    }
  })
}

// 打开编辑群名弹窗
function openEditGroupNameModal(group: ImGroupItem) {
  editGroupNameForm.value.roomId = group.roomId
  editGroupNameForm.value.groupName = group.groupName
  editGroupNameForm.value.avatar = group.avatar || ''
  editGroupNameForm.value.allowScanEnter = group.allowScanEnter ?? false
  showEditGroupNameModal.value = true
}

// 保存群名
async function handleSaveGroupName() {
  if (!editGroupNameForm.value.groupName || editGroupNameForm.value.groupName.trim() === '') {
    window.$message?.warning('请输入群名称')
    return
  }

  editGroupNameLoading.value = true
  try {
    await updateRoomInfo({
      id: editGroupNameForm.value.roomId,
      name: editGroupNameForm.value.groupName.trim(),
      avatar: editGroupNameForm.value.avatar,
      allowScanEnter: editGroupNameForm.value.allowScanEnter
    })
    window.$message?.success('修改成功')
    showEditGroupNameModal.value = false
    await fetchGroupList()
  } catch (error: any) {
    const msg = (error && (error.msg || error.message)) || '修改群名失败'
    window.$message?.error(msg)
  } finally {
    editGroupNameLoading.value = false
  }
}

// 解散群聊
async function handleDisbandGroup(group: ImGroupItem) {
  try {
    await disbandGroup({
      roomId: group.roomId
    })
    window.$message?.success('解散成功')
    await fetchGroupList()
  } catch (error: any) {
    const msg = (error && (error.msg || error.message)) || '解散群聊失败'
    window.$message?.error(msg)
  }
}

onMounted(() => {
  fetchGroupList()
})
</script>
