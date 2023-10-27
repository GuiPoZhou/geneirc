import request from '@/utils/request'

// 获取未交耗材列表
export function queryWaitStoreInList(params) {
	return request({
		url: "/materialCheap/v1/storeIn/queryWaitStoreInList",
		method: "get",
		params
	})
}

// 导出未交耗材
export function exportWaitStoreIn(params) {
	return request({
		url: "/materialCheap/v1/storeIn/exportWaitStoreIn",
		method: "get",
		params
	})
}

// 获取导入模板
export function getImportTemplate() {
	return request({
		url: "/materialCheap/v1/storeIn/getImportTemplate",
		method: "get",
	})
}

// 获取库位
export function queryStoreSiteList(params) {
	return request({
		url: "/materialCheap/v1/storeSite/queryStoreSiteList",
		method: "get",
		params
	})
}

// 入库
export function addMaterialStoreIn(data) {
	return request({
		url: "/materialCheap/v1/storeIn/addMaterialStoreIn",
		method: "post",
		data
	})
}

// 获取入库记录列表
export function queryStoreInList(params) {
	return request({
		url: "/materialCheap/v1/storeIn/queryStoreInList",
		method: "get",
		params
	})
}


// 获取入库记录详情
export function queryStoreInDetail(storeInId) {
	return request({
		url: `/materialCheap/v1/storeIn/queryStoreInDetail/${storeInId}`,
		method: "get"
	})
}

// 修改入库记录
export function updateMaterialStoreIn(data) {
	return request({
		url: "/materialCheap/v1/storeIn/updateMaterialStoreIn",
		method: "post",
		data
	})
}

// 删除入库记录
export function delMaterialStoreIn(storeInIds) {
	return request({
		url: `/materialCheap/v1/storeIn/delMaterialStoreIn/${storeInIds}`,
		method: "get"
	})
}

// 导出入库记录
export function exportStoreIn(params) {
	return request({
		url: "/materialCheap/v1/storeIn/exportStoreIn",
		method: "get",
		params
	})
}

// 新增退货
export function addStoreRefund(data) {
	return request({
		url: "/materialCheap/v1/storeRefund/addStoreRefund",
		method: "post",
		data
	})
}
// 退货列表
export function queryStoreRefundList(params) {
	return request({
		url: "/materialCheap/v1/storeRefund/queryStoreRefundList",
		method: "get",
		params
	})
}
// 修改退货
export function updateStoreRefund(data) {
	return request({
		url: "/materialCheap/v1/storeRefund/updateStoreRefund",
		method: "post",
		data
	})
}

// 删除退货
export function delStoreRefund(storeRefundIds) {
	return request({
		url: `/materialCheap/v1/storeRefund/delStoreRefund/${storeRefundIds}`,
		method: "get"
	})
}
// 退货详情
export function queryStoreRefundDetail(storeRefundId) {
	return request({
		url: `/materialCheap/v1/storeRefund/queryStoreRefundDetail/${storeRefundId}`,
		method: "get",
	})
}
// 导出退货记录
export function exportStoreRefund() {
	return request({
		url: "/materialCheap/v1/storeRefund/export",
		method: "get",
	})
}
