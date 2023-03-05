import request from '@/utils/request'

// 角色列表
export function roleLists(params: any) {
    return request.post({url: '/ms/get/role/list/all', params})
}

// 角色列表
export function roleAll(params?: any) {
    return request.post({url: '/ms/get/role/list/all', params})
}

// 角色列表
export function roleDetail(params: any) {
    return request.post({url: '/ms/get/role/detail', params})
}

// 添加角色
export function roleAdd(params: any) {
    return request.post({
        url: '/ms/add/role', params: {
            role: params
        }
    })
}

// 编辑角色
export function roleEdit(params: any) {
    return request.post({
        url: '/ms/update/role', params: {
            role: params
        }
    })
}

// 删除角色
export function roleDelete(params: any) {
    return request.post({url: '/ms/delete/role', params})
}
