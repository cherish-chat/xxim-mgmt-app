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
        <el-form-item label="名称" prop="name">
          <el-input
              class="ls-input"
              v-model="formData.name"
              placeholder="请输入名称"
              clearable
          />
        </el-form-item>
        <el-form-item label="链接" prop="url">
          <el-input
              class="ls-input"
              v-model="formData.url"
              placeholder="请输入链接"
              clearable
          />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <div>
            <div>
              <material-picker v-model="formData.icon" :limit="1"/>
            </div>
            <div class="form-tips">
              建议尺寸：100*100px，支持jpg，jpeg，png格式
            </div>
          </div>
        </el-form-item>
        <el-form-item label="启用" prop="isEnable">
          <el-select v-model="formData.isEnable">
            <el-option label="启用" :value="true"/>
            <el-option label="禁用" :value="false"/>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
              v-model="formData.sort"
              :min="0"
              :max="65535"
              :step="1"
              :precision="0"
              :controls="false"
              placeholder="请输入排序"
              clearable
          />
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type {FormInstance} from 'element-plus'
import {linkAdd, linkDetail, linkEdit} from '@/api/app/link'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'

const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
  return mode.value == 'edit' ? '编辑外链' : '新增外链'
})
const formData = reactive({
  id: '',
  name: '',
  url: '',
  icon: '',
  sort: 0,
  isEnable: true
})

const rules = {
  name: [
    {
      required: true,
      message: '请输入名称',
      trigger: ['blur']
    }
  ],
  url: [
    {
      required: true,
      message: '请输入链接',
      trigger: ['blur']
    }
  ],
  icon: [
    {
      required: true,
      message: '请输入图标',
      trigger: ['blur']
    }
  ],
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  const params = {...formData}
  mode.value == 'edit' ? await linkEdit(params) : await linkAdd(params)
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
  let data = await linkDetail({
    id: row.id
  })
  data = data.appMgmtLink
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
