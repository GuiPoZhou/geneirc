import request from '@/utils/request'

//分包商管理分页列表
export function getCompileList(query) {
    return request({
        url: '/resources/v1/subcontractor',
        method: 'get',
        params: query,
    })
}

//删除
export function deleteApi(id) {
    return request({
        url: '/resources/v1/subcontractor/' + id,
        method: 'delete',
    })
}

//新增
export function addCheck(data) {
    return request({
        url: '/resources/v1/subcontractor',
        method: 'post',
        data
    })
}

//根据id查询
export function getCheck(id) {
    return request({
        url: '/resources/v1/subcontractor/' + id,
        method: 'get',
    })
}

//修改
export function editCheck(data, id) {
    return request({
        url: '/resources/v1/subcontractor/' + id,
        method: 'put',
        data
    })
}

//项目分页列表
export function getItemList(query) {
  return request({
    url: '/standard/v1/itemMethods/getItemList',
    method: 'get',
    params: query,
  })
}

//分组列表
export function getGroupsList(query) {
  return request({
    url: '/standard/v1/itMeGroups/getGroupItemList',
    method: 'get',
    params: query,
  })
}

//按分组查询项目分组列表
export function getGroupsByItemIdList(id) {
  return request({
    url: '/standard/v1/itMeGroups/getGroupsByItemIdList/'+id,
    method: 'get'
  })
}
