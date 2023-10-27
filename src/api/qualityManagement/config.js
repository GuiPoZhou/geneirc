/*
 * @Author: 焦政
 * @Date: 2021-01-07 18:39:59
 * @LastEditTime: 2021-01-19 11:13:45
 * @LastEditors: Please set LastEditors
 * @Description: 质控管理模块相关接口
 */
import request from '@/utils/request'


//  获取质量质控列表
export function getQualityControlList(params) {
	return request({
		url: '/v1/qualitycontrolmanage',
		method: 'get',
		params
	})
}


/**
 * 采样相关接口
 */
// 获取环境监控样本列表
export function getSampleTabList(id) {
	return request({
		url: `/v1/qualitycontrolmanage/scid/${id}`,
		method: 'get',
	})
}

// 查询采样检测频次项目
export function getSelectPickCheckItem(query) {
	return request({
		url: '/v1/qualitycontrolmanage/selectPickSampleCode',
		method: 'get',
		params: query
	})
}

// 根据采样编码ID查询检测项目 采样质控平行样使用
export function getDetectProject(id, type) {
	if (type == 'zk') {
		return request({
			url: `/v1/qualitycontrolmanage/scdid/${id}?sceneDetect=0`,
			method: 'get',
		})
	} else if (type == 'cy') {
		return request({
			url: `/v1/qualitycontrolmanage/scdid/${id}`,
			method: 'get',
		})
	}

}

// 查看检测项目
export function getProjectAll(id) {
	return request({
		url: `/v1/qualitycontrolmanage/scdid/all/${id}`,
		method: 'get',
	})
}


// 添加质控样
export function addPojectCtrl(params) {
	return request({
		url: '/v1/qualitycontrolmanage/addPickQualityControlSample',
		method: 'post',
		data: params
	})
}

// 删除质控样
export function deleteProjectCtrl(id) {
	return request({
		url: `/v1/qualitycontrolmanage/deletePickQualityControlSample/${id}`,
		method: 'delete',
	})
}

/**
 * 送样相关接口
 */

// 获取质控样添加 送样列表
export function getSendSampleDataList(query, id) {
	return request({
		url: `/v1/qualitycontrolmanage/selectGiveSampleCode/${id}`,
		method: 'get',
		params: query
	})
}

//根据送样编码ID查询检测项目
export function selectGiveCheckItem(id) {
	return request({
		url: `/v1/qualitycontrolmanage/selectGiveCheckItem/${id}`,
		method: 'get'
	})
}

// 送样添加质控样
export function addGiveQualityControlSample(params) {
	return request({
		url: '/v1/qualitycontrolmanage/addGiveQualityControlSample',
		method: 'post',
		data: params
	})
}

// 送样 删除质控样
export function deleteGiveQualityControlSample(id) {
	return request({
		url: `/v1/qualitycontrolmanage/deleteGiveQualityControlSample/${id}`,
		method: 'delete',
	})
}

// 送样 查看检测项目
export function selectGiveCheckItemAll(id) {
	return request({
		url: `/v1/qualitycontrolmanage/selectGiveCheckItemAll/${id}`,
		method: 'get'
	})
}

/*
 *@author: 焦政
 *@date: 2021-01-14 09:17:10
 *@description: 空白样相关接口
*/

// 采样质控-空白样样-分页
export function blanksample(query) {
	return request({
		url: '/v1/blanksample',
		method: 'get',
		params: query
	})
}

// 根据样品编码查询检测类别
export function getDetectTypeList(sampleCodingId) {
	return request({
		url: `/v1/blanksample/getDetectTypeList/${sampleCodingId}`,
		method: 'get',
	})
}

// 根据样品编码id与检测类别id 获取样品详情列表
export function getSampleCodingDetailList(sampleCodingId, detectType) {
	return request({
		url: `/v1/blanksample/getSampleCodingDetailList/${sampleCodingId}/${detectType}`,
		method: 'get',
	})
}

//根据样品编码详情ID获取项目信息(已添加项目不再重复显示)
export function getSampleItemList(data) {
	return request({
		url: `/v1/blanksample/getSampleItemList`,
		method: 'post',
		data
	})
}


//添加空白样
export function addBlankSample(data) {
	return request({
		url: '/v1/blanksample/addBlankSample',
		method: 'post',
		data
	})
}

//删除空白样
export function deleteBlankSample(sampleCodingDetailIdList) {
	return request({
		url: `/v1/blanksample/${sampleCodingDetailIdList}`,
		method: 'delete',
	})
}

//校验是否能添加某种类型的空白样
export function validateAddBlankSample(sampleCodingDetailIdList,sampleType) {
	return request({
		url: `/v1/blanksample/${sampleType}/${sampleCodingDetailIdList}`,
		method: 'get',
	})
}




/*
 *@author: 焦政
 *@date: 2021-01-12 16:31:22
 *@description: 采样质控相关
*/

/**
 * 平行样添加
 */

//  采样质控-平行样-分页列表
export function parallelsample(query) {
	return request({
		url: '/v1/parallelsample',
		method: 'get',
		params: query
	})
}

// 查询点位编码信息
export function selectParallelSampleCode(params) {
	return request({
		url: `/v1/parallelsample/selectParallelSampleCode?sampleCodingId=${params.sampleCodingId}&detectType=${params.detectType}`,
		method: 'get',
	})
}

/**
 * @author 焦政
 * @Description: 质控数据相关
 * @date 2021/3/15
 */

//质控数据列表
export function getqualitycontroldata(query) {
	return request({
		url: '/v1/qualitycontroldata',
		method: 'get',
		params: query
	})
}

//质控数据查看
export function getViewData(query) {
	return request({
		url: '/v1/qualitycontroldata/viewData',
		method: 'get',
		params: query
	})
}
