import request from '@/utils/request'

// app配置获取
export function getAddressBook() {
    return request.post({
        url: '/appmgmt/get/addressbook', params: {}
    })
}

// 编辑角色
export function editAddressBook(params: any) {
    return request.post({
        url: '/appmgmt/update/addressbook', params
    })
}
