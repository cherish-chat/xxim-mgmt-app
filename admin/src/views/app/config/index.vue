<script lang="ts" setup name="config">
import {configEdit, configLists} from '@/api/app/config'

interface Config {
  group: string
  k: string
  v: string
  type: string
  name: string
  scopePlatforms: string
}

interface ConfigMap {
  [key: string]: Config[]
}

const configData = ref<ConfigMap>({})
const getLists = async () => {
  const data = await configLists()
  // for 循环 data.appMgmtConfigs , 相同group的放到同一个数组里
  const configMap: ConfigMap = {}
  for (const config of data.appMgmtConfigs) {
    if (!configMap[config.group]) {
      configMap[config.group] = []
    }
    configMap[config.group].push(config)
  }
  configData.value = configMap
}

const handleCancel = async () => {
  await getLists()
}

const handleUpdate = () => {
  // 拼成 Config[] 数组
  const configs: Config[] = []
  for (const group in configData.value) {
    for (const config of configData.value[group]) {
      // 把所有v都转成string
      const tmp = {...config, v: config.v.toString()}
      configs.push(tmp)
    }
  }
  configEdit({
    appMgmtConfigs: configs
  }).then(() => {
    getLists()
  }).catch(() => {
  })
}

const getLabel = (config: Config) => {
  let name = config.name;
  if (config.type === 'stringArray') {
    name += '(数组)'
  }
  return name
}

getLists()
</script>

<template>
  <div class="apipath-lists">
    <el-card class="!border-none" shadow="never">
      <div class="mt-4">
        <!-- 遍历configData group使用el-divider -->
        <div v-for="group in Object.keys(configData)" :key="group">
          <el-divider content-position="left"><span class="text-2xl font-bold">{{ group }}</span></el-divider>
          <!-- 遍历configData[group] -->
          <el-form :model="configData[group]" label-width="200px" size="small" class="mt-4">
            <el-form-item v-for="config in configData[group]" :key="config.k" :label="getLabel(config)">
              <!-- config.type: string number bool stringArray -->
              <el-input v-if="config.type === 'string'" v-model="config.v" />
              <el-input-number v-else-if="config.type === 'number'" v-model="config.v" :controls="false"/>
              <el-switch v-else-if="config.type === 'bool'" v-model="config.v" />
              <el-input type="textarea" v-else-if="config.type === 'stringArray'" v-model="config.v" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div>
        <el-button v-perms="['devops:config:edit']" type="success" @click="handleUpdate">
          提交修改
        </el-button>
        <el-button v-perms="['devops:config:edit']" type="info" @click="handleCancel">
          取消修改
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.input-new-tag {
  width: 100%;
  margin-top: 8px;
}
</style>