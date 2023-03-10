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
    rsaPublicKey: string
    rsaPrivateKey: string
  }
  groupRpc: {
    port: number
    maxGroupCount: number
    maxGroupMemberCount: number
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
    discovType: string
    endpoints: Array<string>
    k8sNamespace: string
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
    sms: {
      enabled: boolean
      type: string
      tencentSms: {
        appId: string
        secretId: string
        secretKey: string
        region: string
        sign: string
        templateId: string
      }
    }
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
    rsaPublicKey: '',
    rsaPrivateKey: '',
  },
  groupRpc: {
    port: 0,
    maxGroupCount: 0,
    maxGroupMemberCount: 0,
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
    discovType: '',
    endpoints: [],
    k8sNamespace: '',
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
    sms: {
      enabled: false,
      type: '',
      tencentSms: {
        appId: '',
        secretId: '',
        secretKey: '',
        region: '',
        sign: '',
        templateId: '',
      },
    },
  }
} as Config
const configData = ref<Config>(defaultConfig)
const newEndpoint = ref('')
const newMsgEndpoint = ref('')
const getLists = async () => {
  const data = await configLists()
  configData.value = data as Config
}

const handleCancel = async () => {
  await getLists()
}

const addEndpoint = () => {
  if (!configData.value.connRpc.endpoints) {
    configData.value.connRpc.endpoints = []
  }
  configData.value.connRpc.endpoints.push(newEndpoint.value)
  newEndpoint.value = ''
}
const addMsgEndpoint = () => {
  if (!configData.value.msgRpc.endpoints) {
    configData.value.msgRpc.endpoints = []
  }
  configData.value.msgRpc.endpoints.push(newMsgEndpoint.value)
  newMsgEndpoint.value = ''
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

async function generateRsaKeyPair(): Promise<CryptoKeyPair> {
  const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048, // ?????????1024, 2048???4096
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: {name: "SHA-512"}, // ?????????"SHA-1"???"SHA-256"???"SHA-384"???"SHA-512"
      },
      true, // ???????????????????????????????????????????????????
      ["encrypt", "decrypt"] // ?????????["encrypt", "decrypt"]???["wrapKey", "unwrapKey"]
  );
  return keyPair;
}

async function rsaKeyToPem(exportedKey: ArrayBuffer, type: "public" | "private"): Promise<string> {

  // ??????????????????????????? PEM ??????
  const exportedAsString = String.fromCharCode(...new Uint8Array(exportedKey));
  const exportedAsBase64 = btoa(exportedAsString);

  let pemString = "";
  pemString += `-----BEGIN ${type.toUpperCase()} KEY-----\r\n`;
  pemString += `${exportedAsBase64.match(/.{1,64}/g)?.join("\r\n") ?? ""}\r\n`;
  pemString += `-----END ${type.toUpperCase()} KEY-----\r\n`;

  return pemString;
}

const rsaKeyGenerate = async () => {
// ?????? generateRsaKeyPair() ????????????????????????
  const keyPair = await generateRsaKeyPair();

// ?????????????????????
  const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
  const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

// ???????????????????????????????????????
  const publicPem = await rsaKeyToPem(publicKey, "public");
  const privatePem = await rsaKeyToPem(privateKey, "private");

  configData.value.connRpc.rsaPublicKey = publicPem
  configData.value.connRpc.rsaPrivateKey = privatePem
}
</script>

