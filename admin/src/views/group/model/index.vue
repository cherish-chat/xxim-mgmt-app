<template>
  <div class="model-lists">
    <el-card class="!border-none" shadow="never">
      <el-form class="mb-[-16px]" :model="formData" inline>
        <el-form-item label="id">
          <el-input
              v-model="formData.id"
              class="w-[280px]"
              clearable
              @keyup.enter="resetPage"
          />
        </el-form-item>
        <el-form-item label="名称">
          <el-input
              v-model="formData.name"
              class="w-[280px]"
              clearable
              @keyup.enter="resetPage"
          />
        </el-form-item>
        <el-form-item label="群主">
          <el-input
              v-model="formData.owner"
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
            <el-option label="解散" value="dismiss"/>
            <el-option label="禁言全部用户" value="mute"/>
            <el-option label="禁言普通用户" value="muteNormal"/>
          </el-select>
        </el-form-item>
        <!--createTime range-->
        <el-form-item label="创建时间">
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
      <div class="mt-4">
        <div>
          <el-table :data="pager.lists" size="large" v-loading="pager.loading">
            <el-table-column label="头像" min-width="70">
              <template #default="{row}">
                <el-image :src="row.avatar" class="w-10 h-10 rounded-full"/>
              </template>
            </el-table-column>
            <el-table-column label="id" prop="id" min-width="120"/>
            <el-table-column label="名字" prop="name" min-width="150"/>
            <el-table-column label="群主" prop="owner" min-width="150"/>
            <el-table-column label="描述" prop="description" min-width="150"/>
            <el-table-column label="群人数" prop="memberCount" min-width="50"/>
            <el-table-column label="状态" min-width="100">
              <template #default="{ row }">
                <el-tag v-if="row.dismissTime !== 0" type="danger">于{{ row.dismissTimeStr }}解散</el-tag>
                <el-tag v-if="row.allMute" type="warning">
                  全员禁言({{ row.allMuterType === 0 ? '所有人' : '普通用户' }})
                </el-tag>
                <el-tag v-if="row.dismissTime === 0 && !row.allMute" type="success">正常</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTimeStr" min-width="150"/>
            <el-table-column label="后台备注" min-width="80" prop="adminRemark"/>
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button
                    v-perms="['msg:msg:list']"
                    link
                    type="primary"
                    @click="handleMsg(row.id)"
                >
                  聊天记录
                </el-button>
                <el-button
                    v-perms="['group:model:edit']"
                    link
                    type="primary"
                    @click="handleEdit(row)"
                >
                  编辑
                </el-button>
                <el-button
                    v-perms="['group:model:edit']"
                    link
                    type="primary"
                    @click="handleInsertZombie(row)"
                >
                  插入僵尸号
                </el-button>
                <el-button
                    v-perms="['group:model:edit']"
                    link
                    type="danger"
                    @click="handleClearZombie(row)"
                >
                  清空僵尸号
                </el-button>
                <el-button
                    v-perms="['group:model:del']"
                    link
                    :type="row.dismissTime !== 0 ? 'success' : 'danger'"
                    @click="handleDelete(row.id)"
                >
                  {{ row.dismissTime !== 0 ? '恢复' : '解散' }}
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
    <insert-zombie-popup v-if="showInsertZombie" ref="insertZombieRef" @success="getLists"
                         @close="showInsertZombie = false"/>
  </div>
</template>

<script lang="ts" setup name="model">
import {modelDelete, modelLists, clearZombie} from '@/api/group/model'
import {usePaging} from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'
import InsertZombiePopup from "./insertZombie.vue"

const formData = ref({
  id: '',
  name: '',
  owner: '',
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
const insertZombieRef = shallowRef<InstanceType<typeof InsertZombiePopup>>()
const showEdit = ref(false)
const showInsertZombie = ref(false)

const {pager, getLists, resetPage, resetParams} = usePaging({
  fetchFun: modelLists,
  respKey: "groupModels",
  params: formData.value,
})

const router = useRouter();

const handleEdit = async (data: any) => {
  showEdit.value = true
  await nextTick()
  editRef.value?.open('edit')
  editRef.value?.setFormData(data)
}

const handleInsertZombie = async (data: any) => {
  showInsertZombie.value = true
  await nextTick()
  insertZombieRef.value?.open()
  insertZombieRef.value?.setFormData(data)
}

const handleClearZombie = async (data: any) => {
  await feedback.confirm('确定要清空僵尸号？')
  await clearZombie({groupId: data.id})
  feedback.msgSuccess('清空僵尸号成功')
  getLists()
}

// 删除角色
const handleDelete = async (id: string) => {
  await feedback.confirm('确定要解散？')
  await modelDelete({ids: [id]})
  feedback.msgSuccess('解散成功')
  getLists()
}
const getConvId = (groupId: string) => {
  return 'group:' + groupId;
}
const handleMsg = async (id: string) => {
  await router.push({path: '/msg/convmsgs', query: {id: getConvId(id)}})
}
getLists()
</script>
