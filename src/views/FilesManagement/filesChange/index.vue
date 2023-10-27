<template>
    <div class="app-container">
        <!-- 统一样式 - 查询区域 -->
        <div class="a-c-top" v-show="showSearch">
            <!-- 表单 -->
            <el-form :inline="true" :model="queryParams" ref="queryParams" class="demo-form-inline" v-show="showSearch"
                label-width="100px">
                <el-form-item label="文件编号" prop="fileNumber">
                    <el-input v-model="queryParams.fileNumber" placeholder="请输入文件编号" clearable @clear="handleQuery"
                        class="input-with-select" style="width: 240px" size="small" />
                </el-form-item>
                <el-form-item label="文件名称" prop="fileName">
                    <el-input v-model="queryParams.fileName" placeholder="请输入文件名称" clearable @clear="handleQuery"
                        class="input-with-select" style="width: 240px" size="small" />
                </el-form-item>
                <el-form-item label="申请状态" prop="status">
                    <el-select v-model="queryParams.status" placeholder="请选择" style="width: 240px" size="small" clearable>
                        <el-option label="待提交" :value="1"></el-option>
                        <el-option label="审批中" :value="2"></el-option>
                        <el-option label="已批准" :value="3"></el-option>
                        <el-option label="已退回" :value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请日期">
                    <el-date-picker v-model="dateRange" style="width: 260px" size="small" value-format="yyyy-MM-dd"
                        @change="ondateChange" type="daterange" range-separator="-" start-placeholder="选择开始日期"
                        end-placeholder="选择结束日期"></el-date-picker>
                </el-form-item>
                <!-- 统一样式 - 查询区域 按钮 -->
                <div class="a-c-t-btnarea">
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索
                        </el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery('filesForm')">重置
                        </el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <!-- 主列表区域 -->
        <div class="a-c-bottom" :class="fullscreen == true ? 'showFullScreen' : ''">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" size="mini" @click="handleAdd">添加
                    </el-button>
                    <el-button type="primary" size="mini" :disabled="!this.multipleSelection.length > 0"
                        @click="handlePrint">打印
                    </el-button>
                    <el-button type="warning" size="mini" @click="handleExport">导出
                    </el-button>
                </el-col>
                <el-col :span="1.5"></el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="resetQuery" @fullScreen="e_fullScreen"
                    @changeBox="e_changeBox" :boxData="colData"></right-toolbar>
            </el-row>
            <!-- 列表区域 -->
            <el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange"
                @sort-change="sortChange">
                <el-table-column type="selection" width="55" fixed />
                <el-table-column label="序号" align="center" type="index" width="50" fixed />
                <el-table-column prop="fileName" label="文件名称" sortable="custom" show-overflow-tooltip
                    v-if="colData[0].istrue" align="center" />
                <el-table-column prop="fileNumber" label="文件编号" sortable="custom" show-overflow-tooltip
                    v-if="colData[1].istrue" align="center" />
                <el-table-column prop="reason" label="修订原因" sortable="custom" show-overflow-tooltip v-if="colData[2].istrue"
                    align="center" />
                <el-table-column prop="departmentName" label="申请部门" sortable="custom" show-overflow-tooltip
                    v-if="colData[3].istrue" align="center" />
                <el-table-column prop="applyUser" label="申请人员" sortable="custom" show-overflow-tooltip
                    v-if="colData[4].istrue" align="center" />
                <el-table-column prop="applyDate" label="申请日期" sortable="custom" show-overflow-tooltip
                    v-if="colData[5].istrue" align="center" />
                <el-table-column prop="status" label="申请状态" sortable="custom" show-overflow-tooltip v-if="colData[6].istrue"
                    align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === 1">待提交</span>
                        <span v-if="scope.row.status === 2">审批中</span>
                        <span v-if="scope.row.status === 3">已批准</span>
                        <span v-if="scope.row.status === 4">已退回</span>
                    </template>
                </el-table-column>
                <el-table-column prop="approvalUser" label="审批人" sortable="custom" show-overflow-tooltip
                    v-if="colData[7].istrue" align="center" />


                <el-table-column label="操作" align="center" width="200" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="e_look(scope.row)">查看</el-button>
                        <el-button size="mini" type="text" v-if="scope.row.status === 1" @click="e_edit(scope.row)">修改
                        </el-button>
                        <el-button size="mini" type="text" v-if="scope.row.status === 1" @click="e_del(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>
        <!--新增/修改-->
        <craeteFile v-if="showFile" ref="filefs" @close="showFile = false"></craeteFile>
    </div>
