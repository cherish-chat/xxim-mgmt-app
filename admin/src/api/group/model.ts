import request from '@/utils/request'

// 角色列表
export function modelLists(params: any) {
    return request.post({url: '/groupmgmt/get/model/list/all', params})
}

// 角色列表
export function modelDetail(params: any) {
    return request.post({url: '/groupmgmt/get/model/detail', params})
}

// 添加角色
export function modelAdd(params: any) {
    return request.post({
        url: '/groupmgmt/add/model', params: {
            groupModel: params,
            password: params.password
        }
    })
}

// 编辑角色
export function modelEdit(params: any) {
    return request.post({
        url: '/groupmgmt/update/model', params: {
            groupModel: params,
            password: params.password
        }
    })
}

export function modelSwitch(params: any) {
    return request.post({
        url: '/groupmgmt/switch/model', params
    })
}

// 删除角色
export function modelDelete(params: any) {
    return request.post({url: '/groupmgmt/dismiss/model', params})
}

export function modelBatchInsertZombie(params: any) {
    return request.post({url: '/groupmgmt/insert/member/zombie', params})
}

export function clearZombie(params: any) {
    return request.post({url: '/groupmgmt/clear/member/zombie', params})
}
