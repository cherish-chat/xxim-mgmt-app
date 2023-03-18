<script lang="ts" setup name="config">
import {configEdit, configLists} from '@/api/app/config'

const router = useRouter();
let userId = router.currentRoute.value.query.id;
if (!userId) {
  // 退出该页面
  userId = "";
}

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
const groups = ref<string[]>([])
const getLists = async () => {
  const data = await configLists(userId as string)
  // for 循环 data.appMgmtConfigs , 相同group的放到同一个数组里
  const configMap: ConfigMap = {}
  for (const config of data.appMgmtConfigs) {
    if (!configMap[config.group]) {
      configMap[config.group] = []
    }
    configMap[config.group].push(config)
    if (!groups.value.includes(config.group)) {
      groups.value.push(config.group)
    }
  }
  // groups 排序
  groups.value.sort()
  // configs 排序
  for (const group in configMap) {
    configMap[group].sort((a, b) => {
      return a.k.localeCompare(b.k)
    })
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
    appMgmtConfigs: configs,
    userId: userId
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

const activeNames = ref<string[]>([])
const handleChange = (val: string[]) => {
  activeNames.value = val
}

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const group = ref<string>('')
const handleSelect = (key: string, keyPath: string[]) => {
  group.value = key
}
getLists().then(() => {
  // 默认展开第一个
  if (groups.value.length > 0) {
    activeNames.value = [groups.value[0]]
    group.value = groups.value[0]
  }
})
</script>
<!--
<template>
  <div class="apipath-lists">
    <el-card class="!border-none" shadow="never">
      <div class="mt-4">
        &lt;!&ndash; 遍历configData group使用el-divider &ndash;&gt;
        <el-collapse v-model="activeNames" @change="handleChange" >
          <el-collapse-item v-for="(group, i) in groups" :key="group"
                            :title="group"
                            :name="group"
          >
            <el-form :model="configData[group]" label-width="200px" size="small" class="mt-4">
              <el-form-item v-for="config in configData[group]" :key="config.k" :label="getLabel(config)">
                &lt;!&ndash; config.type: string number bool stringArray &ndash;&gt;
                <el-input v-if="config.type === 'string'" v-model="config.v"/>
                <el-input-number v-else-if="config.type === 'number'" v-model="config.v" :controls="false"/>
                <el-switch v-else-if="config.type === 'bool'" v-model="config.v"/>
                <el-input type="textarea" v-else-if="config.type === 'stringArray'" v-model="config.v"/>
                <el-select type="textarea" v-else-if="config.type === 'option'" v-model="config.v">
                  <el-option v-for="(option, index) in JSON.parse(config.options)" :key="index" :label="option.label"
                             :value="option.value"/>
                </el-select>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
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
-->

<template>
  <div class="flex h-screen w-full">
    <el-menu
        @open="handleOpen"
        @close="handleClose"
        mode="vertical"
        @select="handleSelect"
    >
      <el-menu-item v-for="(group, i) in groups" :key="group"
                    :index="group">
        <span>{{ group }}</span>
      </el-menu-item>

    </el-menu>

    <div class="flex-1 flex flex-col min-w-0">
      <div class="app-header">
      </div>
      <div class="app-main flex-1 min-h-0">
        <el-card class="!border-none" shadow="never">
          <el-divider content-position="left"><span class="text-2xl font-bold">{{ group }}</span></el-divider>
          <!-- 遍历configData[group] -->
          <el-form :model="configData[group]" label-width="200px" size="small" class="mt-4">
            <el-form-item v-for="config in configData[group]" :key="config.k" :label="getLabel(config)">
              <!-- config.type: string number bool stringArray -->
              <el-input v-if="config.type === 'string'" v-model="config.v"/>
              <el-input-number v-else-if="config.type === 'number'" v-model="config.v" :controls="false"/>
              <el-switch v-else-if="config.type === 'bool'" v-model="config.v"/>
              <el-input type="textarea" v-else-if="config.type === 'stringArray'" v-model="config.v"/>
              <el-select type="textarea" v-else-if="config.type === 'option'" v-model="config.v">
                <el-option v-for="(option, index) in JSON.parse(config.options)" :key="index" :label="option.label"
                           :value="option.value"/>
              </el-select>
            </el-form-item>
          </el-form>
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
    </div>
  </div>

</template>

<style lang="scss" scoped>
.menu {
  &.theme-dark {
    .el-menu {
      :deep(.el-menu-item) {
        &.is-active {
          @apply bg-primary border-primary;
        }
      }
    }

    :deep(.el-menu--collapse) {
      .el-sub-menu.is-active .el-sub-menu__title {
        @apply bg-primary #{!important};
      }
    }
  }

  &.theme-light {
    :deep(.el-menu) {
      .el-menu-item {
        border-color: transparent;

        &.is-active {
          @apply bg-primary-light-9 border-r-2 border-primary;
        }
      }

      .el-menu-item:hover,
      .el-sub-menu__title:hover {
        color: var(--el-color-primary);
      }
    }
  }

  .el-menu {
    border-right: none;

    &:not(.el-menu--collapse) {
      width: var(--aside-width);
    }
  }
}
</style>
