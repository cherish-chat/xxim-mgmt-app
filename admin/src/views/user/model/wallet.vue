<template>
  <div class="wallet-popup">
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
          :model="formData"
          label-width="60px"
      >
        <el-form-item label="id" prop="id">
          <el-input class="ls-input" v-model="wallet.userId" disabled/>
        </el-form-item>
        <el-form-item label="余额" prop="balance">
          <el-input-number class="ls-input" v-model="wallet.balance" disabled/>
        </el-form-item>
        <el-form-item label="冻结" prop="frozenBalance">
          <el-input-number class="ls-input" v-model="wallet.freezeBalance" disabled/>
        </el-form-item>
        <el-form-item label="充值" prop="recharge">
          <el-input-number class="ls-input" v-model="formData.amount"/>
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type {FormInstance} from 'element-plus'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'
import {rechargeWallet, walletDetail} from "@/api/user/wallet";

const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const popupTitle = computed(() => {
  return "编辑钱包"
})
const wallet = ref({
  userId: '',
  balance: 0,
  freezeBalance: 0,
})
const formData = ref({
  amount: 0,
})

const handleSubmit = async () =>{
  if (formData.value.amount == 0 ) {
    feedback.msgError('请输入充值金额')
    return
  }
  await rechargeWallet(wallet.value.userId, formData.value.amount)
  popupRef.value?.close()
  feedback.msgSuccess('操作成功')
  emit('success')
}

const handleClose = () => {
  emit('close')
}

const open = (data: any) => {
  // 请求数据
  walletDetail(data.id).then(res => {
    wallet.value.userId = res.userWallet.userId
    wallet.value.balance = res.userWallet.balance
    wallet.value.freezeBalance = res.userWallet.freezeBalance
    popupRef.value?.open()
  }).catch(err => {
    console.error(err)
    feedback.msgError(err)
  })
}


defineExpose({
  open,
})
</script>
