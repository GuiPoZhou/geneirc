<template>
    <div>
        <BoContainer ref="BoContainer" pageTitle="样本" :total="total" @changePage="changePage">
            <template slot="boMain">
                <BoMain>
                    <template slot="botabs">
                        <el-menu
                            :default-active="activeIndex"
                            class="el-menu-demo"
                            mode="horizontal"
                            @select="handleSelect"
                        >
                            <el-menu-item :index="item.id.toString()" v-for="item in tabList">
                                <a-badge
                                    :count="item.badgeTotal"
                                    :overflow-count="99"
                                    :show-zero="item.id.toString() === '1'"
                                >
                                    {{ item.configName }}
                                </a-badge>
                            </el-menu-item>
                        </el-menu>
                    </template>
                    <template slot="bosearch">
                        <el-form
                            :model="queryParams"
                            ref="queryForm"
                            :inline="true"
                            label-width="100px"
                            :prop="queryParams"
                            style="margin-top: 15px"
                            v-show="showSearch"
                        >
                            <el-form-item
                                label="提交人员"
                                v-if="activeIndex !== '3'"
                                prop="submitUserName"
                            >
                                <el-input
                                    v-model="queryParams.submitUserName"
                                    placeholder="提交人员"
                                    clearable
                                    size="small"
                                    @keyup.enter.native="handleQuery"
                                    class="input-with-select"
                                />
                            </el-form-item>
                            <el-form-item label="审批状态" v-if="activeIndex !== '1'" prop="status">
                                <el-select
                                    v-model="queryParams.status"
                                    filterable
                                    size="small"
                                    placeholder="请选择"
                                    :clearable="true"
                                    @change="handleQuery"
                                >
                                    <el-option
                                        v-for="item in statusOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="提交日期" prop="picker">
                                <el-date-picker
                                    v-model="queryParams.picker"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    :default-time="['00:00:00', '23:59:59']"
                                    @change="datePickChange"
                                    size="small"
                                />
                            </el-form-item>
                            <div class="a-c-t-btnarea">
                                <el-form-item>
                                    <el-button
                                        type="primary"
                                        icon="el-icon-search"
                                        size="mini"
                                        @click="handleQuery"
                                    >搜索
                                    </el-button>
                                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
                                    >重置
                                    </el-button>
                                </el-form-item>
                            </div>
                        </el-form>
                    </template>
                    <template slot="tableArea">
                        <el-row :gutter="10" class="mb8" style="margin-top: 4px">
                            <right-toolbar :showSearch.sync="showSearch" @queryTable="resetQuery"></right-toolbar>
                        </el-row>
                        <el-table
                            :height="mainTableHeight"
                            :data="data"
                            stripe
                            style="width: 100%"
                            border
                        >
                            <el-table-column
                                type="index"
                                width="55"
                                label="序号"
                                align="center"
                            />
                            <!--            应用模块-->
                            <el-table-column
                                prop="businessCategory"
                                label="应用模块"
                                align="center"
                            >
                            </el-table-column>
                            <!--            业务类型-->
                            <el-table-column
                                prop="configName"
                                label="业务类型"
                                align="center"
                            >
                            </el-table-column>
                            <!--            提交人员-->
                            <el-table-column
                                prop="createUserName"
                                label="提交人员"
                                align="center"
                            >
                            </el-table-column>
                            <!--            提交日期-->
                            <el-table-column
                                prop="createTime"
                                label="提交日期"
                                align="center"
                            >
                            </el-table-column>
                            <!--            状态-->
                            <!--                                待审批页签-->
                            <el-table-column
                                label="状态"
                                align="center"
                                :render-header="linefeed"
                                v-if="activeIndex === '1'"
                            >
                                <template scope="scope">
                                    <span>{{ scope.row.taskName }}</span>
                                </template>
                            </el-table-column>
                            <!--            状态-->
                            <!--                                已审批页签-->
                            <el-table-column
                                label="状态"
                                align="center"
                                :render-header="linefeed"
                                v-if="activeIndex === '2'"
                            >
                                <template scope="scope">
                                    <span v-if="scope.row.handleFlowName == '通过'" style="color:#67C23A">{{ scope.row.handleFlowName }}</span>
                                    <span v-if="scope.row.handleFlowName == '已撤销'" style="color:#909399">{{ scope.row.handleFlowName }}</span>
                                    <span v-if="scope.row.handleFlowName == '退回'" style="color:#F56C6C">{{ scope.row.handleFlowName }}</span>
                                    <span v-if="scope.row.handleFlowName == '已暂停'" style="color:#409EFF">{{ scope.row.handleFlowName }}</span>
                                </template>
                            </el-table-column>
                            <!--            状态-->
                            <!--                                已提交页签-->
                            <el-table-column
                                label="状态"
                                align="center"
                                :render-header="linefeed"
                                v-if="activeIndex === '3'"
                            >
                                <template scope="scope">
                                    <!--
                                               taskKey: "1"taskName: "待审批"
                                               taskKey: "2"taskName: "已撤回"
                                               taskKey: "3"taskName: "已批准"
                                               taskKey: "4"taskName: "通过"
                                               -->
                                    <!--                                    任务-->
                                    <div v-if="scope.row.businessCode == 'TASK_CODE'">
                                        <!--                                        待审批-->
                                        <span v-if="scope.row.taskKey == '1'" style="color: #E6A23C">待审批</span>
                                        <!--                                        已撤回-->
                                        <span v-if="scope.row.taskKey == '2'" style="color: #909399">已撤回</span>
                                        <!--                                        通过-->
                                        <span v-if="scope.row.taskKey == '4'" style="color: #67C23A">通过</span>
                                        <!--                                        退回-->
                                        <span v-if="scope.row.taskKey == '7'" style="color: #F56C6C">退回</span>
                                    </div>
                                    <!--                                    计划-->
                                    <div v-if="scope.row.businessCode == 'PLAN_CODE'">
                                        <!--                                        已暂停-->
                                        <span v-if="scope.row.taskKey == '6'" style="color: #409EFF">已暂停</span>
                                        <!--                                        已撤回-->
                                        <span v-if="scope.row.taskKey == '2'" style="color: #909399">已撤回</span>
                                        <!--                                        通过-->
                                        <span v-if="scope.row.taskKey == '4'" style="color: #67C23A">通过</span>
                                        <!--                                        退回-->
                                        <span v-if="scope.row.taskKey == '7'" style="color: #F56C6C">退回</span>
                                    </div>
                                    <!--                                    通用-->
                                    <div
                                        v-if="!(scope.row.businessCode == 'TASK_CODE' || scope.row.businessCode == 'PLAN_CODE')">
                                        <!--                                        已撤回-->
                                        <span v-if="scope.row.taskKey == '2'" style="color: #E6A23C">审批中</span>
                                        <!--                                        已批准-->
                                        <span v-if="scope.row.taskKey == '3'" style="color: #67C23A">已批准</span>
                                        <!--                                        通过-->
                                        <span v-if="scope.row.taskKey == '9'" style="color: #67C23A">通过</span>
                                        <!--                                        退回-->
                                        <span v-if="scope.row.taskKey == '4'" style="color: #F56C6C">退回</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <!--                            操作-->
                            <el-table-column
                                label="操作"
                                align="center"
                                width="150"
                            >
                                <template slot-scope="scope">
                                    <!--                    查看-->
                                    <el-button
                                        size="mini"
                                        type="text"
                                        v-if="activeIndex != '1'"
                                        @click="clickTask(scope.row,scope.$index)"
                                    >查看
                                    </el-button>
                                    <!--                    提交-->
                                    <el-button
                                        size="mini"
                                        type="text"
                                        v-if="activeIndex == '1'"
                                        @click="clickTask(scope.row,scope.$index)"
                                    >审批
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </BoMain>
            </template>
        </BoContainer>
        <!--        审批详情页面-->
        <indexDetail
            ref="indexDetail"
            v-if="showIndexDetail"
            @close="showIndexDetail = false"
            @reload="indexDetailReload"
        />
    </div>
