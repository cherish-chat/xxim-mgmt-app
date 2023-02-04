<template>
  <div class="ipwhitelist-lists">
    <el-card class="!border-none" shadow="never">
      <div>
        <el-button v-perms="['system:ipwhitelist:add']" type="primary" @click="handleAdd">
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
            <el-table-column label="作用用户" min-width="150">
              <template #default="{ row }">
                <el-tag v-if="row.userId === ''" type="primary">所有用户</el-tag>
                <span v-else>{{ row.userId }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="150"/>
            <el-table-column
                prop="startIp"
                label="开始ip"
                min-width="150"
                show-overflow-tooltip
            />
            <el-table-column
                prop="endIp"
                label="结束ip"
                min-width="150"
                show-overflow-tooltip
            />
            <el-table-column label="启用" min-width="180">
              <template #default="{ row }">
                {{ row.isEnable ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column prop="createdAtStr" label="创建时间" min-width="180"/>
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button
                    v-perms="['system:ipwhitelist:edit']"
                    link
                    type="primary"
                    @click="handleEdit(row)"
                >
                  编辑
                </el-button>
                <el-button
                    v-perms="['system:ipwhitelist:del']"
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

<script lang="ts" setup name="ipwhitelist">
import {ipwhitelistDelete, ipwhitelistLists} from '@/api/perms/ipwhitelist'
import {usePaging} from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const {pager, getLists} = usePaging({
  fetchFun: ipwhitelistLists,
  respKey: "ipWhiteLists"
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
  await ipwhitelistDelete({ids: [id]})
  feedback.msgSuccess('删除成功')
  getLists()
}

getLists()
</script>
