import request from '@/utils/request'

//结果录入列表1
export function getReasultList(query) {
    return request({
        url: '/resultsEntry/v1/detectionTaskNew',
        method: 'get',
        params: query,
    })
}


//录入结果列表1
export function selectByDetectionIds(query) {
    return request({
        url: '/resultsEntry/v1/detectionTaskNew/selectByDetectionIds',
        method: 'get',
        params: query,
    })
}

//录入结果提交接口
export function recordResultsSubmit(data) {
    return request({
        url: '/resultsEntry/v1/detectionTaskNew/submit',
        method: 'post',
        data
    })
}



//获取ELN表单配置
export function getELNConfig(checkId) {
  return request({
    url: '/elnRecord/template/' + checkId,
    method: 'get'
  })
}

//获取ELN表单数据
export function getELNDetail(executionTemplateId, executionId) {
  return request({
    url: '/v1/dynamicELN/' + executionTemplateId + '?executionId=' + executionId,
    method: 'get'
  })
}

//获取ELN表单数据
export function saveELNData(executionTemplateId, executionId, dynamicFormData) {
  return request({
    url: 'v1/dynamicELN/' + executionTemplateId + '/save?executionId=' + executionId,
    method: 'post',
    data: dynamicFormData
  })
}

export function  getPDFValue(url, queryParam) {
  return request({
    url: url,
    method: 'get',
    params: queryParam
  })
}
