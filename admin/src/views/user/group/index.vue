<template>
  <div class="model-lists">
    <el-card class="!border-none" shadow="never">
      <div>
        <el-button v-perms="['user:group:add']" type="primary" @click="handleAdd">
          <template #icon>
            <icon name="el-icon-Plus"/>
          </template>
          新增
        </el-button>
      </div>
      <div class="mt-4">
        <div>
          <el-table :data="pager.lists" size="large" v-loading="pager.loading">
            <el-table-column label="头像" min-width="120">
              <template #default="{ row }">
                <el-avatar :src="row.avatar"/>
              </template>
            </el-table-column>
            <el-table-column label="id" min-width="120" prop="groupId"/>
            <el-table-column label="名称" min-width="120" prop="name"/>
            <el-table-column label="人数" min-width="120" prop="memberCount"/>
            <el-table-column label="加入时间" min-width="150" prop="joinTimeStr"/>
            <el-table-column label="创建时间" min-width="150" prop="createTimeStr"/>
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button
                    v-perms="['user:group:del']"
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
  </div>
</template>

<script lang="ts" setup name="group">
import {modelDelete} from '@/api/user/model'
import {usePaging} from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import {groupLists} from "@/api/user/group";

const router = useRouter();
const userId = router.currentRoute.value.query.id;
if (!userId) {
  // 退出该页面
  router.back();
}
const formData = reactive({
  userId: userId,
});
const {pager, getLists} = usePaging({
  fetchFun: groupLists,
  respKey: "groupList",
  params: formData,
})

// 删除角色
const handleDelete = async (id: string) => {
  await feedback.confirm('确定要删除？')
  await modelDelete({ids: [id]})
  feedback.msgSuccess('删除成功')
  getLists()
}

getLists()
</script>
