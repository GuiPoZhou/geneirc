//检测管理-排版检测
import request from '@/utils/request'

//排版检测详情导出
export function exportTypography(data) {
  return request({
    url: `/tk/tube/exportTypography`,
    method: 'post',
    responseType: 'blob',
    async: false,
    data
  })
}

// 排版列表导出
export function exportTypographyList(data) {
  return request({
    url: `/chk/task/exportTypography`,
    method: 'post',
    responseType: 'blob',
    async: false,
    data
  })
}


//排版检测列表
export function getPageList(query) {
  return request({
    url: '/chk/task/listTypography',
    method: 'get',
    params: query
  })
}

//删除检测排版任务
export function delTestTube(id) {
  return request({
    url: `/chk/task/deleteTypography`,
    method: 'delete',
    data: id
  })
}

//排版检测任务---添加样本
export function saveTubeTypography(data) {
  return request({
    url: '/tk/tube/saveTubeTypography',
    method: 'post',
    data: data
  })
}

//根据检测任务ID查询此任务的孔位或为空孔位
export function selectByIdItem(query) {
  return request({
    url: '/chk/task/selectByIdItem',
    method: 'get',
    params: query
  })
}

//新增样本
export function selectByIdItemIsEmpty(query) {
  return request({
    url: '/chk/task/selectByIdItemIsEmpty',
    method: 'get',
    params: query
  })
}

//新增排版任务
export function saveTypography(data) {
  return request({
    url: '/chk/task/saveTypography',
    method: 'post',
    data: data
  })
}

//编辑排版任务
export function updateTypography(data) {
  return request({
    url: '/chk/task/updateTypography',
    method: 'put',
    data: data
  })
}

//检测任务类型
export function detectionSaskType(query) {
  return request({
    url: '/bs/pat/tp/list',
    method: 'get',
    params: query
  })
}

//标本类型
export function specimenType(query) {
  return request({
    url: '/bs/mt/tp/list',
    method: 'get',
    params: query
  })
}

//排版详情-列表
export function listItem(data) {
  return request({
    url: '/chk/task/listItem',
    method: 'post',
    data: data
  })
}


//排版检测详情--删除
export function deletePall(id) {
  return request({
    url: '/chk/task/deletePall',
    method: 'delete',
    data: id
  })
}

//编辑属性类
export function updateType(data) {
  return request({
    url: '/tk/tube/updateType',
    method: 'put',
    data: data
  })
}

//换孔操作
export function inHole(data) {
  return request({
    url: '/chk/task/inHole',
    method: 'put',
    data: data
  })
}

//检测管理排版详情--导入
export function importTyography(data) {
  return request({
    url: `/tk/tube/importTyography`,
    method: 'post',
    responseType: 'blob',
    async: false,
    data
  })
}

//检测管理排版详情--下载导入模板
export function downTemplateTypography(data) {
  return request({
    url: '/tk/tube/downTemplateTypography',
    method: 'post',
    responseType: 'blob',
    data: data
  })
}


