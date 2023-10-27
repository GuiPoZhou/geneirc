// 管理评审实施
import request from '@/utils/request'

// 列表

export function getList(params) {
	return request({
		url: "/managementReviewPlan/implementList",
		method: "get",
		params
	})
}
// 实施计划

// 列表
export function getImplementList(params) {
	return request({
		url: "/managementReviewPlan/implement/list",
		method: "get",
		params
	})
}
// 新增
export function addImplement(data) {
	return request({
		url: "/managementReviewPlan/implement",
		method: "post",
		data
	})
}
// 编辑
export function editImplement(data) {
	return request({
		url: "/managementReviewPlan/implement",
		method: "put",
		data
	})
}
// 删除
export function delImplement(ids) {
	return request({
		url: `/managementReviewPlan/implement/${ids}`,
		method: "delete",
	})
}
// 详情
export function getImplementInfo(ids) {
	return request({
		url: `/managementReviewPlan/implement/${ids}`,
		method: "get",
	})
}


// 管评通知

// 列表
export function getNoticeList(params) {
	return request({
		url: "/managementReviewPlan/notice/list",
		method: "get",
		params
	})
}
// 新增
export function addNotice(data) {
	return request({
		url: "/managementReviewPlan/notice",
		method: "post",
		data
	})
}
// 编辑
export function editNotice(data) {
	return request({
		url: "/managementReviewPlan/notice",
		method: "put",
		data
	})
}
// 删除
export function delNotice(ids) {
	return request({
		url: `/managementReviewPlan/notice/${ids}`,
		method: "delete",
	})
}
// 详情
export function getNoticeInfo(ids) {
	return request({
		url: `/managementReviewPlan/notice/${ids}`,
		method: "get",
	})
}


// 管评会议记录

// 列表
export function getMeetingList(params) {
	return request({
		url: "/managementReviewPlan/meeting/list",
		method: "get",
		params
	})
}
// 新增
export function addMeeting(data) {
	return request({
		url: "/managementReviewPlan/meeting",
		method: "post",
		data
	})
}
// 编辑
export function editMeeting(data) {
	return request({
		url: "/managementReviewPlan/meeting",
		method: "put",
		data
	})
}
// 删除
export function delMeeting(ids) {
	return request({
		url: `/managementReviewPlan/meeting/${ids}`,
		method: "delete",
	})
}
// 详情
export function getMeetingInfo(ids) {
	return request({
		url: `/managementReviewPlan/meeting/${ids}`,
		method: "get",
	})
}

// 管评报告

// 列表
export function getReportList(params) {
	return request({
		url: "/managementReviewPlan/report/list",
		method: "get",
		params
	})
}
// 新增
export function addReport(data) {
	return request({
		url: "/managementReviewPlan/report",
		method: "post",
		data
	})
}
// 编辑
export function editReport(data) {
	return request({
		url: "/managementReviewPlan/report",
		method: "put",
		data
	})
}
// 删除
export function delReport(ids) {
	return request({
		url: `/managementReviewPlan/report/${ids}`,
		method: "delete",
	})
}
// 详情
export function getReportInfo(ids) {
	return request({
		url: `/managementReviewPlan/report/${ids}`,
		method: "get",
	})
}

// 修改状态
export function changeStatus(params) {
	return request({
		url: "/managementReviewPlan/changeStatus",
		method: "put",
		params
	})
}
// 完成情况
export function getFishInfo(planId) {
	return request({
		url: `/managementReviewPlan/queryManagementReviewPlan/${planId}`,
		method: "get",
	})
}

// 提交
export function submitAndSave(data) {
	return request({
		url: `/managementReviewPlan/report/submitAndSave`,
		method: "post",
		data
	})
}
