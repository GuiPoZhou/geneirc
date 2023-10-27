import request from '@/utils/request'

// 获取委托类型
export function getBusinessConfig(businessCategoy) {
	return request({
		url: '/template/execution/run/getBusinessConfig/' + businessCategoy,
		method: 'get',
	})
}

// 待归档列表
export function getStayArchiveList(query) {
	return request({
		url: `/report/v1/manager/getStayArchiveList`,
		method: 'get',
		params: query,
	})
}

// 已归档列表
export function getHasArchiveList(query) {
	return request({
		url: `/report/v1/manager/getHasArchiveList`,
		method: 'get',
		params: query,
	})
}

// 归档操作
export function archive(data) {
	return request({
		url: '/report/v1/manager/archive',
		method: 'POST',
		data: data,
	})
}

// 取消归档操作
export function cancelArchive(data) {
	return request({
		url: `/report/v1/manager/cancelArchive`,
		method: 'POST',
		data: data,
	})
}

// 待发放列表
export function getStayIssueList(query) {
	return request({
		url: `/report/v1/manager/getStayIssueList`,
		method: 'get',
		params: query,
	})
}

// 获取发放信息
export function getissueReportInfo(id) {
	return request({
		url: `/report/v1/manager/issueReportInfo/${id}`,
		method: 'get'
	})
}

// 已发放列表
export function getHasIssueList(query) {
	return request({
		url: `/report/v1/manager/getHasIssueList`,
		method: 'get',
		params: query,
	})
}

// 发放详情
export function getIssueDetail(id) {
	return request({
		url: `/report/v1/manager/getIssueDetail/${id}`,
		method: 'get',
	})
}

// 发放操作
export function issue(data) {
	return request({
		url: `/report/v1/manager/issue`,
		method: 'post',
		data: data,
	})
}

// 取消发放操作
export function cancelIssue(data) {
	return request({
		url: '/report/v1/manager/cancelIssue',
		method: 'post',
		data: data,
	})
}


// 下载前验证
export function download(query) {
	return request({
		url: "/report/v1/manager/downloadVerify/" + query.id,
		method: 'get',
		params:query
	})
}
// 报告发放打印
export function reportReleasepint(data) {
  return request({
    url: '/report/v1/manager/printReport',
    method: 'post',
    data: data,
  })
}
