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
                    <span>任务信息</span>
                    <el-row>
                        <!--                        任务编号-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['taskNumber']"
                                prop="taskCode"
                            >

                                <el-input v-model="queryParams.taskCode"
                                          placeholder="系统自动生成" disabled clearable/>
                            </el-form-item>
                        </el-col>
                        <!--                    任务名称-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['taskName']"
                                prop="taskName"
                            >
                                <el-input v-model="queryParams.taskName"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          disabled
                                          clearable/>
                            </el-form-item>
                        </el-col>
                        <!--                    任务日期-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['taskDate']"
                                prop="taskDate"
                            >
                                <el-date-picker
                                    disabled
                                    v-model="queryParams.taskDate"
                                    type="date"
                                    value="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    :placeholder="Lang[lang]['SelectDate']">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <!--                    采样点-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['SamplingPoint']"
                                prop="samplingPointId"
                            >
                                <el-select v-model="queryParams.samplingPointId"
                                           :placeholder="Lang[lang]['PleaseSelect']"
                                           disabled>
                                    <el-option v-for="(item,index) in samplePointList" :key="index"
                                               :label="item.pointName" :value="item.id"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!--                    生产线-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['productionLine']"
                                prop="productionLineId"
                            >
                                <el-select v-model="queryParams.productionLineId"
                                           :placeholder="Lang[lang]['PleaseSelect']"
                                           disabled>
                                    <el-option v-for="(item,index) in this.productionLineList"
                                               :key="index"
                                               :label="item.label" :value="item.value"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!--                    开始采样日期-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['StartSamplingDate']"
                                prop="samplingStartDate"
                            >
                                <el-date-picker
                                    disabled
                                    v-model="queryParams.samplingStartDate"
                                    type="date"
                                    value="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    :placeholder="Lang[lang]['SelectDate']">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <!--                    开始采样时间-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['StartSamplingTime']"
                                prop="samplingStartTime"
                            >
                                <el-time-picker
                                    :picker-options="{
                                                        selectableRange: '00:00:00 - 23:59:59'
                                                    }"
                                    disabled
                                    value-format="HH:mm:ss"
                                    format="HH:mm:ss"
                                    v-model="queryParams.samplingStartTime"
                                    :placeholder="Lang[lang]['SelectDate']"
                                >
                                </el-time-picker>
                            </el-form-item>
                        </el-col>
                        <!--                    采样时间段-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['SamplingPeriod']+'/h'"
                                prop="samplingSpan"
                            >
                                <el-input v-model="queryParams.samplingSpan"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          disabled
                                          oninput="value = value.replace(/[^\d]/g,'')"
                                          clearable/>
                            </el-form-item>
                        </el-col>
                        <!--                    实际采样时间-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['ActualSamplingTime']"
                                prop="samplingActualTime"
                            >
                                <el-date-picker
                                    disabled
                                    v-model="queryParams.samplingActualTime"
                                    type="datetime"
                                    value="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    :placeholder="Lang[lang]['SelectDate']">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <!--                    任务次-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['TasksTimes']"
                                prop="taskTimes"
                            >
                                <el-input v-model="queryParams.taskTimes"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          disabled/>
                            </el-form-item>
                        </el-col>
                        <!--                    是否发酵任务-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['Fermentation']"
                                prop="isFerment"
                            >
                                <el-select v-model="queryParams.isFerment"
                                           :placeholder="Lang[lang]['PleaseSelect']"
                                           disabled>
                                    <el-option label="是" :value="1"/>
                                    <el-option label="否" :value="0"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" v-if="queryParams.isFerment == '1'">
                            <!--                    发酵开始时间-->
                            <el-col :span="8">
                                <el-form-item
                                    :label="Lang[lang]['FermentationStartTime']"
                                    prop="fermentStartTime"
                                >
                                    <el-date-picker
                                        disabled
                                        v-model="queryParams.fermentStartTime"
                                        type="datetime"
                                        value="yyyy-MM-dd HH:mm"
                                        value-format="yyyy-MM-dd HH:mm"
                                        @change="setTime($event,'start')"
                                        :placeholder="Lang[lang]['SelectDate']">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <!--                    发酵时长-->
                            <el-col :span="8">
                                <el-form-item
                                    label="发酵时长"
                                    prop=""
                                >
                                    <el-input v-model="queryParams.fermentSpan"
                                              :placeholder="Lang[lang]['PleaseEnter']"
                                              disabled
                                              oninput="value = value.replace(/[^\d]/g,'')"
                                              @change="setTime($event,'period')"
                                              style="width: 40%"
                                              clearable/>
                                    <span>小时</span>
                                    <el-input v-model="queryParams.fermentSpanM"
                                              :placeholder="Lang[lang]['PleaseEnter']"
                                              disabled
                                              style="width: 40%"
                                              oninput="value = value.replace(/[^\d]/g,'')"
                                              @change="setTime($event,'period')"
                                              clearable/>
                                    <span>分钟</span>
                                </el-form-item>
                            </el-col>
                            <!--                    发酵结束时间-->
                            <el-col :span="8">
                                <el-form-item
                                    :label="Lang[lang]['FermentationEndTime']"
                                    prop="fermentEndTime"
                                >
                                    <el-date-picker
                                        disabled
                                        v-model="queryParams.fermentEndTime"
                                        type="datetime"
                                        value="yyyy-MM-dd HH:mm"
                                        value-format="yyyy-MM-dd HH:mm"
                                        @change="setTime($event,'end')"
                                        :placeholder="Lang[lang]['SelectDate']">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-col>
                        <!--                    任务备注-->
                        <el-col :span="24">
                            <el-form-item
                                :label="Lang[lang]['taskNotes']"
                                prop="taskRemark"
                            >
                                <el-input v-model="queryParams.taskRemark"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          disabled
                                          clearable/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <span>样品信息</span>
                    <el-row>
                        <!--                        样品名称-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['sampleName']"
                                prop="sampleName"
                            >
                                <el-input v-model="queryParams.sampleName"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          disabled
                                          clearable/>
                            </el-form-item>
                        </el-col>
                        <!--                    样品批号-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['sampleBatchNumber']"
                                prop="sampleBatch"
                            >
                                <el-input v-model="queryParams.sampleBatch"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          disabled
                                          clearable/>
                            </el-form-item>
                        </el-col>
                        <!--                    样品编号-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['sampleNo']"
                                prop="sampleCode"
                            >

                                <el-input v-model="queryParams.sampleCode"
                                          placeholder="系统自动生成" disabled clearable/>
                            </el-form-item>
                        </el-col>
                        <!--                    样品数量-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['sampleNumber']"
                                prop="sampleNumber"
                            >
                                <el-input v-model="queryParams.sampleNumber"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          disabled
                                          oninput="value = value.replace(/[^\d]/g,'')"
                                          clearable/>
                            </el-form-item>
                        </el-col>
                        <!--                    数量单位-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['quantityUnit']"
                                prop="numberUnit"
                            >
                                <el-input v-model="queryParams.numberUnit"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          disabled
                                          clearable/>
                            </el-form-item>
                        </el-col>
                        <!--                    样品规格-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['sampleSpecification']"
                                prop="sampleSize"
                            >
                                <el-input v-model="queryParams.sampleSize"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          disabled
                                          clearable/>
                            </el-form-item>
                        </el-col>
                        <!--                    检验数量-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['inspectionQuantity']"
                                prop="detectNumber"
                            >
                                <el-input v-model="queryParams.detectNumber"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          disabled
                                          oninput="value = value.replace(/[^\d]/g,'')"
                                          clearable/>
                            </el-form-item>
                        </el-col>
                        <!--                    检验类型-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['InspectionType']"
                                prop="detectType"
                            >
                                <el-select v-model="queryParams.detectType"
                                           :placeholder="Lang[lang]['PleaseSelect']"
                                           disabled>
                                    <el-option v-for="(item,index) in this.InspectionTypeList"
                                               :key="index"
                                               :label="item.label" :value="item.value"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!--                    生产日期-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['manufactureDate']"
                                prop="manufactureDate"
                            >
                                <el-date-picker
                                    disabled
                                    v-model="queryParams.manufactureDate"
                                    type="date"
                                    value="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    :placeholder="Lang[lang]['SelectDate']">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <!--                    保存条件-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['StorageConditions']"
                                prop="saveConditionId"
                            >
                                <el-input v-model="queryParams.saveCondition"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          disabled
                                          clearable/>
                            </el-form-item>
                        </el-col>
                        <!--                    样品形态-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['SampleMorphology']"
                                prop="sampleStatus"
                            >
                                <el-input v-model="queryParams.sampleStatus"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          disabled
                                          clearable/>
                            </el-form-item>
                        </el-col>
                        <!--                    有效期-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['termValidity']"
                                prop="termValidity"
                            >
                                <el-date-picker
                                    disabled
                                    v-model="queryParams.termValidity"
                                    type="date"
                                    value="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    :placeholder="Lang[lang]['SelectDate']">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <!--                    样品描述-->
                        <el-col :span="24">
                            <el-form-item
                                :label="Lang[lang]['Sampledescription']"
                                prop="sampleDescribe"
                            >
                                <el-input v-model="queryParams.sampleDescribe"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          disabled
                                          clearable/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="检测项目" name="two">
                    <el-row>
                        <el-table
                            :data="listData"
                            ref="listData"
                            :inline="true"
                            class="searchform"
                            style="margin-top: 15px"
                            :empty-text="Lang[lang]['NoDataTemporarily']"
                        >
                            <el-table-column type="index" width="65" :label="Lang[lang]['seriaNumber']"
                                             align="center"/>
                            <!--                            检测项目-->
                            <el-table-column :render-header="linefeed" :label="Lang[lang]['TestItemName']"
                                             prop="itemName" align="center">
                            </el-table-column>
                            <!--                            方法编号-->
                            <el-table-column :render-header="linefeed" :label="Lang[lang]['MethodCode']"
                                             prop="methodCode" align="center">
                            </el-table-column>
                            <!--                            方法名称-->
                            <el-table-column :render-header="linefeed" :label="Lang[lang]['MethodName']"
                                             prop="methodName" align="center">
                            </el-table-column>
                            <!--                            执行标准号-->
                            <el-table-column :render-header="linefeed" label="执行标准号"
                                             prop="standardCode" align="center">
                                <template scope="scope">
                                    <span>{{( scope.row.standardCode != undefined ?scope.row.standardCode:scope.row.itemLimitList != undefined) ?(scope.row.itemLimitList.length != 0?scope.row.itemLimitList[0].standardCode:''):''}}</span>
                                </template>
                            </el-table-column>
                            <!--                            检测岗位-->
                            <el-table-column :render-header="linefeed" :label="Lang[lang]['TestingPost']"
                                             prop="detectDept" align="center">
                            </el-table-column>
                        </el-table>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="撤回详情" name="three" v-if="this.queryParams.withdrawalStatus == 3">
                    <el-row>
                        <!--                    撤回原因-->
                        <el-col :span="8">
                            <el-form-item
                                label="撤回原因"
                                prop="detectType"
                            >
                                <el-select v-model="queryParams.withdrawalReason"
                                           :placeholder="Lang[lang]['PleaseSelect']"
                                           :disabled="isdisabled">
                                    <el-option v-for="(item,index) in this.withdrawalReasonList"
                                               :key="index"
                                               :label="item.label" :value="item.value"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!--                    任务-->
                        <el-col :span="24">
                            <el-form-item
                                label="备注"
                                prop="taskRemark"
                            >
                                <el-input v-model="queryParams.withdrawalRemark"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          :disabled="isdisabled"
                                          clearable/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </div>
</template>

<script>
    import boContainer from '@/mixins/boContainer'
    import Lang from './Lang'

    export default {
        name: 'materialBuyOrder',
        mixins: [boContainer],
        data() {
            return {
                Lang,
                supplierList: [],
                currencyList: [],
                samplePointList: [],
                queryParams: {},
                dataList: [],
                activeName: 'first',
                isdisabled: true,
                listData: [],
                InspectionTypeList: this.getDictionary('InspectionType'),
                productionLineList: this.getDictionary('production_line'),
                withdrawalReasonList: this.getDictionary('withdrawalReason')
            }
        },
        mounted() {
            this.getSamplePointList()
        },
        methods: {
            // 获取采样点数据
            async getSamplePointList() {
                let getData = await this.$net('/sample/point', 'get')
                if (getData.code == 200) {
                    console.log(getData)
                    this.samplePointList = getData.data
                }
            },
            handleClick(tab, event) {
                console.log(tab, event)
            },
            init(params) {
                console.log(params)
                if (params) {
                    this.queryParams = params
                    this.listData = params.entrustItem
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
