import request from '@/utils/request'

// 角色列表
export function connectionLists(params: any) {
    return request.post({url: '/appmgmt/get/connection/list/all', params})
}


// 删除角色
export function connectionDelete(params: any) {
    return request.post({url: '/appmgmt/kickout/connection', params})
}
