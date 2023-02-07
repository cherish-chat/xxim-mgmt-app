import request from '@/utils/request'

// 角色列表
export function groupLists(params: any) {
    return request.post({
        url: '/usermgmt/get/group/list/all', params: {
            ...params,
            userId: params.filter.userId
        }
    })
}
