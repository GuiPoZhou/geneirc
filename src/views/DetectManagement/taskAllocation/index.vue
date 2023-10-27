<template>
    <div>
        <BoContainer ref="BoContainer" :total="total" @changePage="changePage">
            <template slot="boMain">
                <BoMain>
                    <template slot="botabs">
                        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
                                 @select="handleSelect">
                            <el-menu-item :index="item.id.toString()" v-for="item in Lang[lang]['tabConfig']">
                                <template slot="title">
                                    <div class="fontImage">
                                        {{ item.configName }}
                                        <div class="iconarea"
                                             v-if="(item.id == 1 && isHaveDate) || (item.id == 3 && isMyTaskHaveDate)">
                                            <i></i>
                                        </div>
                                    </div>
                                </template>
                            </el-menu-item>
                        </el-menu>
                    </template>
                    <template slot="bosearch">
                        <!--                        <el-radio-group v-model="radio" size="medium" @change="handleSubSelect">-->
                        <!--                            <el-radio-button :label="Lang[lang]['BySample']"/>-->
                        <!--                            <el-radio-button :label="Lang[lang]['ByProject']"/>-->
                        <!--                        </el-radio-group>-->
                        <el-form :model="queryParams" ref="queryForm" :inline="true"
                                 :prop="queryParams" style="margin-top: 15px" v-show="showSearch">
                            <el-form-item :label="Lang[lang]['SampleCode']+'：'"
                                          v-if="(radio === '按样品'|| radio === 'By Sample') || activeIndex == '3'"
                                          prop="sampleCode">
                                <el-input v-model="queryParams.sampleCode" :placeholder="Lang[lang]['PleaseEnter']"
                                          clearable size="small"
                                          @clear="handleQuery" @keyup.enter.native="handleQuery"
                                />
                            </el-form-item>
                            <el-form-item label="委托编号：" prop="entrustCode"
                                          v-if="activeIndex !='3' || (radio === '按样品'|| radio === 'By Sample')">
                                <el-input v-model="queryParams.entrustCode" :placeholder="Lang[lang]['PleaseEnter']"
                                          clearable size="small"
                                          @clear="handleQuery" @keyup.enter.native="handleQuery"
                                />
                            </el-form-item>
                            <el-form-item :label="Lang[lang]['entryName']+'：'" prop="itemName"
                                          v-if="(radio === '按项目'|| radio === 'By Item') && activeIndex !='3'">
                                <el-input v-model="queryParams.itemName" :placeholder="Lang[lang]['PleaseEnter']"
                                          clearable size="small"
                                          @clear="handleQuery" @keyup.enter.native="handleQuery"
                                />
                            </el-form-item>
                            <el-form-item :label="Lang[lang]['MethodNumber']+'：'" prop="itemCode"
                                          v-if="radio === '按项目'|| radio === 'By Item'">
                                <el-input v-model="queryParams.itemCode" :placeholder="Lang[lang]['PleaseEnter']"
                                          clearable size="small"
                                          @clear="handleQuery" @keyup.enter.native="handleQuery"
                                />
                            </el-form-item>
                            <el-form-item label="任务类型：" prop="itemCode" v-if="activeIndex !='3'">
                                <el-select v-model="queryParams.entrustType" :placeholder="Lang[lang]['PleaseSelect']"
                                           clearable @clear="handleQuery">
                                    <el-option v-for="(item,index) in EntrustTaskTypeList" :key="index"
                                               :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="Lang[lang]['DetectionCategory']+ '：'" prop="detectTypeName"
                                          v-if="(radio === '按项目'|| radio === 'By Item') && activeIndex !='3'">
                                <el-input v-model="queryParams.detectTypeName" clearable @clear="handleQuery"
                                          @keyup.enter.native="handleQuery"
                                          @focus="cateShow = true" size="small">
                                    <i slot="suffix" class="el-input__icon el-icon-search" @click="cateShow = true"></i>
                                </el-input>
                            </el-form-item>
                            <!--委托日期-->
                            <el-form-item
                                label="委托日期"
                                prop="factoryArea"
                                v-if="activeIndex == '3'"
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
                            <div class="a-c-t-btnarea">
                                <el-form-item>
                                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">
                                        {{Lang[lang]['searchBtn']}}
                                    </el-button>
                                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
                                        {{Lang[lang]['Reset']}}
                                    </el-button>
                                </el-form-item>
                            </div>
                        </el-form>
                    </template>
                    <template slot="tableArea">
                        <!--待分配 按样品-->
                        <ToBeAllocatedSampleTable
                            v-if="activeIndex == 1 && (radio === '按样品'|| radio === 'By Sample')"
                            @handleSelectionChange="handleSelectionChange"
                            @batchAllocation="handleAddMultiple"
                            @Allocation="handleAddSingle"
                            :EntrustTaskTypeList="EntrustTaskTypeList"
                            :listData="listData"
                        />
                        <!--待分配  按项目-->
                        <ToBeAllocatedItemTable
                            v-if="activeIndex == 1 && (radio === '按项目'|| radio === 'By Project')"
                            @handleSelectionChange="handleSelectionChange"
                            @batchAllocation="handleAddMultiple"
                            @Allocation="handleAddSingle"
                            :EntrustTaskTypeList="EntrustTaskTypeList"
                            :listData="listData"
                        />
                        <!--已分配 按样品-->
                        <AssignedSampleTable
                            v-if="activeIndex == 2 && (radio === '按样品'|| radio === 'By Sample')"
                            @handleSelectionChange="handleSelectionChange"
                            @batchCancelAllocation="handleAddMultiple"
                            @CancelAllocation="handleAddSingle"
                            :EntrustTaskTypeList="EntrustTaskTypeList"
                            :listData="listData"
                        />
                        <!--已分配  按项目-->
                        <AssignedItemTable
                            v-if="activeIndex == 2 && (radio === '按项目'|| radio === 'By Project')"
                            @handleSelectionChange="handleSelectionChange"
                            @batchCancelAllocation="handleAddMultiple"
                            @CancelAllocation="handleAddSingle"
                            :EntrustTaskTypeList="EntrustTaskTypeList"
                            :listData="listData"
                        />
                        <!--待接收 我的任务 按样品-->
                        <ReceiveSampleTable
                            v-if="activeIndex == 3 && (radio === '按样品'|| radio === 'By Sample')"
                            @handleSelectionChange="handleSelectionChange"
                            @batchReceiveTask="handleSampleReceivedTasks"
                            @batchReturnTask="handleSampleReturnTasks"
                            @ReceiveTask="handleSampleReceivedTask"
                            @ReturnTask="handleSampleReturnTask"
                            :listData="listData"
                        />
                        <!--待接收 我的任务 按项目-->
                        <ReceiveItemTable
                            v-if="activeIndex == 3 && (radio === '按项目'|| radio === 'By Project')"
                            @handleSelectionChange="handleSelectionChange"
                            @batchReceiveTask="handleItemReceivedTasks"
                            @batchReturnTask="handleItemReturnTasks"
                            @ReceiveTask="handleItemReceivedTask"
                            @ReturnTask="handleItemReturnTask"
                            :listData="listData"
                        />
                    </template>
                </BoMain>
            </template>
        </BoContainer>
        <detectType :visible.sync="cateShow" @handleClick="handleClick"/>
        <distribution :extendedProperties="extendedProperties"/>
        <!--        接收任务 /交回任务页面-->
        <receiveTask
            :distinguishCode="distinguishCode"
            :receiveTaskShow.sync="receiveTaskShow"
            :rowDatas="rowDatas"
            @init="receiveTaskReload"
        />
    </div>
