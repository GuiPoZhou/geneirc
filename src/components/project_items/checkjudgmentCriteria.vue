<template>
  <div class="groupAdd">
    <ml-dialog ref="mlDialog" :dia-log-show="addShow" dia-log-title="指定判定标准" dia-log-width="60%"
               @close="close">
      <template slot="bologbody">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="80px" :prop="queryParams">
          <el-row>
            <el-col :span="12">
              <el-form-item label="检测类别" prop="detectCategoryName">
                <el-input v-model="queryParams.detectCategoryName" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-col :span="9" style="padding-right: 10px">
            <div class="head-top">适用执行标准</div>
            <el-table :data="categoryList" ref="categoryList" style="width: 100%" @selection-change="selRow" border
                      :row-key="getRowKey" :tree-props="{children: 'childList'}" empty-text="暂无数据"
                      @select-all="selectAll">
              <el-table-column type="selection" width="60" align="center"></el-table-column>
              <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
              <el-table-column prop="standardCode" label="执行标准号" show-overflow-tooltip
                               align="center"></el-table-column>
              <el-table-column prop="standardTypeName" label="执行标准分类" show-overflow-tooltip
                               align="center"></el-table-column>
              <el-table-column prop="standardName" label="执行标准名称" show-overflow-tooltip
                               align="center"></el-table-column>
              <el-table-column prop="standardCategoryName" label="产品分类" show-overflow-tooltip
                               align="center"></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="15">
            <div class="flex head-top">
              <div>待制定检测项目列表</div>
            </div>
            <el-table :data="tableList" ref="multipleTableDevice" style="width: 100%" border
                      @selection-change="projectChange" :row-class-name="tableRowClassName">
              <el-table-column type="selection" width="55" align="center"/>
              <el-table-column type="index" label="序号" width="60"/>
              <el-table-column prop="itemNameCn" label="项目名称" show-overflow-tooltip align="center"/>
              <el-table-column prop="methodCode" label="方法编号" show-overflow-tooltip align="center"/>
              <el-table-column prop="methodName" label="方法名称" show-overflow-tooltip align="center"/>
              <el-table-column prop="standardTypeName" label="执行标准" align="center">
                <template slot-scope="scope">
                  <div v-for="item in scope.row.childList" class="classFor">
                    <el-tooltip class="item" effect="dark" :content="echoData(item.standardType,standardTypeList)"
                                placement="top-start">
                      <div>{{echoData(item.standardType,standardTypeList)}}</div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="standardCategoryName" label="产品分类" align="center">
                <template slot-scope="scope">
                  <div v-for="item in scope.row.childList" class="classFor">
                    <el-tooltip class="item" effect="dark" :content="item.standardCategoryName"
                                placement="top-start">
                      <div>{{item.standardCategoryName}}</div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="standardCode" label="执行标准号" align="center">
                <template slot-scope="scope">
                  <div v-for="item in scope.row.childList" class="classFor">
                    <el-tooltip class="item" effect="dark" :content="item.standardCode" placement="top-start">
                      <div>{{item.standardCode}}</div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="standardName" label="执行标准名称" align="center">
                <template slot-scope="scope">
                  <div v-for="item in scope.row.childList" class="classFor">
                    <el-tooltip class="item" effect="dark" :content="item.standardName" placement="top-start">
                      <div>{{item.standardName}}</div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="limitDesc" label="判定标准要求" align="center">
                <template slot-scope="scope">
                  <div v-for="item in scope.row.childList" class="classFor">
                    <el-tooltip class="item" effect="dark" :content="item.limitDesc" placement="top-start">
                      <div>{{item.limitDesc}}</div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </template>
      <template slot="bologfooter">
        <el-button type="cyan" @click="e_confrim" size="small">指定判定标准</el-button>
        <el-button type="primary" @click="clearResult" size="small">撤销判定标准</el-button>
        <el-button @click="close" size="small">关闭</el-button>
      </template>
    </ml-dialog>
  </div>
