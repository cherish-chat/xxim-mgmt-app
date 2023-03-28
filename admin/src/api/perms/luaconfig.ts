import request from '@/utils/request'

// 角色列表
export function luaconfigLists(params: any) {
    return request.post({url: '/ms/get/luaconfig/list/all', params})
}

// 角色列表
export function luaconfigDetail(params: any) {
    return request.post({url: '/ms/get/luaconfig/detail', params})
}

// 添加角色
export function luaconfigAdd(params: any) {
    return request.post({
        url: '/ms/add/luaconfig', params: {
            luaConfig: params
        }
    })
}

// 编辑角色
export function luaconfigEdit(params: any) {
    return request.post({
        url: '/ms/update/luaconfig', params: {
            luaConfig: params
        }
    })
}

// 删除角色
export function luaconfigDelete(params: any) {
    return request.post({url: '/ms/delete/luaconfig', params})
}
