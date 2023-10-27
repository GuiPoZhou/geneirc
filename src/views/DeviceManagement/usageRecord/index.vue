<template>
    <div class="app-container">
        <!-- 统一样式 - 查询区域 -->
        <div class="a-c-top" v-show="showSearch">
            <!-- 表单 -->
            <el-form :inline="true" :model="queryParams" ref="queryParams" class="demo-form-inline" v-show="showSearch"
                label-width="100px">
                <el-form-item label="设备编号" prop="equipmentNumber">
                    <el-input v-model="queryParams.equipmentNumber" placeholder="请输入设备编号" clearable
                        class="input-with-select" style="width: 240px" size="small" @clear="handleQuery" />
                </el-form-item>
                <el-form-item label="设备名称" prop="equipmentName">
                    <el-input v-model="queryParams.equipmentName" placeholder="请输入设备名称" clearable class="input-with-select"
                        style="width: 240px" size="small" @clear="handleQuery" />
                </el-form-item>
                <el-form-item label="使用部门" prop="userDepartmentName">
                    <el-input v-model="queryParams.userDepartmentName" placeholder="请输入部门" clearable
                        class="input-with-select" style="width: 240px" size="small" @clear="handleQuery" />
                </el-form-item>
                <el-form-item label="存放地点" prop="position">
                    <el-input v-model="queryParams.position" placeholder="请输入存放地点" clearable class="input-with-select"
                        style="width: 240px" size="small" @clear="handleQuery" />
                </el-form-item>
                <el-form-item label="设备状态" prop="status">
                    <el-select v-model="queryParams.status" placeholder="请选择" clearable style="width: 240px" size="small">
                        <el-option label="正常" :value="1"></el-option>
                        <el-option label="停用" :value="2"></el-option>
                        <el-option label="维修" :value="3"></el-option>
                        <el-option label="保养" :value="4"></el-option>
                        <el-option label="报废" :value="5"></el-option>
                        <el-option label="封存" :value="6"></el-option>
                        <el-option label="核查" :value="7"></el-option>
                        <el-option label="故障" :value="8"></el-option>
                    </el-select>
                </el-form-item>

                <!-- 统一样式 - 查询区域 按钮 -->
                <div class="a-c-t-btnarea">
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索
                        </el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置
                        </el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="a-c-bottom">
            <el-row :gutter="10">
                <el-col :span="4" :xs="24">
                    <!--分类-->
                    <catalogueTree @getTreedata="getTreedata" @handleData="handleData"></catalogueTree>
                </el-col>
                <el-col :span="20" :xs="24">
                    <div :class="fullscreen == true ? 'showFullScreen' : ''"
                        style="padding-bottom:10px; padding-right: 5px">
                        <el-row :gutter="10" class="searchbox">
                            <el-col :span="1.5">
                                <el-button type="primary" size="mini" :disabled="!ids.length > 0">打印</el-button>
                            </el-col>
                            <el-col :span="1.5"></el-col>
                            <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="resetQuery" @fullScreen="e_fullScreen"
                                @changeBox="e_changeBox" :boxData="colData"></right-toolbar> -->
                        </el-row>
                        <el-table border ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange"
                            @sort-change="sortChange" :height="innerHeight">
                            <el-table-column type="selection" width="55" fixed />
                            <el-table-column label="序号" align="center" type="index" width="50" fixed />
                            <el-table-column prop="equipmentNumber" label="设备编号" sortable="custom" show-overflow-tooltip
                                width="100" fixed align="center" v-if="colData[0].istrue" />
                            <el-table-column prop="equipmentName" label="设备名称" sortable="custom" show-overflow-tooltip
                                width="100" align="center" v-if="colData[1].istrue" />
                            <el-table-column prop="equipmentModel" label="规格型号" sortable="custom" show-overflow-tooltip
                                align="center" v-if="colData[2].istrue" />
                            <el-table-column prop="unit" label="计量单位" sortable="custom" show-overflow-tooltip align="center"
                                v-if="colData[3].istrue" />
                            <el-table-column prop="manufacturer" label="生产厂家" sortable="custom" show-overflow-tooltip
                                align="center" v-if="colData[4].istrue" />
                            <el-table-column prop="userDepartmentStr" label="使用部门" sortabl e="custom" align="center"
                                show-overflow-tooltip v-if="colData[5].istrue">
                            </el-table-column>
                            <el-table-column prop="position" label="存放地点" sortable="custom" show-overflow-tooltip
                                align="center" v-if="colData[6].istrue">
                            </el-table-column>
                            <el-table-column prop="administrator" label="保管人" sortable="custom" show-overflow-tooltip
                                align="center" v-if="colData[7].istrue" />
                            <el-table-column prop="calibrationCycle" label="校准检定周期（月）" sortable="custom" align="center"
                                show-overflow-tooltip v-if="colData[8].istrue" />
                            <el-table-column prop="lastCalibrationDateStr" label="上次检定校准日期" sortable="custom" align="center"
                                show-overflow-tooltip v-if="colData[9].istrue" />
                            <el-table-column prop="loseCalibrationDateStr" label="检定校准失效日期" sortable="custom" align="center"
                                show-overflow-tooltip v-if="colData[10].istrue" />
                            <el-table-column prop="status" label="设备状态" sortable="custom" show-overflow-tooltip
                                align="center" v-if="colData[11].istrue">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.status === 1">正常</span>
                                    <span v-if="scope.row.status === 2">停用</span>
                                    <span v-if="scope.row.status === 3">维修</span>
                                    <span v-if="scope.row.status === 4">保养</span>
                                    <span v-if="scope.row.status === 5">报废</span>
                                    <span v-if="scope.row.status === 6">封存</span>
                                    <span v-if="scope.row.status === 7">核查</span>
                                    <span v-if="scope.row.status === 8">故障</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="操作" align="center" width="100" fixed="right">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="text" @click="e_add(scope.row)">添加</el-button>
                                    <el-button size="mini" type="text" @click="e_look(scope.row)">查看</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <pagination v-show="total > 0" :total="total" :pageSizes="[20, 30, 50, 100]"
                            :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
                    </div>
                </el-col>
            </el-row>
        </div>
        <!--新增-->
        <editRecord v-if="showrecord" ref="record" @close="showrecord = false"></editRecord>
        <!--查看-->
        <recordLook v-if="showlook" ref="look" @close="showlook = false"></recordLook>
    </div>
