import request from '@/utils/request'
// 检测设备管理列表数据
export function decal(query) {
  return request({
    url: '/monitorEquipment/list',
    method: 'get',
    params: query,
  })
}
// 检测设备管理详情
export function loodev(id) {
  return request({
    url: `/monitorEquipment/${id}`,
    method: 'get',
  })
}
// 检测设备编辑
export function edilos(data) {
  return request({
    url: '/monitorEquipment',
    method: 'put',
    data: data,
  })
}
// 检测设备管理新增
export function adddev(formData) {
  return request({
    url: '/monitorEquipment',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: formData,
  })
}
// 检测设备删除
export function deteor(id) {
  return request({
    url: `/monitorEquipment/${id}`,
    method: 'delete',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

// 获取树形结构
export function trls(query) {
  return request({
    url: '/monitorEquipmentTree/selectTree',
    method: 'get',
    params: query,
  })
}
// 树形结构新增
export function addtrls(formData) {
  return request({
    url: '/monitorEquipmentTree',
    method: 'post',
    data: formData,
  })
}
// 树形结构编辑
export function editrls(data) {
  return request({
    url: '/monitorEquipmentTree',
    method: 'put',
    data: data,
  })
}
//   获取节点详情
export function looktal(id) {
  return request({
    url: `/monitorEquipmentTree/${id}`,
    method: 'get',
  })
}
// 删除树形结构
export function deltetal(id) {
  return request({
    url: `/monitorEquipmentTree/${id}`,
    method: 'delete',
  })
}
////////////////////////
// 环境区域管理列表
export function enlist(query) {
  return request({
    url: '/testArea/list',
    method: 'get',
    params: query,
  })
}
//   环境区域管理树形结构
export function trelos(query) {
  return request({
    url: '/testAreaTree/selectTree',
    method: 'get',
    params: query,
  })
}
// 树结构新增
export function addeng(formData) {
  return request({
    url: '/testAreaTree',
    method: 'post',
    data: formData,
  })
}

// 树形结构编辑
export function editeng(data) {
  return request({
    url: '/testAreaTree',
    method: 'put',
    data: data,
  })
}
//   获取节点详情
export function lookeng(id) {
  return request({
    url: `/testAreaTree/${id}`,
    method: 'get',
  })
}
// 删除树形结构
export function deteng(id) {
  return request({
    url: `/testAreaTree/${id}`,
    method: 'delete',
  })
}
// 环境区域管理详情
export function looing(id) {
  return request({
    url: `/testArea/${id}`,
    method: 'get',
  })
}
// 环境区域管理新增
export function adlsn(formData) {
  return request({
    url: '/testArea',
    method: 'post',
    data: formData,
  })
}
// 环境区域管理编辑
export function edlts(data) {
  return request({
    url: '/testArea',
    method: 'put',
    data: data,
  })
}
// 环境区域管理删除
export function detelts(id) {
  return request({
    url: `/testArea/${id}`,
    method: 'delete',
  })
}
// 选择点检设备
export function tllop(query) {
  return request({
    url: '/monitorEquipment/selectEquipment',
    method: 'get',
    params: query,
  })
}
// 选择点检人员
export function peopls(query) {
  return request({
    url: '/testArea/selectUser',
    method: 'get',
    params: query,
  })
}

// 环境点检区域查看
export function loofal(id) {
  return request({
    url: `/testArea/${id}`,
    method: 'get',
  })
}

// 环境点检区域列表
export function optab(query) {
  return request({
    url: '/testArea/selectTestAreaRecordList',
    method: 'get',
    params: query,
  })
}

// 环境点检区域历史列表数据
export function histo(query) {
  return request({
    url: '/testAreaRecord/list',
    method: 'get',
    params: query,
  })
}

// 查看点检详情
export function lookfor(id) {
  return request({
    url: `/testAreaRecord/${id}`,
    method: 'get',
  })
}

// 修改点检记录
export function edia(data) {
  return request({
    url: '/testAreaRecord',
    method: 'put',
    data: data,
    headers: { 'Content-Type': 'application/json' },
  })
}

// 增加点检记录
export function addeven(formData) {
  return request({
    url: '/testAreaRecord',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'application/json' },
  })
}

// 修改历史记录的接口
export function historylist(query) {
  return request({
    url: '/testAreaRecordHistory/list',
    method: 'get',
    params: query,
  })
}

// 删除点检记录的接口
export function detellos(id) {
  return request({
    url: `/testAreaRecord/${id}`,
    method: 'delete',
  })
}

// 环境曲线接口
export function selechart(query) {
  return request({
    url: '/testAreaRecord/selectChart',
    method: 'get',
    params: query,
  })
}

// 试验环境导出
export function exportAreaRecord(params) {
	return request({
		url: `/testAreaRecord/export`,
		method: 'get',
		params: params,
	})
}
