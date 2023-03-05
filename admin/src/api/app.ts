import request from '@/utils/request'

// 配置
export function getConfig() {
    return request.post({ url: '/ms/config' })
}

// 工作台主页
export function getWorkbench() {
    return request.post({ url: '/ms/stats' })
}
