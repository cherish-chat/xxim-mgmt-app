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
        <el-form-item label="类型" prop="type">
          <el-select
              v-model="formData.type"
              clearable
          >
            <el-option label="生成僵尸号信息" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
              class="ls-input"
              v-model="formData.name"
              placeholder="请输入标题"
              clearable
          />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input
              type="textarea"
              class="ls-input"
              v-model="formData.desc"
              placeholder="请输入描述"
              clearable
          />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch
              v-model="formData.enable"
              :active-value="true"
              :inactive-value="false"
          />
        </el-form-item>
        <el-form-item label="代码">
          <VueCodemirror
              v-model="formData.code"
              placeholder="编写代码..."
              :style="{ height: '400px', width: '100%' }"
              :autofocus="true"
              :indent-with-tab="true"
              :tab-size="2"
              :extensions="codeExtensions"
          />
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type {FormInstance} from 'element-plus'
import {luaconfigAdd, luaconfigDetail, luaconfigEdit} from '@/api/perms/luaconfig'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'
import {javascript} from "@codemirror/lang-javascript";

const codeExtensions = [
  // lua
  javascript(),
]
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
  return mode.value == 'edit' ? '编辑脚本' : '新增脚本'
})
const formData = reactive({
  id: '',
  name: '',
  desc: '',
  enable: true,
  type: 1,
  code: ''
})

const rules = {
  name: [
    {
      required: true,
      message: '请输入名称',
      trigger: ['blur']
    }
  ],
  type: [
    {
      required: true,
      message: '请选择类型',
      trigger: ['blur']
    }
  ]
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  const params = {...formData}
  mode.value == 'edit' ? await luaconfigEdit(params) : await luaconfigAdd(params)
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
  let data = await luaconfigDetail({
    id: row.id
  })
  data = data.luaConfig
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
