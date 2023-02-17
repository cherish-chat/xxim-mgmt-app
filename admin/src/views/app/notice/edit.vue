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
        <el-form-item label="位置" prop="position">
          <!-- options: 开屏页:0, 首页弹窗:1, 飘屏:2 -->
          <el-select
              class="ls-input"
              v-model="formData.position"
              placeholder="请选择位置"
              clearable
          >
            <el-option :key="0" label="飘屏" :value="0"/>
            <el-option :key="1" label="开屏页" :value="1"/>
            <el-option :key="2" label="首页弹窗" :value="2"/>
          </el-select>
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
        <el-form-item label="标题" prop="title">
          <el-input class="ls-input" v-model="formData.title" placeholder="请输入标题" clearable/>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <div>
            <div>
              <material-picker v-model="formData.image" :limit="1"/>
            </div>
            <div class="form-tips">
              建议尺寸：100*100px，支持jpg，jpeg，png格式
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
        <el-form-item label="时间" prop="time">
          <el-date-picker
              class="ls-input"
              v-model="formData.time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
          />
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type {FormInstance} from 'element-plus'
import {noticeAdd, noticeDetail, noticeEdit} from '@/api/app/notice'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'

const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')
const popupTitle = computed(() => {
  return mode.value == 'edit' ? '编辑公告' : '新增公告'
})
const formData = reactive({
  id: '',
  position: 0,
  platform: '',
  title: '',
  image: '',
  content: '',
  sort: 0,
  isEnable: true,
  time: [],
})

const rules = {
  notice: [
    {
      required: true,
      message: '请输入公告号',
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
  let params = {
    id: formData.id,
    position: formData.position,
    platform: formData.platform,
    title: formData.title,
    image: formData.image,
    content: formData.content,
    sort: formData.sort,
    isEnable: formData.isEnable,
    startTime: (formData.time[0] as Date).getTime(),
    endTime: (formData.time[1] as Date).getTime()
  }
  mode.value == 'edit' ? await noticeEdit(params) : await noticeAdd(params)
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
  let data = await noticeDetail({
    id: row.id
  })
  data = data.appMgmtNotice
  // startTime 是13位时间戳
  data.time = [
    new Date(data.startTime),
    new Date(data.endTime)
  ]
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
