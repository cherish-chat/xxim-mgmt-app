import request from '@/utils/request'

// 角色列表
export function modelLists(params: any) {
    return request.post({url: '/usermgmt/get/model/list/all', params})
}

// 角色列表
export function modelDetail(params: any) {
    return request.post({url: '/usermgmt/get/model/detail', params})
}

// 添加角色
export function modelAdd(params: any) {
    return request.post({
        url: '/usermgmt/add/model', params: {
            userModel: params,
            password: params.password
        }
    })
}

// 编辑角色
export function modelEdit(params: any) {
    return request.post({
        url: '/usermgmt/update/model', params: {
            userModel: params,
            password: params.password
        }
    })
}

export function modelSwitch(params: any) {
    return request.post({
        url: '/usermgmt/switch/model', params
    })
}

// 删除角色
export function modelDelete(params: any) {
    return request.post({url: '/usermgmt/delete/model', params})
}
