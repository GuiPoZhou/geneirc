<template>
  <div>
    <ml-dialog ref="mlDialog" :dia-log-show="dialogShow" dia-log-title="维护判定指标" dia-log-width="60%"
               @close="cancel"
               @open="open"
               v-loading="loading">
      <template slot="bologbody">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          :prop="queryParams"
          style="margin: 15px 0 0 50px"
          :rules="rules"
          label-position="top"
          label-width="80px"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="标准号" prop="standardCode" style="width: 100%" required>
                <el-input placeholder="请输入标准号" v-model="queryParams.standardCode" disabled
                          style="width: 120%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="中文标准名称" prop="standardNameCn" style="width: 100%" required>
                <el-input placeholder="请输入中文标准名称" v-model="queryParams.standardNameCn" disabled
                          style="width: 120%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="标准状态" prop="status" style="width: 100%" required>
                <el-select
                  v-model="queryParams.status"
                  clearable
                  disabled
                  style="width: 120%"
                >
                  <el-option label="现行" value="0"></el-option>
                  <el-option label="将实施" value="1"></el-option>
                  <el-option label="作废" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="targetBox">
          <!--分类-->
          <el-col :span="5" :xs="24">
            <product-classification
              :treeList="treeList"
              @updata="updata"
              @handleData="handleData"
              :decidestandardId="decidestandardId">
            </product-classification>
          </el-col>
          <el-col :span="18" :xs="24" class="a-m-c-right">
            <div class="a-c-top tableBox">
              <div class="searchbox">
                <span>试验参数：</span>
                <el-input
                  v-model="itemName"
                  placeholder="请输入试验参数或子项目名称"
                  clearable
                  class="input-with-select"
                  style="width: 240px"
                />
                <el-button type="cyan" icon="el-icon-search" size="mini" class="searchBtn" @click="getdecision">查询
                </el-button>
              </div>
              <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-plus"
                    @click="add_progect"
                  >添加试验参数
                  </el-button
                  >
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-edit-outline"
                    :disabled="ismultiple"
                    @click="handleIndex"
                  >维护多指标
                  </el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-document-copy"
                    :disabled="copymultiple"
                    @click="handleCopy"
                  >复制指标
                  </el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    :disabled="delmultiple"
                    @click="handleDel"
                  >删除
                  </el-button>
                </el-col>
                <el-col :span="1.5"></el-col>
              </el-row>
              <el-table
                border
                v-loading="loading"
                :data="listData"
                row-key="rowIndex"
                ref="selectTable"
                style="margin-top: 20px"
                highlight-current-row
                :tree-props="{children: 'childList'}"
                stripe
              >
                <el-table-column width="35" align="center">
                  <template scope="scope">
                    <el-radio :label="scope.$index" @change.native="handleCurrentChange(scope.row)"
                              v-model="radio"></el-radio>
                  </template>
                </el-table-column>
                <el-table-column
                  label="序号"
                  align="center"
                  prop="rowIndex"
                  width="50"
                />
                <el-table-column
                  prop="itemName"
                  label="试验参数名称"
                  align="center"
                  width="120"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="itemSubName"
                  label="子项名称"
                  align="center"
                  width="120"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="指标单位"
                  show-overflow-tooltip
                  width="120"
                >
                  <template slot-scope="scope">
                    <el-select v-if="scope.row.limitCount > 1" v-model="scope.row.unit" filterable disabled
                               @change="unitChange(scope.row)">
                      <el-option
                        v-for="item in unitoptions"
                        :key="item.id"
                        :label="item.unitName"
                        :value="item.id">
                      </el-option>
                    </el-select>
                    <el-select v-else v-model="scope.row.unit" filterable :disabled="isdisadle || scope.row.isdisadle"
                               @change="unitChange(scope.row)">
                      <el-option
                        v-for="item in unitoptions"
                        :key="item.id"
                        :label="item.unitName"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="entrustCode"
                  label="比较符号"
                  show-overflow-tooltip
                  width="130"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-select v-if="scope.row.limitCount <= 1" v-model="scope.row.compareContent" filterable
                               :disabled="isdisadle || scope.row.isdisadle" @change="compareChange(scope.row)">
                      <el-option
                        v-for="item in comparatoroptions"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                    <div class="rowclass" v-if="scope.row.limitCount > 1" v-for="item in scope.row.multiList">
                      <div>{{item.compareContent}}</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="entrustCode"
                  label="最小值"
                  show-overflow-tooltip
                  width="120"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div class="rowclass" v-if="scope.row.limitCount > 1" v-for="item in scope.row.multiList">
                      <div>{{ item.lowLimit !== null ? item.lowLimit : '--' }}</div>
                    </div>
                    <el-input v-if="scope.row.limitCount <= 1" v-model="scope.row.lowLimit" :ref="'min' + scope.$index"
                              :disabled="scope.row.mindisadble || scope.row.isdisadle"
                              @keyup.enter.native="minchange(scope.row, scope.$index)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="entrustCode"
                  label="最大值"
                  show-overflow-tooltip
                  width="120"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div class="rowclass" v-if="scope.row.limitCount > 1" v-for="item in scope.row.multiList">
                      <div>{{ item.upLimit !== null ? item.upLimit : '--' }}</div>
                    </div>
                    <el-input v-if="scope.row.limitCount <= 1" v-model="scope.row.upLimit" :ref="'max' + scope.$index"
                              :disabled="scope.row.maxdisadble || scope.row.isdisadle"
                              @keyup.enter.native="maxchange(scope.row, scope.$index)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="limitDesc"
                  label="指标说明"
                  show-overflow-tooltip
                  width="150"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div class="rowclass" v-if="scope.row.limitCount > 1" v-for="item in scope.row.multiList">
                      <div>{{item.limitDesc}}</div>
                    </div>
                    <el-input v-if="scope.row.limitCount <= 1" v-model="scope.row.limitDesc"
                              :ref="'desc' + scope.$index" :disabled="isdisadle || scope.row.isdisadle"
                              @keyup.enter.native="descChange(scope.row, scope.$index)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="decideResult"
                  label="判定结论"
                  show-overflow-tooltip
                  width="120"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div class="rowclass" v-if="scope.row.limitCount > 1" v-for="item in scope.row.multiList">
                      <!--                    <div>{{item.decideResult}}</div>-->
                      <div>{{ item.decideResult !== null ? item.decideResult : '--' }}</div>
                    </div>
                    <el-input v-if="scope.row.limitCount <= 1" v-model="scope.row.decideResult"
                              :ref="'result' + scope.$index" :disabled="isdisadle || scope.row.isdisadle"
                              @keyup.enter.native="resultChange(scope.row, scope.$index)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="decideResultFlag"
                  label="是否合格"
                  width="130"
                  align="center"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <div class="rowclass" v-for="item in scope.row.multiList" v-if="scope.row.limitCount > 1">
                      <el-select v-model="item.decideResultFlag" :disabled="true">
                        <el-option label="合格" :value="1"></el-option>
                        <el-option label="不合格" :value="0"></el-option>
                      </el-select>
                    </div>
                    <el-select v-model="scope.row.decideResultFlag" filterable :ref="'flag' + scope.$index"
                               v-if="scope.row.limitCount <= 1"
                               :disabled="isdisadle || scope.row.isdisadle" @change="decideResultFlagChange(scope.row)">
                      <el-option label="合格" :value="1"></el-option>
                      <el-option label="不合格" :value="0"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="remark"
                  label="备  注1"
                  show-overflow-tooltip
                  width="200"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div class="rowclass" v-if="scope.row.limitCount > 1" v-for="item in scope.row.multiList">
                      <div class="desc">{{ item.remark !== null ? item.remark : '--' }}</div>
                    </div>
                    <el-input v-if="scope.row.limitCount <= 1" v-model="scope.row.remark" :ref="'int' + scope.$index"
                              :disabled="isdisadle || scope.row.isdisadle"
                              @keyup.enter.native="remarkChange(scope.row, scope.$index)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="remark1"
                  label="备  注2"
                  show-overflow-tooltip
                  width="200"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div class="rowclass" v-if="scope.row.limitCount > 1" v-for="item in scope.row.multiList">
                      <div class="desc">{{ item.remark1 !== null ? item.remark1 : '--' }}</div>
                    </div>
                    <el-input v-if="scope.row.limitCount <= 1" v-model="scope.row.remark1" :ref="'int1' + scope.$index"
                              :disabled="isdisadle || scope.row.isdisadle"
                              @keyup.enter.native="remarkChange1(scope.row, scope.$index)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="decideScript"
                  label="脚本判定"
                  show-overflow-tooltip
                  width="200"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div class="rowclass" v-if="scope.row.limitCount > 1" v-for="item in scope.row.multiList">
                      <div class="desc">{{ item.decideScript !== null ? item.decideScript : '--' }}</div>
                    </div>
                    <el-input v-if="scope.row.limitCount <= 1" readonly v-model="scope.row.decideScript"
                              :disabled="scope.row.decideScriptadble || scope.row.isdisadle" @focus="handleScript(scope.row)"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </div>
      </template>
    </ml-dialog>
    <multiindex-maintenance
      v-if="showMultiindex"
      ref="multiindex"
      @close="showMultiindex = false">
    </multiindex-maintenance>
    <!--添加试验参数-->
    <addParameters
      v-if="showparameters"
      @close="showparameters = false"
      ref="parameters"
    ></addParameters>
    <!--复制指标-->
    <copaIndex
      v-if="showCopy"
      @close="closeCopy"
      ref="copyindex"
    ></copaIndex>
    <!--脚本判定-->
    <decideScript
      v-if="showScript"
      @close="showScript = false"
      ref="scroptdecide"
      @updateScript="updateScript"
    ></decideScript>
  </div>
