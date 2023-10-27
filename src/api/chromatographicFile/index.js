import request from '@/utils/request'

// 标准物质使用记录列表
export function queryList(businessId) {
  return request({
    url: '/v1/base/materialUseRecord',
    method: 'get',
    params: {
      businessId: businessId
    },
  })
}
