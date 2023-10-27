<template>
    <div style="padding: 20px">
        <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            :prop="queryParams"
            label-width="120px">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="基本信息" name="first">
                    <el-collapse v-model="activeNames">
                        <el-collapse v-model="activeNames">
                            <el-collapse-item :title="Lang[lang]['taskInfo']" name="1">
                                <el-row>
                                    <!--                     任务编号   委托编号-->
                                    <el-col :span="8">
                                        <el-form-item
                                            label="委托编号"
                                            prop="entrustCode"
                                        >

                                            <el-input v-model="queryParams.entrustCode"
                                                      :placeholder="Lang[lang]['AutomaticGeneration']" disabled
                                                      clearable/>
                                        </el-form-item>
                                    </el-col>

                                    <!--                   申请公司 委托公司-->
                                    <el-col :span="8">
                                        <el-form-item
                                            label="委托公司"
                                            prop="entrustCompany"
                                        >
                                            <el-input v-model="queryParams.entrustCompany"
                                                      :placeholder="Lang[lang]['PleaseEnter']"
                                                      :disabled="isdisabled"
                                                      clearable/>
                                        </el-form-item>
                                    </el-col>
                                    <!--                   申请部门 委托部门-->
                                    <el-col :span="8">
                                        <el-form-item
                                            label="委托部门"
                                            prop="entrustDepart"
                                        >
                                            <el-input v-model="queryParams.entrustDepart"
                                                      :placeholder="Lang[lang]['PleaseEnter']"
                                                      :disabled="isdisabled"
                                                      clearable/>
                                        </el-form-item>
                                    </el-col>
                                    <!--                   委托公司地址-->
                                    <el-col :span="8" v-if="queryParams.extData.reportType == 2">
                                        <el-form-item
                                            label="委托公司地址"
                                            prop="entrustCompanyAddress"
                                        >
                                            <el-input v-model="queryParams.entrustCompanyAddress"
                                                      :placeholder="Lang[lang]['PleaseEnter']"
                                                      :disabled="isdisabled"
                                                      clearable/>
                                        </el-form-item>
                                    </el-col>
                                    <!--                   邮政编码-->
                                    <el-col :span="8" v-if="queryParams.extData.reportType == 2">
                                        <el-form-item
                                            label="邮政编码"
                                            prop="extData.postCode"
                                        >
                                            <el-input v-model="queryParams.extData.postCode"
                                                      :placeholder="Lang[lang]['PleaseEnter']"
                                                      :disabled="isdisabled"
                                                      clearable/>
                                        </el-form-item>
                                    </el-col>
                                    <!--                   联系电话-->
                                    <el-col :span="8">
                                        <el-form-item
                                            label="联系电话"
                                            prop="extData.contactPhone"
                                        >
                                            <el-input v-model="queryParams.extData.contactPhone"
                                                      :placeholder="Lang[lang]['PleaseEnter']"
                                                      :disabled="isdisabled"
                                                      clearable/>
                                        </el-form-item>
                                    </el-col>
                                    <!--                   监督电话-->
                                    <el-col :span="8" v-if="queryParams.extData.reportType == 2">
                                        <el-form-item
                                            label="监督电话"
                                            prop="extData.supervisePhone"
                                        >
                                            <el-input v-model="queryParams.extData.supervisePhone"
                                                      :placeholder="Lang[lang]['PleaseEnter']"
                                                      :disabled="isdisabled"
                                                      clearable/>
                                        </el-form-item>
                                    </el-col>
                                    <!--                   E-mail-->
                                    <el-col :span="8" v-if="queryParams.extData.reportType == 2">
                                        <el-form-item
                                            label="E-mail"
                                            prop="extData.eMail"
                                        >
                                            <el-input v-model="queryParams.extData.eMail"
                                                      :placeholder="Lang[lang]['PleaseEnter']"
                                                      :disabled="isdisabled"
                                                      clearable/>
                                        </el-form-item>
                                    </el-col>
                                    <!--                   委托人-->
                                    <el-col :span="8">
                                        <el-form-item
                                            label="委托人"
                                            prop="entrustPerson"
                                        >
                                            <el-input v-model="queryParams.entrustPerson"
                                                      :placeholder="Lang[lang]['PleaseEnter']"
                                                      :disabled="isdisabled"
                                                      clearable/>
                                        </el-form-item>
                                    </el-col>
                                    <!--                  申请日期  委托日期-->
                                    <el-col :span="8">
                                        <el-form-item
                                            label="委托日期"
                                            prop="entrustDate"
                                        >
                                            <el-date-picker
                                                :disabled="isdisabled"
                                                v-model="queryParams.entrustDate"
                                                type="date"
                                                value="yyyy-MM-dd"
                                                value-format="yyyy-MM-dd"
                                                :placeholder="Lang[lang]['SelectDate']">
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>

                                    <!--                   测试周期-->
                                    <el-col :span="8" v-if="queryParams.extData.reportType == 2">
                                        <el-form-item
                                            label="测试周期"
                                            prop="extData.testCycle"
                                        >
                                            <el-select v-model="queryParams.extData.testCycle"
                                                       :placeholder="Lang[lang]['PleaseSelect']"
                                                       :disabled="isdisabled">
                                                <el-option v-for="(item,index) in testCycleList"
                                                           :key="index"
                                                           :label="item.label" :value="item.value"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <!--                   任务级别-->
                                    <el-col :span="8" v-if="queryParams.extData.reportType == 1">
                                        <el-form-item
                                            label="任务级别"
                                            prop="extData.testCycle"
                                        >
                                            <el-select v-model="queryParams.extData.testCycle"
                                                       :placeholder="Lang[lang]['PleaseSelect']"
                                                       :disabled="isdisabled">
                                                <el-option v-for="(item,index) in testRequirementList"
                                                           :key="index"
                                                           :label="item.label" :value="item.value"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <!--                   是否评价检测结果-->
                                    <el-col :span="8">
                                        <el-form-item
                                            label="是否评价检测结果"
                                            prop="extData.isEvaluateResult"
                                        >
                                            <el-select v-model="queryParams.extData.isEvaluateResult"
                                                       :placeholder="Lang[lang]['PleaseSelect']"
                                                       :disabled="isdisabled">
                                                <el-option label="是" :value="1"/>
                                                <el-option label="否" :value="0"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <!--                   报告递交方式-->
                                    <el-col :span="8">
                                        <el-form-item
                                            label="报告递交方式"
                                            prop="extData.reportSubmitMode"
                                        >
                                            <el-select v-model="queryParams.extData.reportSubmitMode"
                                                       :placeholder="Lang[lang]['PleaseSelect']"
                                                       :disabled="isdisabled">
                                                <el-option v-for="(item,index) in this.reportSubmitModeList"
                                                           :key="index"
                                                           :label="item.label" :value="item.value"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <!--              任务备注   检测/送检的原因-->
                                    <el-col :span="24">
                                        <el-form-item
                                            label="检测/送检的原因"
                                            prop="extData.detectReason"
                                        >
                                            <el-input v-model="queryParams.extData.detectReason"
                                                      :placeholder="Lang[lang]['PleaseEnter']"
                                                      :disabled="isdisabled"
                                                      clearable/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                            <el-collapse-item title="样品总概" name="2">
                                <el-row>
                                    <!--                    样品编号规则-->
                                    <el-col :span="8">
                                        <el-form-item
                                            :label="Lang[lang]['SampleRumberingRules']"
                                            prop="extData.sampleCodeRule"
                                        >
                                            <el-select v-model="queryParams.extData.sampleCodeRule"
                                                       :disabled="queryParams.itemCategoryList.length == 0 || isdisabled"
                                                       :placeholder="Lang[lang]['PleaseSelect']">
                                                <el-option v-for="(item,index) in SampleCodeRuleList" :key="index"
                                                           :label="item.ruleName" :value="item.id"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <!--                        样品来源-->
                                    <el-col :span="8">
                                        <el-form-item
                                            label="样品来源"
                                            prop="extData.sampleSource"
                                        >
                                            <el-input v-model="queryParams.extData.sampleSource"
                                                      :placeholder="Lang[lang]['PleaseEnter']"
                                                      :disabled="isdisabled"
                                                      clearable/>
                                        </el-form-item>
                                    </el-col>
