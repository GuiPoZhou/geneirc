/*
 *@author: 焦政
 *@date: 2022-02-18 11:37:40
 *@description:模块主页相关
*/
import { getToken } from '@/utils/auth'
const MenuId = localStorage.getItem('menuId')

export default {
  data() {
    return {}
  },
  mounted() {

  },
  methods: {
    // 页码连续
    getOrderNumber(arr, pageNum, pageSize) {
      if (arr.length == 0) {
        return []
      }
      arr.map((item, index) => {
        item.index = (pageNum - 1) * pageSize + index + 1
      })
      return arr
    },
    // 获取当前时间/时间格式化 date：有值时将传值数据格式化
    dateFormatter(type, data = null) {
      let d, year, month, day, hour, minute, second = null
      if (data == null) {
        d = new Date()
      } else {
        d = new Date(data)
      }
      year = d.getFullYear()//得到年
      month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)//得到月
      day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()//得到日
      hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()//得到时
      minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()//得到分
      second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()//得到秒
      if (type == 'date') {
        return [year, month, day].join('-') //格式为：YY-MM-DD
      } else {
        return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':')//格式为：YY-MM-DD hh:mm:ss
      }
    },
    // 获取字典值
    getDictionary(type) {
      let arr = []
      this.$net(`system/dict/data/type/${type}`, 'get').then((res) => {
        if (res.code == 200) {
          res.data.map((item) => {
            let obj = {
              label: item.dictLabel,
              value: item.dictValue
            }
            arr.push(obj)
          })
        }
      })
      return arr
    },
    // 回显table列表字典值
    echoData(id, arr) {
      let data = ''
      arr.map((item) => {
        if (id == item.value) {
          data = item.label
        }
      })
      return data
    },
    // 通过文件名下载文件 方法
    downLoadFile(fileName, isTrue = true) {
      const baseURL = window.globalEnv.VUE_APP_BASE_API
      window.location.href = baseURL + '/common/download?fileName=' + encodeURI(fileName) + '&delete=' + isTrue+'&Authorization='+getToken()+ '&MenuId=' + MenuId
    },
    // 通过文件路径下载文件 方法
    downLoadFile2(fileName, isTrue = true) {
      const baseURL = window.globalEnv.VUE_APP_BASE_API
      window.location.href = baseURL + '/common/downloadFile?fileName=' + encodeURI(fileName) + '&delete=' + isTrue+'&Authorization='+getToken()+ '&MenuId=' + MenuId
    }
  }
}
