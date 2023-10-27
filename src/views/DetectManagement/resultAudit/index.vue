<template>
    <div>
        <BoContainer :total="total" ref="BoContainer" @changePage="changePage">
            <template slot="boMain">
                <BoMain>
                    <template slot="botabs">
                        <el-menu
                            :default-active="activeIndex"
                            class="el-menu-demo"
                            mode="horizontal"
                            @select="handleSelect"
                        >
                            <el-menu-item
                                :index="item.id.toString()"
                                v-for="(item,index) in tabConfig" :key="index"
                            >{{ item.configName }}
                            </el-menu-item
                            >
                        </el-menu>
                    </template>
                    <template slot="bosearch">
                        <el-tabs v-model="activeName" @tab-click="handleClick" type="card" v-if="activeIndex == '1'">
                            <el-tab-pane label="按样品" name="first">
                            </el-tab-pane>
                            <el-tab-pane label="按项目" name="second">
                            </el-tab-pane>
                        </el-tabs>
                        <el-form
                            :model="queryParams"
                            ref="queryForm"
                            :inline="true"
                            label-width="100px"
                        >
                            <el-form-item label="样品编号">
                                <el-input
                                    v-model="queryParams.sampleCode"
                                    @keyup.enter.native="searchBtn"
                                    clearable
                                    @clear="searchBtn"
                                    placeholder="请输入搜索"
                                    size="small"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="方法编号" v-if="activeName == 'second'">
                                <el-input
                                    v-model="queryParams.itemCode"
                                    @keyup.enter.native="searchBtn"
                                    clearable
                                    @clear="searchBtn"
                                    placeholder="请输入搜索"
                                    size="small"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="委托编号" v-if="activeName != 'second' && activeIndex == '1'">
                                <el-input
                                    v-model="queryParams.entrustCode"
                                    @keyup.enter.native="searchBtn"
                                    clearable
                                    @clear="searchBtn"
                                    size="small"
                                    placeholder="请输入搜索"
                                >
                                </el-input>
                            </el-form-item>
                            <el-form-item label="检测项目" v-if="activeIndex == '2'">
                                <el-input
                                    v-model="queryParams.itemName"
                                    size="small"
                                    @keyup.enter.native="searchBtn"
                                    clearable
                                    @clear="searchBtn"
                                    placeholder="请输入搜索"
                                >
                                </el-input>
                            </el-form-item>
                            <el-form-item label="审批状态" v-if="activeIndex == '2'">
                                <el-select v-model="queryParams.auditStatus" placeholder="请选择"
                                           clearable @clear="searchBtn"
                                           size="small">
                                    <el-option label="审批通过" value="1"/>
                                    <el-option label="退回" value="2"/>
                                </el-select>
                            </el-form-item>
                            <!--委托日期-->
                            <el-form-item
                                label="委托日期"
                                prop="factoryArea"
                            >
                                <el-date-picker
                                    v-model="entrustDate"
                                    type="daterange"
                                    @change="setentrustDate"
                                    range-separator="至"
                                    value="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="审批日期:" label-width="100px" v-if="activeIndex == '2'">
                                <el-date-picker
                                    v-model="dateRange"
                                    type="datetimerange"
                                    range-separator="-"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    @change="datePickChange"
                                    clearable
                                    @clear="searchBtn"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                            <!-- 统一样式 - 查询区域 按钮 -->
                            <div class="a-c-t-btnarea">
                                <el-form-item>
                                    <el-button
                                        type="primary"
                                        icon="el-icon-search"
                                        size="mini"
                                        @click="searchBtn"
                                    >搜索
                                    </el-button>
                                    <el-button
                                        icon="el-icon-refresh"
                                        size="mini"
                                        @click="ResetBtn"
                                    >重置
                                    </el-button>
                                </el-form-item>
                            </div>
                        </el-form>
                    </template>
                    <template slot="tableArea">
                        <!--                    待审批-->
                        <pending
                            v-if="activeIndex == '1'"
                            :listData="listData"
                            :activeName="activeName"
                            :InspectionTypeList="InspectionTypeList"
                            @handleSelectionChange="handleSelectionChange"
                            @batchApprovalHandle="batchApprovalHandle"
                            @approvalHandle="approvalHandle"
                            @reload="getListData"
                        />
                        <haveApproval
                            v-if="activeIndex == '2'"
                            :listData="listData"
                            :activeName="activeName"
                            :InspectionTypeList="InspectionTypeList"
                            @handleSelectionChange="handleSelectionChange"
                            @auditLogDetail="auditLogDetail"
                            @withdrawalHandle="withdrawalHandle"
                            @resultsDetailsHandle="resultsDetailsHandle"
                            @batchResultsDetailsHandle="batchResultsDetailsHandle"
                            @batchWithdrawalHandle="batchWithdrawalHandle"
                        />
                    </template>
                </BoMain>
            </template>
        </BoContainer>
        <!--        审批-->
        <infoAuditSample
            ref="infoAuditSample"
            v-if="auditShow"
            @cancel="auditShow = false"
            :auditParams="auditParams"
            @reload="auditReload"
        />
        <!--        审批记录-->
        <infoRecords
            :recordsShow.sync="recordsShow"
            :recordsParams="recordsParams"
        />
        <!--        撤回-->
        <infoWithdrawal
            v-if="withdrawalShow"
            :withdrawalShow.sync="withdrawalShow"
            :withdrawalParams="withdrawalParams"
            @func="getListData"
        />
        <!--        详情-->
        <infoResults
            ref="infoResults"
            v-if="resultsShow"
            @close="resultsShow = false"
            :resultsParams="resultsParams"
        />
    </div>
