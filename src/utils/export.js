/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
        time = parseInt(time)
      }
      if (typeof time === 'number' && time.toString().length === 10) {
        time = time * 1000
      }
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value]
      }
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    })
    return time_str
  }
  
  /**
   * @param {number} time
   * @param {string} option
   * @returns {string}
   */
  export function formatTime(time, option) {
    if (('' + time).length === 10) {
      time = parseInt(time) * 1000
    } else {
      time = +time
    }
    const d = new Date(time)
    const now = Date.now()
  
    const diff = (now - d) / 1000
  
    if (diff < 30) {
      return '刚刚'
    } else if (diff < 3600) {
      // less 1 hour
      return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
      return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
      return '1天前'
    }
    if (option) {
      return parseTime(time, option)
    } else {
      return (
        d.getMonth() +
        1 +
        '月' +
        d.getDate() +
        '日' +
        d.getHours() +
        '时' +
        d.getMinutes() +
        '分'
      )
    }
  }
  
  /**
   * @param {string} url
   * @returns {Object}
   */
  export function getQueryObject(url) {
    url = url == null ? window.location.href : url
    const search = url.substring(url.lastIndexOf('?') + 1)
    const obj = {}
    const reg = /([^?&=]+)=([^?&=]*)/g
    search.replace(reg, (rs, $1, $2) => {
      const name = decodeURIComponent($1)
      let val = decodeURIComponent($2)
      val = String(val)
      obj[name] = val
      return rs
    })
    return obj
  }
  
  /**
   * @param {string} input value
   * @returns {number} output value
   */
  export function byteLength(str) {
    // returns the byte length of an utf8 string
    let s = str.length
    for (var i = str.length - 1; i >= 0; i--) {
      const code = str.charCodeAt(i)
      if (code > 0x7f && code <= 0x7ff) s++
      else if (code > 0x7ff && code <= 0xffff) s += 2
      if (code >= 0xdc00 && code <= 0xdfff) i--
    }
    return s
  }
  
  /**
   * @param {Array} actual
   * @returns {Array}
   */
  export function cleanArray(actual) {
    const newArray = []
    for (let i = 0; i < actual.length; i++) {
      if (actual[i]) {
        newArray.push(actual[i])
      }
    }
    return newArray
  }
  
  /**
   * @param {Object} json
   * @returns {Array}
   */
  export function param(json) {
    if (!json) return ''
    return cleanArray(
      Object.keys(json).map(key => {
        if (json[key] === undefined) return ''
        return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
      })
    ).join('&')
  }
  
  /**
   * @param {string} url
   * @returns {Object}
   */
  export function param2Obj(url) {
    const search = url.split('?')[1]
    if (!search) {
      return {}
    }
    return JSON.parse(
      '{"' +
        decodeURIComponent(search)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"')
          .replace(/\+/g, ' ') +
        '"}'
    )
  }
  
  /**
   * @param {string} val
   * @returns {string}
   */
  export function html2Text(val) {
    const div = document.createElement('div')
    div.innerHTML = val
    return div.textContent || div.innerText
  }
  
  /**
   * Merges two objects, giving the last one precedence
   * @param {Object} target
   * @param {(Object|Array)} source
   * @returns {Object}
   */
  export function objectMerge(target, source) {
    if (typeof target !== 'object') {
      target = {}
    }
    if (Array.isArray(source)) {
      return source.slice()
    }
    Object.keys(source).forEach(property => {
      const sourceProperty = source[property]
      if (typeof sourceProperty === 'object') {
        target[property] = objectMerge(target[property], sourceProperty)
      } else {
        target[property] = sourceProperty
      }
    })
    return target
  }
  
  /**
   * @param {HTMLElement} element
   * @param {string} className
   */
  export function toggleClass(element, className) {
    if (!element || !className) {
      return
    }
    let classString = element.className
    const nameIndex = classString.indexOf(className)
    if (nameIndex === -1) {
      classString += '' + className
    } else {
      classString =
        classString.substr(0, nameIndex) +
        classString.substr(nameIndex + className.length)
    }
    element.className = classString
  }
  
  /**
   * @param {string} type
   * @returns {Date}
   */
  export function getTime(type) {
    if (type === 'start') {
      return new Date().getTime() - 3600 * 1000 * 24 * 90
    } else {
      return new Date(new Date().toDateString())
    }
  }
  
  /**
   * @param {Function} func
   * @param {number} wait
   * @param {boolean} immediate
   * @return {*}
   */
  export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result
  
    const later = function() {
      // 据上一次触发时间间隔
      const last = +new Date() - timestamp
  
      // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last)
      } else {
        timeout = null
        // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
        if (!immediate) {
          result = func.apply(context, args)
          if (!timeout) context = args = null
        }
      }
    }
  
    return function(...args) {
      context = this
      timestamp = +new Date()
      const callNow = immediate && !timeout
      // 如果延时不存在，重新设定延时
      if (!timeout) timeout = setTimeout(later, wait)
      if (callNow) {
        result = func.apply(context, args)
        context = args = null
      }
  
      return result
    }
  }
  
  /**
   * This is just a simple version of deep copy
   * Has a lot of edge cases bug
   * If you want to use a perfect deep copy, use lodash's _.cloneDeep
   * @param {Object} source
   * @returns {Object}
   */
  export function deepClone(source) {
    if (!source && typeof source !== 'object') {
      throw new Error('error arguments', 'deepClone')
    }
    const targetObj = source.constructor === Array ? [] : {}
    Object.keys(source).forEach(keys => {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    })
    return targetObj
  }
  
  /**
   * @param {Array} arr
   * @returns {Array}
   */
  export function uniqueArr(arr) {
    return Array.from(new Set(arr))
  }
  
  /**
   * @returns {string}
   */
  export function createUniqueString() {
    const timestamp = +new Date() + ''
    const randomNum = parseInt((1 + Math.random()) * 65536) + ''
    return (+(randomNum + timestamp)).toString(32)
  }
  
  /**
   * Check if an element has a class
   * @param {HTMLElement} elm
   * @param {string} cls
   * @returns {boolean}
   */
  export function hasClass(ele, cls) {
    return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
  }
  
  /**
   * Add class to element
   * @param {HTMLElement} elm
   * @param {string} cls
   */
  export function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += ' ' + cls
  }
  
  /**
   * Remove class from element
   * @param {HTMLElement} elm
   * @param {string} cls
   */
  export function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
      const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
      ele.className = ele.className.replace(reg, ' ')
    }
  }
  
  export function isPhone() {
    const browser = navigator.userAgent.toLowerCase()
    var phone = /iphone|ipod|ipad|android|mobile|blackberry|webos|incognito|webmate|bada|nokia|lg|ucweb|skyfire|micromessenger/i
    return phone.test(browser)
  }
  
  export function uploadUrl(uri) {
    const env = process.env.NODE_ENV
  
    if (env === 'development') {
      if (uri.indexOf('/') === 0) {
        return '/api/api' + uri
      } else {
        return '/api/api/' + uri
      }
    } else {
      if (uri.indexOf('/') === 0) {
        return 'http://logistics.ange-inc.com:8388/api' + uri
      } else {
        return 'http://logistics.ange-inc.com:8388/api/' + uri
      }
    }
  }
  
  export const GPS = {
    PI: 3.14159265358979324,
    x_pi: (3.14159265358979324 * 3000.0) / 180.0,
    delta: function(lat, lon) {
      // Krasovsky 1940
      //
      // a = 6378245.0, 1/f = 298.3
      // b = a * (1 - f)
      // ee = (a^2 - b^2) / a^2;
      var a = 6378245.0 //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
      var ee = 0.00669342162296594323 //  ee: 椭球的偏心率。
      var dLat = this.transformLat(lon - 105.0, lat - 35.0)
      var dLon = this.transformLon(lon - 105.0, lat - 35.0)
      var radLat = (lat / 180.0) * this.PI
      var magic = Math.sin(radLat)
      magic = 1 - ee * magic * magic
      var sqrtMagic = Math.sqrt(magic)
      dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * this.PI)
      dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * this.PI)
      return { lat: dLat, lon: dLon }
    },
  
    // WGS-84 to GCJ-02
    gcj_encrypt: function(wgsLat, wgsLon) {
      if (this.outOfChina(wgsLat, wgsLon)) {
        return { lat: wgsLat, lon: wgsLon }
      }
  
      var d = this.delta(wgsLat, wgsLon)
      return { lat: wgsLat + d.lat, lon: wgsLon + d.lon }
    },
    // GCJ-02 to WGS-84
    gcj_decrypt: function(gcjLat, gcjLon) {
      if (this.outOfChina(gcjLat, gcjLon)) {
        return { lat: gcjLat, lon: gcjLon }
      }
  
      var d = this.delta(gcjLat, gcjLon)
      return { lat: gcjLat - d.lat, lon: gcjLon - d.lon }
    },
    // GCJ-02 to WGS-84 exactly
    gcj_decrypt_exact: function(gcjLat, gcjLon) {
      var initDelta = 0.01
      var threshold = 0.000000001
      var dLat = initDelta
      var dLon = initDelta
      var mLat = gcjLat - dLat
      var mLon = gcjLon - dLon
      var pLat = gcjLat + dLat
      var pLon = gcjLon + dLon
      var wgsLat
      var wgsLon
      var i = 0
      /* eslint-disable */
      while (true) {
        wgsLat = (mLat + pLat) / 2;
        wgsLon = (mLon + pLon) / 2;
        var tmp = this.gcj_encrypt(wgsLat, wgsLon);
        dLat = tmp.lat - gcjLat;
        dLon = tmp.lon - gcjLon;
        if (Math.abs(dLat) < threshold && Math.abs(dLon) < threshold) {
          break;
        }
  
        if (dLat > 0) pLat = wgsLat;
        else mLat = wgsLat;
        if (dLon > 0) pLon = wgsLon;
        else mLon = wgsLon;
  
        if (++i > 10000) break;
      }
      // console.log(i);
      return { lat: wgsLat, lon: wgsLon };
    },
    // GCJ-02 to BD-09
    bd_encrypt: function(gcjLat, gcjLon) {
      var x = gcjLon;
      var y = gcjLat;
      var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
      var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
      const bdLon = z * Math.cos(theta) + 0.0065;
      const bdLat = z * Math.sin(theta) + 0.006;
      return { lat: bdLat, lon: bdLon };
    },
    // BD-09 to GCJ-02
    bd_decrypt: function(bdLat, bdLon) {
      var x = bdLon - 0.0065;
      var y = bdLat - 0.006;
      var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
      var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
      var gcjLon = z * Math.cos(theta);
      var gcjLat = z * Math.sin(theta);
      return { lat: gcjLat, lon: gcjLon };
    },
    // WGS-84 to Web mercator
    // mercatorLat -> y mercatorLon -> x
    mercator_encrypt: function(wgsLat, wgsLon) {
      var x = (wgsLon * 20037508.34) / 180.0;
      var y =
        Math.log(Math.tan(((90.0 + wgsLat) * this.PI) / 360.0)) /
        (this.PI / 180.0);
      y = (y * 20037508.34) / 180.0;
      return { lat: y, lon: x };
      /*
        if ((Math.abs(wgsLon) > 180 || Math.abs(wgsLat) > 90))
            return null;
        var x = 6378137.0 * wgsLon * 0.017453292519943295;
        var a = wgsLat * 0.017453292519943295;
        var y = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
        return {'lat' : y, 'lon' : x};
        //*/
    },
    // Web mercator to WGS-84
    // mercatorLat -> y mercatorLon -> x
    mercator_decrypt: function(mercatorLat, mercatorLon) {
      var x = (mercatorLon / 20037508.34) * 180.0;
      var y = (mercatorLat / 20037508.34) * 180.0;
      y =
        (180 / this.PI) *
        (2 * Math.atan(Math.exp((y * this.PI) / 180.0)) - this.PI / 2);
      return { lat: y, lon: x };
      /*
        if (Math.abs(mercatorLon) < 180 && Math.abs(mercatorLat) < 90)
            return null;
        if ((Math.abs(mercatorLon) > 20037508.3427892) || (Math.abs(mercatorLat) > 20037508.3427892))
            return null;
        var a = mercatorLon / 6378137.0 * 57.295779513082323;
        var x = a - (Math.floor(((a + 180.0) / 360.0)) * 360.0);
        var y = (1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * mercatorLat) / 6378137.0)))) * 57.295779513082323;
        return {'lat' : y, 'lon' : x};
        //*/
    },
    // two point's distance
    distance: function(latA, lonA, latB, lonB) {
      var earthR = 6371000.0;
      var x =
        Math.cos((latA * this.PI) / 180.0) *
        Math.cos((latB * this.PI) / 180.0) *
        Math.cos(((lonA - lonB) * this.PI) / 180);
      var y =
        Math.sin((latA * this.PI) / 180.0) * Math.sin((latB * this.PI) / 180.0);
      var s = x + y;
      if (s > 1) s = 1;
      if (s < -1) s = -1;
      var alpha = Math.acos(s);
      var distance = alpha * earthR;
      return distance;
    },
    outOfChina: function(lat, lon) {
      if (lon < 72.004 || lon > 137.8347) {
        return true;
      }
      if (lat < 0.8293 || lat > 55.8271) {
        return true;
      }
      return false;
    },
    transformLat: function(x, y) {
      var ret =
        -100.0 +
        2.0 * x +
        3.0 * y +
        0.2 * y * y +
        0.1 * x * y +
        0.2 * Math.sqrt(Math.abs(x));
      ret +=
        ((20.0 * Math.sin(6.0 * x * this.PI) +
          20.0 * Math.sin(2.0 * x * this.PI)) *
          2.0) /
        3.0;
      ret +=
        ((20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin((y / 3.0) * this.PI)) *
          2.0) /
        3.0;
      ret +=
        ((160.0 * Math.sin((y / 12.0) * this.PI) +
          320 * Math.sin((y * this.PI) / 30.0)) *
          2.0) /
        3.0;
      return ret;
    },
    transformLon: function(x, y) {
      var ret =
        300.0 +
        x +
        2.0 * y +
        0.1 * x * x +
        0.1 * x * y +
        0.1 * Math.sqrt(Math.abs(x));
      ret +=
        ((20.0 * Math.sin(6.0 * x * this.PI) +
          20.0 * Math.sin(2.0 * x * this.PI)) *
          2.0) /
        3.0;
      ret +=
        ((20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin((x / 3.0) * this.PI)) *
          2.0) /
        3.0;
      ret +=
        ((150.0 * Math.sin((x / 12.0) * this.PI) +
          300.0 * Math.sin((x / 30.0) * this.PI)) *
          2.0) /
        3.0;
      return ret;
    }
  };
  
  export function arrayToCsv(data, args = {}) {
    let columnDelimiter = args.columnDelimiter || ",";
    let lineDelimiter = args.lineDelimiter || "\n";
  
    return data.reduce((csv, row) => {
      const rowContent = Array.isArray(row)
        ? row.reduce((rowTemp, col) => {
            let ret = rowTemp ? rowTemp + columnDelimiter : rowTemp;
            if (col) {
              let formatedCol = col
                .toString()
                .replace(new RegExp(lineDelimiter, "g"), " ");
              ret += /,/.test(formatedCol) ? `"${formatedCol}"` : formatedCol;
            }
            return ret;
          }, "")
        : row;
      return (csv ? csv + lineDelimiter : "") + rowContent;
    }, "");
  }
  const BOM = "\uFEFF";
  export function exportCsv(inputData, filename = "export.csv") {
    const csv = arrayToCsv(inputData);
  
    if (navigator.msSaveOrOpenBlob) {
      let blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      let uri = encodeURI(`data:text/csv;charset=utf-8,${BOM}${csv}`);
      let downloadLink = document.createElement("a");
      downloadLink.href = uri;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }
  