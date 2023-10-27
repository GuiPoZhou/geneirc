import request from "@/utils/request";
// 获取出库列表
export function queryStoreOutList(params) {
	return request({
		url: "/materialCheap/v1/storeOut/queryStoreOutList",
		method: "get",
		params
	})
}
// 新增出库
export function addMaterialStoreOut(data) {
	return request({
		url: "/materialCheap/v1/storeOut/addMaterialStoreOut",
		method: "post",
		data
	})
}
// 获取出库记录详情
export function queryStoreOutDetail(storeOutId) {
	return request({
		url: `/materialCheap/v1/storeOut/queryStoreOutDetail/${storeOutId}`,
		method: "get",
	})
}
// 修改出库记录
export function updateMaterialStoreOut(data) {
	return request({
		url: "/materialCheap/v1/storeOut/updateMaterialStoreOut",
		method: "post",
		data
	})
}
// 获取退库列表
export function queryStoreOutReturnList(params) {
	return request({
		url: "/materialCheap/v1/storeOutReturn/queryStoreOutReturnList",
		method: "get",
		params
	})
}
// 获取部门
export function getDept() {
	return request({
		url: "/system/dept/listAll",
		method: "get"
	})
}
// 获取库存
export function queryStoreListByMaterialId(materialId) {
	return request({
		url: `/materialCheap/v1/store/queryStoreListByMaterialId?materialId=${materialId}`,
		method: "get"
	})
}

// 新增退库
export function addStoreOutReturn(data) {
	return request({
		url: "/materialCheap/v1/storeOutReturn/addStoreOutReturn",
		method: "post",
		data
	})
}
// 修改退库
export function updateStoreOutReturn(data) {
	return request({
		url: "/materialCheap/v1/storeOutReturn/updateStoreOutReturn",
		method: "post",
		data
	})
}
// 删除退库
export function delStoreOutReturn(storeOutReturnIds) {
	return request({
		url: `/materialCheap/v1/storeOutReturn/delStoreOutReturn/${storeOutReturnIds}`,
		method: "get",
	})
}
// 获取退库详情
export function queryStoreOutReturnDetail(outReturnId) {
	return request({
		url: `/materialCheap/v1/storeOutReturn/queryStoreOutReturnDetail/${outReturnId}`,
		method: "get",
	})
}
// 导出
export function exportStoreOuts(query) {
  return request({
    url: '/materialCheap/v1/storeOut/export',
    method: 'get',
    params: query
  })
}
// 导出
export function exportStoreRefund(query) {
  return request({
    url: '/materialCheap/v1/storeOutReturn/export',
    method: 'get',
    params: query
  })
}
