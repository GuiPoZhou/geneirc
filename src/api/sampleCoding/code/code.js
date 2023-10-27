import request from '@/utils/request'

// 查询协议列表
export function listData(query) {
	return request({
		url: '/v1/sampleCoding/sampleCodingList',
		method: 'get',
		params: query
	})
}


// 采样业务类别导航菜单/送样数据列表
export function getDetailInfos(id) {
	return request({
		url: '/v1/sampleCodingDetailPick/generateCodePick/' + id,
		method: 'get',
	})
}

// 采样详情
export function getCodePickList(agreementId, detectType) {
	return request({
		url: '/v1/sampleCodingDetailPick/generateCodePickList/' + agreementId + '/' + detectType,
		method: 'get',
	})
}

// 送样详情
export function getCodeGiveList(agreementId) {
	return request({
		url: '/v1/sampleCodingDetailGive/generateCodeGive/' + agreementId,
		method: 'get',
	})
}


//获取委托协议下相关类别的采样项目分组
export function getTakeGroupList(agreementId, detectType) {
	return request({
		url: '/v1/sampleCodingGroupPick/' + agreementId + '/' + detectType,
		method: 'get',
	})
}


//采样保存
export function pickSave(data) {
	return request({
		url: '/v1/sampleCoding/pick',
		method: 'post',
		data
	})
}

//送样保存编码
export function giveSave(data) {
	return request({
		url: '/v1/sampleCoding/give',
		method: 'post',
		data
	})
}

//删除点位
export function deletePoint(deleteParams) {
	return request({
		url: `/v1/sampleCoding/pick/point/${deleteParams.entrustAgreementId}/${deleteParams.pointId}/${deleteParams.rateIds}`,
		method: 'delete',
	})
}

//新增送样样品
export function addGiveSample(data) {
	return request({
		url: '/v1/sampleCoding/give/sample',
		method: 'post',
		data
	})
}

//新增送样样品
export function updateGiveSample(infoId, data) {
	return request({
		url: '/v1/sampleCoding/give/sample/' + infoId,
		method: 'put',
		data
	})
}


//删除送样样品
export function deleteGiveSample(agreementId, sampleId) {
	return request({
		url: '/v1/sampleCoding/give/sample/' + agreementId + "/" + sampleId,
		method: 'delete',
	})
}

//获取送样样品详情
export function getGiveSampleDetail(sampleId) {
	return request({
		url: '/v1/sampleCoding/give/sample/' + sampleId,
		method: 'get',
	})
}


/*
 *@author: 焦政
 *@date: 2021-01-16 10:17:11
 *@description: 采样点位相关
*/

// 保存点位 与编辑点位
export function savePonit(data, id) {
	let requestObj;
	id ? requestObj = {
		url: `/v1/sampleCoding/pick/point/${id}`,
		method: 'put',
		data
	} : requestObj = {
		url: '/v1/sampleCoding/pick/point',
		method: 'post',
		data
	};
	console.log('requestObj', requestObj);
	return request(requestObj);
}

// 查看点位
export function getPoint(entrustPointId) {
	return request({
		url: `/v1/sampleCoding/pick/point/${entrustPointId}`,
		method: 'get',
	})
}















