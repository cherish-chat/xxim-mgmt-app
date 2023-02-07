import request from '@/utils/request'

// 角色列表
export function ipblacklistLists(params: any) {
    return request.post({url: '/usermgmt/get/ipblacklist/list/all', params})
}

// 角色列表
export function ipblacklistDetail(params: any) {
    return request.post({url: '/usermgmt/get/ipblacklist/detail', params})
}

// 添加角色
export function ipblacklistAdd(params: any) {
    return request.post({
        url: '/usermgmt/add/ipblacklist', params: {
            userIpList: params
        }
    })
}

// 编辑角色
export function ipblacklistEdit(params: any) {
    return request.post({
        url: '/usermgmt/update/ipblacklist', params: {
            userIpList: params
        }
    })
}

// 删除角色
export function ipblacklistDelete(params: any) {
    return request.post({url: '/usermgmt/delete/ipblacklist', params})
}
