<template>
  <div class="invitationcode-lists">
    <el-card class="!border-none" shadow="never">
      <div>
        <el-button v-perms="['user:invitationcode:add']" type="primary" @click="handleAdd">
          <template #icon>
            <icon name="el-icon-Plus"/>
          </template>
          新增
        </el-button>
      </div>
      <div class="mt-4">
        <div>
          <el-table :data="pager.lists" size="large" v-loading="pager.loading">
            <el-table-column prop="code" label="code" min-width="100"/>
            <el-table-column label="备注" min-width="150" prop="remark"/>
            <el-table-column label="创建人" min-width="150">
              <template #default="{ row }">
                <el-tag v-if="row.creatorType === 0" type="success"> 管理员</el-tag>
                <el-tag v-else type="danger"> 用户</el-tag>
                <el-tag>{{ row.creator }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="启用" min-width="150">
              <template #default="{ row }">
                <el-tag v-if="row.isEnable" type="success"> 启用</el-tag>
                <el-tag v-else type="danger"> 禁用</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="预设会话模式" min-width="150">
              <template #default="{ row }">
                <el-tag v-if="row.defaultConvMode === 0" type="danger">添加所有预设会话</el-tag>
                <el-tag v-else-if="row.defaultConvMode === 1" type="warning">只添加一个会话(轮询)</el-tag>
                <el-tag v-else-if="row.defaultConvMode === 2" type="info">只添加一个会话(随机)</el-tag>
                <el-tag v-else type="success"> 不添加会话</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="successUserCount" label="用户数量" min-width="60"/>
            <el-table-column prop="createdAtStr" label="创建时间" min-width="180"/>
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button
                    v-perms="['user:invitationcode:edit']"
                    link
                    type="primary"
                    @click="handleEdit(row)"
                >
                  编辑
                </el-button>
                <el-button
                    v-perms="['user:invitationcode:del']"
                    link
                    type="danger"
                    @click="handleDelete(row.code)"
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

<script lang="ts" setup name="invitationcode">
import {invitationcodeDelete, invitationcodeLists} from '@/api/user/invitationcode'
import {usePaging} from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const {pager, getLists} = usePaging({
  fetchFun: invitationcodeLists,
  respKey: "userInvitationCodes"
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
const handleDelete = async (code: string) => {
  await feedback.confirm('确定要删除？')
  await invitationcodeDelete({codes: [code]})
  feedback.msgSuccess('删除成功')
  getLists()
}

getLists()
</script>