</template>
<script>
  export default {
    components: {},
    data() {
      return {
        addShow: false,
        queryParams: {
          detectCategoryName: '',
          detectCategory: '',
        },
        categoryList: [],
        standardTypeList:this.getDictionary('STANDARD_TYPE'),
        tableList: [],
        biaozhunList: [],
        projectList: [],
        ids: [],
        newprojectList: [],
        standardTypeList: this.getDictionary('STANDARD_TYPE'),

      }
    },
    methods: {
      init(data, params) {
        this.addShow = true
        this.tableList = data
        this.queryParams.detectCategoryName = params.name
        this.queryParams.detectCategory = params.id
        this.getCategory()
      },
      getRowKey(row) {
        return row.id
      },
      // 获取执行标准
      async getCategory() {
        var categoryData = await this.$net('/decideStandard/v1/standardProduction/queryStandardProduction', 'get', {detectcategory: this.queryParams.detectCategory})
        this.categoryList = categoryData.data
        // this.getChildData(this.categoryList)
        // console.log(this.categoryList)
      },
      // 获取child数据
      getChildData(arr) {
        arr.map((item) => {
          this.allDataList.push(item)
          if (item.childList.length != 0) {
            this.getChildData(item.childList)
          }
        })
      },
      // 选择执行标准
      selRow(select) {
        this.biaozhunList = select
        var type = select.map(item => {
          return item.standardType
        })
        console.log(select)
        var str = type.join(",") + ",";
        for (let i = 0; i < type.length; i++) {
          if (str.replace(type[i] + ",", "").indexOf(type[i] + ",") > -1) {
            this.$message.error('不能选择重复的标准分类')
            break
          }
        }
        this.ids = select.map((item) => item.id)
      },
      // 选择检测项目
      projectChange(val) {
        this.projectList = val
        this.newprojectList = val
        console.log('检测项目', this.projectList)
      },
      selectAll(select) {
        // this.$refs.categoryList.clearSelection()
        // this.$nextTick(() => {
        //     if (this.selectList.length != 0) {
        //         this.allDataList.map((item) => {
        //             if (item.id == this.selectList[0].id) {
        //                 this.$refs.categoryList.toggleRowSelection(item, true)
        //             }
        //         })
        //     }
        // })
      },
      async e_confrim() {
        if (this.biaozhunList.length == 0) {
          this.$message.error('请选择适用执行标准')
          return
        }
        if (this.projectList.length == 0) {
          this.$message.error('请选择指定执行标准的检测项目')
          return
        }
        var type = this.biaozhunList.map(item => {
          return item.standardType
        })
        var num = 0
        var str = type.join(",") + ",";
        for (let i = 0; i < type.length; i++) {
          if (str.replace(type[i] + ",", "").indexOf(type[i] + ",") > -1) {
            num++
            break
          }
        }
        if (num !== 0) {
          this.$message.error('不能选择重复的标准分类')
          return
        }
        var proList = await this.$net(`/decideStandard/v1/standard/${this.ids.join(',')}/getItemLimits`, 'get')
        localStorage.setItem('ItemLimits', JSON.stringify(proList.data))
        var list = proList.data
        var arr = new Array;
        var newarr = new Array;
        for (var i in list) {
          var index = arr.indexOf(list[i].decideStandardId + '_' + list[i].itemName);
          if (index < 0) {
            arr.push(list[i].decideStandardId + '_' + list[i].itemName);
            newarr.push(list[i]);
          } else {
            if (newarr[index].limitDesc && list[i].limitDesc) {
              newarr[index].limitDesc = newarr[index].limitDesc + ',' + list[i].limitDesc
            } else if (!newarr[index].limitDesc && list[i].limitDesc) {
              newarr[index].limitDesc = list[i].limitDesc
            }
          }
        }
        newarr.map(items => {
          this.biaozhunList.map(itembiaozhun => {
            if (items.decideStandardId == itembiaozhun.decidestandardId) {
              items.standardTypeName = itembiaozhun.standardTypeName
              items.standardCode = itembiaozhun.standardCode
              items.standardName = itembiaozhun.standardName
              items.standardCategoryName = itembiaozhun.standardCategoryName
            }
          })
        })
        for (var i in this.projectList) {
          console.log(i);
          var newList = new Array;
          for (var x in newarr) {
            if (newarr[x].itemName == this.projectList[i].itemNameCn) {
              newList.push(newarr[x]);
            }
          }
          if (newarr) {
            this.$set(this.projectList[i], 'childList', newList)
          }

          var newList1 = new Array;
          var objs = JSON.parse(localStorage.getItem('ItemLimits'))
          for (var y in objs) {
            if (objs[y].itemName == this.projectList[i].itemNameCn) {
              newList1.push(objs[y]);
            }
          }
          if (objs) {
            this.$set(this.projectList[i], 'itemLimitList', newList1)
          }

        }
        var num = this.fn2(proList.data)
        let newData = this.projectList.filter(
          (a) => !num.some((b) => a.itemNameCn === b.itemName)
        )
        var arrs = []
        this.projectList.map(items => {
          num.map(item => {
            if (items.itemNameCn == item.itemName) {
              arrs.push(item)
            }
          })
        })
        console.log(arrs)
        var message = '<p>共指定检测项目' + this.projectList.length + '个，' +
          '其中' + arrs.length + '个成功，' +
          (this.projectList.length - arrs.length) + '个未成功。</p>'
        for (var i in newData) {
          message += '<p>' + newData[i].itemNameCn + '检测项目不存在判定限值</p>'
        }

        this.$alert(message, '指定说明', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          callback: action => {
          }
        });
        this.clearSelect()
      },
      // 添加上指定执行标准 改变行样式
      tableRowClassName({row, rowIndex}) {
        if (row.childList.length > 0) {
          return 'success-row'
        }
      },
      fn2(arr) {
        const res = new Map();
        return arr.filter(arr => !res.has(arr.itemName) && res.set(arr.itemName, arr.itemName));
      },
      // 撤销执行标准
      clearResult() {
        if (this.projectList.length == 0) {
          this.$message.error('请选择待指定检测项目列表')
          return
        }
        for (var i = 0; i < this.projectList.length; i++) {
          this.projectList[i].childList = []
          this.projectList[i].itemLimitList = []
        }
        this.clearSelect()
      },
      // 清空选择的值
      clearSelect() {
        this.$refs.multipleTableDevice.clearSelection()
      },
      async close() {
        localStorage.removeItem('ItemLimits')
        this.$emit('close', this.tableList)
        this.projectList = []
        this.tableList = []
        this.biaozhunList = []
      }
    },
  }
</script>
<style lang="less" scoped>
  .head-top {
    background: #f0f0f0;
    padding: 8px 10px;
    justify-content: space-between;
    align-items: center;
  }

  /deep/ .success-row {
    background: #e0ffd1 !important;
  }

  .classFor {
    border-bottom: 1px solid #dfe6ec;
    width: 140%;
    margin-left: -12px;
    line-height: 30px;
  }

  .classFor:last-child {
    border-bottom: none
  }

  .classFor div {
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
