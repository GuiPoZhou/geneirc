<template>
    <div>
        <div class="a-c-top" v-show="showSearch">
            <el-form ref="formsample" :inline="true" :model="form" label-width="100px" class="demo-form-inline">
                <el-form-item label="申请单号">
                    <el-input v-model="queryParams.applyNo" class="input-with-select" placeholder="请输入内容"
                              style="width: 240px" size="small" clearable @keyup.enter.native="searchPro"
                              @clear="searchPro"></el-input>
                </el-form-item>
                <el-form-item label="申请日期">
                    <el-date-picker
                        v-model="dateRange"
                        style="width: 260px"
                        size="small"
                        value-format="yyyy-MM-dd"
                        @change="ondateChange"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="选择开始日期"
                        end-placeholder="选择结束日期"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="申请部门">
                    <el-input v-model="queryParams.applyDeptName" class="input-with-select"
                              placeholder="请输入内容" clearable @keyup.enter.native="searchPro" style="width: 240px"
                              size="small" @clear="searchPro"></el-input>
                </el-form-item>
                <el-form-item label="申请单状态">
                    <el-select v-model="queryParams.status" @change="searchPro" style="width: 240px" size="small"
                               clearable>
                        <el-option
                            clearable filterable
                            v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div class="a-c-t-btnarea">
                    <el-form-item>
                        <el-button
                            type="primary"
                            icon="el-icon-search"
                            size="mini"
                            @click="searchPro"
                        >搜索
                        </el-button
                        >
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
                        >重置
                        </el-button
                        >
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="a-c-bottom">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button size="mini" type="primary" @click="addApply()">添加</el-button>
<!--                    <el-button size="mini" type="primary" :disabled="multipleSelection.length <= 0"-->
<!--                               @click="handlePrint">打印-->
<!--                    </el-button>-->
                    <el-button size="mini" type="primary" :disabled="multipleSelection.length <= 0"
                               @click="submitBuyApplys">提交
                    </el-button>
                </el-col>
                <el-col :span="1.5"></el-col>
                <right-toolbar
                    :showSearch.sync="showSearch"
                    @queryTable="resetQuery"
                    @fullScreen="e_fullScreen"
                    @changeBox="e_changeBox"
                    :boxData="colData"
                    style="padding-right: 10px">
                </right-toolbar>
            </el-row>

            <!-- 列表区域 -->
            <el-table
                ref="multipleTable"
                :data="tableData"
                @selection-change="handleSelectionChange"
                @sort-change="sortChange"
            >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="序号" align="center" type="index" width="50"/>
                <el-table-column prop="applyNo" label="申请单号" align="center"  sortable v-if="colData[0].istrue"/>
                <el-table-column prop="applyDate" label="申请日期" sortable show-overflow-tooltip width="160"
                                 align="center" v-if="colData[0].istrue"/>
                <el-table-column prop="applyPersonName" label="申请人员" sortable show-overflow-tooltip
                                 align="center" v-if="colData[1].istrue"/>
                <el-table-column prop="applyDeptName" label="申请部门" sortable show-overflow-tooltip
                                 align="center" v-if="colData[2].istrue"/>
                <el-table-column prop="approvePersonName" label="批准人" sortable show-overflow-tooltip
                                 align="center" v-if="colData[3].istrue"/>
                <!-- <el-table-column prop="useDate" label="使用日期" sortable show-overflow-tooltip
                                 align="center" v-if="colData[4].istrue"/>
                <el-table-column prop="applyReason" label="申请原因" sortable show-overflow-tooltip
                                 align="center" v-if="colData[5].istrue"/> -->
                <el-table-column prop="status" label="状态" sortable show-overflow-tooltip v-if="colData[4].istrue" align="center" >
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 1">暂存</span>
                        <span v-if="scope.row.status == 2">已提交</span>
                        <span v-if="scope.row.status == 3">审核通过</span>
                        <span v-if="scope.row.status == 4">退回</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center" width="180">
                    <template slot-scope="scope">
                        <template>
                            <el-button size="mini" type="text" style="color: #409EFF" @click="e_look(scope.row)">查看
                            </el-button>
                            <el-button size="mini" type="text" v-if="scope.row.status == 4 || scope.row.status == 1"
                                       @click="e_return(scope.row)" style="color: #409EFF">修改
                            </el-button>
                            <el-button size="mini" type="text" v-if="scope.row.status == 4 || scope.row.status == 1"
                                       @click="e_del(scope.row)" style="color: #409EFF">删除
                            </el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                v-show="total > 0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList"
            />
        </div>
        <craeteApply v-if="isCraeteApply" :showType="showType" @refresh="refresh" :id="id"
                     @close="isCraeteApply = false"></craeteApply>
    </div>
</template>

