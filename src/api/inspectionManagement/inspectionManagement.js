import request from '@/utils/request'

/************************委托供应商*********************************/

// 查询委托供应商列表
export function entrustSupplierList(query) {
  return request({
    url: '/entrustSupplier/list',
    method: 'get',
    params: query
  })
}
// 委托供应商状态修改
export function entrustSupplierStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/entrustSupplier/changeStatus',
    method: 'put',
    data: data
  })
}
// 新增委托供应商
export function addEntrustSupplier(entrustSupplier) {
  return request({
    url: '/entrustSupplier',
    method: 'post',
    data: entrustSupplier
  })
}
// 委托供应商详情
export function EntrustSupplierDetail(id) {
  return request({
    url: '/entrustSupplier/' + id,
    method: 'get'
  })
}
// 修改委托供应商
export function editEntrustSupplier(entrustSupplier){
  return request({
    url:'/entrustSupplier',
    method:'put',
    data: entrustSupplier
  })
}
// 删除委托供应商
export function delEntrustSupplier(id) {
  return request({
    url: '/entrustSupplier/' + id,
    method: 'delete'
  })
}
// 委托供应商重置密码
export function resetpassEntrustSupplier(resetPwd ){
  return request({
    url:'/entrustSupplier/resetPwd',
    method:'put',
    data: resetPwd
  })
}
// 退回记录
export function returnRecord(id) {
  return request({
    url: '/entrustInspection/returnRecord/' + id,
    method: 'get'
  })
}
/************************委托报检*********************************/
// 查询委托报检列表
export function entrustInspectionList(query) {
  return request({
    url: '/entrustInspection/list',
    method: 'get',
    params: query
  })
}
export function getGroupList(query) {
  return request({
    url: 'standard/v1/itMeGroups/getGroupList',
    method: 'get',
    params: query
  })
}
// 省查询
export function proviceList(query) {
  return request({
    url: '/v1/district/listProvince',
    method: 'get',
    params: query
  })
}
// 市查询
export function cityList(query) {
  return request({
    url: '/v1/district/listCity',
    method: 'get',
    params: query
  })
}
// 区查询
export function areaList(query) {
  return request({
    url: '/v1/district/listArea',
    method: 'get',
    params: query
  })
}
// 街道查询
export function streetsList(query) {
  return request({
    url: '/v1/district/listStreet',
    method: 'get',
    params: query
  })
}
// 新增委托报检
export function addEntrust(inspection){
  return request({
    url:'/entrustInspection',
    method:'post',
    data: inspection
  })
}
// 委托报检详情
export function detailEntrust(id){
  return request({
    url:'/entrustInspection/' + id,
    method: 'get'
  })
}
// 委托报检修改
export function editEntrust(resetPwd ){
  return request({
    url: '/entrustInspection',
    method:'put',
    data: resetPwd
  })
}
// 复制委托报检
export function copyEntrust(id){
  return request({
    url:'/entrustInspection/copy/' + id,
    method: 'get'
  })
}
// 删除委托报检
export function delEntrust(id){
  return request({
    url:'/entrustInspection/remove/' + id,
    method: 'delete'
  })
}
// 撤回委托报检
export function returnEntrust(id){
  return request({
    url:'/entrustInspection/recall/' + id,
    method: 'get'
  })
}
// 批量提交委托报检
export function allsubEntrust(ids){
  return request({
    url:'/entrustInspection/commit/' + ids,
    method: 'get'
  })
}

/************************委托受理*********************************/

// 查询委托待受理列表
export function watingacceptList(query) {
  return request({
    url: '/entrustAcceptance/pendingList',
    method: 'get',
    params: query
  })
}
// 委托受理详情
export function detailAccept(id){
  return request({
    url:'/entrustAcceptance/' + id,
    method: 'get'
  })
}
// 受理
export function getAccept(inspection){
  return request({
    url: '/entrustAcceptance',
    method:'put',
    data: inspection
  })
}
// 退回
export function returnAccept(id,query){
  return request({
    url: '/entrustAcceptance/return/' + id,
    method:'get',
    params: query
  })
}
// 查询委托待已理列表
export function alreadyList(query) {
  return request({
    url: '/entrustAcceptance/acceptedList',
    method: 'get',
    params: query
  })
}
// 撤销受理
export function revokeAccept(ids){
  return request({
    url: '/entrustAcceptance/recall/' + ids,
    method:'get'
  })
}
// 下发任务
export function distributionTask(id){
  return request({
    url: '/entrustAcceptance/newTask/' + id,
    method:'get'
  })
}
// 撤销受理前认证是否存在已收款的委托
export function checkrevokeAccept(ids){
  return request({
    url: '/entrustAcceptance/checkRecall/' + ids,
    method:'get'
  })
}
// 检测项目查询
export function getEntrustItemslist(entrustId){
  return request({
    url: '/entrustAcceptance/queryEntrustItems/' + entrustId,
    method:'get'
  })
}
// 委托受理标准查询树
export function getStandardProduction(query) {
  return request({
    url: '/entrustParameterStandard/queryStandardProductionByEntrustId',
    method: 'get',
    params: query
  })
}
// 委托受理检测项目添加
export function addEntrustItems(data){
  return request({
    url:'/entrustAcceptance/addEntrustItems',
    method:'post',
    data: data
  })
}
// 检测项目删除
export function delentrustItemsIds(entrustItemsIds){
  return request({
    url: '/entrustAcceptance/delEntrustItems/' + entrustItemsIds,
    method:'get'
  })
}
// 委托受理检测项目指标指定
export function standardProductionIds(data){
  return request({
    url: '/entrustParameterStandard/updateTaskStandard',
    method:'post',
    data: data
  })
}
// 委托受理判定标准查询
export function standardProductionById(standardProductionId){
  return request({
    url: '/decideStandard/v1/standardProduction/queryStandardProductionById/' + standardProductionId,
    method:'get'
  })
}
// 委托受理检测项目指标查询List
export function getTestParametersStandards(entrustId){
  return request({
    url: '/entrustParameterStandard/queryItemSdandardByEntrustId/' + entrustId,
    method:'get'
  })
}
// 委托受理判定指标取消
export function cancelParametersStandards(data){
  return request({
    url: '/entrustParameterStandard/cancelParametersStandards',
    method:'post',
    data: data
  })
}
// 获取判定标准
export function selectAllStandard(){
	return request({
		url: '/decideStandard/v1/standard/selectAllStandard',
		method:'get'
	})
}
//获取推送物资详情
export function pushReportDetail(id){
	return request({
		url: `/material/inspection/pushReportDetail/${id}`,
		method:'get'
	})
}

//推送检验结果
export function pushReportResult(data){
	return request({
		url: '/material/inspection/pushReportResult',
		method:'post',
		data: data
	})
}

//获取已受理列表
export function getPushList(query){
	return request({
		url: '/material/inspection/pushList',
		method:'get',
		params: query
	})
}

