<template>
  <div class="version-lists">
    <el-card class="!border-none" shadow="never">
      <div>
        <el-button v-perms="['app:version:add']" type="primary" @click="handleAdd">
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
            <el-table-column label="版本号" min-width="150">
              <template #default="{ row }">
                <el-tag>{{ row.version }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="平台" min-width="150">
              <template #default="{ row }">
                <el-tag v-if="row.platform !== ''" type="success">{{ row.platform }}</el-tag>
                <el-tag v-else type="danger">全部</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="类型" min-width="150">
              <template #default="{ row }">
                <el-tag v-if="row.type === 0" type="success"> 不提示 </el-tag>
                <el-tag v-else-if="row.type === 1" type="warning"> 提示 </el-tag>
                <el-tag v-else type="danger"> 强制 </el-tag>
              </template>
            </el-table-column>
            <el-table-column
                prop="content"
                label="内容"
                min-width="150"
                show-overflow-tooltip
            />
            <el-table-column
                prop="downloadUrl"
                label="下载地址"
                min-width="150"
                show-overflow-tooltip
            />
            <el-table-column prop="createdAtStr" label="创建时间" min-width="180"/>
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button
                    v-perms="['app:version:edit']"
                    link
                    type="primary"
                    @click="handleEdit(row)"
                >
                  编辑
                </el-button>
                <el-button
                    v-perms="['app:version:del']"
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

<script lang="ts" setup name="version">
import {versionDelete, versionLists} from '@/api/app/version'
import {usePaging} from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const {pager, getLists} = usePaging({
  fetchFun: versionLists,
  respKey: "appMgmtVersions"
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
  await versionDelete({ids: [id]})
  feedback.msgSuccess('删除成功')
  getLists()
}

getLists()
</script>
