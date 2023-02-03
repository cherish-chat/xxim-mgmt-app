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
        <el-form-item label="标题" prop="name">
          <el-input
              class="ls-input"
              v-model="formData.title"
              placeholder="请输入标题"
              clearable
          />
        </el-form-item>
        <el-form-item label="路径" prop="remark">
          <el-input
              v-model="formData.path"
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 68 }"
              placeholder="请输入路径"
              maxlength="200"
              show-word-limit
          />
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type {FormInstance} from 'element-plus'
import {apipathAdd, apipathDetail, apipathEdit} from '@/api/perms/apipath'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'

const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
  return mode.value == 'edit' ? '编辑角色' : '新增角色'
})
const formData = reactive({
  id: '',
  title: '',
  path: '',
})

const rules = {
  title: [
    {
      required: true,
      message: '请输入标题',
      trigger: ['blur']
    }
  ],
  path: [
    {
      required: true,
      message: '请输入路径',
      trigger: ['blur']
    }
  ],
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  const params = {...formData}
  mode.value == 'edit' ? await apipathEdit(params) : await apipathAdd(params)
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
  let data = await apipathDetail({
    id: row.id
  })
  data = data.apiPath
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
