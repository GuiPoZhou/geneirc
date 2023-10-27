//检测管理-结果核对
import request from '@/utils/request'

//查询检测结果列表
export function getPageList(query) {
  return request({
    url: '/chk/result/list',
    method: 'get',
    params: query
  })
}

//生成报告
export function creReport(data) {
  return request({
    url: '/chk/result/creReport',
    method: 'put',
    data: data
  })
}

//检测结果核对--删除
export function resultCheckDel(id) {
  return request({
    url: `/chk/result/delete`,
    method: 'delete',
    data: id
  })
}

//结果核对列表--导出
export function saveTube(data) {
  return request({
    url: `/chk/result/export`,
    method: 'post',
    responseType: 'blob',
    async: false,
    data
  })
}

//检测核对--列表删除
export function detectionResultDel(id) {
  return request({
    url: `/chk/result/deleteTube`,
    method: 'delete',
    data: id
  })
}

//检测结果--导出
export function exportTube(data) {
  return request({
    url: `/chk/result/exportTube`,
    method: 'post',
    responseType: 'blob',
    async: false,
    data
  })
}

// 导入
export function imports(data) {
  return request({
    url: '/chk/result/import',
    method: 'post',
    data: data,
  })
}

// 下载模板
export function downTemplate(data) {
  return request({
    url: '/chk/result/downTemplate',
    method: 'post',
    responseType: 'blob',
    async: false,
    data
  })
}

//查看复核阴阳检测
export function upApproveStatus(data) {
  return request({
    url: '/tk/tube/upApproveStatus',
    method: 'put',
    data: data
  })
}




























