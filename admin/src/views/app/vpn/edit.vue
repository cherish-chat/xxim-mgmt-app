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
          <!-- options: IPSec http socks5 -->
          <el-select
              class="ls-input"
              v-model="formData.type"
              placeholder="请选择类型"
              clearable
          >
            <el-option key="ipsec" label="IPSec" value="ipsec"/>
            <el-option key="http" label="http" value="http"/>
            <el-option key="socks5" label="socks5" value="socks5"/>
          </el-select>
        </el-form-item>
        <el-form-item label="ip" prop="ip">
          <el-input
              class="ls-input"
              v-model="formData.ip"
              placeholder="请输入ip"
              clearable
          />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input-number
              v-model="formData.port"
              :min="0"
              :max="65535"
              :step="1"
              :precision="0"
              :controls="false"
              placeholder="请输入端口"
              clearable
          />
        </el-form-item>
        <el-form-item label="用户" prop="username">
          <el-input class="ls-input" v-model="formData.username" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input class="ls-input" v-model="formData.password" placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item label="密钥" prop="secretKey">
          <el-input class="ls-input" v-model="formData.secretKey" placeholder="请输入密钥"/>
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type {FormInstance} from 'element-plus'
import {vpnAdd, vpnDetail, vpnEdit} from '@/api/app/vpn'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'

const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
  return mode.value == 'edit' ? '编辑VPN' : '新增VPN'
})
const formData = reactive({
  id: '',
  name: '',
  platform: '',
  type: 'socks5',
  ip: '',
  port: 0,
  username: '',
  password: '',
  secretKey: '',
})

const rules = {
  vpn: [
    {
      required: true,
      message: '请输入VPN号',
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
  mode.value == 'edit' ? await vpnEdit(params) : await vpnAdd(params)
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
  let data = await vpnDetail({
    id: row.id
  })
  data = data.appMgmtVpn
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
