import request from '@/utils/request'

// 角色列表
export function operationlogLists(params: any) {
    return request.post({url: '/ms/get/operationlog/list/all', params})
}

// 角色列表
export function operationlogDetail(params: any) {
    return request.post({url: '/ms/get/operationlog/detail', params})
}

// 添加角色
export function operationlogAdd(params: any) {
    return request.post({
        url: '/ms/add/operationlog', params: {
            ipWhiteList: params
        }
    })
}

// 编辑角色
export function operationlogEdit(params: any) {
    return request.post({
        url: '/ms/update/operationlog', params: {
            ipWhiteList: params
        }
    })
}

// 删除操作日志
export function operationlogDelete(params: any) {
    return request.post({url: '/ms/delete/operationlog', params})
}
