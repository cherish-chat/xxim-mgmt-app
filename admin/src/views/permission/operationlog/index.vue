<template>
  <div class="operationlog-lists">
    <el-card class="!border-none" shadow="never">
      <div class="mt-4">
        <div>
          <el-table :data="pager.lists" size="large" v-loading="pager.loading">
            <el-table-column label="操作人" min-width="150">
              <template #default="{ row }">
                <el-tag v-if="row.operator&&row.operator!=='null'"> {{ row.operator }}</el-tag>
                <el-tag> {{ row.reqIp }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作类型" min-width="150">
              <template #default="{ row }">
                <el-tag v-if="row.operationType === 'add'" type="success"> 新增</el-tag>
                <el-tag v-else-if="row.operationType === 'update'" type="warning"> 修改</el-tag>
                <el-tag v-else-if="row.operationType === 'delete'" type="danger"> 删除</el-tag>
                <el-tag v-else> 其他</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="operationTitle" label="标题" min-width="150"/>
            <el-table-column label="是否成功" min-width="150">
              <template #default="{ row }">
                <el-tag v-if="row.resultSuccess" type="success"> 成功</el-tag>
                <el-tag v-else type="danger"> {{ row.reqResultMsg }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
                label="ip"
                min-width="150"
                prop="ipSource"
                show-overflow-tooltip
            />
            <el-table-column label="记录日志" min-width="180">
              <template #default="{ row }">
                {{ row.logEnable ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column prop="reqTimeStr" label="请求时间" min-width="180"/>
            <el-table-column prop="respTimeStr" label="响应时间" min-width="180"/>
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button
                    v-perms="['system:operationlog:detail']"
                    link
                    type="primary"
                    @click="handleDetail(row)"
                >
                  详情
                </el-button>
                <el-button
                    v-perms="['system:operationlog:del']"
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
    <detail-popup v-if="showDetail" ref="detailRef" @close="showDetail = false"/>
  </div>
</template>

<script lang="ts" setup name="operationlog">
import {operationlogDelete, operationlogLists} from '@/api/perms/operationlog'
import {usePaging} from '@/hooks/usePaging'
import DetailPopup from "./detail.vue";
import feedback from "@/utils/feedback";

const {pager, getLists} = usePaging({
  fetchFun: operationlogLists,
  respKey: "operationLogs"
})
const showDetail = ref(false)
const detailRef = shallowRef<InstanceType<typeof DetailPopup>>()

const handleDetail = async (data: any) => {
  showDetail.value = true
  await nextTick()
  detailRef.value?.open()
  detailRef.value?.setFormData(data)
}

// 删除角色
const handleDelete = async (id: string) => {
  await feedback.confirm('确定要删除？')
  await operationlogDelete({ids:[id]})
  feedback.msgSuccess('删除成功')
  getLists()
}
getLists()
</script>
