import request from '@/utils/request'

// 角色列表
export function defaultconvLists(params: any) {
    return request.post({url: '/usermgmt/get/defaultconv/list/all', params})
}

// 角色列表
export function defaultconvDetail(params: any) {
    return request.post({url: '/usermgmt/get/defaultconv/detail', params})
}

// 添加角色
export function defaultconvAdd(params: any) {
    return request.post({
        url: '/usermgmt/add/defaultconv', params: {
            userDefaultConv: params
        }
    })
}

// 编辑角色
export function defaultconvEdit(params: any) {
    return request.post({
        url: '/usermgmt/update/defaultconv', params: {
            userDefaultConv: params
        }
    })
}

// 删除角色
export function defaultconvDelete(params: any) {
    return request.post({url: '/usermgmt/delete/defaultconv', params})
}
