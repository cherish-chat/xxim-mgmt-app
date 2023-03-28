<template>
  <div class="luaconfig-lists">
    <el-card class="!border-none" shadow="never">
      <el-form class="mb-[-16px]" :model="formData" inline>
        <el-form-item label="状态">
          <el-select
              v-model="formData.enable"
              clearable
          >
            <el-option label="全部" value=""/>
            <el-option label="启用" value="1"/>
            <el-option label="禁用" value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select
              v-model="formData.type"
              clearable
          >
            <el-option label="全部" value=""/>
            <el-option label="生成僵尸号信息" value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input
              v-model="formData.name"
              class="w-[280px]"
              clearable
              @keyup.enter="resetPage"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
              v-model="formData.desc"
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
        <el-button v-perms="['system:luaconfig:add']" type="primary" @click="handleAdd">
          <template #icon>
            <icon name="el-icon-Plus"/>
          </template>
          新增
        </el-button>
      </div>
      <div class="mt-4">
        <div>
          <el-table :data="pager.lists" size="large" v-loading="pager.loading">
            <el-table-column prop="id" label="ID" min-width="100"/>
            <el-table-column label="类型" min-width="150">
              <template #default="{ row }">
                <el-tag v-if="row.type === 1" type="primary">生成僵尸号信息</el-tag>
                <span v-else>未知类型</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="名称" min-width="150"/>
            <el-table-column prop="desc" label="描述" min-width="250"/>
            <el-table-column label="启用" min-width="180">
              <template #default="{ row }">
                {{ row.enable ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column prop="createTimeStr" label="创建时间" min-width="180"/>
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button
                    v-perms="['system:luaconfig:edit']"
                    link
                    type="primary"
                    @click="handleEdit(row)"
                >
                  编辑
                </el-button>
                <el-button
                    v-perms="['system:luaconfig:del']"
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

<script lang="ts" setup name="luaconfig">
import {luaconfigDelete, luaconfigLists} from '@/api/perms/luaconfig'
import {usePaging} from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const formData = ref({
  id: '',
  enable: '',
  name: '',
  desc: '',
  type: '',
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
const {pager, getLists, resetParams, resetPage} = usePaging({
  fetchFun: luaconfigLists,
  respKey: "luaConfigs",
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
  await luaconfigDelete({ids: [id]})
  feedback.msgSuccess('删除成功')
  getLists()
}

getLists().then((resp)=>{
  console.log(resp)
})
</script>
