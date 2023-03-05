import request from '@/utils/request'

// 角色列表
export function friendLists(params: any) {
    return request.post({
        url: '/usermgmt/get/friend/list/all', params: {
            ...params,
            userId: params.filter.userId
        }
    })
}

export function friendDelete(params: any) {
    return request.post({url: '/usermgmt/delete/friend', params})
}