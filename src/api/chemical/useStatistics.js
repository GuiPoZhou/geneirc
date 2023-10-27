import request from "@/utils/request";

// 获取领用统计列表
export function queryUseReportList(params) {
	return request({
		url: "/material/v1/useReport/queryUseReportList",
		method: "get",
		params
	})
}

// 导出领用统计列表
export function exportStoreIn(params) {
	return request({
		url: "/material/v1/useReport/export",
		method: "get",
		params
	})
}
