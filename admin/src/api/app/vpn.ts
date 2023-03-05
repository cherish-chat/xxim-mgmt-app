import request from '@/utils/request'

// 角色列表
export function vpnLists(params: any) {
    return request.post({url: '/appmgmt/get/vpn/list/all', params})
}

// 角色列表
export function vpnDetail(params: any) {
    return request.post({url: '/appmgmt/get/vpn/detail', params})
}

// 添加角色
export function vpnAdd(params: any) {
    return request.post({
        url: '/appmgmt/add/vpn', params: {
            appMgmtVpn: params
        }
    })
}

// 编辑角色
export function vpnEdit(params: any) {
    return request.post({
        url: '/appmgmt/update/vpn', params: {
            appMgmtVpn: params
        }
    })
}

// 删除角色
export function vpnDelete(params: any) {
    return request.post({url: '/appmgmt/delete/vpn', params})
}
