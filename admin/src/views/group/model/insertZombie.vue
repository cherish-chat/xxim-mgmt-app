<template>
  <div class="insert-zombie-popup">
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
        <el-form-item label="数量" prop="nickname">
          <el-input-number class="ls-input" v-model="formData.count" placeholder="请输入生成数量" :min="1" :max="1000"
                           :step="10"/>
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type {FormInstance} from 'element-plus'
import {modelBatchInsertZombie} from '@/api/group/model'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'
import {modelDetail} from "@/api/group/model";

const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
  return mode.value == '添加僵尸号'
})
const formData = reactive({
  groupId: '',
  count: 1,
})

const rules = {}

const handleSubmit = async () => {
  await formRef.value?.validate()
  const params = {...formData}
  await modelBatchInsertZombie(params)
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
  formData.groupId = row.id
}

defineExpose({
  open,
  setFormData
})
</script>
