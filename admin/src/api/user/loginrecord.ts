import request from '@/utils/request'

// 角色列表
export function loginrecordLists(params: any) {
    return request.post({url: '/usermgmt/get/loginrecord/list/all', params})
}
