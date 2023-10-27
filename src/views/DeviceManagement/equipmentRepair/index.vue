<template>
    <div class="app-container">
        <div class="a-c-top">
            <el-menu
                :default-active="activeIndex"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
            >
                <el-menu-item index="1">设备维修申请</el-menu-item>
                <el-menu-item index="2">设备维修记录</el-menu-item>
            </el-menu>
            <el-form
                :inline="true"
                :model="queryParams"
                ref="queryParams"
                class="demo-form-inline"
                v-show="showSearch"
                label-width="100px"
                style="margin-top: 20px"
            >
                <el-form-item label="设备编号" prop="equipmentNumber">
                    <el-input
                        v-model="queryParams.equipmentNumber"
                        placeholder="请输入设备编号"
                        clearable
                        class="input-with-select"
                        style="width: 240px"
                        size="small"
                        @clear="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="设备名称" prop="equipmentName">
                    <el-input
                        v-model="queryParams.equipmentName"
                        placeholder="请输入设备名称"
                        clearable
                        class="input-with-select"
                        style="width: 240px"
                        size="small"
                        @clear="handleQuery"
                    />
                </el-form-item>
                <el-form-item label="申请日期" v-if="activeIndex === '1'">
                    <el-date-picker
                        v-model="applyDateRange"
                        style="width: 260px"
                        size="small"
                        value-format="yyyy-MM-dd"
                        @change="applyDateChange"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="选择开始日期"
                        end-placeholder="选择结束日期"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="维修日期" v-if="activeIndex === '2'">
                    <el-date-picker
                        v-model="repairDateRange"
                        style="width: 260px"
                        size="small"
                        value-format="yyyy-MM-dd"
                        @change="repairDateChange"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="选择开始日期"
                        end-placeholder="选择结束日期"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="审批状态" prop="status">
                    <el-select
                        v-model="queryParams.status"
                        placeholder="请选择"
                        clearable
                        style="width: 240px"
                        size="small"
                    >
                        <el-option label="待提交" :value="1"></el-option>
                        <el-option label="审批中" :value="2"></el-option>
                        <el-option label="已批准" :value="3"></el-option>
                        <el-option label="已退回" :value="4"></el-option>
                    </el-select>
                </el-form-item>

                <!-- 统一样式 - 查询区域 按钮 -->
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
        </div>
        <!-- 主列表区域 -->
        <div class="a-c-bottom" :class="fullscreen == true ? 'showFullScreen' : ''">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" size="mini" @click="handleAdd(activeIndex)"
                    >添加
                    </el-button
                    >
                    <el-button
                        type="primary"
                        :disabled="!ids.length > 0"
                        size="mini"
                        @click="handlePrint()"
                    >打印
                    </el-button
                    >
                    <el-button
                        type="primary"
                        :disabled="!ids.length > 0"
                        size="mini"
                        @click="handleSubmit(activeIndex)"
                    >提交
                    </el-button
                    >
                    <el-button
                        type="danger"
                        :disabled="!ids.length > 0"
                        size="mini"
                        @click="handleDel(activeIndex)"
                    >删除
                    </el-button
                    >
                </el-col>
                <el-col :span="1.5"></el-col>
                <right-toolbar
                    :showSearch.sync="showSearch"
                    @queryTable="resetQuery"
                    @fullScreen="e_fullScreen"
                    @changeBox="e_changeBox"
                    :boxData="colData"
                ></right-toolbar>
            </el-row>
            <!-- 列表区域 -->
            <el-table
                ref="multipleTable"
                :data="tableData"
                @selection-change="handleSelectionChange"
                @sort-change="sortChange"
            >
                <el-table-column type="selection" width="55" fixed/>
                <el-table-column
                    label="序号"
                    align="center"
                    type="index"
                    width="50"
                    fixed
                />
                <el-table-column
                    prop="equipmentNumber"
                    label="设备编号"
                    sortable="custom"
                    show-overflow-tooltip
                    fixed align="center"
                    v-if="colData[0].istrue"
                />
                <el-table-column
                    prop="equipmentName"
                    label="设备名称"
                    sortable="custom"
                    show-overflow-tooltip align="center"
                    v-if="colData[1].istrue"
                />
                <el-table-column
                    prop="equipmentModel"
                    label="规格型号"
                    sortable="custom"
                    show-overflow-tooltip align="center"
                    v-if="colData[2].istrue"
                />
                <el-table-column
                    prop="userDepartmentName"
                    label="使用部门"
                    sortable="custom"
                    show-overflow-tooltip align="center"
                    v-if="colData[3].istrue"
                />
                <el-table-column
                    prop="position"
                    label="存放地点"
                    sortable="custom"
                    show-overflow-tooltip align="center"
                    v-if="colData[4].istrue"
                />
                <el-table-column
                    prop="administratorName"
                    label="保管人"
                    sortable="custom"
                    show-overflow-tooltip align="center"
                    v-if="colData[5].istrue"
                />
                <template v-if="activeIndex === '1'">
                    <el-table-column
                        prop="applyDate"
                        label="申请日期"
                        sortable="custom"
                        show-overflow-tooltip align="center"
                        v-if="colData[6].istrue"
                    />
                </template>
                <template v-if="activeIndex === '2'">
                    <el-table-column
                        prop="repairDateStr"
                        label="维修日期"
                        sortable="custom"
                        show-overflow-tooltip align="center"
                        v-if="colData[6].istrue"
                    />
                </template>
                <el-table-column
                    prop="repairCompany"
                    label="维修单位"
                    sortable="custom"
                    show-overflow-tooltip align="center"
                    v-if="colData[7].istrue"
                />
                <el-table-column
                    prop="repairCost"
                    label="维修费用"
                    sortable="custom"
                    show-overflow-tooltip align="center"
                    v-if="colData[8].istrue"
                />
                <el-table-column
                    prop="applyPerson"
                    label="申请人"
                    sortable="custom"
                    show-overflow-tooltip align="center"
                    v-if="colData[9].istrue"
                />
                <el-table-column
                    prop="status"
                    label="审批状态"
                    sortable="custom"
                    show-overflow-tooltip align="center"
                    v-if="colData[10].istrue"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === 1">待提交</span>
                        <span v-if="scope.row.status === 2">审批中</span>
                        <span v-if="scope.row.status === 3">已批准</span>
                        <span v-if="scope.row.status === 4">已退回</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="executeStatus"
                    label="执行状态"
                    sortable="custom"
                    show-overflow-tooltip align="center"
                    v-if="colData[10].istrue"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.executeStatus === 0">未执行</span>
                        <span v-if="scope.row.executeStatus === 1">已执行</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="100" fixed="right">
                    <template slot-scope="scope">
                        <template v-if="activeIndex === '1'">
                            <el-button
                                size="mini"
                                type="text"
                                @click="e_look(scope.row, activeIndex)"
                                style="color: #409eff"
                            >查看
                            </el-button>
                            <el-button
                                size="mini"
                                type="text"
                                @click="e_edit(scope.row, activeIndex)"
                                v-if="scope.row.status === 1 || scope.row.status === 4"
                                style="color: #409eff"
                            >修改
                            </el-button>
                            <el-button
                                size="mini"
                                type="text"
                                @click="e_carry(scope.row)"
                                v-if="activeIndex === '1' && scope.row.status === 3 && scope.row.executeStatus === 0"
                                style="color: #409eff"
                            >执行
                            </el-button>
                        </template>
                        <template v-if="activeIndex === '2'">
                            <el-button
                                size="mini"
                                type="text"
                                @click="e_look(scope.row, activeIndex)"
                                style="color: #409eff"
                            >查看
                            </el-button
                            >
                            <el-button
                                size="mini"
                                type="text"
                                @click="e_edit(scope.row, activeIndex)"
                                v-if="scope.row.status === 1 || scope.row.status === 4"
                                style="color: #409eff"
                            >修改
                            </el-button
                            >
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
        <!--添加/查看-->
        <createRepair
            v-if="showrepair"
            ref="repair"
            @close="showrepair = false"
        ></createRepair>
        <!--添加/查看-->
        <carryRepair
            v-if="showrcarry"
            ref="carry"
            @close="showrcarry = false"
        ></carryRepair>
    </div>
