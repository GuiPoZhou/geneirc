import request from '@/utils/request'

/************************************待领任务****************************/

// 检测项目查询
export function getTestitems(query) {
  return request({
    url: '/bs/chk/obj/listLive3',
    method: 'get',
    params: query
  })
}
// 查询标本类型
export function getSpecimenType(query) {
  return request({
    url: '/bs/mt/tp/list',
    method: 'get',
    params: query
  })
}
// 待领取任务查询
export function getWaitAcceptSampleTask(query) {
  return request({
    url: '/sampleTask/queryWaitAcceptSampleTask',
    method: 'get',
    params: query
  })
}
// 获取采样地点
export function getLocation(query) {
  return request({
    url: '/bs/sp/location/list',
    method: 'get',
    params: query
  })
}
// 机构
export function getcheckDept(query) {
  return request({
    url: '/system/dept/list/checkDept',
    method: 'get',
    params: query
  })
}
// 添加任务
export function addSampleTask(data) {
  return request({
    url: '/sampleTask/addSampleTask',
    method: 'post',
    data:data
  })
}
// 获详情
export function getSampleTaskDetail(sampleTaskId) {
  return request({
    url: '/sampleTask/querySampleTaskDetail/' + sampleTaskId,
    method: 'get'
  })
}
// 获取人员
export function getPeoplsDeptlist(query) {
  return request({
    url: '/system/user/queryDeptlist',
    method: 'get',
    params: query
  })
}
// 变更人员
export function updateSampleTaskUser(data) {
  return request({
    url: '/sampleTask/updateSampleTaskUser',
    method: 'post',
    data:data
  })
}
// 采样任务修改
export function updateSampleTask(data) {
  return request({
    url: '/sampleTask/updateSampleTask',
    method: 'post',
    data:data
  })
}
// 删除
export function delSampleTask(sampleTaskId) {
  return request({
    url: '/sampleTask/delSampleTask/' + sampleTaskId,
    method: 'get'
  })
}
// 领取详情
export function getReceiveSampleTaskList(sampleTaskIds) {
  return request({
    url: '/sampleTask/queryReceiveSampleTaskList/' + sampleTaskIds,
    method: 'get'
  })
}
// 采样任务领取
export function receiveSampleTask(data) {
  return request({
    url: '/sampleTask/receiveSampleTask',
    method: 'post',
    data:data
  })
}
// 试管列表
export function getTubeDetailList(query) {
  return request({
    url: '/sampleTask/querySampleTaskTubeDetailList',
    method: 'get',
    params: query
  })
}
// 修改试管信息
export function updateSampleTaskTube(data) {
  return request({
    url: '/sampleTask/updateSampleTaskTube',
    method: 'post',
    data:data
  })
}
// 试管删除
export function delTaskTube(taskTubeIds) {
  return request({
    url: '/sampleTask/delTaskTube/' + taskTubeIds,
    method: 'get'
  })
}
// 任务导出
export function exportTaskSample(sampleTaskIds) {
  return request({
    url: '/sampleTask/exportTaskSample/' + sampleTaskIds,
    method: 'get',
  })
}
// 试管导出
export function exportTaskTube(query) {
  return request({
    url: '/sampleTask/exportTaskTube',
    method: 'get',
    params: query
  })
}
// 获取样本（人）列表
export function getTaskTubeSampleDetail(sampleTaskTubeId) {
  return request({
    url: '/sampleTask/queryTaskTubeSampleDetail/' + sampleTaskTubeId,
    method: 'get',
  })
}
// 添加受检样本
export function addTaskTubeSample(data) {
  return request({
    url: '/sampleTask/addTaskTubeSample',
    method: 'post',
    data:data
  })
}
// 修改人员
export function updateSampleInfo(data) {
  return request({
    url: '/sampleManager/updateSampleInfo',
    method: 'post',
    data:data
  })
}
// 人员删除
export function delTaskTubeSample(taskTubeSampleId) {
  return request({
    url: '/sampleTask/delTaskTubeSample/' + taskTubeSampleId,
    method: 'get',
  })
}
/*****************************已领任务************************************/

export function getAcceptSampleTask(query) {
  return request({
    url: '/sampleTask/queryAcceptSampleTask',
    method: 'get',
    params: query
  })
}
// 添加试管
export function addTaskTube(data) {
  return request({
    url: '/sampleTask/addTaskTube',
    method: 'post',
    data:data
  })
}
// 退回任务
export function returnSampleTask(sampleTaskId) {
  return request({
    url: '/sampleTask/returnSampleTask/' + sampleTaskId,
    method: 'get',
  })
}
// 打印标签
export function getSampleTaskTubeLabel(data) {
  return request({
    url: '/sampleTask/querySampleTaskTubeLabel',
    method: 'post',
    data:data
  })
}
// 打印标签
export function updateSampleTaskTubeLabel(data) {
  return request({
    url: '/sampleTask/updateSampleTaskTubePrint',
    method: 'post',
    data:data
  })
}
// 样本导入
export function importSample(data) {
  return request({
    url: '/sampleTask/importSample',
    method: 'post',
    data:data
  })
}
// 退回任务
export function submitSampleTask(sampleTaskIds) {
  return request({
    url: '/sampleTask/submitSampleTask/' + sampleTaskIds,
    method: 'get',
  })
}
// 送检判断
export function validatorSubmit(sampleTaskIds) {
  return request({
    url: '/sampleTask/validatorSubmit/' + sampleTaskIds,
    method: 'get',
  })
}
// 下载导入模板
export function getsampleTemplate() {
  return request({
    url: "/sampleTask/getImportTemplate",
    method: "get",
    responseType: 'blob'
  })
}
