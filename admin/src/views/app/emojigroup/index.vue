<template>
  <div class="emojigroup-lists">
    <el-card class="!border-none" shadow="never">
      <div class="mt-4">
        <div>
          <el-table :data="pager.lists" size="large" v-loading="pager.loading">
            <el-table-column label="名称" min-width="150">
              <template #default="{ row }">
                <el-tag>{{ row.name }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="启用" width="100" prop="isEnable">
              <template #default="{ row }">
                <el-switch v-model="row.isEnable" disabled/>
              </template>
            </el-table-column>
            <el-table-column label="封面" min-width="300">
              <template #default="{ row }">
                <div v-if="row.cover.id!==''">
                  <el-tag>名称:{{ row.cover.name }}</el-tag>
                  <el-tag>类型:{{ row.cover.type }}</el-tag>
                  <el-image :src="row.cover.staticUrl" :preview-src-list="[row.cover.staticUrl]" fit="cover"
                            style="width: 50px; height: 50px;"/>
                  <el-image :src="row.cover.animatedUrl" :preview-src-list="[row.cover.animatedUrl]" fit="cover"
                            style="width: 50px; height: 50px;"/>
                </div>
                <el-tag v-else>无</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAtStr" label="创建时间" min-width="180"/>
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button
                    v-perms="['app:emojigroup:edit']"
                    link
                    type="primary"
                    @click="handleEdit(row)"
                >
                  编辑
                </el-button>
                <el-button
                    v-perms="['app:emojigroup:del']"
                    link
                    type="danger"
                    @click="handleDelete(row.name)"
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

<script lang="ts" setup name="emojigroup">
import {emojigroupDelete, emojigroupLists} from '@/api/app/emojigroup'
import {usePaging} from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const {pager, getLists} = usePaging({
  fetchFun: emojigroupLists,
  respKey: "appMgmtEmojiGroups"
})

const handleEdit = async (data: any) => {
  showEdit.value = true
  await nextTick()
  editRef.value?.open('edit')
  editRef.value?.setFormData(data)
}

// 删除角色
const handleDelete = async (id: string) => {
  await feedback.confirm('确定要删除？')
  await emojigroupDelete({names: [id]})
  feedback.msgSuccess('删除成功')
  getLists()
}

getLists()
</script>
