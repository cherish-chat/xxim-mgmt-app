import request from '@/utils/request'

// 角色列表
export function shieldwordLists(params: any) {
    return request.post({url: '/appmgmt/get/shieldword/list/all', params})
}

// 角色列表
export function shieldwordDetail(params: any) {
    return request.post({url: '/appmgmt/get/shieldword/detail', params})
}

// 添加角色
export function shieldwordAdd(params: any) {
    let words = params.word.split('\n');
    // 把空白行去掉
    words = words.filter((item: any) => {
        return item !== '';
    });
    return request.post({
        url: '/appmgmt/add/shieldword', params: {
            words: words,
        }
    })
}

// 编辑角色
export function shieldwordEdit(params: any) {
    return request.post({
        url: '/appmgmt/update/shieldword', params: {
            appMgmtShieldWord: params
        }
    })
}

// 删除角色
export function shieldwordDelete(params: any) {
    return request.post({url: '/appmgmt/delete/shieldword', params})
}
