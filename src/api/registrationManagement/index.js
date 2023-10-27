import request from '@/utils/request'

//省市区查询
export function cityslist(query) {
  return request({
    url: '/v1/district/listAll',
    method: 'get',
    params: query
  })
}
// 登记查询列表
export function sampleManagerList(query) {
  return request({
    url: '/sampleManager/list',
    method: 'get',
    params: query
  })
}
// 登记新增
export function addSample(data) {
  return request({
    url: '/sampleManager/addSample',
    method: 'post',
    data:data
  })
}
// 修改新增
export function updateSample(data) {
  return request({
    url: '/sampleManager/updateSample',
    method: 'post',
    data:data
  })
}
// 人员分类查询
export function getpeoplelist(query) {
  return request({
    url: '/bs/ps/tp/listLive2',
    method: 'get',
    params: query
  })
}
// 删除
export function deleteSampleByIds(sampleIds) {
  return request({
    url: '/sampleManager/deleteSampleByIds/' + sampleIds,
    method: 'delete'
  })
}
// 受检记录查询
export function querySampleCheckList(sampleId) {
  return request({
    url: '/sampleManager/querySampleCheckList/' + sampleId,
    method: 'get'
  })
}
// 下载导入模板
export function getImportTemplate() {
  return request({
    url: "/sampleManager/getImportTemplate",
    method: "get",
    responseType: 'blob'
  })
}
// 导出
export function exportPeople(query) {
  return request({
    url: '/sampleManager/export',
    method: 'get',
    params: query
  })
}
// 查询国籍
export function listAllCountryList() {
  return request({
    url: '/v1/district/listAllCountryList',
    method: 'get',
  })
}
