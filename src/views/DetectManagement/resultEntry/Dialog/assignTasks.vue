<template>
    <BoDialog
        diaLogWidth="70%"
        diaLogTitle="任务分配"
        :diaLogShow="showDialog"
        @close="handleCancel">
        <template slot="bologbody">
            <el-form
                ref="businessTypeForm"
                label-width="130px"
                :model="formData"
                :forceRender="true"
                :rules="formDataRules"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="检测人员" prop="detectUserPostName">
                            <el-input
                                placeholder="请输入内容"
                                v-model="formData.detectUserPostName"
                                class="input-with-select"
                                readonly
                                @focus="selectContent"
                            >
                                <el-button
                                    slot="append"
                                    class="el-button el-button--primary el-button--mini"
                                    @click="selectContent"
                                    size="mini"
                                >
                                    选择
                                </el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="检测完成时间" prop="detectCompleteDate">
                            <el-date-picker
                                v-model="formData.detectCompleteDate"
                                type="date"
                                format="yyyy-MM-dd"
                                placeholder="选择日期"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-divider/>

            <el-form
                :model="queryParams"
                ref="queryForm"
                :inline="true"
                label-width="80px"
                :prop="queryParams"
                style="margin-top: 15px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="项目名称" prop="itemName">
                            <el-input
                                v-model="queryParams.itemName"
                                placeholder="项目名称"
                                clearable
                                size="small"
                                @keyup.enter.native="handleQuery"
                                class="input-with-select"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="方法编号" prop="itemCode">
                            <el-input
                                v-model="queryParams.itemCode"
                                placeholder="方法编号"
                                clearable
                                size="small"
                                @keyup.enter.native="handleQuery"
                                class="input-with-select"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="样品编号" prop="sampleCode">
                            <el-input
                                v-model="queryParams.sampleCode"
                                placeholder="样品编号"
                                clearable
                                size="small"
                                @keyup.enter.native="handleQuery"
                                class="input-with-select"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button
                                type="primary"
                                icon="el-icon-search"
                                size="mini"
                                @click="handleQuery"
                            >搜索
                            </el-button
                            >
                            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
                            >重置
                            </el-button
                            >
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <el-table
                v-loading="loading"
                :data="listData"
                @selection-change="handleSelectionChange"
                row-key="itemId+sampleCode+entrustCode"
                ref="selectTable"
                :max-height="isFullScreen== true?'580':'240'"
            >
                <el-table-column type="selection" width="55" align="center"/>
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column
                    align="center"
                    v-for="item in showListColumns"
                    :label="item.label"
                    :prop="item.key"
                    :formatter="formatter"
                    show-overflow-tooltip
                />
            </el-table>
            <pagination
                v-show="total > 0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                :pageSizes="[100, 200, 500]"
                @pagination="getList"
            />

            <selectUser :visible.sync="userShow" @backfill="backfillUser" ref="users" :showDefault="true"/>
            <selectMultiplePost
                :visible.sync="postShow"
                v-if="postShow"
                @backfill="backfillPost"
                ref="posts"
            />
            <detectType :visible.sync="cateShow" @handleClick="handleClick"/>
        </template>
        <template slot="bologfooter">
            <el-button type="primary" @click="handleGetData()">保存
            </el-button>
            <el-button @click="handleCancel">取消</el-button>
        </template>
    </BoDialog>
</template>

