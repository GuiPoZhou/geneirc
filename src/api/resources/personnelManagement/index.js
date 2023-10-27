import request from '@/utils/request'

/******************************************人员档案***********************************************/

// 人员档案列表
export function getPersonList(query) {
  return request({
    url: '/person/list',
    method: 'get',
    params: query,
  })
}
// 人员新增
export function addPerson(data) {
  return request({
    url: '/person',
    method: 'post',
    data,
  })
}
// 查看详情
export function getPersondetail(id) {
  return request({
    url: '/person/detail/' + id,
    method: 'get',
  })
}
// 人员修改
export function editPerson(data) {
  return request({
    url: '/person',
    method: 'put',
    data,
  })
}
// 导出
export function exportPerson(query) {
  return request({
    url: '/person/export',
    method: 'get',
    params: query
  })
}
//模板下载
export function downLoadTemplateperson() {
  window.location.href = window.globalEnv.VUE_APP_BASE_API + "/person/downloadImportTemplate";
}
// 删除
export function deletePerson(id) {
  return request({
    url: '/person/delete/' + id,
    method: 'delete',
  })
}

/******************************************培训计划***********************************************/

// 培训计划列表
export function getTrainPlanList(query) {
  return request({
    url: '/trainPlan/list',
    method: 'get',
    params: query,
  })
}
// 新增
export function addTrainPlan(data) {
  return request({
    url: '/trainPlan',
    method: 'post',
    data,
  })
}
// 查看详情
export function getTranplanDetail(id) {
  return request({
    url: '/trainPlan/' + id,
    method: 'get',
  })
}
// 修改
export function editTrainplan(data) {
  return request({
    url: '/trainPlan',
    method: 'put',
    data,
  })
}
// 删除
export function deleteTrainplan(id) {
  return request({
    url: '/trainPlan/' + id,
    method: 'delete',
  })
}
// 导出
export function exportTrainplan(query) {
  return request({
    url: '/trainPlan/export',
    method: 'get',
    params: query
  })
}

/******************************************培训记录表***********************************************/

// 培训记录表列表
export function getTrainRecordList(query) {
  return request({
    url: '/trainRecord/list',
    method: 'get',
    params: query,
  })
}
// 新增
export function addTrainRecord(data) {
  return request({
    url: '/trainRecord',
    method: 'post',
    data,
  })
}
// 查看详情
export function getTranrecordDetail(id) {
  return request({
    url: '/trainRecord/' + id,
    method: 'get',
  })
}
// 修改
export function editTrainrecord(data) {
  return request({
    url: '/trainRecord',
    method: 'put',
    data,
  })
}
// 删除
export function deleteTrainRecord(id) {
  return request({
    url: '/trainRecord/' + id,
    method: 'delete',
  })
}
// 导出
export function exportTrainRecord(query) {
  return request({
    url: '/trainRecord/export',
    method: 'get',
    params: query
  })
}

/******************************************培训考评记录表***********************************************/

// 培训考评记录表列表
export function getTrainCheckList(query) {
  return request({
    url: '/trainCheck/list',
    method: 'get',
    params: query,
  })
}
// 新增
export function addTrainCheck(data) {
  return request({
    url: '/trainCheck',
    method: 'post',
    data,
  })
}
// 查看详情
export function getCheckDetail(id) {
  return request({
    url: '/trainCheck/' + id,
    method: 'get',
  })
}
// 修改
export function editTrainCheck(data) {
  return request({
    url: '/trainCheck',
    method: 'put',
    data,
  })
}
// 删除
export function deleteTrainCheck(id) {
  return request({
    url: '/trainCheck/' + id,
    method: 'delete',
  })
}
// 导出
export function exportTrainCheck(query) {
  return request({
    url: '/trainCheck/export',
    method: 'get',
    params: query
  })
}
