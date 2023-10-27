<template>
  <div>
    <BoDialog :diaLogShow="diaLogShow" diaLogTitle="新增检测项目" diaLogWidth="80%"
              @close="e_close">
      <template slot="bologbody">
        <el-row style="margin-bottom: 10px">
          <el-col>
            <p>已选择项目</p>
          </el-col>
          <el-col>
            <el-button type="primary" :disabled="isdisabled" size="small"
                       @click="createGroup">创建分组
            </el-button>
            <el-button type="primary" :disabled="isdisabled" size="small"
                       @click="specifyJudgmentCriteria">指定判定标准
            </el-button>
          </el-col>
        </el-row>

        <el-table
          :data="selectedItemList"
          ref="selectedItemArr"
          border
          style="width: 100%;"
          :row-style="{ height: '20px' }"
          :cell-style="{ padding: '2px' }"
          height="300"
          :span-method="selectedMergeMethod"
        >
          <el-table-column type="index" label="序号" align="center" width="62px"/>
          <el-table-column prop="itemId" label="项目名称" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              {{scope.row.itemNameCn}}
            </template>
          </el-table-column>
          <el-table-column prop="itemId" label="方法编号" align="center">
            <template slot-scope="scope">
              {{scope.row.methodCode}}
            </template>
          </el-table-column>
          <el-table-column prop="itemId" label="方法名称" align="center">
            <template slot-scope="scope">
              {{scope.row.methodName}}
            </template>
          </el-table-column>
          <el-table-column prop="standardTypeName" label="执行标准" align="center">
            <template slot-scope="scope">
              {{scope.row.itemLimitList.length ==
              0?'':echoData(scope.row.itemLimitList[0].standardType,standardTypeList)}}
            </template>
          </el-table-column>
          <el-table-column prop="standardCategoryName" label="产品分类" align="center">
            <template slot-scope="scope">
              {{scope.row.itemLimitList.length == 0?'':scope.row.itemLimitList[0].standardCategoryName}}
            </template>
          </el-table-column>
          <el-table-column prop="standardCode" label="执行标准号" align="center">
            <template slot-scope="scope">
              {{scope.row.itemLimitList.length == 0?'':scope.row.itemLimitList[0].standardCode}}
            </template>
          </el-table-column>
          <el-table-column prop="standardName" label="执行标准名称" align="center">
            <template slot-scope="scope">
              {{scope.row.itemLimitList.length == 0?'':scope.row.itemLimitList[0].standardName}}
            </template>
          </el-table-column>
          <el-table-column prop="limitDesc" label="判定标准要求" align="center">
            <template slot-scope="scope">
              {{scope.row.limitDesc}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="text" style="color: #ff5d5d"
                         @click="e_delete(scope.row,scope.$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-tabs
          type="border-card"
          tab-position="left"
          @tab-click="handleClick"
          v-model="selectItemType"
          style="margin-top: 15px"
        >
          <el-tab-pane label="按项目" name="item">

            <el-form :inline="true"
                     :model="itemNameParam"
                     @submit.native.prevent
                     ref="itemNameParam">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="项目名称：" prop="itemName">
                    <el-input v-model="itemNameParam.itemName" style="width: 100%;" clearable
                              @clear="ItemNameSearchbtn"
                              @keyup.native.enter="ItemNameSearchbtn"/>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="方法编号" prop="methodCode">
                    <el-input v-model="itemNameParam.methodCode"
                              @clear="ItemNameSearchbtn"
                              @keyup.native.enter="ItemNameSearchbtn"/>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" size="small" center @click="ItemNameSearchbtn">搜索
                  </el-button>
                  <el-button size="small" center @click="ItemNameResetbtn">重置
                  </el-button>
                </el-col>
              </el-row>
            </el-form>
            <el-col :span="6">
              <el-table
                :data="itemNameList"
                ref="itemNameTable"
                border
                style="width: 100%"
                :row-style="{ height: '20px' }"
                :cell-style="{ padding: '2px' }"
                @row-click="itemNameClick"
                max-height="250"
                v-loading="loading"
              >
                <el-table-column type="index" align="center" width="65"
                                 label="序号"/>
                <el-table-column prop="itemNameCn" align="center"
                                 label="项目名称"/>
                <el-table-column prop="methodCode" align="center"
                                 label="方法编号"/>
              </el-table>
              <pagination
                v-show="itemNameTotal > 0"
                :total="itemNameTotal"
                :pageSizes="pageSizes"
                :page.sync="itemNameParam.pageNum"
                :limit.sync="itemNameParam.pageSize"
                @pagination="ItemNameSearchbtn"
              />
            </el-col>
            <el-col :span="18">
              <!--检测项目list   start-->
              <el-table
                :data="projectList"
                ref="projectArr"
                border
                style="width: 100%;margin-left:10px"
                @select-all="projectSelectAllCheck"
                @select="handleSelectionChange"
                max-height="250"
                :span-method="projectMergeMethod"
                v-loading="loading"
              >
                <el-table-column type="selection" width="45"></el-table-column>
                <el-table-column type="index" align="center" label="序号" width="62px"/>
                <el-table-column prop="" label="方法名称" align="center">
                  <template slot-scope="scope">
                    {{scope.row.methodName}}
                  </template>
                </el-table-column>
                <el-table-column prop="" label="执行标准" align="center">
                  <template slot-scope="scope">
                    {{scope.row.itemLimitList.length ==
                    0?'':echoData(scope.row.itemLimitList[0].standardType,standardTypeList)}}
                  </template>
                </el-table-column>
                <el-table-column prop="limitDesc" label="判定标准要求" align="center">
                  <template slot-scope="scope">
                    {{scope.row.limitDesc}}
                  </template>
                </el-table-column>
                <el-table-column prop="standardCategoryName" label="产品分类" align="center">
                  <template slot-scope="scope">
                    {{scope.row.itemLimitList.length == 0?'':scope.row.itemLimitList[0].standardCategoryName}}
                  </template>
                </el-table-column>
                <el-table-column prop="standardCode" label="执行标准号" align="center">
                  <template slot-scope="scope">
                    {{scope.row.itemLimitList.length == 0?'':scope.row.itemLimitList[0].standardCode}}
                  </template>
                </el-table-column>
                <el-table-column prop="standardName" label="执行标准名称" align="center">
                  <template slot-scope="scope">
                    {{scope.row.itemLimitList.length == 0?'':scope.row.itemLimitList[0].standardName}}
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <!--检测项目list   end-->
          </el-tab-pane>
          <el-tab-pane label="按分组" name="group">
            <el-row>
              <el-col :span="6">
                <el-form :inline="true"
                         :model="groupParam"
                         @submit.native.prevent
                         ref="groupParam">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="分组名称：" prop="groupName">
                        <el-input v-model="groupParam.groupName" style="width: 100%;" clearable
                                  @clear="GroupSearchbtn"
                                  @keyup.native.enter="GroupSearchbtn"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <!--分组表格 start-->
                <el-table
                  :data="groupList"
                  ref="groupTable"
                  border
                  v-loading="loading"
                  style="width: 100%"
                  :row-style="{ height: '20px' }"
                  :cell-style="{ padding: '2px' }"
                  @row-click="groupTableClick"
                  max-height="250"
                >
                  <el-table-column type="index" align="center" width="65"
                                   label="序号"/>
                  <el-table-column prop="groupName" align="center"
                                   label="分组名称"/>
                </el-table>
                <pagination
                  v-show="groupListTotal > 0"
                  :total="groupListTotal"
                  :pageSizes="pageSizes"
                  :page.sync="groupParam.pageNum"
                  :limit.sync="groupParam.pageSize"
                  @pagination="getGroupData"
                />
                <!--分组表格 end-->
              </el-col>
              <el-col :span="18">
                <!--检测项目list   start-->
                <el-table
                  :data="itemList"
                  v-loading="loading"
                  ref="itemArr"
                  border
                  style="width: 100%;margin-left:10px"
                  @select-all="groupSelectAllCheck"
                  @select="(selection, row)=>{handleSelectionChange(selection, row,'item')}"
                  max-height="308"
                  :span-method="itemMergeMethod"
                >
                  <el-table-column type="selection" width="45"></el-table-column>
                  <el-table-column align="center" type="index" label="序号" width="62px"/>
                  <el-table-column prop="itemNameCn" label="项目名称" :show-overflow-tooltip="true" align="center">
                    <template slot-scope="scope">
                      {{scope.row.itemNameCn}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="methodCode" label="方法编号" align="center">
                    <template slot-scope="scope">
                      {{scope.row.methodCode}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="methodName" label="方法名称" align="center">
                    <template slot-scope="scope">
                      {{scope.row.methodName}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="standardTypeName" label="执行标准" align="center">
                    <template slot-scope="scope">
                      {{scope.row.itemLimitList.length ==
                      0?'':echoData(scope.row.itemLimitList[0].standardType,standardTypeList)}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="limitDesc" label="判定标准要求" align="center">
                    <template slot-scope="scope">
                      {{scope.row.limitDesc}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="standardCategoryName" label="产品分类" align="center">
                    <template slot-scope="scope">
                      {{scope.row.itemLimitList.length == 0?'':scope.row.itemLimitList[0].standardCategoryName}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="standardCode" label="执行标准号" align="center">
                    <template slot-scope="scope">
                      {{scope.row.itemLimitList.length == 0?'':scope.row.itemLimitList[0].standardCode}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="standardName" label="执行标准名称" align="center">
                    <template slot-scope="scope">
                      {{scope.row.itemLimitList.length == 0?'':scope.row.itemLimitList[0].standardName}}
                    </template>
                  </el-table-column>

                </el-table>
                <!--检测项目list   end-->
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </template>
      <template slot="bologfooter">
        <el-button type="primary" size="small" @click="e_preservation">保存</el-button>
        <el-button size="small" @click="e_close">取消</el-button>
      </template>
    </BoDialog>
    <CheckJudgmentCriteria v-if="showCriteria" ref="CheckJudgmentCriteria"
                           @close="closeCriteria"></CheckJudgmentCriteria>
    <GroupAdd v-if="showGroupAdd" ref="GroupAdd" @reload="closeGroupAdd" @close="showGroupAdd = false"></GroupAdd>
  </div>
</template>
<script>
  import BoContainerMixin from '@/mixins/boContainer'
  import CheckJudgmentCriteria from "./checkjudgmentCriteria";
  import chopper from "@/mixins/chopper";
  import GroupAdd from "./groupAdd";

  export default {
    mixins: [BoContainerMixin, chopper],
    components: {CheckJudgmentCriteria, GroupAdd},
    data() {
      return {
        isFullScreen: true,
        diaLogShow: false,
        loading: false,
        showCriteria: false,
        showGroupAdd: false,
        selectItemType: 'item',
        merge: ['itemId', 'mergeStandardTypeId'],
        standardTypeList: this.getDictionary('STANDARD_TYPE'),
        pageSizes: [100, 200, 500],
        // 按项目请求参数
        itemNameParam: {
          itemName: null,
          pageSize: 100,
          pageNum: 1,
          isAdd: false,
          methodCode: null,
          id: null
        },

        // 按分组请求参数
        groupParam: {
          groupName: null,
          pageSize: 100,
          pageNum: 1
        },
        projectParams: {
          itemNameCn: null,
          pageSize: 100,
          pageNum: 1
        },
        selectedItemList: [],//已选择数据列表
        itemNameList: [],//按项目 项目名称列表
        projectList: [],
        itemList: [],
        groupList: [],
        isdisabled: false,
        itemNameTotal: 0,
        projectTotal: 0,
        groupListTotal: 0,
        detectCategoryInfo: {}
      }
    },
    mounted() {
    },
    methods: {
      async init(id, arr, detectCategoryInfo) {
        this.detectCategoryInfo = detectCategoryInfo

        if (arr.length != 0) {
          arr.map(itemInfo=>{
            if(itemInfo.itemLimitList == null){
              itemInfo.itemLimitList = []
            }
          })
          this.selectedItemList = arr
          this.getSelectedMergeArr(this.selectedItemList, this.merge)
        }
        this.diaLogShow = true
        this.detectCategory = id
        this.getItemNameList()
        this.getGroupData()
      },
      async getItemNameList() {
        let params = Object.assign({...this.itemNameParam, detectCategory: this.detectCategory})
        let getData = await this.$net('/standard/v1/itemMethods/getItemList', 'get', params)
        if (getData.code == 200) {
          this.itemNameList = getData.data.list
          this.itemNameTotal = getData.data.total
          this.projectList = []
        }
      },
      // 获取项目列表
      async getProjectData(type, data) {
        this.loading = true
        let params = Object.assign({...this.projectParams, detectCategory: this.detectCategory})
        if (type == 'itemMenthodId') {
          params.id = data
        }
        try {
          let getData = await this.$net('/standard/v1/itemMethods/getItemLimitList', 'get', params)
          if (getData.code == 200) {
            this.projectList = getData.data
            this.projectList.map((item) => {
              item.itemId = item.id
              if (item.itemLimitList == null || item.itemLimitList == undefined) {
                item.itemLimitList = []
              } else {
                item.limitDesc = item.itemLimitList.map((item) => {
                  item.standardCategoryName = item.productionName
                  return item.limitDesc
                }).join(',')
              }
              item.mergeId = item.id + '-' + (item.itemLimitList.length == 0 ? 'null' : item.itemLimitList[0].standardType) + '-' + (item.itemLimitList.length == 0 ? 'null' : item.itemLimitList[0].standardProductionId)
              item.mergeStandardTypeId = item.id + '-' + (item.itemLimitList.length == 0 ? 'null' : item.itemLimitList[0].standardType)
            })
            this.$nextTick(() => {
              this.projectList.map((item1) => {
                this.selectedItemList.map((item2) => {
                  if (item1.mergeId == item2.mergeId) {
                    this.$refs.projectArr.toggleRowSelection(item1, true)
                  }
                })
              })
            })
            this.loading = false
          }
        } catch (e) {
          this.loading = false
        }
        this.getProjectMergeArr(this.projectList, this.merge)
      },
      // 获取分组列表
      async getGroupData() {
        this.loading = true
        let params = Object.assign(this.groupParam, {detectCategory: this.detectCategory})
        try {
          let getData = await this.$net('standard/v1/itMeGroups', 'get', params)
          if (getData.code == 200) {
            this.groupList = getData.data.list
            this.groupListTotal = getData.data.total
            this.loading = false
          }
        } catch (e) {
          this.loading = false
        }
      },
      //按分组查询检测项目
      async groupTableClick(row) {
        this.loading = true
        try {
          let getData = await this.$net(`/standard/v1/itMeGroups/getDetailByIdNew/${row.id}`, 'get')
          if (getData.code == 200) {
            this.itemList = getData.data.detailList
            this.itemList.map((item) => {
              item.itemId = item.id
              if (item.itemLimitList == null) {
                item.itemLimitList = []
              } else {
                item.limitDesc = item.itemLimitList.map((item) => {
                  item.standardCategoryName = item.productionName
                  return item.limitDesc
                }).join(',')
              }
              item.mergeId = item.id + '-' + (item.itemLimitList.length == 0 ? 'null' : item.itemLimitList[0].standardType) + '-' + (item.itemLimitList.length == 0 ? 'null' : item.itemLimitList[0].standardProductionId)
              item.mergeStandardTypeId = item.id + '-' + (item.itemLimitList.length == 0 ? 'null' : item.itemLimitList[0].standardType)
            })
            this.$nextTick(() => {
              this.itemList.map((item1) => {
                this.selectedItemList.map((item2) => {
                  if (item1.mergeId == item2.mergeId) {
                    this.$refs.itemArr.toggleRowSelection(item1, true)
                  }
                })
              })
            })
            this.loading = false
          }
        } catch (e) {
          this.loading = false
        }
        this.getItemMergeArr(this.itemList, this.merge)
      },
      itemNameClick(e) {
        this.getProjectData('itemMenthodId', e.id)
      },
      // 创建分组
      createGroup() {
        if (this.selectedItemList.length == 0) {
          this.$message.info('请添加检测项目')
          return
        }
        // 传给后端的数据
        let repeatArr = this.repeat(JSON.parse(JSON.stringify(this.selectedItemList)))
        repeatArr.map((item) => {
          let arr = []
          this.selectedItemList.map((item2) => {
            if (item.itemId == item2.itemId) {
              arr = arr.concat(item2.itemLimitList)
            }
          })
          item.itemLimitList = arr
        })
        let params = {
          detectCategory: this.detectCategoryInfo.id,
          detectCategoryName: this.detectCategoryInfo.name,
          detailList: repeatArr
        }
        this.showGroupAdd = true
        this.$nextTick(() => {
          this.$refs.GroupAdd.init(params)
        })
      },
      // 创建分组回调
      closeGroupAdd() {
        this.showGroupAdd = false
        this.itemList = []
        this.getGroupData()
      },
      // 指定判定标准
      specifyJudgmentCriteria() {
        if (this.selectedItemList.length == 0) {
          this.$message.error('请先选择检测项目')
          return
        }
        // 传给后端的数据
        let repeatArr = this.repeat(JSON.parse(JSON.stringify(this.selectedItemList)))
        repeatArr.map((item) => {
          let arr = []
          this.selectedItemList.map((item2) => {
            if (item.itemId == item2.itemId) {
              arr = arr.concat(item2.itemLimitList)
            }
          })
          item.itemLimitList = arr
        })
        var dataList = repeatArr
        for (var i in dataList) {
          var itemLimitlist = JSON.parse(JSON.stringify(dataList[i].itemLimitList));
          var arr = new Array;
          var newarr = new Array;
          for (var x in itemLimitlist) {
            var index = arr.indexOf(itemLimitlist[x].decideStandardId);
            if (index < 0) {
              arr.push(itemLimitlist[x].decideStandardId);
              newarr.push(itemLimitlist[x])
            } else {
              if (newarr[index].limitDesc && itemLimitlist[x].limitDesc) {
                newarr[index].limitDesc = newarr[index].limitDesc + ',' + itemLimitlist[x].limitDesc
              } else if (!newarr[index].limitDesc && itemLimitlist[x].limitDesc) {
                newarr[index].limitDesc = itemLimitlist[x].limitDesc
              }
            }
          }
          dataList[i].childList = newarr;
        }
        dataList.map(item => {
          item.childList.map((items => {
            items.standardCategoryName = items.productionName
          }))
        })
        this.showCriteria = true
        this.$nextTick(() => {
          this.$refs.CheckJudgmentCriteria.init(dataList, this.detectCategoryInfo)
        })
      },
      // 添加判定标准回调
      closeCriteria(data) {
        // 存储处理后的数据
        let arr = new Array
        data.map((item) => {
          // 去重得到不同产品分类id
          let repeatArr = this.repeatArr(JSON.parse(JSON.stringify(item.itemLimitList)))
          repeatArr = repeatArr.map((item) => item.standardType)
          // 遍历不同产品分类 将不同产品分类分为多条数据
          if (repeatArr.length > 0) {
            repeatArr.map((itemA) => {
              let itemLimitList = []
              item.itemLimitList.map((itemB) => {
                if (itemA == itemB.standardType) {
                  itemLimitList.push(itemB)
                }
              })
              let obj = {
                ...item,
                itemLimitList: itemLimitList
              }
              arr.push(obj)
            })
          } else {
            arr.push(item)
          }
        })
        arr.map((item) => {
          if (item.itemLimitList == null) {
            item.itemLimitList = []
          } else {
            item.limitDesc = item.itemLimitList.map((item) => {
              item.standardCategoryName = item.productionName
              return item.limitDesc
            }).join(',')
          }
          item.mergeId = item.id + '-' + (item.itemLimitList.length == 0 ? 'null' : item.itemLimitList[0].standardType) + '-' + (item.itemLimitList.length == 0 ? 'null' : item.itemLimitList[0].standardProductionId)
          item.mergeStandardTypeId = item.id + '-' + (item.itemLimitList.length == 0 ? 'null' : item.itemLimitList[0].standardType)
        })
        this.projectList = []
        this.itemList = []
        this.showCriteria = false
        this.selectedItemList = arr
        this.getSelectedMergeArr(this.selectedItemList, this.merge)
      },

      repeatArr(data) {
        for (let i = 0; i < data.length - 1; i++) {
          for (let j = 1; j < data.length; j++) {
            if (i != j) {
              if (data[i].standardType == data[j].standardType) {
                data.splice(j, 1)
                j--
              }
            }
          }
        }
        return data
      },
      // 分组搜索
      ItemNameSearchbtn() {
        this.getItemNameList()
      },
      // 分组搜索
      ItemNameResetbtn() {
        this.$refs.itemNameParam.resetFields()
        this.projectList = []
        this.getItemNameList()
      },
      // 分组搜索
      GroupSearchbtn() {
        this.getGroupData()
      },
      // 项目搜索
      ProjectSearchbtn() {
        this.getProjectData()
      },
      // 项目重置按钮
      ProjectResetbtn() {
        this.$refs.projectParams.resetFields()
        this.getProjectData()
      },
      // tab切换
      handleClick(tab) {
        if (tab.name == 'item') {
          this.$refs.projectParams.resetFields()
          this.$refs.itemNameParam.resetFields()
          this.projectList = []
          this.getItemNameList()
        } else {
          this.groupParam.groupName = ''
          this.getGroupData()
          this.itemList = []
        }
        this.selectItemType = tab.name
      },
      // 手动选择
      handleSelectionChange(selection, row) {
        let selected = selection.length && selection.indexOf(row) !== -1
        if (selected) {
          row = JSON.parse(JSON.stringify(row))
          let arr = []
          this.selectedItemList.map((item) => {
            if (item.mergeStandardTypeId == row.mergeStandardTypeId) {
              arr.push(item)
            }
          })
          if (arr.length > 0) {
            this.projectList.map((item1) => {
              if (item1.mergeId == row.mergeId) {
                this.$refs.projectArr.toggleRowSelection(item1, false)
              }
            })
            this.itemList.map((item1) => {
              if (item1.mergeId == row.mergeId) {
                this.$refs.itemArr.toggleRowSelection(item1, false)
              }
            })
            this.$message.warning('不能选择相同检测项目相同执行标准下的产品分类')
          } else {
            let dataIndex = null
            this.selectedItemList.map((item1, index) => {
              if (item1.itemId == row.itemId) {
                dataIndex = index
              }
            })
            if (dataIndex != null) {
              this.selectedItemList.splice(dataIndex, 0, row)
            } else {
              this.selectedItemList.push(row)
            }
          }
        } else {
          //取消选中
          var index = this.selectedItemList.findIndex(function (item) {
            return item.mergeId === row.mergeId
          })
          this.selectedItemList.splice(index, 1)
        }
        this.getSelectedMergeArr(this.selectedItemList, this.merge)
      },
      // 分组列表是否全选
      groupSelectAllCheck(selection) {
        //判断是全选还是取消全选
        let isAllChecked = false
        if (selection.length > 0) {
          isAllChecked = true

          // 通过(合并检测项目id和执行标准id的mergeStandardTypeId字段) 对比已选择检测项目和全选数据  来判断
          let identicalArr = []
          this.selectedItemList.map((itemA) => {
            selection.map((itemB) => {
              if (itemA.mergeStandardTypeId == itemB.mergeStandardTypeId) {
                identicalArr.push(itemB)
              }
            })
          })

          if (identicalArr.length > 0) {
            // 恢复复选框
            let copyArr = JSON.parse(JSON.stringify(this.selectedItemList))
            this.$refs.itemArr.clearSelection()
            copyArr.map((itemA) => {
              this.itemList.map((itemB) => {
                if (itemA.mergeId == itemB.mergeId) {
                  this.$refs.itemArr.toggleRowSelection(itemB, true)
                }
              })
            })
            this.$message.warning('不能选择相同检测项目相同执行标准下的产品分类')
            return
          }
        }
        let arr = JSON.parse(JSON.stringify(this.itemList))
        arr.forEach(row => {
          let index = this.selectedItemList.findIndex(function (item) {
            return item.mergeId === row.mergeId
          })
          if (isAllChecked && index == -1) {
            //全选状态 && 已选表格不存在这个检测项目
            let dataIndex = null
            this.selectedItemList.map((item1, index) => {
              if (item1.itemId == row.itemId) {
                dataIndex = index
              }
            })
            if (dataIndex != null) {
              this.selectedItemList.splice(dataIndex, 0, row)
            } else {
              this.selectedItemList.push(row)
            }
          } else if (!isAllChecked && index > -1) {
            //取消全选 && 已选表格存在这个检测项目
            this.selectedItemList.splice(index, 1)
          }
        })
        this.getSelectedMergeArr(this.selectedItemList, this.merge)
      },

      // 项目列表是否全选
      projectSelectAllCheck(selection) {
        //判断是全选还是取消全选
        let isAllChecked = false
        if (selection.length > 0) {
          isAllChecked = true

          // 通过去重 (合并检测项目id和执行标准id的字段) 来判断
          let repeatArr = this.repeatMergeStandardTypeIdArr(JSON.parse(JSON.stringify(selection)))

          // 通过(合并检测项目id和执行标准id的字段) 对比已选择检测项目和全选数据  来判断
          let identicalArr = []
          this.selectedItemList.map((itemA) => {
            selection.map((itemB) => {
              if (itemA.mergeStandardTypeId == itemB.mergeStandardTypeId) {
                identicalArr.push(itemB)
              }
            })
          })

          if (repeatArr.length < selection.length || identicalArr.length > 0) {
            // 恢复复选框
            let copyArr = JSON.parse(JSON.stringify(this.selectedItemList))
            this.$refs.projectArr.clearSelection()
            copyArr.map((itemA) => {
              this.projectList.map((itemB) => {
                if (itemA.mergeId == itemB.mergeId) {
                  this.$refs.projectArr.toggleRowSelection(itemB, true)
                }
              })
            })
            this.$message.warning('不能选择相同检测项目相同执行标准下的产品分类')
            return
          }
        }
        let arr = JSON.parse(JSON.stringify(this.projectList))
        arr.forEach(row => {
          let index = this.selectedItemList.findIndex(function (item) {
            return item.mergeId === row.mergeId
          })
          if (isAllChecked && index == -1) {
            //全选状态 && 已选表格不存在这个检测项目
            let dataIndex = null
            this.selectedItemList.map((item1, index) => {
              if (item1.itemId == row.itemId) {
                dataIndex = index
              }
            })
            if (dataIndex != null) {
              this.selectedItemList.splice(dataIndex, 0, row)
            } else {
              this.selectedItemList.push(row)
            }
          } else if (!isAllChecked && index > -1) {
            //取消全选 && 已选表格存在这个检测项目
            this.selectedItemList.splice(index, 1)
          }
        })
        this.getSelectedMergeArr(this.selectedItemList, this.merge)
      },
      // 去重 (合并检测项目id和执行标准id的字段)
      repeatMergeStandardTypeIdArr(data) {
        for (let i = 0; i < data.length - 1; i++) {
          for (let j = 1; j < data.length; j++) {
            if (i != j) {
              if (data[i].mergeStandardTypeId == data[j].mergeStandardTypeId) {
                data.splice(j, 1)
                j--
              }
            }
          }
        }
        return data
      },
      // 保存 按钮
      e_preservation() {
        if (this.selectedItemList.length == 0) {
          this.$message.warning('请选择检测项目')
          return
        }
        this.diaLogShow = false
        this.$emit('reload', this.selectedItemList)
      },
      // 数据去重
      repeat(data) {
        for (let i = 0; i < data.length - 1; i++) {
          for (let j = 1; j < data.length; j++) {
            if (i != j) {
              if (data[i].itemId == data[j].itemId) {
                data.splice(j, 1)
                j--
              }
            }
          }
        }
        return data
      },
      // 删除 操作
      e_delete(row, index) {
        this.selectedItemList.splice(index, 1)
        this.$nextTick(() => {
          this.projectList.map((item1) => {
            if (item1.mergeId == row.mergeId) {
              this.$refs.projectArr.toggleRowSelection(item1, false)
            }
          })
          this.itemList.map((item1) => {
            if (item1.mergeId == row.mergeId) {
              this.$refs.itemArr.toggleRowSelection(item1, false)
            }
          })
        })
        this.getSelectedMergeArr(this.selectedItemList, this.merge)
      },
      // 关闭
      e_close() {
        this.diaLogShow = false
        this.$emit('cancel')
      }
    }
  }
</script>
<style scoped>
  .classFor {
    border-bottom: 1px solid #dfe6ec;
    width: 140%;
    margin-left: -12px;
    line-height: 30px;
  }

  .classFor div {
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .classFor:last-child {
    border-bottom: none
  }
</style>