</template>

<script>
import catalogueTree from '../components/catalogueTree'
import editRecord from './dialog/editRecord'
import recordLook from './dialog/recordLook'
import { getEquipmentUseRecordList } from '@/api/resources/deviceManagement/index.js'

export default {
    name: 'index',
    components: { catalogueTree, editRecord, recordLook },
    data() {
        return {
            showSearch: true,
            queryParams: {
                pageNum: 1,
                pageSize: 50,
                equipmentName: '',
                equipmentNumber: '',
                userDepartmentName: '',
                position: '',
                status: null,
                treeId: null,
                orderByColumn: '',
                isAsc: ''
            },
            total: 0,
            treeList: [],
            fullscreen: false,
            multiple: false,
            tableData: [],
            colData: [
                { title: '设备编号', istrue: true },
                { title: '设备名称', istrue: true },
                { title: '规格型号', istrue: true },
                { title: '计量单位', istrue: true },
                { title: '生产厂家', istrue: true },
                { title: '使用部门', istrue: true },
                { title: '存放地点', istrue: true },
                { title: '保管人', istrue: true },
                { title: '校准检定周期（月）', istrue: true },
                { title: '上次检定校准日期', istrue: true },
                { title: '检定校准失效日期', istrue: true },
                { title: '设备状态', istrue: true }
            ],
            ids: [],
            showrecord: false,
            showlook: false,
            innerHeight:0,
        }
    },
    mounted() {
        this.getList()
    },
    created(){
        this.e_getInnerHeight()
        document.addEventListener('resize',this.e_getInnerHeight)
    },
    methods: {
        e_getInnerHeight(){
            this.innerHeight = window.innerHeight -320
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.queryParams.treeId = null
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
        handleSelectionChange(val) {
            this.multipleSelection = val
            this.ids = val.map(item => item.id)
        },
        // 获取书列表
        getTreedata(data) {
            this.treeList = data
        },
        // 获取点击后的树列表
        handleData(data) {
            this.queryParams.treeId = data.id
            this.getList()
        },
        // 获取列表
        getList() {
            getEquipmentUseRecordList(this.queryParams).then(res => {
                this.tableData = res.data.list
                this.total = res.data.total
            })
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
        // 新增
        e_add(row) {
            this.showrecord = true
            this.$nextTick(() => {
                this.$refs.record.init('add', row)
            })
        },
        // 查看
        e_look(row) {
            this.showlook = true
            this.$nextTick(() => {
                this.$refs.look.init(row.id)
            })
        }
    }
}
</script>

<style scoped lang="less">
.searchbox {
    margin: 10px 0;
}

aside {
    padding: 0;
}

.ant-layout {
    background: #ffffff;
    height: 100%;
}

/deep/ .el-dialog--center {
    text-align: left !important;
}
</style>
