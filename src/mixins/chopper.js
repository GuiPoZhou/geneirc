
export default {
  data() {
    return {
      mergeLine: {},
      mergeIndex: {},
      resultEntryMergeLine: {},
      resultEntryMergeIndex: {},

    }
  },
  methods: {
    //排序
    resultData(tableData, merge) {

      return tableData.sort(this.sortByArr(merge,true))

    },
    // 数组根据数组对象中的某个属性值进行排序的方法
    // 使用例子：newArray.sort(sortByArr(['number'],false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
    // @param attr 排序的属性 ['name','sex'...],根据一个字段或者多个字段排序
    // @param rev true表示升序排列，false降序排序
    sortByArr(arr, rev) {
      if (rev === undefined) {
        rev = 1;
      } else {
        rev = (rev) ? 1 : -1;
      }
      return function(a, b) {
        for (let i = 0; i < arr.length; i++) {
          let attr = arr[i]
          if (a[attr] !== b[attr]) {
            if (a[attr] > b[attr]) {
              return rev * 1;
            } else {
              return rev * -1;
            }
          }
        }
      }
    },
    //合并表格
    mergeMethod ({ row, column, rowIndex, columnIndex }) {
      const index = this.merge.indexOf(column.property)
      if (index > -1) {
        const _row = this.mergeIndex[this.merge[index]][rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    //组织数据结构
    getMergeArr (tableData, merge) {
      if (!merge) return
      this.mergeLine = {}
      this.mergeIndex = {}
      const tableDatas = this.resultData(tableData, merge)
      merge.forEach((item, k) => {
        tableDatas.forEach((data, i) => {
          if (i === 0) {
            this.mergeIndex[item] = this.mergeIndex[item] || []
            this.mergeIndex[item].push(1)
            this.mergeLine[item] = 0
          } else {
            let preColumnValueA = ""
            let preColumnValueB = ""

            for (let j = k; j >=0; j--) {
              preColumnValueA += data[merge[j-1]]+","
              preColumnValueB += tableData[i - 1][merge[j-1]]+","
            }

            if (data[item] === tableData[i - 1][item] && (k===0|| preColumnValueA === preColumnValueB)) {
              this.mergeIndex[item][this.mergeLine[item]] += 1
              this.mergeIndex[item].push(0)
            } else {
              this.mergeIndex[item].push(1)
              this.mergeLine[item] = i
            }
          }
        })
      })
    },
    //结果录入表格
    resultEntryMergeMethod({row, column, rowIndex, columnIndex}) {
      const index = this.merge.indexOf(column.property)
      if (index > -1) {
        const _row = this.resultEntryMergeIndex[this.merge[index]][rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    //组织数据结构
    getResultEntryMergeArr(tableData, merge) {
      if (!merge) return
      this.resultEntryMergeLine = {}
      this.resultEntryMergeIndex = {}
      // const tableDatas = this.resultData(tableData, merge)
      const tableDatas = tableData
      merge.forEach((item, k) => {
        tableDatas.forEach((data, i) => {
          if (i === 0) {
            this.resultEntryMergeIndex[item] = this.resultEntryMergeIndex[item] || []
            this.resultEntryMergeIndex[item].push(1)
            this.resultEntryMergeLine[item] = 0
          } else {
            let preColumnValueA = ""
            let preColumnValueB = ""

            for (let j = k; j >= 0; j--) {
              preColumnValueA += data[merge[j - 1]] + ","
              preColumnValueB += tableData[i - 1][merge[j - 1]] + ","
            }

            if (data[item] === tableData[i - 1][item] && (k === 0 || preColumnValueA === preColumnValueB)) {
              this.resultEntryMergeIndex[item][this.resultEntryMergeLine[item]] += 1
              this.resultEntryMergeIndex[item].push(0)
            } else {
              this.resultEntryMergeIndex[item].push(1)
              this.resultEntryMergeLine[item] = i
            }
          }
        })
      })
    },
  },
}


