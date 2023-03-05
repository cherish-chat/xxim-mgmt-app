<template>
  <div class="defaultconv-lists">
    <el-card class="!border-none" shadow="never">
      <div>
        <el-button v-perms="['user:defaultconv:add']" type="primary" @click="handleAdd">
          <template #icon>
            <icon name="el-icon-Plus"/>
          </template>
          新增
        </el-button>
      </div>
      <div class="mt-4">
        <div>
          <el-table :data="pager.lists" size="large" v-loading="pager.loading">
            <el-table-column prop="id" label="ID" min-width="100"/>
            <el-table-column label="会话" min-width="150">
              <template #default="{ row }">
                <el-tag v-if="row.convType === 0 " type="success">好友</el-tag>
                <el-tag v-else type="danger">群聊</el-tag>
                <el-tag type="warning">{{ row.convId }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="过滤" min-width="150">
              <template #default="{ row }">
                <el-tag v-if="row.filterType === 0" type="success"> 所有注册用户</el-tag>
                <el-tag v-else type="info"> 使用邀请码注册的用户</el-tag>
                <el-tag v-if="row.filterType === 1" type="danger">邀请码:{{ row.invitationCode }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="textMsg" label="招呼" min-width="180"/>
            <el-table-column prop="createdAtStr" label="创建时间" min-width="180"/>
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button
                    v-perms="['user:defaultconv:edit']"
                    link
                    type="primary"
                    @click="handleEdit(row)"
                >
                  编辑
                </el-button>
                <el-button
                    v-perms="['user:defaultconv:del']"
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
  </div>
</template>

<script lang="ts" setup name="defaultconv">
import {defaultconvDelete, defaultconvLists} from '@/api/user/defaultconv'
import {usePaging} from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const {pager, getLists} = usePaging({
  fetchFun: defaultconvLists,
  respKey: "userDefaultConvs"
})
const handleAdd = async () => {
  showEdit.value = true
  await nextTick()
  editRef.value?.open('add')
}

const handleEdit = async (data: any) => {
  showEdit.value = true
  await nextTick()
  editRef.value?.open('edit')
  editRef.value?.setFormData(data)
}

// 删除角色
const handleDelete = async (id: string) => {
  await feedback.confirm('确定要删除？')
  await defaultconvDelete({ids: [id]})
  feedback.msgSuccess('删除成功')
  getLists()
}

getLists()
</script>