<template>
  <div class="apipath-lists">
    <el-card class="!border-none" shadow="never">
      <div class="mt-4">
        <el-divider content-position="left"><span class="text-2xl font-bold">????????????</span></el-divider>
        <div>
          <el-form :model="configData.common" label-width="120px" class="mt-4">
            <el-form-item label="??????">
              <el-input v-model="configData.common.host" placeholder="???????????????"/>
            </el-form-item>
            <el-form-item label="IP2Region URL">
              <el-input v-model="configData.common.ip2RegionUrl" placeholder="?????????IP2Region URL"/>
            </el-form-item>
            <el-form-item label="????????????">
              <!--??????option debug info error severe-->
              <el-select v-model="configData.common.logLevel" placeholder="?????????????????????">
                <el-option label="debug" value="debug"/>
                <el-option label="info" value="info"/>
                <el-option label="error" value="error"/>
                <el-option label="severe" value="severe"/>
              </el-select>
            </el-form-item>
            <el-form-item label="??????">
              <!--??????option dev pro-->
              <el-select v-model="configData.common.mode" placeholder="???????????????">
                <el-option label="dev" value="dev"/>
                <el-option label="pro" value="pro"/>
              </el-select>
            </el-form-item>
            <el-form-item label="RPC????????????">
              <!--int???????????????-->
              <el-input-number v-model="configData.common.rpcTimeOut" :min="100" :max="100000" :step="100"/>
            </el-form-item>
            <el-form-item label="MySQL">
              <el-form-item label="??????">
                <el-input v-model="configData.common.mysql.addr" placeholder="???????????????"/>
              </el-form-item>
              <el-form-item label="????????????">
                <!--??????option info silent warning error-->
                <el-select v-model="configData.common.mysql.logLevel" placeholder="?????????????????????">
                  <el-option label="info" value="info"/>
                  <el-option label="silent" value="silent"/>
                  <el-option label="warning" value="warning"/>
                  <el-option label="error" value="error"/>
                </el-select>
              </el-form-item>
              <el-form-item label="?????????????????????">
                <!--int???????????????-->
                <el-input-number v-model="configData.common.mysql.maxIdleConns" :min="1" :max="100" :step="1"/>
              </el-form-item>
              <el-form-item label="?????????????????????">
                <!--int???????????????-->
                <el-input-number v-model="configData.common.mysql.maxOpenConns" :min="1" :max="100" :step="1"/>
              </el-form-item>
            </el-form-item>
            <el-form-item label="Redis">
              <el-form-item label="??????">
                <el-input v-model="configData.common.redis.host" placeholder="???????????????"/>
              </el-form-item>
              <el-form-item label="??????">
                <el-input v-model="configData.common.redis.pass" placeholder="???????????????"/>
              </el-form-item>
              <el-form-item label="TLS">
                <el-switch v-model="configData.common.redis.tls" active-color="#13ce66" inactive-color="#ff4949"/>
              </el-form-item>
              <el-form-item label="??????">
                <!--??????option cluster sentinel single-->
                <el-select v-model="configData.common.redis.type" placeholder="???????????????">
                  <el-option label="node" value="node"/>
                  <el-option label="cluster" value="cluster"/>
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item label="????????????">
              <el-form-item label="?????????">
                <!--??????option jaeger zipkin-->
                <el-select v-model="configData.common.telemetry.batcher" placeholder="??????????????????">
                  <el-option label="jaeger" value="jaeger"/>
                  <el-option label="zipkin" value="zipkin"/>
                </el-select>
              </el-form-item>
              <el-form-item label="??????">
                <el-input v-model="configData.common.telemetry.endPoint" placeholder="???????????????"/>
              </el-form-item>
              <el-form-item label="?????????">
                <!--??????1 ??????0 ??????0.01-->
                <el-input-number v-model="configData.common.telemetry.sampler" :min="0" :precision="2" :max="1"
                                 :step="0.01"/>
              </el-form-item>
            </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="text-2xl font-bold">?????????rpc??????</span></el-divider>
        <div>
          <el-form :model="configData.connRpc" label-width="120px" class="mt-4">
            <el-form-item label="????????????">
              <!--??????option endpoints k8s-->
              <el-select v-model="configData.connRpc.discovType" placeholder="?????????????????????">
                <el-option label="endpoints" value="endpoints"/>
                <el-option label="k8s" value="k8s"/>
              </el-select>
            </el-form-item>
            <el-form-item label="??????">
              <!--???????????? ??????????????????-->
              <el-form-item v-for="(item, index) in configData.connRpc.endpoints" :key="index">
                <el-tag closable @close="configData.connRpc.endpoints.splice(index, 1)">
                  {{ item }}
                </el-tag>
              </el-form-item>
              <el-form-item>
                <el-input v-model="newEndpoint" class="input-new-tag" @keyup.enter.native="addEndpoint"
                          placeholder="??????endpoint"/>
              </el-form-item>
            </el-form-item>
            <el-form-item label="K8S????????????">
              <el-input v-model="configData.connRpc.k8sNamespace" placeholder="?????????K8S????????????"/>
            </el-form-item>
            <el-form-item label="??????">
              <!--int???????????????-->
              <el-input-number v-model="configData.connRpc.port" :min="1" :max="65536" :step="1"/>
            </el-form-item>
            <el-form-item label="Websocket??????">
              <!--int???????????????-->
              <el-input-number v-model="configData.connRpc.websocketPort" :min="1" :max="65536" :step="1"/>
            </el-form-item>
            <el-form-item label="rsa??????">
              <!--textarea???????????????-->
              <el-input v-model="configData.connRpc.rsaPublicKey" type="textarea" autosize/>
              <el-button type="primary" @click="rsaKeyGenerate">??????</el-button>
            </el-form-item>
            <el-form-item label="rsa??????">
              <!--textarea???????????????-->
              <el-input v-model="configData.connRpc.rsaPrivateKey" type="textarea" autosize/>
            </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="text-2xl font-bold">??????rpc??????</span></el-divider>
        <div>
          <el-form :model="configData.msgRpc" label-width="120px" class="mt-4">
            <el-form-item label="????????????">
              <!--??????option endpoints k8s-->
              <el-select v-model="configData.msgRpc.discovType" placeholder="?????????????????????">
                <el-option label="endpoints" value="endpoints"/>
                <el-option label="k8s" value="k8s"/>
              </el-select>
            </el-form-item>
            <el-form-item label="??????">
              <!--???????????? ??????????????????-->
              <el-form-item v-for="(item, index) in configData.msgRpc.endpoints" :key="index">
                <el-tag closable @close="configData.msgRpc.endpoints.splice(index, 1)">
                  {{ item }}
                </el-tag>
              </el-form-item>
              <el-form-item>
                <el-input v-model="newMsgEndpoint" class="input-new-tag" @keyup.enter.native="addMsgEndpoint"
                          placeholder="??????endpoint"/>
              </el-form-item>
            </el-form-item>
            <el-form-item label="K8S????????????">
              <el-input v-model="configData.msgRpc.k8sNamespace" placeholder="?????????K8S????????????"/>
            </el-form-item>
            <el-form-item label="??????">
              <!--int???????????????-->
              <el-input-number v-model="configData.msgRpc.port" :min="1" :max="65536" :step="1"/>
            </el-form-item>
            <el-form-item label="MobPush">
              <el-form-item label="??????">
                <el-switch v-model="configData.msgRpc.mobPush.enabled" active-color="#13ce66" inactive-color="#ff4949"/>
              </el-form-item>
              <el-form-item label="????????????">
                <!--option default-->
                <el-select v-model="configData.msgRpc.mobPush.androidSound" placeholder="?????????????????????">
                  <el-option label="default" value="default"/>
                </el-select>
              </el-form-item>
              <el-form-item label="APNS??????">
                <!--option default-->
                <el-select v-model="configData.msgRpc.mobPush.apnsCateGory" placeholder="?????????APNS??????">
                  <el-option label="default" value="default"/>
                </el-select>
              </el-form-item>
              <el-form-item label="APNS????????????">
                <!--switch-->
                <el-switch v-model="configData.msgRpc.mobPush.apnsProduction" active-color="#13ce66"
                           inactive-color="#ff4949"/>
              </el-form-item>
              <el-form-item label="APNS??????">
                <!--option default-->
                <el-select v-model="configData.msgRpc.mobPush.apnsSound" placeholder="?????????APNS??????">
                  <el-option label="default" value="default"/>
                </el-select>
              </el-form-item>
              <el-form-item label="AppKey">
                <el-input v-model="configData.msgRpc.mobPush.appKey" placeholder="?????????AppKey"/>
              </el-form-item>
              <el-form-item label="AppSecret">
                <el-input v-model="configData.msgRpc.mobPush.appSecret" placeholder="?????????AppSecret"/>
              </el-form-item>
            </el-form-item>
            <el-form-item label="Pulsar">
              <el-form-item label="??????">
                <el-switch v-model="configData.msgRpc.pulsar.enabled" active-color="#13ce66" inactive-color="#ff4949"/>
              </el-form-item>
              <el-form-item label="???????????????">
                <!--int???????????????-->
                <el-input-number v-model="configData.msgRpc.pulsar.producerTimeout" :min="100" :max="100000"
                                 :step="100"/>
              </el-form-item>
              <el-form-item label="??????????????????">
                <!--int???????????????-->
                <el-input-number v-model="configData.msgRpc.pulsar.receiverQueueSize" :min="1" :max="100000" :step="1"/>
              </el-form-item>
              <el-form-item label="??????">
                <el-input v-model="configData.msgRpc.pulsar.token" placeholder="???????????????"/>
              </el-form-item>
              <el-form-item label="????????????">
                <el-input v-model="configData.msgRpc.pulsar.topicName" placeholder="?????????????????????"/>
              </el-form-item>
              <el-form-item label="VPC URL">
                <el-input v-model="configData.msgRpc.pulsar.vpcUrl" placeholder="?????????VPC URL"/>
              </el-form-item>
            </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="text-2xl font-bold">??????????????????</span></el-divider>
        <div>
          <el-form :model="configData.mgmt" label-width="120px" class="mt-4">
            <el-form-item label="http??????">
              <!--int???????????????-->
              <el-input-number v-model="configData.mgmt.httpPort" :min="1" :max="65536" :step="1"/>
            </el-form-item>
            <el-form-item label="rpc??????">
              <!--int???????????????-->
              <el-input-number v-model="configData.mgmt.rpcPort" :min="1" :max="65536" :step="1"/>
            </el-form-item>
            <el-form-item label="???????????????">
              <el-form-item label="id">
                <el-input v-model="configData.mgmt.superAdminId" placeholder="???????????????id"/>
              </el-form-item>
              <el-form-item label="??????">
                <el-input v-model="configData.mgmt.superAdminPass" placeholder="?????????????????????"/>
              </el-form-item>
            </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="text-2xl font-bold">??????rpc??????</span></el-divider>
        <div>
          <el-form :model="configData.groupRpc" label-width="120px" class="mt-4">
            <el-form-item label="??????">
              <!--int???????????????-->
              <el-input-number v-model="configData.groupRpc.port" :min="1" :max="65536" :step="1"/>
            </el-form-item>
            <el-form-item label="?????????">
              <!--int???????????????-->
              <el-input-number v-model="configData.groupRpc.maxGroupCount" :min="1" :max="10000" :step="100"/>
            </el-form-item>
            <el-form-item label="????????????">
              <!--int???????????????-->
              <el-input-number v-model="configData.groupRpc.maxGroupMemberCount" :min="100" :max="200000" :step="100"/>
            </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="text-2xl font-bold">??????rpc??????</span></el-divider>
        <div>
          <el-form :model="configData.noticeRpc" label-width="120px" class="mt-4">
            <el-form-item label="??????">
              <!--int???????????????-->
              <el-input-number v-model="configData.noticeRpc.port" :min="1" :max="65536" :step="1"/>
            </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="text-2xl font-bold">??????rpc??????</span></el-divider>
        <div>
          <el-form :model="configData.relationRpc" label-width="120px" class="mt-4">
            <el-form-item label="??????">
              <!--int???????????????-->
              <el-input-number v-model="configData.relationRpc.port" :min="1" :max="65536" :step="1"/>
            </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="text-2xl font-bold">??????rpc??????</span></el-divider>
        <div>
          <el-form :model="configData.userRpc" label-width="120px" class="mt-4">
            <el-form-item label="??????">
              <!--int???????????????-->
              <el-input-number v-model="configData.userRpc.port" :min="1" :max="65536" :step="1"/>
            </el-form-item>
            <el-form-item label="??????">
              <el-form v-model="configData.userRpc.sms">
                <el-form-item label="??????">
                  <el-switch v-model="configData.userRpc.sms.enabled" active-color="#13ce66" inactive-color="#ff4949"/>
                </el-form-item>
                <el-form-item label="??????">
                  <el-select v-model="configData.userRpc.sms.type">
                    <el-option label="?????????" value="tencent"/>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="configData.userRpc.sms.type==='tencent'">
                  <el-form v-model="configData.userRpc.sms.tencentSms">
                    <el-form-item label="AppId">
                      <el-input v-model="configData.userRpc.sms.tencentSms.appId" placeholder="?????????AppId"/>
                    </el-form-item>
                    <el-form-item label="secretId">
                      <el-input v-model="configData.userRpc.sms.tencentSms.secretId" placeholder="?????????secretId"/>
                    </el-form-item>
                    <el-form-item label="secretKey">
                      <el-input v-model="configData.userRpc.sms.tencentSms.secretKey" placeholder="?????????secretKey"/>
                    </el-form-item>
                    <el-form-item label="region">
                      <el-input v-model="configData.userRpc.sms.tencentSms.region" placeholder="?????????region"/>
                    </el-form-item>
                    <el-form-item label="??????">
                      <el-input v-model="configData.userRpc.sms.tencentSms.sign" placeholder="???????????????"/>
                    </el-form-item>
                    <el-form-item label="??????ID">
                      <el-input v-model="configData.userRpc.sms.tencentSms.templateId" placeholder="???????????????ID"/>
                    </el-form-item>
                  </el-form>
                </el-form-item>
              </el-form>
            </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="text-2xl font-bold">app??????rpc??????</span></el-divider>
        <div>
          <el-form :model="configData.appMgmtRpc" label-width="120px" class="mt-4">
            <el-form-item label="??????">
              <!--int???????????????-->
              <el-input-number v-model="configData.appMgmtRpc.port" :min="1" :max="65536" :step="1"/>
            </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="text-2xl font-bold">????????????rpc??????</span></el-divider>
        <div>
          <el-form :model="configData.imRpc" label-width="120px" class="mt-4">
            <el-form-item label="??????">
              <!--int???????????????-->
              <el-input-number v-model="configData.imRpc.port" :min="1" :max="65536" :step="1"/>
            </el-form-item>
          </el-form>
        </div>

      </div>
      <div>
        <el-button v-perms="['devops:config:edit']" type="success" @click="handleUpdate">
          ????????????
        </el-button>
        <el-button v-perms="['devops:config:edit']" type="info" @click="handleCancel">
          ????????????
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