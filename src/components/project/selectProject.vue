<template>
  <div class="selectProject">
    <el-dialog
      title="检测项目选择"
      :visible.sync="dialogShow"
      center
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form
        :model="selectProjectParams"
        ref="selectProjectForm"
        :inline="true"
        label-width="70px"
      >
        <el-form-item label="项目名称" prop="itemNameCn">
          <el-input
            v-model="selectProjectParams.itemNameCn"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="方法编码" prop="methodCode">
          <el-input
            v-model="selectProjectParams.methodCode"
            clearable
            size="small"
          />
        </el-form-item>
        <!--                <el-form-item label="现场检测">-->
        <!--                    <el-select v-model="selectProjectParams.isScene">-->
        <!--                        <el-option label="所有" value=""></el-option>-->
        <!--                        <el-option label="是" value="true"></el-option>-->
        <!--                        <el-option label="否" value="false"></el-option>-->
        <!--                    </el-select>-->
        <!--                </el-form-item>-->
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="onSubmit"
          >搜索
          </el-button
          >
        </el-form-item>
      </el-form>
      <p>已选项目</p>
      <!-- 已选项目区域 -->
      <div class="sel-area">
        <div class="sa-list" v-for="(v, i) in showSelList" :key="i">
          <el-tag closable @close="e_close(v,i)">{{v.itemNameCn}}
          </el-tag>
        </div>
      </div>
      <!-- 表格 -->
      <p>包含项目</p>
      <el-table
        v-loading="loading"
        :data="tableData"
        height="450"
        align="center"
        stripe
        border
        ref="multipleTable"
        @select-all="handleselectAll"
        @select="e_select"
        :tree-props="{children: 'voListZ'}"
        row-key="id"
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="itemNameCn" label="项目名称" :show-overflow-tooltip="true" align="center"/>
        <!--                <el-table-column prop="isScene" label="现场检测">-->
        <!--                    <template slot-scope="scope">-->
        <!--                        <el-switch-->
        <!--                            active-color="#5B7BFA"-->
        <!--                            inactive-color="#dadde5"-->
        <!--                            v-model="scope.row.isScene"-->
        <!--                            :active-value="true"-->
        <!--                            :inactive-value="false"-->
        <!--                            disabled-->
        <!--                            @change="-->
        <!--								changeIsScene($event, scope.row.id, scope.row)-->
        <!--							"-->
        <!--                        >-->
        <!--                        </el-switch>-->
        <!--                    </template>-->
        <!--                </el-table-column>-->
        <!--                <el-table-column prop="stroma" label="基质"/>-->
        <el-table-column prop="methodCode" label="方法编码" align="center"/>
        <!--                <el-table-column prop="childMethodName" label="子法名称"/>-->
      </el-table>
      <!-- 分页 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="selectProjectParams.pageNum"
        :limit.sync="selectProjectParams.pageSize"
        @pagination="getTablelist"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" center
        >确定
        </el-button
        >
        <el-button @click="close">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import '@/views/core/components_use'
  import 'ant-design-vue/dist/antd.css'
  import {
    getProjectMethodList,
    getCommonValidItemList,
    getTakeValidItemList
  } from '@/api/standardManagement/config'
  import jsonFormat from '../../views/KFormDesign/config/jsonFormat'

  export default {
    components: {},
    data() {
      return {
        // 检测项目选择表单数据
        selectProjectParams: {
          itemNameCn: null,
          methodCode: null,
          isScene: null,
          startPage: 1,
          pageSize: 10
        },
        dialogShow: false,
        cateShow: false,
        //表格数据
        tableData: [],
        //这里需要回头看
        loading: false,
        // 选中数组
        ids: [],
        // 非单个禁用
        // single: true,
        // 非多个禁用
        // multiple: true,
        showSelList: [], //已选项目数据
        //多选框选中的数据
        checkData: [],
        total: 0,
        shouldPush: true
      }
    },
    props: {
    },
    methods: {
      init(data) {
        this.dialogShow = true
        this.selectProjectParams = {
          itemNameCn: null,
          methodCode: null,
          isScene: null,
          startPage: 1,
          pageSize: 10
        }
        this.showSelList = JSON.parse(JSON.stringify(data))
        this.getTablelist()
      },
      // 项目回显
      Echo() {
        console.log(this.showSelList)
        console.log(this.tableData)
        this.showSelList.map((item1) => {
          this.tableData.map((item2) => {
            if (item1.id == item2.id) {
              this.$refs.multipleTable.toggleRowSelection(item2, true)
            }
          })
        })
      },
      e_select(selection, row) {
        let selected = selection.length && selection.indexOf(row) !== -1
        if (selected) {
          this.showSelList.push(row)
          if (row.parentId == 0) {
            // 选中父项目，连同子项目一同选中，并显示在上方
            row.voListZ.forEach((item) => {
              this.showSelList.push(item)
              this.$refs.multipleTable.toggleRowSelection(item, true)
            })
          } else {
            // 选中子项目，判断父项目是否已勾选
            let findIndex = this.showSelList.findIndex(function (item) {
              return item.id === row.parentId
            })
            // 没有勾选父项目，则添加父项目
            if (findIndex == -1) {
              this.tableData.forEach((item) => {
                if (item.id == row.parentId) {
                  this.showSelList.push(item)
                  this.$refs.multipleTable.toggleRowSelection(item, true)
                }
              })
            }
          }
        } else {
          //取消选中
          let index = this.showSelList.findIndex(function (item) {
            return item.id === row.id
          })
          if (index > -1) {
            this.showSelList.splice(index, 1)
          }
          if (row.parentId == 0) {
            // 取消选中父项目，连同子项目一起在上方删除并取消勾选
            row.voListZ.forEach((childItem) => {
              let findIndex = this.showSelList.findIndex(function (item) {
                return item.id === childItem.id
              })
              if (findIndex > -1) {
                this.showSelList.splice(findIndex, 1)
                this.$refs.multipleTable.toggleRowSelection(childItem, false)
              }
            })
          } else {
            // 判断该父项目下是否还有其他子项目选中
            let index = this.showSelList.findIndex(function (item) {
              return item.parentId === row.parentId
            })
            // 没有其他子项目选中则取消父项目选中状态
            if (index == -1) {
              // 查找父项目的下标
              let findIndex = this.showSelList.findIndex(function (item) {
                return item.id === row.parentId
              })
              if (findIndex > -1) {
                // 将上方数据删除
                this.showSelList.splice(findIndex, 1)
                // 取消列表勾选状态
                this.tableData.forEach((item) => {
                  if (item.id == row.parentId) {
                    this.$refs.multipleTable.toggleRowSelection(item, false)
                  }
                })
              }
            }
          }
        }
        // let val = this.showSelList.some(item => {
        //     return item.id == row.id
        // })
        // if (val) {
        //     var index = this.showSelList
        //         .map(item => {
        //             return item.id
        //         })
        //         .indexOf(row.id)
        //     this.showSelList.splice(index, 1)
        //     localStorage.setItem(
        //         'tagsList',
        //         JSON.stringify(this.showSelList)
        //     )
        //     this.filterSample()
        // }
      },
      flatten(array) {
        if (array == null) {
          array = []
        }
        return [].concat(...array.map(item => [].concat(item, ...this.flatten(item.voListZ))))
      },
      // 多选框选中数据1
      handleselectAll(selection) {
        let allData = this.flatten(this.tableData)
        //判断是全选还是取消全选
        let isAllChecked = true
        if ((allData.length - this.tableData.length) == selection.length) {
          isAllChecked = false
        }
        this.tableData.forEach(row => {
          let index = this.showSelList.findIndex(function (item) {
            return item.id === row.id
          })
          if (isAllChecked && index == -1) {
            //全选状态 && 已选表格不存在这个父项目
            this.showSelList.push(row)
            // 添加该父项目下的所有子项目
            row.voListZ.forEach((item) => {
              this.showSelList.push(item)
              this.$refs.multipleTable.toggleRowSelection(item, true)
            })
          } else if (isAllChecked && index > -1) {
            //全选状态 && 已选表格存在这个父项目
            //   查询该父项目下的子项目是否全部存在，不存在则添加
            row.voListZ.forEach((childItem) => {
              let findIndex = this.showSelList.findIndex(function (item) {
                return item.id === childItem.id
              })
              if (findIndex == -1) {
                this.showSelList.push(childItem)
                this.$refs.multipleTable.toggleRowSelection(childItem, true)
              }
            })
          } else if (!isAllChecked && index > -1) {
            //取消全选 && 已选表格存在这个父项目
            this.showSelList.splice(index, 1)
            row.voListZ.forEach((childItem) => {
              let findIndex = this.showSelList.findIndex(function (item) {
                return item.id === childItem.id
              })
              if (findIndex > -1) {
                this.showSelList.splice(findIndex, 1)
                this.$refs.multipleTable.toggleRowSelection(childItem, false)
              }
            })
          }
        })
        // // 获取缓存的已选数据
        // let arr = []
        // if (localStorage.getItem('tagsList')) {
        //     arr = JSON.parse(localStorage.getItem('tagsList'))
        // }
        // //多选框选中的数据
        // this.checkData = selection
        // this.showSelList = [...arr, ...this.checkData]
        // var obj = {}
        // var cc = this.showSelList.reduce(function(item, next) {
        //     obj[next.id] ? '' : (obj[next.id] = true && item.push(next))
        //     return item
        // }, [])
        // this.showSelList = cc
      },
      /*
       *@author: 焦政
       *@date: 2021-01-26 10:17:26
       *@description: 删除已选
       */
      async e_close(data, index) {
        this.showSelList.splice(index, 1)
        if (data.parentId == 0) {
          data.voListZ.forEach((childItem) => {
            let findIndex = this.showSelList.findIndex(function (item) {
              return item.id === childItem.id
            })
            if (findIndex > -1) {
              this.showSelList.splice(findIndex, 1)
              this.$refs.multipleTable.toggleRowSelection(childItem, false)
            }
          })
        } else {
          let index = this.showSelList.findIndex(function (item) {
            return item.parentId === data.parentId
          })
          if (index == -1) {
            let findIndex = this.showSelList.findIndex(function (item) {
              return item.id === data.parentId
            })
            if (findIndex > -1) {
              this.showSelList.splice(findIndex, 1)
              this.tableData.forEach((item) => {
                if (item.id == data.parentId) {
                  this.$refs.multipleTable.toggleRowSelection(item, false)
                }
              })
            }
          }
        }
        localStorage.setItem('tagsList', JSON.stringify(this.showSelList))
        this.filterSample()
      },
      /*
       *@author: 焦政
       *@date: 2021-01-26 09:14:08
       *@description: 比较去重
       */
      filterSample() {
        let allData = this.flatten(this.tableData)
        let arr = JSON.parse(JSON.stringify(this.showSelList))
        let needArr = []
        arr.forEach(item => {
          let findIndex = allData.findIndex(function (items) {
            return item.id === items.id
          })
          if (findIndex > -1) {
            needArr.push(allData[findIndex])
          }
        })
        this.$refs.multipleTable.clearSelection()
        needArr.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, true)
        })
      },
      //取消按钮操作1
      close() {
        this.$emit('close')
        localStorage.setItem('tagsList', [])
      },
      /*
       *@author: 焦政
       *@date: 2021-01-25 12:44:30
       *@description: 填充选择的数据到已选数据中
       */
      fillDataToSel() {
        let arr = JSON.parse(JSON.stringify(this.showSelList))
        arr.concat(this.checkData)
        var result = []
        for (var i = 0; i < arr.length; i++) {
          var obj = this.rateTableData[i]
          var mainid = obj.id
          var isExist = false
          for (var j = 0; j < this.showSelList.length; j++) {
            var aj = this.showSelList[j]
            var showid = aj.id
            if (mainid == showid) {
              isExist = true
              break
            }
          }
          if (!isExist) {
            result.push(obj)
          }
        }
        this.showSelList = result
      },
      //获取项目方法管理列表1
      getTablelist() {
        // getProjectMethodList(this.selectProjectParams).then(response => {
        // 	this.tableData = response.data.list;
        // 	this.total = response.data.total;
        // 	this.loading = false;
        // 	this.$nextTick(() => {
        // 		this.filterSample();
        // 	});
        // });
        // localStorage.setItem('tagsList', JSON.stringify(this.showSelList))
        // let projectType = this.$store.state.standardManagement.projectType
        let isAdd = this.microStore.state.standardManagement.isAdd
        let groupId = this.microStore.state.standardManagement.groupId || ''
        this.selectProjectParams.isAdd = isAdd
        !this.selectProjectParams.isAdd
          ? (this.selectProjectParams.groupId = groupId)
          : ''
        this.selectProjectParams.detectCategory = this.microStore.state.standardManagement.detectCategory
        // if (projectType == 'common') {
        console.log(this.selectProjectParams)
        getCommonValidItemList(this.selectProjectParams).then(
          response => {
            this.tableData = response.data.list
            this.total = response.data.total
            this.loading = false
            this.Echo()
            this.$nextTick(() => {
              this.filterSample()
            })
          }
        )
        // } else if (projectType == 'take') {
        //     getTakeValidItemList(this.selectProjectParams).then(
        //         response => {
        //             this.tableData = response.data.list
        //             this.total = response.data.total
        //             this.loading = false
        //             this.$nextTick(() => {
        //                 this.filterSample()
        //             })
        //         }
        //     )
        // }
      },
      /*
       *@author: 焦政
       *@date: 2021-01-25 12:52:26
       *@description: 分页 或者查询之后依然保持已选数据的展示
       */
      localSaveShowSel() {
      },
      //查询按钮操作1
      onSubmit() {
        this.selectProjectParams.startPage = 1
        this.getTablelist()
      },
      //确定按钮操作1
      submitForm() {
        // if(this.showSelList.some(item=>item.isScene)&&this.showSelList.some(item=>!item.isScene)){
        // 	this.$message.error("不能同时包含现场和非现场的项目！");
        // 	return false;
        // }

        const selectitemData = {
          // checkData: this.checkData,
          checkData: this.showSelList,
          ids: this.ids
        }
        console.log(selectitemData);
        this.$emit('handleItemName', selectitemData)
        this.showSelList = []
        this.close()
      }
    },
    computed: {},
    created() {
    },
    mounted() {
    }
  }
</script>
<style lang="less">
  .selectProject {
    ul,
    li {
      list-style: none;
      padding: 0;
    }
  }

  .searchParentName {
    display: flex;
  }

  .sel-area {
    width: 100%;
    //max-height: 200px;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }

  .sa-list {
    margin-right: 10px;
    margin-bottom: 10px;
  }
</style>
