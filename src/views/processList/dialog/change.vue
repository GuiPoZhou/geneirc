<template>
    <div style="padding: 20px">
        <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
            <el-tab-pane label="文件更改申请" name="first">
                <el-form
                    :model="queryParams"
                    ref="queryForm"
                    :inline="true"
                    :prop="queryParams"
                    style="margin: 15px 0 0 50px"
                    :rules="rules"
                    label-position="top"
                    label-width="80px"
                    v-if="!samplehandle"
                >
                    <el-row>
                        <el-col :span="12">
                            <el-form-item
                                label="文件编号"
                                prop="fileNumber"
                                style="width: 90%"
                            >
                                <el-input placeholder="请输入文件编号" v-model="queryParams.fileNumber" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="文件名称" prop="fileName" style="width: 90%">
                                <el-input
                                    placeholder="请输入文件名称"
                                    v-model="queryParams.fileName"
                                    disabled
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="申请部门" prop="departmentName" style="width: 90%">
                                <el-input
                                    placeholder="请输入申请部门"
                                    v-model="queryParams.departmentName"
                                    disabled
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                label="申请人员"
                                prop="applyUser"
                                style="width: 90%"
                            >
                                <el-input
                                    placeholder="请输入申请人员"
                                    v-model="queryParams.applyUser"
                                    disabled
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                label="申请日期"
                                prop="applyDate"
                                style="width: 90%"
                            >
                                <el-input
                                    placeholder="请输入申请日期"
                                    v-model="queryParams.applyDate"
                                    disabled
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                label="审批人员"
                                prop="approvalUser"
                                style="width: 90%"
                            >
                                <el-input
                                    placeholder="请输入审批人员"
                                    v-model="queryParams.approvalUser"
                                    disabled
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                label="更改原因"
                                prop="reason"
                                style="width: 90%"
                            >
                                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.reason"
                                          disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                label="更改条款及内容"
                                prop="changeClause"
                                style="width: 90%"
                            >
                                <el-input type="textarea" :rows="2" placeholder="请输入内容"
                                          v-model="queryParams.changeClause" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="更改后内容" prop="afterChangeContent" style="width: 90%">
                                <el-input type="textarea" :rows="2" placeholder="请输入内容"
                                          v-model="queryParams.afterChangeContent" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="通知范围" prop="noticeRange" style="width: 90%">
                                <el-input type="textarea" :rows="2" placeholder="请输入内容"
                                          v-model="queryParams.noticeRange" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="上传附件" prop="createTimeStr" style="width: 90%">
                                <el-tag
                                    style="margin-right: 5px; cursor: pointer;margin-bottom: 5px;
                    "
                                    v-for="(file, fileIndex) in queryParams.uploadFileList"
                                    :key="fileIndex"
                                    @click="e_downLoadPonitFile(file)"
                                >{{ file.fileName }}
                                </el-tag
                                >
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import moment from 'moment'

    export default {
        name: 'borrow',
        // components: {detectType, detectionInformation, chains},
        data() {
            return {
                dialogShow: false,
                activeName: 'first',
                visible: false,
                queryParams: {},
                rules: {
                    fileNumber: [{ required: true, message: '请输入文件编号', trigger: 'blur' }],
                    fileName: [{ required: true, message: '请输入文件名称', trigger: 'blur' }]
                },
                isdisable: true,
                loading: false,
                isFullScreen: true,
                screenName: 'fullScreen',
                showType: 'add',
                showdisable: false,
                titleMsg: '',
                samplehandle: false,
                listData: []
            }
        },
        // props: {
        //   msg: String,
        // },
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
            }
        },
        mounted() {
            let width = this.$store.state.app.leftWidth
            if (width < 200) {
                this.screenName = 'bigFullScreen'
            } else {
                this.screenName = 'fullScreen'
            }
        },
        methods: {
            e_changeBox(type) {
                this.isFullScreen = type
            },
            e_downLoadPonitFile(file) {
                this.downLoadFile2(file.filePath)
            },
            init(params) {
                console.log(params)
                if (params) {
                    this.queryParams = {
                        ...params
                    }
                }
                this.dialogShow = true
            },
            cancelbtn() {
                this.$emit('close')
            },
            handleClick(tab, event) {
                console.log(tab, event)
            }
        }
    }
</script>

<style scoped>
    .dialog-footer {
        background: #fff;
        position: fixed;
        width: 64%;
        bottom: 0;
        height: 60px;
        z-index: 10;
    }
</style>
