import request from '@/utils/request'

// 按样品列表
export function  getSampleList(query) {
  return request({
    url: '/v1/detectManage/taskAssignment/sampleList',
    method: 'get',
    params: query
  })
}
// 按项目列表
export function  getItemList(query) {
  return request({
    url: '/v1/detectManage/taskAssignment/itemList',
    method: 'get',
    params: query
  })
}

// 按样品分配列表
export function  getSampleAssignmentList(query) {
  return request({
    url: '/v1/detectManage/taskAssignment/sampleAssignmentList?pageNum=' + query.pageNum + '&pageSize=' + query.pageSize,
    method: 'post',
    data: query
  })
}

// 按项目分配列表
export function  getItemAssignmentList(query) {
  return request({
    url: '/v1/detectManage/taskAssignment/itemAssignmentList?pageNum=' + query.pageNum + '&pageSize=' + query.pageSize,
    method: 'post',
    data: query
  })
}
// 保存分配
export function  saveAssignment(formData) {
  return request({
    url: '/v1/detectManage/taskAssignment',
    method: 'post',
    data: formData
  })
}
// 取消分配
export function  cancelAssignment(formData) {
  return request({
    url: '/v1/detectManage/taskAssignment/cancelAssignment',
    method: 'put',
    data: formData
  })
}

// 获取分配明细
export function  getAssignmentDetailList(query) {
  return request({
    url: '/v1/detectManage/taskAssignment/assignmentDetailList?pageNum=' + query.pageNum + '&pageSize=' + query.pageSize,
    method: 'post',
    data: query
  })
}
