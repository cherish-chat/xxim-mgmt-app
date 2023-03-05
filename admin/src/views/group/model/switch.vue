<template>
  <div class="edit-popup">
    <popup
        ref="popupRef"
        :title="disable ? '启用用户' : '禁用用户'"
        :async="true"
        width="550px"
        @confirm="handleSubmit"
        @close="handleClose"
    >
      <el-form
          class="ls-form"
          ref="formRef"
          :model="formData"
          label-width="60px"
      >
        <el-form-item label="id" prop="id">
          <el-input class="ls-input" v-model="formData.id" disabled/>
        </el-form-item>
        <el-form-item label="解封" prop="unblockTime" v-if="!disable">
          <el-date-picker
              v-model="formData.unblockTime"
              type="datetime"
              placeholder="选择解封时间"
          />
        </el-form-item>
        <el-form-item label="ip" prop="disableIp" v-if="!disable">
          <el-select v-model="formData.disableIp" placeholder="是否禁用上次登录ip">
            <el-option key="0" label="不禁用" :value="false"/>
            <el-option key="1" label="禁用" :value="true"/>
          </el-select>
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type {FormInstance} from 'element-plus'
import {modelDetail, modelSwitch} from '@/api/group/model'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'

const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()

const disable = ref(false)
const formData = reactive({
  id: '',
  unblockTime: new Date(),
  disableIp: false,
})


const handleSubmit = async () => {
  await formRef.value?.validate()
  let params = {
    id: formData.id,
    unblockTime: 0,
    disableIp: false,
  }
  if (!disable.value) {
    // 禁用
    params.unblockTime = formData.unblockTime.getTime();
    params.disableIp = formData.disableIp
  }
  await modelSwitch(params)
  popupRef.value?.close()
  feedback.msgSuccess('操作成功')
  emit('success')
}

const handleClose = () => {
  emit('close')
}

const open = () => {
  popupRef.value?.open()
}

const setFormData = async (row: Record<any, any>) => {
  let data = await modelDetail({
    id: row.id
  })
  data = data.groupModel
  disable.value = data.unblockTime > 0
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
