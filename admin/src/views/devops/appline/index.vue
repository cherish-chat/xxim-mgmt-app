<script lang="ts" setup name="config">
import {applineEdit, applineLists} from '@/api/serv/appline'

interface Cos {
  appId: string
  secretId: string
  secretKey: string
  bucketName: string
  region: string
  bucketUrl: string
}

interface Oss {
  endpoint: string
  accessKeyId: string
  accessKeySecret: string
  bucketName: string
  bucketUrl: string
}

interface Minio {
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
  bucketName: string
  ssl: boolean
  bucketUrl: string
  region: string
}

interface Kodo {
  accessKey: string
  secretKey: string
  bucketName: string
  region: string
  bucketUrl: string
  useHTTPS: boolean
}

interface Storage {
  type: string
  objectId: string
  cos: Cos | null
  oss: Oss | null
  minio: Minio | null
  kodo: Kodo | null
}

interface Config {
  config: string
  aesIv: string
  aesKey: string
  storage: Storage
}

const defaultConfig = {
  config: "",
  aesIv: "",
  aesKey: "",
  storage: {
    type: "",
    objectId: "",
    cos: {},
    oss: {},
    minio: {},
    kodo: {}
  } as Storage
} as Config
const configData = ref<Config>(defaultConfig)
const newEndpoint = ref('')
const getLists = async () => {
  const {appLineConfig} = await applineLists()
  console.log("appLineConfig", appLineConfig)
  configData.value = appLineConfig as Config
  console.log("configData", configData.value)
}

const handleCancel = async () => {
  await getLists()
}

const handleUpdate = () => {
  applineEdit({
    appLineConfig: configData.value
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

        <el-divider content-position="left"><span class="text-2xl font-bold">线路配置</span>
        </el-divider>
        <el-form :model="configData" label-width="120px" class="mt-4">
          <el-form-item label="配置">
            <el-input type="textarea" v-model="configData.config" autosize/>
          </el-form-item>
          <el-form-item label="AES密钥">
            <el-input v-model="configData.aesKey" placeholder="请输入AES密钥"/>
          </el-form-item>
          <el-form-item label="AES向量">
            <el-input v-model="configData.aesIv" placeholder="请输入AES向量"/>
          </el-form-item>
        </el-form>

        <el-divider content-position="left"><span class="text-2xl font-bold">存储配置</span></el-divider>
        <div>
          <el-form :model="configData.storage" label-width="120px" class="mt-4">
            <el-form-item label="类型">
              <el-select v-model="configData.storage.type" placeholder="请选择存储类型">
                <el-option label="COS" value="cos"></el-option>
                <el-option label="OSS" value="oss"></el-option>
                <el-option label="Minio" value="minio"></el-option>
                <el-option label="Kodo" value="kodo"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文件名">
              <el-input v-model="configData.storage.objectId" placeholder="请输入文件名"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <el-divider content-position="left" v-if="configData.storage.type === 'cos'"><span class="text-2xl font-bold">COS配置</span>
        </el-divider>
        <div v-if="configData.storage.type==='cos'">
          <el-form :model="configData.storage.cos" label-width="120px" class="mt-4">
            <el-form-item label="AppId">
              <el-input v-model="configData.storage.cos.appId" placeholder="请输入AppId"></el-input>
            </el-form-item>
            <el-form-item label="SecretId">
              <el-input v-model="configData.storage.cos.secretId" placeholder="请输入SecretId"></el-input>
            </el-form-item>
            <el-form-item label="SecretKey">
              <el-input v-model="configData.storage.cos.secretKey" placeholder="请输入SecretKey"></el-input>
            </el-form-item>
            <el-form-item label="BucketName">
              <el-input v-model="configData.storage.cos.bucketName" placeholder="请输入BucketName"></el-input>
            </el-form-item>
            <el-form-item label="Region">
              <el-input v-model="configData.storage.cos.region" placeholder="请输入Region"></el-input>
            </el-form-item>
            <el-form-item label="BucketUrl">
              <el-input v-model="configData.storage.cos.bucketUrl" placeholder="请输入BucketUrl"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <el-divider content-position="left" v-if="configData.storage.type === 'oss'"><span class="text-2xl font-bold">OSS配置</span>
        </el-divider>
        <div v-if="configData.storage.type==='oss'">
          <el-form :model="configData.storage.oss" label-width="120px" class="mt-4">
            <el-form-item label="Endpoint">
              <el-input v-model="configData.storage.oss.endpoint" placeholder="请输入Endpoint"></el-input>
            </el-form-item>
            <el-form-item label="AccessKeyId">
              <el-input v-model="configData.storage.oss.accessKeyId" placeholder="请输入AccessKeyId"></el-input>
            </el-form-item>
            <el-form-item label="AccessKeySecret">
              <el-input v-model="configData.storage.oss.accessKeySecret" placeholder="请输入AccessKeySecret"></el-input>
            </el-form-item>
            <el-form-item label="BucketName">
              <el-input v-model="configData.storage.oss.bucketName" placeholder="请输入BucketName"></el-input>
            </el-form-item>
            <el-form-item label="BucketUrl">
              <el-input v-model="configData.storage.oss.bucketUrl" placeholder="请输入BucketUrl"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <el-divider content-position="left" v-if="configData.storage.type === 'minio'"><span class="text-2xl font-bold">Minio配置</span>
        </el-divider>
        <div v-if="configData.storage.type==='minio'">
          <el-form :model="configData.storage.minio" label-width="120px" class="mt-4">
            <el-form-item label="Endpoint">
              <el-input v-model="configData.storage.minio.endpoint" placeholder="请输入Endpoint"></el-input>
            </el-form-item>
            <el-form-item label="AccessKeyId">
              <el-input v-model="configData.storage.minio.accessKeyId" placeholder="请输入AccessKeyId"></el-input>
            </el-form-item>
            <el-form-item label="AccessKeySecret">
              <el-input v-model="configData.storage.minio.accessKeySecret"
                        placeholder="请输入AccessKeySecret"></el-input>
            </el-form-item>
            <el-form-item label="BucketName">
              <el-input v-model="configData.storage.minio.bucketName" placeholder="请输入BucketName"></el-input>
            </el-form-item>
            <el-form-item label="BucketUrl">
              <el-input v-model="configData.storage.minio.bucketUrl" placeholder="请输入BucketUrl"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <el-divider content-position="left" v-if="configData.storage.type === 'kodo'"><span class="text-2xl font-bold">Kodo配置</span>
        </el-divider>
        <div v-if="configData.storage.type==='kodo'">
          <el-form :model="configData.storage.kodo" label-width="120px" class="mt-4">
            <el-form-item label="Endpoint">
              <el-input v-model="configData.storage.kodo.endpoint" placeholder="请输入Endpoint"></el-input>
            </el-form-item>
            <el-form-item label="AccessKeyId">
              <el-input v-model="configData.storage.kodo.accessKeyId" placeholder="请输入AccessKeyId"></el-input>
            </el-form-item>
            <el-form-item label="AccessKeySecret">
              <el-input v-model="configData.storage.kodo.accessKeySecret"
                        placeholder="请输入AccessKeySecret"></el-input>
            </el-form-item>
            <el-form-item label="BucketName">
              <el-input v-model="configData.storage.kodo.bucketName" placeholder="请输入BucketName"></el-input>
            </el-form-item>
            <el-form-item label="BucketUrl">
              <el-input v-model="configData.storage.kodo.bucketUrl" placeholder="请输入BucketUrl"></el-input>
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