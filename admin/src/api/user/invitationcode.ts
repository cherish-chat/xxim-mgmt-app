import request from '@/utils/request'

// 角色列表
export function invitationcodeLists(params: any) {
    return request.post({url: '/usermgmt/get/invitationcode/list/all', params})
}

// 角色列表
export function invitationcodeDetail(params: any) {
    return request.post({url: '/usermgmt/get/invitationcode/detail', params})
}

// 添加角色
export function invitationcodeAdd(params: any) {
    return request.post({
        url: '/usermgmt/add/invitationcode', params: {
            userInvitationCode: params
        }
    })
}

// 编辑角色
export function invitationcodeEdit(params: any) {
    return request.post({
        url: '/usermgmt/update/invitationcode', params: {
            userInvitationCode: params
        }
    })
}

// 删除角色
export function invitationcodeDelete(params: any) {
    return request.post({url: '/usermgmt/delete/invitationcode', params})
}
