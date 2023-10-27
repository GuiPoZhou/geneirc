import request from '@/utils/request'

//分包评审管理分页列表
export function getReviewList(query) {
    return request({
        url: '/resources/v1/review',
        method: 'get',
        params: query,
    })
}

//分包评审记录管理分页列表
export function getReviewLogList(query) {
  return request({
    url: '/resources/v1/reviewLog',
    method: 'get',
    params: query,
  })
}

//删除
export function deleteApi(id) {
    return request({
        url: '/resources/v1/review/' + id,
        method: 'delete',
    })
}

//新增
export function addCheck(data) {
    return request({
        url: '/resources/v1/review',
        method: 'post',
        data
    })
}

//根据id查询
export function getCheck(id) {
    return request({
        url: '/resources/v1/review/' + id,
        method: 'get',
    })
}

//修改
export function editCheck(data, id) {
    return request({
        url: '/resources/v1/review/' + id,
        method: 'put',
        data
    })
}
