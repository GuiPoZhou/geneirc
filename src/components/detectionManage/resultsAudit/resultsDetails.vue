<template>
    <div>
        <BoDialog :diaLogShow="showDialog"
                  diaLogTitle="样品列表"
                  diaLogWidth="70" @close="close">
            <template slot="bologbody">
                <el-form :model="resultsParams" ref="approvalForm" :inline="true" label-width="200px">
                    <el-table v-loading="loading" :data="resultsParams.resultsData"
                              :max-height="mainTableHeight*1.25" border stripe
                              @selection-change="handleSelectionChange" align="center">

                        <el-table-column type="selection" width="55" align="center"/>
                        <el-table-column prop="id" type="index" label="序号" width="55px"/>
                        <el-table-column prop="entrustCode" label="委托编号" :show-overflow-tooltip="true" align="center"/>
                        <!--                    <el-table-column prop="sampleBatch" label="样品批号" :show-overflow-tooltip="true" align="center"/>-->
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
                        <!--                    <el-table-column prop="a" label="执行标准" align="center"/>-->
                        <el-table-column prop="limitDesc" label="判定指标" align="center">
                            <template scope="scope">
                                {{setlimitDesc(scope.row)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="conclusion" label="判定结论" align="center"/>
                        <el-table-column prop="instrumentCount" label="检测仪器" align="center">
                            <template scope="scope">
                                <el-button type="text" @click="instrumentHandle(scope.row)">{{scope.row.instrumentList1
                                    ==
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
                        <el-table-column prop="updateBy" label="录入人员" align="center"/>
                        <el-table-column prop="updateTime" label="录入日期" :show-overflow-tooltip="true" align="center"/>
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
                </el-form>
            </template>
            <template slot="bologfooter">
                <el-button @click="close">取消</el-button>
            </template>
        </BoDialog>
        <infoInst :instrumentShow.sync="instrumentShow" :instrumentParams="instrumentParams"
                  @func="resultsParams.resultsData"/>
        <infoModify :modifyShow.sync="modifyShow" :modifyParams="modifyParams" @func="resultsParams.resultsData"/>
        <fileList :showFileOpen.sync="showFileOpen" :tableData.sync="fileList" :disabled="true"/>
        <!--        添加仪器-->
        <AddInstrument ref="AddInstrument" v-if="showAddInstrument"
                       @cancel="showAddInstrument = false"/>
        <PdfLog ref="PdfLog" v-if="showPdfLog" @cancel="showPdfLog = false"/>
    </div>
</template>
<script>

    import infoInst from '@/components/detectionManage/resultsAudit/instrument'
    import infoModify from '@/components/detectionManage/resultsAudit/modifyRecord'
    import { getEquipmentList, getResultHistoryList } from '@/api/detectionManage/resultsAudit/resultsAudit'
    import fileList from '@/components/detectionManage/resultEntry/fileList'
    import AddInstrument from '@/components/EntrustInspection/addInstrument'
    import PdfLog from '@/components/PdfLog/pdfLog.vue'
    import boContainer from '@/mixins/boContainer'

    export default {
        mixins: [boContainer],
        name: 'resultsDetails',
        components: {
            infoInst,
            infoModify,
            fileList,
            PdfLog,
            AddInstrument
        },
        data() {
            return {
                loading: false,
                showDialog: false,
                showPdfLog: false,
                instrumentShow: false,
                showAddInstrument: false,
                instrumentParams: {},
                modifyShow: false,
                modifyParams: {},
                // 非单个禁用
                single: true,
                // 非多个禁用
                multiple: true,
                //多选框选中的数据
                checkData: [],
                ids: [],

                showFileOpen: false,
                fileList: []
            }
        },
        props: {
            resultsParams: {
                type: Object
            }
        },

        methods: {
            init() {
                this.showDialog = true
            },
            //取消按钮操作
            close() {
                this.showDialog = false
                this.$emit('close')
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.id)
                this.single = selection.length !== 1
                this.multiple = !selection.length
                //多选框选中的数据
                this.checkData = selection
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
            //仪器信息
            instrumentHandle(row) {
                this.showAddInstrument = true
                this.$nextTick(() => {
                    this.$refs.AddInstrument.init(1, row, 'detail')
                })
            },
            //修改记录
            editHisHandle(row) {
                if (row.resultId == null) {
                    this.$message.error('暂无修改记录！')
                    return
                }
                const data = {
                    itemResultId: row.resultId
                }
                getResultHistoryList(data).then(response => {
                        this.modifyShow = true
                        this.modifyParams.modifyData = response.data
                    }
                )
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
            getFile(row) {
                this.fileList = row.itemFileList
                this.showFileOpen = true
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
    .resultsDetails {
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
