<template>
  <div class="vpn-lists">
    <el-card class="!border-none" shadow="never">
      <div>
        <el-button v-perms="['app:vpn:add']" type="primary" @click="handleAdd">
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
            <el-table-column label="名称" min-width="150">
              <template #default="{ row }">
                <el-tag>{{ row.name }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="平台" min-width="150">
              <template #default="{ row }">
                <el-tag v-if="row.platform !== ''" type="success">{{ row.platform }}</el-tag>
                <el-tag v-else type="danger">全部</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="类型" min-width="150">
              <template #default="{ row }">
                <el-tag v-if="row.type === 'IPSec'" type="success"> IPSec</el-tag>
                <el-tag v-else-if="row.type === 'http'" type="warning"> http</el-tag>
                <el-tag v-else type="danger"> socks5</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="地址" min-width="150">
              <template #default="{ row }">
                <el-tag>{{ row.ip }}:{{ row.port }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="认证" min-width="150">
              <template #default="{ row }">
                <el-tag v-if="row.username !== ''" type="success">username:{{ row.username }}</el-tag>
                <el-tag v-if="row.password !== ''" type="danger">password:{{ row.password }}</el-tag>
                <el-tag v-if="row.secretKey !== ''" type="warning">secretKey:{{ row.secretKey }}</el-tag>
                <el-tag v-if="row.username === ''" type="info"> 无认证</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAtStr" label="创建时间" min-width="180"/>
            <el-table-column label="操作" width="190" fixed="right">
              <template #default="{ row }">
                <el-button
                    v-perms="['app:vpn:edit']"
                    link
                    type="primary"
                    @click="handleEdit(row)"
                >
                  编辑
                </el-button>
                <el-button
                    v-perms="['app:vpn:del']"
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

<script lang="ts" setup name="vpn">
import {vpnDelete, vpnLists} from '@/api/app/vpn'
import {usePaging} from '@/hooks/usePaging'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const {pager, getLists} = usePaging({
  fetchFun: vpnLists,
  respKey: "appMgmtVpns"
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
  await vpnDelete({ids: [id]})
  feedback.msgSuccess('删除成功')
  getLists()
}

getLists()
</script>