<!--                                    &lt;!&ndash;                    送样人&ndash;&gt;-->
<!--                                    <el-col :span="8">-->
<!--                                        <el-form-item-->
<!--                                            label="送样人"-->
<!--                                            prop="samplePerson"-->
<!--                                        >-->
<!--                                            <el-input v-model="queryParams.samplePerson"-->
<!--                                                      :placeholder="Lang[lang]['PleaseEnter']"-->
<!--                                                      :disabled="isdisabled"-->
<!--                                                      clearable/>-->
<!--                                        </el-form-item>-->
<!--                                    </el-col>-->
<!--                                    &lt;!&ndash;                    送样日期&ndash;&gt;-->
<!--                                    <el-col :span="8">-->
<!--                                        <el-form-item-->
<!--                                            label="送样日期"-->
<!--                                            prop="sampleDate"-->
<!--                                        >-->
<!--                                            <el-date-picker-->
<!--                                                :disabled="isdisabled"-->
<!--                                                v-model="queryParams.sampleDate"-->
<!--                                                type="datetime"-->
<!--                                                value="yyyy-MM-dd HH:mm"-->
<!--                                                value-format="yyyy-MM-dd HH:mm"-->
<!--                                                :placeholder="Lang[lang]['SelectDate']">-->
<!--                                            </el-date-picker>-->
<!--                                        </el-form-item>-->
<!--                                    </el-col>-->
                                    <!--                    留样处理 是否留样-->
                                    <el-col :span="8">
                                        <el-form-item
                                            label="是否留样"
                                            prop="extData.isSatySample"
                                        >
                                            <el-select v-model="queryParams.extData.isSatySample"
                                                       :placeholder="Lang[lang]['PleaseSelect']"
                                                       :disabled="isdisabled">
                                                <el-option label="是" :value="1"/>
                                                <el-option label="否" :value="0"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <!--                    样品处置-->
                                    <el-col :span="8">
                                        <el-form-item
                                            label="样品处置"
                                            prop="extData.sampleHandle"
                                        >
                                            <el-select v-model="queryParams.extData.sampleHandle"
                                                       :placeholder="Lang[lang]['PleaseSelect']"
                                                       :disabled="isdisabled">
                                                <el-option v-for="(item,index) in this.sampleHandleList"
                                                           :key="index"
                                                           :label="item.label" :value="item.value"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <!--                    留样时间-->
                                    <el-col :span="8">
                                        <el-form-item
                                            label="留样时间"
                                            prop="extData.satySample"
                                        >
                                            <el-date-picker
                                                :disabled="isdisabled"
                                                v-model="queryParams.extData.satySample"
                                                type="date"
                                                value="yyyy-MM-dd"
                                                value-format="yyyy-MM-dd"
                                                :placeholder="Lang[lang]['SelectDate']">
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <!--                   检测项目类别-->
                                    <el-col :span="8">
                                        <el-form-item
                                            label="检测类别"
                                            prop="itemCategoryList"
                                        >
                                            <el-cascader :options="options" style="width: 100%;"
                                                         :props="{ multiple: true}"
                                                         v-model="queryParams.itemCategoryList"
                                                         :show-all-levels="false"
                                                         :disabled="isdisabled">
                                                <template slot-scope="{ node, data }">
                                                    <span>{{ data.label }}</span>
                                                </template>
                                            </el-cascader>
                                        </el-form-item>
                                    </el-col>
                                    <!--                        执行标准-->
                                    <el-col :span="8">
                                        <el-form-item
                                            label="执行标准"
                                            prop="extData.decideStandard"
                                        >
                                            <el-input v-model="queryParams.extData.decideStandard"
                                                      :placeholder="Lang[lang]['PleaseEnter']"
                                                      :disabled="isdisabled"
                                                      clearable/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                        </el-collapse>
                    </el-collapse>
                </el-tab-pane>
                <el-tab-pane label="样品信息" name="two">
                    <el-row>
                        <el-table
                            :data="sampleListData"
                            ref="sampleListData"
                            reportSubmitMode        :inline="true"
                            class="searchform"
                            style="margin-top: 15px"
                            :empty-text="Lang[lang]['NoDataTemporarily']"
                        >
                            <el-table-column type="index" width="65" :label="Lang[lang]['seriaNumber']"
                                             align="center"/>
                            <!--                            样品名称-->
                            <el-table-column :render-header="linefeed" :label="Lang[lang]['sampleName']"
                                             prop="sampleName" align="center">
                            </el-table-column>
                            <!--                            样品编号-->
                            <el-table-column :render-header="linefeed" :label="Lang[lang]['sampleNo']"
                                             prop="sampleCode" align="center">
                            </el-table-column>
                            <!--                            样品规格-->
                            <el-table-column :render-header="linefeed" :label="Lang[lang]['sampleSpecification']"
                                             prop="sampleSpecifications" align="center">
                            </el-table-column>
                            <!--                            样品描述-->
                            <el-table-column :render-header="linefeed" :label="Lang[lang]['Sampledescription']"
                                             prop="sampleDescribe" align="center">
                            </el-table-column>
                            <!--                            样品数量-->
                            <el-table-column :render-header="linefeed" :label="Lang[lang]['sampleNumber']"
                                             prop="sampleNumber" align="center">
                            </el-table-column>
                            <!--                            取样日期-->
                            <el-table-column :render-header="linefeed" label="取样日期"
                                             prop="samplingDate" align="center">
                            </el-table-column>
                            <!--                            检测项目-->
                            <el-table-column :render-header="linefeed" :label="Lang[lang]['TestItems']"
                                             prop="itemNamesStr" align="center">
                            </el-table-column>
                            <el-table-column :label="Lang[lang]['Operation']" width="150" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="e_see(scope.row)">{{
                                        Lang[lang]['see']
                                        }}
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
                                prop="entrustRemark"
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
<!--        <SampleInfoDetail-->
<!--            ref="SampleInfoDetail"-->
<!--            v-if="showSampleInfoDetail"-->
<!--            :visible="showSampleInfoDetail"-->
<!--            @cancel="showSampleInfoDetail = false"-->
<!--        />-->
    </div>
