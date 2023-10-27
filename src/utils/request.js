/*
 * @Autor: 焦政
 * @Date: 2021-01-08 10:32:13
 * @Description:
 */
import axios from 'axios'
import { Notification, MessageBox, Message } from 'element-ui'

import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import Vue from "vue";

const store = Vue.prototype.microStore
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: window.globalEnv.VUE_APP_BASE_API,
  // 超时
  timeout: 1000000
})


// request拦截器
service.interceptors.request.use(config => {
  // console.info(config)
  // 是否需要设置 token
  // console.log(store.state.user.authCode)
  /*if(config.headers.authCode == null) {
    delete config.headers.authCode
  }*/
  // if(store.state.user.authCode) {
  // 	config.headers.authCode = store.state.user.authCode
  // }
  const isToken = (config.headers || {}).isToken === false
  if (getToken() && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  if (localStorage.getItem('menuId')) {
    config.headers['menuId'] = localStorage.getItem('menuId') // 携带菜单id
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
  // 未设置状态码则默认成功状态
  const code = res.data.code || 200;
  // 获取错误信息
  const msg = errorCode[code] || res.data.msg || errorCode['default']
  if (code === 401) {
    MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'warning'
    }
    ).then(() => {
      store.dispatch('LogOut').then(() => {
        location.href = '/index';
      })
    })
  } else if (code === 500) {
    let message = ''
    if (res.data['错误标识符']) {
      message = `<strong><i>${msg}</i></strong><p style="margin-top:0.3rem">错误标识：${res.data['错误标识符']}</p>`
    } else {
      message = `<strong><i>${msg}</i></strong>`
    }
    Message({
      dangerouslyUseHTMLString: true,
      message: message,
      type: 'error'
    })
    return Promise.reject(new Error(msg))
  } else if (code !== 200) {

    // license校验
    if (code == 101003 || code == 100100 || code == 100200) {
      return res.data
    } else {
      console.log('from tool...')
      Notification.error({
        title: msg
      })
      return Promise.reject(msg)
    }
  } else {
    return res.data
  }
},
  error => {
    let { message } = error;
    console.log('message111', message)
    if (message == 'Request failed with status code 401') {
      Message({
        dangerouslyUseHTMLString: true,
        message: `<strong><i>登录已过期，请重新登录</i></strong>`,
        type: 'error'
      })
      localStorage.clear()
      location.href = '/index';
    } else {
      if (message == "Network Error") {
        message = "后端接口连接异常";
      }
      else if (message.includes("timeout")) {
        message = "系统接口请求超时";
      }
      else if (message.includes("Request failed with status code")) {
        message = "系统接口" + message.substr(message.length - 3) + "异常";
      }
      Message({
        message: message,
        type: 'error',
        duration: 5 * 1000
      })
    }

    return Promise.reject(error)
  }
)
export default service
// import Vue from "vue";
// const service = Vue.prototype.$request
// export default service
