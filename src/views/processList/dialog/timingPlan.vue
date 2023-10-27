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
                        <!--                        计划编号-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['PlanNumber']"
                                prop="planCode"
                            >
                                <el-input v-model="queryParams.planCode"
                                          :placeholder="Lang[lang]['PleaseEnter']" disabled clearable/>
                            </el-form-item>
                        </el-col>
                        <!--                    计划名称-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['PlanName']"
                                prop="planName"
                            >
                                <el-input v-model="queryParams.planName"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          :disabled="isdisabled"
                                          clearable/>
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
                        <!--                    采样点-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['SamplingPoint']"
                                prop="pointId"
                            >
                                <el-select v-model="queryParams.pointId"
                                           :placeholder="Lang[lang]['PleaseSelect']"
                                           :disabled="isdisabled">
                                    <el-option v-for="(item,index) in samplePointList" :key="index"
                                               :label="item.pointName" :value="item.id"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!--                    生产线-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['productionLine']"
                                prop="lineCode"
                            >
                                <el-select v-model="queryParams.lineCode"
                                           :placeholder="Lang[lang]['PleaseSelect']"
                                           :disabled="isdisabled">
                                    <el-option v-for="(item,index) in this.productionLineList"
                                               :key="index"
                                               :label="item.label" :value="item.value"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!--                    实际取样偏移分钟数-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['ActualSamplingOffsetMinutes']"
                                prop="delayMinute"
                            >
                                <el-input v-model="queryParams.delayMinute"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          :disabled="isdisabled"
                                          oninput="value = value.replace(/[^\d]/g,'')"
                                          clearable/>
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
                                    value-format="HH:mm"
                                    format="HH:mm"
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
                        <!--                    是否发酵任务-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['Fermentation']"
                                prop="isFerment"
                            >
                                <el-select v-model="queryParams.isFerment"
                                           :placeholder="Lang[lang]['PleaseSelect']"
                                           :disabled="isdisabled">
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
                                        :disabled="isdisabled"
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
                                    prop="fermentSpan"
                                >
                                    <el-input v-model="queryParams.fermentSpan"
                                              :placeholder="Lang[lang]['PleaseEnter']"
                                              :disabled="isdisabled"
                                              oninput="value = value.replace(/[^\d]/g,'')"
                                              @change="setTime($event,'period')"
                                              style="width: 40%"
                                              clearable/>
                                    <span>小时</span>
                                    <el-input v-model="queryParams.fermentSpanM"
                                              :placeholder="Lang[lang]['PleaseEnter']"
                                              :disabled="isdisabled"
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
                                        :disabled="isdisabled"
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
                        <!--                    计划备注-->
                        <el-col :span="24">
                            <el-form-item
                                :label="Lang[lang]['PlanRemarks']"
                                prop="remark"
                            >
                                <el-input v-model="queryParams.remark"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          :disabled="isdisabled"
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
                                          :disabled="isdisabled"
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
                                          :disabled="isdisabled"
                                          clearable/>
                            </el-form-item>
                        </el-col>
                        <!--                    样品编号规则-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['SampleRumberingRules']"
                                prop="sampleCodeRole"
                            >
                                <el-select v-model="queryParams.sampleCodeRole"
                                           :placeholder="Lang[lang]['PleaseSelect']"
                                           :disabled="isdisabled">
                                    <el-option v-for="(item,index) in SampleCodeRuleList" :key="index"
                                               :label="item.ruleName" :value="item.id"/>
                                </el-select>
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
                                          :disabled="isdisabled"
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
                                          :disabled="isdisabled"
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
                                          :disabled="isdisabled"
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
                                          :disabled="isdisabled"
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
                                           :disabled="isdisabled">
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
                                prop="productDate"
                            >
                                <el-date-picker
                                    :disabled="isdisabled"
                                    v-model="queryParams.productDate"
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
                                prop="saveCondition"
                            >
                                <el-input v-model="queryParams.saveCondition"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          :disabled="isdisabled"
                                          clearable/>
                            </el-form-item>
                        </el-col>
                        <!--                    样品形态-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['SampleMorphology']"
                                prop="sampleShape"
                            >
                                <el-input v-model="queryParams.sampleShape"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          :disabled="isdisabled"
                                          clearable/>
                            </el-form-item>
                        </el-col>
                        <!--                    有效期-->
                        <el-col :span="8">
                            <el-form-item
                                :label="Lang[lang]['termValidity']"
                                prop="sampleExprie"
                            >
                                <el-date-picker
                                    :disabled="isdisabled"
                                    v-model="queryParams.sampleExprie"
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
                                prop="sampleDescription"
                            >
                                <el-input v-model="queryParams.sampleDescription"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          :disabled="isdisabled"
                                          clearable/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="计划排程" name="two">
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
                            <el-table-column :render-header="linefeed" :label="Lang[lang]['Schedule']"
                                             prop="arrangeName"
                                             align="center">
                            </el-table-column>
                            <el-table-column
                                :label="Lang[lang]['Operation']"
                                align="center"
                                width="150"
                            >
                                <template slot-scope="scope">
                                    <!--                    查看-->
                                    <el-button
                                        size="mini"
                                        type="text"
                                        @click="e_see(scope.row)"
                                    >{{Lang[lang]['see']}}
                                    </el-button>
                                    <!--                    下载-->
                                    <el-button
                                        size="mini"
                                        type="text"
                                        @click="e_download(scope.row)"
                                    >{{Lang[lang]['download']}}
                                    </el-button>
                                </template>
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
                                          type="textarea"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          :disabled="isdisabled"
                                          clearable/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="暂停详情" name="four" v-if="this.queryParams.suspendStatus == 3">
                    <el-row>
                        <!--                    撤回原因-->
                        <el-col :span="24">
                            <el-form-item
                                label="暂停原因"
                                prop="suspendReason"
                            >
                                <el-input v-model="queryParams.suspendReason"
                                          type="textarea"
                                          :placeholder="Lang[lang]['PleaseEnter']"
                                          :disabled="isdisabled"
                                          clearable/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-form>
