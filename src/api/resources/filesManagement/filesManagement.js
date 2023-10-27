import request from '@/utils/request'

/******************************************受控文件一览表***********************************************/

// 查询文件树列表
export function getFiletreeList(query) {
  return request({
    url: '/fileManage/tree/select',
    method: 'get',
    params: query,
  })
}
//文件树新增
export function addFiletree(data) {
  return request({
    url: '/fileManage/tree',
    method: 'post',
    data,
  })
}
// 修改文件树列表
export function editFiletreeList(data) {
  return request({
    url: '/fileManage/tree',
    method: 'put',
    data,
  })
}
// 文件树删除
export function deleteFileree(id) {
  return request({
    url: '/fileManage/tree/' + id,
    method: 'delete',
  })
}
// 受控文件列表
export function getFileList(query) {
  return request({
    url: '/fileManage/base/controllFileList',
    method: 'get',
    params: query,
  })
}
// 文件上传
export function uploadFiles(formData) {
  return request({
    url: '/fileManage/upload',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    data: formData,
  })
}
// 授权岗位查询
export function getselectPost(query) {
  return request({
    url: '/fileManage/common/selectPost',
    method: 'get',
    params: query,
  })
}
// 授权角色查询
export function getselectRole(query) {
  return request({
    url: '/fileManage/common/selectRole',
    method: 'get',
    params: query,
  })
}
// 新增文件
export function addControllFile(data) {
  return request({
    url: '/fileManage/base/addControllFile',
    method: 'post',
    data,
  })
}
// 查看详情
export function getFileredetail(fileId) {
  return request({
    url: '/fileManage/base/controllerFileDetail/' + fileId,
    method: 'get',
  })
}
// 修改文件
export function editControllFile(data) {
  return request({
    url: '/fileManage/base/updateControllFile',
    method: 'put',
    data,
  })
}
// 删除文件
export function deleteControllFile(id) {
  return request({
    url: '/fileManage/base/controllFile/' + id,
    method: 'delete',
  })
}
// 导出
export function exportControll(query) {
  return request({
    url: '/fileManage/base/exportControll',
    method: 'get',
    params: query
  })
}
// 文件历史记录
export function getFileOperateRecordList(query) {
  return request({
    url: '/fileManage/common/fileOperateRecordList',
    method: 'get',
    params: query,
  })
}
// 文件借阅
export function borrowPrintRecord(data) {
  return request({
    url: '/fileManage/borrowPrintRecord',
    method: 'post',
    data,
  })
}
// 文件历史记录（查看下载）
export function getInsertOperateRecord(id,type) {
  return request({
    url: '/fileManage/common/insertOperateRecord/' + id + '/' + type,
    method: 'get',
  })
}
// 审批流程
export function getApprovalProcess(query) {
  return request({
    url: '/v1/dynamicProcess/selectProcessDetail',
    method: 'get',
    params: query,
  })
}

/******************************************外来文件登记***********************************************/

// 外来文件登记列表
export function getexternalFileList(query) {
  return request({
    url: '/fileManage/base/externalFileList',
    method: 'get',
    params: query,
  })
}
// 新增
export function addExternalFile(data) {
  return request({
    url: '/fileManage/base/addExternalFile',
    method: 'post',
    data,
  })
}
// 查看详情
export function getExternaldetail(fileId) {
  return request({
    url: '/fileManage/base/externalFileDetail/' + fileId,
    method: 'get',
  })
}
// 修改
export function editExternalFile(data) {
  return request({
    url: '/fileManage/base/updateExternalFile',
    method: 'put',
    data,
  })
}
// 删除
export function deleteExternalFile(id) {
  return request({
    url: '/fileManage/base/externalFile/' + id,
    method: 'delete',
  })
}
// 导出
export function exportExternal(query) {
  return request({
    url: '/fileManage/base/exportExternal',
    method: 'get',
    params: query
  })
}

/******************************************文件借阅/打印***********************************************/

