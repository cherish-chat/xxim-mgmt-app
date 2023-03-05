import request from '@/utils/request'

// 角色列表
export function versionLists(params: any) {
    return request.post({url: '/appmgmt/get/version/list/all', params})
}

// 角色列表
export function versionDetail(params: any) {
    return request.post({url: '/appmgmt/get/version/detail', params})
}

// 添加角色
export function versionAdd(params: any) {
    return request.post({
        url: '/appmgmt/add/version', params: {
            appMgmtVersion: params
        }
    })
}

// 编辑角色
export function versionEdit(params: any) {
    return request.post({
        url: '/appmgmt/update/version', params: {
            appMgmtVersion: params
        }
    })
}

// 删除角色
export function versionDelete(params: any) {
    return request.post({url: '/appmgmt/delete/version', params})
}
