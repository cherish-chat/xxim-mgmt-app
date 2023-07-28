<template>
  <div class="model-lists">
    <el-card class="!border-none" shadow="never">
      <el-form class="mb-[-16px]" :model="formData" inline>
        <el-form-item label="角色">
          <el-select
              v-model="formData.role"
              clearable
          >
            <el-option label="全部" value=""/>
            <el-option label="用户" value="1"/>
            <el-option label="客服" value="2"/>
            <el-option label="游客" value="3"/>
            <el-option label="僵尸" value="4"/>
          </el-select>
        </el-form-item>
        <el-form-item label="账号">
          <el-input
              v-model="formData.id"
              class="w-[280px]"
              clearable
              @keyup.enter="resetPage"
          />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input
              v-model="formData.nickname"
              class="w-[280px]"
              clearable
              @keyup.enter="resetPage"
          />
        </el-form-item>
        <el-form-item label="邀请码">
          <el-input
              v-model="formData.invitationCode"
              class="w-[280px]"
              clearable
              @keyup.enter="resetPage"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
              v-model="formData.status"
              clearable
          >
            <el-option label="全部" value=""/>
            <el-option label="正常" value="normal"/>
            <el-option label="封禁" value="block"/>
          </el-select>
        </el-form-item>
        <!--createTime range-->
        <el-form-item label="注册时间">
          <el-date-picker
              v-model="formDataCreateTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
              @change="setFormDataCreateTime"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetPage">查询</el-button>
          <el-button @click="resetParams">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="!border-none" shadow="never">
      <div>
        <el-button v-perms="['user:model:add']" type="primary" @click="handleAdd">
          <template #icon>
            <icon name="el-icon-Plus"/>
          </template>
          新增
        </el-button>
        <el-button v-perms="['user:model:add']" type="primary" @click="handleInsertZombie">
          <template #icon>
            <icon name="el-icon-Plus"/>
          </template>
          插入僵尸号
        </el-button>
      </div>
      <div class="mt-4">
        <div>
          <el-table :data="pager.lists" size="large" v-loading="pager.loading">
            <el-table-column label="账号信息" min-width="120">
              <template #default="{ row }">
                <el-tag type="info">id: {{ row.id }}</el-tag>
                <el-tag>角色: {{ getRole(row) }}</el-tag>
                <el-tag v-if="row.invitationCode !== ''" type="success">邀请码: {{ row.invitationCode }}</el-tag>
                <el-tag v-if="row.mobile !== ''" type="warning">手机号: {{ row.mobile }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="基本信息" min-width="150">
              <template #default="{ row }">
                <el-tag>昵称:{{ row.nickname }}</el-tag>
                <el-tag type="warning">性别:{{ getXb(row) }}</el-tag>
                <el-avatar :src="row.avatar"/>
              </template>
            </el-table-column>
            <el-table-column label="上次登录" min-width="150">
              <template #default="{ row }">
                <div v-if="row.lastLoginRecord">
                  <el-tag v-if="row.lastLoginRecord.time === 0"> 无记录</el-tag>
                  <el-tag v-if="row.lastLoginRecord.time !== 0">
                    {{ row.lastLoginRecord.timeStr }}
                  </el-tag>
                  <el-tag v-if="row.lastLoginRecord.time !== 0" type="warning">
                    {{ row.lastLoginRecord.ip }}
                  </el-tag>
                  <el-tag v-if="row.lastLoginRecord.time !== 0" type="danger">
                    {{ row.lastLoginRecord.ipRegion }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="注册信息" min-width="180">
              <template #default="{ row }">
                <el-tag>{{ row.createdAtStr }}</el-tag>
                <el-tag v-if="row.regInfo.platform !== ''" type="success">{{ row.regInfo.platform }}</el-tag>
                <el-tag v-if="row.regInfo.ip !== ''" type="warning">{{ row.regInfo.ip }}</el-tag>
                <el-tag v-if="row.regInfo.ip !== ''" type="danger">
                  {{ row.regInfo.ipCountry }}|{{ row.regInfo.ipProvince }}|{{ row.regInfo.ipCity }}|{{
                    row.regInfo.ipISP
                  }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" min-width="100">
              <template #default="{ row }">
                <el-tag v-if="row.unblockTime !== 0" type="danger">{{ row.unblockTimeStr }}解封</el-tag>
                <el-tag v-else type="success">正常</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="后台备注" min-width="80" prop="adminRemark"/>
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button
                    v-perms="['user:model:detail']"
                    link
                    type="primary"
                    @click="handleWallet(row)"
                >
                  钱包
                </el-button>
                <el-button
                    v-perms="['user:model:detail']"
                    link
                    type="primary"
                    @click="handleFriends(row)"
                >
                  好友列表
                </el-button>
                <el-button
                    v-perms="['user:model:detail']"
                    link
                    type="primary"
                    @click="handleGroups(row)"
                >
                  群列表
                </el-button>
                <el-button
                    v-perms="['user:model:detail']"
                    link
                    type="primary"
                    @click="handleConfig(row)"
                >
                  编辑配置
                </el-button>
                <el-button
                    v-perms="['user:model:edit']"
                    link
                    type="primary"
                    @click="handleEdit(row)"
                >
                  编辑
                </el-button>
                <el-button
                    v-perms="['user:model:edit']"
                    link
                    :type="row.unblockTime === 0 ? 'danger' : 'success'"
                    @click="handleSwitch(row)"
                >
                  {{ row.unblockTime === 0 ? '封禁' : '解封' }}
                </el-button>
                <el-button
                    v-perms="['user:model:del']"
                    link
                    type="danger"
                    @click="handleDelete(row.id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="flex justify-end mt-4">
          <pagination v-model="pager" @change="getLists"/>
        </div>
      </div>
    </el-card>
    <edit-popup v-if="showEdit" ref="editRef" @success="getLists" @close="showEdit = false"/>
    <wallet-popup v-if="showWallet" ref="walletRef" @success="getLists" @close="showWallet = false"/>
    <insert-zombie-popup v-if="showInsertZombie" ref="insertZombieRef" @success="getLists" @close="showInsertZombie = false"/>
    <switch-popup v-if="showSwitch" ref="switchRef" @success="getLists" @close="showSwitch = false"/>
  </div>
</template>

<script lang="ts" setup name="model">
import {modelDelete, modelLists} from '@/api/user/model'
import {usePaging} from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'
import WalletPopup from './wallet.vue'
import InsertZombiePopup from './insertZombie.vue'
import SwitchPopup from './switch.vue'

const formData = ref({
  id: '',
  nickname: '',
  role: '',
  invitationCode: '',
  status: '',
  createTime_gte: '',
  createTime_lte: '',
})
const formDataCreateTime = ref([])
const setFormDataCreateTime = (val: any) => {
  formDataCreateTime.value = val
  formData.value.createTime_gte = (val[0] as Date).getTime().toString()
  formData.value.createTime_lte = (val[1] as Date).getTime().toString()
}
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const walletRef = shallowRef<InstanceType<typeof WalletPopup>>()
const insertZombieRef = shallowRef<InstanceType<typeof InsertZombiePopup>>()
const switchRef = shallowRef<InstanceType<typeof SwitchPopup>>()
const showEdit = ref(false)
const showWallet = ref(false)
const showInsertZombie = ref(false)
const showSwitch = ref(false)
const {pager, getLists, resetPage, resetParams} = usePaging({
  fetchFun: modelLists,
  respKey: "userModelList",
  params: formData.value,
})

const getRole = (row: any) => {
  if (row.role === 0) {
    return '普通用户'
  } else if (row.role === 1) {
    return '客服'
  } else if (row.role === 2) {
    return '游客'
  } else if (row.role === 3) {
    return '僵尸'
  } else {
    return '未知'
  }
}

const getXb = (row: any) => {
  if (row.xb === 0) {
    return '保密'
  } else if (row.xb === 1) {
    return '男'
  } else {
    return '女'
  }
}

const handleAdd = async () => {
  showEdit.value = true
  await nextTick()
  editRef.value?.open('add')
}

const handleInsertZombie = async () => {
  showInsertZombie.value = true
  await nextTick()
  insertZombieRef.value?.open()
}

const router = useRouter();
const handleFriends = async (row: any) => {
  // 跳转到 /user/friends 携带参数 row.id
  router.push({path: '/user/friends', query: {id: row.id}})
}
const handleGroups = async (row: any) => {
  // 跳转到 /user/groups 携带参数 row.id
  router.push({path: '/user/groups', query: {id: row.id}})
}
const handleConfig = async (row: any) => {
  // 跳转到 /user/groups 携带参数 row.id
  router.push({path: '/app/app/config', query: {id: row.id}})
}
const handleEdit = async (data: any) => {
  showEdit.value = true
  await nextTick()
  editRef.value?.open('edit')
  editRef.value?.setFormData(data)
}
const handleWallet = async (data: any) => {
  showWallet.value = true
  await nextTick()
  walletRef.value?.open(data)
}
const handleSwitch = async (data: any) => {
  showSwitch.value = true
  await nextTick()
  switchRef.value?.open(data)
  switchRef.value?.setFormData(data)
}

// 删除角色
const handleDelete = async (id: string) => {
  await feedback.confirm('确定要删除？')
  await modelDelete({ids: [id]})
  feedback.msgSuccess('删除成功')
  getLists()
}

getLists()
</script>
