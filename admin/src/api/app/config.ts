import request from '@/utils/request'

// app配置获取
export function configLists(userId: String) {
    return request.post({
        url: '/appmgmt/get/config/list/all', params: {
            userId: userId
        }
    })
}

// 编辑角色
export function configEdit(params: any) {
    return request.post({
        url: '/appmgmt/update/config', params
    })
}
