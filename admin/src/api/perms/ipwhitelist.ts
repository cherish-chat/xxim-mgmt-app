import request from '@/utils/request'

// 角色列表
export function ipwhitelistLists(params: any) {
    return request.post({url: '/ms/get/ipwhitelist/list/all', params})
}

// 角色列表
export function ipwhitelistDetail(params: any) {
    return request.post({url: '/ms/get/ipwhitelist/detail', params})
}

// 添加角色
export function ipwhitelistAdd(params: any) {
    return request.post({
        url: '/ms/add/ipwhitelist', params: {
            ipWhiteList: params
        }
    })
}

// 编辑角色
export function ipwhitelistEdit(params: any) {
    return request.post({
        url: '/ms/update/ipwhitelist', params: {
            ipWhiteList: params
        }
    })
}

// 删除角色
export function ipwhitelistDelete(params: any) {
    return request.post({url: '/ms/delete/ipwhitelist', params})
}
