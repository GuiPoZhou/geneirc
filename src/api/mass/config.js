import request from '@/utils/request'

// 内审计划列表//
export function auditlist(query) {
  return request({
    url: '/internalAudit/plan/list',
    method: 'get',
    params: query,
  })
}
// 内审计划详情
export function auditdetail(id) {
  return request({
    url: `/internalAudit/plan/${id}`,
    method: 'get',
  })
}
// 内审计划新增
export function auditadd(formData) {
  return request({
    url: '/internalAudit/plan',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: formData,
  })
}
// 内审计划编辑
export function auditedit(data) {
  return request({
    url: '/internalAudit/plan_1631084407083',
    method: 'put',
    data: data,
  })
}
// 内审计划删除
export function auditdelete(ids) {
  return request({
    url: `/internalAudit/plan/${ids}`,
    method: 'delete',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
// 内审计划修改状态
export function auditstatus(data) {
  return request({
    url: '/internalAudit/plan/changeStatus',
    method: 'put',
    data: data,
  })
}

// 内审实施列表//
export function implelist(query) {
  return request({
    url: '/internalAudit/plan/implementList',
    method: 'get',
    params: query,
  })
}
// 内审通知列表
export function noticelist(query) {
  return request({
    url: '/internalAudit/notice/list',
    method: 'get',
    params: query,
  })
}
// 内审通知新增
export function noticeadd(formData) {
  return request({
    url: '/internalAudit/notice',
    method: 'post',
    data: formData,
  })
}
// 内审通知编辑
export function noticeedit(data) {
  return request({
    url: '/internalAudit/notice',
    method: 'put',
    data: data,
  })
}
// 内审通知删除
export function noticedelete(ids) {
  return request({
    url: `/internalAudit/notice/${ids}`,
    method: 'delete',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
// 内审通知详细信息
export function noticedetail(id) {
  return request({
    url: `/internalAudit/notice/${id}`,
    method: 'get',
  })
}
// 内审会议列表
export function meetlist(query) {
  return request({
    url: '/internalAudit/meeting/list',
    method: 'get',
    params: query,
  })
}
// 内审会议新增
export function meetadd(formData) {
  return request({
    url: '/internalAudit/meeting',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: formData,
  })
}
// 内审会议修改
export function meetedit(data) {
  return request({
    url: '/internalAudit/meeting',
    method: 'put',
    data: data,
  })
}
// 内审会议删除
export function meetdelete(ids) {
  return request({
    url: `/internalAudit/meeting/${ids}`,
    method: 'delete',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
// 内审会议详细信息
export function meetdetail(id) {
  return request({
    url: `/internalAudit/meeting/${id}`,
    method: 'get',
  })
}
// 现场审核记录列表
export function spotlist(query) {
  return request({
    url: '/internalAudit/onSiteAudit/list',
    method: 'get',
    params: query,
  })
}
// 现场审核记录新增
export function spotadd(formData) {
  return request({
    url: '/internalAudit/onSiteAudit',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: formData,
  })
}
// 现场审核记录编辑
export function spotedit(data) {
  return request({
    url: '/internalAudit/onSiteAudit',
    method: 'put',
    data: data,
  })
}
// 现场审核记录删除
export function spotdelete(ids) {
  return request({
    url: `/internalAudit/onSiteAudit/${ids}`,
    method: 'delete',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
// 现场审核记录详细信息
export function spotdetail(ids) {
  return request({
    url: `/internalAudit/onSiteAudit/${ids}`,
    method: 'get',
  })
}
// 不符合记录列表
export function inconformitylist(query) {
  return request({
    url: '/internalAudit/incompatible/list',
    method: 'get',
    params: query,
  })
}
// 不符合记录新增
export function inconformityadd(formData) {
  return request({
    url: '/internalAudit/incompatible',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: formData,
  })
}
// 不符合记录编辑
export function inconformityedit(data) {
  return request({
    url: '/internalAudit/incompatible',
    method: 'put',
    data: data,
    headers: { 'Content-Type': 'application/json' },
  })
}
// 不符合记录删除
export function inconformitydelete(ids) {
  return request({
    url: `/internalAudit/incompatible/${ids}`,
    method: 'delete',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
// 不符合记录详细信息
export function inconformitydetail(id) {
  return request({
    url: `/internalAudit/incompatible/${id}`,
    method: 'get',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
// 不符合项跟踪验证列表
export function checklist(query) {
  return request({
    url: '/internalAudit/followUp/list',
    method: 'get',
    params: query,
  })
}
// 不符合项跟踪验证新增
export function checkadd(formData) {
  return request({
    url: '/internalAudit/followUp',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: formData,
  })
}
// 不符合项跟踪验证编辑
export function checkedit(data) {
  return request({
    url: '/internalAudit/followUp',
    method: 'put',
    data: data,
    headers: { 'Content-Type': 'application/json' },
  })
}
// 不符合项跟踪验证删除
export function checkdelete(ids) {
  return request({
    url: `/internalAudit/followUp/${ids}`,
    method: 'delete',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
// 不符合项跟踪验证详细信息
export function checkdetail(id) {
  return request({
    url: `/internalAudit/followUp/${id}`,
    method: 'get',
  })
}
// 内审报告列表
export function reportlist(query) {
  return request({
    url: '/internalAudit/report/list',
    method: 'get',
    params: query,
  })
}
//内审报告新增
export function reportadd(formData) {
  return request({
    url: '/internalAudit/report',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: formData,
  })
}
// 内审报告编辑
export function reportedit(data) {
  return request({
    url: '/internalAudit/report',
    method: 'put',
    data: data,
    headers: { 'Content-Type': 'application/json' },
  })
}
// 内审报告删除
export function reportdelete(ids) {
  return request({
    url: `/internalAudit/report/${ids}`,
    method: 'delete',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
// 内审报告详细信息
export function reportdetail(id) {
  return request({
    url: `/internalAudit/report/${id}`,
    method: 'get',
  })
}

// 管理评审计划新增//
export function assessadd(formData) {
  return request({
    url: '/managementReviewPlan',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: formData,
  })
}
// 管理评审计划编辑
export function assessedit(data) {
  return request({
    url: '/managementReviewPlan',
    method: 'put',
    data: data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
//管理评审计划详细信息
export function assessdetail(id) {
  return request({
    url: `/managementReviewPlan/${id}`,
    method: 'get',
  })
}
//管理评审计划删除
export function assessdelete(ids) {
  return request({
    url: `/managementReviewPlan/${ids}`,
    method: 'delete',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
//   管理评审计划修改状态
export function assestatus(data) {
  return request({
    url: '/managementReviewPlan/changeStatus',
    method: 'put',
    data: data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 管理评审实施列表//
export function runlist(query) {
  return request({
    url: '/managementReviewPlan/implementList',
    method: 'get',
    params: query,
  })
}
// 实施计划列表
export function forcelist(query) {
  return request({
    url: '/managementReviewPlan/implement/list',
    method: 'get',
    params: query,
  })
}
// 实施计划新增
export function forceadd(formData) {
  return request({
    url: '/managementReviewPlan/implement',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: formData,
  })
}
// 实施计划编辑
export function forceedit(data) {
  return request({
    url: '/managementReviewPlan/implement',
    method: 'put',
    data: data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
// 实施计划删除
export function forcedelete(ids) {
  return request({
    url: `/managementReviewPlan/implement/${ids}`,
    method: 'delete',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
//   实施计划详细信息
export function forcedetail(id) {
  return request({
    url: `/managementReviewPlan/implement/${id}`,
    method: 'get',
  })
}
// 管评通知列表
export function runticelist(query) {
  return request({
    url: '/managementReviewPlan/notice/list',
    method: 'get',
    params: query,
  })
}
// 管评通知新增
export function runticeadd(formData) {
  return request({
    url: '/managementReviewPlan/notice',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: formData,
  })
}
// 管评通知编辑
export function runticeedit(data) {
  return request({
    url: '/managementReviewPlan/notice',
    method: 'put',
    data: data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
// 管评通知删除
export function runticedelete(ids) {
  return request({
    url: `/managementReviewPlan/notice/${ids}`,
    method: 'delete',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
// 管评通知详细信息
export function runticedetail(id) {
  return request({
    url: `/managementReviewPlan/notice/${id}`,
    method: 'get',
  })
}
// 管评会议记录列表
export function recordlist(query) {
  return request({
    url: '/managementReviewPlan/eegimnt',
    method: 'get',
    params: query,
  })
}
// 管评会议记录新增
export function recordadd(formData) {
  return request({
    url: '/managementReviewPlan/meeting',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: formData,
  })
}
// 管评会议记录编辑
export function recordedit(data) {
  return request({
    url: '/managementReviewPlan/meeting',
    method: 'put',
    data: data,
    headers: { 'Content-Type': 'application/json' },
  })
}
// 管评会议记录删除
export function recorddelete(ids) {
  return request({
    url: `/managementReviewPlan/meeting/${ids}`,
    method: 'delete',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
// 管评会议记录详细信息
export function recorddetail(id) {
  return request({
    url: `/managementReviewPlan/meeting/${id}`,
    method: 'get',
  })
}
// 管评报告列表
export function speechlist(query) {
  return request({
    url: '/managementReviewPlan/report',
    method: 'get',
    params: query,
  })
}
// 管评报告新增
export function speechadd(formData) {
  return request({
    url: '/managementReviewPlan/report',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: formData,
  })
}
// 管评报告编辑
export function speechedit(data) {
  return request({
    url: '/managementReviewPlan/report',
    method: 'put',
    data: data,
    headers: { 'Content-Type': 'application/json' },
  })
}
//管评报告删除
export function speechdelete(ids) {
  return request({
    url: `/managementReviewPlan/report/${ids}`,
    method: 'delete',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
// 管评报告详细信息
export function speechdetail(id) {
  return request({
    url: `/managementReviewPlan/report/${id}`,
    method: 'get',
  })
}

//不符合项管理列表//
export function nolist(query) {
  return request({
    url: '/incompatible/list',
    method: 'get',
    params: query,
  })
}
//不符合项管理新增
export function noadd(formData) {
  return request({
    url: '/incompatible',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: formData,
  })
}
//不符合项管理编辑
export function noedit(data) {
  return request({
    url: '/incompatible',
    method: 'put',
    data: data,
  })
}
//不符合项管理详细信息
export function nodetail(id) {
  return request({
    url: `/incompatible/${id}`,
    method: 'get',
  })
}
//不符合项管理删除
export function nodelete(ids) {
  return request({
    url: `/incompatible/${ids}`,
    method: 'delete',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 纠正与预防措施列表//
export function correctlist(query) {
  return request({
    url: '/correctionPrevention/list',
    method: 'get',
    params: query,
  })
}
// 纠正与预防措施新增
export function correctadd(formData) {
  return request({
    url: '/correctionPrevention',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: formData,
  })
}
// 纠正与预防措施修改
export function correctedit(data) {
  return request({
    url: '/correctionPrevention',
    method: 'put',
    data: data,
  })
}
// 纠正与预防措施详情
export function correctdetail(id) {
  return request({
    url: `/correctionPrevention/${id}`,
    method: 'get',
  })
}
//纠正与预防措施删除
export function correctdelete(ids) {
  return request({
    url: `/correctionPrevention/${ids}`,
    method: 'delete',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
// 完成状态
export function finishAuditPlan(planId) {
  return request({
    url: `/internalAudit/plan/queryInternalAuditPlan/${planId}`,
    method: 'get',
  })
}

//导出内审计划
export function exportInternalAuditPlan(param){
	return request({
		url: '/internalAudit/plan/export',
		method: 'get',
		params: param,
	})
}

//导出不符合项管理
export function exportIncompatible(param){
	return request({
		url: '/incompatible/export',
		method: 'get',
		params: param,
	})
}

//导出纠正与预防措施
export function exportCorrectionPrevention(param){
	return request({
		url: '/correctionPrevention/export',
		method: 'get',
		params: param,
	})
}


