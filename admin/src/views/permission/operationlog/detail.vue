<template>
  <div class="edit-popup">
    <popup
        ref="popupRef"
        title="操作详情"
        :async="true"
        width="550px"
        @confirm="handleSubmit"
        @close="handleClose"
    >
      <!--{
            "id":"1562dc549a72000a2dabc63229c7618a",
            "reqTime":1675492249298,
            "reqTimeStr":"2023-02-04 14:30:49.298",
            "respTime":1675492249315,
            "respTimeStr":"2023-02-04 14:30:49.315",
            "operationType":"add",
            "operationTitle":"管理员:添加",
            "reqPath":"/api/ms/add/admin",
            "reqParams":"{\"user\":{\"id\":\"\",\"username\":\"test6\",\"nickname\":\"test6\",\"deptId\":\"\",\"postId\":\"\",\"role\":\"1\",\"avatar\":\"\",\"password\":\"1234567\",\"passwordConfirm\":\"1234567\",\"isDisable\":false,\"isMultipoint\":1,\"sort\":1}}",
            "resultSuccess":false,
            "reqResultMsg":"请求失败code:500",
            "resp":"",
            "reqIp":"[::1]:62635",
            "ipSource":"||||",
            "reqCost":17,
            "operator":"superadmin"
            }-->
      <div>
        <el-form ref="formRef" :model="form" label-width="100px">
          <el-form-item label="操作人">
            <el-tag v-if="form.operator === ''"> 未登录</el-tag>
            <el-tag v-else> {{ form.operator }}</el-tag>
            <el-tag> {{ form.reqIp }}</el-tag>
          </el-form-item>
          <el-form-item label="操作类型">
            <el-tag v-if="form.operationType === 'add'" type="success"> 新增</el-tag>
            <el-tag v-else-if="form.operationType === 'update'" type="warning"> 修改</el-tag>
            <el-tag v-else-if="form.operationType === 'delete'" type="danger"> 删除</el-tag>
            <el-tag v-else> 其他</el-tag>
          </el-form-item>
          <el-form-item label="标题">
            {{ form.operationTitle }}
          </el-form-item>
          <el-form-item label="是否成功">
            <el-tag v-if="form.resultSuccess" type="success"> 成功</el-tag>
            <el-tag v-else type="danger"> {{ form.reqResultMsg }}</el-tag>
          </el-form-item>
          <el-form-item label="ip">
            {{ form.ipSource }}
          </el-form-item>
          <el-form-item label="记录日志">
            {{ form.logEnable ? '是' : '否' }}
          </el-form-item>
          <el-form-item label="请求时间">
            {{ form.reqTimeStr }}
          </el-form-item>
          <el-form-item label="响应时间">
            {{ form.respTimeStr }}
          </el-form-item>
          <el-form-item label="请求参数">
            <el-input
                type="textarea"
                :rows="5"
                :value="form.reqParams"
                readonly
            />
          </el-form-item>
          <el-form-item label="响应结果">
            <el-input
                type="textarea"
                :rows="5"
                :value="form.resp"
                readonly
            />
          </el-form-item>
        </el-form>
      </div>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type {FormInstance} from 'element-plus'
import {operationlogDetail} from '@/api/perms/operationlog'
import Popup from '@/components/popup/index.vue'

const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()

const handleClose = () => {
  emit('close')
}

const open = () => {
  popupRef.value?.open()
}

interface OperationLog {
  id: string
  reqTime: number
  reqTimeStr: string
  respTime: number
  respTimeStr: string
  operationType: string
  operationTitle: string
  reqPath: string
  reqParams: string
  resultSuccess: boolean
  reqResultMsg: string
  resp: string
  reqIp: string
  ipSource: string
  reqCost: number
  operator: string
}

const defaultOperationLog = {
  id: '',
  reqTime: 0,
  reqTimeStr: '',
  respTime: 0,
  respTimeStr: '',
  operationType: '',
  operationTitle: '',
  reqPath: '',
  reqParams: '',
  resultSuccess: false,
  reqResultMsg: '',
  resp: '',
  reqIp: '',
  ipSource: '',
  reqCost: 0,
  operator: ''
} as OperationLog
const form = ref<OperationLog>(defaultOperationLog)

const setFormData = async (row: Record<any, any>) => {
  let data = await operationlogDetail({
    id: row.id
  })
  try {
    data.operationLog.reqParams = JSON.stringify(JSON.parse(data.operationLog.reqParams), null, 2)
  } catch (e) {
  }
  try {
    data.operationLog.resp = JSON.stringify(JSON.parse(data.operationLog.resp), null, 2)
  } catch (e) {
  }
  form.value = data.operationLog
}

defineExpose({
  open,
  setFormData
})
</script>
