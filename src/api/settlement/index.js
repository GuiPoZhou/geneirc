/*
 * @Autor: 焦政
 * @Date: 2021-06-29 09:24:19
 * @Description: 收款部分
 */
import request from '@/utils/request'

// 查询收款列表
export function getSettlementList(query) {
    return request({
        url: '/collectionsManagement/list',
        method: 'get',
        params: query
    })
}

// 根据委托ID查询收款信息
export function getPayMentInfo(id) {
    return request({
        url: `/collectionsManagement/receivePayment/${id}`,
        method: 'get'
    })
}



// 导出委托
export function exportWeiTuo(query) {
    return request({
        url: '/collectionsManagement/export',
        method: 'get',
        params: query
    })
}

// 保存收款
export function saveCollect(data) {
    return request({
        url: '/collectionsManagement',
        method: 'post',
        data
    })
}

// 修改
export function editCollect(collectionDetails){
  return request({
    url:'/collectionsManagement/detail',
    method:'put',
    data:collectionDetails
  })
}



// 收款明细查询
export function getCollectDetailList(query) {
    return request({
        url: '/collectionsManagement/detail/list',
        method: 'get',
        params: query
    })
}

// 根据收款明细ID查询收款明细
export function getDetailInfo(id) {
    return request({
        url: `/collectionsManagement/detail/${id}`,
        method: 'get'
    })
}

// 删除明细
export function deleteCollectDetail(id) {
    return request({
        url: `/collectionsManagement/detail/${id}`,
        method: 'delete'
    })
}

// 导出收款明细
export function exportExcelDetail(query) {
    return request({
        url: '/collectionsManagement/detail/export',
        method: 'get',
        params: query
    })
}


// 查看客户对账单
export function getStatmentList(query) {
    return request({
        url: '/accountStatement/list',
        method: 'get',
        params: query
    })
}

// 导出对账单
export function exportStatmentList(query) {
    return request({
        url: '/accountStatement/export',
        method: 'get',
        params: query
    })
}
