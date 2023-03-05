import request from '@/utils/request'

// 角色列表
export function emojigroupLists(params: any) {
    return request.post({url: '/appmgmt/get/emojigroup/list/all', params})
}

// 角色列表
export function emojigroupDetail(params: any) {
    return request.post({url: '/appmgmt/get/emojigroup/detail', params})
}

// 编辑角色
export function emojigroupEdit(params: any) {
    return request.post({
        url: '/appmgmt/update/emojigroup', params: {
            appMgmtEmojiGroup: params
        }
    })
}

// 删除角色
export function emojigroupDelete(params: any) {
    return request.post({url: '/appmgmt/delete/emojigroup', params})
}
