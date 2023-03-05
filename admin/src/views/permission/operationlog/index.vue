<template>
  <div class="operationlog-lists">
    <el-card class="!border-none" shadow="never">
      <el-form class="mb-[-16px]" :model="formData" inline>
        <el-form-item label="类型">
          <el-select
              v-model="formData.operationType"
              clearable
          >
            <el-option label="全部" value=""/>
            <el-option label="增加" value="add"/>
            <el-option label="删除" value="delete"/>
            <el-option label="修改" value="update"/>
            <el-option label="其他" value="other"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否成功">
          <el-select
              v-model="formData.resultSuccess"
              clearable
          >
            <el-option label="全部" value=""/>
            <el-option label="成功" value="1"/>
            <el-option label="失败" value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="管理员">
          <el-input
              v-model="formData.operator"
              class="w-[280px]"
              clearable
              @keyup.enter="resetPage"
          />
        </el-form-item>
        <el-form-item label="标题">
          <el-input
              v-model="formData.operationTitle"
              class="w-[280px]"
              clearable
              @keyup.enter="resetPage"
          />
        </el-form-item>
        <el-form-item label="ip">
          <el-input
              v-model="formData.reqIp"
              class="w-[280px]"
              clearable
              @keyup.enter="resetPage"
          />
        </el-form-item>
        <!--createTime range-->
        <el-form-item label="请求时间">
          <el-date-picker
              v-model="formDataReqTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
              @change="setFormDataReqTime"
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
const formData = ref({
  id: '',
  operationType: '',
  operationTitle: '',
  resultSuccess: '',
  reqIp: '',
  operator: '',
  reqTime_gte: '',
  reqTime_lte: '',
})
const formDataReqTime = ref([])
const setFormDataReqTime = (val: any) => {
  formDataReqTime.value = val
  formData.value.reqTime_gte = (val[0] as Date).getTime().toString()
  formData.value.reqTime_lte = (val[1] as Date).getTime().toString()
}
const {pager, getLists, resetPage, resetParams} = usePaging({
  fetchFun: operationlogLists,
  respKey: "operationLogs",
  params: formData.value,
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
