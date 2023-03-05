import request from "@/utils/request";

export function msgLists(params: any) {
    return request.post({
        url: '/msgmgmt/get/msg/list/all', params: {
            ...params,
            convId: params.filter.convId
        }
    })
}
