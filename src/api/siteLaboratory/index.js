import request from '@/utils/request'

const authCode = 'SQS-2020-01'

// 获取字典
export function getListAll(key) {
	return request({
		url: '/system/dict/data/listAll',
		method: 'get',
		params: {dictType: key},
	})
}

// 设计配合比查询列表
export function getDesignRatioList(query) {
	return request({
		url: '/siteLab/v1/designRatio/queryDesignRatioList',
		method: 'get',
		params: query,
		// headers: {authCode}
	})
}

// 设计配合比查询列表有效
export function getDesignRatioListValid(query) {
	return request({
		url: '/siteLab/v1/designRatio/queryAvailableDesignRatioList',
		method: 'get',
		params: query,
		// headers: {authCode}
	})
}

// 设计配合比数据推送
export function designRatioDataPush(id) {
	return request({
		url: `/siteLab/v1/designRatio/pushDesignRatio/${id}`,
		method: 'get'
	})
}

// 新增配合比
export function addDesignRatio(data) {
	return request({
		url: `/siteLab/v1/designRatio/addDesignRatio`,
		method: "post",
		data,
		// headers: {authCode}
	})
}

// 获取设计配合比详情
export function getDesignRatioDetail(designRatioId) {
	return request({
		url: `/siteLab/v1/designRatio/queryDesignRatioDetail/${designRatioId}`,
		method: 'get',
		// headers: {authCode}
	})
}

// 删除设计配合比
export function delDesignRatio(designRatioIds) {
	return request({
		url: `/siteLab/v1/designRatio/delDesignRatio/${designRatioIds}`,
		method: 'get',
		// headers: {authCode}
	})
}

// 修改设计配合比
export function editDesignRatio(data) {
	return request({
		url: '/siteLab/v1/designRatio/updateDesignRatio',
		method: 'POST',
		data,
		// headers: {authCode}
	})
}

// 导出设计配合比
export function exportDesignRatioList(query) {
	return request({
		url: '/siteLab/v1/designRatio/export',
		method: 'get',
		params: query,
		// headers: {authCode}
	})
}

// 开盘令查询列表
export function getBuildMixList(params) {
	return request({
		url: '/siteLab/v1/buildMix/queryBuildMixList',
		method: 'get',
		params,
		// headers: {authCode}
	})
}

// 开盘令/配料单修改
export function editBuildMix(data) {
	return request({
		url: '/siteLab/v1/buildMix/update',
		method: 'post',
		data,
		// headers: {authCode}
	})
}

// 开盘令/配料单详情
export function getBuildMixDetail(buildMixId) {
	return request({
		url: `/siteLab/v1/buildMix/queryDetail/${buildMixId}`,
		method: 'get',
		// headers: {authCode}
	})
}

// 获取施工配料单列表
export function getBuildMixOrderList(params) {
	console.log(params)
	return request({
		url: `/siteLab/v1/buildMix/queryBuildMixOrderList`,
		method: 'get',
		params,
		// headers: {authCode}
	})
}

// 强度指标修改
export function editStrongData(data) {
	return request({
		url: '/siteLab/v1/buildMix/updateStrongData',
		method: 'post',
		data,
		// headers: {authCode}
	})
}

// 性能指标修改
export function editPerformanceData(data) {
	return request({
		url: '/siteLab/v1/buildMix/updatePerformanceData',
		method: 'post',
		data,
		// headers: {authCode}
	})
}

// 开盘令导出
export function mixExport(params) {
	return request({
		url: `/siteLab/v1/buildMix/export`,
		method: 'get',
		params,
		// headers: {authCode}
	})
}

// 查询试验室基本信息
export function getLabSiteProject(params) {
	return request({
		url: `/siteLab/v1/siteProject/queryLabSiteProject`,
		method: 'get',
		params,
		// headers: {authCode}
	})
}

// 查询试验室文件材料
export function getLabSiteProjectFile(projectId) {
	return request({
		url: `/queryLabSiteProjectFile/${projectId}`,
		method: 'get',
		// headers: {authCode}
	})
}

// 添加文件材料
export function addLabSiteProjectFile(data) {
	return request({
		url: '/siteLab/v1/siteProject/addLabSiteProjectFile',
		method: 'post',
		data,
		// headers: {authCode}
	})
}

