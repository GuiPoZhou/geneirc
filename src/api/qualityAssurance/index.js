import request from '@/utils/request'

// 选择人员
export function choiceUser(query) {
  return request({
    url: '/system/dept/treeSelectWithUser',
    method: 'get',
    params: query
  })
}
// 选择角色
export function roleChoiceUser(query) {
	return request({
		url: '/system/role/treeSelectWithUser',
		method: 'get',
		params: query
	})
}
// 审批流程
export function getApprovalProcess(query) {
	return request({
		url: '/v1/dynamicProcess/selectProcessDetail',
		method: 'get',
		params: query,
	})
}
