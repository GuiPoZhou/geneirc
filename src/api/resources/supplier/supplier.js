import request from '@/utils/request'

//供应商管理分页列表
export function getSupplierList(query) {
    return request({
        url: '/material/v1/supplier',
        method: 'get',
        params: query,
    })
}

//删除
export function deleteApi(id) {
    return request({
        url: '/material/v1/supplier/' + id,
        method: 'delete',
    })
}

//新增
export function addCheck(data) {
    return request({
        url: '/material/v1/supplier',
        method: 'post',
        data
    })
}

//根据id查询
export function getCheck(id) {
    return request({
        url: '/material/v1/supplier/' + id,
        method: 'get',
    })
}

//修改
export function editCheck(data, id) {
    return request({
        url: '/material/v1/supplier/' + id,
        method: 'put',
        data
    })
}