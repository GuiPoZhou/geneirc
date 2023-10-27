import request from "@/utils/request";
// 获取采购单列表
export function getBuyApplyList(params) {
	return request({
		url: "/materialCheap/v1/buyApply/queryBuyApplyList",
		method: "get",
		params
	})
}
// 获取申请进度
export function getApprovalProcess(params) {
	return request({
		url: '/materialCheap/v1/flow/queryStoreFlow',
		method: "get",
		params
	})
}
// 获取采购申请详情
export function getBuyApplyDetail(buyApplyId) {
	return request({
		url: `/materialCheap/v1/buyApply/queryBuyApplyById/${buyApplyId}`,
		method: "get",
	})
}
// 获取采购订单明细列表
export function getDetailByBuyApplyId(buyApplyId) {
	return request({
		url: `/materialCheap/v1/buyApply/queryDetailByBuyApplyId/${buyApplyId}`,
		method: "get",
	})
}
// 订单申请提交
export function submitBuyApply(buyApplyIds) {
	return request({
		url: `/materialCheap/v1/buyApply/submitBuyApply/${buyApplyIds}`,
		method: "POST"
	})
}
// 订单申请删除
export function delBuyApply(buyApplyIds) {
	return request({
		url: `/materialCheap/v1/buyApply/delBuyApply/${buyApplyIds}`,
		method: "get"
	})
}
// 订单申请新增
export function addBuyApply(data) {
	return request({
		url: "/materialCheap/v1/buyApply/addBuyApply",
		method: "POST",
		data
	})
}
// 订单申请修改
export function editBuyApply(data) {
	return request({
		url: "/materialCheap/v1/buyApply/updateBuyApply",
		method: "POST",
		data
	})
}
// 获取采购申请单号
export function getBuyApplyNo(data) {
	return request({
		url: "/materialCheap/v1/buyApply/getBuyApplyNo",
		method: "get",
		data
	})
}

// 采购申请明细添加
export function addBuyApplyDetail(data) {
	return request({
		url: "/materialCheap/v1/buyApply/addBuyApplyDetail",
		method: "post",
		data
	})
}
// 采购申请明细删除
export function delApplyDetail(data) {
	return request({
		url: "/materialCheap/v1/buyApply/delApplyDetail",
		method: "post",
		data
	})
}


