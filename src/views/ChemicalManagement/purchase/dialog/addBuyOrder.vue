<template>
  <el-dialog :title="titles"
             :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
             :close-on-click-modal="false" width="70%">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :rules="rules"
      :prop="queryParams"
      label-width="120px">
      <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">

        <el-tab-pane label="采购订单" name="first">
          <el-row>
            <el-col :span="8">
              <el-form-item label="采购单号" prop="orderNo">
                <el-input placeholder="请输入采购单号" v-model="queryParams.orderNo"
                          :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购日期" prop="orderDate">
                <el-date-picker :disabled="isdisable" v-model="queryParams.orderDate" align="right"
                                type="date" value-format="yyyy-MM-dd" placeholder="选择采购日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="要求到货日期" prop="finishDate">
                <el-date-picker v-model="queryParams.finishDate" align="right" type="date"
                                value-format="yyyy-MM-dd" :disabled="isdisable" placeholder="选择使用日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商名称" prop="supplierId">
                <el-select v-model="queryParams.supplierId" placeholder="请选择供应商" :disabled="isdisable"
                           @change="supplierChange">
                  <el-option :value="item.id" :label="item.supplierName"
                             v-for="(item,index) in supplierList"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="地址" prop="supplierAddress">
                <el-input placeholder="请输入地址" :disabled="isdisable"
                          v-model="queryParams.supplierAddress"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系人" prop="contact">
                <el-input placeholder="请输入联系人" :disabled="isdisable"
                          v-model="queryParams.contact"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话" prop="phone">
                <el-input placeholder="请输入联系电话" :disabled="isdisable"
                          v-model="queryParams.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="金额合计">
                <el-input placeholder="金额合计" :disabled="true" v-model="queryParams.amount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="币种" prop="currency">
                <el-select v-model="queryParams.currency" placeholder="请选择币种" :disabled="isdisable">
                  <el-option :value="item.dictValue" :label="item.dictLabel"
                             v-for="(item,index) in currencyList"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="转入申请单号" prop="applyNos">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.applyNos"
                          :disabled="true"></el-input>
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
              <el-button type="primary" @click="addRows">添加行</el-button>
              <el-button type="danger" @click="delRows">删除行</el-button>
            </div>
          </div>
          <el-table ref="multipleTable" :data="dataList" stripe border
                    @selection-change="handleSelectionChange">
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
            <el-table-column prop="orderCount" label="采购数量" width="151">
              <template slot-scope="scope">
                <el-input-number v-if="!isdisable" size="mini" :min="0" v-model="scope.row.orderCount"
                                 @change="tableAmount(scope)"></el-input-number>
                <div v-else>
                  {{ scope.row.orderCount }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="waitAcceptCount" label="未交数量"/>
            <el-table-column prop="price" label="单价">
              <template slot-scope="scope">
                <el-input v-if="!isdisable" type="number" size="mini" v-model="scope.row.price"
                          @change="tableAmount(scope)"></el-input>
                <div v-else>
                  {{ scope.row.price }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额"/>
            <el-table-column prop="finishDate" label="要求到货日期" width="200">
              <template slot-scope="scope">
                <el-date-picker v-if="!isdisable" :disabled="isdisable" v-model="scope.row.finishDate"
                                align="right"
                                type="date" value-format="yyyy-MM-dd" placeholder="选择要求到货日期">
                </el-date-picker>
                <div v-else>
                  {{ scope.row.finishDate }}
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="applyNos" label="申请单号">
              <template slot-scope="scope">
                <el-link type="primary" @click="showApplyNo(scope)">{{ scope.row.applyNos }}</el-link>
              </template>
            </el-table-column>

            <el-table-column prop="remark" label="备注" width="200">
              <template slot-scope="scope">
                <el-input v-if="!isdisable" type="textarea" v-model="scope.row.remark"/>
                <div v-else>{{ scope.row.remark }}</div>
              </template>
            </el-table-column>
          </el-table>
          <el-row style="margin-top: 20px">
            <el-col :span="6">
              <el-form-item label="合计金额大写">
                <el-input v-model="queryParams.amountCn" :disabled="true" class="wid"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合计金额小写">
                <el-input v-model="queryParams.amount" :disabled="true" class="wid"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
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
    <showPurchaseOrder v-if="isShowPurchaseOrder" :dataLists="dataLists"
                       @close="isShowPurchaseOrder = false"></showPurchaseOrder>
    <addApplyDetail :id="id" v-if="isAddApplyDetail" :isEditDetail="isEditDetail" :isOrder="true"
                    @confims="sureAddApplyDetail" @close="isAddApplyDetail = false"></addApplyDetail>
  </el-dialog>
</template>

<script>
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import approvalProcess from '@/components/approvalProcess/index'

  import showPurchaseOrder from "./showPurchaseOrder";
  import addApplyDetail from "./addApplyDetail";
  import {
    convertBuyOrder,
    getSelectList,
    addBuyOrder,
    updateBuyOrder,
    queryBuyOrderById,
    delBuyOrderDetail
  } from "@/api/chemical/purchaseOrder";
  import {getBuyApplyNo} from '@/api/chemical/purchaseApply'
  import {getDataList} from '@/api/chemical/essentialInformation.js';
  import {getApprovalProcess} from '@/api/chemical/purchaseApply'
  import {getNowTime} from "../../common/common";

  var floatObj = require("../../common/floatObj.js");
  export default {
    name: "addBuyOrder",
    components: {approvalProcess, showPurchaseOrder, addApplyDetail},
    data() {
      return {
        dataLists: [],
        isShowPurchaseOrder: false,
        isloading: false,
        dialogShow: true,
        isFullScreen: true,
        screenName: "fullScreen",
        titles: '',
        // showType: 'add',
        rules: {
          orderNo: [{required: true, message: "请输入采购单号", trigger: "change"}],
          orderDate: [{required: true, message: "请选择采购日期", trigger: "blur"}],
          // supplierId: [{required: true, message: "请选择供应商名称", trigger: "change"}],
          finishDate: [{required: true, message: "请选择要求到货日期", trigger: "change"}],
          // supplierAddress: [{required: true, message: "请输入地址", trigger: "change"}],
          // contact: [{required: true, message: "请输入联系人", trigger: "blur"}],
          // phone: [{required: true, message: "请输入联系电话", trigger: "blur"}],
          // currency: [{required: true, message: "请选择币种", trigger: "change"}],
          // applyNos: [{required: true, message: "请输入转入申请单号", trigger: "blur"}],
          // remark: [{required: true, message: "请输入备注", trigger: "blur"}],
        },
        activeName: 'first',
        dataList: [],
        isdisable: false,
        amountOfCapital: "",
        amount: "",
        approvalProcess: {},
        queryParams: {
          orderNo: "",
          applyNos: "",
          amount: "",
          amountCn: "",
          contact: "",
          currency: "",
          finishDate: "",
          orderDate: "",
          phone: "",
          remark: "",
          supplierId: "",
          supplierName: "",
          supplierAddress: ""
        },
        supplier: "",
        supplierList: [],
        currencyList: [],
        isAddApplyDetail: 0,
        isEditDetail: 0,
        multipleSelection: [],
        ids: [],
        status: 0
      }
    },
    props: {
      showType: {
        type: String,
        default: "add"
      },
      id: {
        type: Number,
        default: 0
      },
      convertParams: {
        type: Array,
        default: []
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
      }
    },
    mounted() {
      if (this.convertParams.length > 0) {
        convertBuyOrder(this.convertParams).then(res => {
          this.queryParams.orderNo = res.data.buyOrder.orderNo ? res.data.buyOrder.orderNo : "";
          this.queryParams.amount = res.data.buyOrder.amount ? res.data.buyOrder.amount : '';
          this.queryParams.amountCn = res.data.buyOrder.amountCn ? res.data.buyOrder.amountCn : "";
          this.queryParams.contact = res.data.buyOrder.contact ? res.data.buyOrder.contact : "";
          this.queryParams.currency = res.data.buyOrder.currency ? res.data.buyOrder.currency : "";
          this.queryParams.finishDate = res.data.buyOrder.finishDate ? res.data.buyOrder.finishDate : "";
          this.queryParams.orderDate = res.data.buyOrder.orderDate ? res.data.buyOrder.orderDate : "";
          this.queryParams.phone = res.data.buyOrder.phone ? res.data.buyOrder.phone : "";
          this.queryParams.remark = res.data.buyOrder.remark;
          this.queryParams.supplierId = res.data.buyOrder.supplierId ? res.data.buyOrder.supplierId : "";
          this.queryParams.supplierName = res.data.buyOrder.supplierName ? res.data.buyOrder.supplierName : "";
          this.queryParams.applyNos = res.data.buyOrder.applyNos ? res.data.buyOrder.applyNos : "";
          this.dataList = res.data.detailList;
          this.status = res.data.buyOrder.status
          this.getProcess();
          this.calculate();
        });
      } else {
        if (this.id) {
          queryBuyOrderById(this.id).then(res => {
            this.queryParams.orderNo = res.data.buyOrder.orderNo
            this.queryParams.orderDate = res.data.buyOrder.orderDate
            this.queryParams.finishDate = res.data.buyOrder.finishDate
            this.queryParams.supplierName = res.data.buyOrder.supplierName
            this.queryParams.supplierId = res.data.buyOrder.supplierId
            this.queryParams.supplierAddress = res.data.buyOrder.supplierAddress
            this.queryParams.contact = res.data.buyOrder.contact
            this.queryParams.phone = res.data.buyOrder.phone
            this.queryParams.amount = res.data.buyOrder.amount
            this.queryParams.currency = res.data.buyOrder.currency
            this.queryParams.applyNos = res.data.buyOrder.applyNos
            this.queryParams.createByStr = res.data.buyOrder.createByStr
            this.queryParams.updateTimeStr = res.data.buyOrder.updateTimeStr
            this.queryParams.amountCn = res.data.buyOrder.amountCn
            this.queryParams.remark = res.data.buyOrder.remark
            this.dataList = res.data.detailList
            this.status = res.data.buyOrder.status
            this.getProcess();

            this.calculate()
          });
        } else {
          this.queryParams.orderDate = getNowTime();
          this.queryParams.finishDate = getNowTime();
          getBuyApplyNo().then(res => {
            this.queryParams.orderNo = res.data.buyApplyNo;
          });
        }
      }
      getSelectList().then(res => {
        this.supplierList = res.data;
      });
      getDataList("currency_type").then(res => {
        this.currencyList = res.data
      });
      if (this.showType == "show") {
        this.titles = "查看"
        this.isdisable = true;
      } else if (this.showType == "edit") {
        this.titles = "修改"
        this.isEditDetail = 1
      } else {
        this.titles = "新增"
      }

    },
    methods: {
      getProcess() {
        const params = {
          businessType: 'MATERIAL_BUY_ORDER',
          businessId: this.id,
          businessStatus: this.status
        }
        getApprovalProcess(params).then(res => {
          this.approvalProcess = res
        })
      },
      selectApplyDetail(val) {
        if (this.showType == "show") {
          return false
        }
        this.addApplyIndex = val.$index;
        if (!val.row.applyNos) {
          this.isAddApplyDetail = true;
        }
      },
      showApplyNo(val) {
        this.isShowPurchaseOrder = true;
        this.dataLists = this.dataList[val.$index].detailList
      },
      tableAmount(scope) {
        this.dataList[scope.$index].amount = floatObj.accMul(this.dataList[scope.$index].orderCount, this.dataList[scope.$index].price)
        // this.dataList[scope.$index].amount = (this.dataList[scope.$index].orderCount * 10000) * (this.dataList[scope.$index].price * 10000) / Math.pow(10000, 2);
        this.calculate();
      },
      calculate() {
        var amount = 0;
        for (var i in this.dataList) {
          amount = floatObj.accAdd(amount, this.dataList[i].amount)
        }
        console.log(amount);
        this.queryParams.amount = amount
        this.queryParams.amountCn = this.smallToBig(this.queryParams.amount)
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
      supplierChange(val) {
        for (var i in this.supplierList) {
          if (val == this.supplierList[i].id) {
            this.queryParams.supplierName = this.supplierList[i].supplierName;
            this.queryParams.supplierId = this.supplierList[i].id;
            this.queryParams.supplierAddress = this.supplierList[i].address;
            this.queryParams.contact = this.supplierList[i].contacts;
            this.queryParams.phone = this.supplierList[i].contactsPhone;
          }
        }
      },
      sureAddApplyDetail(val) {
        var index = this.addApplyIndex;
        this.dataList[index]["materialNumber"] = val.materialNumber;
        this.dataList[index]["materialName"] = val.materialName;
        this.dataList[index]["materialModel"] = val.materialModel;
        this.dataList[index]["materialId"] = val.id;
        this.dataList[index]["unit"] = val.unit;
        this.dataList[index]["brand"] = val.brand;
        this.dataList[index]["manufacturer"] = val.manufacturer;
        this.dataList[index]["grade"] = val.grade;
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
          orderCount: 0,
          waitAcceptCount: "",
          price: 0,
          amount: 0,
          finishDate: this.queryParams.finishDate,
          applyNos: "",
          remark: "",
        });
      },
      delRows() {
        if (this.ids.length <= 0) {
          this.$message.error("至少选择一个要删除的耗材")
          return false;
        }
        this.$confirm("确定删除选中行吗？", '提示').then(res => {
          var params = {
            buyOrderDetailId: this.ids.join(','),
            buyOrderId: this.id
          }
          var indexs = this.multipleSelection;
          indexs.sort(function (a, b) {
            return b - a
          });

          if (this.showType == "edit" && params.buyOrderDetailId.length > 0) {
            delBuyOrderDetail(params).then(res => {
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
        })
      },
      e_changeBox(type) {
        this.isFullScreen = type;
      },
      handleOk(flag) {
        this.$refs["queryForm"].validate((valid) => {
          if (valid) {
            if (this.dataList.length <= 0) {
              this.$message.error("至少选择一个耗材");
              return
            }
            var data = {
              submitFlag: flag,
              buyOrder: {
                amount: this.queryParams.amount,
                amountCn: this.queryParams.amountCn,
                contact: this.queryParams.contact,
                currency: this.queryParams.currency,
                finishDate: this.queryParams.finishDate,
                orderDate: this.queryParams.orderDate,
                orderNo: this.queryParams.orderNo,
                phone: this.queryParams.phone,
                remark: this.queryParams.remark,
                applyNos: this.queryParams.applyNos,
                supplierAddress: this.queryParams.supplierAddress,
                supplierId: this.queryParams.supplierId,
                supplierName: this.queryParams.supplierName,
              },
              detailList: []
            }
            for (var i in this.dataList) {
              data.detailList.push({
                amount: this.dataList[i].amount,
                finishDate: this.dataList[i].finishDate,
                materialId: this.dataList[i].materialId,
                orderCount: this.dataList[i].orderCount,
                price: this.dataList[i].price,
                detailList: this.dataList[i].detailList ? this.dataList[i].detailList : [],
                remark: this.dataList[i].remark
              })
            }
            this.isloading = true
            if (this.id == 0) {
              addBuyOrder(data).then(res => {
                if (res.code == 200) {
                  this.$message.success("新增成功");
                  this.isloading = false
                  this.$emit('submits');
                }
              }).catch((e) => {
                this.isloading = false
              })
            } else {
              for (var i in this.dataList) {
                if (this.dataList[i].id) {
                  data.detailList[i].id = this.dataList[i].id
                }
              }
              data.buyOrder.id = this.id
              updateBuyOrder(data).then(res => {
                if (res.code == 200) {
                  this.$message.success("修改成功");
                  this.isloading = false
                  this.$emit('submits');
                }
              }).catch((e) => {
                this.isloading = false
              })
            }
          }
        })
      },
      handleClick(e) {
        if (e.index === '2') {
          if (this.queryParams.id) {
            this.getfileList();
          }
        }
      },
      cancelbtn() {
        this.$emit('close');
      },
      purchaseOrder(flag) {
        var data = {
          submitFlag: flag,
          buyOrder: {
            amount: this.queryParams.amount,
            amountCn: this.queryParams.amountCn,
            contact: this.queryParams.contact,
            currency: this.queryParams.currency,
            finishDate: this.queryParams.finishDate,
            orderDate: this.queryParams.orderDate,
            orderNo: this.queryParams.orderNo,
            phone: this.queryParams.phone,
            remark: this.queryParams.remark,
            applyNos: this.queryParams.applyNos,
            supplierAddress: this.queryParams.supplierAddress,
            supplierId: this.queryParams.supplierId,
            supplierName: this.queryParams.supplierName,
          },
          detailList: []
        }
        for (var i in this.dataList) {
          data.detailList.push({
            amount: this.dataList[i].amount,
            finishDate: this.dataList[i].finishDate,
            materialId: this.dataList[i].materialId,
            orderCount: this.dataList[i].orderCount,
            price: this.dataList[i].price,
            detailList: this.dataList[i].detailList ? this.dataList[i].detailList : []
          });
        }
        if (this.id == 0) {
          addBuyOrder(data).then(res => {
            if (res.code == 200) {
              this.$message.success("新增成功");
              this.$emit('submits');
            }
          })
        } else {
          for (var i in this.dataList) {
            if (this.dataList[i].id) {
              data.detailList[i].id = this.dataList[i].id
            }
          }
          data.buyOrder.id = this.id
          updateBuyOrder(data).then(res => {
            if (res.code == 200) {
              this.$message.success("修改成功");
              this.$emit('submits');
            }
          })
        }
      }
      ,
      smallToBig(money) {
        //  将数字金额转换为大写金额
        var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
        var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
        var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
        var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
        var cnInteger = "整"; //整数金额时后面跟的字符
        var cnIntLast = "元"; //整数完以后的单位
        //最大处理的数字
        var maxNum = 999999999999999.9999;
        var integerNum; //金额整数部分
        var decimalNum; //金额小数部分
        //输出的中文金额字符串
        var chineseStr = "";
        var parts; //分离金额后用的数组，预定义
        if (money == "") {
          return "";
        }

        money = parseFloat(money);
        if (money >= maxNum) {
          //超出最大处理数字
          return "超出最大处理数字";
        }
        if (money == 0) {
          chineseStr = cnNums[0] + cnIntLast + cnInteger;
          return chineseStr;
        }

        //四舍五入保留两位小数,转换为字符串
        money = Math.round(money * 10000).toString();
        integerNum = money.substr(0, money.length - 4);
        decimalNum = money.substr(money.length - 4);

        //获取整型部分转换
        if (parseInt(integerNum, 10) > 0) {
          var zeroCount = 0;
          var IntLen = integerNum.length;
          for (var i = 0; i < IntLen; i++) {
            var n = integerNum.substr(i, 1);
            var p = IntLen - i - 1;
            var q = p / 4;
            var m = p % 4;
            if (n == "0") {
              zeroCount++;
            } else {
              if (zeroCount > 0) {
                chineseStr += cnNums[0];
              }
              //归零
              zeroCount = 0;
              chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
              chineseStr += cnIntUnits[q];
            }
          }
          chineseStr += cnIntLast;
        }
        //小数部分
        if (decimalNum != "") {
          var decLen = decimalNum.length;
          for (var i = 0; i < decLen; i++) {
            var n = decimalNum.substr(i, 1);
            if (n != "0") {
              chineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
          }
        }
        if (chineseStr == "") {
          chineseStr += cnNums[0] + cnIntLast + cnInteger;
        } else if (decimalNum == "" || /^0*$/.test(decimalNum)) {
          chineseStr += cnInteger;
        }
        return chineseStr;
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
