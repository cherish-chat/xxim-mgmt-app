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
        <el-form-item label="版本" prop="version">
          <el-input
              class="ls-input"
              v-model="formData.version"
              placeholder="请输入版本号"
              clearable
          />
        </el-form-item>
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
        <el-form-item label="类型" prop="type">
          <!-- options: 0: 不提示 1: 提示 2: 强制 -->
          <el-select
              class="ls-input"
              v-model="formData.type"
              placeholder="请选择更新平台"
              clearable
          >
            <el-option key="0" label="不提示" :value="0"/>
            <el-option key="1" label="提示" :value="1"/>
            <el-option key="2" label="强制" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="formData.content" placeholder="请输入更新内容"/>
        </el-form-item>
        <el-form-item label="地址" prop="downloadUrl">
          <el-input
              class="ls-input"
              v-model="formData.downloadUrl"
              placeholder="请输入下载地址"
              clearable
          />
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type {FormInstance} from 'element-plus'
import {versionAdd, versionDetail, versionEdit} from '@/api/app/version'
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
  version: '',
  platform: '',
  type: 0,
  content: '',
  downloadUrl: '',
})

const rules = {
  version: [
    {
      required: true,
      message: '请输入版本号',
      trigger: ['blur']
    }
  ],
  content: [
    {
      required: true,
      message: '请输入更新内容',
      trigger: ['blur']
    }
  ],
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  const params = {...formData}
  mode.value == 'edit' ? await versionEdit(params) : await versionAdd(params)
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
  let data = await versionDetail({
    id: row.id
  })
  data = data.appMgmtVersion
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
