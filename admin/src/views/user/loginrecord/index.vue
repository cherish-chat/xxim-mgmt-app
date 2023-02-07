<template>
  <div class="loginrecord-lists">
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
                <el-tag type="success"> {{ row.ipCountry }} - {{ row.ipProvince }} - {{ row.ipCity }} - {{ row.ipISP }}</el-tag>
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

<script lang="ts" setup name="loginrecord">
import {loginrecordLists} from '@/api/user/loginrecord'
import {usePaging} from '@/hooks/usePaging'

const {pager, getLists} = usePaging({
  fetchFun: loginrecordLists,
  respKey: "loginRecordList"
})
getLists()
</script>
