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
        <el-form-item label="手机" prop="mobile">
          <el-input class="ls-input" v-model="formData.mobile" placeholder="请输入手机号码"/>
        </el-form-item>
        <el-form-item label="区号" prop="mobileCountryCode">
          <el-input class="ls-input" v-model="formData.mobileCountryCode" placeholder="请输入手机区号"/>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input class="ls-input" v-model="formData.nickname" placeholder="请输入昵称"/>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <div>
            <div>
              <material-picker v-model="formData.avatar" :limit="1"/>
            </div>
            <div class="form-tips">
              建议尺寸：100*100px，支持jpg，jpeg，png格式
            </div>
          </div>
        </el-form-item>
        <el-form-item label="性别" prop="xb">
          <!-- options: 0: 保密 1: 男 2:女 -->
          <el-select
              class="ls-input"
              v-model="formData.xb"
              placeholder="请选择性别"
              clearable
          >
            <el-option key="0" label="保密" :value="0"/>
            <el-option key="1" label="男" :value="1"/>
            <el-option key="2" label="女" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <!-- options: 0: 用户 1: 客服 2: 游客 -->
          <el-select
              class="ls-input"
              v-model="formData.role"
              placeholder="请选择角色"
              clearable
          >
            <el-option key="0" label="用户" :value="0"/>
            <el-option key="1" label="客服" :value="1"/>
            <el-option key="2" label="游客" :value="2"/>
            <el-option key="3" label="僵尸" :value="3"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="adminRemark">
          <el-input
              class="ls-input"
              v-model="formData.adminRemark"
              placeholder="请输入后台备注"
              clearable
          />
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
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type {FormInstance} from 'element-plus'
import {modelAdd, modelDetail, modelEdit} from '@/api/user/model'
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
  mobile: '',
  mobileCountryCode: '',
  nickname: '',
  avatar: '',
  xb: 0,
  role: 0,
  adminRemark: '',
  password: '',
})

const rules = {
  nickname: [
    {required: true, message: '请输入昵称', trigger: 'blur'},
  ],
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  const params = {...formData}
  mode.value == 'edit' ? await modelEdit(params) : await modelAdd(params)
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
  let data = await modelDetail({
    id: row.id
  })
  data = data.userModel
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
