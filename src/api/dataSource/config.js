import request from '@/utils/request'

export function  list(query) {
  return request({
    url: '/reportDataSourceMain/getList',
    method: 'post',
    data: query
  })
}

export function saveOrUpdate(query) {
  return request({
    url: '/reportDataSourceMain/save',
    method: 'post',
    data: query
  })
}

export function remove(id) {
  return request({
    url: '/reportDataSourceMain/remove/' + id,
    method: 'post',
  })
}

export function get(id) {
  return request({
    url: '/reportDataSourceMain/get?id=' + id,
    method: 'get',
  })
}
