import request from '@/utils/request'

// 样品提交首页列表
export function takeSampleReferList(query) {
    return request({
        url: '/sampleSubmit/list',
        method: 'get',
        params: query
    })
}


// 查询样品提交-交样样品列表
export function getSampleDetail(query) {
    return request({
        url: '/sampleSubmit/getSampleDetail',
        method: 'get',
        params: query
    })
}


// 样品提交 手工校样 保存
export function saveSelSample(data) {
    return request({
        url: '/sampleSubmit',
        method: 'post',
        data
    })
}

// 查询已校样列表
export function getSampleSubmit(query) {
    return request({
        url: '/sampleSubmit',
        method: 'get',
        params: query
    })
}

// 删除已提交样品
export function deleteSample(id) {
    return request({
        url: `/sampleSubmit/${id}`,
        method: 'delete'
    })

}

// 样品提交详情
export function referSampleDetail(id) {
    return request({
        url: `/sampleSubmit/${id}`,
        method: 'get'
    })
}
