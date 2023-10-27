/*
 * @Autor: 焦政
 * @Date: 2021-01-20 13:19:53
 * @Description: 报告管理相关接口
 */
import request from '@/utils/request'

/*
 *@author: 焦政
 *@date: 2021-01-22 10:26:18
 *@description: 待编制部分
*/

// 选择报告模板
export function reportTemplateList() {
    console.log('查询报告模板')
    return request({
        url: '/base/template/listAll?businessCategory=REPORT&prepareWay=1',
        method: 'get'
    })
}


// 主列表
export function reportMainList(query, status) {
    let requestobj = {
        method: 'get',
        params: query,
    }
    if (status == 0) {
        requestobj.url = '/report/v1/manager/getStayCompileList' //待编制
    } else if (status == 1) {
        requestobj.url = '/report/v1/manager/getStaySubmitList' //待提交
    } else if (status == 2) {
        requestobj.url = '/report/v1/manager/getHasBackList' //被退回
    } else if (status == 3) {
        requestobj.url = '/report/v1/manager/getHasSubmitList' //已提交
    }
    return request(requestobj)

}

// 检测信息-根据委托协议id获取检测类别信息
export function getDetectTypeList(entrustId, sampleSource) {
    return request({
        url: `/report/v1/manager/getStayCompileList/${entrustId}/${sampleSource}`,
        method: 'get',
    })
}

// 检测信息-协议id 检测类别ID 样品来源 获取编制检测信息
export function getCompileDetailList(query) {
    return request({
        url: '/report/v1/manager/getCompileDetailList',
        method: 'get',
        params: query,
    })
}

// 检测信息-退回
export function returnAudit(params) {
    return request({
        url: `/v1/detectSampleItemAudit/reportCompileReturnAudit?detectSampleItemIdsStr=${params.detectSampleItemIdsStr}&auditOpinion=${params.auditOpinion}`,
        method: 'post',
        data: params,
    })
}


// 采样信息-检测类别列表
export function getSampleDetectList(entrustId) {
    return request({
        url: `/sampleTask/v1/sampleInfo/getSampleDetectList/${entrustId}`,
        method: 'get',
    })
}

// 采样信息-详情列表
export function getSampleRatePickList(query) {
    return request({
        url: '/report/v1/manager/getSampleRatePickList',
        method: 'get',
        params: query,
    })
}

// 报告编制-确定
export function generate(query) {
    return request({
        url: '/report/v1/manager/generate',
        method: 'post',
        data: query,
    })
}

/*
 *@author: 焦政
 *@date: 2021-01-22 10:26:33
 *@description: 待提交部分
*/

// 提交报告
export function reportSubmit(ids) {
    return request({
        url: `/report/v1/manager/reportSubmit/${ids}`,
        method: 'put',
    })
}


// 删除待提交报告
export function reportDel(ids) {
    return request({
        url: `/report/v1/manager/reportDel/${ids}`,
        method: 'delete',
    })
}

// 审批记录
export function getAuditRecordList(id) {
    return request({
        url: `/report/v1/manager/getAuditRecordList/${id}`,
        method: 'get',
    })
}

/*
 *@author: 焦政
 *@date: 2021-01-22 11:37:08
 *@description: 报告审核模块
*/

// 审核主列表
export function auditMinList(query, status) {
    let requestObj = {
        method: 'get',
        params: query,
    }
    status == 0 ? requestObj.url = '/report/v1/manager/getStayAuditList' : requestObj.url = '/report/v1/manager/getHasAuditList'
    return request(requestObj)
}

// 审批操作
export function doAudit(id, params, status) {
    let requestObj = {
        method: 'post',
        data: params,
    }
    status == 0 ? requestObj.url = `/report/v1/manager/auditPass/${id}` : requestObj.url = `/report/v1/manager/auditBack/${id}`
    return request(requestObj)
}


// 查看报告pdf
export function getReport(reportId) {
    return request({
        url: `/report/v1/manager/audit/${reportId}`,
        method: 'get',
    })
}

// 工地试验室管理-实验报告-查看报告pdf
export function getReport2(query) {
	return request({
		url: `/report/v1/manager/audit/${query.reportId}/${query.authCode}`,
		method: 'get',
	})
}

// 查看原始记录pdf
export function getCheckrecord(id) {
  return request({
    url: `/v1/detectSampleItemAudit/resultAuditOriginal/${id}`,
    method: 'get',
  })
}


// 查看原始记录pdf
export function getOriPdf(testId) {
    return request({
        url: `/report/v1/manager/originalRecord/${testId}`,
        method: 'get',
    })
}

// 退回审批
export function auditRecall(id, params) {
    return request({
        url: `/report/v1/manager/auditRecall/${id}`,
        method: 'post',
        data: params
    })
}

/*
 *@author: 焦政
 *@date: 2021-01-22 14:06:44
 *@description: 报告发布相关
*/

// 发布列表
export function releaseMainList(query, status) {
    let requestObj = {
        method: 'get',
        params: query,
    }
    status == 0 ? requestObj.url = '/report/v1/manager/getStayReleaseList' : requestObj.url = '/report/v1/manager/getHsaReleaseList'
    return request(requestObj)
}

// 发布报告
export function release(id) {
    return request({
        url: `/report/v1/manager/release/${id}`,
        method: 'put',
    })
}

// 取消发布
export function cancelRelease(id) {
    return request({
        url: `/report/v1/manager/cancelRelease/${id}`,
        method: 'put',
    })
}

// 签章列表
export function getDeptSignatureList() {
    return request({
        url: '/report/v1/manager/getDeptSignatureList',
        method: 'get',
    })
}

// 签章
export function signature(params) {
    return request({
        url: '/report/v1/manager/signature',
        method: 'put',
        data: params
    })
}

// 已签章列表
export function getSignatureIdList(query) {
    return request({
        url: '/report/v1/manager/getSignatureIdList',
        method: 'get',
        params: query
    })
}
// 取消签章
export function cancelSignature(query) {
    return request({
        url: '/report/v1/manager/cancelSignature',
        method: 'put',
        data: query
    })
}
// 报告审核-审核页面-中间试验参数条件查询
export function getApprovalsearch(query) {
  return request({
    url: '/report/v1/manager/getTestParameter',
    method: 'get',
    params: query
  })
}
