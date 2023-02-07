<template>
  <div class="edit-popup">
    <popup
        ref="popupRef"
        :title="popupTitle"
        :async="true"
        width="550px"
        @confirm="handleSubmit"
        @close="handleClose"
    >
      <el-form
          class="ls-form"
          ref="formRef"
          :rules="rules"
          :model="formData"
          label-width="60px"
      >
        <el-form-item label="平台" prop="platform">
          <!-- options: 全部, 安卓, IOS, Windows, Mac, Linux -->
          <el-select
              class="ls-input"
              v-model="formData.platform"
              placeholder="请选择更新平台"
              clearable
          >
            <el-option key="" label="全部" value=""/>
            <el-option key="android" label="安卓" value="android"/>
            <el-option key="ios" label="IOS" value="ios"/>
            <el-option key="windows" label="Windows" value="windows"/>
            <el-option key="mac" label="Mac" value="mac"/>
            <el-option key="linux" label="Linux" value="linux"/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户" prop="userId">
          <el-input
              class="ls-input"
              v-model="formData.userId"
              placeholder="作用用户 空表示所有用户"
              clearable
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
              class="ls-input"
              v-model="formData.remark"
              placeholder="请输入标题"
              clearable
          />
        </el-form-item>
        <el-form-item label="开始" prop="startIp">
          <el-input
              class="ls-input"
              v-model="formData.startIp"
              placeholder="请输入开始ip"
              clearable
          />
        </el-form-item>
        <el-form-item label="结束" prop="endIp">
          <el-input
              class="ls-input"
              v-model="formData.endIp"
              placeholder="请输入结束ip"
              clearable
          />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch
              v-model="formData.isEnable"
              :active-value="true"
              :inactive-value="false"
          />
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type {FormInstance} from 'element-plus'
import {ipblacklistAdd, ipblacklistDetail, ipblacklistEdit} from '@/api/user/ipblacklist'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'

const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
  return mode.value == 'edit' ? '编辑版本' : '新增版本'
})
const formData = reactive({
  id: '',
  platform: '',
  remark: '',
  userId: '',
  startIp: '',
  endIp: '',
  isEnable: true,
})

const rules = {
  remark: [
    {
      required: true,
      message: '请输入备注',
      trigger: ['blur']
    }
  ],
  startIp: [
    {
      required: true,
      message: '请输入开始ip',
      trigger: ['blur']
    }
  ],
  endIp: [
    {
      required: true,
      message: '请输入结束ip',
      trigger: ['blur']
    }
  ],
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  const params = {...formData}
  mode.value == 'edit' ? await ipblacklistEdit(params) : await ipblacklistAdd(params)
  popupRef.value?.close()
  feedback.msgSuccess('操作成功')
  emit('success')
}

const handleClose = () => {
  emit('close')
}

const open = (type = 'add') => {
  mode.value = type
  popupRef.value?.open()
}

const setFormData = async (row: Record<any, any>) => {
  let data = await ipblacklistDetail({
    id: row.id
  })
  data = data.userIpList
  for (const key in formData) {
    if (data[key] != null && data[key] != undefined) {
      //@ts-ignore
      formData[key] = data[key]
    }
  }
}

defineExpose({
  open,
  setFormData
})
</script>
