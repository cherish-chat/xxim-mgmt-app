import request from '@/utils/request'

export function fileCateAdd(params: Record<string, any>) {
    return request.post({ url: '/ms/album/cate/add', params })
}

export function fileCateEdit(params: Record<string, any>) {
    return request.post({ url: '/ms/album/cate/rename', params })
}

// 文件分类删除
export function fileCateDelete(params: Record<string, any>) {
    return request.post({ url: '/ms/album/cate/delete', params })
}

// 文件分类列表
export function fileCateLists(params: Record<string, any>) {
    return request.post({ url: '/ms/album/cate/list', params })
}

// 文件列表
export function fileList(params: Record<string, any>) {
    let jsonData = {}
    // 遍历 params.filter  把 value都转为字符串
    for (const key in params.filter) {
        if (params.filter.hasOwnProperty(key)) {
            // @ts-ignore
            jsonData[key] = params.filter[key].toString()
        }
    }
    params.filter = jsonData
    return request.post({ url: '/ms/album/list', params })
}

// 文件删除
export function fileDelete(params: Record<string, any>) {
    return request.post({ url: '/ms/album/delete', params })
}

// 文件移动
export function fileMove(params: Record<string, any>) {
    return request.post({ url: '/ms/album/move', params })
}

// 文件重命名
export function fileRename(params: { id: number; name: string }) {
    return request.post({ url: '/ms/album/rename', params })
}
