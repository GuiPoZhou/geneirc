<template>
  <div style="padding: 20px">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      :prop="queryParams"
      style="margin: 15px 0 0 0"
      label-width="120px">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="任务信息" name="1">
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    label="委托编号"
                    prop="entrustCode"
                  >
                    <el-input v-model="queryParams.entrustCode" disabled
                              clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="委托类型"
                    prop="extData.entrustType"
                  >
                    <el-select v-model="queryParams.extData.entrustType"
                               disabled>
                      <el-option v-for="(item,index) in entrustTypeList"
                                 :key="index"
                                 :label="item.label" :value="item.value+''"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!--            <el-col :span="8" v-if="this.queryParams.entrustId">-->
                <!--              <el-form-item-->
                <!--                label="任务日期"-->
                <!--                prop="entrustDate"-->
                <!--              >-->
                <!--                <el-date-picker-->
                <!--                  disabled-->
                <!--                  v-model="queryParams.entrustDate"-->
                <!--                  type="date"-->
                <!--                  value="yyyy-MM-dd"-->
                <!--                  value-format="yyyy-MM-dd">-->
                <!--                </el-date-picker>-->
                <!--              </el-form-item>-->
                <!--            </el-col>-->
                <el-col :span="8">
                  <el-form-item
                    label="任务日期"
                    prop="entrustTime"
                  >
                    <el-date-picker
                      disabled
                      v-model="queryParams.entrustTime"
                      type="date"
                      value="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="工厂"
                    prop="extData.factoryCode"
                  >
                    <el-select v-model="queryParams.extData.factoryCode"
                               disabled>
                      <el-option v-for="(item,index) in ExtDeptCodeList"
                                 :key="index"
                                 :label="item.deptName" :value="item.extDeptCode"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="车间"
                    prop="extData.produceWorkshop"
                  >
                    <el-input v-model="queryParams.extData.produceWorkshop"
                              disabled
                              clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="生产班组"
                    prop="extData.produceTeam"
                  >
                    <el-input v-model="queryParams.extData.produceTeam" disabled
                              clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="物料类型"
                    prop="extData.materialType"
                  >
                    <el-select v-model="queryParams.extData.materialType" disabled>
                      <el-option v-for="(item,index) in matterTypeList"
                                 :key="index"
                                 :label="item.label" :value="(item.value).toString()"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="物料配比"
                    prop="extData.materialRatio"
                  >
                    <el-input v-model="queryParams.extData.materialRatio" type="number"
                              disabled clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="订单号"
                    prop="extData.orderNumber"
                  >
                    <el-input v-model="queryParams.extData.orderNumber"
                              disabled
                              clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="物料单位"
                    prop="extData.materialUnit"
                  >
                    <el-input v-model="queryParams.extData.materialUnit" disabled
                              clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="代表数量"
                    prop="extData.inNum"
                  >
                    <el-input v-model="queryParams.extData.inNum" disabled
                              clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="生产工艺"
                    prop="extData.produceTechnology"
                  >
                    <el-input v-model="queryParams.extData.produceTechnology"
                              disabled
                              clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="供应商"
                    prop="extData.supplier"
                  >
                    <el-input v-model="queryParams.extData.supplier" disabled
                              clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="品牌"
                    prop="extData.brand"
                  >
                    <el-input v-model="queryParams.extData.brand" disabled
                              clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="品牌产地"
                    prop="extData.brandProducer"
                  >
                    <el-input v-model="queryParams.extData.brandProducer" disabled clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="含氯标识"
                    prop="extData.chlorineLabel"
                  >
                    <el-autocomplete
                      class="inline-input"
                      v-model="queryParams.extData.chlorineLabel"
                      disabled
                      value-key="label"
                      placeholder="请输入内容"
                    ></el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="车牌号"
                    prop="extData.carNumber"
                  >
                    <el-input v-model="queryParams.extData.carNumber" disabled
                              clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="是否需要生成报告"
                    prop="extData.isGenerateReport"
                  >
                    <el-select v-model="queryParams.extData.isGenerateReport"
                               disabled>
                      <el-option v-for="(item,index) in isGenerateReportList"
                                 :key="index"
                                 :label="item.label" :value="item.value+''"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="物料编码"
                    prop="extData.materialCode"
                  >
                    <el-input v-model="queryParams.extData.materialCode"
                              disabled clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="物料描述"
                    prop="extData.materialDescribe"
                  >
                    <el-input v-model="queryParams.extData.materialDescribe"
                              disabled clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="取样地点"
                    prop="extData.samplingPlace"
                  >
                    <el-input v-model="queryParams.extData.samplingPlace"
                              disabled clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="值班主任"
                    prop="extData.dutyDirector"
                  >
                    <el-input v-model="queryParams.extData.dutyDirector" disabled
                              clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="特殊标志"
                    prop="extData.specialSign"
                  >

                    <el-select v-model="queryParams.extData.specialSign" clearable disabled>
                      <el-option v-for="(item,index) in specialSignList"
                                 :key="index"
                                 :label="item.label" :value="item.value"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="备注及处理措施"
                    prop="extData.remark"
                  >
                    <el-input v-model="queryParams.extData.remark" disabled
                              clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="购买单位"
                    prop="extData.purchaseUnitName"
                  >
                    <el-input v-model="queryParams.extData.purchaseUnitName"
                              disabled clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="使用单位"
                    prop="extData.useUnitName"
                  >
                    <el-input v-model="queryParams.extData.useUnitName" disabled
                              clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="规格/型号"
                    prop="extData.specificationModel"
                  >
                    <el-input v-model="queryParams.extData.specificationModel"
                              disabled clearable/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item title="样品信息" name="2">
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    label="样品名称"
                    prop="extData.sampleName"
                  >
                    <el-input v-model="queryParams.extData.sampleName" disabled/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="样品批号"
                    prop="extData.sampleBatch"
                  >
                    <el-input v-model="queryParams.extData.sampleBatch" disabled/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="样品编号"
                    prop="extData.sampleCode"
                  >
                    <el-input v-model="queryParams.extData.sampleCode" disabled/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="取样时间"
                    prop="samplingTime"
                  >
                    <el-date-picker
                      v-model="samplingTime"
                      type="daterange"
                      range-separator="至"
                      disabled
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="生产厂家"
                    prop="extData.manufactorName"
                  >
                    <el-input v-model="queryParams.extData.manufactorName" disabled/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="生产批号"
                    prop="extData.produceBatch"
                  >
                    <el-input v-model="queryParams.extData.produceBatch" disabled/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="取样人员"
                    prop="extData.samplingPersonnel"
                  >
                    <el-input v-model="queryParams.extData.samplingPersonnel" disabled/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="班次"
                    prop="extData.classes"
                  >
                    <el-input v-model="queryParams.extData.classes" disabled/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
        <el-tab-pane label="免检引用数据" name="two">
          <el-table
            :data="listData"
            ref="listData"
            :inline="true"
            class="searchform"
            border
            style="margin-top: 15px"
            :span-method="resultEntryMergeMethod"
          >
            <el-table-column
              type="index"
              width="55"
              label="序号"
              align="center"
            />
            <el-table-column
              prop="reportCode"
              label="报告编号"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="mergeId"
              label="委托编号"
              align="center"
            >
              <template scope="scope">
                {{scope.row.entrustCode}}
              </template>
            </el-table-column>
            <el-table-column
              prop="mergeId"
              label="样品编号"
              align="center"
            >
              <template scope="scope">
                {{scope.row.sampleCode}}
              </template>
            </el-table-column>
            <el-table-column
              prop="mergeId"
              label="检测类别" align="center"
            >
              <template scope="scope">
                {{scope.row.detectTypeStr}}
              </template>
            </el-table-column>
            <el-table-column
              prop="mergeId"
              label="检测项目" align="center"
            >
              <template scope="scope">
                {{scope.row.itemName}}
              </template>
            </el-table-column>
            <el-table-column prop="mergeId" label="检测结果" align="center">
              <template scope="scope">
                {{scope.row.detectResult}}
              </template>
            </el-table-column>
            <el-table-column
              prop="decideResultFlag"
              label="是否合格" align="center">
              <!--                                      38上  40下-->
              <template scope="scope">
                <span v-if="scope.row.decideResultFlag == 1">合格</span>
                <span v-if="scope.row.decideResultFlag == 0">不合格</span>
              </template>
            </el-table-column>
            <el-table-column prop="conclusion" label="判定结论" align="center">
            </el-table-column>
            <el-table-column
              prop="limitDesc"
              label="判定标准要求" align="center">
            </el-table-column>
            <el-table-column
              prop="updateBy"
              label="检测人员" align="center">
            </el-table-column>
            <el-table-column
              prop="mergeId"
              label="结果单位" align="center"
            >
              <template scope="scope">
                {{scope.row.detectResultUnitStr}}
              </template>
            </el-table-column>
            <el-table-column
              prop="mergeId"
              label="方法编号" align="center"
            >
              <template scope="scope">
                {{scope.row.itemCode}}
              </template>
            </el-table-column>
            <el-table-column
              prop="mergeId"
              label="方法名称" align="center"
            >
              <template scope="scope">
                {{scope.row.methodName}}
              </template>
            </el-table-column>
            <el-table-column
              prop="standardType"
              label="执行标准" align="center">
              <template slot-scope="scope">
                {{scope.row.itemDecideLimitList.length ==
                0?'':echoData(scope.row.itemDecideLimitList[0].standardType,standardTypeList)}}
              </template>
            </el-table-column>
            <el-table-column
              prop="productionName"
              label="产品分类" align="center">
              <template slot-scope="scope">
                {{scope.row.itemDecideLimitList.length == 0?'':scope.row.itemDecideLimitList[0].productionName}}
              </template>
            </el-table-column>
            <el-table-column
              prop="standardCode"
              label="执行标准号" align="center">
              <template slot-scope="scope">
                {{scope.row.itemDecideLimitList.length == 0?'':scope.row.itemDecideLimitList[0].standardCode}}
              </template>
            </el-table-column>
            <el-table-column
              prop="standardName"
              label="执行标准名称" align="center">
              <template slot-scope="scope">
                {{scope.row.itemDecideLimitList.length == 0?'':scope.row.itemDecideLimitList[0].standardName}}
              </template>
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注1" align="center"
            >
              <template scope="scope">
                <span>{{scope.row.remark}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="remark1"
              label="备注2" align="center"
            >
              <template scope="scope">
                <span>{{scope.row.remark1}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
  import boContainer from '@/mixins/boContainer'
  import chopper from "@/mixins/chopper";
  import Lang from './Lang'

  export default {
    name: 'materialBuyOrder',
    mixins: [boContainer, chopper],
    data() {
      return {
        Lang,
        supplierList: [],
        currencyList: [],
        queryParams: {
          extData: {
            specificationModel: null,
            useUnitName: null,
            purchaseUnitName: null,
            remark: null,
            specialSign: null,
            dutyDirector: null,
            samplingPlace: null,
            materialDescribe: null,
            materialCode: null,
            isGenerateReport: null,
            carNumber: null,
            chlorineLabel: null,
            brandProducer: null,
            brand: null,
            supplier: null,
            produceTechnology: null,
            inNum: null,
            materialUnit: null,
            orderNumber: null,
            materialRatio: null,
            materialType: null,
            produceTeam: null,
            produceWorkshop: null,
            factoryCode: null,
            entrustType: null,
            samplingTime: null,
            sampleName: null,
            sampleBatch: null,
            manufactorName: null,
            produceBatch: null,
            samplingPersonnel: null,
            samplingTimeStart: null,
            samplingTimeEnd: null,
            classes: null,
          }
        },
        activeNames: ['1', '2'],
        dataList: [],
        ExtDeptCodeList: [],
        activeName: 'first',
        isdisabled: true,
        listData: [],
        samplingTime: [],
        merge: ['itemId'],
        standardTypeList: this.getDictionary('STANDARD_TYPE'),
        matterTypeList: this.getDictionary('business_matterType'),
        entrustTypeList: this.getDictionary('business_entrustType'),
        isGenerateReportList: this.getDictionary('isGenerateReport'),
        ChlorineLabelingList: this.getDictionary('ChlorineLabeling'),
        specialSignList: this.getDictionary('specialSign'),
      }
    },
    mounted() {
      this.getExtDeptCodeList()

    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event)
      },
      // 获取工厂数据
      async getExtDeptCodeList() {
        let getData = await this.$net('/system/dept/getExtDeptCodeList', 'get')
        if (getData.code == 200) {
          this.ExtDeptCodeList = getData.data
          this.ExtDeptCodeList.map((item) => {
            if (this.$store.state.user.userInfo.organizationId == item.deptId) {
              this.queryParams.extData.factoryCode = item.extDeptCode
              this.queryParams.extData.factoryName = item.deptName
              this.factoryCodeDisabled = true
            }
          })
        }
      },
      init(params) {
        console.log(params);
        if (params) {
          this.queryParams = params
          this.listData = params.list
          this.listData.map((item) => {
            if (item.itemDecideLimitList == null) {
              item.itemDecideLimitList = []
            }
            item.limitDesc = item.itemDecideLimitList.map((itemB) => {
              return itemB.limitDesc
            }).join(',')
            item.mergeId = item.sampleId + '-' + item.itemId
          })
          if (this.queryParams.extData.samplingTimeStart && this.queryParams.extData.samplingTimeEnd) {
            this.samplingTime = [this.queryParams.extData.samplingTimeStart, this.queryParams.extData.samplingTimeEnd]
          }
          this.getResultEntryMergeArr(this.listData, this.merge)
        }
      }
    }
  }
