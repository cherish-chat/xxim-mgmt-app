<template>
  <div class="model-lists">
    <el-card class="!border-none" shadow="never">
      <div>
        <el-button v-perms="['user:friend:add']" type="primary" @click="handleAdd">
          <template #icon>
            <icon name="el-icon-Plus"/>
          </template>
          新增
        </el-button>
      </div>
      <div class="mt-4">
        <div>
          <el-table :data="pager.lists" size="large" v-loading="pager.loading">
            <el-table-column label="顺序" min-width="120" prop="seq"/>
            <el-table-column label="发送人" min-width="200">
              <template #default="{ row }">
                <el-avatar :src="getAvatar(row.senderId)"/>
                <el-tag>{{ row.senderId }}</el-tag>
                <el-tag type="danger">昵称: {{ getNickname(row.senderId) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="消息" min-width="200">
              <template #default="{ row }">
                <span v-if="row.contentType === 11">{{ getTextMsg(row) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="时间" width="190" fixed="right">
              <template #default="{ row }">
                {{ new Date(parseInt(row.serverTime)).format('yyyy-MM-dd hh:mm:ss') }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="flex justify-end mt-4">
          <pagination v-model="pager" @change="flushData"/>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup name="friend">
import {usePaging} from '@/hooks/usePaging'
import {msgLists} from "@/api/msg/convmsg";
import {b64DecodeUnicode} from "@/utils/b64";

const router = useRouter();
const convId = router.currentRoute.value.query.id;
if (!convId) {
  // 退出该页面
  router.back();
}
const formData = reactive({
  convId: convId,
});

// map
interface userInfo {
  id: string;
  nickname: string;
  avatar: string;
}

interface dict {
  [key: string]: userInfo
}

const userMap = ref<dict>({})
const userMapSuccess = ref<boolean>(false)
const {pager, getLists} = usePaging({
  fetchFun: msgLists,
  respKey: "msgDataList",
  params: formData,
})

const flushData = async () => {
  userMapSuccess.value = false
  const res = await getLists();
  // 遍历 res.userMap  把v 反序列化
  const userMapTmp: dict = {}
  for (const [k, v] of Object.entries(res.userMap)) {
    userMapTmp[k] = JSON.parse(v as string)
  }
  userMap.value = userMapTmp
  console.log("userMap.value", userMap.value);
  userMapSuccess.value = true;
}
const getAvatar = (userId: string) => {
  if (userMapSuccess.value) {
    return userMap.value[userId].avatar
  }
  return ""
}
const getNickname = (userId: string) => {
  if (userMapSuccess.value) {
    return userMap.value[userId].nickname
  }
  return ""
}
const getTextMsg = (row: any) => {
  const content = row.content;
  // base64解码
  try {
    return b64DecodeUnicode(content)
  } catch (e) {
    if (row.options.needDecrypt) {
      return "加密消息"
    }
    return content
  }
}
flushData();
</script>
