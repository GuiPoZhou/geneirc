import request from '@/utils/request'

// 库存查询列表数据
export function scoken(query) {
  return request({
    url: '/curingRoom/intoRecord/stockList',
    method: 'get',
    params: query,
  })
}

// 库存查询出库
export function stcheck(formData) {
  return request({
    url: '/curingRoom/intoRecord/addRemoveRecord',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: formData,
  })
}

// 库存查询移动
export function chacheck(formData) {
  return request({
    url: '/curingRoom/intoRecord/move',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'application/json' },
  })
}

// 入库记录列表数据
export function queryList(query) {
  return request({
    url: '/curingRoom/intoRecord/list',
    method: 'get',
    params: query,
  })
}

// 入库记录列表添加
export function addcom(formData) {
  return request({
    url: '/curingRoom/intoRecord',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: formData,
  })
}

// 入库记录查看
export function loken(id) {
  return request({
    url: `/curingRoom/intoRecord/${id}`,
    method: 'get',
  })
}

// 入库记录删除
export function detelet(id) {
  return request({
    url: `/curingRoom/intoRecord/${id}`,
    method: 'delete',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
// 出库记录列表数据
export function checkon(query) {
  return request({
    url: '/curingRoom/removeRecord/list',
    method: 'get',
    params: query,
  })
}

// 出库记录查看
export function cheok(id) {
  return request({
    url: `/curingRoom/removeRecord/${id}`,
    method: 'get',
  })
}

// 出库记录删除
export function decheck(id) {
	return request({
		url: `/curingRoom/removeRecord/${id}`,
		method: 'delete',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	})
}
// 养护室管理导出
export function exportTable(params) {
	return request({
		url: `/curingRoom/intoRecord/export`,
		method: 'get',
		params: {CuringRoomSearch: params},
	})
}
// 入库记录导出
export function exportWarehousing(params) {
	return request({
		url: `/curingRoom/intoRecord/exportWarehousing`,
		method: 'get',
		params: {CuringRoomSearch: params},
	})
}
// 出库记录导出
export function exportRemoveRecord(params) {
	return request({
		url: `/curingRoom/removeRecord/export`,
		method: 'get',
		params: {CuringRoomSearch: params},
	})
}
