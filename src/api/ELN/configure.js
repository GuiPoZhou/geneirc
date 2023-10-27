import request from '@/utils/request'

//ELN记录配置列表1
export function getELNConfigureList(query) {
    return request({
        url: '/elnRecord/list',
        method: 'get',
        params: query,
    })
}
//适用方法列表1
export function getFitMethodList(query) {
    return request({
        url: '/elnConfig/queryElnConfigMethodList',
        method: 'get',
        params: query,
    })
}
//可供选择的方法列表1
export function getAllMethodList(query) {
    return request({
        url: '/elnConfig/selectMethodList',
        method: 'get',
        params: query,
    })
}
//可供选择的项目列表1（下表）
export function getAllItemList(query) {
    return request({
        url: '/elnConfig/selectCheckItemList',
        method: 'get',
        params: query,
    })
}
//已经选择的项目列表1（上表）
export function getSelectedItemList(query) {
    return request({
        url: '/elnConfig/selectCheckItemListByCheckIds',
        method: 'get',
        params: query,
    })
}
//适用方法列表中的保存接口1
export function ELNConfigureSave(data) {
    return request({
        url: '/elnConfig/saveRelation',
        method: 'post',
        data
    })
}




