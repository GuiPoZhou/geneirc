import request from '@/utils/request'
import qs from "qs";

//样品领用分页列表
export function getReceiveList(query) {
  return request({
    url: '/handover/v1/sampleReceive',
    method: 'get',
    params: query,
  })
}

//获取当前登录部门信息
export function getDeptInfo() {
  return request({
    url: '/system/dept/getDeptDetail',
    method: 'get',
  })
}

//手工列表
export function getManualList(query) {
  return request({
    url: '/handover/v1/sampleReceive/getManualList',
    method: 'get',
    params: query,
  })
}

//扫码
export function getScanCodeList(code,query) {
  return request({
    url: '/handover/v1/sampleReceive/getScanCodeList/'+code,
    method: 'get',
    params: query,
  })
}

//交接保存
export function saveReceive(deptId,data) {
  return request({
    url: '/handover/v1/sampleReceive/saveReceive/'+deptId,
    method: 'post',
    data: data
  })
}

//删除
export function deleteRecord(query) {
  return request({
    url: '/handover/v1/sampleReceive/delReceive',
    method: 'delete',
    params: query,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

//根据id查看详情
export function getReceive(id) {
  return request({
    url: '/handover/v1/sampleReceive/getReceive/' + id,
    method: 'get',
  })
}

//详情-删除
export function delReceiveDetail(id) {
  return request({
    url: '/handover/v1/sampleReceive/delReceiveDetail/' + id,
    method: 'delete',
  })
}

//打印
export function downloadReport(id) {
  return request({
    url: '/handover/v1/sampleReceive/downloadReport/' + id,
    method: 'get',
  })
}
/***********************************************************************************************************/
// 样品接收查询列表
export function receiveList(query) {
  return request({
    url: '/sampleManage/v1/sampleAccept/list',
    method: 'get',
    params: query
  })
}
// 样品删除
export function delreceive(ids) {
  return request({
    url: '/sampleManage/v1/sampleAccept/remove/' + ids,
    method: 'delete',
  })
}
