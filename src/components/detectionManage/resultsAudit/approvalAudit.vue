<template>
    <div>
        <BoDialog
            :diaLogShow="auditShow"
            diaLogTitle="结果审批"
            diaLogWidth="70%"
            @close="close">
            <template slot="bologbody">

                <el-form :model="queryParams"
                         ref="queryFrom"
                         :inline="true"
                         @submit.native.prevent
                         class="searchform">
                    <el-row>
                        <!--                     检测项目名称-->
                        <el-col :span="8">
                            <el-form-item
                                label="检测项目名称"
                                prop="itemName"
                            >
                                <!--                                <el-input v-model="queryParams.itemName"-->
                                <!--                                          @keyup.enter.native="filterData"-->
                                <!--                                          @blur="filterData"-->
                                <!--                                          @clear="filterData"-->
                                <!--                                          placeholder="请输入"-->
                                <!--                                          clearable/>-->
                                <el-select v-model="queryParams.itemName" @change="filterData" clearable filterable placeholder="请选择">
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
                    </el-row>
                </el-form>
                <el-table v-loading="loading" :data="listData"
                          @selection-change="handleSelectionChange"
                          stripe
                          :max-height="mainTableHeight * 1.25"
                          border align="center">
                    <el-table-column type="selection" width="50" align="center"/>
                    <el-table-column prop="id" type="index" label="序号" width="55px"/>
                    <el-table-column prop="sampleCode" label="样品编号" :show-overflow-tooltip="true" align="center"/>
                    <!--                        <el-table-column prop="sampleBatch" label="样品批号" :show-overflow-tooltip="true" align="center"/>-->
                    <el-table-column prop="applyDetectDate" label="检测日期" :show-overflow-tooltip="true"
                                     align="center"/>
                    <el-table-column prop="detectTypeStr" label="检测类别" align="center">
                    </el-table-column>
                    <el-table-column prop="itemName" label="检测项目" :show-overflow-tooltip="true" align="center"/>
                    <el-table-column prop="detectResult" label="检测结果" align="center"/>
                    <el-table-column prop="detectResultUnitStr" label="结果单位" align="center"/>
                    <el-table-column prop="itemCode" label="方法编号" align="center"/>
                    <el-table-column prop="methodName" label="方法名称" align="center"/>
                    <el-table-column prop="detectLimit" label="方法检出限" align="center"/>
                    <el-table-column prop="detectUnitStr" label="检出限单位" align="center"/>
                    <el-table-column prop="limitDesc" label="判定指标" align="center">
                        <template scope="scope">
                            {{setlimitDesc(scope.row)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="conclusion" label="判定结论" align="center"/>
                    <el-table-column prop="instrumentCount" label="检测仪器" align="center">
                        <template scope="scope">
                            <el-button type="text" @click="instrumentHandle(scope.row)">{{scope.row.instrumentList1 ==
                                null?scope.row.instrumentList1 = []:scope.row.instrumentList1.length }}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="editHisCount" label="修改记录" align="center">
                        <template scope="scope">
                            <a style="color: #1890ff; margin-left: 10px" @click="editHisHandle(scope.row)">{{
                                scope.row.editHisCount }}</a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="auditLog" label="审批记录" align="center">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-info"
                                       @click="auditLogDetail(scope.row)">
                                详情
                            </el-button>
                        </template>
                    </el-table-column>
                    <!--                    原始记录-->
                    <el-table-column
                        prop="updateTime"
                        label="原始记录" align="center"
                    >
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" @click="goReportCode(scope.row)"
                            >原始记录
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <infoOpinion
                    v-if="auditOpinionShow"
                    ref="infoOpinion"
                    :auditOpinionShow.sync="auditOpinionShow"
                    @savereload="e_saveReload"
                />
                <infoInst
                    :instrumentShow.sync="instrumentShow"
                    :instrumentParams="instrumentParams"
                    @func="auditParams.auditData"
                />
                <infoRecords
                    :recordsShow.sync="recordsShow"
                    :recordsParams="recordsParams"
                    @func="auditParams.auditData"
                />
                <infoModify
                    :modifyShow.sync="modifyShow"
                    :modifyParams="modifyParams"
                    @func="auditParams.auditData"
                />
                <fileList :showFileOpen.sync="showFileOpen" :tableData.sync="fileList" :disabled="true"/>
            </template>
            <template slot="bologfooter">
                <el-button type="primary" size="small" @click="passHandle">通过</el-button>
                <el-button type="danger" size="small" @click="backHandle">退回</el-button>
                <el-button @click="close" size="small">取消</el-button>
            </template>
        </BoDialog>
        <!--        添加仪器-->
        <AddInstrument ref="AddInstrument" v-if="showAddInstrument"
                       @cancel="showAddInstrument = false"/>
        <PdfLog ref="PdfLog" v-if="showPdfLog" @cancel="showPdfLog = false"/>
    </div>
</template>
<script>
    import infoOpinion from '@/components/detectionManage/resultsAudit/approvalOpinion'
    import infoInst from '@/components/detectionManage/resultsAudit/instrument'
    import infoRecords from '@/components/detectionManage/resultsAudit/approvalRecords'
    import infoModify from '@/components/detectionManage/resultsAudit/modifyRecord'
    import fileList from '@/components/detectionManage/resultEntry/fileList'
    import AddInstrument from '@/components/EntrustInspection/addInstrument'
    import PdfLog from '@/components/PdfLog/pdfLog.vue'
    import {
        getEquipmentList,
        getResultHistoryList,
        getAuditRecordList
    } from '@/api/detectionManage/resultsAudit/resultsAudit'
    import boContainer from '@/mixins/boContainer'

    export default {
        mixins: [boContainer],
        name: 'approvalAudit',
        components: {
            infoOpinion,
            infoInst,
            infoRecords,
            infoModify,
            fileList,
            AddInstrument,
            PdfLog
        },
        data() {
            return {
                loading: false,
                showPdfLog: false,
                auditOpinionShow: false,
                showAddInstrument: false,
                auditOpinionParams: {},
                instrumentShow: false,
                instrumentParams: {},
                recordsShow: false,
                recordsParams: {},
                modifyShow: false,
                modifyParams: {},
                queryParams: {},
                // 非单个禁用
                single: true,
                // 非多个禁用
                multiple: true,
                //多选框选中的数据
                checkData: [],
                ids: [],
                isFullScreen: true,
                showFileOpen: false,
                fileList: [],
                listData: [],
                auditShow: false,
                itemNameList: []
            }
        },
        props: {
            // auditShow: {
            //     type: Boolean,
            //     default: true
            // },
            auditParams: {
                type: Object
            }
        },
        methods: {
            init() {
                this.auditShow = true
                this.auditParams.auditData.map((item) => {
                    this.listData.push(item)
                })
                let arr = []
                this.auditParams.auditData.map((item) => {
                    let obj = {
                        value: item.itemName,
                        label: item.itemName
                    }
                    arr.push(obj)
                })
                this.itemNameList = this.repeat(arr)
            },
            // 去重
            repeat(arr) {
                for (let i = 0; i < arr.length - 1; i++) {
                    for (let j = 1; j < arr.length; j++) {
                        if (i != j) {
                            if (arr[i].value == arr[j].value) {
                                arr.splice(j, 1)
                                j--
                            }
                        }
                    }
                }
                return arr
            },
            // 查找相同检测项目名称的数据
            filterData() {
                // this.queryParams.itemName = (this.queryParams.itemName).trim()
                let arr = []
                arr = this.auditParams.auditData.filter((item) => {
                    if (this.queryParams.itemName == null || this.queryParams.itemName == '') {
                        return true
                    } else {
                        if (item.itemName == this.queryParams.itemName) {
                            return item
                        }
                    }
                })
                this.listData = arr
            },
            getFile(row) {
                this.fileList = row.itemFileList
                this.showFileOpen = true
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
            e_changeBox(type) {
                this.isFullScreen = type
            },
            /*
             *@author: 焦政
             *@date: 2021-03-01 10:01:50
             *@description:保存
             */
            e_saveReload() {
                this.auditOpinionShow = false
                this.$emit('reload')
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
            //取消按钮操作
            close() {
                this.auditShow = false
                this.$emit('cancel')
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.id)
                this.single = selection.length !== 1
                this.multiple = !selection.length
                //多选框选中的数据
                this.checkData = selection
            },
            //通过
            passHandle() {
                if (this.ids.length == 0) {
                    this.$message({
                        message: '请至少选择一条!',
                        type: 'warning'
                    })
                    return
                }
                this.auditOpinionParams.radio = 1
                this.auditOpinionParams.opinion = '同意'
                this.auditOpinionParams.ids = this.ids.join(',')
                this.auditOpinionShow = true
                this.$nextTick(() => {
                    this.$refs.infoOpinion.init(this.auditOpinionParams, this.checkData)
                })
            },
            //退回
            backHandle() {
                if (this.ids.length == 0) {
                    this.$message({
                        message: '请至少选择一条!',
                        type: 'warning'
                    })
                    return
                }
                this.auditOpinionParams.radio = 2
                this.auditOpinionParams.opinion = ''
                this.auditOpinionParams.ids = this.ids.join(',')
                this.auditOpinionShow = true
                this.$nextTick(() => {
                    this.$refs.infoOpinion.init(this.auditOpinionParams, this.checkData)
                })

            },
            //审批记录详情
            auditLogDetail(row) {
                if (row.id == null) {
                    this.$message.info('暂无审批记录！')
                    return
                }
                getAuditRecordList(row.id).then(response => {
                    this.recordsShow = true
                    this.recordsParams.recordsData = response.data
                })
            },
            //仪器信息
            instrumentHandle(row) {
                row.instrumentList1.map((item) => {
                    item.id = item.instrumentId
                })
                this.showAddInstrument = true
                this.$nextTick(() => {
                    this.$refs.AddInstrument.init(1, row, 'detail')
                })
            },
            //修改记录
            editHisHandle(row) {
                if (row.resultId == null) {
                    this.$message.info('暂无修改记录！')
                    return
                }
                const data = {
                    itemResultId: row.resultId
                }
                getResultHistoryList(data).then(response => {
                    this.modifyShow = true
                    this.modifyParams.modifyData = response.data
                })
            }
        },
        computed: {},
        created() {
        },
        mounted() {
        }
    }
</script>
<style lang="less" scoped>
    .approvalAudit {
        height: 33px;
    }

    /deep/ .dialog-footer {
        // background-color: pink;
        display: flex;
        align-items: center;
        height: 50px;
        line-height: 16px;
        font-size: 16px;

        .left {
            border-right: 2px solid rgb(156, 153, 153);
            padding-right: 10px;

            span {
                color: blue;
            }
        }

        .right {
            display: flex;

            span {
                display: block;
                margin-right: 10px;
            }

            align-items: center;
            margin-left: 10px;
        }
    }
</style>
