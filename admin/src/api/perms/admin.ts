import request from '@/utils/request'

// 管理员列表
export function adminLists(params: any) {
    return request.post({url: '/ms/get/admin/list/all', params})
}

// 管理员添加
export function adminAdd(params: any) {
    return request.post({
        url: '/ms/add/admin', params: {
            user: params
        }
    })
}

// 管理员编辑
export function adminDetail(params: any) {
    return request.post({url: '/ms/get/admin/detail', params})
}

// 管理员编辑
export function adminEdit(params: any) {
    return request.post({
        url: '/ms/update/admin', params: {
            user: params
        }
    })
}

// 管理员删除
export function adminDelete(params: any) {
    return request.post({url: '/ms/delete/admin', params})
}

// 管理员删除
export function adminStatus(params: any) {
    return request.post({url: '/ms/switch/admin/status', params})
}
