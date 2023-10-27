import request from '@/utils/request'

/************************************样品出库**************************************************/

// 样品出库查询列表
export function deliveryList(query) {
  return request({
    url: '/sampleManage/v1/sampleOutRecord/list',
    method: 'get',
    params: query
  })
}
// 样品信息查询接口
export function samplecodeQuery(sampleCode) {
  return request({
    url: '/sampleManage/v1/commonQuery/querySampleInfo/' + sampleCode,
    method: 'get'
  })
}
// 样品出库
export function sampleoutRecord(data) {
  return request({
    url: '/sampleManage/v1/sampleOutRecord/add',
    method: 'post',
    data: data
  })
}
// 样品出库删除
export function delsampleoutRecord(ids) {
  return request({
    url: '/sampleManage/v1/sampleOutRecord/remove/' + ids,
    method: 'delete'
  })
}

/************************************留样入库**************************************************/

// 留样入库查询列表
export function sampleBackRecordList(query) {
  return request({
    url: '/sampleManage/v1/sampleBackRecord/list',
    method: 'get',
    params: query
  })
}
// 留样入库
export function sampleoutPutin(data) {
  return request({
    url: '/sampleManage/v1/sampleBackRecord/add',
    method: 'post',
    data: data
  })
}
// 留样入库删除
export function delsampleoutPutin(ids) {
  return request({
    url: '/sampleManage/v1/sampleBackRecord/remove/' + ids,
    method: 'delete'
  })
}
// 查看审批记录
export function detailRecord(query) {
  return request({
    url: '/sampleManage/v1/sampleHandleRecord/queryHisAuditByBackRecordId',
    method: 'get',
    params: query
  })
}

/************************************样品流转**************************************************/
// 样品流转查询列表
export function sampleCirculationList(query) {
  return request({
    url: '/sampleManage/v1/sampleTransferRecord/list',
    method: 'get',
    params: query
  })
}
// 样品流转
export function sampleCirculation(data) {
  return request({
    url: '/sampleManage/v1/sampleTransferRecord/add',
    method: 'post',
    data: data
  })
}
// 样品流转删除
export function delsampleCirculation(ids) {
  return request({
    url: '/sampleManage/v1/sampleTransferRecord/remove/' + ids,
    method: 'delete'
  })
}
/************************************样品处理**************************************************/
// 样品处理查询列表
export function sampleHandlingList(query) {
  return request({
    url: '/sampleManage/v1/sampleHandleRecord/list',
    method: 'get',
    params: query
  })
}
// 申请处理样品列表
export function HandlingacceptList(query) {
  return request({
    url: '/sampleManage/v1/sampleBackRecord/querylistByIds',
    method: 'get',
    params: query
  })
}
// 提交样品处理申请
export function submitHandlingaccept(data) {
  return request({
    url: '/sampleManage/v1/recordFlow/addPrehandleRecord',
    method: 'post',
    data: data
  })
}
// 提交样品处理申请
export function submitHandling(data) {
  return request({
    url: '/sampleManage/v1/recordFlow/addhandleRecord',
    method: 'post',
    data: data
  })
}