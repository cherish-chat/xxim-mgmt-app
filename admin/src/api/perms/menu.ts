import request from '@/utils/request'

// 菜单列表
export function menuLists(params?: Record<string, any>) {
    return request.post({url: '/ms/get/menu/list/all', params})
}

// 添加菜单
export function menuAdd(params: Record<string, any>) {
    return request.post({
        url: '/ms/add/menu', params: {
            menu: {
                ...params,
                pid: params.pid.toString(),
            }
        }
    })
}

// 编辑菜单
export function menuEdit(params: Record<string, any>) {
    return request.post({
        url: '/ms/update/menu', params: {
            menu: params
        }
    })
}

// 菜单删除
export function menuDelete(params: Record<string, any>) {
    return request.post({url: '/ms/delete/menu', params})
}

// 菜单删除
export function menuDetail(params: Record<string, any>) {
    return request.post({url: '/ms/get/menu/detail', params})
}