<!--        &lt;!&ndash;        新增检测计划&ndash;&gt;-->
<!--        <seeSchedule-->
<!--            ref="seeSchedule"-->
<!--            v-if="showSeeSchedule"-->
<!--            @cancel="showSeeSchedule = false"-->
<!--        />-->
    </div>
</template>

<script>
    import boContainer from '@/mixins/boContainer'
    // import seeSchedule from '../../../EntrustInspection/scheduledPlan/Dialog/seeSchedule'
    import Lang from './Lang'

    export default {
        mixins: [boContainer],
        // components: { seeSchedule },
        data() {
            return {
                Lang,
                planList: [],
                itemList: [],
                queryParams: {},
                activeName: 'first',
                isdisabled: true,
                showSeeSchedule: false,
                listData: [],
                productionLineList: this.getDictionary('production_line'),
                SampleCodeRuleList: [],
                samplePointList: [],
                InspectionTypeList: this.getDictionary('InspectionType'),
                withdrawalReasonList: this.getDictionary('withdrawalReason')
            }
        },
        mounted() {

        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event)
            },
            init(params) {
                console.log(params)
                if (params) {
                    this.queryParams = params
                    this.listData = this.queryParams.samplingArrangeList
                    this.itemList = this.queryParams.samplingPlanRateList
                    this.planList = this.queryParams.samplingPlanTaskList
                }
                this.getSamplePointList()
                this.getSampleCodeRule()
            },
            // 查看
            e_see(row) {
                this.showSeeSchedule = true
                this.$nextTick(() => {
                    this.$refs.seeSchedule.init(row, this.queryParams)
                })
            },
            // 下载
            async e_download(row) {
                let getData = await this.$net(`/scheduled/plan/viewScheduleTask/download/${this.queryParams.id}`, 'get', { arrangeId: row.id })
                if (getData.code == 200) {
                    console.log(getData)
                    this.downLoadFile(getData.msg)
                }
            },
            // 获取样品编码规则
            async getSampleCodeRule() {
                let params = {
                    ruleType: 'SAMPLE_CODE_PLAN'
                }
                let getData = await this.$net('/base/v1/encodingRule', 'get', params)
                if (getData.code == 200) {
                    this.SampleCodeRuleList = getData.data.list
                }
            },
            // 获取采样点数据
            async getSamplePointList() {
                let getData = await this.$net('/sample/point', 'get')
                if (getData.code == 200) {
                    this.samplePointList = getData.data
                    console.log(this.samplePointList)
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
