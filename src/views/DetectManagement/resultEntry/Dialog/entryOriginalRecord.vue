<template>
    <div>
        <BoDialog :diaLogTitle="showType == 'edit'?'修改':showType == 'detail'?'详情':Lang[lang]['originalRecordTitle']"
                  dia-log-width="74%"
                  :diaLogShow="showLoag"
                  @close="e_close">
            <template slot="bologbody">
                <el-form :model="params"
                         ref="queryFrom"
                         :inline="true"
                         @submit.native.prevent
                         class="searchform">
                    <el-row>
                        <!--                     样品编号-->
                        <el-col :span="6">
                            <el-form-item
                                label="样品编号"
                                prop="sampleCode"
                            >
                                <el-select v-model="params.sampleCode" @change="getDateList" clearable
                                           filterableplaceholder="请选择">
                                    <el-option
                                        v-for="(item,index) in sampleCodeList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!--                     检测项目名称-->
                        <el-col :span="6">
                            <el-form-item
                                label="检测项目名称"
                                prop="itemName"
                            >
                                <el-select v-model="params.itemName" @change="getDateList" clearable filterable
                                           placeholder="请选择">
                                    <el-option
                                        v-for="(item,index) in itemNameList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!--                     判定结论-->
                        <el-col :span="6">
                            <el-form-item
                                label="判定结论"
                                prop="conclusion"
                            >
                                <el-select v-model="params.conclusion" @change="filterData" clearable filterable
                                           placeholder="请选择">
                                    <el-option
                                        v-for="(item,index) in conclusionList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-row>
                    <el-col>
                        <el-button type="primary" size="small" :disabled="isTrue" @click="e_EntryOfOriginalRecords"
                                   v-if="showType != 'detail'">
                            {{Lang[lang]['EntryOfOriginalRecords']}}
                        </el-button>
                        <el-button type="primary" size="small" @click="e_batchEntryOfOriginalRecords"
                                   v-if="showType != 'detail'">
                            {{'批量'+Lang[lang]['EntryOfOriginalRecords']}}
                        </el-button>
                        <el-button type="primary" size="small" @click="batchAddInstrument" v-if="showType != 'detail'">
                            {{Lang[lang]['addInstrument']}}
                        </el-button>
                        <el-button type="primary" size="small" @click="batchEntry" v-if="showType != 'detail'">
                            批量录入结果
                        </el-button>
                        <el-button type="primary" size="small" @click="e_EntryOriginalRecords">
                            录入原始记录
                        </el-button>
                    </el-col>
                </el-row>
                <el-table
                    :data="queryDataList"
                    stripe
                    border
                    style="width: 100%;margin-top: 8px"
                    :max-height="mainTableHeight*1.12"
                    @selection-change="selectionChange"
                >
                    <el-table-column
                        type="selection"
                        width="55"
                        align="center"
                        v-if="showType != 'detail'"
                    />
                    <el-table-column
                        type="index"
                        width="55"
                        align="center"
                        v-if="showType == 'detail'"
                    />
                    <!--                    样品编号-->
                    <el-table-column
                        prop="sampleCode"
                        label="样品编号"
                        align="center"
                        :render-header="linefeed"
                    />
                    <!--                    检测日期-->
                    <el-table-column
                        prop="applyDetectDate" :render-header="linefeed"
                        label="检测日期" align="center"
                    />
                    <!--                    检测类别-->
                    <el-table-column
                        prop="detectTypeStr" :render-header="linefeed"
                        label="检测类别" align="center"
                    >
                    </el-table-column>
                    <!--                    检测项目-->
                    <el-table-column
                        prop="itemName" :render-header="linefeed"
                        :label="Lang[lang]['testItems']" align="center"
                    />
                    <!--                    检测仪器-->
                    <el-table-column
                        prop="date" :render-header="linefeed"
                        :label="Lang[lang]['testInstrument']" align="center"
                    >
                        <template scope="scope">
                            <el-button type="text" @click="instrumentHandle(scope.row)">{{scope.row.instrumentList1 ==
                                null?scope.row.instrumentList1 = []:scope.row.instrumentList1.length }}
                            </el-button>
                        </template>
                    </el-table-column>
                    <!--                    检测结果-->
                    <el-table-column
                        prop="" label="" align="center" width="150"
                    >
                        <template slot="header" scope="scope">
                            <span><span style="color: red">*</span>{{Lang[lang]['testResult']}}</span>
                        </template>
                        <template scope="scope">
                            <el-input v-model="scope.row.detectResult" v-if="showType != 'detail'"
                                      @keyup.enter.native="inputBlurResult(scope.row,scope.$index)"
                                      @input="inputBlurResult(scope.row,scope.$index)"
                                      :ref="'detectResultInput'+scope.$index"
                                      @keyup.up.native="handleUp(scope.$index,'detectResult')"
                                      @keyup.down.native="handleDown(scope.$index,'detectResult')"
                                      @blur="inputBlurResult(scope.row,scope.$index)"></el-input>
                            <span v-if="showType == 'detail'">{{scope.row.detectResult}}</span>
                        </template>
                    </el-table-column>
                    <!--                    分析时间-->
                    <el-table-column
                        prop="analysisTime" :render-header="linefeed"
                        label="分析时间" align="center"
                    >
                        <template scope="scope">
                            <el-date-picker
                                v-model="scope.row.analysisTime"
                                type="datetime"
                                :clearable="false"
                                value="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                @change="setAnalysisTime($event,scope.row,scope.$index)"
                                @focus="getAnalysisTime(scope.row)"
                                @blur="setConclusionList(scope.row)"
                                placeholder="选择日期">
                            </el-date-picker>
                        </template>
                    </el-table-column>
                    <!--                    子项目数量-->
                    <el-table-column
                        prop="itemCountSub" :render-header="linefeed"
                        label="子项目数量" align="center"
                    >
                        <template scope="scope">
                            <el-button type="text" @click="getSubproject(scope.row,scope.$index)">
                                {{scope.row.itemCountSub}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <!--                    结果单位-->
                    <el-table-column
                        prop="detectResultUnitStr" :render-header="linefeed"
                        label="结果单位" align="center"
                    />
                    <!--                    方法编号-->
                    <el-table-column
                        prop="itemCode" :render-header="linefeed"
                        :label="Lang[lang]['methodNo']" align="center"
                    />
                    <!--                    方法名称-->
                    <el-table-column
                        prop="methodName" :render-header="linefeed"
                        :label="Lang[lang]['methodName']" align="center"
                    />
                    <!--                    方法检出限-->
                    <el-table-column
                        prop="detectUnit" :render-header="linefeed"
                        label="方法检出限" align="center"
                    />
                    <!--                    检出限单位-->
                    <el-table-column
                        prop="detectUnitStr" :render-header="linefeed"
                        label="检出限单位" align="center"
                    />
                    <!--                    判定指标-->
                    <el-table-column
                        prop="limitDesc" :render-header="linefeed"
                        :label="Lang[lang]['judgementQuota']" align="center"
                    >
                        <template scope="scope">
                            {{setlimitDesc(scope.row)}}
                        </template>
                    </el-table-column>
                    <!--                    判定结论-->
                    <el-table-column
                        prop="conclusion"
                        :render-header="linefeed"
                        :label="Lang[lang]['judgementConclusion']" align="center"
                    >
                        <!--                                      38上  40下-->
                        <template scope="scope">
                            <el-input v-model="scope.row.conclusion" :ref="'conclusionInput'+scope.$index"
                                      @keyup.up.native="handleUp(scope.$index,'conclusion')"
                                      @keyup.down.native="handleDown(scope.$index,'conclusion')"
                                      @blur="setConclusionList(scope.row)"
                                      v-if="showType != 'detail'"></el-input>
                            <span v-if="showType == 'detail'">{{scope.row.conclusion}}</span>
                        </template>
                    </el-table-column>
                    <!--                    修改记录-->
                    <el-table-column
                        v-if="showType == 'detail'"
                        prop="editHisCount" :render-header="linefeed"
                        label="修改记录" align="center"
                    >
                        <template scope="scope">
                            <a style="color: #1890ff; margin-left: 10px" @click="editHisHandle(scope.row)">{{
                                scope.row.editHisCount }}</a>
                        </template>
                    </el-table-column>
                    <!--                    录入人员-->
                    <el-table-column
                        v-if="showType == 'detail'"
                        prop="updateBy"
                        :render-header="linefeed"
                        label="录入人员" align="center"
                    />
                    <!--                    录入日期-->
                    <el-table-column
                        v-if="showType == 'detail'"
                        prop="updateTime"
                        :render-header="linefeed"
                        label="录入日期" align="center"
                    />
                    <!--                    原始记录-->
                    <el-table-column
                        v-if="showType == 'detail'"
                        prop="updateTime"
                        :render-header="linefeed"
                        label="原始记录" align="center"
                    >
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" @click="goReportCode(scope.row)"
                            >原始记录
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="showType == 'detail' && openType == 'completeSample'"
                        prop=""
                        :render-header="linefeed"
                        label="操作" align="center"
                    >
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" @click="approvalRecord(scope.row)"
                            >审批详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination
                    v-show="total > 0"
                    :total="total"
                    :pageSizes="pageSizes"
                    :page.sync="queryPrarms.pageNum"
                    :limit.sync="queryPrarms.pageSize"
                    @pagination="getDateList"
                />
            </template>
            <template slot="bologfooter">
                <el-button type="primary" size="small" @click="e_saveBtn" v-if="showType != 'detail'">{{
                    Lang[lang]['Submit'] }}
                </el-button>
                <el-button size="small" @click="e_close">{{ Lang[lang]['cancelBtn'] }}</el-button>
            </template>
        </BoDialog>
        <!--        添加仪器-->
        <AddInstrument ref="AddInstrument" v-if="showAddInstrument" @reload="addInstrumentReload"
                       @cancel="showAddInstrument = false"/>
        <!--        ELN打开页面-->
        <ElnIFrame ref="ELNIFrame" v-if="showELNIFrame" @cancel="e_cancelELN"/>
        <!--      仪器信息-->
        <infoInst :instrumentShow.sync="instrumentShow" :instrumentParams="instrumentParams"/>
        <!--      修改记录-->
        <infoModify :modifyShow.sync="modifyShow" :modifyParams="modifyParams"/>
        <!--        批量录入结果-->
        <batchEntryResult ref="batchEntryResult" @hanldeResult="hanldeResult" v-if="showBatchEntryResult"
                          @colse="showBatchEntryResult = false"/>
        <!--        pdf-->
        <PdfLog ref="PdfLog" v-if="showPdfLog" @cancel="showPdfLog = false"/>
        <!--        子项目列表-->
        <SubprojectTable ref="SubprojectTable" @close="showSubprojectTable = false" v-if="showSubprojectTable"
                         @reload="handleSubprojectTable"/>
    </div>
</template>
<script>
    import Lang from './Lang'
    import axios from 'axios'
    import BoContainerMixin from '@/mixins/boContainer'
    import AddInstrument from '@/components/EntrustInspection/addInstrument'
    import PdfLog from '@/components/PdfLog/pdfLog.vue'
    import ElnIFrame from '@/components/detectionManage/resultEntry/elnIFrame'
    import infoInst from '@/components/detectionManage/resultsAudit/instrument'
    import infoModify from '@/components/detectionManage/resultsAudit/modifyRecord'
    import batchEntryResult from './batchEntryResult'
    import SubprojectTable from './SubprojectTable'
    import { getToken } from '@/utils/auth'

    export default {
        mixins: [BoContainerMixin],
        components: {
            AddInstrument,//添加仪器
            ElnIFrame,
            infoInst,
            infoModify,
            PdfLog,
            batchEntryResult,
            SubprojectTable
        },
        data() {
            return {
                showAddInstrument: false,
                showSubprojectTable: false,
                showELNIFrame: false,
                instrumentShow: false,
                showBatchEntryResult: false,
                modifyShow: false,
                showPdfLog: false,
                instrumentParams: {},
                params: { itemName: null },
                modifyParams: {},
                pageSizes: [100, 200, 500],
                total: 0,
                queryPrarms: {
                    pageSize: 100,
                    pageNum: 1,
                    sampleCode: null,
                    itemName: null
                },
                Lang,
                showLoag: false,
                indexData: null,
                listData: [],
                queryDataList: [],
                itemNameList: [],
                sampleCodeList: [],
                conclusionList: [],
                recordConclusionList: [],
                isTrue: true,
                checkData: [],
                analysisTime: null,//保存当前选中的分析时间
                showType: 'add',
                openType: null //判断是否是点击 已完成页签 按样品 中的详情进入该页面
            }
        },
        mounted() {
            // window.document.onkeyup((e) => {
            //     console.log(e)
            // })
        },
        methods: {
            init(params, type, type2) {
                this.openType = type2
                this.showType = type
                this.params = params
                this.showLoag = true
                this.getDateList(1)
            },
            // 向上事件
            handleUp(index, type) {
                if (index == 0) {
                    return
                }
                if (type == 'conclusion') {
                    this.$nextTick(() => {
                        this.$refs[`conclusionInput${index - 1}`].focus()
                    })
                } else {
                    this.$nextTick(() => {
                        this.$refs[`detectResultInput${index - 1}`].focus()
                    })
                }
            },
            // 向下事件
            handleDown(index, type) {
                if (index == this.listData.length - 1) {
                    return
                }
                if (type == 'conclusion') {
                    this.$nextTick(() => {
                        this.$refs[`conclusionInput${index + 1}`].focus()
                    })
                } else {
                    this.$nextTick(() => {
                        this.$refs[`detectResultInput${index + 1}`].focus()
                    })
                }
            },
            // 设置判定指标
            setlimitDesc(row) {
                let obj = ''
                if (row.itemDecideLimitList == null) {
                    obj = ''
                } else if (row.itemDecideLimitList.length == 0) {
                    obj = ''
                } else {
                    obj = row.itemDecideLimitList.map((item) => {
                        return item.limitDesc
                    }).join(',')
                }
                return obj
            },
            // 获取子项目
            async getSubproject(row, index) {
                this.indexData = index
                let getData = await this.$net(`/standard/v1/itemMethods/${row.itemId}`, 'get')
                if (getData.code == 200) {
                    console.log(getData.data.subList)
                    this.showSubprojectTable = true
                    this.$nextTick(() => {
                        this.$refs.SubprojectTable.init(getData.data.subList)
                    })
                }
            },
            // 子项目列表回调
            handleSubprojectTable(data) {
                this.showSubprojectTable = false
                console.log(data)
                let num = null
                data.map((item) => {
                    num += item.testResult * 1
                })
                this.$set(this.queryDataList[this.indexData], 'detectResult', num)
            },
            // 获取列表数据
            async getDateList(type) {
                if (this.showType == 'add') {
                    let getData = await this.$net(`/v1/detectManage/resultEnter/waiting/itemList?pageSize=${this.queryPrarms.pageSize}&pageNum=${this.queryPrarms.pageNum}`, 'post', this.params)
                    if (getData.code == 200) {
                        this.listData = getData.data.list
                        this.queryDataList = getData.data.list
                        this.total = getData.data.total
                    }
                } else {
                    let params = {
                        sampleItemIdList: this.params.join(','),
                        pageSize: 100,
                        pageNum: 1
                    }
                    let getData = await this.$net('v1/detectManage/resultEnter/sampleListDetail', 'get', params)
                    if (getData.code == 200) {
                        this.listData = getData.data.list
                        this.queryDataList = getData.data.list
                        this.total = getData.data.total
                    }
                }
                // 将新查询出来的数据和我本地录入的检测结果的数据进行整合
                this.recordConclusionList.map((item1) => {
                    this.queryDataList.map((item2, index2) => {
                        if (item1.id == item2.id) {
                            this.queryDataList.splice(index2, 1, item1)
                            // this.$set(this.queryDataList[index2],'conclusion',item1.conclusion)
                        }
                    })
                })
                if (type == 1) {
                    let arr1 = []
                    let arr2 = []
                    let arr3 = []
                    this.listData.map((item) => {
                        let obj1 = {
                            value: item.sampleCode,
                            label: item.sampleCode
                        }
                        let obj2 = {
                            value: item.conclusion,
                            label: item.conclusion
                        }
                        let obj3 = {
                            value: item.itemName,
                            label: item.itemName
                        }
                        arr1.push(obj1)
                        arr2.push(obj2)
                        arr3.push(obj3)
                    })
                    this.sampleCodeList = this.repeat(arr1)
                    this.itemNameList = this.repeat(arr3)
                    this.conclusionList = this.repeat(arr2).filter(item => {
                        if (item.value == null || item.value == '') {
                            return false
                        } else {
                            return true
                        }
                    })
                }
                this.filterData()
            },
            // 去重
            repeat(arr) {
                for (let i = 0; i < arr.length - 1; i++) {
                    for (let j = 1; j < arr.length; j++) {
                        if (i != j) {
                            if (arr[i].value == arr[j].value) {
                                arr.splice(j, 1)
                                j--
                            } else if (arr[j].value == '') {
                                arr.splice(j, 1)
                                j--
                            }
                        }
                    }
                }
                return arr
            },
            // 判断表格是否存在空值
            judgeObjectComplete(ObjectValue) {
                let flag = new Boolean()
                flag = true
                for (let i = 0; i < ObjectValue.length; i++) {
                    if (!ObjectValue[i].detectResult) {
                        flag = false
                    }
                }
                return flag
            },
            // 查找相同检测项目名称的数据
            filterData() {
                let arr = []
                arr = this.listData.filter((item) => {
                    if (this.params.conclusion == null || this.params.conclusion == '') {
                        return true
                    } else {
                        if (item.conclusion == this.params.conclusion) {
                            return item
                        }
                    }
                })
                this.queryDataList = arr
            },
            // 获取判定结论数组
            setConclusionList(row) {
                if (this.recordConclusionList.length == 0) {
                    this.recordConclusionList.push(row)
                } else {
                    this.recordConclusionList.map((item, index) => {
                        if (item.id == row.id) {
                            this.recordConclusionList.splice(index, 1, row)
                        } else {
                            this.recordConclusionList.push(row)
                        }
                    })
                }
                let arr2 = []
                this.listData.map((item) => {
                    let obj2 = {
                        value: item.conclusion,
                        label: item.conclusion
                    }
                    arr2.push(obj2)
                })
                this.conclusionList = this.repeat(arr2).filter(item => {
                    console.log(item)
                    if (item.value == null || item.value == '') {
                        return false
                    } else {
                        return true
                    }
                })
            },
            goReportCode(row) {
                if (row.itemFileList == null) {
                    this.$message.info('该项目没有原始记录')
                    return
                }
                this.showPdfLog = true
                this.$nextTick(() => {
                    this.$refs.PdfLog.openInit(row.itemFileList[0].filePath)
                })
            },
            e_close() {
                this.showLoag = false
                this.$emit('cancel')
            },
            // 获取分析时间
            async getAnalysisTime(row) {
                let getData = await this.$net(`/v1/detectManage/resultEnter/checkAnalysisTime/${row.entrustId}/${row.id}`, 'get')
                if (getData.code == 200) {
                    this.analysisTime = getData.msg
                    console.log(getData.msg)
                }
            },
            async setAnalysisTime(e, row, index) {
                console.log(e, row, index)
                if (this.analysisTime != null && row.analysisTime != null) {
                    if (row.detectType == 285) {//水质
                        this.$confirm('是否使用当前选择的分析时间，并覆盖该委托下相同检测项目的分析时间', '提示', {
                            confirmButtonText: '是',
                            cancelButtonText: '否',
                            type: 'warning'
                        }).then(async() => {
                            this.listData.map((item, index) => {
                                if (item.itemName == row.itemName) {
                                    this.$set(this.listData[index], 'analysisTime', row.analysisTime)
                                }
                            })
                            await this.$net(`/v1/detectManage/resultEnter/updateAnalysisTime?entrustId=${row.entrustId}&detectItemId=${row.id}&analysisTime=${row.analysisTime}&type=item`, 'post')
                        }).catch(() => {
                            this.$set(this.listData[index], 'analysisTime', this.analysisTime)
                        })
                    } else if (row.detectType == 284) { //产品
                        this.$confirm('是否使用当前选择的分析时间，并覆盖之前该样品编号下的其他检测项目的分析时间', '提示', {
                            confirmButtonText: '是',
                            cancelButtonText: '否',
                            type: 'warning'
                        }).then(async() => {
                            this.listData.map((item, index) => {
                                if (item.sampleCode == row.sampleCode) {
                                    console.log(1111)
                                    this.$set(this.listData[index], 'analysisTime', row.analysisTime)
                                }
                            })
                            await this.$net(`/v1/detectManage/resultEnter/updateAnalysisTime?entrustId=${row.entrustId}&detectItemId=${row.id}&analysisTime=${row.analysisTime}&type=sample`, 'post')
                        }).catch(() => {
                            this.$set(this.listData[index], 'analysisTime', this.analysisTime)
                        })
                    }
                } else if (this.analysisTime == null && row.analysisTime != null) {
                    if (row.detectType == 285) {//水质
                        this.listData.map((item, index) => {
                            if (item.itemName == row.itemName) {
                                this.$set(this.listData[index], 'analysisTime', row.analysisTime)
                            }
                        })
                        await this.$net(`/v1/detectManage/resultEnter/updateAnalysisTime?entrustId=${row.entrustId}&detectItemId=${row.id}&analysisTime=${row.analysisTime}&type=item`, 'post')
                    } else if (row.detectType == 284) { //产品
                        this.listData.map((item, index) => {
                            if (item.sampleCode == row.sampleCode) {
                                this.$set(this.listData[index], 'analysisTime', row.analysisTime)
                            }
                        })
                        await this.$net(`/v1/detectManage/resultEnter/updateAnalysisTime?entrustId=${row.entrustId}&detectItemId=${row.id}&analysisTime=${row.analysisTime}&type=sample`, 'post')
                    }
                }
            },
            //修改记录
            async editHisHandle(row) {
                if (row.resultId == null) {
                    this.$message.error('暂无修改记录！')
                    return
                }
                const data = {
                    itemResultId: row.resultId
                }
                let getData = await this.$net('/v1/detectSampleItemAudit/resultHistoryList', 'get', data)
                if (getData.code == 200) {
                    this.modifyShow = true
                    this.modifyParams.modifyData = getData.data
                }
            },
            // 选择项发生改变
            selectionChange(select) {
                console.log(select)
                this.checkData = select
                this.isTrue = select.length != 1
            },
            // 已完成 按样品的详情中 查看审批记录
            approvalRecord(row) {
                this.$emit('approvalRecord', row)
            },
            // 提交 按钮
            async e_saveBtn() {
                if (this.checkData.length == 0) {
                    this.$message.info('请选择要进行提交的项目')
                    return
                }
                // 验证列表中的数据是否填写完整
                if (!this.judgeObjectComplete(this.checkData)) {
                    this.$message.warning('提交数据的检测结果存在空值')
                    return
                }
                // 修改仪器的保存字段
                this.checkData.map((item) => {
                    if (item.instrumentList1 != null) {
                        item.instrumentList = item.instrumentList1.map((item2) => {
                            return { detectInstrumentId: item2.id != null ? item2.id : item2.instrumentId }
                        })
                    }
                })
                let params = {
                    saveFlag: 2,
                    waitingEnterList: this.checkData
                }
                let getData = await this.$net('v1/detectManage/resultEnter/waiting/saveResult', 'post', params)
                if (getData.code == 200) {
                    console.log(getData)
                    this.showLoag = false
                    this.$message.success('提交成功')
                    this.$emit('reload')
                }
            },
            // 批量录入结果
            batchEntry() {
                if (this.checkData.length == 0) {
                    this.$message.info('请选择要操作的数据')
                    return
                }
                this.showBatchEntryResult = true
                this.$nextTick(() => {
                    this.$refs.batchEntryResult.init()
                })
            },
            hanldeResult(data) {
                this.showBatchEntryResult = false
                this.listData.map((item) => {
                    this.checkData.map((item2) => {
                        if (item.id == item2.id) {
                            item.detectResult = data.detectResult
                            item.conclusion = data.conclusion
                        }
                    })
                })
            },
            // 按钮批量添加仪器
            batchAddInstrument() {
                if (this.checkData.length == 0) {
                    this.$message.info('请选择要添加仪器的检测项目')
                    return
                }
                this.checkData.forEach((item2) => {
                    item2.instrumentList1.forEach((item) => {
                        item.id = item.instrumentId
                    })
                })
                this.showAddInstrument = true
                this.$nextTick(() => {
                    this.$refs.AddInstrument.init(2, this.checkData)
                })
            },

            //行内添加仪器
            instrumentHandle(row) {
                row.instrumentList1.forEach((item) => {
                    item.id = item.instrumentId
                })
                this.showAddInstrument = true
                this.$nextTick(() => {
                    this.$refs.AddInstrument.init(1, row, this.showType)
                })
            },
            // 添加仪器回调
            addInstrumentReload(type, data, parentData) {
                this.showAddInstrument = false
                if (type == 1) {
                    // 通过点击仪器数量进入仪器页面
                    this.listData.map((item) => {
                        if (parentData.itemId == item.itemId) {
                            item.instrumentList1 = data
                            item.instrumentList1.map((item) => {
                                item.instrumentId = item.id
                            })
                        }
                    })
                } else if (type == 2) {
                    // 通过点击按钮进入仪器页面
                    parentData.map((item2) => {
                        this.listData.map((item) => {
                            if (item.instrumentList1 == null) {
                                item.instrumentList1 = []
                            }
                            if (item2.itemId == item.itemId) {
                                data.map((itemA) => {
                                    itemA.instrumentId = itemA.id
                                    item.instrumentList1.push(itemA)
                                })
                                item.instrumentList1 = this.repeat2(item.instrumentList1)
                            }
                        })
                    })
                }
            },
            // 去重仪器
            repeat2(arr) {
                for (let i = 0; i < arr.length - 1; i++) {
                    for (let j = 1; j < arr.length; j++) {
                        if (i != j) {
                            if (arr[i].id == arr[j].id) {
                                arr.splice(j, 1)
                                j--
                            }
                        }
                    }
                }
                return arr
            },
            // 录入原始记录 按钮
            async e_EntryOfOriginalRecords() {
                let row = this.checkData[0]
                // 当前校验 是否开启ELN
                if (!(await this.checkLinkStatus(row.id))) {
                    return
                }
                // 当前校验 当前项目是否配置模板
                if (!(await this.e_checkProFromELN(row.itemId))) {
                    return
                }
                console.log('aa', row)
                let url = `${window.globalEnv.VUE_APP_ELN_PORTAL}DataEntry/Single?entrustId=${row.entrustId}&detectType=${row.detectType}&batchId=0&checkId=${row.itemId}&detectionId=${row.id}&schemeNum=${row.sampleCode}&checkName=${row.itemName}&editUserId=${this.$store.state.user.userId}&editUserName=${this.$store.state.user.name}`
                url = url.replace(/\#/g, '%23')
                this.showELNIFrame = true
                this.$nextTick(() => {
                    this.$refs.ELNIFrame.init(url)
                })
                // }
            },
            // 录入原始记录
            async e_EntryOriginalRecords() {
                if (this.checkData.length === 0) {
                    this.$message.error('请至少选择一条数据')
                    return
                }
                let idsArr = this.checkData.map((item) => {
                    return item.id
                })
                let entrustIds = this.checkData.map((item) => {
                    return item.entrustId
                }).join(',')
                let ids = idsArr.join(',')
                let getData = await this.$net('v1/originalExcel/pageOffice/originalTemplateRelation', 'post', idsArr)
                if (getData.code == 200) {
                    POBrowser.openWindowModeless(
                        window.globalEnv.VUE_APP_BASE_API +
                        '/v1/originalExcel/pageOffice/readOriginalExcel?userId=' +
                        this.$store.state.user.userId +
                        '&detectSampleItemId=' + ids +
                        '&templateId=' + getData.data.templateId +
                        '&instrumentId=' + '' +
                        '&token=' + getToken() +
                        '&authCode=' + 'MASTER' +
                        '&entrustIds=' + entrustIds,
                        '&width=1440px;height=900px'
                    )
                }
            },
            // 批量录入原始记录
            async e_batchEntryOfOriginalRecords() {
                if (this.checkData.length === 0) {
                    this.$message.error('请至少选择一条数据')
                    return
                }
                // 实验室质控数据同步到ELN 当前接口请求成功才能跳转到ELN
                let ids = this.checkData.map((item) => {
                    return item.id
                }).join(',')
                // 当前校验 是否开启ELN
                if (!(await this.checkLinkStatus(ids))) {
                    return
                }
                let itemIds = this.checkData.map((item) => {
                    return item.itemId
                }).join(',')
                // 当前校验 当前项目是否配置模板
                let checkRes = await this.e_checkProFromELN(itemIds)
                if (checkRes) {
                    let detectionIds = this.checkData.map((item) => {
                        return item.id
                    }).join(',')
                    let url = `${window.globalEnv.VUE_APP_ELN_PORTAL}DataEntry/Mutiple?checkId=${this.checkData[0].itemId}&detectionId=${detectionIds}&editUserId=${this.$store.state.user.userId}&editUserName=${this.$store.state.user.name}`
                    this.showELNIFrame = true
                    this.$nextTick(() => {
                        this.$refs.ELNIFrame.init(url)
                    })
                }
            },
            // 关闭ELN
            async e_cancelELN() {
                this.showELNIFrame = false
                this.getDateList()
            },
            // 校验所选项目是否属于同一个ELN配置
            e_checkProFromELN(ids) {
                return new Promise((resolve, reject) => {
                    let url = `${window.globalEnv.VUE_APP_ELN_API}elnConfig/itemIsInTheSameELN?checkIdsStr=${ids}`
                    axios.get(url).then((re) => {
                        if (re.data.code === 200) {
                            resolve(true)
                        } else {
                            this.$message.error(re.data.msg)
                            resolve(false)
                        }
                    }).catch((err) => {
                        reject(err)
                    })
                })
            },
            // 实验室质控数据同步到ELN 当前接口请求成功才能跳转到ELN
            async checkLinkStatus(ids) {
                let checkRes = await this.$net(
                    `/v1/detectSampleItemResult/syncLabQualitySampleToEln/${ids}`,
                    'get'
                )
                if (checkRes.code == 200) {
                    return true
                } else {
                    this.$message.info(checkRes.msg)
                    return false
                }
            },
            // 判定结论
            inputBlurResult(row, cIndex) {
                if (this.recordConclusionList.length == 0) {
                    this.recordConclusionList.push(row)
                } else {
                    this.recordConclusionList.map((item, index) => {
                        if (item.id == row.id) {
                            this.recordConclusionList.splice(index, 1, row)
                        } else {
                            this.recordConclusionList.push(row)
                        }
                    })
                }
                console.log(row, cIndex)
                this.tabClickIndex = ''
                this.tabClickLabel = ''
                if (!row.detectResult) {
                    return false
                }
                var detectResult = row.detectResult
                var resultIndex = -1
                try {
                    var itemDecideLimitList = row.itemDecideLimitList
                    if (!itemDecideLimitList) {
                        resultIndex = -2
                        throw new Error('EndIterative')
                    }
                    if (itemDecideLimitList.length <= 0) {
                        resultIndex = -2
                        throw new Error('EndIterative')
                    }
                    itemDecideLimitList.forEach((item, index) => {
                        item.upLimit = !isNaN(item.upLimit)
                            ? Number(item.upLimit)
                            : item.upLimit
                        item.lowLimit = !isNaN(item.lowLimit)
                            ? Number(item.lowLimit)
                            : item.lowLimit
                        detectResult = !isNaN(detectResult)
                            ? Number(detectResult)
                            : detectResult
                        console.log(
                            item.compareContent,
                            item.lowLimit,
                            item.upLimit,
                            detectResult
                        )
                        if (item.compareContent == '＜' && detectResult < item.upLimit) {
                            resultIndex = index
                            throw new Error('EndIterative')
                        } else if (
                            item.compareContent == '≤' &&
                            detectResult <= item.upLimit
                        ) {
                            resultIndex = index
                            throw new Error('EndIterative')
                        } else if (
                            item.compareContent == '＞' &&
                            detectResult > item.lowLimit
                        ) {
                            resultIndex = index
                            throw new Error('EndIterative')
                        } else if (
                            item.compareContent == '≥' &&
                            detectResult >= item.lowLimit
                        ) {
                            resultIndex = index
                            throw new Error('EndIterative')
                        } else if (
                            item.compareContent == '＞，＜' &&
                            detectResult > item.lowLimit &&
                            detectResult < item.upLimit
                        ) {
                            resultIndex = index
                            throw new Error('EndIterative')
                        } else if (
                            item.compareContent == '＞，≤' &&
                            detectResult > item.lowLimit &&
                            detectResult <= item.upLimit
                        ) {
                            resultIndex = index
                            throw new Error('EndIterative')
                        } else if (
                            item.compareContent == '≥，＜' &&
                            detectResult >= item.lowLimit &&
                            detectResult < item.upLimit
                        ) {
                            resultIndex = index
                            throw new Error('EndIterative')
                        } else if (
                            item.compareContent == '≥，≤' &&
                            detectResult >= item.lowLimit &&
                            detectResult <= item.upLimit
                        ) {
                            resultIndex = index
                            throw new Error('EndIterative')
                        } else if (
                            item.compareContent == '匹配字符' &&
                            detectResult == item.lowLimit
                        ) {
                            resultIndex = index
                            throw new Error('EndIterative')
                        }
                    })
                } catch (e) {
                    if (e.message != 'EndIterative') throw e
                }
                // console.log(resultIndex, this.tableData[cIndex]);
                if (resultIndex == -2) {
                    this.listData[cIndex].standardName = ''
                    this.listData[cIndex].limitDesc = ''
                    this.listData[cIndex].conclusion = ''
                } else if (resultIndex > -1) {
                    this.listData[cIndex].standardName =
                        itemDecideLimitList[resultIndex].standardName
                    this.listData[cIndex].limitDesc =
                        itemDecideLimitList[resultIndex].limitDesc
                    this.listData[cIndex].conclusion =
                        itemDecideLimitList[resultIndex].decideResult
                } else {
                    this.listData[cIndex].standardName = ''
                    this.listData[cIndex].limitDesc = ''
                    this.listData[cIndex].conclusion = '不合格'
                }
            }
        }
    }
</script>
