import request from '@/utils/request'

// 角色列表
export function applineLists() {
    return request.post({url: '/server/get/app/line',})
}

// 编辑角色
export function applineEdit(params: any) {
    return request.post({
        url: '/server/update/app/line', params
    })
}
