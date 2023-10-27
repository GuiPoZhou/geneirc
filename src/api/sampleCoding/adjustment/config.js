/*
 * @Autor: 焦政
 * @Date: 2021-01-26 13:00:41
 * @Description: 编码调整相关
 */
import request from '@/utils/request'

// 编码调整列表
export function getAdjustList(query) {
	return request({
		url: '/v1/sampleCodingAdjust/list',
		method: 'get',
		params: query,
	})
}

// 采样-检测类别列表
export function adjustCodePick(entrustAgreementId, sampleCodingId) {
	return request({
		url: `/v1/sampleCodingDetailPick/adjustCodePick/${entrustAgreementId}/${sampleCodingId}`,
		method: 'get',
	})
}

// 采样-检测类别数据列表
export function adjustCodePickList(sampleCodingId, detectType) {
	return request({
		url: `/v1/sampleCodingDetailPick/adjustCodePickList/${sampleCodingId}/${detectType}`,
		method: 'get',
	})
}

// 采样-项目分组列表
export function adjust(sampleCodingId, detectType) {
	return request({
		url: `/v1/sampleCodingGroupPick/adjust/${sampleCodingId}/${detectType}`,
		method: 'get',
	})
}

// 采样-新増点位  送样-保存样品信息
export function addPoint(data, id) {
	let requestObj = {}
	id ? requestObj = {
		url: '/v1/sampleCodingAdjust/pick/point',
		method: 'post',
		data
	} : requestObj = {
		url: '/v1/sampleCodingAdjust/give/sample',
		method: 'post',
		data
	}
	console.log('requestObj', requestObj)
	return request(requestObj)
}

// 采样-删除点位
export function deletePoint(deleteParams) {
	return request({
		url: `/v1/sampleCodingAdjust/pick/point/${deleteParams.entrustAgreementId}/${deleteParams.sampleCodingId}/${deleteParams.pointId}/${deleteParams.rateIds}`,
		method: 'delete',
	})
}

// 查看点位
export function getPoint(sampleCodingId, entrustPointId) {
	return request({
		url: `/v1/sampleCodingAdjust/pick/point/${sampleCodingId}/${entrustPointId}`,
		method: 'get',
	})
}

// 查看点位
export function getPointRates(sampleCodingId, entrustPointId, rateIds) {
	return request({
		url: `/v1/sampleCodingAdjust/pick/pointRates/${sampleCodingId}/${entrustPointId}/${rateIds}`,
		method: 'get',
	})
}

// 采样-修改点位-新増天次
export function rateBatch(data, entrustAgreementId, pointId) {
	return request({
		url: `/v1/sampleCodingAdjust/pick/rateBatch/${entrustAgreementId}/${pointId}`,
		method: 'post',
		data
	})
}

// 采样-修改点位-删除频次
export function deleteRate(entrustAgreementId, sampleCodingId, pointId, rateIds) {
	return request({
		url: `/v1/sampleCodingAdjust/pick/rate/${entrustAgreementId}/${sampleCodingId}/${pointId}/${rateIds}`,
		method: 'delete',
	})
}

// 采样-修改点位-修改频次
export function editRate(entrustAgreementId, sampleCodingId, pointId, data) {
	return request({
		url: `/v1/sampleCodingAdjust/pick/rate/${entrustAgreementId}/${sampleCodingId}/${pointId}`,
		method: 'put',
		data
	})
}


// 采样-修改点位-复制频次
export function rateCopy(entrustAgreementId, pointId, data) {
	return request({
		url: `/v1/sampleCodingAdjust/pick/rateCopy/${entrustAgreementId}/${pointId}`,
		method: 'post',
		data: [data]
	})
}

// 采样-编码调整确认
export function confirmPick(data) {
	return request({
		url: `/v1/sampleCodingAdjust/pick`,
		method: 'post',
		data,
	})
}


// 送样-检测数据列表
export function adjustCodeGive(entrustAgreementId, sampleCodingId) {
	return request({
		url: `/v1/sampleCodingDetailGive/adjustCodeGive/${entrustAgreementId}/${sampleCodingId}`,
		method: 'get',
	})
}

// 送样-保存样品信息
export function saveSample(data) {
	return request({
		url: `/v1/sampleCodingAdjust/give/sample`,
		method: 'post',
		data
	})
}

// 送样-查看样品信息
export function showSampleInfo(entrustInfoId) {
	return request({
		url: `/v1/sampleCodingAdjust/give/sample/${entrustInfoId}`,
		method: 'get',
	})
}

// 删除样品信息
export function deleteSample(sampleCodingId, sampleCodingDetailId) {
	return request({
		url: `/v1/sampleCodingAdjust/give/sample/${sampleCodingId}/${sampleCodingDetailId}`,
		method: 'delete',
	})
}

// 送样-编码调整确认
export function giveSave(data) {
	return request({
		url: `/v1/sampleCodingAdjust/give`,
		method: 'post',
		data
	})
}


// 调整记录列表
export function hisList(sampleCodingId, query) {
	return request({
		url: `/v1/sampleCodingRecord/list/${sampleCodingId}`,
		method: 'get',
		params: query
	})
}

// 采样调整记录明细
export function takePick(recordId) {
	return request({
		url: `/v1/sampleCodingRecord/pick/${recordId}`,
		method: 'get',
	})
}

// 采样调整频次列表
export function takeAdjustRate(recordId, detectType) {
	return request({
		url: `/v1/sampleCodingRecord/pick/rate/${recordId}/${detectType}`,
		method: 'get',
	})
}

// 采样调整分组项目列表
export function getGroup(recordId, detectType) {
	return request({
		url: `/v1/sampleCodingRecord/pick/group/${recordId}/${detectType}`,
		method: 'get',
	})
}

// 采样调整项目详情列表
export function getItem(recordId, data) {
	return request({
		url: `/v1/sampleCodingRecord/pick/item/${recordId}`,
		method: 'get',
		params: data
	})
}

// 送样调整记录明细
export function giveAdjustHis(recordId) {
	return request({
		url: `/v1/sampleCodingRecord/give/${recordId}`,
		method: 'get',
	})
}

// 送样调整项目详情列表
export function getProlist(recordId, detailId) {
	return request({
		url: `/v1/sampleCodingRecord/give/${recordId}/${detailId}`,
		method: 'get',
	})
}

//批量保存点位
export function doPointBatch(data) {
	return request({
		url: `/v1/sampleCodingAdjust/pick/pointBatch`,
		method: 'post',
		data:[data]
	})
}


// 新增天数保存（更新点位，批量插入频次）
export function doPointRateBatch(data, pointId) {
	return request({
		url: `/v1/sampleCodingAdjust/pick/pointRateBatch/${pointId}`,
		method: 'post',
		data:[data]
	})
}
