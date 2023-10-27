//报告管理
import request from '@/utils/request'

//列表
export function getPageList(query) {
  return request({
    url: '/re/report/list',
    method: 'get',
    params: query
  })
}
//生成报告
export function add(data) {
  return request({
    url: '/re/report/releaseReport',
    method: 'post',
    data: data
  })
}
//删除报告
export function del(data) {
  return request({
    url: `/re/report/delete`,
    method: 'delete',
    data
  })
}
// 下载报告
export function downloadReport(data) {
  return request({
    url: '/re/report/download',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
// 登记管理下载把哦哦啊
export function downloadReportWithDengji(data) {
  return request({
    url: '/re/report/downloadSmaple',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
