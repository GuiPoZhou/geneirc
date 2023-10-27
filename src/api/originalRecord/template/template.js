import request from '@/utils/request'
import qs from 'qs'
//项目方法分页列表
export function getList(query) {
  return request({
    url: '/originalRecord/v1/originalRecordTemplate',
    method: 'get',
    params: query,
  })
}
// 模板分类列表
export function listTemplateTypes() {
  return request({
    url: '/system/dict/data/listAll',
    method: 'get',
    params: {"dictType":"template_type"},
  })
}


// 添加模板
export function addTemplate(data) {
  return request({
    url: '/originalRecord/v1/originalRecordTemplate',
    method: 'post',
    data: data,
  })
}

// 编辑模板
export function updateTemplate(data) {
  return request({
    url: '/originalRecord/v1/originalRecordTemplate',
    method: 'put',
    data: data,
  })
}

// 模板详情
export function getDetail(id) {
  return request({
    url: '/originalRecord/v1/originalRecordTemplate/'+id,
    method: 'get',
  })
}

// 模板复制
export function copy(id) {
  return request({
    url: '/originalRecord/v1/originalRecordTemplate/clone/'+id,
    method: 'get',
  })
}

// 下载模板
export function download(id) {
  return request({
    url: '/originalRecord/v1/originalRecordTemplate/download/'+id,
    method: 'get',
  })
}

export function listElns() {
  return request({
    url: '/elnRecord/listAll',
    method: 'get',
  })
}






