import request from '@/utils/request'

// 角色列表
export function noticeLists(params: any) {
    return request.post({url: '/appmgmt/get/notice/list/all', params})
}

// 角色列表
export function noticeDetail(params: any) {
    return request.post({url: '/appmgmt/get/notice/detail', params})
}

// 添加角色
export function noticeAdd(params: any) {
    return request.post({
        url: '/appmgmt/add/notice', params: {
            appMgmtNotice: params
        }
    })
}

// 编辑角色
export function noticeEdit(params: any) {
    return request.post({
        url: '/appmgmt/update/notice', params: {
            appMgmtNotice: params
        }
    })
}

// 删除角色
export function noticeDelete(params: any) {
    return request.post({url: '/appmgmt/delete/notice', params})
}
