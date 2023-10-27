import request from '@/utils/request'
// --------------------配置查询--------------------
// 获取页面配置
export function  getBusinessConfig(businessCategoy) {
  return request({
    url: '/template/execution/run/getBusinessConfig/' + businessCategoy,
    method: 'get'
  })
}

// --------------------列表查询--------------------
// 按委托查询列表
export function  getEntrustList(query) {
  let queryTarget = JSON.parse(JSON.stringify(query));
  queryTarget.picker = null;
  return request({
    url: '/subcontract/v1/agreement/subcontractEntrustList',
    method: 'get',
    params: queryTarget
  })
}
// 按项目查询列表
export function  getItemList(query) {
  let queryTarget = JSON.parse(JSON.stringify(query));
  queryTarget.picker = null;
  return request({
    url: '/subcontract/v1/agreement/subcontractItemList',
    method: 'get',
    params: queryTarget
  })
}

//保存
export function saveDynamicForm(executionTemplateId, executionId, dynamicFormData, saveFlag, envBusinessConfigId) {
  return request({
    url: '/v1/dynamicSubcontractAgreement/' + executionTemplateId + '/save?saveFlag='+saveFlag+'&envBusinessConfigId='+envBusinessConfigId+'&executionId=' + executionId,
    method: 'post',
    data: dynamicFormData
  })
}
//获取详细信息
export function getExecutionEditDetail(id) {
  return request({
    url: '/v1/dynamicSubcontractAgreement/' + id,
    method: 'get',
  })
}
//删除数据
export function deleteData(ids) {
  return request({
    url: '/subcontract/v1/agreement/'+ids.toString(),
    method: 'delete',
  })
}

// 分包领样分页列表
export function getLedSampleList(params) {
  return request({
    url: '/subcontract/v1/ledSample',
    method: 'get',
    params
  })
}
// 领样-查看领样进度
export function getLedSampleProgress(id) {
  return request({
    url: `/subcontract/v1/ledSample/getLedProgressList/${id}`,
    method: 'get',
  })
}
// 领样-查看领样记录
export function getLedSampleRecord(id,params) {
  return request({
    url: `/subcontract/v1/ledSample/getLedRecord/${id}`,
    method: 'get',
    params
  })
}
// 领样-待领样项目列表
export function getSearchList(id,params) {
  return request({
    url: `/subcontract/v1/ledSample/getStayLedSampleList/${id}`,
    method: 'get',
    params
  })
}

// 领样-保存
export function saveLedSample(data) {
  return request({
    url: `/subcontract/v1/ledSample`,
    method: 'post',
    data
  })
}
// 领样-删除
export function delLedSample(samples) {
  return request({
    url: `/subcontract/v1/ledSample/deleteLedRecord`,
    method: 'delete',
	  data:samples
  })
}
// 结果分页列表
export function getEntryResults(params) {
  return request({
    url: '/subcontract/v1/entryResults',
    method: 'get',
    params
  })
}
//录入检测结果列表
export function getEntryResultList(params) {
  return request({
    url: `/subcontract/v1/entryResults/getEntryResultListByList`,
    method: 'get',
    params
  })
}

//录入检测结果列表
export function getDetectReportList(params) {
  return request({
    url: `/subcontract/v1/entryResults/getDetectReportList`,
    method: 'get',
	params
  })
}

//结果保存
export function saveReportList(data) {
  return request({
    url: `/subcontract/v1/entryResults`,
    method: 'post',
    data
  })
}