</template>

<script>
    import indexDetail from './indexDetail'
    import boContainer from '@/mixins/boContainer'
    import infiniteScroll from 'vue-infinite-scroll'
    import {
        getTodoList,
        getDoneList,
        getMySubmitList,
        getStatusOptions
    } from '@/api/process/config'
    import { getDynamicData } from '@/api/runDynamicPage/config'
    import '@/views/core/components_use'
    import 'ant-design-vue/dist/antd.css'

    export default {
        name: 'myProcess',
        mixins: [boContainer],
        directives: { infiniteScroll },
        components: {
            indexDetail
        },
        data() {
            return {
                showIndexDetail: false,
                detailInfo: {},
                pdfURL: '',
                activeIndex: '1',
                subActiveIndex: '1',
                curIndex: 0,
                showSearch: true,
                spType: 1,
                tabList: [
                    {
                        id: '1',
                        configName: '待审批　',
                        badgeCount: 0
                    },
                    {
                        id: '2',
                        configName: '已审批　',
                        badgeCount: 0
                    },
                    {
                        id: '3',
                        configName: '已提交　',
                        badgeCount: 0
                    }
                ],
                data: [],
                printData: {},
                loading: false,
                busy: false,
                total: 0,
                total1: 0,
                // 查询参数
                queryParams: {
                    businessCategory: null,
                    status: null,
                    submitUserName: null,
                    completeDateStart: null,
                    completeDateEnd: null,
                    picker: null,
                    pageNum: 1,
                    pageSize: 10
                },
                statusOptions: [],
                locale: {
                    emptyText: '暂无数据'
                },

                //表单
                jsonData: {},
                defaultValue: {},
                envDetectInfoPick: [],
                entrustPackageSelectedList: [],
                extendedProperties: {},
                dynamicDataSource: {},
                cacheDynamicDataSource: {},
                isView: true,
                spinning: false,
                dynamicData: {
                    selectCustomerVisible: false,
                    selectCustomer(value, event) {
                        this.selectCustomerVisible = true
                    },
                    selectedSubcontractor: (val1, val2, val3, val4, val5) => {
                        this.$EventBus.$emit('selectedSubcontractor')
                    },
                    disabled1: false,
                    disabled2: true
                },
                loadForm: false,
                //历史审批记录
                gridData: null,
                //任务流向
                taskFlow: [],
                nowTaskFlow: {},
                nowTask: {},
                configId: ''
            }
        },
        beforeMount() {
        },
        mounted() {
            this.handleSelect('1')
        },
        methods: {
            // 页码更改
            changePage(e) {
                console.log(e)
                this.queryParams.pageNum = e.page
                this.queryParams.pageSize = e.limit
                const data = []
                this.loading = true
                this.fetchData((res, refreshTotal) => {
                    this.data = data.concat(res.rows)
                    this.total = res.total
                    if (refreshTotal) {
                        this.tabList[0].badgeTotal = res.total
                    }
                    this.loading = false
                })
            },

            getDynamicData(root, config) {
                if (!config) {
                    return
                }
                // 加载表单远程数据源
                config.forEach((f) => {
                    if (f.type == 'grid') {
                        f.columns.forEach((c) => {
                            root.getDynamicData(root, c.list)
                        })
                    }
                    if (f.type == 'card') {
                        root.getDynamicData(root, f.list)
                    }
                    if (f.type == 'tabs') {
                        f.columns.forEach((c) => {
                            root.getDynamicData(root, c.list)
                        })
                    }
                    if (f.type == 'table') {
                        f.trs.forEach((tr) => {
                            tr.tds.forEach((td) => {
                                root.getDynamicData(root, td.list)
                            })
                        })
                    }
                    if (f.options && f.options.dynamicGetUrl) {
                        f.options.dynamicKey = f.key + '_dk'
                        let valueField = f.options.dynamicGetKey
                        let labelField = f.options.dynamicGetValue
                        getDynamicData(f.options.dynamicGetUrl).then((response) => {
                            let dataSource = []
                            response.data.forEach((row, key) => {
                                dataSource.push({
                                    value: row[valueField],
                                    label: row[labelField]
                                })
                            })
                            root.$set(root.dynamicData, f.options.dynamicKey, dataSource)
                        })
                    }
                })
            },
            // 菜单栏切换
            handleSelect(key) {
                this.resetForm('queryForm')
                this.queryParams.completeDateStart = null
                this.queryParams.completeDateEnd = null
                this.activeIndex = key
                this.queryParams.pageNum = 1
                this.jsonData = {}
                this.data = []
                this.subActiveIndex = '1'
                this.taskFlow = []
                const data = this.data
                this.loading = true
                this.fetchData((res, refreshTotal) => {
                    this.data = data.concat(res.rows)
                    this.total = res.total
                    if (refreshTotal) {
                        this.tabList[0].badgeTotal = res.total
                    }
                    this.loading = false
                })
                getStatusOptions(this.activeIndex).then((res) => {
                    console.log(res.data)
                    this.statusOptions = res.data
                })

            },
            // 审批回调
            indexDetailReload() {
                this.showIndexDetail = false
                this.handleQuery()
            },
            /*
             *@author: 焦政
             *@date: 2021-08-16 09:04:41
             *@description:点击审核列表
             */
            clickTask(item, index) {
                this.showIndexDetail = true
                this.$nextTick(() => {
                    this.$refs.indexDetail.init(item, index, this.activeIndex)
                })
            },
            // 请求数据
            fetchData(callback) {
                if (this.activeIndex === '1') {
                    getTodoList(this.queryParams).then((res) => {
                        callback(res, true)
                        this.queryParams.pageNum += 1
                    })
                } else if (this.activeIndex === '2') {
                    getDoneList(this.queryParams).then((res) => {
                        callback(res, false)
                        this.queryParams.pageNum += 1
                    })
                } else if (this.activeIndex === '3') {
                    getMySubmitList(this.queryParams).then((res) => {
                        callback(res, false)
                        this.queryParams.pageNum += 1
                    })
                }
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1
                const data = []
                this.fetchData((res, refreshTotal) => {
                    this.data = data.concat(res.rows)
                    this.total = res.total
                    if (refreshTotal) {
                        this.tabList[0].badgeTotal = res.total
                    }
                    this.loading = false
                })
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.resetForm('queryForm')
                this.queryParams.completeDateStart = null
                this.queryParams.completeDateEnd = null
                this.handleQuery()
            },
            datePickChange(val) {
                if (val && val.length > 0) {
                    this.queryParams.completeDateStart = val[0]
                    this.queryParams.completeDateEnd = val[1]
                } else {
                    this.queryParams.completeDateStart = null
                    this.queryParams.completeDateEnd = null
                }
            }
        },
        beforeDestroy() {
            this.$EventBus.$off('selectedSubcontractor')
        }
    }
</script>

<style scoped lang="less">
    .demo-infinite-container {
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        overflow: auto;
        padding: 8px 24px 8px 0;
    }

    .demo-loading-container {
        position: absolute;
        bottom: 40px;
        width: 100%;
        text-align: center;
    }

    .ant-layout {
        background: #ffffff;
    }

    .ant-layout-footer {
        background: #ffffff;
    }

    .important {
        color: #13227a;
        font-size: 13px;
    }

    /deep/ .ant-list-item {
        cursor: pointer;
    }

    /deep/ .ant-layout-sider-zero-width-trigger {
        right: -12px;
    }

    .curList {
        // border-left:2px solid #E0620D;
        box-shadow: 5px 0px 0px #e0620d inset;
    }

    .status {
        color: #e0620d;
        font-size: 13px;
        vertical-align: middle;
        text-align: center;
    }
</style>
