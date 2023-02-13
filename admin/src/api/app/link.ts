import request from '@/utils/request'

// 角色列表
export function linkLists(params: any) {
    return request.post({url: '/appmgmt/get/link/list/all', params})
}

// 角色列表
export function linkDetail(params: any) {
    return request.post({url: '/appmgmt/get/link/detail', params})
}

// 添加角色
export function linkAdd(params: any) {
    return request.post({
        url: '/appmgmt/add/link', params: {
            appMgmtLink: params
        }
    })
}

// 编辑角色
export function linkEdit(params: any) {
    return request.post({
        url: '/appmgmt/update/link', params: {
            appMgmtLink: params
        }
    })
}

// 删除角色
export function linkDelete(params: any) {
    return request.post({url: '/appmgmt/delete/link', params})
}
