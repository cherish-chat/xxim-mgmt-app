<template>
  <div class="model-lists">
    <el-card class="!border-none" shadow="never">
      <div>
        <el-button v-perms="['user:friend:add']" type="primary" @click="handleAdd">
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
            <el-table-column label="id" min-width="120" prop="userId"/>
            <el-table-column label="昵称" min-width="120" prop="nickname"/>
            <el-table-column label="角色" min-width="120" prop="role"/>
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button
                    v-perms="['msg:msg:list']"
                    link
                    type="primary"
                    @click="handleMsg(row.userId)"
                >
                  聊天记录
                </el-button>
                <el-button
                    v-perms="['user:friend:del']"
                    link
                    type="danger"
                    @click="handleDelete(row.userId)"
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

<script lang="ts" setup name="friend">
import {usePaging} from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import {friendDelete, friendLists} from "@/api/user/friend";
import {getUserId} from "@/utils/auth";

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
  fetchFun: friendLists,
  respKey: "friendList",
  params: formData,
})

// 删除角色
const handleDelete = async (id: string) => {
  await feedback.confirm('确定要删除？')
  await friendDelete({friendId: id, userId: userId})
  feedback.msgSuccess('删除成功')
  getLists()
}
const getConvId = (friendId: string) => {
  let convId = userId + '-' + friendId;
  if (userId! > friendId) {
    convId = friendId + '-' + userId;
  }
  return 'single:' + convId;
}
const handleMsg = async (id: string) => {
  await router.push({path: '/msg/convmsgs', query: {id: getConvId(id)}})
}
getLists()
</script>
