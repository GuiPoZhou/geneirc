<template>
    <BoDialog :diaLogShow="dialogShow" :diaLogTitle="titles" diaLogWidth="60%"
              @close="cancelbtn">
        <template slot="bologbody">
            <el-form
                :model="queryParams"
                ref="queryForm"
                :inline="true"
                :prop="queryParams"
                label-position="top"
                :rules="rules"
            >
                <el-tabs v-model="activeName" type="card">
                    <el-tab-pane label="不符合项管理" name="first">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item
                                    label="不符合记录编号"
                                    prop="serial"
                                >
                                    <el-input
                                        placeholder="请输入不符合记录编号"
                                        v-model="queryParams.serial"
                                        :disabled="isdisable"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="责任部门" prop="deptId">
                                    <treeselect
                                        :disabled="isdisable"
                                        v-model="queryParams.deptId"
                                        :options="deptOptions"
                                        :show-count="true"
                                        @select="departmentSelected"
                                        placeholder="请选择所属部门"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item
                                    prop="describe"
                                    label="不符合或潜在不符合简述"
                                >
                                    <el-input
                                        type="textarea"
                                        :rows="3"
                                        style="border: 1px solid #DCDFE6"
                                        placeholder="请输入内容"
                                        v-model="queryParams.describe"
                                        :disabled="isdisable"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item
                                    prop="analyze"
                                    label="不符合工作的影响分析"
                                >
                                    <el-input
                                        type="textarea"
                                        :rows="3"
                                        style="border: 1px solid #DCDFE6"
                                        placeholder="请输入内容"
                                        v-model="queryParams.analyze"
                                        :disabled="isdisable"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item
                                    prop="measure"
                                    label="不符合工作的处理及改进措施"
                                >
                                    <el-input
                                        type="textarea"
                                        :rows="3"
                                        style="border: 1px solid #DCDFE6"
                                        placeholder="请输入内容"
                                        v-model="queryParams.measure"
                                        :disabled="isdisable"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="审批流程" name="second">
                        <approvalProcess :approvalProcess="approvalProcess"></approvalProcess>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </template>
        <template slot="bologfooter">
            <el-button type="success" v-if="showType !== 'show'" @click="handleSubmit"
            >提交
            </el-button
            >
            <el-button type="primary" v-if="showType !== 'show'" @click="handleSave"
            >保存
            </el-button
            >
            <el-button @click="cancelbtn">取消</el-button>
        </template>
    </BoDialog>
</template>

<script>
    import approvalProcess from '@/components/approvalProcess/index'
    import { getApprovalProcess } from '@/api/qualityAssurance/index'
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import { treeselect } from '@/api/system/dept'
    import { noadd, noedit } from '@/api/mass/config'

    export default {
        name: 'createInconform',
        components: { approvalProcess, Treeselect },
        data() {
            return {
                dialogShow: false,
                isFullScreen: true,
                screenName: 'fullScreen',
                titles: '新增',
                showType: 'add',
                activeName: 'first',
                queryParams: {
                    serial: '',
                    deptId: null,
                    describe: '',
                    analyze: '',
                    measure: ''
                },
                rules: {
                    serial: [
                        { required: true, message: '请输入不符合记录编号', trigger: 'blur' }
                    ],
                    deptId: [
                        { required: true, message: '请选择责任部门', trigger: 'blur' }
                    ],
                    describe: [
                        {
                            required: true,
                            message: '请输入不符合或潜在不符合简述',
                            trigger: 'blur'
                        }
                    ],
                    analyze: [
                        {
                            required: true,
                            message: '请输入不符合工作的影响分析',
                            trigger: 'blur'
                        }
                    ],
                    measure: [
                        {
                            required: true,
                            message: '请输入不符合工作的处理及改进措施',
                            trigger: 'blur'
                        }
                    ]
                },
                isdisable: false,
                // 部门树选项
                deptOptions: [],
                approvalProcess: {}
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
            // 获取审批流程
            getProcess() {
                const params = {
                    businessType: 'QUALITY_INCOMPATIBLE',
                    businessId: this.queryParams.id,
                    businessStatus: this.queryParams.status
                }
                getApprovalProcess(params).then((res) => {
                    this.approvalProcess = res
                })
            },
            e_changeBox(type) {
                this.isFullScreen = type
            },
            init(show, data) {
                this.dialogShow = true
                this.showType = show
                if (data) {
                    this.queryParams = {
                        ...data
                    }
                    this.getProcess()
                }
                this.getTreeselect()

                console.log(this.queryParams)
            },
            /** 查询部门下拉树结构 */
            getTreeselect() {
                treeselect().then((response) => {
                    this.deptOptions = response.data
                })
            },
            departmentSelected(val) {
                console.log(val)
                this.queryParams.deptId = val.id
                this.queryParams.deptName = val.label
                console.log(this.queryParams)
            },
            cancelbtn() {
                this.$emit('close')
            },
            // 提交
            handleSubmit() {
                this.saveInfos(2)
            },
            // 保存
            handleSave() {
                this.saveInfos(1)
            },
            saveInfos(status) {
                console.log(this.queryParams)
                this.$refs.queryForm.validate((valid) => {
                    if (valid) {
                        this.queryParams.status = status
                        this.queryParams.uploadFileList = this.uploadFileList
                        var mag = ''
                        if (status === 1) {
                            mag = '保存成功'
                        } else {
                            mag = '提交成功'
                        }
                        if (this.queryParams.id) {
                            noedit(this.queryParams).then((res) => {
                                if (res.code === 200) {
                                    this.$message.success(mag)
                                    this.$parent.getList()
                                    this.cancelbtn()
                                }
                            })
                        } else {
                            noadd(this.queryParams).then((res) => {
                                if (res.code === 200) {
                                    this.$message.success(mag)
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
<style lang="less" scoped>
    .tit {
        font-size: 14px;
        color: #606266;
        font-weight: 700;
    }

    .scol {
        margin: 10px 0 !important;
    }

    /deep/ .el-dialog__body .el-col {
        margin-bottom: 0;
    }
</style>