</script>


<style scoped lang="less">
  .cell .el-tag {
    background: none;
    border: none;
  }

  .flex {
    display: flex;
  }

  .flexdit {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    background-color: #fff;
    padding-top: 16px;
    border: 1px solid #dfe6ec;
  }

  .pointer {
    cursor: pointer;
  }

  .tabbody {
    background-color: #fff;
    border-bottom: 1px solid #dfe6ec;

    h3 {
      margin-bottom: 0;
      border-left: 1px solid #dfe6ec;
      border-right: 1px solid #dfe6ec;
      padding: 5px 10px;
      font-size: 14px;
      font-weight: bold;
    }

    .pagtion {
      border-left: 1px solid #dfe6ec;
      border-right: 1px solid #dfe6ec;
      position: relative;
      height: 50px;

      .el-pagination {
        position: absolute;
        right: 0;
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
  }

  .pagination-container {
    margin-top: 0;
  }

  .linel {
    border: 1px solid #dfe6ec;
    background-color: #fff;
    margin-top: 10px;
    padding-left: 10px;
    padding-top: 10px;
  }

  /deep/ .el-form--inline .el-form-item {
    width: 100%;

    .el-form-item__content {
      width: calc(100% - 140px);

      .el-date-editor, .el-select--medium, input {
        width: 100%;
      }
    }
  }
</style>
