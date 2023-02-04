import request from '@/utils/request'

// 角色列表
export function configLists() {
    return request.post({url: '/appmgmt/get/config/list/all',})
}

// 编辑角色
export function configEdit(params: any) {
    return request.post({
        url: '/appmgmt/update/config', params
    })
}
