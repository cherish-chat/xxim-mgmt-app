<template>
  <div class="emoji-lists">
    <el-card class="!border-none" shadow="never">
      <div>
        <el-button v-perms="['app:emoji:add']" type="primary" @click="handleAdd">
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
            <el-table-column label="分组" min-width="150">
              <template #default="{ row }">
                <el-tag>{{ row.group }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="name" min-width="150"/>
            <el-table-column label="类型" min-width="150">
              <template #default="{ row }">
                <el-tag type="success"> {{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
                label="静态图"
                min-width="150"
            >
              <template #default="{ row }">
                <el-image :src="row.staticUrl" :preview-src-list="[row.staticUrl]" fit="cover"
                          style="width: 50px; height: 50px;"/>
              </template>
            </el-table-column>
            <el-table-column
                label="动态图"
                min-width="150"
            >
              <template #default="{ row }">
                <el-image :src="row.animatedUrl" :preview-src-list="[row.animatedUrl]" fit="cover"
                          style="width: 50px; height: 50px;"/>
              </template>
            </el-table-column>
            <el-table-column label="排序" width="100" prop="sort"/>
            <el-table-column label="启用" width="100" prop="isEnable">
              <template #default="{ row }">
                <el-switch v-model="row.isEnable" disabled/>
              </template>
            </el-table-column>
            <el-table-column label="是封面" width="100" prop="cover">
              <template #default="{ row }">
                <el-switch v-model="row.cover" disabled/>
              </template>
            </el-table-column>
            <el-table-column prop="createdAtStr" label="创建时间" min-width="180"/>
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button
                    v-perms="['app:emoji:edit']"
                    link
                    type="primary"
                    @click="handleEdit(row)"
                >
                  编辑
                </el-button>
                <el-button
                    v-perms="['app:emoji:del']"
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

<script lang="ts" setup name="emoji">
import {emojiDelete, emojiLists} from '@/api/app/emoji'
import {usePaging} from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const {pager, getLists} = usePaging({
  fetchFun: emojiLists,
  respKey: "appMgmtEmojis"
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
  await emojiDelete({ids: [id]})
  feedback.msgSuccess('删除成功')
  getLists()
}

getLists()
</script>
