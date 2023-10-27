import request from '@/utils/request'

//单位信息管理分页列表
export function getDeptInfoList(query) {
    return request({
        url: '/resources/v1/deptInfo',
        method: 'get',
        params: query,
    })
}

//删除
export function deleteApi(id) {
    return request({
        url: '/resources/v1/deptInfo/' + id,
        method: 'delete',
    })
}

//新增
export function addCheck(data) {
    return request({
        url: '/resources/v1/deptInfo',
        method: 'post',
        data
    })
}

//根据id查询
export function getCheck(id) {
    return request({
        url: '/resources/v1/deptInfo/' + id,
        method: 'get',
    })
}

//修改
export function editCheck(data, id) {
    return request({
        url: '/resources/v1/deptInfo/' + id,
        method: 'put',
        data
    })
}