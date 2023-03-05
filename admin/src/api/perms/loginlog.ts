import request from '@/utils/request'

// 角色列表
export function loginlogLists(params: any) {
    return request.post({url: '/ms/get/loginlog/list/all', params})
}
