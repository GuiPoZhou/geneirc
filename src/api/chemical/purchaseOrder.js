import request from "@/utils/request";
import {getDataList} from "./essentialInformation";
// 转采购单查询
export function queryToBuyOrderList(params) {
	return request({
		url: "/material/v1/buyOrder/queryToBuyOrderList",
		method: "get",
		params
	})
}

// 订单明细转单
export function convertBuyOrder(data) {
	return request({
		url: "/material/v1/buyOrder/convertBuyOrder",
		method: "POST",
		data
	})
}

// 获取采购订单列表
export function queryBuyOrderList(data) {
	return request({
		url: "/material/v1/buyOrder/queryBuyOrderList",
		method: "get",
		params: data
	})
}
// 获取供应商
export function getSelectList() {
	return request({
		url: "material/v1/supplier/querySelectList",
		method: "get",
	})
}
// 新增采购订单
export function addBuyOrder(data) {
	return request({
		url: "/material/v1/buyOrder/addBuyOrder",
		method: "POST",
		data
	})
}
// 采购订单提交
export function submitBuyOrder(buyOrderIds) {
	return request({
		url: `/material/v1/buyOrder/submitBuyOrder/${buyOrderIds}`,
		method: "GET"
	})
}
// 获取采购单详情
export function queryBuyOrderById(buyOrderId) {
	return request({
		url: `/material/v1/buyOrder/queryBuyOrderById/${buyOrderId}`,
		method: "GET"
	})
}

// 新增订单明细
export function addBuyOrderDetail(data) {
	return request({
		url: `/material/v1/buyOrder/addBuyOrderDetail`,
		method: "POST",
		data
	})
}

// 修改采购订单
export function updateBuyOrder(data) {
	return request({
		url: `/material/v1/buyOrder/updateBuyOrder`,
		method: "POST",
		data
	})
}

// 删除订单明细
export function delBuyOrderDetail(data) {
	return request({
		url: "/material/v1/buyOrder/delBuyOrderDetail",
		method: "GET",
		params: data
	})
}

// 采购订单导出
export function exportBuyOrder(data) {
	return request({
		url: "/material/v1/buyOrder/exportBuyOrder",
		method: "GET",
		params: data
	})
}

// 删除采购订单
export function delBuyOrder(buyOrderIds) {
	return request({
		url: `/material/v1/buyOrder/delBuyOrder/${buyOrderIds}`,
		method: "GET"
	})
}

