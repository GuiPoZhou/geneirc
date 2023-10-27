// 管理评审计划
import request from '@/utils/request'

// 新增
export function addPlan(data) {
	return request({
		url: '/managementReviewPlan',
		method: 'POST',
		data
	})
}
// 编辑
export function editPlan(data) {
	return request({
		url: '/managementReviewPlan',
		method: 'put',
		data
	})
}
// 详情
export function getPlanInfo(ids) {
	return request({
		url: `/managementReviewPlan/${ids}`,
		method: 'get',
	})
}
// 删除
export function delPlan(ids) {
	return request({
		url: `/managementReviewPlan/${ids}`,
		method: 'DELETE',
	})
}

// 修改状态

export function changeStatus(ids) {
	return request({
		url: `/managementReviewPlan/changeStatus`,
		method: 'put',
	})
}

// 列表

export function getPlanList(params) {
	return request({
		url: `/managementReviewPlan/list`,
		method: 'get',
		params
	})
}


//导出管理评审计划
export function exportManagementReviewPlan(param){
	return request({
		url: '/managementReviewPlan/export',
		method: 'get',
		params: param,
	})
}

