<template>
  <div class="edit-popup">
    <popup
        ref="popupRef"
        title="权限设置"
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
        <el-scrollbar class="h-[400px] sm:h-[600px]">
          <el-form-item label="api" prop="apiPaths">
            <div>
              <el-checkbox label="全选/不全选" @change="handleSelectAll"/>
              <div>
                <el-tree
                    ref="treeRef"
                    :data="apiPathTree"
                    :props="{label: 'title'}"
                    node-key="id"
                    show-checkbox
                />
              </div>
            </div>
          </el-form-item>
        </el-scrollbar>
      </el-form>
    </popup>
  </div>
</template>
<script lang="ts" setup>
import type {CheckboxValueType, ElTree, FormInstance} from 'element-plus'
import {roleDetail, roleEdit} from '@/api/perms/role'
import {apipathAll} from '@/api/perms/apipath'
import Popup from '@/components/popup/index.vue'
import {treeToArray} from '@/utils/util'
import feedback from '@/utils/feedback'

const emit = defineEmits(['success', 'close'])
const treeRef = shallowRef<InstanceType<typeof ElTree>>()
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const apiPathArray = ref<any[]>([])
const apiPathTree = ref<any[]>([])
const formData = reactive({
  id: '',
  name: '',
  remark: '',
  sort: 0,
  isDisable: 0,
  apiPaths: [] as any[],
  menus: [] as any[],
})

const rules = {
  name: [
    {
      required: true,
      message: '请输入名称',
      trigger: ['blur']
    }
  ]
}

const getOptions = async () => {
  const data = await apipathAll()
  apiPathTree.value = data.apiPaths
  apiPathArray.value = treeToArray(data.apiPaths)
}

// 获取所有选择的节点包括半选中节点
const getDeptAllCheckedKeys = () => {
  const checkedKeys = treeRef.value?.getCheckedKeys()
  const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys()!
  checkedKeys?.unshift.apply(checkedKeys, halfCheckedKeys)
  return checkedKeys
}

const handleSelectAll = (check: CheckboxValueType) => {
  if (check) {
    treeRef.value?.setCheckedKeys(apiPathArray.value.map((item) => item.id))
  } else {
    treeRef.value?.setCheckedKeys([])
  }
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  formData.apiPaths = getDeptAllCheckedKeys()!
  await roleEdit({...formData, apiPathIds: formData.apiPaths.join(), menuIds: formData.menus.join()})
  popupRef.value?.close()
  feedback.msgSuccess('操作成功')
  emit('success')
}

const handleClose = () => {
  emit('close')
}

const open = () => {
  popupRef.value?.open()
}

const setFormData = async (row: Record<any, any>) => {
  await getOptions()
  const data = await roleDetail({
    id: row.id
  })
  for (const key in formData) {
    if (data[key] != null && data[key] != undefined) {
      //@ts-ignore
      formData[key] = data[key]
    }
  }
  nextTick(() => {
    setDeptAllCheckedKeys()
  })
}

const setDeptAllCheckedKeys = () => {
  formData.apiPaths.forEach((v) => {
    nextTick(() => {
      treeRef.value?.setChecked(v, true, false)
    })
  })
}

defineExpose({
  open,
  setFormData
})
</script>
