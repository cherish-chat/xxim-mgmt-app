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
        <el-form-item label="标题" prop="title">
          <el-input class="ls-input" v-model="formData.title" placeholder="请输入标题" clearable/>
        </el-form-item>
        <el-form-item label="图标" prop="coverUrl">
          <div>
            <div>
              <material-picker v-model="formData.coverUrl" :limit="1"/>
            </div>
            <div class="form-tips">
              建议尺寸：200*200px，支持jpg，jpeg，png格式
            </div>
          </div>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="formData.content" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
              class="ls-input"
              v-model="formData.sort"
              :min="0"
              :max="100"
              :step="1"
              placeholder="请输入排序"
          />
        </el-form-item>
        <el-form-item label="启用" prop="isEnable">
          <el-switch
              v-model="formData.isEnable"
              active-color="#13ce66"
              inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item label="类型" prop="contentType">
          <el-select v-model="formData.contentType">
            <el-option label="html" value="text/html"/>
          </el-select>
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type {FormInstance} from 'element-plus'
import {richarticleAdd, richarticleDetail, richarticleEdit} from '@/api/app/richarticle'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'

const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
  return mode.value == 'edit' ? '编辑富文章' : '新增富文章'
})
const formData = reactive({
  id: '',
  contentType: 'text/html',
  title: '',
  coverUrl: '',
  content: '',
  sort: 0,
  isEnable: true,
})

const rules = {
  content: [
    {
      required: true,
      message: '请输入内容',
      trigger: ['blur']
    }
  ],
  title: [
    {
      required: true,
      message: '请输入标题',
      trigger: ['blur']
    }
  ],
  coverUrl: [
    {
      required: true,
      message: '请上传封面图',
      trigger: ['blur']
    }
  ],
  contentType: [
    {
      required: true,
      message: '请选择类型',
      trigger: ['blur']
    }
  ],
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  mode.value == 'edit' ? await richarticleEdit(formData) : await richarticleAdd(formData)
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
  let data = await richarticleDetail({
    id: row.id
  })
  data = data.appMgmtRichArticle
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
