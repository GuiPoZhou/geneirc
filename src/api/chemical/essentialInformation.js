import request from '@/utils/request'

//标准树查询
export function getMaterialTreelist(query) {
	return request({
		url: '/material/v1/tree/queryMaterialTree',
		method: 'get',
		params: query,
	})
}
//标准树新增
export function addMaterialtree(data) {
	return request({
		url: '/material/v1/tree/addMaterialTree',
		method: 'post',
		data,
	})
}
//标准树删除
export function deleteMaterialtree(materialTreeId) {
	return request({
		url: '/material/v1/tree/delMaterialTree/' + materialTreeId,
		method: 'get',
	})
}
//标准树修改
export function editMaterialtree(data) {
	return request({
		url: '/material/v1/tree/updateMaterialTree',
		method: 'post',
		data,
	});
}
// 调整分类
export function updateMaterialTree(data) {
	return request({
		url: '/material/v1/base/updateMaterialTree',
		method: 'post',
		data,
	});
}

//查询耗材列表
export function getMaterialList(data) {
	console.log(data);
	return request({
		url: '/material/v1/base/queryMaterialList',
		method: 'get',
		params: data,
	})
}

// 获取耗材详情
export function getMaterialDetail(id) {
	return request({
		url: "/material/v1/base/queryMaterialById/"+id,
		method: "get",
	})
}

// 新增耗材
export function addMaterial(data) {
	return request({
		url: "/material/v1/base/addMaterial",
		method: "POST",
		data,
	})
}

// 编辑耗材
export function editMaterial(data) {
	return request({
		url: "/material/v1/base/updateMaterial",
		method: "POST",
		data
	})
}

// 获取下拉列表
export function getSelectMaterialList(data) {
	return request({
		url: "/material/v1/base/querySelectMaterialList",
		method: "get",
		data
	})
}
// 删除耗材列表
export function delMaterial(ids) {
	return request({
		url: "/material/v1/base/delMaterial/"+ids,
		method: "delete",
	})
}
// 导出耗材列表
export function exportMaterial() {
	return request({
		url: "/material/v1/base/export",
		method: "get"
	})
}

// 获取下拉项
// 试剂级别
// dictType:material_grade
// 存储条件
// dictType:material_store_condition
// 耗材形态
// dictType:material_status
// 币种
// dictType: currency_type
export function getDataList(data) {
	return request({
		url: "/system/dict/data/listAll?dictType="+data,
		method: "get",
	})
}
// 库位查询
export function getStoreSiteList(params) {
	return request({
		url: "/material/v1/storeSite/queryStoreSiteList",
		method: "get",
		params
	})
}
// 下载导入模板
export function getImportTemplate() {
	return request({
		url: "/material/v1/base/getImportTemplate",
		method: "get",
		responseType: 'blob'
	})
}
// 下载导入模板
export function getMaterialStoreCount() {
	return request({
		url: "/material/v1/base/queryMaterialStoreCount",
		method: "get"
	})
}





