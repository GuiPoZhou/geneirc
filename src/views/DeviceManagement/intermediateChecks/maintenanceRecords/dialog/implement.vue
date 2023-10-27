<template>
    <el-dialog :title="titles"
               :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
               :close-on-click-modal="false" width="70%" @close="cancelbtn" @open="open">

        <el-form
            :model="queryParams"
            ref="queryForm"
            :prop="queryParams"
            :rules="rules"
            label-width="120px"
        >
            <el-tabs v-model="activeName" :stretch="true">
                <el-tab-pane label="期间核查记录" name="first">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="设备编号" prop="equipmentNumber">
                                <el-input placeholder="请输入设备编号" v-model="queryParams.equipmentNumber"
                                          disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="设备名称" prop="equipmentName">
                                <el-input placeholder="请输入设备名称" v-model="queryParams.equipmentName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="生产厂家" prop="manufacturer">
                                <el-input placeholder="请输入生产厂家" v-model="queryParams.manufacturer" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="规格型号" prop="equipmentModel">
                                <el-input placeholder="请输入规格型号" v-model="queryParams.equipmentModel"
                                          disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="量程范围" prop="range">
                                <el-input placeholder="请输入量程范围" v-model="queryParams.range" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="精度等级" prop="accuracyClass">
                                <el-input placeholder="请输入精度等级" v-model="queryParams.accuracyClass" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <!--            <el-col :span="8">-->
                        <!--              <el-form-item label="设备状态" prop="fileName">-->
                        <!--                <el-input placeholder="请输入设备状态" v-model="queryParams.fileName" disabled></el-input>-->
                        <!--              </el-form-item>-->
                        <!--            </el-col>-->
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="上次检定日期" prop="lastCalibrationDate">
                                <el-input placeholder="请输入上次检定日期" v-model="queryParams.lastCalibrationDate"
                                          disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="检定失效日期" prop="loseCalibrationDate">
                                <el-input placeholder="请输入检定失效日期" v-model="queryParams.loseCalibrationDate"
                                          disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="核查日期" prop="checkDate">
                                <el-date-picker v-model="queryParams.checkDate" value-format="yyyy-MM-dd" type="date"
                                                placeholder="选择日期" style="width:100%"
                                                :disabled="isdisable"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="核查人员" prop="checkPerson">
                                <el-input placeholder="请输入核查人员" v-model="queryParams.checkPerson"
                                          :disabled="isdisable"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="核查内容及方法" prop="checkContent">
                                <el-input type="textarea" :rows="2" placeholder="请输入内容"
                                          v-model="queryParams.checkContent"
                                          :disabled="isdisable"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="核查结果" prop="checkResult">
                                <el-input type="textarea" :rows="2" placeholder="请输入内容"
                                          v-model="queryParams.checkResult"
                                          :disabled="isdisable"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="核查意见" prop="checkOpinion">
                                <el-input type="textarea" :rows="2" placeholder="请输入内容"
                                          v-model="queryParams.checkOpinion"
                                          :disabled="isdisable"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="录入人" prop="createBy">
                                <el-input placeholder="请输入录入人" v-model="queryParams.createBy" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="录入日期" prop="createTime">
                                <el-input placeholder="请输入录入日期" v-model="queryParams.createTime" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="附件上传" prop="standardNameCn">
                                <el-upload
                                    ref="upload"
                                    :action="uploadUrl()"
                                    :on-success="uploadSuccess"
                                    :on-remove="uploadRemove"
                                    :limit="5"
                                    :file-list="fileList"
                                    :disabled="isdisable"
                                >
                                    <div slot="file" slot-scope="{file}">
                                        <span style="padding-right: 20px">{{file.name}}</span>
                                        <el-button type="text" size="small" @click="look_file(file.response)">查看
                                        </el-button>
                                        <el-button type="text" size="small" style="color: #1CD0BD"
                                                   @click="down_file(file.response)">下载
                                        </el-button>
                                        <el-button type="text" size="small" style="color: #ff4949"
                                                   @click="uploadRemove(file)" v-if="showType !== 'show'">删除
                                        </el-button>
                                    </div>
                                    <el-button type="primary" icon="el-icon-paperclip" :disabled="isdisable">点击上传
                                    </el-button>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="审批流程" name="second">
                    <approvalProcess :approvalProcess="approvalProcess"></approvalProcess>
                </el-tab-pane>
            </el-tabs>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="success" v-if="showType !== 'show'" @click="handleSubmit(2)">提交</el-button>
            <el-button type="primary" v-if="showType !== 'show'" @click="handleSubmit(1)">保存</el-button>
            <el-button @click="cancelbtn">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import moment from 'moment'
    import { mapState } from 'vuex'
    import { addCheckRecord } from '@/api/resources/deviceManagement/index.js'
    import { eventBus } from '@/main.js'
    import approvalProcess from '@/components/approvalProcess/index'
    import { getApprovalProcess } from '@/api/consumables/purchaseApply'

    export default {
        name: 'implement',
        components: { approvalProcess },
        data() {
            return {
                dialogShow: false,
                isFullScreen: true,
                screenName: 'fullScreen',
                titles: '执行',
                showType: 'add',
                activeName: 'first',
                queryParams: {},
                rules: {},
                isdisable: false,
                // 上传文件列表
                fileList: [],
                uploadFileList: [],
                approvalProcess: {}
            }
        },
        computed: {
            ...mapState({
                user: state => state.user.userInfo
            })
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
                    this.titles = '执行'
                } else if (val == 'update') {
                    this.titles = '修改'
                } else if (val == 'show') {
                    this.titles = '查看'
                    this.isdisable = true
                }
            }
        },
        methods: {
            e_changeBox(type) {
                this.isFullScreen = type
            },
            open() {
                if (this.showType === 'show') {
                    if (this.queryParams.uploadFileList.length !== 0) {
                        this.fileList = this.queryParams.uploadFileList.map(item => {
                            console.log(item)
                            return {
                                name: item.fileName,
                                response: {
                                    data: {
                                        filePath: item.filePath,
                                        id: item.id
                                    }
                                }
                            }
                        })
                        this.uploadFileList = this.fileList.map(item => {
                            console.log(item)
                            return {
                                fileName: item.name,
                                filePath: item.response.data.filePath
                            }
                        })
                    }
                }
            },
            init(show, data) {
                this.showType = show
                this.dialogShow = true
                if (show === 'add') {
                    console.log(data)
                    this.queryParams = {
                        ...data
                    }
                }
                if (show === 'show') {
                    this.queryParams = {
                        ...data
                    }
                    this.getProcess()
                }
                this.queryParams.createBy = this.user.nickName
                this.queryParams.createTime = moment().format('YYYY-MM-DD HH:mm:ss')
            },
            // 文件上传路径返回
            uploadUrl() {
                return window.globalEnv.VUE_APP_BASE_API + '/fileManage/upload'
            },
            // 文件上传成功
            uploadSuccess(res, file, fileList) {
                if (200 == res.code) {
                    this.fileList = fileList
                    console.log(this.fileList)
                    if (this.fileList.length > 0) {
                        this.uploadFileList = this.fileList.map(item => {
                            return {
                                fileName: item.name,
                                filePath: item.response.data.filePath
                            }
                        })
                        console.log(this.uploadFileList)
                    }
                } else {
                    this.fileList = []
                    this.uploadFileList = []
                }
            },
            // 文件删除
            uploadRemove(file) {
                let index = this.fileList.findIndex(fileItem => {
                    return fileItem.name === file.name
                })
                this.fileList.splice(index, 1)
                if (this.fileList.length > 0) {
                    this.uploadFileList = this.fileList.map(item => {
                        return {
                            fileName: item.name,
                            filePath: item.response.data.filePath
                        }
                    })
                    console.log(this.uploadFileList)
                } else {
                    this.uploadFileList = []
                }
            },
            // 查看文件
            look_file(data) {
                window.open(window.globalEnv.VUE_APP_BASE_API + '/' + data.data.filePath, '_blank')
            },
            // 下载文件
            down_file(data) {
               this.mbu_downloadFile(data.data.filePath)
            },
            // 获取流程
            getProcess() {
                const params = {
                    businessType: 'EQUIPMENT_CHECK_RECORD',
                    businessId: this.queryParams.id,
                    businessStatus: this.queryParams.status
                }
                getApprovalProcess(params).then(res => {
                    this.approvalProcess = res
                })
            },
            // 提交
            handleSubmit(status) {
                this.$refs.queryForm.validate((valid) => {
                    if (valid) {
                        this.queryParams.uploadFileList = this.uploadFileList
                        this.queryParams.status = status
                        console.log(this.queryParams)
                        var msg = ''
                        if (status === 1) {
                            msg = '保存成功'
                        } else {
                            msg = '提交成功'
                        }
                        addCheckRecord(this.queryParams).then(res => {
                            if (res.code === 200) {
                                this.$message.success(msg)
                                this.dialogShow = false
                                this.$emit('reload')
                            }
                        })
                    }
                })
            },
            cancelbtn() {
                this.$emit('close')
            }
        }
    }
</script>

<style scoped>
    /deep/ .el-dialog__body .el-col {
        margin-bottom: 0;
    }
</style>
