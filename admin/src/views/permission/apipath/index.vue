<template>
  <div class="apipath-lists">
    <el-card class="!border-none" shadow="never">
      <el-form class="mb-[-16px]" :model="formData" inline>
        <el-form-item label="日志">
          <el-select
              v-model="formData.logEnable"
              clearable
          >
            <el-option label="全部" value=""/>
            <el-option label="启用" value="1"/>
            <el-option label="禁用" value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input
              v-model="formData.title"
              class="w-[280px]"
              clearable
              @keyup.enter="resetPage"
          />
        </el-form-item>
        <el-form-item label="路径">
          <el-input
              v-model="formData.path"
              class="w-[280px]"
              clearable
              @keyup.enter="resetPage"
          />
        </el-form-item>
        <!--createTime range-->
        <el-form-item label="创建时间">
          <el-date-picker
              v-model="formDataTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
              @change="setFormDataTime"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetPage">查询</el-button>
          <el-button @click="resetParams">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="!border-none" shadow="never">
      <div>
        <el-button v-perms="['system:apipath:add']" type="primary" @click="handleAdd">
          <template #icon>
            <icon name="el-icon-Plus"/>
          </template>
          新增
        </el-button>
      </div>
      <div class="mt-4">
        <div>
          <el-table :data="pager.lists" size="large" v-loading="pager.loading">
            <el-table-column prop="title" label="标题" min-width="150"/>
            <el-table-column
                prop="path"
                label="路径"
                min-width="150"
                show-overflow-tooltip
            />
            <el-table-column label="记录日志" min-width="180">
              <template #default="{ row }">
                {{ row.logEnable ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column prop="createdAtStr" label="创建时间" min-width="180"/>
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button
                    v-perms="['system:apipath:edit']"
                    link
                    type="primary"
                    @click="handleEdit(row)"
                >
                  编辑
                </el-button>
                <el-button
                    v-perms="['system:apipath:del']"
                    link
                    type="danger"
                    @click="handleDelete(row.id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="flex justify-end mt-4">
          <pagination v-model="pager" @change="getLists"/>
        </div>
      </div>
    </el-card>
    <edit-popup v-if="showEdit" ref="editRef" @success="getLists" @close="showEdit = false"/>
  </div>
</template>

<script lang="ts" setup name="apipath">
import {apipathDelete, apipathLists} from '@/api/perms/apipath'
import {usePaging} from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'
const formData = ref({
  id: '',
  logEnable: '',
  title: '',
  path: '',
  time_gte: '',
  time_lte: '',
})
const formDataTime = ref([])
const setFormDataTime = (val: any) => {
  formDataTime.value = val
  formData.value.time_gte = (val[0] as Date).getTime().toString()
  formData.value.time_lte = (val[1] as Date).getTime().toString()
}
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const {pager, getLists, resetPage, resetParams} = usePaging({
  fetchFun: apipathLists,
  respKey: "apiPaths",
  params: formData.value,
})
const handleAdd = async () => {
  showEdit.value = true
  await nextTick()
  editRef.value?.open('add')
}

const handleEdit = async (data: any) => {
  showEdit.value = true
  await nextTick()
  editRef.value?.open('edit')
  editRef.value?.setFormData(data)
}

// 删除角色
const handleDelete = async (id: string) => {
  await feedback.confirm('确定要删除？')
  await apipathDelete({ids: [id]})
  feedback.msgSuccess('删除成功')
  getLists()
}

getLists()
</script>
