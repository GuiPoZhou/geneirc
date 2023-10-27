import request from '@/utils/request'

//仪器记录列表2
export function getInstrumentRecordOneList(query) {
    return request({
        url: '/iot/dataReadingInstrument2',
        method: 'get',
        params: query,
    })
}
//仪器记录列表2的读取
export function getInstrumentRecordOneReadpdf(query) {
    return request({
        url: '/iot/dataReadingInstrument2/readpdf',
        method: 'get',
        params: query,
    })
}
//仪器记录列表2保存接口
export function InstrumentRecordOneSave(query,id) {
    return request({
        url: '/iot/dataReadingInstrument2/' + id,
        method: 'put',
        params: query
    })
}

//仪器记录列表1
export function getInstrumentRecordTwoList(query) {
    return request({
        url: '/iot/dataReadingInstrument1',
        method: 'get',
        params: query,
    })
}
//仪器记录列表1的读取
export function getInstrumentRecordTwoReadpdf(query) {
    return request({
        url: '/iot/dataReadingInstrument1/readpdf',
        method: 'get',
        params: query,
    })
}
//仪器记录列表1行保存接口
export function InstrumentRecordTwoSave(data,id) {
    return request({
        url: '/iot/dataReadingInstrument1/' + id,
        method: 'put',
        params: data
    })
}