</template>

<script>
import craeteFile from './dialog/craeteFile'
import {
    getchangeApplyList,
    getChangeApplydetail,
    deleteChangeApply,
    exportChangeApply
} from '@/api/filesManagement/filesManagement'

export default {
    name: 'externalfiles',
    components: { craeteFile },
    data() {
        return {
            showSearch: true,
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                fileName: '',
                fileNumber: '',
                status: null,
                dateStart: '',
                dateEnd: '',
                orderByColumn: '',
                orderByType: ''
            },
            dateRange: [],
            dateValue: [],
            options: [],
            fullscreen: false,
            showFile: false,
            multiple: true,
            total: 0,
            colData: [
                { title: '文件名称', istrue: true },
                { title: '文件编号', istrue: true },
                { title: '修订原因', istrue: true },
                { title: '申请部门', istrue: true },
                { title: '申请人员', istrue: true },
                { title: '申请日期', istrue: true },
                { title: '申请状态', istrue: true },
                { title: '审批人', istrue: true },

            ],
            tableData: [],
            ids: [],
            multipleSelection: []
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        e_fullScreen() {
            this.fullscreen = !this.fullscreen
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
        ondateChange(v) {
            if (this.dateRange) {
                this.queryParams.dateStart = v[0]
                this.queryParams.dateEnd = v[1]
            } else {
                this.queryParams.dateStart = ''
                this.queryParams.dateEnd = ''
            }
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = []
            this.queryParams.dateStart = undefined
            this.queryParams.dateEnd = undefined
            this.resetForm('queryParams')
            this.handleQuery()
        },
        /** 搜索按钮操作 */
        handleQuery() {
            if (this.dateValue === null) {
                this.queryParams.dateStart = undefined
                this.queryParams.dateEnd = undefined
            }
            this.queryParams.pageNum = 1
            this.getList()
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.multipleSelection = selection
        },
        getList() {
            getchangeApplyList(this.queryParams).then(res => {
                this.tableData = res.data.list
                this.total = res.data.total
            })
        },
        // 排序
        sortChange(column, prop, order) {
            this.queryParams.orderByColumn = this.toLine(column.prop)
            if (column.order === 'descending') {
                this.queryParams.orderByType = 'DESC'
            } else if (column.order === 'ascending') {
                this.queryParams.orderByType = 'ASC'
            } else {
                this.queryParams.orderByType = ''
            }
            this.getList()
        },
        toLine(name) {
            return name.replace(/([A-Z])/g, '_$1').toLowerCase()
        },
        // 添加
        handleAdd() {
            this.showFile = true
            this.$nextTick(() => {
                this.$refs.filefs.init('add')
            })
        },
        // 修改
        e_edit(row) {
            this.showFile = true
            getChangeApplydetail(row.id).then(res => {
                this.$nextTick(() => {
                    this.$refs.filefs.init('update', res.data)
                })
            })
        },
        // 查看
        e_look(row) {
            this.showFile = true
            getChangeApplydetail(row.id).then(res => {
                this.$nextTick(() => {
                    this.$refs.filefs.init('show', res.data)
                })
            })
        },
        // 删除
        e_del(row) {
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteChangeApply(row.id).then(res => {
                    if (res.code == 200) {
                        this.$message.success('删除成功')
                        this.getList()
                    } else {
                        this.$message.info(res.msg)
                    }
                })
            })
        },
        //导出
        handleExport() {
            this.queryParams.idStr = this.ids.join(',')
            exportChangeApply(this.queryParams).then(res => {
                if (res.code === 200) {
                    this.downLoadFile(res.msg)
                }
            })
        },
        //pageOffice 打印
        handlePrint() {
            let array = this.multipleSelection.map(item => item.id)
            if (!array || array.length == 0) {
                return false
            }
            POBrowser.openWindowModeless(
                window.globalEnv.VUE_APP_BASE_API +
                '/fileManage/pageOffice/printChangeApply?ids=' + array.join(','),
                'width=1440px;height=860px'
            )
        }
    }
}
</script>

<style></style>
