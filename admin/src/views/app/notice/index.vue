<template>
  <div class="notice-lists">
    <el-card class="!border-none" shadow="never">
      <div>
        <el-button v-perms="['app:notice:add']" type="primary" @click="handleAdd">
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
            <el-table-column label="位置" min-width="80">
              <template #default="{ row }">
                <el-tag v-if="row.position === 0" type="info">开屏页</el-tag>
                <el-tag v-else-if="row.position === 1" type="info">首页弹窗</el-tag>
                <el-tag v-else type="danger">飘屏</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="平台" min-width="50">
              <template #default="{ row }">
                <el-tag v-if="row.platform !== ''" type="success">{{ row.platform }}</el-tag>
                <el-tag v-else type="danger">全部</el-tag>
              </template>
            </el-table-column>
            <el-table-column
                prop="title"
                label="标题"
                min-width="150"
                show-overflow-tooltip
            />
            <el-table-column label="图片" min-width="150">
              <template #default="{ row }">
                <el-avatar :src="row.image" size="large"/>
              </template>
            </el-table-column>
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
            <el-table-column label="时间" min-width="200">
              <template #default="{ row }">
                {{new Date(row.startTime).format('yyyy-MM-dd hh:mm:ss')}} 至
                {{new Date(row.endTime).format('yyyy-MM-dd hh:mm:ss')}}
              </template>
            </el-table-column>
            <el-table-column prop="createdAtStr" label="创建时间" min-width="180"/>
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button
                    v-perms="['app:notice:edit']"
                    link
                    type="primary"
                    @click="handleEdit(row)"
                >
                  编辑
                </el-button>
                <el-button
                    v-perms="['app:notice:del']"
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

<script lang="ts" setup name="notice">
import {noticeDelete, noticeLists} from '@/api/app/notice'
import {usePaging} from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const {pager, getLists} = usePaging({
  fetchFun: noticeLists,
  respKey: "appMgmtNotices"
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
  await noticeDelete({ids: [id]})
  feedback.msgSuccess('删除成功')
  getLists()
}

getLists()
</script>
