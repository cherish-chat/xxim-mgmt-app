import request from '@/utils/request'

// 角色列表
export function configLists() {
    return request.post({url: '/server/get/config/all',})
}

// 编辑角色
export function configEdit(params: any) {
    return request.post({
        url: '/server/update/config', params
    })
}
