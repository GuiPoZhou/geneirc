<template>
  <el-dialog :title="titles"
             :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
             :close-on-click-modal="false" @close="cancelbtn" width="70%">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :prop="queryParams"
      :rules="rules"
      label-width="120px">
      <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">

        <el-tab-pane label="采购申请" name="first">
          <el-row>
            <el-col :span="8">
              <el-form-item label="申请单号">
                <el-input placeholder="系统自动生成" v-model="queryParams.applyNo"
                          disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请日期" prop="applyDate">
                <el-date-picker
                  :disabled="isdisable"
                  v-model="queryParams.applyDate"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择申请日期">
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="申请人员">
                <el-input placeholder="申请人员" :disabled="true"
                          v-model="queryParams.applyPersonName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="使用日期" prop="useDate">
                <el-date-picker
                  v-model="queryParams.useDate"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :disabled="isdisable"
                  placeholder="选择使用日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="批准人">
                <el-input placeholder="批准人" :disabled="true"
                          v-model="queryParams.approvePersonName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="批准日期">
                <el-date-picker :disabled="true" v-model="queryParams.approveDateStr" align="right"
                                type="date"
                                value-format="yyyy-MM-dd" placeholder="批准日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请部门">
                <el-input placeholder="申请部门" :disabled="true"
                          v-model="queryParams.applyDeptName"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="预估金额合计">
                <el-input placeholder="预估金额合计" :disabled="true"
                          v-model="queryParams.amount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="申请原因" prop="applyReason">
                <el-input type="textarea" :rows="2" placeholder="请输入内容"
                          v-model="queryParams.applyReason" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.remark"
                          :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="showType != 'add'">
              <el-form-item label="录入人员">
                <el-input placeholder="录入人员" :disabled="true" v-model="queryParams.createByStr"
                          disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="showType != 'add'">
              <el-form-item label="最新修改日期">
                <el-input placeholder="最新修改日期" :disabled="true" v-model="queryParams.updateTimeStr"
                          disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="tabDataHeader">
            <h3>耗材列表</h3>
            <div v-if="!isdisable">
              <el-button type="primary" size="mini" @click="addRows">添加行</el-button>
              <el-button type="danger" size="mini" @click="delRows">删除行</el-button>
            </div>
          </div>
          <el-table ref="multipleTable" :data="dataList" stripe border
                    @selection-change="handleSelectionChange" @sort-change="sortChange">
            <el-table-column type="selection" width="55"/>

            <el-table-column label="序号" align="center" type="index" width="50"/>

            <el-table-column prop="materialNumber" label="耗材编号" width="200">
              <template slot-scope="scope">
                <div @click="selectApplyDetail(scope)">
                  {{ scope.row.materialNumber ? scope.row.materialNumber : "请选择耗材" }}
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="materialName" label="耗材名称"/>
            <el-table-column prop="materialModel" label="规格型号"/>
            <el-table-column prop="unit" label="计量单位"/>
            <el-table-column prop="brand" label="品牌"/>
            <el-table-column prop="manufacturer" label="生产厂商"/>
            <el-table-column prop="grade" label="试剂级别"/>
            <el-table-column prop="applyCount" label="申请数量" width="151">
              <template slot-scope="scope">
                <el-input-number v-if="!isdisable" size="small" :disabled="isdisable" :min="1"
                                 v-model="scope.row.applyCount" @change="priceChange(scope)"/>
                <div v-else>{{ scope.row.applyCount }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="currentStoreCount" label="库存数量"/>
            <el-table-column prop="price" label="预估单价">
              <template slot-scope="scope">
                <el-input v-if="!isdisable" type="number" :disabled="isdisable"
                          v-model="scope.row.price" @change="priceChange(scope)"/>
                <div v-else>{{ scope.row.price }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="预估金额">
              <template slot-scope="scope">
                <el-input @change="calculate()" v-if="!isdisable" type="number" :disabled="true"
                          v-model="scope.row.amount"/>
                <div v-else>{{ scope.row.amount }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="useDate" label="使用日期" width="200">
              <template slot-scope="scope">
                <el-date-picker :disabled="isdisable" v-model="scope.row.useDate" align="right"
                                type="date" value-format="yyyy-MM-dd" v-if="!isdisable"
                                placeholder="选择日期">
                </el-date-picker>
                <div v-else>{{ scope.row.useDate }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="200">
              <template slot-scope="scope">
                <el-input type="textarea" v-model="scope.row.remark" :disabled="isdisable"/>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="审批流程" name="second">
          <approvalProcess :approvalProcess="approvalProcess"></approvalProcess>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="cyan" @click="handleOk('Y')" :loading="isloading" v-if="showType !== 'show'">保存&提交</el-button>
      <el-button type="primary" @click="handleOk('N')" :loading="isloading" v-if="showType !== 'show'">保存</el-button>
      <el-button @click="cancelbtn">取消</el-button>
    </div>
    <addApplyDetail :id="id" v-if="isAddApplyDetail" :isEditDetail="isEditDetail" @confims="sureAddApplyDetail"
                    @close="isAddApplyDetail = false"></addApplyDetail>

  </el-dialog>
</template>

<script>
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import approvalProcess from '@/components/approvalProcess/index'
  import {treeselect} from "@/api/system/dept";
  import {
    getApprovalProcess,
    addBuyApply,
    getBuyApplyDetail,
    getDetailByBuyApplyId,
    editBuyApply,
    getBuyApplyNo,
    delApplyDetail
  } from '@/api/chemical/purchaseApply'
  import addApplyDetail from "./addApplyDetail"
  import {getNowTime} from '../../common/common.js'

  var floatObj = require("../../common/floatObj.js");

  export default {
    name: "craeteApply",
    components: {Treeselect, approvalProcess, addApplyDetail},
    data() {
      return {
        dialogShow: true,
        isFullScreen: true,
        isloading: false,
        screenName: "fullScreen",
        titles: '',
        // showType: 'add',
        activeName: 'first',
        queryParams: {
          amount: 0,
          applyDate: "",
          applyDept: "",
          applyDeptName: "",
          applyNo: "",
          applyPerson: "",
          applyPersonName: "",
          applyReason: "",
          remark: "",
          useDate: "",
          approveDateStr: ""
        },
        formdata: {
          pageNum: 1,
          pageSize: 10
        },
        rules: {
          applyNo: [{required: true, message: "请输入申请单号", trigger: "blur"}],
          applyDate: [{required: true, message: "请选择申请日期", trigger: "change"}],
          useDate: [{required: true, message: "请选择使用日期", trigger: "change"}],
          // applyReason: [{required: true, message: "请输入申请原因", trigger: "blur"}],
          // remark: [{required: true, message: "请输入备注", trigger: "blur"}],
        },
        // 上传文件列表
        fileList: [],
        isdisable: false,
        // 授权岗位
        uploadFileList: [],
        file: [],
        roleList: [],
        submitpostList: [],
        submitroleList: [],
        total: 0,
        approvalProcess: {},
        dataList: [],
        consumablesList: [],
        multipleSelection: [],
        isAddApplyDetail: false,
        addApplyIndex: "",
        isEditDetail: 1,
        ids: []
      }
    },
    props: {
      showType: "",
      id: 0
    },
    computed: {
      getLeftWidth() {
        return this.$store.state.app.leftWidth;
      }
    },
    created() {
      if (this.id != 0) {
        getBuyApplyDetail(this.id).then(res => {
          this.queryParams = res.data
          this.getProcess()
        });
        this.getDetailList()
      } else {
        this.queryParams.useDate = getNowTime()
        this.queryParams.applyDate = getNowTime()
        this.queryParams.applyPerson = this.$store.state.user.userInfo.userName;
        this.queryParams.applyDept = this.$store.state.user.userInfo.dept.deptId;
        this.queryParams.applyPersonName = this.$store.state.user.userInfo.nickName;
        this.queryParams.applyDeptName = this.$store.state.user.userInfo.dept.deptName;
      }

      if (this.showType == "show") {
        this.isdisable = true
      } else {
        this.isdisable = false
      }
      if (this.showType == "add") {
        this.titles = "新增";
      } else if (this.showType == "edit") {
        this.titles = "修改";
      } else if (this.showType == 'show') {
        this.titles = "查看";
        this.isdisable = true
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
      }
    },
    methods: {
      getDetailList() {
        getDetailByBuyApplyId(this.id).then(res => {
          for (var i in res.data) {
            res.data[i].currentStoreCount = res.data[i].storeCountShow;
          }
          this.dataList = res.data;
        });
      },
      getProcess() {
        const params = {
          businessType: 'MATERIAL_BUY_APPLY',
          businessId: this.id,
          businessStatus: this.queryParams.status
        }
        getApprovalProcess(params).then(res => {
          this.approvalProcess = res
        })
      },
      priceChange(e) {
        this.dataList[e.$index]["amount"] = floatObj.accMul(this.dataList[e.$index]['price'], this.dataList[e.$index]["applyCount"]);
        this.calculate();
      },
      selectApplyDetail(e) {
        if (this.showType == "show") {
          return false
        }
        this.addApplyIndex = e.$index;
        this.isAddApplyDetail = true;
        if (this.dataList[e.$index].materialName) {
          this.isEditDetail = 1
        } else {
          this.isEditDetail = 0
        }
      },
      calculate() {
        var amount = 0;
        for (var i in this.dataList) {
          amount = floatObj.accAdd(amount, this.dataList[i].amount)
        }

        this.queryParams.amount = amount;
      },
      /*		selectConsumables(e) {
            var index = e.$index
            this.dataList[index]["materialNumber"] = this.consumablesList[this.dataList[index].sindex].materialNumber
            this.dataList[index]["materialName"] = this.consumablesList[this.dataList[index].sindex].materialName
            this.dataList[index]["materialModel"] = this.consumablesList[this.dataList[index].sindex].materialModel
            this.dataList[index]["unit"] = this.consumablesList[this.dataList[index].sindex].unit
            this.dataList[index]["brand"] = this.consumablesList[this.dataList[index].sindex].brand
            this.dataList[index]["manufacturer"] = this.consumablesList[this.dataList[index].sindex].manufacturer
            this.dataList[index]["grade"] = this.consumablesList[this.dataList[index].sindex].grade
            this.dataList[index]["currentStoreCount"] = this.consumablesList[this.dataList[index].sindex].currentStoreCount
          },*/
      sureAddApplyDetail(val) {
        if (this.showType == "edit") {
          this.getDetailList();
        } else {
          var index = this.addApplyIndex;
          this.dataList[index]["materialNumber"] = val.materialNumber
          this.dataList[index]["materialName"] = val.materialName
          this.dataList[index]["materialModel"] = val.materialModel
          this.dataList[index]["materialId"] = val.id
          this.dataList[index]["unit"] = val.unit
          this.dataList[index]["brand"] = val.brand
          this.dataList[index]["manufacturer"] = val.manufacturer
          this.dataList[index]["grade"] = val.grade
          this.dataList[index]["currentStoreCount"] = val.currentStoreCount
        }
        this.isAddApplyDetail = false;
      },
      addRows() {
        this.dataList.push({
          materialNumber: "",
          materialName: "",
          materialModel: "",
          unit: "",
          brand: "",
          manufacturer: "",
          grade: "",
          applyCount: "",
          currentStoreCount: "",
          price: "",
          amount: 0,
          useDate: this.queryParams.useDate,
          remark: "",
        });
        /*if(this.showType == "edit") {

        }*/
      },
      delRows() {
        if (this.ids.length <= 0) {
          this.$message.error("至少选择一个要删除的耗材")
          return false;
        }
        this.$confirm("确定删除选中行吗？", '提示').then(res => {
          var params = {
            applyDetailIds: this.ids.join(','),
            buyApplyId: this.id
          }
          var indexs = this.multipleSelection;
          indexs.sort(function (a, b) {
            return b - a
          });
          if (this.showType == "edit") {
            delApplyDetail(params).then(res => {
              for (var i in indexs) {
                this.dataList.splice(indexs[i], 1)
              }
              this.calculate()
            });
          } else {
            for (var i in indexs) {
              this.dataList.splice(indexs[i], 1)
            }
            this.calculate()
          }

        }).catch(res => {

        });
      },
      handleSelectionChange(val) {
        for (var i in this.dataList) {
          this.dataList[i].index = Number(i);
        }
        var multipleSelection = []
        var ids = []
        for (var i in val) {
          multipleSelection.push(val[i].index);
        }
        for (var i in val) {
          ids.push(val[i].id);
        }
        this.ids = ids
        this.multipleSelection = multipleSelection
      },
      sortChange() {

      },
      e_changeBox(type) {
        this.isFullScreen = type;
      },
      handleClick(e) {
        if (e.index === '2') {
          if (this.queryParams.id) {
            this.getfileList()
          }
        }
      },
      open() {
        if (this.queryParams.id) {
          if (this.queryParams.uploadFileList.length !== 0) {
            this.fileList = this.queryParams.uploadFileList.map(item => {
              return {
                name: item.fileName,
                response: {
                  data: {
                    filePath: item.filePath,
                    id: item.id
                  }
                }
              }
            })
            this.uploadFileList = this.fileList.map(item => {
              return {
                fileName: item.name,
                filePath: item.response.data.filePath,
              }
            })
          }
        }
      },
      normalizer(node) {
        if (node.childList && !node.childList.length) {
          delete node.childList;
        }
        return {
          id: node.id,
          label: node.nodeName,
          children: node.childList,
          parentId: node.parentId
        };
      },
      init(show, data) {
        this.dialogShow = true
        this.showType = show
      },

      // 提交
      handleOk(submitFlag) {
        this.$refs["queryForm"].validate((valid) => {
          if (valid) {
            var data = {};
            data = this.queryParams;
            data.submitFlag = submitFlag;
            data.detailList = [];
            if (this.dataList.length <= 0) {
              this.$message.error('至少添加一个耗材')
              return
            }
            for (var i in this.dataList) {
              if (this.dataList[i].materialId == undefined) {
                this.$message.error("请选择序号" + (Number(i) + 1) + '耗材')
                return false
              }
              data.detailList.push({
                id: this.dataList[i].id,
                materialId: this.dataList[i].materialId,
                amount: Number(this.dataList[i].amount),
                applyCount: this.dataList[i].applyCount,
                price: this.dataList[i].price,
                remark: this.dataList[i].remark,
                storeCountShow: this.dataList[i].currentStoreCount,
                useDate: this.dataList[i].useDate,
              })
            }
            this.isloading = true
            getBuyApplyNo().then(res => {
              data.applyNo = res.data.buyApplyNo;
              if (this.id == 0) {
                delete data.id;
                addBuyApply(data).then(res => {
                  if (res.code == 200) {
                    this.$message.success("新增成功");
                    this.isloading = false
                    this.$emit("refresh")
                  } else {
                    this.$message.error(res.msg)
                    this.isloading = false
                  }
                }).catch((e) => {
                  this.isloading = false
                });
              } else {
                data.id = this.id;
                editBuyApply(data).then(res => {
                  if (res.code == 200) {
                    this.$message.success("修改成功");
                    this.isloading = false
                    this.$emit("refresh")
                  } else {
                    this.isloading = false
                    this.$message.error(res.msg)
                  }
                }).catch((e) => {
                  this.isloading = false
                });
              }
            });
          } else {
            this.isloading = false
            return false;
          }
        })
      },
      cancelbtn() {
        this.$emit('close')
      }
    }
  }
</script>

<style scoped lang="less">

  /deep/ input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
    -moz-appearance: textfield !important;
  }

  /deep/ .el-dialog__body .el-col {
    margin-bottom: 0;
  }

  .el-tabs__content {

  }

  /deep/ .el-tabs .el-tabs__content {
    overflow: initial !important;
  }

  /deep/ .el-dialog__body .el-table {
    background-color: #fff;
  }

  .tabDataHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    h3 {
      font-weight: bold;
    }
  }
</style>
