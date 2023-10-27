//检测管理-样本检测
import request from '@/utils/request'

// 导入
export function imported(data) {
  return request({
    url: '/portal/docperpetualcalendar/imported',
    method: 'post',
    data: data,
  })
}

// 下载模板
export function exported() {
  return request({
    url: '/tk/tube/downTemplate',
    method: 'post',
    responseType: 'blob'
  })
}

//样本检测列表导出
export function exportOrderExcel(data) {
  return request({
    url: `/order/export`,
    method: 'post',
    responseType: 'blob',
    async: false,
    data
  })
}

//普通检测列表
export function getPageList(query) {
  return request({
    url: '/chk/task/list',
    method: 'get',
    params: query
  })
}

//提交审核
export function submission(data) {
  return request({
    url: '/chk/task/submission',
    method: 'put',
    data: data
  })
}

//新增检测任务
export function add(data) {
  return request({
    url: '/chk/task/save',
    method: 'post',
    data: data
  })
}

//新增试管
export function saveTube(data) {
  return request({
    url: '/tk/tube/saveTube',
    method: 'post',
    data: data
  })
}

//修改检测任务
export function edit(data) {
  return request({
    url: '/chk/task/update',
    method: 'put',
    data: data
  })
}

//待检样本列表
export function getStayPageList(query) {
  return request({
    url: '/tk/tube/list',
    method: 'get',
    params: query
  })
}

//删除普通检测
export function del(id) {
  return request({
    url: `/chk/task/delete`,
    method: 'delete',
    data: id
  })
}

//标本类型
export function specimenTypeList(query) {
  return request({
    url: '/bs/mt/tp/list',
    method: 'get',
    params: query
  })
}

//检测任务类型
export function detectionTaskTypeList(query) {
  return request({
    url: '/bs/pat/tp/list',
    method: 'get',
    params: query
  })
}

//检测项目
export function detectionItem(query) {
  return request({
    url: '/bs/chk/obj/list',
    method: 'get',
    params: query
  })
}
//检测项目2
export function detectionItem2(query) {
  return request({
    url: '/bs/chk/obj/typographyList',
    method: 'get',
    params: query
  })
}


//检测任务详情
export function selctByIdPage(query) {
  return request({
    url: '/tk/tube/selctByIdPage',
    method: 'get',
    params: query
  })
}

//检测任务详情--查看
export function selectTask(query) {
  return request({
    url: '/tk/tube/selectTask',
    method: 'get',
    params: query
  })
}

//删除试管
export function delTestTube(id) {
  return request({
    url: `/tk/tube/delete`,
    method: 'delete',
    data: id
  })
}


//删除样本
export function delSample(id) {
  return request({
    url: `/tk/tube/deleteSm`,
    method: 'delete',
    data: id
  })
}

//判定试管阴阳
export function cheackStatus(data) {
  return request({
    url: '/tk/tube/cheackStatus',
    method: 'put',
    data: data
  })
}
// 导出
export function exportTask(data) {
  return request({
    url: '/chk/task/export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
// 导出
export function exportdetailTask(data) {
  return request({
    url: '/tk/tube/tubeExport',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
// 详情导入
export function tubeImport(data) {
  return request({
    url: '/tk/tube/tubeImport',
    method: 'post',
    data: data
  })
}

// 排版详情导入
export function paibanInfoImport(data) {
  return request({
    url: '/tk/tube/importTyography',
    method: 'post',
    data: data
  })
}
//用户检测列表
export function releaseTheList(query) {
  return request({
    url: '/tk/tube/releaseTheList',
    method: 'get',
    params: query
  })
}
// 导出
export function releaseExport(data) {
  return request({
    url: '/tk/tube/releaseExport',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
































