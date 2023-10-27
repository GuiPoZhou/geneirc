import request from "@/utils/request";

// 获取待生成列表信息
export function getUnCreateList(query) {
  console.log(query);
  return request({
    url: "/resultsEntry/v1/detectionTaskNew/unCreateList",
    method: "get",
    params: query,
  });
}

// 获取已生成列表信息
export function getCreatedList(query) {
  return request({
    url: "/resultsEntry/v1/detectionTaskNew/createdList",
    method: "get",
    params: query,
  });
}

// 获取待生成-生成记录列表
export function getUnCreatedDetail(agreementId, query) {
  return request({
    url: `/resultsEntry/v1/detectionTaskNew/unCreateList/${agreementId}`,
    method: "get",
    params: query,
  });
}

// 获取已生成-查看&打印列表
export function getCreatedDetail(agreementId, query) {
  return request({
    url: `/resultsEntry/v1/detectionTaskNew/createdList/${agreementId}`,
    method: "get",
    params: query,
  });
}

// 生成原始记录操作
export function getGenerate(query) {
  return request({
    url: "/originalRecord/v1/originalRecordInfo",
    method: "get",
    params: query,
  });
}

// 审批记录列表
export function getGeneratess(detectionId) {
  return request({
    url: `/originalRecord/v1/auditLog/getAuditLogList/${detectionId}`,
    method: "get",
  });
}

// 已生成-查看&打印-删除
export function deleteRecordInfo(query) {
  return request({
    url: `/originalRecord/v1/originalRecordInfo`,
    method: "delete",
    params: query,
  });
}