</template>
<script>
    import boContainerMixin from '@/mixins/boContainer'
    import pending from './pending'
    import haveApproval from './haveApproval'
    import infoAuditSample from '@/components/detectionManage/resultsAudit/approvalAudit'
    import infoRecords from '@/components/detectionManage/resultsAudit/approvalRecords'
    import infoWithdrawal from '@/components/detectionManage/resultsAudit/withdrawalApproval'
    import infoResults from '@/components/detectionManage/resultsAudit/resultsDetails'

    export default {
        name: 'resultsAudit',
        mixins: [boContainerMixin],
        components: {
            pending,
            haveApproval,
            infoAuditSample,
            infoResults,
            infoWithdrawal,
            infoRecords
        },
        data() {
            return {
                activeIndex: '1',
                activeName: 'first',
                tabConfig: [
                    {
                        id: 1,
                        configName: '待审批'
                    },
                    {
                        id: 2,
                        configName: '已审批'
                    }
                ],
                InspectionTypeList: [],
                withdrawalParams: {},
                resultsParams: {},
                recordsParams: {},
                total: 0,
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    sampleBatch: '',
                    entrustCode: '',
                    detectType: '',
                    detectCate: '',
                    sampleCode: '',
                    itemName: '',
                    itemCode: '',
                    auditStatus: ''
                },
                entrustDate: null,
                auditShow: false,
                recordsShow: false,
                withdrawalShow: false,
                resultsShow: false,
                auditParams: {},
                listData: [],
                checkData: [],
                dateRange: [],
                ids: []
            }
        },
        created() {
            // 首页路由跳转
            if (this.$route.query.activeName) {
                this.activeIndex = this.$route.query.activeName
                this.activeName = 'second'
                this.queryParams.auditStatus = this.$route.query.status
            }
        },
        mounted() {
            this.InspectionTypeList = this.getDictionary('InspectionType')
            this.getListData()
        },
        methods: {
            // 换页
            changePage(e) {
                this.queryParams.pageNum = e.page
                this.queryParams.pageSize = e.limit
                this.getListData()
            },
            //tab切换事件
            handleSelect(key) {
                console.log(key)
                this.activeIndex = key
                this.ResetBtn()
            },
            handleClick() {
                this.getListData()
            },
            // 搜索 按钮
            searchBtn() {
                this.queryParams.pageNum = 1
                this.queryParams.pageSize = 10
                this.getListData()
            },
            // 重置 按钮
            ResetBtn() {
                this.queryParams = {
                    pageNum: 1,
                    pageSize: 10,
                    sampleBatch: '',
                    entrustCode: '',
                    detectType: '',
                    detectCate: '',
                    sampleCode: '',
                    itemName: '',
                    itemCode: '',
                    auditStatus: ''
                }
                this.entrustDate = null
                this.queryParams.entrustDateStart = ''
                this.queryParams.entrustDateEnd = ''
                this.$nextTick(() => {
                    this.$refs.BoContainer.resetPage()
                })
                this.dateRange = []
                this.queryParams.auditTimeStart = ''
                this.queryParams.auditTimeEnd = ''
                this.getListData()
            },
            // 获取列表数据
            async getListData() {
                let url = ''
                switch (this.activeIndex) {
                    case '1':
                        if (this.activeName == 'first') {
                            url = '/v1/detectSampleItemAudit/sampleList'
                        } else if (this.activeName == 'second') {
                            url = '/v1/detectSampleItemAudit/itemList'
                        }
                        break
                    case '2':
                        url = '/v1/detectSampleItemAudit/auditedList'
                        break
                }
                let getData = await this.$net(url, 'get', this.queryParams)
                if (getData.code == 200) {
                    this.listData = getData.data.list
                    this.total = getData.data.total
                }
            },
            setentrustDate(e) {
                this.entrustDate = e
                if (e) {
                    this.queryParams.entrustDateStart = e[0]
                    this.queryParams.entrustDateEnd = e[1]
                } else {
                    this.queryParams.entrustDateStart = ''
                    this.queryParams.entrustDateEnd = ''
                }
            },
            // 审批 按钮
            async batchApprovalHandle() {
                if (this.checkData.length == 0) {
                    this.$message.info('请至少选择一条记录！')
                    return
                }
                let data = {}
                if (this.activeIndex == 1) {
                    let itemId = this.checkData.map((item) => {
                        let result = {
                            entrustId: item.entrustId,
                            sampleId: item.sampleId
                        }
                        return result
                    })
                    data = {
                        entrustSampleList: itemId
                    }
                } else if (this.activeIndex == 2) {
                    let itemId = this.checkData.map((item) => {
                        let result = {
                            entrustId: item.entrustId,
                            itemId: item.itemId
                        }
                        return result
                    })
                    data = {
                        entrustItemList: itemId
                    }
                }
                let getData = await this.$net('/v1/detectSampleItemAudit/auditResultEntry', 'post', data)
                if (getData.code == 200) {
                    this.auditShow = true
                    this.auditParams.auditData = getData.data
                    this.$nextTick(() => {
                        this.$refs.infoAuditSample.init()
                    })
                }
            },
            //审批 操作
            async approvalHandle(row) {
                let data = {}
                let id = []
                if (this.activeIndex == 1) {
                    id.push({
                        entrustId: row.entrustId,
                        sampleId: row.sampleId
                    })
                    data = {
                        entrustSampleList: id
                    }
                } else if (this.activeIndex == 2) {
                    id.push({
                        entrustId: row.entrustId,
                        itemId: row.itemId
                    })
                    data = {
                        entrustItemList: id
                    }
                }
                let getData = await this.$net('/v1/detectSampleItemAudit/auditResultEntry', 'post', data)
                if (getData.code == 200) {
                    this.auditShow = true
                    this.auditParams.auditData = getData.data
                    this.$nextTick(() => {
                        this.$refs.infoAuditSample.init()
                    })
                }
            },
            //审批记录详情
            async auditLogDetail(row) {
                if (row.id == null) {
                    this.$message.info('暂无审批记录！')
                    return
                }
                let getData = await this.$net(`/v1/detectSampleItemAudit/auditRecordList/${row.id}`, 'get')
                if (getData.code == 200) {
                    this.recordsShow = true
                    this.recordsParams.recordsData = getData.data
                }
            },
            //撤回审批
            async withdrawalHandle(row) {
                let id = []
                id.push(row.id)
                let data = {
                    detectSampleItemIds: id
                }
                let getData = await this.$net('/v1/detectSampleItemAudit/checkListData', 'post', data)
                if (getData.code == 200) {
                    this.withdrawalShow = true
                    this.withdrawalParams.ids = row.id
                }
            },
            //批量撤回审批
            async batchWithdrawalHandle() {
                if (this.checkData.length === 0) {
                    this.$message.info('请至少选择一条记录！')
                    return
                }
                let data = {
                    detectSampleItemIds: this.ids
                }
                let getData = await this.$net('/v1/detectSampleItemAudit/checkListData', 'post', data)
                if (getData.code == 200) {
                    this.withdrawalShow = true
                    this.withdrawalParams.ids = this.ids.join(',')
                }
            },
            //结果详情
            async resultsDetailsHandle(row) {
                let data = {}
                let id = []
                id.push({
                    entrustId: row.entrustId,
                    sampleId: row.sampleId,
                    itemId: row.itemId,
                    detectStatus: row.detectStatus
                })
                data = {
                    entrustSampleItemList: id,
                    status: [row.detectStatus]
                }
                let getData = await this.$net('/v1/detectSampleItemAudit/auditResultEntry', 'post', data)
                if (getData.code == 200) {
                    this.resultsShow = true
                    this.$nextTick(() => {
                        this.$refs.infoResults.init()
                    })
                    this.resultsParams.resultsData = getData.data
                }
            },
            //批量查看结果详情
            async batchResultsDetailsHandle() {
                if (this.checkData.length === 0) {
                    this.$message.info('请至少选择一条记录！')
                    return
                }

                let data = {}
                let itemId = this.checkData.map((item) => {
                    let result = {
                        entrustId: item.entrustId,
                        sampleId: item.sampleId,
                        itemId: item.itemId,
                        detectStatus: item.detectStatus
                    }
                    return result
                })
                data = {
                    entrustSampleItemList: itemId,
                    // 固定传入已完成，已退回状态，适配后台与待审批共用列表
                    status: [40, 50, 60]
                }
                let getData = await this.$net('/v1/detectSampleItemAudit/auditResultEntry', 'post', data)
                if (getData.code == 200) {
                    this.resultsShow = true
                    this.$nextTick(() => {
                        this.$refs.infoResults.init()
                    })
                    this.resultsParams.resultsData = getData.data
                }
            },
            // 设置审核时间
            datePickChange(val) {
                this.dateRange = val
                if (val) {
                    this.queryParams.auditTimeStart = val[0]
                    this.queryParams.auditTimeEnd = val[1]
                } else {
                    this.queryParams.auditTimeStart = ''
                    this.queryParams.auditTimeEnd = ''
                }
            },
            // 审批回调
            auditReload() {
                this.auditShow = false
                this.getListData()
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.checkData = selection
                this.ids = selection.map((item) => {
                    return item.id
                })
                console.log(this.ids)
            }
        }
    }
</script>
<style scoped></style>
