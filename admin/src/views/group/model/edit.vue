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
        <el-form-item label="id" prop="id">
          <el-input class="ls-input" v-model="formData.id" placeholder="请输入id" :disabled="mode==='edit'"/>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input class="ls-input" v-model="formData.name" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-input class="ls-input" v-model="formData.avatar" placeholder="请输入头像"/>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" class="ls-input" v-model="formData.description" placeholder="请输入描述"/>
        </el-form-item>
        <el-form-item label="禁言" prop="allMute">
          <el-select v-model="formData.allMute" placeholder="请选择禁言">
            <el-option key="0" label="取消禁言" :value="false"/>
            <el-option key="1" label="全员禁言" :value="true"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="adminRemark">
          <el-input class="ls-input" v-model="formData.adminRemark" placeholder="请输入后台的备注"/>
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type {FormInstance} from 'element-plus'
import {modelAdd, modelDetail, modelEdit} from '@/api/group/model'
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
  name: '',
  avatar: '',
  description: '',
  allMute: false,
  adminRemark: '',
})

const rules = {
  name: [
    {required: true, message: '请输入名称', trigger: 'blur'},
  ],
  avatar: [
    {required: true, message: '请输入头像', trigger: 'blur'},
  ],
  description: [
    {required: true, message: '请输入描述', trigger: 'blur'},
  ],
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  const params = {...formData}
  await modelEdit(params)
  popupRef.value?.close()
  feedback.msgSuccess('操作成功')
  emit('success')
}

const handleClose = () => {
  emit('close')
}

const open = (type = 'edit') => {
  mode.value = type
  popupRef.value?.open()
}

const setFormData = async (row: Record<any, any>) => {
  let data = await modelDetail({
    id: row.id
  })
  data = data.groupModel
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