// 修改文件材料
export function editLabSiteProjectFile(data) {
	return request({
		url: '/siteLab/v1/siteProject/updateLabSiteProjectFile',
		method: 'post',
		data,
		// headers: {authCode}
	})
}

// 删除文件材料
export function delLabSiteProjectFile(projectFileIds) {
	return request({
		url: `/siteLab/v1/siteProject/delLabSiteProjectFile/${projectFileIds}`,
		method: 'get',
		// headers: {authCode}
	})
}

// 查询文件材料详情
export function getLabSiteProjectFileDetail(projectFileId) {
	return request({
		url: `/siteLab/v1/siteProject/queryLabSiteProjectFileDetail/${projectFileId}`,
		method: 'get',
		// headers: {authCode}
	})
}

// 查询试验室文件材料
export function getFileList(projectId) {
	return request({
		url: `/siteLab/v1/siteProject/queryLabSiteProjectFile/${projectId}`,
		method: 'get',
		// headers: {authCode}
	})
}
// 外委报告根据编号查询数量
export function getMasterNumberQuery(params) {
	return request({
		url: `/siteLab/v1/siteProjectReport/queryReportCodeCount`,
		method: 'get',
		params,
		// headers: {authCode}
	})
}
// 查询外委试验室
export function getMasterQueryList(params) {
	return request({
		url: `/siteLab/v1/siteProjecOutsideLab/masterQueryList`,
		method: 'get',
		params,
		// headers: {authCode}
	})
}
// 查询外委试验室
export function getOutsideList(params) {
	return request({
		url: `/siteLab/v1/siteProjecOutsideLab/queryList`,
		method: 'get',
		params,
		// headers: {authCode}
	})
}

// 添加外委报告树
export function addDevtree(data) {
	return request({
		url: '/projectReport/v1/tree/addProjectReportTree',
		method: 'post',
		data,
		// headers: {authCode}
	})
}

// 修改外委报告树
export function editDevtreeList(data) {
	return request({
		url: `/projectReport/v1/tree/updateProjectReportTree`,
		method: 'post',
		data,
		// headers: {authCode}
	})
}

// 删除外委报告树
export function deleteDevtree(projectReportTreeId) {
	return request({
		url: `/projectReport/v1/tree/delProjectReportTree/${projectReportTreeId}`,
		method: 'get',
		// headers: {authCode}
	})
}

// 查询外委报告树
export function getDevtreeList(params) {
	return request({
		url: `/projectReport/v1/tree/queryProjectReportTree`,
		method: 'get',
		params,
		headers: {authCode: !params || !params.authCode ? authCode : null}
	})
}


// 删除外委报告
export function delSiteProjectReport(projectReportIds, authCode1) {
	return request({
		url: `/siteLab/v1/siteProjectReport/delSiteProjectReport/${projectReportIds}`,
		method: 'get',
		params: {
			authCode: authCode1
		},
		headers: {authCode: !authCode1 ? authCode : null}
	})
}

// 外委报告添加
export function addSiteProjectReport(data) {
	return request({
		url: `/siteLab/v1/siteProjectReport/addSiteProjectReport`,
		method: 'post',
		data,
		// headers: {authCode}
	})
}

// 外委报告修改
export function updateSiteProjectReport(data) {
	return request({
		url: `/siteLab/v1/siteProjectReport/updateSiteProjectReport`,
		method: 'post',
		data,
		// headers: {authCode}
	})
}

// 外委报告列表
export function getSiteProjectReportList(params) {
	return request({
		url: `/siteLab/v1/siteProjectReport/querySiteProjectReportList`,
		method: 'get',
		params,
		headers: {authCode: !params.authCode ? authCode : null}
	})
}

// 外委报告详情
export function getSiteProjectReportDetail(projectReportId) {
	return request({
		url: `/siteLab/v1/siteProjectReport/querySiteProjectReportDetail/${projectReportId}`,
		method: 'get',
		// headers: {authCode}
	})
}

/*
 * 工地实验室管理
 */

