import request from '@/utils/request'

// 获取页面配置
export function  getEnvCustomerList(query) {
  return request({
    url: '/formDesign/common/getEnvCustomerList/',
    method: 'get',
    params: query
  })
}

// 选择方案控件-方案列表
export function  getDetectSchemeList(query) {
  return request({
    url: '/v1/detectSchemes/entrustChooseDetectList',
    method: 'get',
    params: query
  })
}

// 选择方案控件-方案想信息
export function  getDetectSchemeDetailByDate(id, executeDate) {
  return request({
    url: '/v1/dynamicDetectSchemes/entrustChooseDetect/'+id+'/'+executeDate,
    method: 'get',
  })
}

// 选择单位控件-单位列表
export function  getDeptInfoList(query) {
  return request({
    url: '/resources/v1/deptInfo',
    method: 'get',
    params: query
  })
}

// 选择单位控件-单位详细信息
export function  getDeptInfoDetail(id) {
  return request({
    url: '/resources/v1/deptInfo'+id,
    method: 'get',
    params: query
  })
}

// 选择单位控件-单位列表
export function  getSubcontractorList(id, query) {
  return request({
    url: '/resources/v1/subcontractor',
    method: 'get',
    params: query
  })
}


// 选择人员&部门控件-人员列表
export function  getPeopleList(query) {
  return request({
    url: 'system/user/list',
    method: 'get',
    params: query
  })
}
