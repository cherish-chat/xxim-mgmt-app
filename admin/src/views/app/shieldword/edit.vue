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
        <el-form-item label="词语" prop="word">
          <el-input
              v-if="mode==='add'"
              class="ls-input"
              type="textarea"
              :rows="20"
              autosize
              v-model="formData.word"
              placeholder="请输入屏蔽词 回车输入多个"
              clearable
          />
          <el-input
              v-else
              class="el-input"
              v-model="formData.word"
              placeholder="请输入屏蔽词"
              clearable
          />
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type {FormInstance} from 'element-plus'
import {shieldwordAdd, shieldwordDetail, shieldwordEdit} from '@/api/app/shieldword'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'

const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
  return mode.value == 'edit' ? '编辑屏蔽词' : '新增屏蔽词'
})
const formData = reactive({
  id: '',
  word: '',
})

const rules = {
  word: [
    {
      required: true,
      message: '请输入屏蔽词号',
      trigger: ['blur']
    }
  ],
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  const params = {...formData}
  mode.value == 'edit' ? await shieldwordEdit(params) : await shieldwordAdd(params)
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
  let data = await shieldwordDetail({
    id: row.id
  })
  data = data.appMgmtShieldWord
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
