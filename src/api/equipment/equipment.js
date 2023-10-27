import request from '@/utils/request'

//设备领用列表1
export function getEquipmentReceiveList(query) {
    return request({
        url: 'resource/v1/equipmentReceive',
        method: 'get',
        params: query,
    })
}
//设备领用详情1
export function getEquipmentReceiveDetail(id) {
    return request({
        url: '/resource/v1/equipmentReceive/' + id,
        method: 'get',
    })
}
//设备领用-查询可领取的设备1
export function receiveEquipmentList(query) {
    return request({
        url: '/resource/v1/equipmentReceive/receiveEquipmentListInstead',
        method: 'get',
        params: query,
    })
}

//设备领用保存接口
export function receiveEquipmentListSave(data) {
    return request({
        url: '/resource/v1/equipmentReceive',
        method: 'post',
        data
    })
}

//设备归还列表
export function getEquipmentReturnList(query) {
    return request({
        url: '/resource/v1/equipmentReturn',
        method: 'get',
        params: query,
    })
}
//设备归还详情
export function getEquipmentReturnDetail(id) {
    return request({
        url: '/resource/v1/equipmentReturn/' + id,
        method: 'get',
    })
}
//设备归还-可归还设备列表
export function returnEquipmentList(query) {
    return request({
        url: '/resource/v1/equipmentReturn/returnEquipmentList/list',
        method: 'get',
        params: query,
    })
}

//设备归还保存接口
export function returnEquipmentListSave(data) {
    return request({
        url: '/resource/v1/equipmentReturn',
        method: 'post',
        data
    })
}




//2021年4月14日-设备管理-导入导出


//导出
export function exportData(id, query) {
  return request({
    url: '/v1/dynamicExcel/equipment/exportExcel/'+id,
    method: 'post',
    data: query
  })
}

//模板下载
export function downLoadTemplate() {
	window.location.href = window.globalEnv.VUE_APP_BASE_API + "/v1/dynamicExcel/equipment/importTemplate";
}

