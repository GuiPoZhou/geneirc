import request from '@/utils/request'

export function getReportCenter(url, query) {
    return request({
        url: url,
        method: 'get',
        params: query,
    })
}
