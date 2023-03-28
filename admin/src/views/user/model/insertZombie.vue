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
        <el-form-item label="id" prop="idPrefix">
          <el-input class="ls-input" v-model="formData.idPrefix" placeholder="请输入id前缀"/>
        </el-form-item>
        <!--密码 空表示不修改-->
        <el-form-item label="密码" prop="password">
          <el-input
              class="ls-input"
              v-model="formData.password"
              placeholder="请输入密码, 留空表示不修改"
              clearable
          />
        </el-form-item>
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
import {modelBatchInsertZombie} from '@/api/user/model'
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
  idPrefix: '',
  password: '',
  count: 1,
})

const rules = {
  idPrefix: [
    {required: true, message: '请输入ID前缀', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
  ],
}

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

const open = (type = 'add') => {
  mode.value = type
  popupRef.value?.open()
}

defineExpose({
  open,
})
</script>
