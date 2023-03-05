<template>
  <div class="workbench">
    <div class="md:flex">
      <el-card class="!border-none mb-4 flex-1" shadow="never">
        <template #header>
          <div>
            <span class="card-title">今日数据</span>
          </div>
        </template>

        <div class="flex flex-wrap">
          <div class="w-1/2 md:w-1/4">
            <div class="leading-10">新增注册</div>
            <div class="text-6xl">{{ workbenchData.today.newUser }}</div>
          </div>
          <div class="w-1/2 md:w-1/4">
            <div class="leading-10">新增群聊</div>
            <div class="text-6xl">{{ workbenchData.today.newGroup }}</div>
          </div>
          <div class="w-1/2 md:w-1/4">
            <div class="leading-10">消息数量</div>
            <div class="text-6xl">{{ workbenchData.today.todayMsg }}</div>
          </div>
          <div class="w-1/2 md:w-1/4">
            <div class="leading-10">发消息人数</div>
            <div class="text-6xl">{{ workbenchData.today.todayMsgUser }}</div>
          </div>
        </div>
        <div class="flex flex-wrap">
          <div class="w-1/2 md:w-1/4">
            <div class="leading-10">活跃群聊</div>
            <div class="text-6xl">{{ workbenchData.today.todayAliveGroup }}</div>
          </div>
          <div class="w-1/2 md:w-1/4">
            <div class="leading-10">活跃单聊</div>
            <div class="text-6xl">{{ workbenchData.today.todayAliveSingle }}</div>
          </div>
          <div class="w-1/2 md:w-1/4">
            <div class="leading-10">活跃用户</div>
            <div class="text-6xl">{{ workbenchData.today.todayAliveUser }}</div>
          </div>
          <div class="w-1/2 md:w-1/4">
            <div class="leading-10">新加好友</div>
            <div class="text-6xl">{{ workbenchData.today.todayNewFriend }}</div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="md:flex">
      <el-card class="flex-1 !border-none md:mr-4 mb-4" shadow="never">
        <template #header>
          <span>每日数据趋势</span>
        </template>
        <div>
          <vCharts
              style="height: 350px"
              :option="workbenchData.visitorOption"
              :autoresize="true"
          />
        </div>
      </el-card>
      <el-card class="!border-none mb-4" shadow="never" v-if="false">
        <template #header>
          <span>服务支持</span>
        </template>
        <div>
          <div v-for="(item, index) in workbenchData.support" :key="index">
            <div
                class="flex items-center pb-10 pt-10"
                :class="{
                                'border-b border-br': index == 0
                            }"
            >
              <img width="120" height="120" class="flex-none" :src="item.image"/>
              <div class="ml-2">
                <div>{{ item.title }}</div>
                <div class="text-tx-regular text-xs mt-4">{{ item.desc }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup name="workbench">
import {getWorkbench} from '@/api/app'
import qq_group from './image/qq_group.png'
import customer_service from './image/customer_service.png'
//@ts-ignore
import vCharts from 'vue-echarts'

// 表单数据
const workbenchData: any = reactive({
  support: [
    {
      image: qq_group,
      title: '扫码进入QQ交流群',
      desc: '疑难疑点 进入QQ群'
    },
    {
      image: customer_service,
      title: '添加企业客服微信',
      desc: '想了解更多请添加客服'
    }
  ],
  today: {}, // 今日数据

  visitorOption: {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisTick: {
        show: false
      },
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: [
      {
        type: 'value',
        axisTick: {
          show: false
        },
        name: '数量'
      }
    ],
    legend: {
      data: ['访问量', '日活']
    },
    calculable: true,
    tooltip: {
      trigger: 'axis'
    },
    series: [
      {
        name: '访问量',
        data: [0, 1, 2, 3, 4, 5, 6],
        type: 'line',
        stack: '总量',
      },
      {
        name: '日活',
        data: [32, 1, 3, 14, 51, 77, 7],
        type: 'line',
        stack: '总量',
      },
    ]
  }
})

// 获取工作台主页数据
const getData = async () => {
  const res = await getWorkbench()
  workbenchData.today = res.today

  // 清空echarts 数据
  workbenchData.visitorOption.xAxis.data = []
  workbenchData.visitorOption.series[0].data = []

  // 写入从后台拿来的数据
  workbenchData.visitorOption.xAxis.data = res.dates
  workbenchData.visitorOption.legend.data = res.legend
  workbenchData.visitorOption.series = res.series
}

getData()
</script>

<style lang="scss" scoped></style>
