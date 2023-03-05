import request from '@/utils/request'

// 角色列表
export function apipathLists(params: any) {
    return request.post({url: '/ms/get/apipath/list/all', params})
}

// 角色列表
export function apipathAll(params?: any) {
    return request.post({url: '/ms/get/apipath/list/all', params})
}

// 角色列表
export function apipathDetail(params: any) {
    return request.post({url: '/ms/get/apipath/detail', params})
}

// 添加角色
export function apipathAdd(params: any) {
    return request.post({
        url: '/ms/add/apipath', params: {
            apiPath: params
        }
    })
}

// 编辑角色
export function apipathEdit(params: any) {
    return request.post({
        url: '/ms/update/apipath', params: {
            apiPath: params
        }
    })
}

// 删除角色
export function apipathDelete(params: any) {
    return request.post({url: '/ms/delete/apipath', params})
}