</template>

<script>
    import receiveTask from '@/components/detectionManage/resultEntry/receiveTask'
    import BoContainerMixin from '@/mixins/boContainer'
    import distribution from './distribution/index'
    import detectType from '@/components/project/detectType'
    import Lang from './Lang'
    import ReceiveSampleTable from './Dialog/ReceiveSampleTable'
    import ReceiveItemTable from './Dialog/ReceiveItemTable'
    import AssignedItemTable from './Dialog/AssignedItemTable'
    import AssignedSampleTable from './Dialog/AssignedSampleTable'
    import ToBeAllocatedItemTable from './Dialog/ToBeAllocatedItemTable'
    import ToBeAllocatedSampleTable from './Dialog/ToBeAllocatedSampleTable'

    export default {
        name: 'taskAllocation',
        components: {
            distribution,
            detectType,
            ReceiveSampleTable,
            ReceiveItemTable,
            AssignedItemTable,
            AssignedSampleTable,
            ToBeAllocatedItemTable,
            ToBeAllocatedSampleTable,
            receiveTask
        },
        mixins: [BoContainerMixin],
        data() {
            return {
                Lang,
                taskId: [],
                // 显示搜索条件
                showSearch: true,
                receiveTaskShow: false,
                activeIndex: '2',
                EntrustTaskTypeList: this.getDictionary('EntrustTaskType'),
                test: '',
                assigned: 0,
                buttonText: '分配详情',
                buttonIcon: 'icon iconfont iconbsl-icon-fenpei',
                multipleButtonText: '取消分配',
                multipleButtonIcon: 'icon iconfont iconbsl-icon-fenpei',
                radio: '按样品',
                loading: false,
                isHaveDate: false,
                isMyTaskHaveDate: false,
                ids: [],
                rowDatas: [], //批量多选数据
                checkData: [],
                entrustDate: [],
                single: true,
                multiple: true,
                distinguishCode: '', //进入待接收任务详情页识别码
                //查询条件
                queryParams: {
                    sampleCode: null,
                    entrustCode: null,
                    detectType: null,
                    detectTypeName: null,
                    itemName: null,
                    itemCode: null,
                    entrustType: null,
                    pageNum: 1,
                    pageSize: 10,
                    assigned: 0
                },
                cateShow: false,
                total: 0,
                listData: [],
                //子控件参数
                extendedProperties: {
                    visible: false,
                    modalTitle: '分配详情',
                    isView: true,
                    buttonText: '取消分配',
                    pickSampleIdList: [],
                    giveSampleIdList: [],
                    extendedParam: {}
                }
            }
        },
        watch: {
            queryParams: {
                handler(val, oldval) {
                    if (!val.detectTypeName) {
                        this.queryParams.detectType = null
                    }
                },
                deep: true
            }
        },
        mounted() {
            this.getListData()
            this.getReturnData()
            this.getMyTaskData()
        },
        methods: {
            // 获取列表数据
            async getListData() {
                let url = ''
                if ((this.radio === '按样品' || this.radio === 'By Sample') && this.activeIndex != 3) {
                    if (this.activeIndex == 1) {
                        this.queryParams.assigned = 0
                    } else {
                        this.queryParams.assigned = 1
                    }
                    url = '/v1/detectManage/taskAssignment/sampleList'
                }
                if ((this.radio === '按项目' || this.radio === 'By Item') && this.activeIndex != 3) {
                    if (this.activeIndex == 1) {
                        this.queryParams.assigned = 0
                    } else {
                        this.queryParams.assigned = 1
                    }
                    url = '/v1/detectManage/taskAssignment/itemList'
                }
                if (this.activeIndex == 3) {
                    this.queryParams.detectStatusList = '0'
                    if (this.radio === '按样品' || this.radio === 'By Sample') {
                        url = '/v1/detectManage/resultEnter/sampleList'
                    } else {
                        url = '/v1/detectManage/resultEnter/itemList'
                    }
                }
                let getData = await this.$net(url, 'get', this.queryParams)
                if (getData.code == 200) {
                    console.log('列表数据===》', getData)
                    this.listData = getData.data.list
                    this.total = getData.data.total
                    this.listData.map((item) => {
                        if (item.completeDate) {
                            item.completeDate = item.completeDate.split(' ')[0]
                        }
                    })
                }
                this.getOrderNumber(this.listData, this.queryParams.pageNum, this.queryParams.pageSize)
            },
            // 获取待分配列表数据 获取数据判断是否展示红点
            async getReturnData() {
                this.$refs.queryForm.resetFields()
                let isHave1 = false
                let isHave2 = false
                this.queryParams.assigned = 0
                let getData2 = await this.$net('/v1/detectManage/taskAssignment/sampleList', 'get', this.queryParams)
                if (getData2.code == 200) {
                    isHave1 = getData2.data.total > 0
                }
                let getData3 = await this.$net('/v1/detectManage/taskAssignment/itemList', 'get', this.queryParams)
                if (getData3.code == 200) {
                    isHave2 = getData3.data.total > 0
                }
                if (isHave1 || isHave2) {
                    this.isHaveDate = true
                } else {
                    this.isHaveDate = false
                }
            },
            // 获取我的任务页签数据 获取数据判断是否展示红点
            async getMyTaskData() {
                this.$refs.queryForm.resetFields()
                let isHave1 = false
                let isHave2 = false
                this.queryParams.detectStatusList = '0'
                let getData2 = await this.$net('/v1/detectManage/resultEnter/sampleList', 'get', this.queryParams)
                if (getData2.code == 200) {
                    isHave1 = getData2.data.total > 0
                }
                let getData3 = await this.$net('/v1/detectManage/resultEnter/itemList', 'get', this.queryParams)
                if (getData3.code == 200) {
                    isHave2 = getData3.data.total > 0
                }
                if (isHave1 || isHave2) {
                    this.isMyTaskHaveDate = true
                } else {
                    this.isMyTaskHaveDate = false
                }
            },
            //tab切换事件
            handleSelect(key) {
                this.activeIndex = key
                this.queryParams.assigned = parseInt(this.activeIndex) - 1
                if (this.activeIndex === '1') {
                    this.extendedProperties.buttonText = '保存'
                    this.extendedProperties.modalTitle = '分配任务'
                    this.buttonText = '去分配'
                    this.multipleButtonText = '分配'
                    this.buttonIcon = 'icon iconfont iconbsl-icon-fenpei'
                    this.multipleButtonIcon = 'icon iconfont iconbsl-icon-fenpei'
                    this.extendedProperties.isView = false
                } else if (this.activeIndex === '2') {
                    this.extendedProperties.buttonText = '取消分配'
                    this.extendedProperties.modalTitle = '分配详情'
                    this.buttonText = '分配详情'
                    this.multipleButtonText = '取消分配'
                    this.buttonIcon = 'icon iconfont iconbsl-icon-xiangqing'
                    this.multipleButtonIcon = 'icon iconfont iconbsl-icon-quxiaofabu'
                    this.extendedProperties.isView = true
                }
                this.$refs.queryForm.resetFields()
                this.$nextTick(() => {
                    this.$refs.BoContainer.resetPage()
                })
                this.entrustDate = null
                this.queryParams.entrustDateStart = ''
                this.queryParams.entrustDateEnd = ''
                this.checkData = []
                this.getListData()
                this.getReturnData()
                this.getMyTaskData()
            },
            // 单个操作 按钮
            handleAddSingle(row) {
                this.extendedProperties.handoverItemIdList = []
                this.extendedProperties.visible = true
                this.extendedProperties.radio = this.radio
                this.extendedProperties.activeIndex = this.activeIndex
                this.extendedProperties.itemObjList = []
                this.extendedProperties.sampleIdList = []
                if (this.radio === '按样品' || this.radio === 'By Sample') {
                    this.extendedProperties.sampleIdList = [row.sampleId]
                    this.extendedProperties.entrustId = row.entrustId.toString()
                    this.extendedProperties.entrustCode = row.entrustCode
                } else {
                    this.extendedProperties.entrustId = row.entrustId.toString()
                    this.extendedProperties.entrustCode = ''
                    this.extendedProperties.sampleIdList = [row.sampleId]
                    this.extendedProperties.itemObjList = [
                        {
                            itemName: row.itemName,
                            itemCode: row.methodCode,
                            detectType: row.detectType
                        }
                    ]
                }
            },
            // 批量 操作按钮
            handleAddMultiple() {
                if (this.checkData.length == 0) {
                    this.$message.warning('请选择你要进行操作的数据')
                    return
                }
                this.extendedProperties.visible = true
                this.extendedProperties.radio = this.radio
                this.extendedProperties.activeIndex = this.activeIndex
                this.extendedProperties.entrustId = null
                this.extendedProperties.handoverItemIdList = this.handoverItemId
                this.extendedProperties.itemObjList = []
                this.extendedProperties.sampleIdList = []
                if (this.radio === '按样品' || this.radio === 'By Sample') {
                    this.extendedProperties.sampleIdList = this.checkData.map((item) => item.sampleId)
                } else {
                    this.checkData.forEach((item) => {
                        this.extendedProperties.itemObjList.push({
                            itemName: item.itemName,
                            itemCode: item.methodCode,
                            detectType: item.detectType
                        })
                    })
                    this.extendedProperties.sampleIdList = this.checkData.map((item) => item.sampleId)
                }
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
            //按样品-接收任务 按钮操作
            handleSampleReceivedTask(row) {
                this.rowDatas = []
                if (row) {
                    this.handleData(row)
                }
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
            // 按样品 按项目 菜单栏 切换触发
            handleSubSelect() {
                this.queryParams.pageNum = 1
                this.$refs.queryForm.resetFields()
                this.getListData()
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.$refs.queryForm.resetFields()
                this.$nextTick(() => {
                    this.$refs.BoContainer.resetPage()
                })
                this.queryParams.completeDateStart = null
                this.queryParams.detectTypeName = null
                this.queryParams.entrustType = null
                this.queryParams.completeDateEnd = null
                this.queryParams.detectType = null
                this.entrustDate = null
                this.queryParams.entrustDateStart = ''
                this.queryParams.entrustDateEnd = ''
                this.handleQuery()
            },
            // 选择检测项目类别回调
            handleClick(row) {
                this.queryParams.detectType = row.id
                this.queryParams.detectTypeName = row.detectName
                this.cateShow = false
                this.handleQuery()
            },
            //查询
            handleQuery() {
                this.queryParams.pageNum = 1
                this.extendedProperties.extendedParam = this.queryParams
                this.getListData()
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.checkData = selection
                this.ids = selection.map((item) => item.id)
                this.handoverItemId = selection.map((item) => item.handoverItemId)
                this.single = selection.length !== 1
                this.multiple = !selection.length
            },
            // 换页
            changePage(e) {
                this.queryParams.pageSize = e.limit
                this.queryParams.pageNum = e.page
                this.getListData()
            },
            // 委托日期
            setentrustDate(e) {
                this.entrustDate = e
                if (e) {
                    this.queryParams.entrustDateStart = e[0]
                    this.queryParams.entrustDateEnd = e[1]
                } else {
                    this.queryParams.entrustDateStart = ''
                    this.queryParams.entrustDateEnd = ''
                }
            }
        }
    }
</script>

<style scoped>

    .el-row-toolbar {
        margin: 5px;
    }

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
