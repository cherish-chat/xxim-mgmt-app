<template>
  <div class="connection-lists">
    <el-card class="!border-none" shadow="never">
      <el-form class="mb-[-16px]" :model="formData" inline>
        <el-form-item label="平台">
          <el-select
              v-model="formData.platform"
              clearable
          >
            <el-option label="全部" value=""/>
            <el-option label="苹果" value="ios"/>
            <el-option label="安卓" value="android"/>
            <el-option label="Mac" value="macos"/>
            <el-option label="Windows" value="windows"/>
            <el-option label="Linux" value="linux"/>
            <el-option label="Web" value="web"/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户id">
          <el-input
              v-model="formData.userId"
              class="w-[280px]"
              clearable
              @keyup.enter="resetPage"
          />
        </el-form-item>
        <el-form-item label="包id">
          <el-input
              v-model="formData.deviceId"
              class="w-[280px]"
              clearable
              @keyup.enter="resetPage"
          />
        </el-form-item>
        <el-form-item label="ip">
          <el-input
              v-model="formData.ip"
              class="w-[280px]"
              clearable
              @keyup.enter="resetPage"
          />
        </el-form-item>
        <!--createTime range-->
        <el-form-item label="连接时间">
          <el-date-picker
              v-model="formDataTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
              @change="setFormDataTime"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetPage">查询</el-button>
          <el-button @click="resetParams">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
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
const formData = ref({
  id: '',
  platform: '',
  deviceId: '',
  ip: '',
  userId: '',
  connectTimeGte: '',
  connectTimeLte: '',
})
const formDataTime = ref([])
const setFormDataTime = (val: any) => {
  formDataTime.value = val
  formData.value.connectTimeGte = (val[0] as Date).getTime().toString()
  formData.value.connectTimeLte = (val[1] as Date).getTime().toString()
}
const {pager, getLists, resetPage, resetParams} = usePaging({
  fetchFun: connectionLists,
  respKey: "connections",
  params: formData.value,
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
