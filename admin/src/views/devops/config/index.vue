<script lang="ts" setup name="config">
import {configEdit, configLists} from '@/api/serv/config'

interface Config {
  common: {
    host: string
    ip2RegionUrl: string
    logLevel: string
    mode: string
    rpcTimeOut: number
    mysql: {
      addr: string
      logLevel: string
      maxIdleConns: number
      maxOpenConns: number
    },
    redis: {
      host: string
      pass: string
      tls: boolean
      type: string
    },
    telemetry: {
      batcher: string
      endPoint: string
      sampler: number
    },
  }
  connRpc: {
    discovType: string
    endpoints: Array<string>
    k8sNamespace: string
    port: number
    websocketPort: number
  }
  groupRpc: {
    port: number
  }
  imRpc: {
    port: number
  }
  mgmt: {
    httpPort: number
    rpcPort: number
    superAdminId: string
    superAdminPass: string
  }
  msgRpc: {
    port: number
    mobPush: {
      androidSound: string
      apnsCateGory: string
      apnsProduction: boolean
      apnsSound: string
      appKey: string
      appSecret: string
      enabled: boolean
    }
    pulsar: {
      enabled: boolean
      producerTimeout: number
      receiverQueueSize: number
      token: string
      topicName: string
      vpcUrl: string
    }
  }
  noticeRpc: {
    port: number
  }
  relationRpc: {
    port: number
  }
  appMgmtRpc: {
    port: number
  }
  userRpc: {
    port: number
  }
}

const defaultConfig = {
  common: {
    host: '',
    ip2RegionUrl: '',
    logLevel: '',
    mode: '',
    rpcTimeOut: 0,
    mysql: {
      addr: '',
      logLevel: '',
      maxIdleConns: 0,
      maxOpenConns: 0,
    },
    redis: {
      host: '',
      pass: '',
      tls: false,
      type: '',
    },
    telemetry: {
      batcher: '',
      endPoint: '',
      sampler: 0,
    },
  },
  connRpc: {
    discovType: '',
    endpoints: [],
    k8sNamespace: '',
    port: 0,
    websocketPort: 0,
  },
  groupRpc: {
    port: 0,
  },
  imRpc: {
    port: 0,
  },
  mgmt: {
    httpPort: 0,
    rpcPort: 0,
    superAdminId: '',
    superAdminPass: '',
  },
  msgRpc: {
    port: 0,
    mobPush: {
      androidSound: '',
      apnsCateGory: '',
      apnsProduction: false,
      apnsSound: '',
      appKey: '',
      appSecret: '',
      enabled: false,
    },
    pulsar: {
      enabled: false,
      producerTimeout: 0,
      receiverQueueSize: 0,
      token: '',
      topicName: '',
      vpcUrl: '',
    },
  },
  noticeRpc: {
    port: 0,
  },
  relationRpc: {
    port: 0,
  },
  appMgmtRpc: {
    port: 0,
  },
  userRpc: {
    port: 0,
  }
} as Config
const configData = ref<Config>(defaultConfig)
const newEndpoint = ref('')
const getLists = async () => {
  const data = await configLists()
  configData.value = data as Config
}

const handleCancel = async () => {
  await getLists()
}

const addEndpoint = () => {
  configData.value.connRpc.endpoints.push(newEndpoint.value)
  newEndpoint.value = ''
}
const handleUpdate = () => {
  configEdit({
    config: configData.value
  }).then(() => {
    getLists()
  }).catch(() => {
  })
}
getLists()
</script>

