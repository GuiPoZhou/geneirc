import request from '@/utils/request'

//分包评审记录管理分页列表
export function getReviewLogList(query) {
  return request({
    url: '/resources/v1/reviewLog',
    method: 'get',
    params: query,
  })
}

//根据id查询
export function getCheck(id) {
  return request({
    url: '/resources/v1/reviewLog/' + id,
    method: 'get',
  })
}