<script>
    import craeteApply from './dialog/craeteApply.vue'
    import { getBuyApplyList, submitBuyApply, delBuyApply } from '@/api/chemical/purchaseApply'

    export default {
        name: 'purchaseApply',
        components: { craeteApply },
        data() {
            return {
                showType: '',
                isCraeteApply: false,
                tableData: [],
                appleDate: '',
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    applyDateBegin: '',
                    applyDateEnd: '',
                    applyNo: '',
                    applyDeptName: '',
                    status: ''
                },
                statusOptions: [{
                    label: '暂存',
                    value: 1
                }, {
                    label: '已提交',
                    value: 2
                }, {
                    label: '审核通过',
                    value: 3
                }, {
                    label: '退回',
                    value: 4
                }],
                total: 0,
                form: {},
                colData: [
                    { title: '申请单号', istrue: true },
                    { title: '申请日期', istrue: true },
                    { title: '申请部门', istrue: true },
                    { title: '批准人', istrue: true },
                    // { title: '使用日期', istrue: true },
                    // { title: '申请原因', istrue: true },
                    { title: '状态', istrue: true }
                ],
                showSearch: true,
                dateRange: '',
                multipleSelection: [],
                id: ''
            }
        },
        created() {
            this.getList()
        },
        methods: {
            searchPro() {
                this.queryParams.pageNum = 1
                this.getList()
            },
            sortChange() {

            },
            resetQuery() {
                this.dateRange = ''
                this.queryParams = {
                    pageNum: 1,
                    pageSize: 10,
                    applyDateBegin: '',
                    applyDateEnd: '',
                    applyNo: '',
                    applyDeptName: '',
                    status: ''
                }
                this.getList()
            },
            e_fullScreen() {
            },
            e_changeBox(list) {
                let arrList = this.colData.filter(i => !list.includes(i.title))
                let titleList = arrList.map(item => {
                    return item.title
                })
                this.colData.filter(i => {
                    if (titleList.indexOf(i.title) != -1) {
                        i.istrue = false
                    } else {
                        i.istrue = true
                    }
                })
            },
            getList() {
                getBuyApplyList(this.queryParams).then(res => {
                    this.tableData = res.data.list
                    this.total = res.data.total
                })
            },
            e_look(e) {
                this.showType = 'show'
                this.id = e.id
                this.isCraeteApply = true
            },
            e_return(e) {
                this.showType = 'edit'
                this.id = e.id
                this.isCraeteApply = true
            },
            e_del(e) {
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delBuyApply(e.id).then(res => {
                        this.$message.success('删除成功')
                        this.resetQuery()
                    })
                })
            },
            handlePrint() {
                let array = this.selectionList.map(item => item.id)
                if (!array || array.length == 0) {
                    return false
                }
                POBrowser.openWindowModeless(
                    process.env.VUE_APP_BASE_API +
                    '/fileManage/pageOffice/printControll?multipleSelection=' + array.join(','),
                    'width=1440px;height=860px'
                )
            },
            addApply() {
                this.id = 0
                this.showType = 'add'
                this.isCraeteApply = true
            },
            ondateChange(e) {
                if (e) {
                    this.queryParams.applyDateBegin = e[0]
                    this.queryParams.applyDateEnd = e[1]
                } else {
                    this.queryParams.applyDateBegin = ''
                    this.queryParams.applyDateEnd = ''
                }

            },
            submitBuyApplys() {
                let arr = []
                this.selectionList.map((item) => {
                    if (item.status != 1) {
                        arr.push(item)
                    }
                })
                console.log(arr)
                if (arr.length > 0) {
                    this.$message.error('只能提交暂存状态的数据')
                    return
                }
                submitBuyApply(this.multipleSelection.join(',')).then(res => {
                    if (res.code == 200) {
                        this.$message.success('提交成功')
                        this.queryParams.pageNum = 1
                        this.getList()
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            handleSelectionChange(val) {
                this.selectionList = val
                var multipleSelection = []
                for (var i in val) {
                    multipleSelection.push(val[i].id)
                }
                this.multipleSelection = multipleSelection

            },
            refresh() {
                this.isCraeteApply = false
                this.resetQuery()
            }
        }
    }
</script>


<style scoped lang="less">
    #main {

        .h3 {
            font-weight: 900;
            font-size: 16px;
            margin-top: 10px;
        }
    }

    .flexdit {
        display: flex;
        background-color: #fff;
        padding-top: 16px;
        border: 1px solid #dfe6ec;

        .el-form-item {
            width: 20%;
            margin-right: 10px;

            .el-input {
                width: 100%;
                margin-right: 10px;
            }
        }
    }

    .el-breadcrumb {
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 8px;
        margin: 10px 0;
        background-color: #fff;
        border-top: 1px solid #e8e8e8;
        border-bottom: 1px solid #e8e8e8;
    }

    .cell {
        .el-tag {
            background: none !important;
            border: none !important;
        }
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
</style>
