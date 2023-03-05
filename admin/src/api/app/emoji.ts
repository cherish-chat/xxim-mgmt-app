import request from '@/utils/request'

// 角色列表
export function emojiLists(params: any) {
    return request.post({url: '/appmgmt/get/emoji/list/all', params})
}

// 角色列表
export function emojiDetail(params: any) {
    return request.post({url: '/appmgmt/get/emoji/detail', params})
}

// 添加角色
export function emojiAdd(params: any) {
    return request.post({
        url: '/appmgmt/add/emoji', params: {
            appMgmtEmoji: params
        }
    })
}

// 编辑角色
export function emojiEdit(params: any) {
    return request.post({
        url: '/appmgmt/update/emoji', params: {
            appMgmtEmoji: params
        }
    })
}

// 删除角色
export function emojiDelete(params: any) {
    return request.post({url: '/appmgmt/delete/emoji', params})
}
