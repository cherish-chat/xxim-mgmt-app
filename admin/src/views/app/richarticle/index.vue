<template>
  <div class="richarticle-lists">
    <el-card class="!border-none" shadow="never">
      <div>
        <el-button v-perms="['app:richarticle:add']" type="primary" @click="handleAdd">
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
            <el-table-column
                prop="title"
                label="标题"
                min-width="150"
                show-overflow-tooltip
            />
            <el-table-column
                prop="content"
                label="内容"
                min-width="150"
                show-overflow-tooltip
            />
            <el-table-column prop="sort" label="排序" min-width="50"/>
            <el-table-column label="启用" min-width="50">
              <template #default="{ row }">
                <el-switch
                    v-model="row.isEnable"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    disabled
                />
              </template>
            </el-table-column>
            <el-table-column prop="updatedAtStr" label="更新时间" min-width="180"/>
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button
                    v-perms="['app:richarticle:detail']"
                    link
                    type="primary"
                    @click="handleView(row)"
                >
                  打开
                </el-button>
                <el-button
                    v-perms="['app:richarticle:edit']"
                    link
                    type="primary"
                    @click="handleEdit(row)"
                >
                  编辑
                </el-button>
                <el-button
                    v-perms="['app:richarticle:del']"
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

<script lang="ts" setup name="richarticle">
import {richarticleDelete, richarticleLists} from '@/api/app/richarticle'
import {usePaging} from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const {pager, getLists} = usePaging({
  fetchFun: richarticleLists,
  respKey: "appMgmtRichArticles"
})
const handleAdd = async () => {
  showEdit.value = true
  await nextTick()
  editRef.value?.open('add')
}

const handleView = async (data: any) => {
  // 打开新标签页 data.url
  window.open(data.url, '_blank')
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
  await richarticleDelete({ids: [id]})
  feedback.msgSuccess('删除成功')
  getLists()
}

getLists()
</script>
