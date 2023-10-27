<template>
    <div>
        <BoDialog :diaLogShow="dialogShow"
                  :diaLogTitle="titles"
                  diaLogWidth="60%" @close="cancelbtn">
            <template slot="bologbody">
                <el-form
                    :model="queryParams"
                    ref="queryForm"
                    :inline="true"
                    :prop="queryParams"
                    style="margin: 15px 0 0 0"
                    :rules="rules"
                    label-width="120px"
                >
                    <el-tabs v-model="activeName" type="card">
                        <el-tab-pane label="内审计划" name="first">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="计划编号" prop="serial">
                                        <el-input
                                            placeholder="请输入计划编号"
                                            v-model="queryParams.serial"
                                            :disabled="isdisable"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="计划年度" prop="year">
                                        <el-date-picker
                                            v-model="queryParams.year"
                                            type="year"
                                            value-format="yyyy"
                                            :disabled="isdisable"
                                            placeholder="选择计划年度"
                                        >
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="编制人员" prop="compilerName">
                                        <el-input
                                            placeholder="请输入编制人员"
                                            v-model="queryParams.compilerName"
                                            :disabled="isdisable"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="编制日期" prop="compilerTime">
                                        <el-date-picker
                                            v-model="queryParams.compilerTime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            type="datetime"
                                            placeholder="选择日期"
                                            style="width: 100%"
                                            :disabled="isdisable"
                                        ></el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="内审目的" prop="purpose">
                                        <el-input
                                            type="textarea"
                                            :rows="2"
                                            placeholder="请输入内容"
                                            v-model="queryParams.purpose"
                                            :disabled="isdisable"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="内审范围" prop="internalAuditScope">
                                        <el-input
                                            type="textarea"
                                            :rows="2"
                                            placeholder="请输入内容"
                                            v-model="queryParams.internalAuditScope"
                                            :disabled="isdisable"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="内审依据" prop="basis">
                                        <el-input
                                            type="textarea"
                                            :rows="2"
                                            placeholder="请输入内容"
                                            v-model="queryParams.basis"
                                            :disabled="isdisable"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="审核办法" prop="method">
                                        <el-checkbox-group
                                            v-model="queryParams.method"
                                            :disabled="isdisable"
                                        >
                                            <el-radio-group
                                                v-model="queryParams.method"
                                                :disabled="isdisable"
                                            >
                                                <el-radio :label="1">抽样检查有关资料、记录</el-radio>
                                                <el-radio :label="2">现场检测</el-radio>
                                            </el-radio-group>
                                        </el-checkbox-group>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="评审内容" prop="content">
                                        <el-input
                                            type="textarea"
                                            :rows="2"
                                            placeholder="请输入内容"
                                            v-model="queryParams.content"
                                            :disabled="isdisable"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="发放范围" prop="distributionScope">
                                        <el-input
                                            type="textarea"
                                            :rows="2"
                                            placeholder="请输入内容"
                                            v-model="queryParams.distributionScope"
                                            :disabled="isdisable"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <div class="tabtit">
                                <span>参加人员</span>
                                <el-button type="primary" @click="addPersonal" :disabled="isdisable"
                                >添加
                                </el-button>
                            </div>
                            <el-table
                                v-loading="loading"
                                :data="personalData"
                                ref="selectTable"
                                style="margin-top: 20px"
                                highlight-current-row
                                border
                            >
                                <el-table-column
                                    label="序号"
                                    align="center"
                                    type="index"
                                    width="50"
                                />
                                <el-table-column label="职务" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <!-- <el-input
                                          v-model="scope.row.userPostName"
                                          :ref="'userPostName' + scope.$index"
                                          :disabled="isdisable"
                                          @keyup.enter.native="postchange(scope.row, scope.$index)"
                                        ></el-input> -->
                                        <el-select
                                            v-model="scope.row.userPostName"
                                            :ref="'userPostName' + scope.$index"
                                            :disabled="isdisable"
                                            @change.enter.native="postchange(scope.row, scope.$index)"
                                        >
                                            <el-option value="1" label="评审组长"></el-option>
                                            <el-option value="2" label="组员"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="姓名" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <el-input
                                            v-model="scope.row.userName"
                                            :ref="'name' + scope.$index"
                                            :disabled="isdisable"
                                        ></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center">
                                    <template slot-scope="scope">
                                        <el-button
                                            size="mini"
                                            type="text"
                                            style="color: #ff4949"
                                            :disabled="isdisable"
                                            @click="peopleDel(scope.$index)"
                                        >删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="tabtit" style="margin-top: 20px">
                                <span>日程安排</span>
                                <el-button type="primary" @click="schedule" :disabled="isdisable"
                                >添加
                                </el-button>
                            </div>
                            <el-table
                                v-loading="loading"
                                :data="schedulelData"
                                ref="selectTable"
                                style="margin-top: 20px"
                                highlight-current-row
                                border
                            >
                                <el-table-column
                                    label="序号"
                                    align="center"
                                    type="index"
                                    width="50"
                                />
                                <el-table-column label="日期" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <el-date-picker
                                            v-model="scope.row.time"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            type="datetime"
                                            placeholder="选择日期"
                                            style="width: 100%"
                                            :disabled="isdisable"
                                            :ref="'timedata' + scope.$index"
                                            @keyup.enter.native="optTime(scope.row, scope.$index)"
                                        ></el-date-picker>
                                    </template>
                                </el-table-column>
                                <el-table-column label="评审人员" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <el-input
                                            v-model="scope.row.userName"
                                            :ref="'assess' + scope.$index"
                                            :disabled="isdisable"
                                            @keyup.enter.native="asspeople(scope.row, scope.$index)"
                                        ></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="评审内容" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <el-input
                                            v-model="scope.row.content"
                                            :ref="'content' + scope.$index"
                                            :disabled="isdisable"
                                        ></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center">
                                    <template slot-scope="scope">
                                        <el-button
                                            size="mini"
                                            type="text"
                                            style="color: #ff4949"
                                            @click="scheduleDel(scope.$index)"
                                            :disabled="isdisable"
                                        >删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="审批流程" name="second">
                            <approvalProcess :approvalProcess="approvalProcess"></approvalProcess>
                        </el-tab-pane>
                    </el-tabs>
                </el-form>
            </template>
            <template slot="bologfooter">
                <el-button
                    type="success"
                    v-if="showType !== 'show'"
                    @click="handleSubmit(2)"
                >提交
                </el-button>
                <el-button
                    type="primary"
                    v-if="showType !== 'show'"
                    @click="handleSubmit(1)"
                >保存
                </el-button>
                <el-button @click="cancelbtn">取消</el-button>
            </template>
        </BoDialog>
    </div>