<template>
  <div class="apipath-lists">
    <el-card class="!border-none" shadow="never">
      <div class="mt-4">
        <el-divider content-position="left"><span class="text-2xl font-bold">常规配置</span></el-divider>
        <div>
          <el-form :model="configData.common" label-width="120px" class="mt-4">
            <el-form-item label="主机">
              <el-input v-model="configData.common.host" placeholder="请输入主机"/>
            </el-form-item>
            <el-form-item label="IP2Region URL">
              <el-input v-model="configData.common.ip2RegionUrl" placeholder="请输入IP2Region URL"/>
            </el-form-item>
            <el-form-item label="日志等级">
              <!--使用option debug info error severe-->
              <el-select v-model="configData.common.logLevel" placeholder="请选择日志等级">
                <el-option label="debug" value="debug"/>
                <el-option label="info" value="info"/>
                <el-option label="error" value="error"/>
                <el-option label="severe" value="severe"/>
              </el-select>
            </el-form-item>
            <el-form-item label="模式">
              <!--使用option dev pro-->
              <el-select v-model="configData.common.mode" placeholder="请选择模式">
                <el-option label="dev" value="dev"/>
                <el-option label="pro" value="pro"/>
              </el-select>
            </el-form-item>
            <el-form-item label="RPC超时时间">
              <!--int类型输入框-->
              <el-input-number v-model="configData.common.rpcTimeOut" :min="100" :max="100000" :step="100"/>
            </el-form-item>
            <el-form-item label="MySQL">
              <el-form-item label="地址">
                <el-input v-model="configData.common.mysql.addr" placeholder="请输入地址"/>
              </el-form-item>
              <el-form-item label="日志等级">
                <!--使用option info silent warning error-->
                <el-select v-model="configData.common.mysql.logLevel" placeholder="请选择日志等级">
                  <el-option label="info" value="info"/>
                  <el-option label="silent" value="silent"/>
                  <el-option label="warning" value="warning"/>
                  <el-option label="error" value="error"/>
                </el-select>
              </el-form-item>
              <el-form-item label="最大空闲连接数">
                <!--int类型输入框-->
                <el-input-number v-model="configData.common.mysql.maxIdleConns" :min="1" :max="100" :step="1"/>
              </el-form-item>
              <el-form-item label="最大打开连接数">
                <!--int类型输入框-->
                <el-input-number v-model="configData.common.mysql.maxOpenConns" :min="1" :max="100" :step="1"/>
              </el-form-item>
            </el-form-item>
            <el-form-item label="Redis">
              <el-form-item label="主机">
                <el-input v-model="configData.common.redis.host" placeholder="请输入主机"/>
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="configData.common.redis.pass" placeholder="请输入密码"/>
              </el-form-item>
              <el-form-item label="TLS">
                <el-switch v-model="configData.common.redis.tls" active-color="#13ce66" inactive-color="#ff4949"/>
              </el-form-item>
              <el-form-item label="类型">
                <!--使用option cluster sentinel single-->
                <el-select v-model="configData.common.redis.type" placeholder="请选择类型">
                  <el-option label="node" value="node"/>
                  <el-option label="cluster" value="cluster"/>
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item label="链路追踪">
              <el-form-item label="处理器">
                <!--使用option jaeger zipkin-->
                <el-select v-model="configData.common.telemetry.batcher" placeholder="请选择处理器">
                  <el-option label="jaeger" value="jaeger"/>
                  <el-option label="zipkin" value="zipkin"/>
                </el-select>
              </el-form-item>
              <el-form-item label="端点">
                <el-input v-model="configData.common.telemetry.endPoint" placeholder="请输入端点"/>
              </el-form-item>
              <el-form-item label="采样率">
                <!--最大1 最小0 步长0.01-->
                <el-input-number v-model="configData.common.telemetry.sampler" :min="0" :precision="2" :max="1"
                                 :step="0.01"/>
              </el-form-item>
            </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="text-2xl font-bold">长连接rpc配置</span></el-divider>
        <div>
          <el-form :model="configData.connRpc" label-width="120px" class="mt-4">
            <el-form-item label="发现类型">
              <!--使用option endpoints k8s-->
              <el-select v-model="configData.connRpc.discovType" placeholder="请选择发现类型">
                <el-option label="endpoints" value="endpoints"/>
                <el-option label="k8s" value="k8s"/>
              </el-select>
            </el-form-item>
            <el-form-item label="端点">
              <!--数组类型 可以添加删除-->
              <el-form-item v-for="(item, index) in configData.connRpc.endpoints" :key="index">
                <el-tag closable @close="configData.connRpc.endpoints.splice(index, 1)">
                  {{ item }}
                </el-tag>
              </el-form-item>
              <el-form-item>
                <el-input v-model="newEndpoint" class="input-new-tag" @keyup.enter.native="addEndpoint"
                          placeholder="新增endpoint"/>
              </el-form-item>
            </el-form-item>
            <el-form-item label="K8S命名空间">
              <el-input v-model="configData.connRpc.k8sNamespace" placeholder="请输入K8S命名空间"/>
            </el-form-item>
            <el-form-item label="端口">
              <!--int类型输入框-->
              <el-input-number v-model="configData.connRpc.port" :min="1" :max="65536" :step="1"/>
            </el-form-item>
            <el-form-item label="Websocket端口">
              <!--int类型输入框-->
              <el-input-number v-model="configData.connRpc.websocketPort" :min="1" :max="65536" :step="1"/>
            </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="text-2xl font-bold">消息rpc配置</span></el-divider>
        <div>
          <el-form :model="configData.msgRpc" label-width="120px" class="mt-4">
            <el-form-item label="端口">
              <!--int类型输入框-->
              <el-input-number v-model="configData.msgRpc.port" :min="1" :max="65536" :step="1"/>
            </el-form-item>
            <el-form-item label="MobPush">
              <el-form-item label="启用">
                <el-switch v-model="configData.msgRpc.mobPush.enabled" active-color="#13ce66" inactive-color="#ff4949"/>
              </el-form-item>
              <el-form-item label="安卓声音">
                <!--option default-->
                <el-select v-model="configData.msgRpc.mobPush.androidSound" placeholder="请选择安卓声音">
                  <el-option label="default" value="default"/>
                </el-select>
              </el-form-item>
              <el-form-item label="APNS类别">
                <!--option default-->
                <el-select v-model="configData.msgRpc.mobPush.apnsCateGory" placeholder="请选择APNS类别">
                  <el-option label="default" value="default"/>
                </el-select>
              </el-form-item>
              <el-form-item label="APNS生产环境">
                <!--switch-->
                <el-switch v-model="configData.msgRpc.mobPush.apnsProduction" active-color="#13ce66"
                           inactive-color="#ff4949"/>
              </el-form-item>
              <el-form-item label="APNS声音">
                <!--option default-->
                <el-select v-model="configData.msgRpc.mobPush.apnsSound" placeholder="请选择APNS声音">
                  <el-option label="default" value="default"/>
                </el-select>
              </el-form-item>
              <el-form-item label="AppKey">
                <el-input v-model="configData.msgRpc.mobPush.appKey" placeholder="请输入AppKey"/>
              </el-form-item>
              <el-form-item label="AppSecret">
                <el-input v-model="configData.msgRpc.mobPush.appSecret" placeholder="请输入AppSecret"/>
              </el-form-item>
            </el-form-item>
            <el-form-item label="Pulsar">
              <el-form-item label="启用">
                <el-switch v-model="configData.msgRpc.pulsar.enabled" active-color="#13ce66" inactive-color="#ff4949"/>
              </el-form-item>
              <el-form-item label="生产者超时">
                <!--int类型输入框-->
                <el-input-number v-model="configData.msgRpc.pulsar.producerTimeout" :min="100" :max="100000"
                                 :step="100"/>
              </el-form-item>
              <el-form-item label="接收队列大小">
                <!--int类型输入框-->
                <el-input-number v-model="configData.msgRpc.pulsar.receiverQueueSize" :min="1" :max="100000" :step="1"/>
              </el-form-item>
              <el-form-item label="令牌">
                <el-input v-model="configData.msgRpc.pulsar.token" placeholder="请输入令牌"/>
              </el-form-item>
              <el-form-item label="主题名称">
                <el-input v-model="configData.msgRpc.pulsar.topicName" placeholder="请输入主题名称"/>
              </el-form-item>
              <el-form-item label="VPC URL">
                <el-input v-model="configData.msgRpc.pulsar.vpcUrl" placeholder="请输入VPC URL"/>
              </el-form-item>
            </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="text-2xl font-bold">后台管理配置</span></el-divider>
        <div>
          <el-form :model="configData.mgmt" label-width="120px" class="mt-4">
            <el-form-item label="http端口">
              <!--int类型输入框-->
              <el-input-number v-model="configData.mgmt.httpPort" :min="1" :max="65536" :step="1"/>
            </el-form-item>
            <el-form-item label="rpc端口">
              <!--int类型输入框-->
              <el-input-number v-model="configData.mgmt.rpcPort" :min="1" :max="65536" :step="1"/>
            </el-form-item>
            <el-form-item label="超级管理员">
              <el-form-item label="id">
                <el-input v-model="configData.mgmt.superAdminId" placeholder="请输入超管id"/>
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="configData.mgmt.superAdminPass" placeholder="请输入超管密码"/>
              </el-form-item>
            </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="text-2xl font-bold">群聊rpc配置</span></el-divider>
        <div>
          <el-form :model="configData.groupRpc" label-width="120px" class="mt-4">
            <el-form-item label="端口">
              <!--int类型输入框-->
              <el-input-number v-model="configData.groupRpc.port" :min="1" :max="65536" :step="1"/>
            </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="text-2xl font-bold">通知rpc配置</span></el-divider>
        <div>
          <el-form :model="configData.noticeRpc" label-width="120px" class="mt-4">
            <el-form-item label="端口">
              <!--int类型输入框-->
              <el-input-number v-model="configData.noticeRpc.port" :min="1" :max="65536" :step="1"/>
            </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="text-2xl font-bold">关系rpc配置</span></el-divider>
        <div>
          <el-form :model="configData.relationRpc" label-width="120px" class="mt-4">
            <el-form-item label="端口">
              <!--int类型输入框-->
              <el-input-number v-model="configData.relationRpc.port" :min="1" :max="65536" :step="1"/>
            </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="text-2xl font-bold">用户rpc配置</span></el-divider>
        <div>
          <el-form :model="configData.userRpc" label-width="120px" class="mt-4">
            <el-form-item label="端口">
              <!--int类型输入框-->
              <el-input-number v-model="configData.userRpc.port" :min="1" :max="65536" :step="1"/>
            </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="text-2xl font-bold">app管理rpc配置</span></el-divider>
        <div>
          <el-form :model="configData.appMgmtRpc" label-width="120px" class="mt-4">
            <el-form-item label="端口">
              <!--int类型输入框-->
              <el-input-number v-model="configData.appMgmtRpc.port" :min="1" :max="65536" :step="1"/>
            </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="text-2xl font-bold">连接管理rpc配置</span></el-divider>
        <div>
          <el-form :model="configData.imRpc" label-width="120px" class="mt-4">
            <el-form-item label="端口">
              <!--int类型输入框-->
              <el-input-number v-model="configData.imRpc.port" :min="1" :max="65536" :step="1"/>
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