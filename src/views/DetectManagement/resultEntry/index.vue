<template>
    <div>
        <BoContainer :total="total" ref="BoContainer" @changePage="changePage">
            <template slot="boMain">
                <BoMain ref="BoMain">
                    <template slot="botabs">
                        <el-menu :default-active="businessCurrentTab" class="el-menu-demo" mode="horizontal"
                                 @select="selectMenu">
                            <el-menu-item :index="(item.value).toString()"
                                          v-for="item in Lang[lang]['businessTabList']">
                                <template slot="title">
                                    <div class="fontImage">
                                        {{ item.label }}
                                        <div class="iconarea"
                                             v-if="(item.value == 2 && isSign) || (item.value == 0 && isHaveDate)">
                                            <i></i>
                                        </div>
                                    </div>
                                </template>
                            </el-menu-item>
                        </el-menu>
                    </template>
                    <template slot="bosearch">
                        <el-radio-group v-if="businessCurrentTab != 2" size="medium" v-model="typeTabName"
                                        @change="handleClick">
                            <el-radio-button v-for="(v,i) in Lang[lang]['typeTabList']" :key="i" :label="v.value">
                                {{v.label}}
                            </el-radio-button>
                        </el-radio-group>
                        <el-form :model="queryParams"
                                 ref="queryFrom"
                                 :inline="true"
                                 class="searchform"
                                 style="margin-top: 15px"
                        >
                            <div class="intBor">
                                <!--任务编号-->
                                <el-form-item
                                    label="委托编号"
                                    prop="entrustCode"
                                    v-if="typeTabName == 1 || businessCurrentTab == 2"
                                >
                                    <el-input v-model="queryParams.entrustCode" @keyup.enter.native="searchBtn"
                                              clearable @clear="searchBtn"/>
                                </el-form-item>
                            </div>
                            <div class="intBor">
                                <!--样品编号-->
                                <el-form-item
                                    :label="Lang[lang]['sampleCode']"
                                    prop="sampleCode"
                                >
                                    <el-input v-model="queryParams.sampleCode" @keyup.enter.native="searchBtn"
                                              clearable
                                              @clear="searchBtn"/>
                                </el-form-item>
                            </div>
                            <div class="intBor">
                                <!--方法编号-->
                                <el-form-item
                                    label="方法编号"
                                    prop="itemCode"
                                    v-if="typeTabName=='2' && businessCurrentTab != 2"
                                >
                                    <el-input v-model="queryParams.itemCode" @keyup.enter.native="searchBtn"
                                              clearable
                                              @clear="searchBtn"/>
                                </el-form-item>
                            </div>
                            <div class="intBor">
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
                            </div>
                            <div class="intBor" v-if="businessCurrentTab == 2">
                                <!--录入日期-->
                                <el-form-item
                                    :label="Lang[lang]['entryTime']"
                                    prop="entryTime"
                                >
                                    <el-date-picker
                                        v-model="entryTime"
                                        type="daterange"
                                        value="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"
                                        range-separator="至"
                                        @change="setEntryTime"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                            <el-form-item>
                                <el-button type="primary" size="mini" icon="el-icon-search" @click="searchBtn"
                                >{{ Lang[lang]['serachBtn'] }}
                                </el-button>
                                <el-button size="mini" icon="el-icon-refresh" @click="ResetBtn"
                                >{{ Lang[lang]['resetBtn'] }}
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </template>
                    <template slot="tableArea">
                        <!--                        &lt;!&ndash;待接收 按样品&ndash;&gt;-->
                        <!--                        <ReceiveSampleTable-->
                        <!--                            v-if="businessCurrentTab == 0 && typeTabName=='1'"-->
                        <!--                            @handleSelectionChange="handleSelectionChange"-->
                        <!--                            @batchReceiveTask="handleSampleReceivedTasks"-->
                        <!--                            @batchReturnTask="handleSampleReturnTasks"-->
                        <!--                            @ReceiveTask="handleSampleReceivedTask"-->
                        <!--                            @ReturnTask="handleSampleReturnTask"-->
                        <!--                            :listData="listData"-->
                        <!--                            :InspectionTypeList="InspectionTypeList"-->
                        <!--                        />-->
                        <!--                        &lt;!&ndash;待接收  按项目&ndash;&gt;-->
                        <!--                        <ReceiveItemTable-->
                        <!--                            v-if=" businessCurrentTab == 0 && typeTabName=='2'"-->
                        <!--                            @handleSelectionChange="handleSelectionChange"-->
                        <!--                            @batchReceiveTask="handleItemReceivedTasks"-->
                        <!--                            @batchReturnTask="handleItemReturnTasks"-->
                        <!--                            @ReceiveTask="handleItemReceivedTask"-->
                        <!--                            @ReturnTask="handleItemReturnTask"-->
                        <!--                            :listData="listData"-->
                        <!--                        />-->
                        <!--待录入 按样品-->
                        <WaitTable
                            v-if="businessCurrentTab == 1 && typeTabName=='1'"
                            @handleSelectionChange="handleSelectionChange"
                            @batchRecordEntry="e_sampleBatchRecordEntry"
                            @ResultEntry="e_sampleResultEntry"
                            :listData="listData"
                            :InspectionTypeList="InspectionTypeList"
                        />
                        <!--待录入  按项目-->
                        <WaitItemTable
                            v-if="businessCurrentTab == 1 && typeTabName=='2'"
                            @handleSelectionChange="handleSelectionChange"
                            @batchRecordEntry="e_itemBatchRecordEntry"
                            @ResultEntry="e_itemResultEntry"
                            :listData="listData"
                        />
                        <!--被退回-->
                        <WithdrawTable
                            v-if="businessCurrentTab == 2"
                            :listData="listData"
                            @approvalRecord="e_approvalRecord"
                            @handleSelectionChange="handleSelectionChange"
                            @batchEdit="e_samplebatchEdit"
                            @edit="e_sampleResultEdit"
                            :InspectionTypeList="InspectionTypeList"
                        />
                        <!--已完成 按样品-->
                        <CompleteSampleTable
                            v-if="businessCurrentTab == 3 && typeTabName=='1'"
                            @handleSelectionChange="handleSelectionChange"
                            @seeDetail="e_seeSampleDetail"
                            @pushSAP="e_pushSAP"
                            :listData="listData"
                            :InspectionTypeList="InspectionTypeList"
                        />
                        <!--已完成 按项目-->
                        <CompleteTable
                            v-if="businessCurrentTab == 3 && typeTabName=='2'"
                            @handleSelectionChange="handleSelectionChange"
                            @approvalRecord="e_approvalRecord"
                            @batchSeeDetail="e_batchSeeDetail"
                            @seeDetail="e_seeDetail"
                            @pushSAP="e_pushSAP"
                            :listData="listData"
                            :InspectionTypeList="InspectionTypeList"
                        />
                    </template>
                </BoMain>
            </template>
        </BoContainer>
        <!--批量录入-->
        <EntryOriginalRecord
            ref="EntryOriginalRecord"
            v-if="showEntryOriginalRecord"
            @reload="reload"
            @cancel="showEntryOriginalRecord = false"
            @approvalRecord="e_approvalRecord"
        />
        <!--        接收任务 /交回任务页面-->
        <receiveTask
            :distinguishCode="distinguishCode"
            :receiveTaskShow.sync="receiveTaskShow"
            :rowDatas="rowDatas"
            @init="receiveTaskReload"
        />
        <!--        审批记录-->
        <approvalRecord
            ref="approvalRecord"
            :rowData="approvalrowData"
            :approvalRecordsShow.sync="approvalRecordsShow"
            v-if="approvalRecordsShow"
        />
    </div>
