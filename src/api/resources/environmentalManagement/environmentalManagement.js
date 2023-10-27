import request from '@/utils/request'

//区域设置
//区域设置列表
export function geArealList(query) {
    return request({
        url: '/resources/v1/area',
        method: 'get',
        params: query,
    })
}

//区域设置列表删除
export function deleteArealList(id) {
    return request({
        url: '/resources/v1/area/' + id,
        method: 'delete',
    })
}

//区域设置列表新增
export function addArealList(data) {
    return request({
        url: '/resources/v1/area',
        method: 'post',
        data
    })
}

//区域设置列表编辑数据
export function getArealListEdit(id) {
    return request({
        url: '/resources/v1/area/' + id,
        method: 'get',
    })
}

//区域设置列表编辑里面的保存
export function editArealList(data, id) {
    return request({
        url: '/resources/v1/area/' + id,
        method: 'put',
        data
    })
}

//环境点检
//环境点检列表
export function getEnvSpotCheckList(query) {
    return request({
        url: '/resources/v1/area/getEnvironmentTallyList',
        method: 'get',
        params: query,
    })
}
//环境点检新增里面的保存
export function addEnvSpotCheckList(data) {
    return request({
        url: '/resources/v1/tally',
        method: 'post',
        data
    })
}
//点检记录
//点检记录列表
export function getSpotCheckRecordList(query) {
    return request({
        url: '/resources/v1/tallyLog',
        method: 'get',
        params: query,
    })
}

//点检记录补录
export function addSpotCheckRecordList(data) {
    return request({
        url: '/resources/v1/tally',
        method: 'post',
        data
    })
}
//点检记录列表删除
export function deleteSpotCheckRecordList(id) {
    return request({
        url: '/resources/v1/tally/' + id,
        method: 'delete',
    })
}
//点检记录列表编辑里面的保存
export function editSpotCheckRecordList(data,id) {
    return request({
        url: '/resources/v1/tally/'+ id,
        method: 'put',
        data
    })
}

//点检记录列表编辑记录信息里面的保存
export function editLogSpotCheckRecordList(data,id) {
	return request({
		url: '/resources/v1/tallyLog/'+ id,
		method: 'put',
		data
	})
}
//点检记录列表编辑里面的查看点检记录
export function seeSpotCheckRecordList(query) {
    return request({
        url: '/resources/v1/tallyLog',
        method: 'get',
        params: query,
    })
}
