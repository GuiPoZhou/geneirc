
import request from '@/utils/request'
//编码发布分页列表
export function getCodeReleaseList(query) {
    return request({
        url: '/v1/sampleCoding/getCodeReleaseList',
        method: 'get',
        params: query,
    })
}

//查看样品编码（检测类别查询）
export function getCodeReleaseDetectType(id) {
    return request({
        url: '/v1/sampleCoding/getSampleCodingDetailByDetectType/' + id,
        method: 'get',
    })
}
//查看样品编码
export function seeSampleCodingList(params, id) {
    return request({
        url: '/v1/sampleCoding/getSampleCodingDetail/' + id,
        method: 'get',
        params
    })
}
//发布和取消发布发布
export function getReleaseUpdate(params, id) {
    return request({
        url: '/v1/sampleCoding/releaseUpdate/' + id,
        method: 'put',
        params
    })
}
//删除
export function deleteSampleCoding(id) {
    return request({
        url: '/v1/sampleCoding/' + id,
        method: 'delete',
    })
}
//打印编码
export function printCode(params, id) {
    return request({
        url: '/v1/sampleCoding/downloadReport/' + id,
        method: 'get',
        params
    })
}

//打印标签(未使用)
export function printLabelAll(params, id) {
    return request({
        url: '/v1/sampleCoding/printLabel/' + id,
        method: 'put',
        params
    })

}


//根据协议id获取打印标签模板
export function getLabelTemplate(agreementId) {
	return request({
		url: '/v1/sampleCoding/printLabel/' + agreementId,
		method: 'get',
	})
}
