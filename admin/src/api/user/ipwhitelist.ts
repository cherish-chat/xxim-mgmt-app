import request from '@/utils/request'

// 角色列表
export function ipwhitelistLists(params: any) {
    return request.post({url: '/usermgmt/get/ipwhitelist/list/all', params})
}

// 角色列表
export function ipwhitelistDetail(params: any) {
    return request.post({url: '/usermgmt/get/ipwhitelist/detail', params})
}

// 添加角色
export function ipwhitelistAdd(params: any) {
    return request.post({
        url: '/usermgmt/add/ipwhitelist', params: {
            userIpList: params
        }
    })
}

// 编辑角色
export function ipwhitelistEdit(params: any) {
    return request.post({
        url: '/usermgmt/update/ipwhitelist', params: {
            userIpList: params
        }
    })
}

// 删除角色
export function ipwhitelistDelete(params: any) {
    return request.post({url: '/usermgmt/delete/ipwhitelist', params})
}
