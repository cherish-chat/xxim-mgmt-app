<template>
  <div class="connection-lists">
    <el-card class="!border-none" shadow="never">
      <div class="mt-4">
        <div>
          <el-table :data="pager.lists" size="large" v-loading="pager.loading">
            <el-table-column prop="userId" label="用户" min-width="100"/>
            <el-table-column prop="deviceId" label="设备" min-width="150"/>
            <el-table-column label="平台" min-width="150">
              <template #default="{ row }">
                <el-tag type="success">{{ row.platform }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="ip" min-width="150">
              <template #default="{ row }">
                <el-tag type="success"> {{ row.ip }}</el-tag>
                <el-tag type="warning"> {{ row.ipRegion }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="podIp" label="podIp" min-width="180"/>
            <el-table-column prop="connectTimeStr" label="连接时间" min-width="180"/>
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button
                    v-perms="['app:connection:del']"
                    link
                    type="danger"
                    @click="handleDelete(row)"
                >
                  断开连接
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

<script lang="ts" setup name="connection">
import {connectionDelete, connectionLists} from '@/api/app/connection'
import {usePaging} from '@/hooks/usePaging'
import feedback from '@/utils/feedback'

const {pager, getLists} = usePaging({
  fetchFun: connectionLists,
  respKey: "connections"
})

// 删除角色
const handleDelete = async (row: any) => {
  await feedback.confirm('确定要断开？')
  await connectionDelete({
    userId: row.userId,
    deviceId: row.deviceId,
    platform: row.platform
  })
  feedback.msgSuccess('提出成功')
  getLists()
}

getLists()
</script>