<script>
    import selectUser from '@/components/common/selectUser'
    import selectMultiplePost from '@/components/common/selectMultiplePost'
    import detectType from '@/components/project/detectType'
    import {
        getSampleAssignmentList,
        getItemAssignmentList,
        saveAssignment,
        getAssignmentDetailList,
        cancelAssignment
    } from '@/api/detectionManage/taskAllocation/config'

    export default {
        name: 'add',
        components: {
            selectUser,
            selectMultiplePost,
            detectType,
            saveAssignment
        },
        data() {
            return {
                previewWidth: 950,
                confirmLoading: false,
                showDialog: false,
                isFullScreen: true,
                formData: {
                    detectUserPostType: 1,
                    detectUserPostName: null,
                    detectUserPostId: null,
                    detectCompleteDate: null,
                    userPostList: [],
                    itemDetailList: []
                },
                queryParams: {
                    itemName: null,
                    itemCode: null,
                    sampleCode: null,
                    pageNum: 1,
                    pageSize: 100,
                    sampleIdList: [],
                    // 上级列表带入参数
                    entrustCode: '',
                    detectType: ''
                },
                total: 3,
                loading: false,
                ids: [],
                formDataRules: {
                    detectUserPostName: [{ required: true, message: '请输入检测人员', trigger: 'change' }]
                },
                single: true,
                multiple: true,
                cateShow: false,
                listData: [],
                listColumns: [
                    {
                        label: '项目名称',
                        key: 'itemName',
                        viewType: 1
                    },
                    {
                        label: '方法编号',
                        key: 'itemCode',
                        viewType: 1
                    },
                    {
                        label: '客户指定',
                        key: 'customerAppoint',
                        viewType: 1
                    },
                    {
                        label: '样品编码',
                        key: 'sampleCode',
                        viewType: 1
                    },
                    {
                        label: '检测类别',
                        key: 'detectTypeStr',
                        viewType: 1
                    },
                    {
                        label: '委托编码',
                        key: 'entrustCode',
                        viewType: 1
                    },
                    {
                        label: '分配人员',
                        key: 'assignmentUser',
                        viewType: 2
                    },
                    {
                        label: '分配时间',
                        key: 'assignmentTime',
                        viewType: 2
                    },
                    {
                        label: '检测人员',
                        key: 'detectUserPostName',
                        viewType: 2
                    },
                    {
                        label: '检测完成时间',
                        key: 'detectCompleteDate',
                        viewType: 2
                    },
                    {
                        label: '接收人员',
                        key: 'receiveUser',
                        viewType: 2
                    }
                ],
                userShow: false,
                postShow: false,
                showType: ''
            }
        },
        computed: {
            showListColumns() {
                return this.listColumns.filter((item) => item.viewType < 2)
            }
        },
        methods: {
            init(data, type) {
                if (type == 'ItemReturnTask') {
                    this.showType = 'item'
                } else if (type == 'SampleReturnTask') {
                    this.showType = 'sample'
                }
                this.queryParams = data
                this.showDialog = true
                this.getList()
            },
            // 取消
            handleCancel() {
                this.showDialog = false
                this.$emit('close')
                this.$refs.queryForm.resetFields()
                this.listData = []
            },
            saveAssignment() {
                let itemDetailList = []
                this.$refs.selectTable.selection.forEach((item) => {
                    console.log(item)
                    itemDetailList.push({
                        entrustId: item.entrustId,
                        entrustCode: item.entrustCode,
                        detectType: item.detectType,
                        sampleId: item.sampleId,
                        sampleCode: item.sampleCode,
                        itemId: item.itemId,
                        itemName: item.itemName,
                        itemCode: item.itemCode,
                        subname: item.subname,
                        stroma: item.stroma,
                        sceneDetect: item.sceneDetect,
                        sampleSource: item.sampleSource,
                        urgentStatus: item.urgentStatus,
                        completeDate: item.completeDate,
                        customerAppoint: item.customerAppoint,
                        detectUserPostType: this.formData.detectUserPostType,
                        detectUserPostName: this.formData.detectUserPostName,
                        detectCompleteDate: this.formData.detectCompleteDate
                    })
                })
                if (itemDetailList.length < 1) {
                    this.$message.error('至少选择一个项目进行分配!')
                    this.confirmLoading = false
                    return false
                }
                if (
                    !this.formData.detectUserPostId ||
                    this.formData.detectUserPostId === ''
                ) {
                    this.$message.error('请选择检测人员!')
                    this.confirmLoading = false
                    return false
                }
                this.formData.itemDetailList = itemDetailList
                saveAssignment(this.formData).then(
                    (res) => {
                        this.$message.success(res.msg)
                        this.confirmLoading = false
                        this.showDialog = false
                        this.$emit('reload')
                    },
                    (err) => {
                        this.$message.error(err)
                        this.confirmLoading = false
                    }
                )
            },
            cancelAssignment() {
                let idList = this.$refs.selectTable.selection.map((item) => item.id)
                if (!idList || idList.length < 1) {
                    this.$message.error('至少选择一个项目进行取消!')
                    return false
                }
                cancelAssignment(idList).then(
                    (res) => {
                        this.$message.success(res.msg)
                        this.confirmLoading = false
                        this.showDialog = false
                        this.$parent.init()
                    },
                    (err) => {
                        // this.msgError(err);
                        this.confirmLoading = false
                    }
                )
            },
            handleGetData() {
                this.confirmLoading = true
                this.saveAssignment()
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.getList()
            },
            handleQuery() {
                this.getList()
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                console.log(selection)
                this.ids = selection.map((item) => item.id)
                this.single = selection.length !== 1
                this.multiple = !selection.length
            },
            getList() {
                if (this.showType == 'sample') {
                    getSampleAssignmentList(this.queryParams).then((res) => {
                        console.log(res)
                        this.listData = res.data.list
                        this.total = res.data.total
                    })
                } else if (this.showType == 'item') {
                    getItemAssignmentList(this.queryParams).then((res) => {
                        this.listData = res.data.list
                        this.total = res.data.total
                    })
                }

            },
            selectContent() {
                if (this.formData.detectUserPostType === 1) {
                    this.userShow = true
                    this.$nextTick(() => {
                        this.$refs.users.getDefault()
                    })
                } else {
                    this.postShow = true
                }
            },
            //回填选中的用户
            backfillUser(resultUsers) {
                let tempIds = ''
                let tempNames = ''
                this.formData.userPostList = []
                resultUsers.forEach((item) => {
                    tempIds += item.userId + ','
                    tempNames += item.userName + ','
                    this.formData.userPostList.push({
                        detectUserPostType: this.formData.detectUserPostType,
                        detectUserPostId: item.userId,
                        detectUserPostName: item.userName
                    })
                })
                this.updateSelected(tempIds, tempNames)
            },
            backfillPost(resultPosts) {
                let tempIds = ''
                let tempNames = ''
                this.formData.userPostList = []
                resultPosts.forEach((item) => {
                    tempIds += item.postId + ','
                    tempNames += item.postName + ','
                    this.formData.userPostList.push({
                        detectUserPostType: this.formData.detectUserPostType,
                        detectUserPostId: item.postId,
                        detectUserPostName: item.postName
                    })
                })
                this.updateSelected(tempIds, tempNames)
            },
            updateSelected(tempIds, tempNames) {
                this.formData.detectUserPostId = tempIds.substr(0, tempIds.length - 1)
                this.formData.detectUserPostName = tempNames.substr(
                    0,
                    tempNames.length - 1
                )
            },
            detectUserPostTypeChange() {
                this.formData.detectUserPostId = null
                this.formData.detectUserPostName = null
            },
            handleClick(row) {
                this.queryParams.detectType = row.id
                this.queryParams.detectTypeName = row.detectName
                this.cateShow = false
            },
            formatter(row, column, cellValue, index) {
                if (column.property === 'customerAppoint') {
                    if (cellValue === 0) {
                        return '否'
                    } else {
                        return '是'
                    }
                }
                return cellValue
            }
        }
    }
</script>

<style lang="less" scoped>
    /deep/ .el-select .el-input {
        width: 130px;
    }

    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }

    .el-input-group__append {
        background-color: #1890ff;
        color: #ffffff;
    }

    /deep/ .ant-modal-title {
        margin: 0;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
        word-wrap: break-word;
        text-align: center;
        font-weight: bold !important;
    }

    /deep/ .ant-modal-footer {
        padding: 10px 16px;
        text-align: right;
        background: transparent;
        border-top: 1px solid #e8e8e8;
        border-radius: 0 0 4px 4px;
        text-align: center;
    }
</style>
