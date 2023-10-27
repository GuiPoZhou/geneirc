import request from '@/utils/request'

// 客商授权-查询客商信息列表
export function getCustomerList(query) {
  return request({
    url: '/customerauthorization/list',
    method: 'get',
    params: query,
  })
}
// 授权历史列表
export function getHistoryList(query) {
  return request({
    url: '/customerauthorization/cusAutHisList',
    method: 'get',
    params: query,
  })
}
// 授权
export function customerAuthorization(data) {
  return request({
    url: '/customerauthorization',
    method: 'post',
    data
  })
}
// 修改
export function editcustomerAuth(data) {
  return request({
    url: '/customerauthorization',
    method: 'put',
    data
  })
}
// 删除
export function delcustomerAuth(id) {
  return request({
    url: '/customerauthorization/' + id,
    method: 'delete',
  })
}
