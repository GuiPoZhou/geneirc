import request from "@/utils/request";
// 获取库存列表
export function queryStoreList(params) {
	return request({
		url: "/materialCheap/v1/store/queryStoreList",
		method: "get",
		params
	})
}
// 获取库存移动列表
export function queryStoreChangeList(params) {
	return request({
		url: "/materialCheap/v1/storeChange/queryStoreChangeList",
		method: "get",
		params
	})
}
// 获取全部库存
export function queryStoreSiteList(params) {
	return request({
		url: "/materialCheap/v1/storeSite/queryStoreSiteList",
		method: "get",
		params
	})
}
// 获取用户
export function allUseList(params) {
	return request({
		url: "/system/user/allUseList",
		method: "get",
		params
	})
}
// 新增库存移动
export function addStoreChange(data) {
	return request({
		url: "/materialCheap/v1/storeChange/addStoreChange",
		method: "post",
		data
	})
}
// 获取库存移动详情
export function queryStoreChangeDetail(storeChangeId) {
	return request({
		url: `/materialCheap/v1/storeChange/queryStoreChangeDetail/${storeChangeId}`,
		method: "get",
	})
}
// 导出
export function exportstoreChange(query) {
  return request({
    url: '/materialCheap/v1/storeChange/export',
    method: 'get',
    params: query
  })
}
// 导出
export function exportstore(query) {
  return request({
    url: '/materialCheap/v1/store/export',
    method: 'get',
    params: query
  })
}