</template>

<script>
    import { auditadd, auditedit } from '@/api/mass/config'
    import { getApprovalProcess } from '@/api/qualityAssurance/index'
    import approvalProcess from '@/components/approvalProcess/index'

    export default {
        name: 'createPlan',
        components: { approvalProcess },
        data() {
            return {
                dialogShow: false,
                isFullScreen: true,
                screenName: 'fullScreen',
                titles: '新增',
                showType: 'add',
                activeName: 'first',
                queryParams: {
                    userId: '',
                    method: '',
                    userPostName: '',
                    type: ''
                },
                rules: {},
                isdisable: false,
                method: [],
                loading: false,
                personalData: [],
                schedulelData: [],
                approvalProcess: {},
                rules: {
                    serial: [
                        { required: true, message: '请输入计划编号', trigger: 'blur' }
                    ],
                    year: [{ required: true, message: '请选择计划年度', trigger: 'blur' }]
                }
            }
        },
        computed: {
            getLeftWidth() {
                return this.$store.state.app.leftWidth
            }
        },
        watch: {
            getLeftWidth() {
                let width = this.$store.state.app.leftWidth
                if (width < 200) {
                    this.screenName = 'bigFullScreen'
                } else {
                    this.screenName = 'fullScreen'
                }
            },
            showType(val) {
                if (val == 'add') {
                    this.titles = '新增'
                } else if (val == 'update') {
                    this.titles = '修改'
                } else if (val == 'show') {
                    this.titles = '查看'
                    this.isdisable = true
                }
            }
        },
        methods: {
            // 接收父组件传递的数据
            init(show, data) {
                this.dialogShow = true
                this.showType = show
                if (data) {
                    this.queryParams = {
                        ...data
                    }
                    this.getProcess()
                    this.personalData = this.queryParams.planPersonList
                    this.schedulelData = this.queryParams.planScheduleList
                    this.queryParams.userPostName = data.userPostName
                    this.queryParams.userPostId = data.userPostId
                }
            },
            // 获取审批流程
            getProcess() {
                const params = {
                    businessType: 'QUALITY_INTERNAL_AUDIT',
                    businessId: this.queryParams.id,
                    businessStatus: this.queryParams.status
                }
                getApprovalProcess(params).then((res) => {
                    this.approvalProcess = res
                })
            },
            cancelbtn() {
                this.$emit('close')
            },
            open() {
            },
            e_changeBox(type) {
                this.isFullScreen = type
            },
            // 新增参加人员
            postchange(v, index) {
                this.$refs['name' + index].focus()
            },
            addPersonal() {
                if (this.personalData == undefined) {
                    this.personalData = new Array()
                }
                let obj = {};
                (obj.userPostName = ''), (obj.userName = ''), this.personalData.push(obj)
            },
            // 人员删除
            peopleDel(index) {
                this.personalData.splice(index, 1)
            },
            // 新增日程安排
            optTime(v, index) {
                this.$refs['assess' + index].focus()
            },
            asspeople(v, index) {
                this.$refs['content' + index].focus()
            },
            schedule() {
                if (this.schedulelData == undefined) {
                    this.schedulelData = new Array()
                }
                let obj = {};
                (obj.userName = ''),
                    (obj.time = ''),
                    (obj.content = ''),
                    this.schedulelData.push(obj)
            },
            // 日程删除
            scheduleDel(index) {
                this.schedulelData.splice(index, 1)
            },
            // 提交&保存
            handleSubmit(status) {
                this.$refs.queryForm.validate((valid) => {
                    if (valid) {
                        this.queryParams.status = status
                        // 判断是否添加人员信息
                        const tabse = this.personalData.map((item) => {
                            if (item.userPostName === '' || item.userName === '') {
                                // this.$message.error('请完善表格数据')
                            } else {
                                return item
                            }
                        })
                        var newArr = tabse.filter((item) => item)
                        this.queryParams.planPersonList = newArr
                        if (this.queryParams.planPersonList.length === 0) {
                            this.$message.error('请至少填写一条人员信息，完善表格数据')
                            return
                        }
                        // 判断是否添加日程信息
                        const tabslt = this.schedulelData.map((item) => {
                            if (
                                item.time === null ||
                                item.userName === '' ||
                                item.content === ''
                            ) {
                                //   this.$message.error('请完善表格数据')
                            } else {
                                return item
                            }
                        })
                        var newBlock = tabslt.filter((item) => item)
                        this.queryParams.planScheduleList = newBlock
                        if (this.queryParams.planScheduleList.length === 0) {
                            this.$message.error('请至少填写一条日程安排，完善表格数据')
                            return
                        }
                        // 修改和添加
                        if (this.queryParams.userId) {
                            auditedit(this.queryParams).then((res) => {
                                if (res.code === 200) {
                                    this.$message.success('修改成功')
                                    this.$parent.getList()
                                    this.cancelbtn()
                                }
                            })
                        } else {
                            auditadd(this.queryParams).then((res) => {
                                if (res.code === 200) {
                                    this.$message.success('添加成功')
                                    this.$parent.getList()
                                    this.cancelbtn()
                                }
                            })
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    /deep/ .el-dialog__body .el-col {
        margin-bottom: 0;
    }

    .tabtit {
        display: flex;
        justify-content: space-between;
        align-content: center;

        span {
            font-size: 14px;
            color: #3c4353;
            font-weight: bold;
        }
    }

    /deep/ .el-dialog__body .el-table {
        background-color: #fff;
    }
</style>
