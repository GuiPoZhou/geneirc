<template>
    <el-dialog title="选择设备"
               :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
               :close-on-click-modal="false" width="70%" @close="cancelbtn" @open="open" append-to-body>
        <div class="app-container" style="height: 100%">
            <!-- 统一样式 - 查询区域 -->
            <div class="a-c-top">
                <!-- 表单 -->
                <el-form
                    :inline="true"
                    :model="queryParams"
                    ref="queryParams"
                    class="demo-form-inline"
                    label-width="100px"
                >
                    <el-form-item label="设备编号" prop="equipmentNumber">
                        <el-input
                            v-model="queryParams.equipmentNumber"
                            placeholder="请输入设备编号"
                            clearable
                            class="input-with-select"
                            style="width: 240px"
                        />
                    </el-form-item>
                    <el-form-item label="设备名称" prop="equipmentName">
                        <el-input
                            v-model="queryParams.equipmentName"
                            placeholder="请输入设备名称"
                            clearable
                            class="input-with-select"
                            style="width: 240px"
                        />
                    </el-form-item>
                    <el-form-item label="使用部门" prop="userDepartment">
                        <treeselect style="width: 240px" v-model="queryParams.userDepartment" :options="deptOptions"
                                    :show-count="true" placeholder="请选择部门"/>
                    </el-form-item>
                    <el-form-item label="存放地点" prop="position">
                        <el-input
                            v-model="queryParams.position"
                            placeholder="请输入存放地点"
                            clearable
                            class="input-with-select"
                            style="width: 240px"
                        />
                    </el-form-item>
                    <el-form-item label="设备状态" prop="status">
                        <el-select v-model="queryParams.status" placeholder="请选择" style="width: 240px">
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
                            <el-button
                                type="primary"
                                icon="el-icon-search"
                                size="mini"
                                @click="handleQuery"
                            >搜索
                            </el-button
                            >
                            <el-button
                                icon="el-icon-refresh"
                                size="mini"
                                @click="resetQuery"
                            >重置
                            </el-button
                            >
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <!--分类-->
            <el-row :gutter="20">
                <el-col :span="6">
                    <catalogueTree @getTreedata="getTreedata" @handleData="handleData"></catalogueTree>
                </el-col>
                <el-col :span="18">
                    <div style="margin-top: 10px;">
                        <el-table
                            ref="multipleTable"
                            :data="tableData"
                            stripe
                            border
                            @selection-change="handleSelectionChange"
                            @sort-change="sortChange"
                            :row-key="getRowKey"
                        >
                            <el-table-column type="selection" :reserve-selection="true" width="55"
                                             v-if="typeofs !== 'applys'"/>
                            <el-table-column type="index" align="center" width="35" v-else>
                                <template slot-scope="scope">
                                    <el-radio v-model="currentRowId" :label="scope.row.id"
                                              @change="changeRedio($event,scope.row)">&nbsp;
                                    </el-radio>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="序号"
                                align="center"
                                type="index"
                                width="50"
                            />
                            <el-table-column prop="equipmentNumber" label="设备编号" sortable="custom"
                                             show-overflow-tooltip width="100"/>
                            <el-table-column prop="equipmentName" label="设备名称" sortable="custom"
                                             show-overflow-tooltip width="100"/>
                            <el-table-column prop="equipmentModel" label="规格型号" sortable="custom"
                                             show-overflow-tooltip/>
                            <el-table-column prop="unit" label="计量单位" sortable="custom"
                                             show-overflow-tooltip/>
                            <el-table-column prop="manufacturer" label="生产厂家" sortable="custom"
                                             show-overflow-tooltip/>
                            <el-table-column prop="userDepartmentName" label="使用部门" sortable="custom"
                                             show-overflow-tooltip/>
                            <el-table-column prop="position" label="存放地点" sortable="custom"
                                             show-overflow-tooltip/>
                            <el-table-column prop="administrator" label="保管人" sortable="custom"
                                             show-overflow-tooltip/>
                            <el-table-column prop="calibrationCycle" label="溯源周期（月）" sortable="custom"
                                             show-overflow-tooltip/>
                            <el-table-column prop="lastCalibrationDate" label="上次检定校准日期" sortable="custom"
                                             show-overflow-tooltip/>
                            <el-table-column prop="loseCalibrationDate" label="检定校准失效日期" sortable="custom"
                                             show-overflow-tooltip/>
                            <el-table-column prop="status" label="设备状态" sortable="custom"
                                             show-overflow-tooltip>
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
                        </el-table>
                        <pagination
                            v-show="total > 0"
                            :total="total"
                            :page.sync="queryParams.pageNum"
                            :limit.sync="queryParams.pageSize"
                            @pagination="getList"
                        />
                    </div>
                </el-col>
            </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleOk" v-if="typeofs !== 'applys'">确定</el-button>
            <el-button type="primary" @click="handleOkapplys" v-else>确定</el-button>
            <el-button @click="cancelbtn">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import catalogueTree from './catalogueTree'
    import { treeselect } from '@/api/system/dept'
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import {
        getOptionList,
        getBookList
    } from '@/api/resources/deviceManagement/index.js'

    export default {
        name: 'addEquipment',
        components: { catalogueTree, Treeselect },
        props: { typeofs: String },
        data() {
            return {
                dialogShow: false,
                isFullScreen: true,
                screenName: 'fullScreen',
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    orderByColumn: '',
                    orderByType: '',
                    equipmentName: '',
                    equipmentNumber: '',
                    userDepartment: null,
                    position: '',
                    status: null,
                    treeId: null,
                    businessCode: '',
                    idList: [],
                    planYear: ''
                },
                total: 0,
                ids: [],
                showbook: false,
                // 部门树选项
                deptOptions: [],
                treeList: [],
                defaultProps: {
                    children: 'childList',
                    label: 'nodeName'
                },
                treedata: [],
                tableData: [],
                multipleSelection: [],
                currentRowId: null,
                selectApplys: {}
            }
        },
        mounted() {
            this.getTreeselect()
        },
        methods: {
            // 指定一个key标识这一行的数据
            getRowKey(row) {
                return row.id
            },
            e_changeBox(type) {
                this.isFullScreen = type
            },
            open() {
                this.queryParams.businessCode = this.typeofs
            },
            // 切换单选框  methods 中
            changeRedio(event, row) {
                console.log('event,row:', event, row)
                this.selectApplys = row
                this.currentRowId = event
            },
            init(data, planYear) {
                this.dialogShow = true
                if (this.typeofs === 'applys') {
                } else {
                    this.queryParams.planYear = planYear
                    if (data.length !== 0) {
                        this.queryParams.idList = data.map(item => {
                            return item.equipmentId
                        })
                    }
                }
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
            /** 查询部门下拉树结构 */
            getTreeselect() {
                treeselect().then((response) => {
                    console.log(response)
                    this.deptOptions = response.data
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
                this.addmultiple = false
                this.queryParams.treeId = data.id
                this.getList()
            },
            // 获取列表
            getList() {
                if (this.typeofs === 'applys') {
                    getBookList(this.queryParams).then(res => {
                        this.tableData = res.data.list
                        this.total = res.data.total
                    })
                } else {
                    getOptionList(this.queryParams).then(res => {
                        this.tableData = res.data.list
                        this.total = res.data.total
                    })
                }
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
            handleOkapplys() {
                this.$emit('choiceEquipment', this.selectApplys)
                this.cancelbtn()
            },
            handleOk() {
                let arrnew = this.multipleSelection.map((item, index) => {
                    if (this.typeofs === 'EQUIPMENT_CHECK_PLAN') {
                        return Object.assign({}, {
                            'equipmentId': item.id,
                            'equipmentNumber': item.equipmentNumber,
                            'equipmentName': item.equipmentName,
                            'equipmentModel': item.equipmentModel,
                            'calibrationCycle': item.calibrationCycle,
                            'loseCalibrationDate': item.loseCalibrationDate,
                            'executeDate': '添加',
                            'liablePerson': '',
                            'remark': '',
                            'dateList': []
                        })
                    } else if (this.typeofs === 'EQUIPMENT_CALIBRATION_PLAN') {
                        return Object.assign({}, {
                            'equipmentId': item.id,
                            'equipmentNumber': item.equipmentNumber,
                            'equipmentName': item.equipmentName,
                            'equipmentModel': item.equipmentModel,
                            'manufacturer': item.manufacturer,
                            'factoryNumber': item.factoryNumber,
                            'calibrationMode': item.calibrationMode,
                            'lastCalibrationDate': item.lastCalibrationDate,
                            'traceCompany': '',
                            'executeDate': '添加',
                            'dateList': []
                        })
                    } else {
                        return Object.assign({}, {
                            'equipmentId': item.id,
                            'equipmentNumber': item.equipmentNumber,
                            'equipmentName': item.equipmentName,
                            'equipmentModel': item.equipmentModel,
                            'maintainCycle': '',
                            'maintainContent': '',
                            'executeDate': '添加',
                            'liablePerson': '',
                            'remark': '',
                            'dateList': []
                        })
                    }
                })
                if (arrnew.length === 0) {
                    this.$message.error('请选择设备')
                } else {
                    this.$emit('choiceEquipment', arrnew)
                    this.cancelbtn()
                }
            },
            cancelbtn() {
                this.$emit('close')
            }
        }
    }
</script>

<style scoped lang="less">
    /deep/ .el-form--inline .el-form-item {
        width: auto;
    }

    /deep/ .el-form-item__content {
        width: auto;
    }

    aside {
        padding: 0;
    }

    .ant-layout {
        background: #ffffff;
    }

    /deep/ .el-dialog__body .el-table {
        background: #ffffff;
    }

    /deep/ .el-radio__input {
        position: relative;
        left: 0px;
    }
</style>
