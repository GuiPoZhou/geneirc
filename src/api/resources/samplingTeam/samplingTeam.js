import request from '@/utils/request'

//采样小组列表
export function list(query) {
    return request({
        url: '/resources/v1/team',
        method: 'get',
        params: query,
    })
}

//采样小组新增
export function add(data) {
  return request({
    url: '/resources/v1/team',
    method: 'post',
    data: data,
  })
}

//采样小组编辑
export function update(data,teamId) {
  return request({
    url: '/resources/v1/team/'+teamId,
    method: 'put',
    data: data,
  })
}

//采样小组详情
export function getDetailById(teamId) {
  return request({
    url: '/resources/v1/team/'+teamId,
    method: 'get',
  })
}

//删除采样小组
export function deleteTeam(teamId) {
  return request({
    url: '/resources/v1/team/'+teamId,
    method: 'delete',
  })
}


// 查询用户列表
export function userList(query) {
	return request({
		url: '/resources/v1/teamUser/getUserList',
		method: 'get',
		params:query
	})
}




