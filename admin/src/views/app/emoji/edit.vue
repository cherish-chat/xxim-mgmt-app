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
        <el-form-item label="分组" prop="group">
          <el-select v-model="formData.group" placeholder="请选择分组" filterable remote remote-show-suffix
                     :remote-method="loadAllEmojiGroup" :loading="loading" reserve-keyword :disabled="mode==='edit'">
            <el-option
                v-for="item in groupOptions"
                :key="item.name"
                :label="item.name"
                :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <!-- options: lottie, image -->
          <el-select
              class="ls-input"
              v-model="formData.type"
              placeholder="请选择表情类型"
              clearable
          >
            <el-option key="lottie" label="lottie" value="lottie"/>
            <el-option key="image" label="image" value="image"/>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="content">
          <el-input class="ls-input" v-model="formData.name" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="静图" prop="staticUrl">
          <div>
            <div>
              <material-picker v-model="formData.staticUrl" :limit="1"/>
            </div>
            <div class="form-tips">
              建议尺寸：100*100px，支持jpg，jpeg，png格式
            </div>
          </div>
        </el-form-item>
        <el-form-item label="动图" prop="dynamicUrl">
          <el-input class="ls-input" v-model="formData.animatedUrl" placeholder="请输入动态图地址"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number class="ls-input" v-model="formData.sort" :min="0" :max="1000" :step="1"/>
        </el-form-item>
        <el-form-item label="启用" prop="isEnable">
          <el-switch v-model="formData.isEnable" active-color="#13ce66" inactive-color="#ff4949"/>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <el-switch v-model="formData.cover" active-color="#13ce66" inactive-color="#ff4949"/>
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type {FormInstance} from 'element-plus'
import {emojiAdd, emojiDetail, emojiEdit} from '@/api/app/emoji'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'
import {emojigroupLists} from "@/api/app/emojigroup";

const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
  return mode.value == 'edit' ? '编辑表情' : '新增表情'
})
const formData = reactive({
  id: '',
  group: '',
  cover: false,
  name: '',
  type: 'lottie',
  staticUrl: '',
  animatedUrl: '',
  sort: 0,
  isEnable: true,
})
const groupOptions = ref<any[]>([])
const loading = ref(false)
const loadAllEmojiGroup = async (query: string) => {
  if (query === '') {
    return
  }
  loading.value = true
  emojigroupLists({
    filter: {
      name: query
    }
  }).then(res => {
    let options = [{name: query}]
    if (res.appMgmtEmojiGroups) {
      res.appMgmtEmojiGroups.forEach((item: any) => {
        options.push({
          name: item.name
        })
      })
    }
    groupOptions.value = options
    loading.value = false
  })
}
const rules = {
  name: [
    {
      required: true,
      message: '请输入名称',
      trigger: ['blur']
    }
  ],
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  const params = {...formData}
  mode.value == 'edit' ? await emojiEdit(params) : await emojiAdd(params)
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
  let data = await emojiDetail({
    id: row.id
  })
  data = data.appMgmtEmoji
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