</template>
<script>
    import BoContainerMixin from '@/mixins/boContainer'
    import Lang from './Lang'
    import WaitTable from './table/waitTable'
    import WaitItemTable from './table/waitItemTable'
    import WithdrawTable from './table/withdrawTable'
    import CompleteTable from './table/completeTable'
    import EntryOriginalRecord from './Dialog/entryOriginalRecord'
    import receiveTask from '@/components/detectionManage/resultEntry/receiveTask'
    import ReceiveItemTable from './table/ReceiveItemTable'
    import ReceiveSampleTable from './table/ReceiveSampleTable'
    import CompleteSampleTable from './table/completeSampleTable'
    import approvalRecord from '@/components/detectionManage/resultEntry/approvalRecord'

    export default {
        mixins: [BoContainerMixin],
        components: {
            WaitTable,//待录入  按样品
            WaitItemTable,//待录入  按项目
            WithdrawTable,//被退回
            CompleteTable,//已完成
            EntryOriginalRecord,//批量录入
            receiveTask,//待接收任务详情页
            ReceiveItemTable,//待接收列表 按项目
            ReceiveSampleTable,//待接收列表 按样品
            approvalRecord,
            CompleteSampleTable //已完成 按样品
        },
        data() {
            return {
                Lang,
                total: 0,
                businessCurrentTab: '1',//业务
                receiveTaskShow: false,
                isSign: false,
                isHaveDate: false,
                approvalRecordsShow: false,
                typeTabName: '1',
                queryParams: {
                    pageSize: 10,
                    pageNum: 1,
                    detectStatusList: '',
                    sampleCode: '',
                    sampleBatch: '',
                    entrustCode: '',
                    itemCode: '',
                    inputDateStart: '',
                    inputDateEnd: ''
                },
                listData: [],
                checkData: [],
                selectedArr: [],
                approvalrowData: '',
                showEntryOriginalRecord: false,//批量录入弹框
                rowDatas: [], //批量多选数据
                distinguishCode: '', //进入待接收任务详情页识别码
                entrustDate: '', //任务日期
                entryTime: '',//录入日期
                InspectionTypeList: this.getDictionary('InspectionType')
            }
        },
        watch: {
            businessCurrentTab(val) {
                this.$refs.BoMain.calculateReset()
            }
        },
        created() {
            // 首页路由跳转
            if (this.$route.query.activeName) {
                console.log(this.$route.query.activeName)
                this.businessCurrentTab = this.$route.query.activeName
                console.log(this.businessCurrentTab)
            }
        },
        mounted() {
            this.getListData()
            this.getReturnData()
        },
        methods: {
            // 获取列表数据
            async getListData() {
                let url = ''
                switch (this.businessCurrentTab) {
                    // case '0':
                    //     this.queryParams.detectStatusList = '0'
                    //     if (this.typeTabName == '1') {
                    //         url = '/v1/detectManage/resultEnter/sampleList'
                    //     } else {
                    //         url = '/v1/detectManage/resultEnter/itemList'
                    //     }
                    //     break
                    case '1':
                        this.queryParams.detectStatusList = '10,15'
                        if (this.typeTabName == '1') {
                            url = '/v1/detectManage/resultEnter/sampleList'
                        } else {
                            url = '/v1/detectManage/resultEnter/itemList'
                        }
                        break
                    case '2':
                        this.queryParams.detectStatusList = '50'
                        url = '/v1/detectManage/resultEnter/sampleListDetail'
                        break
                    case '3':
                        this.queryParams.detectStatusList = '20,30,40'
                        if (this.typeTabName == '1') {
                            url = '/v1/detectManage/resultEnter/sampleListDetailBySample'
                        } else {
                            url = '/v1/detectManage/resultEnter/sampleListDetail'
                        }
                        break
                }
                let getData = await this.$net(url, 'get', this.queryParams)
                if (getData.code == 200) {
                    console.log('列表数据===》', getData)
                    this.listData = getData.data.list
                    this.total = getData.data.total
                }
                this.getOrderNumber(this.listData, this.queryParams.pageNum, this.queryParams.pageSize)
            },
            // 获取退回列表数据
            async getReturnData() {
                let getData = await this.$net('/v1/detectManage/resultEnter/sampleListDetail', 'get', { detectStatusList: '50' })
                if (getData.code == 200) {
                    this.isSign = getData.data.total > 0
                }
                let isHave1 = false
                let isHave2 = false
                let getData2 = await this.$net('/v1/detectManage/resultEnter/sampleList', 'get', { detectStatusList: '0' })
                if (getData2.code == 200) {
                    isHave1 = getData2.data.total > 0
                }
                let getData3 = await this.$net('/v1/detectManage/resultEnter/itemList', 'get', { detectStatusList: '0' })
                if (getData3.code == 200) {
                    isHave2 = getData3.data.total > 0
                }
                if (isHave1 || isHave2) {
                    this.isHaveDate = true
                } else {
                    this.isHaveDate = false
                }
                console.log(this.isHaveDate)
            },
            //处理数据(样品)
            handleData(row) {
                let obj = {
                    entrustId: row.entrustId,
                    detectType: row.detectType,
                    sampleId: row.sampleId,
                    detectCompleteDate: row.detectCompleteDate
                }
                this.rowDatas.push(obj)
            },
            //按样品-接收任务按钮操作
            handleSampleReceivedTask(row) {
                this.rowDatas = []
                if (row) {
                    this.handleData(row)
                }
                this.distinguishCode = 'SampleReceivedTask'
                this.receiveTaskShow = true
            },
            //按样品-接收任务批量
            handleSampleReceivedTasks() {
                if (this.checkData.length == 0) {
                    this.$message.warning('请选择你要进行操作的数据')
                    return
                }
                this.rowDatas = []
                this.checkData.forEach(item => {
                    this.handleData(item)
                })
                this.distinguishCode = 'SampleReceivedTask'
                this.receiveTaskShow = true
            },
            //按样品-交回任务按钮操作
            handleSampleReturnTask(row) {
                this.rowDatas = []
                if (row) {
                    this.handleData(row)
                }
                this.distinguishCode = 'SampleReturnTask'
                this.receiveTaskShow = true
            },
            //按样品-交回任务批量
            handleSampleReturnTasks() {
                if (this.checkData.length == 0) {
                    this.$message.warning('请选择你要进行操作的数据')
                    return
                }
                this.rowDatas = []
                this.checkData.forEach(item => {
                    this.handleData(item)
                })
                this.distinguishCode = 'SampleReturnTask'
                this.receiveTaskShow = true
            },

            //处理数据(项目)
            handleData1(row) {
                let obj = {
                    entrustId: row.entrustId,
                    detectType: row.detectType,
                    itemName: row.itemName,
                    itemCode: row.itemCode
                }
                this.rowDatas.push(obj)
            },
            //按项目-接收任务按钮操作
            handleItemReceivedTask(row) {
                this.rowDatas = []
                if (row) {
                    this.handleData1(row)
                }
                this.distinguishCode = 'ItemReceivedTask'
                this.receiveTaskShow = true
            },
            //按项目-接收任务批量
            handleItemReceivedTasks() {
                if (this.checkData.length == 0) {
                    this.$message.warning('请选择你要进行操作的数据')
                    return
                }
                this.rowDatas = []
                this.checkData.forEach(item => {
                    this.handleData1(item)
                })
                this.distinguishCode = 'ItemReceivedTask'
                this.receiveTaskShow = true
            },
            //按项目-交回任务按钮操作
            handleItemReturnTask(row) {
                this.rowDatas = []
                if (row) {
                    this.handleData1(row)
                }
                this.distinguishCode = 'ItemReturnTask'
                this.receiveTaskShow = true
            },
            //按项目-交回任务批量
            handleItemReturnTasks() {
                if (this.checkData.length == 0) {
                    this.$message.warning('请选择你要进行操作的数据')
                    return
                }
                this.rowDatas = []
                this.checkData.forEach(item => {
                    this.handleData1(item)
                })
                this.distinguishCode = 'ItemReturnTask'
                this.receiveTaskShow = true
            },
            // 接收任务/交回任务 回调
            receiveTaskReload() {
                this.receiveTaskShow = false
                this.getListData()
            },

            //待录入 按样品 批量结果录入 按钮
            async e_sampleBatchRecordEntry() {
                if (this.checkData.length == 0) {
                    this.$message.warning('请选择你要进行操作的数据')
                    return
                }
                let arr = []
                this.checkData.map((item) => {
                    if (item.isReceiveSample == 0) {
                        arr.push(item)
                    }
                })
                if (arr.length > 0) {
                    this.$message.info('选择的数据中存在为接样的样品')
                    return
                }
                let params = {
                    entrustSampleList: this.selectedArr
                }
                this.showEntryOriginalRecord = true
                this.$nextTick(() => {
                    this.$refs.EntryOriginalRecord.init(params, 'add')
                })
            },
            //待录入 按项目 批量结果录入 按钮
            async e_itemBatchRecordEntry() {
                if (this.checkData.length == 0) {
                    this.$message.warning('请选择你要进行操作的数据')
                    return
                }
                let arr = []
                this.checkData.map((item) => {
                    if (item.isReceiveSample == 0) {
                        arr.push(item)
                    }
                })
                if (arr.length > 0) {
                    this.$message.info('选择的数据中存在为接样的样品')
                    return
                }
                let params = {
                    entrustItemList: this.selectedArr
                }
                this.showEntryOriginalRecord = true
                this.$nextTick(() => {
                    this.$refs.EntryOriginalRecord.init(params, 'add')
                })
            },

            //待录入 按样品 结果录入
            async e_sampleResultEntry(row) {
                let params = {
                    entrustSampleList: [{
                        entrustId: row.entrustId,
                        sampleId: row.sampleId
                    }]
                }
                this.showEntryOriginalRecord = true
                this.$nextTick(() => {
                    this.$refs.EntryOriginalRecord.init(params, 'add')
                })
            },
            //待录入 按项目 结果录入
            async e_itemResultEntry(row) {
                let params = {
                    entrustItemList: [{
                        entrustId: row.entrustId,
                        itemId: row.itemId
                    }]
                }
                this.showEntryOriginalRecord = true
                this.$nextTick(() => {
                    this.$refs.EntryOriginalRecord.init(params, 'add')
                })
            },
            // 结果录入回调
            reload() {
                this.showEntryOriginalRecord = false
                this.getListData()
            },
            // 被退回页面 批量修改 按钮
            e_samplebatchEdit() {
                if (this.checkData.length == 0) {
                    this.$message.warning('请选择你要进行操作的数据')
                    return
                }
                let selectedIdArr = []
                this.checkData.map((item) => {
                    selectedIdArr.push(item.id)
                })
                this.showEntryOriginalRecord = true
                this.$nextTick(() => {
                    this.$refs.EntryOriginalRecord.init(selectedIdArr, 'edit')
                })
            },
            // 被退回页面 修改操作
            e_sampleResultEdit(row) {
                this.showEntryOriginalRecord = true
                this.$nextTick(() => {
                    this.$refs.EntryOriginalRecord.init([row.id], 'edit')
                })
            },
            // 已完成页面 推送ASP
            e_pushSAP() {

            },
            // 已完成页面 查看详情
            e_seeDetail(row) {
                this.showEntryOriginalRecord = true
                this.$nextTick(() => {
                    this.$refs.EntryOriginalRecord.init([row.id], 'detail')
                })
            },
            // 已完成页面 审批记录 操作
            e_approvalRecord(row) {
                this.approvalrowData = row
                this.approvalRecordsShow = true
                this.$nextTick(() => {
                    this.$refs.approvalRecord.open(row)
                })
            },
            // 已完成页面 批量查看详情
            e_batchSeeDetail() {
                if (this.checkData.length == 0) {
                    this.$message.warning('请选择你要进行操作的数据')
                    return
                }
                let selectedIdArr = []
                this.checkData.map((item) => {
                    selectedIdArr.push(item.id)
                })
                this.showEntryOriginalRecord = true
                this.$nextTick(() => {
                    this.$refs.EntryOriginalRecord.init(selectedIdArr, 'detail')
                })
            },
            // 已完成页面 按样品 查看详情
            async e_seeSampleDetail(row) {
                let params = {
                    pageNum: 1,
                    detectStatusList: '20, 30, 40',
                    sampleCode: row.sampleCode
                }
                let getData = await this.$net('/v1/detectManage/resultEnter/sampleListDetail', 'get', params)
                if (getData.code == 200) {
                    let selectedIdArr = []
                    getData.data.list.map((item) => {
                        selectedIdArr.push(item.id)
                    })
                    this.showEntryOriginalRecord = true
                    this.$nextTick(() => {
                        this.$refs.EntryOriginalRecord.init(selectedIdArr, 'detail', 'completeSample')
                    })
                }
            },
            // 已完成页面 审批记录 操作
            e_approvalRecord(row) {
                this.approvalrowData = row
                this.approvalRecordsShow = true
                this.$nextTick(() => {
                    this.$refs.approvalRecord.open(row)
                })
            },
            // 搜索 按钮
            searchBtn() {
                this.queryParams.pageNum = 1
                this.queryParams.pageSize = 10
                this.getListData()
            },
            // 页码更改
            changePage(e) {
                this.queryParams.pageNum = e.page
                this.queryParams.pageSize = e.limit
                this.getListData()
            },
            // 重置 按钮
            ResetBtn() {
                this.$refs.queryFrom.resetFields()
                this.$nextTick(() => {
                    this.$refs.BoContainer.resetPage()
                })
                this.entrustDate = ''
                this.entryTime = ''
                this.queryParams.entrustDateStart = ''
                this.queryParams.entrustDateEnd = ''
                this.queryParams.inputDateStart = ''
                this.queryParams.inputDateEnd = ''
                this.getListData()
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
            // 菜单切换
            selectMenu(e) {
                this.checkData = []
                this.businessCurrentTab = e
                this.ResetBtn()
                this.getReturnData()
            },
            // tab切换
            handleClick() {
                this.checkData = []
                this.ResetBtn()
            },
            // 设置录入时间
            setEntryTime(e) {
                this.entryTime = e
                if (e) {
                    this.queryParams.inputDateStart = e[0]
                    this.queryParams.inputDateEnd = e[1]
                } else {
                    this.queryParams.inputDateStart = ''
                    this.queryParams.inputDateEnd = ''
                }
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.selectedArr = []
                selection.map((item) => {
                    let obj = {}
                    if (this.typeTabName == '1') {
                        obj = {
                            entrustId: item.entrustId,
                            sampleId: item.sampleId
                        }
                    } else {
                        obj = {
                            entrustId: item.entrustId,
                            itemId: item.itemId
                        }
                    }
                    // 待录入选择数据 重组
                    this.selectedArr.push(obj)
                })
                //多选框选中的数据
                this.checkData = selection
            }
        }
    }
</script>
<style scoped>
    .fontImage {
        display: flex;
        flex-direction: row;
    }

    .iconarea {
        position: relative;
    }

    .iconarea i {
        display: inline-block;
        /*width: 18px;*/
        /*height: 18px;*/
        border: 3px red solid;
        border-radius: 9px;
        margin-right: 7px;
        margin-top: -20px;
        font-size: 10px;
        color: red;
    }

    .iconarea .ia-label {
        position: absolute;
        top: -6px;
        left: 3px;
        font-size: 12px;
        color: red;
    }
</style>
