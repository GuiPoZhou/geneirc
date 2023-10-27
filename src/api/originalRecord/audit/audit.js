import request from '@/utils/request'

// 原始记录-审核-待审核列表
export function  getStayAuditList(query) {
  return request({
    url: '/originalRecord/v1/auditLog/getStayAuditList',
    method: 'get',
    params: query
  })
}

// 原始记录-审核-已审核列表
export function  getHasAuditList(query) {
  return request({
    url: '/originalRecord/v1/auditLog/getHasAuditList',
    method: 'get',
    params: query
  })
}

// 根据委托协议Id获取审核信息
export function  getAuditList(id) {
  return request({
    url: '/originalRecord/v1/auditLog/getAuditList/'+id,
    method: 'get'
  })
}

// 根据委托协议Id获取审核信息
export function  getCheckList(id) {
  return request({
    url: '/originalRecord/v1/auditLog/getCheckList/'+id,
    method: 'get'
  })
}

// 通过
export function  auditPass(query) {
  return request({
    url: '/originalRecord/v1/auditLog/auditPass',
    method: 'post',
    data: query
  })
}

// 退回
export function  auditSendBack(query) {
  return request({
    url: '/originalRecord/v1/auditLog/auditSendBack',
    method: 'post',
    data: query
  })
}

// 撤销
export function  auditUndo(query) {
  return request({
    url: '/originalRecord/v1/auditLog/auditUndo',
    method: 'post',
    data: query
  })
}


// 根据委托协议Id获取审核信息
export function  getAuditLogList(id) {
  return request({
    url: '/originalRecord/v1/auditLog/getAuditLogList/'+id,
    method: 'get'
  })
}