// 工地项目-列表
export function projectList(params) {
	return request({
		url: `/siteProject/v1/project/list`,
		method: "get",
		params,
	})
}

// 工地项目-新增
export function addProject(data) {
	return request({
		url: `/siteProject/v1/project`,
		method: "post",
		data
	})
}

// 工地项目-详情
export function projectDetail(id) {
	return request({
		url: `/siteProject/v1/project/${id}`,
		method: "get",
	})
}

// 工地项目-修改
export function editProject(data) {
	return request({
		url: `/siteProject/v1/project`,
		method: "put",
		data
	})
}

// 工地项目-下拉选项
export function selectOption() {
	return request({
		url: `/siteProject/v1/project/selectOption`,
		method: "get",
	})
}

// 授权试验参数-按样品类别查询列表-不分页
export function authItemListByDetectCategory(params) {
	return request({
		url: `/siteProject/v1/authItem/authItemListByDetectCategory`,
		method: "get",
		params
	})
}

// 授权试验参数-试验参数列表
export function itemList(params) {
	return request({
		url: `/siteProject/v1/authItem/itemList`,
		method: "get",
		params
	})
}

// 试验参数-保存
export function saveAuthItem(data) {
	return request({
		url: `/siteProject/v1/authItem/saveAuthItem`,
		method: "post",
		data
	})
}

// 授权试验参数-已选试验参数
export function authItemList(params) {
	return request({
		url: `/siteProject/v1/authItem/authItemList`,
		method: "get",
		params
	})
}

// 授权人员-删除
export function deleteAuthUser(params) {
	return request({
		url: `/siteProject/v1/authUser/deleteAuthUser`,
		method: "delete",
		params
	})
}

// 授权人员-更新用户类型
export function updateUserType(params) {
	return request({
		url: `/siteProject/v1/authUser/updateUserType`,
		method: "get",
		params
	})
}

// 授权人员-列表
export function authUserList(params) {
	return request({
		url: `/siteProject/v1/authUser/list`,
		method: "get",
		params
	})
}

// 授权人员-新增
//
export function addAuthUser(data) {
	return request({
		url: `/siteProject/v1/authUser`,
		method: "post",
		data
	})
}

// 外委试验室-列表
export function outsideLabList(params) {
	return request({
		url: `/siteProject/v1/outsideLab/list`,
		method: "get",
		params
	})
}

// 外委试验室-新增
export function addOutsideLab(data) {
	return request({
		url: `/siteProject/v1/outsideLab`,
		method: "post",
		data
	})
}

// 外委试验室-详情
export function outsideLabDetail(params) {
	return request({
		url: `/siteProject/v1/outsideLab/selectOutsideLabById`,
		method: "get",
		params
	})
}

// 外委试验室-更新
export function editOutsideLab(data) {
	return request({
		url: `/siteProject/v1/outsideLab`,
		method: "put",
		data
	})
}

// 外委试验室-删除
export function delOutsideLab(params) {
	return request({
		url: `/siteProject/v1/outsideLab/deleteOutsideLabById`,
		method: "delete",
		params
	})
}

// 待取样列表
export function materialList(params) {
	return request({
		url: `/material/inspection/materialList`,
		method: "get",
		params
	})
}

// 已受理列表
export function acceptedList(params) {
	return request({
		url: `/material/inspection/acceptedList`,
		method: "get",
		params
	})
}
//试验报告
export function testReportList(params) {
	return request({
		url: `/siteProject/v1/project/selectProjectReport`,
		method: "get",
		params
	})
}

// 已受理列表
export function entrustAcceptanceDetail(id) {
	return request({
		url: `/entrustAcceptance/${id}`,
		method: "get",
	})
}
// 多租户同步基础数据
export function syncBaseData(data) {
	return request({
		url: `/siteProject/v1/project/syncBaseData`,
		method: "POST",
		data
	})
}
// 同步基础数据
export function syncProjectItemInfo() {
	return request({
		url: `/siteProject/v1/project/syncProjectItemInfo`,
		method: "get",
	})
}
// 项目信息下拉框（新增工地项目用）
export function selectProjectInfo() {
	return request({
		url: `/siteProject/v1/project/selectProjectInfo`,
		method: "get",
	})
}


