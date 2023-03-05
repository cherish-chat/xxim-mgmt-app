<template>
  <div class="loginlog-lists">
    <el-card class="!border-none" shadow="never">
      <el-form class="mb-[-16px]" :model="formData" inline>
        <el-form-item label="管理员">
          <el-input
              v-model="formData.userId"
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
        <el-form-item label="请求时间">
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
            <el-table-column label="操作人" min-width="150">
              <template #default="{ row }">
                <el-tag> {{ row.userId }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="ip" min-width="150">
              <template #default="{ row }">
                <el-tag type="info"> {{ row.ip }}</el-tag>
                <el-tag type="success"> {{ row.ipCountry }} - {{ row.ipProvince }} - {{ row.ipCity }} - {{
                    row.ipISP
                  }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
                label="标识"
                min-width="150"
                prop="userAgent"
                show-overflow-tooltip
            />
            <el-table-column prop="timeStr" label="请求时间" min-width="180"/>
          </el-table>
        </div>
        <div class="flex justify-end mt-4">
          <pagination v-model="pager" @change="getLists"/>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup name="loginlog">
import {loginlogLists} from '@/api/perms/loginlog'
import {usePaging} from '@/hooks/usePaging'

const formData = ref({
  id: '',
  userId: '',
  ip: '',
  time_gte: '',
  time_lte: '',
})
const formDataTime = ref([])
const setFormDataTime = (val: any) => {
  formDataTime.value = val
  formData.value.time_gte = (val[0] as Date).getTime().toString()
  formData.value.time_lte = (val[1] as Date).getTime().toString()
}
const {pager, getLists, resetParams, resetPage} = usePaging({
  fetchFun: loginlogLists,
  respKey: "loginRecords",
  params: formData.value,
})

getLists()
</script>