</template>

<script>
  import multiindexMaintenance from './multiindexMaintenance'
  import productClassification from "../components/productClassification";
  import addParameters from './addParameters'
  import copaIndex from './copaIndex'
  import {
    getproductStandardTree,
    getstandaraItemList,
    addItemLimit,
    delStandardItem,
    getMultLimitList
  } from '@/api/standardManagement/standardManagement.js'
  import {listAllUnit} from "@/api/standardManagement/measuringUnit"
  import decideScript from './decideScript'

  export default {
    name: "maintenanceCriteria",
    components: {productClassification, multiindexMaintenance, addParameters, copaIndex, decideScript},
    data() {
      return {
        isFullScreen: true,
        screenName: "fullScreen",
        queryParams: {},
        rules: {},
        loading: false,
        dialogShow: false,
        showMultiindex: false,
        delmultiple: true,
        showCopy: false,
        showScript: false,
        xiangmu: '',
        unitoptions: [],
        comparatoroptions: ['＜', '≤', '＞', '≥', '＞，＜', '＞，≤', '≥，＜', '≥，≤', '匹配字符', '脚本判定'],
        listData: [],
        treeList: [],
        decidestandardId: 0,
        itemName: '',
        ismultiple: true,
        multiple: true,
        showparameters: false,
        indexdata: {},
        isdisadle: true,
        rowData: {},
        radio: '',  // 值为当前行的id,
        maxdisadle: true,
        mindisadle: true,
        copymultiple: true,
      }
    },
    computed: {
      getLeftWidth() {
        return this.$store.state.app.leftWidth;
      }
    },
    watch: {
      getLeftWidth() {
        let width = this.$store.state.app.leftWidth;
        if (width < 200) {
          this.screenName = "bigFullScreen";
        } else {
          this.screenName = "fullScreen";
        }
      },
    },
    mounted() {
      let width = this.$store.state.app.leftWidth;
      if (width < 200) {
        this.screenName = "bigFullScreen";
      } else {
        this.screenName = "fullScreen";
      }
    },
    methods: {
      open() {
        this.gettreeList()
        this.getdecision()
        this.getunitlist()
      },
      init(data) {
        console.log(data)
        if (data) {
          this.queryParams = {
            ...data
          }
        }
        this.dialogShow = true
      },
      e_changeBox(type) {
        this.isFullScreen = type;
      },
      cancelbtn() {
        this.$emit('close')
      },
      handleCurrentChange(val) {
        this.rowdata = val
          this.delmultiple = false
        if (this.indexdata.id !== undefined && val !== null) {
          this.ismultiple = false
        }
      },
      chooseone(row) {
        this.radio = row.itemId
      },
      handleIndex() {
          var num = 0
          if (this.rowdata.itemParentId > 0) {

          }
          this.listData.map(item => {
            if (item.itemParentId == this.rowdata.itemMethodId) {
                console.log(item.itemParentId)
                num++
            }
          })
          console.log(num)
          if (num > 0) {
              this.$message.error('存在子项目，父项目不允许维护多指标')
              return
          }
        this.showMultiindex = true;
        const params = {
          standardProductionId: this.indexdata.id,
          itemId: this.rowdata.itemId,
            decideStandardItemId: this.rowdata.id
        }
        getMultLimitList(params).then(res => {
          const objs = {
            standardProductionId: this.indexdata.id,
            itemId: this.rowdata.itemId,
            decideSdandardId: this.queryParams.id,
              decideStandardItemId: this.rowdata.id
          }
          this.$nextTick(() => {
            this.$refs.multiindex.init(res.data, objs);
          });
        })
      },
      // 树列表
      gettreeData(data) {
        this.decidestandardId = data
      },
      // 获取树列表
      gettreeList() {
        getproductStandardTree(this.decidestandardId).then(res => {
          this.treeList = res.data
        })
      },
      // 点击树更新右边列表
      updata() {
        this.gettreeList()
      },
      handleData(data, row) {
        this.copymultiple = false
        this.isdisadle = false
        this.indexdata = data
        this.radio = ''
        this.$refs.selectTable.setCurrentRow(row);
        this.ismultiple = true
        this.getdecision()
      },
      // 判定指标列表
      getdecision() {
        const params = {
          decideStandardId: this.decidestandardId,
          standardProductionId: this.indexdata.id,
          itemName: this.itemName
        }
        getstandaraItemList(params).then(res => {
          if (res.code === 200) {
            this.listData = res.data
              for (var i = 0; i < this.listData.length - 1; i++) {
                  for (var j = i + 1; j < this.listData.length; j++) {
                      if (this.listData[i].itemMethodId == this.listData[j].itemParentId) {
                          this.listData[i].isdisadle = true
                      }
                  }
              }
            this.listData.forEach(v => {
              v.mindisadble = true
              v.maxdisadble = true
              v.decideScriptadble = true
                var x = (v.rowIndex - 0);//测试的数字
                var y = String(x).indexOf(".") + 1;//获取小数点的位置
                var count = String(x).length - y;//获取小数点后的个数
                if(y > 0 && v.itemParentId !== 0) {
                    // console.log(1)
                   // v.isdisadle = true
                } else {
                    // console.log(2)
                    // v.isdisadle = false
                }
            });
            this.listData.map(v => {
              if (v.compareContent === '＞' || v.compareContent === '≥' || v.compareContent === '匹配字符') {
                v.mindisadble = false
                v.decideScriptadble = true
                v.maxdisadble = true
              } else if (v.compareContent === '＜' || v.compareContent === '≤') {
                v.mindisadble = true
                v.decideScriptadble = true
                v.maxdisadble = false
              } else if (v.compareContent === '＞，＜' || v.compareContent === '＞，≤' || v.compareContent === '≥，≤') {
                v.mindisadble = false
                v.decideScriptadble = true
                v.maxdisadble = false
              } else if (v.compareContent === '脚本判定') {
                v.mindisadble = true
                v.decideScriptadble = false
                v.maxdisadble = true
              }
            })
          }
        })
      },
      // 添加试验参数
      add_progect() {
        this.showparameters = true
        this.$nextTick(() => {
          this.$refs.parameters.init(this.decidestandardId)
        })
      },
      unique(arr) {
          const res = new Map();
          return arr.filter((arr) => !res.has(arr.itemId) && res.set(arr.itemId, 1));
      },
      // 删除判定指标
      handleDel() {
          var list = []
          var num = []
          var num1 = []
          for (var j = 0; j < this.listData.length; j++) {
              if (this.listData[j].isParents === false) {
                  list.push({
                      itemId:this.rowdata.itemId,
                      id: this.rowdata.id,
                      decideStandardId: this.decidestandardId
                  })
              } else {
                  if (this.rowdata.itemParentId == 0 && this.rowdata.itemMethodId == this.listData[j].itemParentId) {
                      console.log(1)
                      list.push({
                          itemId: this.listData[j].itemId,
                          id: this.listData[j].id,
                          decideStandardId: this.decidestandardId
                      })
                      list.unshift({
                          itemId: this.rowdata.itemId,
                          id: this.rowdata.id,
                          decideStandardId: this.decidestandardId
                      })
                  }
                  if (this.rowdata.itemParentId == 0 && this.rowdata.itemParentId != this.listData[j].itemParentId) {
                      console.log(23)
                      list.push({
                          itemId: this.rowdata.itemId,
                          id: this.rowdata.id,
                          decideStandardId: this.decidestandardId
                      })
                  }
                  if (this.rowdata.itemParentId == this.listData[j].itemMethodId) {
                      num.push(this.listData[j])
                  }
                  if (this.rowdata.itemParentId == this.listData[j].itemParentId) {
                      num1.push(this.listData[j])
                  }
              }
          }
          if (this.rowdata.itemParentId > 0) {
              if (num1.length > 1) {
                  console.log('有相同的,只删除本身')
                  list.push({
                      itemId: this.rowdata.itemId,
                      id: this.rowdata.id,
                      decideStandardId: this.decidestandardId
                  })
              } else {
                  console.log('没有相同的,删除本身+父')
                  list.push({
                      itemId: this.rowdata.itemId,
                      id: this.rowdata.id,
                      decideStandardId: this.decidestandardId
                  })
                  list.unshift({
                      itemId: num[0].itemId,
                      id: num[0].id,
                      decideStandardId: this.decidestandardId
                  })
              }
          }
          var params = this.unique(list)
          console.log(params)
          // return
        this.$confirm("确定要删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delStandardItem(params).then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.getdecision()
              this.$nextTick(() => {
                this.radio = null
                this.rowdata = null
                this.delmultiple = true
              })
              this.ismultiple = true
            }
          })
        })
      },
      // 修改增加判定指标
      itemLimit(value) {
        const params = {
          standardProductionId: this.indexdata.id,
          ...value
        }
        console.log(params)
        addItemLimit(params).then(res => {
          if (res.code === 200) {
            this.getdecision()
          }
        })
      },
      //获取检测类别列表
      getunitlist() {
        listAllUnit().then(response => {
            this.unitoptions = response.data;
          }
        );
      },
      // 指标单位
      unitChange(value) {
        const obj = {
          decideSdandardId: value.decideSdandardId,
          itemId: value.itemId,
          fieldKey: 'unit',
          fieldValue: value.unit,
            decideStandardItemId: value.id
        }
        this.itemLimit(obj)
      },
      // 是否合格
      decideResultFlagChange(v, index) {
        const obj = {
          decideSdandardId: v.decideSdandardId,
          itemId: v.itemId,
          fieldKey: 'decideResultFlag',
          fieldValue: v.decideResultFlag,
            decideStandardItemId: v.id
        }
        this.itemLimit(obj)
        this.$refs['int' + index].focus()
      },
      // 比较符号
      compareChange(v) {
        const obj = {
          decideSdandardId: v.decideSdandardId,
          itemId: v.itemId,
          fieldKey: 'compareContent',
          fieldValue: v.compareContent,
            decideStandardItemId: v.id
        }
        this.itemLimit(obj)
        if (v.compareContent === '＞' || v.compareContent === '≥' || v.compareContent === '匹配字符') {
          v.mindisadble = false
          v.maxdisadble = true
          v.decideScriptadble = true
          v.limitDesc = null
          v.upLimit = null
          v.lowLimit = null
        } else if (v.compareContent === '＜' || v.compareContent === '≤') {
          v.mindisadble = true
          v.maxdisadble = false
          v.decideScriptadble = true
          v.limitDesc = null
          v.upLimit = null
          v.lowLimit = null
        } else if (v.compareContent === '脚本判定') {
          v.mindisadble = true
          v.maxdisadble = true
          v.decideScriptadble = false
          v.limitDesc = null
          v.upLimit = null
          v.lowLimit = null
        } else {
          if (v.lowLimit !== null && v.upLimit !== null) {
            this.comconechange(v)
          }
          v.mindisadble = false
          v.maxdisadble = false
          v.decideScriptadble = true
        }
      },
      // 最小值
      minchange(v, index) {
        this.comconechange(v)
        const obj = {
          decideSdandardId: v.decideSdandardId,
          itemId: v.itemId,
          fieldKey: 'lowLimit',
          fieldValue: v.lowLimit,
            decideStandardItemId: v.id
        }
        if (v.maxdisadble === true) {
          this.$refs['desc' + index].focus()
        } else {
          this.$refs['max' + index].focus()
        }
        this.itemLimit(obj)
      },
      // 最大值
      maxchange(v, index) {
        this.comconechange(v)
        const obj = {
          decideSdandardId: v.decideSdandardId,
          itemId: v.itemId,
          fieldKey: 'upLimit',
          fieldValue: v.upLimit,
            decideStandardItemId: v.id
        }
        this.itemLimit(obj)
        this.$refs['desc' + index].focus()
      },
      cancel() {
        this.$emit('close')
      },
      comconechange(v) {
        const decideSdandardId = v.decideSdandardId
        const itemId = v.itemId
        if (v.compareContent === '＜' || v.compareContent === '≤') {
          v.limitDesc = v.compareContent + v.upLimit
        } else if (v.compareContent === '＞' || v.compareContent === '≥') {
          v.limitDesc = v.compareContent + v.lowLimit
        } else if (v.compareContent === '＞，＜') {
          if (v.upLimit !== null) {
            if ((v.upLimit - 0) < (v.lowLimit - 0)) {
              this.$message.warning('最大值不能小于输入的最小值')
            } else {
              v.limitDesc = '>' + v.lowLimit + '且' + '＜' + v.upLimit
            }
          }
        } else if (v.compareContent === '＞，≤') {
          if (v.upLimit !== null) {
            if ((v.upLimit - 0) < (v.lowLimit - 0)) {
              this.$message.warning('最大值不能小于输入的最小值')
            } else {
              v.limitDesc = '>' + v.lowLimit + '且' + '≤' + v.upLimit
            }
          }
        } else if (v.compareContent === '≥，＜') {
          if (v.upLimit !== null) {
            if ((v.upLimit - 0) < (v.lowLimit - 0)) {
              this.$message.warning('最大值不能小于输入的最小值')
            } else {
              v.limitDesc = '≥' + v.lowLimit + '且' + '＜' + v.upLimit
            }
          }
        } else if (v.compareContent === '≥，≤') {
          if (v.upLimit !== null) {
            if ((v.upLimit - 0) < (v.lowLimit - 0)) {
              this.$message.warning('最大值不能小于输入的最小值')
            } else {
              v.limitDesc = '≥' + v.lowLimit + '且' + '≤' + v.upLimit
            }
          }
        } else if (v.compareContent === '匹配字符') {
          v.limitDesc = v.lowLimit
        }
        console.log(v.limitDesc)
        if (v.limitDesc !== null) {
          const obj = {
            decideSdandardId,
            itemId,
            fieldKey: 'limitDesc',
            fieldValue: v.limitDesc,
              decideStandardItemId: v.id
          }
          this.itemLimit(obj)
        }
      },
      // 指标说明
      descChange(v, index) {
        const obj = {
          decideSdandardId: v.decideSdandardId,
          itemId: v.itemId,
          fieldKey: 'limitDesc',
          fieldValue: v.limitDesc,
            decideStandardItemId: v.id
        }
        this.itemLimit(obj)
        this.$refs['result' + index].focus()
      },
      // 备注1
      remarkChange(v) {
        const obj = {
          decideSdandardId: v.decideSdandardId,
          itemId: v.itemId,
          fieldKey: 'remark',
          fieldValue: v.remark,
            decideStandardItemId: v.id
        }
        this.itemLimit(obj)
        this.$refs['int1' + index].focus()
      },
      // 备注2
      remarkChange1(v) {
        const obj = {
          decideSdandardId: v.decideSdandardId,
          itemId: v.itemId,
          fieldKey: 'remark1',
          fieldValue: v.remark1,
            decideStandardItemId: v.id
        }
        this.itemLimit(obj)
      },
      // 脚本判定
      updateScript(data) {
        this.itemLimit(data)
      },
      // 判定结论
      resultChange(v, index) {
        const obj = {
          decideSdandardId: v.decideSdandardId,
          itemId: v.itemId,
          fieldKey: 'decideResult',
          fieldValue: v.decideResult,
            decideStandardItemId: v.id
        }
        this.itemLimit(obj)
        this.$refs['flag' + index].focus()
      },
      // 复制指标
      handleCopy() {
        this.showCopy = true
        this.$nextTick(() => {
          const dataObj = {
            treeList: this.treeList,
            decidestandardId: this.decidestandardId,
            unitoptions: this.unitoptions,
            toStandardProductionId: this.indexdata.id
          }
          this.$refs.copyindex.init(dataObj)
        })
      },
      // 复制指标弹窗关闭
      closeCopy() {
        this.showCopy = false
        this.copymultiple = true
      },
      handleScript(row) {
        console.log(11)
        this.showScript = true
        this.$nextTick(() => {
          this.$refs.scroptdecide.init(row)
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .targetBox {
    border-top: 1px solid #f5f5f5;
    display: flex;
    justify-content: space-between;
  }

  .tableBox {
    /*width: 73%;*/
  }

  .searchbox {
    margin-bottom: 20px;

    span {
      padding-right: 10px;
    }

    .searchBtn {
      margin-left: 20px;
    }
  }

  /deep/ .el-dialog__body .el-table {
    background: #ffffff;
  }

  .rowclass {
    /*white-space: pre-wrap;*/
    margin-bottom: 5px;
  }

  .desc {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
