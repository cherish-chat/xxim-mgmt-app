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
        <el-form-item label="类型" prop="convType">
          <!-- options: 0:好友 1:群聊 -->
          <el-select
              class="ls-input"
              v-model="formData.convType"
              placeholder="请选择类型"
              clearable
          >
            <el-option key="0" label="好友" :value="0"/>
            <el-option key="1" label="群聊" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="过滤" prop="filterType">
          <!-- options: 0: 所有注册用户 1: 使用邀请码注册的用户 -->
          <el-select
              class="ls-input"
              v-model="formData.filterType"
              placeholder="请选择过滤类型"
              clearable
          >
            <el-option key="0" label="所有注册用户" :value="0"/>
            <el-option key="1" label="使用邀请码注册的用户" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="code" prop="invitationCode">
          <el-input
              class="ls-input"
              v-model="formData.invitationCode"
              placeholder="请输入邀请码"
              clearable
          />
        </el-form-item>
        <el-form-item label="会话" prop="convId">
          <el-input
              class="ls-input"
              v-model="formData.convId"
              placeholder="请输入好友/群聊id"
              clearable
          />
        </el-form-item>
        <el-form-item label="招呼" prop="textMsg" v-if="formData.convType===0">
          <el-input
              type="textarea"
              class="ls-input"
              v-model="formData.textMsg"
              placeholder="请输入打招呼的内容"
              clearable
          />
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type {FormInstance} from 'element-plus'
import {defaultconvAdd, defaultconvDetail, defaultconvEdit} from '@/api/user/defaultconv'
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
  convType: null,
  filterType: null,
  invitationCode: '',
  convId: '',
  textMsg: '',
})

const rules = {
  convType: [
    {
      required: true,
      message: '请选择类型',
      trigger: 'change',
    },
  ],
  filterType: [
    {
      required: true,
      message: '请选择过滤类型',
      trigger: 'change',
    },
  ],
  convId: [
    {
      required: true,
      message: '请输入会话id',
      trigger: 'blur',
    },
  ],
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  const params = {...formData}
  mode.value == 'edit' ? await defaultconvEdit(params) : await defaultconvAdd(params)
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
  let data = await defaultconvDetail({
    id: row.id
  })
  data = data.userDefaultConv
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