</template>

<script>
    import boContainer from '@/mixins/boContainer'
    // import SampleInfoDetail from '../../../EntrustInspection/entrustInspection/Dialog/SampleInfoDetail'
    import Lang from './Lang'

    export default {
        mixins: [boContainer],
        // components: { SampleInfoDetail },
        data() {
            return {
                Lang,
                supplierList: [],
                activeNames: ['1', '2'],
                currencyList: [],
                queryParams: {
                    extData: {
                        reportType: null
                    }
                },
                dataList: [],
                options: this.$store.state.foxconn.itemCategoryList,
                activeName: 'first',
                isdisabled: true,
                showSampleInfoDetail: false,
                sampleListData: [],
                SampleCodeRuleList: [], //样品编码数组
                reportSubmitModeList: this.getDictionary('reportSubmitMode'),
                testCycleList: this.getDictionary('testCycle'),
                testRequirementList: this.getDictionary('test_requirements'),
                reportTypeList: this.getDictionary('reportType'),
                sampleHandleList: this.getDictionary('sampleHandle')//委托-样品处置
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
                    this.sampleListData = params.entrustSamples
                    if (this.queryParams.itemCategoryList == undefined) {
                        this.queryParams.itemCategoryList = []
                    }
                    params.extData.itemCategoryList.map((item) => {
                        let arr = [item.parentValue, item.value]
                        this.queryParams.itemCategoryList.push(arr)
                    })
                }
                console.log(this.queryParams.itemCategoryList)
                console.log(this.options)
                this.getSampleCodeRule()
            },
            // 获取样品编码规则
            async getSampleCodeRule() {
                let getData = await this.$net('/base/v1/encodingRule?ruleType=SAMPLE_CODE', 'get')
                if (getData.code == 200) {
                    console.log(getData)
                    this.SampleCodeRuleList = getData.data.list
                }
            },
            // 查看样品详情
            e_see(row) {
                this.showSampleInfoDetail = true
                this.$nextTick(() => {
                    this.$refs.SampleInfoDetail.init('see', row, this.queryParams, 'Approval')
                })
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
