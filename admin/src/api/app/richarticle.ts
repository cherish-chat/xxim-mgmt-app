import request from '@/utils/request'

// 角色列表
export function richarticleLists(params: any) {
    return request.post({url: '/appmgmt/get/richArticle/list/all', params})
}

// 角色列表
export function richarticleDetail(params: any) {
    return request.post({url: '/appmgmt/get/richArticle/detail', params})
}

// 添加角色
export function richarticleAdd(params: any) {
    return request.post({
        url: '/appmgmt/add/richArticle', params: {
            appMgmtRichArticle: params
        }
    })
}

// 编辑角色
export function richarticleEdit(params: any) {
    return request.post({
        url: '/appmgmt/update/richArticle', params: {
            appMgmtRichArticle: params
        }
    })
}

// 删除角色
export function richarticleDelete(params: any) {
    return request.post({url: '/appmgmt/delete/richArticle', params})
}
