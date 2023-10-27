import request from '@/utils/request'

//人员档案管理分页列表
export function getPersonnelFileList(query) {
	return request({
		url: '/personnel/v1/personnelFile',
		method: 'get',
		params: query,
	})
}

//删除
export function deleteApi(id) {
	return request({
		url: '/personnel/v1/personnelFile/' + id,
		method: 'delete',
	})
}

//新增
export function addPersonnel(data) {
	return request({
		url: '/personnel/v1/personnelFile',
		method: 'post',
		data
	})
}

//根据id查询
export function getPersonnel(id) {
	return request({
		url: '/personnel/v1/personnelFile/' + id,
		method: 'get',
	})
}

//修改
export function editPersonnel(data, id) {
	return request({
		url: '/personnel/v1/personnelFile/' + id,
		method: 'put',
		data
	})
}


// 查询用户列表
export function userList(query) {
	return request({
		url: '/personnel/v1/personnelFile/getUserList',
		method: 'get',
		params:query
	})
}

// 查询用户列表
export function getDetectCategoryList(query) {
	return request({
		url: '/personnel/v1/personnelFile/getDetectCategoryList',
		method: 'get',
		params:query
	})
}

// 查询用户列表
export function getDetectItemList(query) {
	return request({
		url: '/personnel/v1/personnelFile/getDetectItemList',
		method: 'get',
		params:query
	})
}

//人员证书信息列表(采样/检测)
export function getWorkLicenseList(query) {
	return request({
		url: '/personnel/v1/workLicense',
		method: 'get',
		params: query,
	})
}


//批量新增上证
export function addWorkLicenseBatch(data) {
	return request({
		url: '/personnel/v1/workLicense',
		method: 'post',
		data
	})
}

//人员证书信息列表(采样/检测) 批量查询列表
export function getWorkLicenseBatchList(query) {
	return request({
		url: '/personnel/v1/workLicense/batchList',
		method: 'get',
		params: query,
	})
}
