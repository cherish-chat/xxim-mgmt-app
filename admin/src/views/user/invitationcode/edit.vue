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
        <el-form-item label="code" prop="code">
          <el-input
              class="ls-input"
              v-model="formData.code"
              placeholder="请输入邀请码"
              clearable
              :disabled="mode==='edit'"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
              type="textarea"
              class="ls-input"
              v-model="formData.remark"
              placeholder="请输入备注"
              clearable
          />
        </el-form-item>
        <el-form-item label="开启" prop="isEnable">
          <!-- options -->
          <el-select
              class="ls-input"
              v-model="formData.isEnable"
              placeholder="请选择是否开启"
              clearable
          >
            <el-option key="1" label="开启" :value="true"/>
            <el-option key="0" label="关闭" :value="false"/>
          </el-select>
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type {FormInstance} from 'element-plus'
import {invitationcodeAdd, invitationcodeDetail, invitationcodeEdit} from '@/api/user/invitationcode'
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
  code: '',
  remark: '',
  isEnable: true,
})

const rules = {
  code: [
    {
      required: true,
      message: '请输入邀请码',
      trigger: 'change',
    },
  ],
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  const params = {...formData}
  mode.value == 'edit' ? await invitationcodeEdit(params) : await invitationcodeAdd(params)
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
  let data = await invitationcodeDetail({
    code: row.code
  })
  data = data.userInvitationCode
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