</template>

<script>
    import createRepair from './dialog/createRepair'
    import carryRepair from './dialog/carryRepair'
    import {
        getApplyList,
        getRepairApplyDetail,
        delRepairApply,
        submitRepairApply,
        getApplyRecordList,
        getRecordIdApplyDetail,
        delRepairRecord,
        submitRepairRecord
    } from '@/api/resources/deviceManagement/index.js'

    export default {
        name: 'index',
        components: { createRepair, carryRepair },
        data() {
            return {
                activeIndex: '1',
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    equipmentName: '',
                    equipmentNumber: '',
                    applyDateBegin: '',
                    applyDateEnd: '',
                    status: null,
                    orderByColumn: '',
                    isAsc: '',
                    repairDateBegin: '',
                    repairDateEnd: ''
                },
                showSearch: true,
                applyDateRange: [],
                repairDateRange: [],
                dateValue: [],
                dateValue1: [],
                total: 0,
                colData: [
                    { title: '设备编号', istrue: true },
                    { title: '设备名称', istrue: true },
                    { title: '规格型号', istrue: true },
                    { title: '使用部门', istrue: true },
                    { title: '存放地点', istrue: true },
                    { title: '保管人', istrue: true },
                    { title: '申请日期', istrue: true },
                    { title: '维修单位', istrue: true },
                    { title: '维修费用', istrue: true },
                    { title: '申请人', istrue: true },
                    { title: '审批状态', istrue: true }
                ],
                tableData: [],
                ids: [],
                fullscreen: false,
                showrepair: false,
                showrcarry: false,
                selection: []
            }
        },
        mounted() {
            this.getList()
        },
        methods: {
            handleSelect(v) {
                this.resetForm('queryParams')
                this.activeIndex = v
                if (v === '2') {
                    this.$set(this.colData, 6, { title: '维修日期', istrue: true })
                } else if (v === '1') {
                    this.$set(this.colData, 6, { title: '申请日期', istrue: true })
                }
                this.getList()
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.repairDateRange = []
                this.applyDateRange = []
                this.queryParams.applyDateBegin = undefined
                this.queryParams.applyDateEnd = undefined
                this.queryParams.repairDateBegin = undefined
                this.queryParams.repairDateEnd = undefined
                this.resetForm('queryParams')
                this.handleQuery()
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1
                this.getList()
            },
            e_fullScreen() {
                this.fullscreen = !this.fullscreen
            },
            e_changeBox(list) {
                let arrList = this.colData.filter((i) => !list.includes(i.title))
                let titleList = arrList.map((item) => {
                    return item.title
                })
                this.colData.filter((i) => {
                    if (titleList.indexOf(i.title) != -1) {
                        i.istrue = false
                    } else {
                        i.istrue = true
                    }
                })
            },
            applyDateChange(v) {
                if (this.applyDateRange) {
                    this.queryParams.applyDateBegin = v[0]
                    this.queryParams.applyDateEnd = v[1]
                } else {
                    this.queryParams.applyDateBegin = ''
                    this.queryParams.applyDateEnd = ''
                }
            },
            repairDateChange(v) {
                if (this.repairDateRange) {
                    this.queryParams.repairDateBegin = v[0]
                    this.queryParams.repairDateEnd = v[1]
                } else {
                    this.queryParams.repairDateBegin = ''
                    this.queryParams.repairDateEnd = ''
                }
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.selection = selection
                this.ids = selection.map((item) => item.id)
            },
            // 排序
            sortChange(column, prop, order) {
                this.queryParams.orderByColumn = this.toLine(column.prop)
                if (column.order === 'descending') {
                    this.queryParams.isAsc = 'desc'
                } else if (column.order === 'ascending') {
                    this.queryParams.isAsc = 'asc'
                } else {
                    this.queryParams.isAsc = ''
                }
                this.getList()
            },
            toLine(name) {
                return name.replace(/([A-Z])/g, '_$1').toLowerCase()
            },
            getList() {
                if (this.activeIndex === '1') {
                    getApplyList(this.queryParams).then((res) => {
                        this.tableData = res.data.list
                        this.total = res.data.total
                    })
                } else {
                    getApplyRecordList(this.queryParams).then((res) => {
                        this.tableData = res.data.list
                        this.total = res.data.total
                    })
                }
            },
            // 添加
            handleAdd(index) {
                if (index === '1') {
                    this.showrepair = true
                    this.$nextTick(() => {
                        this.$refs.repair.init('add')
                    })
                } else if (index === '2') {
                    this.showrcarry = true
                    this.$nextTick(() => {
                        this.$refs.carry.init('add')
                    })
                }
            },
            // 执行
            e_carry(row) {
                this.showrcarry = true
                this.$nextTick(() => {
                    this.$refs.carry.init('carry', row)
                })
            },
            // 查看
            e_look(row, index) {
                if (index === '1') {
                    this.getlistDetail(row.id, 'show')
                } else {
                    this.getrecordDetail(row.id, 'show')
                }
            },
            // 修改
            e_edit(row, index) {
                if (index === '1') {
                    this.getlistDetail(row.id, 'update')
                } else {
                    this.getrecordDetail(row.id, 'update')
                }
            },
            // 获取申请详情
            getlistDetail(id, type) {
                this.showrepair = true
                getRepairApplyDetail(id).then((res) => {
                    this.$nextTick(() => {
                        this.$refs.repair.init(type, res.data)
                    })
                })
            },
            // 获取记录详情
            getrecordDetail(id, type) {
                this.showrcarry = true
                getRecordIdApplyDetail(id).then((res) => {
                    this.$nextTick(() => {
                        this.$refs.carry.init(type, res.data)
                    })
                })
            },
            // 删除
            handleDel(index) {
                let list = this.selection.filter(item => {
                    return item.status == 2 || item.status == 3
                })
                if (list.length != 0) {
                    this.$message.error('审批中或已批准数据不允许删除')
                    return
                }
                var ids = this.ids.join(',')
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (index === '1') {
                        delRepairApply(ids).then((res) => {
                            if (res.code == 200) {
                                this.$message.success('删除成功')
                                this.getList()
                            } else {
                                this.$message.info(res.msg)
                            }
                        })
                    } else {
                        delRepairRecord(ids).then((res) => {
                            if (res.code == 200) {
                                this.$message.success('删除成功')
                                this.getList()
                            } else {
                                this.$message.info(res.msg)
                            }
                        })
                    }
                })
            },
            // 提交
            handleSubmit(index) {
                let arr = []
                this.selection.map((item) => {
                    if (item.status != 1 && item.status != 4) {
                        arr.push(item)
                    }
                })
                if(arr.length !== 0){
                    this.$message.info('只能对待提交状态的数据进行该操作')
                    return
                }
                var ids = this.ids.join(',')
                this.$confirm('确定提交选中的数据吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (index === '1') {
                        submitRepairApply(ids).then((res) => {
                            if (res.code == 200) {
                                this.$message.success('提交成功')
                                this.getList()
                            } else {
                                this.$message.info(res.msg)
                            }
                        })
                    } else {
                        submitRepairRecord(ids).then((res) => {
                            if (res.code == 200) {
                                this.$message.success('提交成功')
                                this.getList()
                            } else {
                                this.$message.info(res.msg)
                            }
                        })
                    }
                })
            },
            handlePrint() {
                if (this.activeIndex == 1) {
                    //设备维修申请
                    POBrowser.openWindowModeless(
                        window.globalEnv.VUE_APP_BASE_API +
                        '/equipment/pageOffice/printRepairApply?ids=' +
                        this.ids.join(','),
                        'width=1440px;height=860px'
                    )
                } else if (this.activeIndex == 2) {
                    POBrowser.openWindowModeless(
                        window.globalEnv.VUE_APP_BASE_API +
                        '/equipment/pageOffice/printRepairRecord?ids=' +
                        this.ids.join(','),
                        'width=1440px;height=860px'
                    )
                }
            }
        }
    }
</script>

<style scoped>
</style>