// 文件借阅/打印列表
export function getBorrowPrintList(query) {
  return request({
    url: '/fileManage/borrowPrintRecord/list',
    method: 'get',
    params: query,
  })
}
// 查看详情
export function getBorrowPrintdetail(id) {
  return request({
    url: '/fileManage/borrowPrintRecord/' + id,
    method: 'get',
  })
}
// 归还
export function getRevertBorrow(id) {
  return request({
    url: '/fileManage/borrowPrintRecord/revertBorrow/' + id,
    method: 'get',
  })
}
// 删除
export function delBorrowPrint(id) {
  return request({
    url: '/fileManage/borrowPrintRecord/delete/' + id,
    method: 'delete',
  })
}
// 导出
export function exportBorrowPrint(query) {
  return request({
    url: '/fileManage/borrowPrintRecord/export',
    method: 'get',
    params: query
  })
}
// 附件操作
export function uploadfilde(id, uploadFileId) {
  return request({
    url: '/fileManage/borrowPrintRecord/operationFile/' + id + '/' + uploadFileId,
    method: 'get',
  })
}

/******************************************文件更改申请***********************************************/

// 文件更改申请列表
export function getchangeApplyList(query) {
  return request({
    url: '/fileManage/changeApply/list',
    method: 'get',
    params: query,
  })
}
// 新增
export function addChangeApply(data) {
  return request({
    url: '/fileManage/changeApply',
    method: 'post',
    data,
  })
}
// 修改
export function editChangeApply(data) {
  return request({
    url: '/fileManage/changeApply',
    method: 'put',
    data,
  })
}
// 查看详情
export function getChangeApplydetail(id) {
  return request({
    url: '/fileManage/changeApply/' + id,
    method: 'get',
  })
}
// 删除
export function deleteChangeApply(id) {
  return request({
    url: '/fileManage/changeApply/delete/' + id,
    method: 'get',
  })
}
// 导出
export function exportChangeApply(query) {
  return request({
    url: '/fileManage/changeApply/export',
    method: 'get',
    params: query
  })
}

/******************************************文件替换更改记录***********************************************/

// 文件替换更改记录列表
export function getReplaceRecordList(query) {
  return request({
    url: '/fileManage/replaceRecord/list',
    method: 'get',
    params: query,
  })
}
// 新增
export function addReplaceRecord(data) {
  return request({
    url: '/fileManage/replaceRecord',
    method: 'post',
    data,
  })
}
// 查看详情
export function getReplaceRecorddetail(id) {
  return request({
    url: '/fileManage/replaceRecord/' + id,
    method: 'get',
  })
}
// 修改
export function editReplaceRecord(data) {
  return request({
    url: '/fileManage/replaceRecord',
    method: 'put',
    data,
  })
}
// 删除
export function deleteReplaceRecord(id) {
  return request({
    url: '/fileManage/replaceRecord/delete/' + id,
    method: 'get',
  })
}
// 导出
export function exportReplaceRecord(query) {
  return request({
    url: '/fileManage/replaceRecord/export',
    method: 'get',
    params: query
  })
}

/******************************************文件作废登记***********************************************/

// 文件作废登记列表
export function getAbolishList(query) {
  return request({
    url: '/fileManage/abolish/list',
    method: 'get',
    params: query,
  })
}
// 新增
export function addAbolish(data) {
  return request({
    url: '/fileManage/abolish',
    method: 'post',
    data,
  })
}
// 查看详情
export function getAbolishdetail(id) {
  return request({
    url: '/fileManage/abolish/' + id,
    method: 'get',
  })
}
// 修改
export function editAbolish(data) {
  return request({
    url: '/fileManage/abolish',
    method: 'put',
    data,
  })
}
// 删除
export function deleteAbolish(id) {
  return request({
    url: '/fileManage/abolish/delete/' + id,
    method: 'get',
  })
}
// 导出
export function exportAbolish(query) {
  return request({
    url: '/fileManage/abolish/export',
    method: 'get',
    params: query
  })
}

/******************************************文件归档***********************************************/

// 文件归档列表
export function getArchivesList(query) {
  return request({
    url: '/fileManage/archives/list',
    method: 'get',
    params: query,
  })
}
// 新增
export function addArchives(data) {
  return request({
    url: '/fileManage/archives',
    method: 'post',
    data,
  })
}
// 查看详情
export function getArchivesdetail(id) {
  return request({
    url: '/fileManage/archives/' + id,
    method: 'get',
  })
}
// 修改
export function editArchives(data) {
  return request({
    url: '/fileManage/archives',
    method: 'put',
    data,
  })
}
// 删除
export function deleteArchives(id) {
  return request({
    url: '/fileManage/archives/delete/' + id,
    method: 'get',
  })
}
// 导出
export function exportArchives(query) {
  return request({
    url: '/fileManage/archives/export',
    method: 'get',
    params: query
  })
}
