<template>
    <div>
        <el-form :model="queryParams"
                 ref="queryForm"
                 :inline="true"
                 label-width="110px"
                 :rules="rules"
        >
            <el-divider content-position="left">申请信息</el-divider>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="测试申请单号" prop="testRequestNo">
                        <el-input v-model="queryParams.testRequestNo" placeholder="系统自动生成" disabled/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申请人" prop="applicant">
                        <el-input v-model="queryParams.applicant" placeholder="请输入申请人" disabled/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="员工号" prop="employeeNo">
                        <el-input v-model="queryParams.employeeNo" placeholder="请输入员工号" disabled/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="部门" prop="deptName">
                        <el-input v-model="queryParams.deptName" placeholder="请输入部门" disabled/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="成本中心" prop="costCenter">
                        <el-input v-model="queryParams.costCenter" placeholder="请输入成本中心"
                                  :disabled="isdisabled"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="项目号" prop="projectNo">
                        <el-input v-model="queryParams.projectNo" placeholder="请输入项目号"
                                  :disabled="isdisabled"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="项目名称" prop="projectName">
                        <el-input v-model="queryParams.projectName" placeholder="请输入项目名称"
                                  :disabled="isdisabled"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="项目成本号" prop="projectCostNumber">
                        <el-input v-model="queryParams.projectCostNumber" placeholder="请输入项目成本号"
                                  :disabled="isdisabled"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="项目经理" prop="projectManager">
                        <el-input v-model="queryParams.projectManager" placeholder="请选择项目经理" readonly
                                  :disabled="isdisabled">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="仿真类型" prop="simulationType">
                        <el-select v-model="queryParams.simulationType" :disabled="isdisabled">
                            <el-option v-for="item in emulationTypelist" :label="item.dictLabel"
                                       :value="item.dictLabel"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="产品所属BU" prop="productBu">
                        <el-select v-model="queryParams.productBu" :disabled="isdisabled">
                            <el-option v-for="item in bulist" :label="item.dictLabel"
                                       :value="item.dictLabel"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="期望结束日期" prop="desireEndDate">
                        <el-date-picker
                                v-model="queryParams.desireEndDate"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                type="date"
                                placeholder="请选择"
                                :disabled="isdisabled"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="仿真原因" prop="simulationReason">
                        <el-input v-model="queryParams.simulationReason" type="textarea"
                                  placeholder="请输入仿真原因" :disabled="isdisabled" style="width: 100%"/>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item
                        label="附件"
                        prop="key"
                    >
                        <el-upload
                            ref="upload"
                            :action="uploadUrl()"
                            :before-upload="beforeUploads"
                            :file-list="queryParams.simulationApplicationFileList"
                            :disabled="isdisabled"
                            :on-success=" (res, file, fileList) => {uploadSuccess1(res, file, fileList); } "
                            :headers="headers"
                        >
                            <div slot="file" slot-scope="{file}">
                                <span style="padding-right: 20px">{{file.fileName}}</span>
                                <el-button type="text" size="small" @click="look_file(file, 'upload0')">查看</el-button>
<!--                                <el-button type="text" v-if="showType != 'detail'" size="small"-->
<!--                                           style="color: #ff4949" @click="uploadRemove(file, 'upload0')">删除-->
<!--                                </el-button>-->
                            </div>
                            <el-button icon="el-icon-upload2" :disabled="isdisabled">上传</el-button>
                        </el-upload>
                    </el-form-item>
                </el-col>
            </el-row>
            <template  v-if="node1">
                <el-divider content-position="left">Lab经理分配仿真工程师</el-divider>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="仿真工程师" prop="simulationEngineer">
                            <el-input v-model="queryParams.simulationEngineer" placeholder="请选择项目经理" readonly>
                                <el-button slot="append" @click="handleSelect" :disabled="isdisableds || isdisableds1">选择
                                </el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </template>
            <template  v-if="node2">
                <el-divider content-position="left">仿真工程师评估</el-divider>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="仿真金额" prop="simulationAmount">
                            <el-input v-model="queryParams.simulationAmount" placeholder="请输入仿真金额" :disabled="isdisableds || isdisableds2"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item
                                label="附件"
                                prop="key"
                        >
                            <el-upload
                                    ref="upload"
                                    :action="uploadUrl()"
                                    :before-upload="beforeUploads"
                                    :on-success="handleSuccess"
                                    :file-list="queryParams.estimateFileList"
                                    :disabled="isdisableds || isdisableds2"
                                    :headers="headers"
                            >
                                <div slot="file" slot-scope="{file}">
                                    <span style="padding-right: 20px">{{file.fileName}}</span>
                                    <el-button type="text" size="small" @click="look_file(file, upload1)">查看</el-button>
<!--                                    <el-button type="text" size="small" style="color: #1CD0BD"-->
<!--                                               @click="down_file(file)">-->
<!--                                        下载-->
<!--                                    </el-button>-->
                                    <el-button type="text" v-if="showType != 'detail'" size="small"
                                               style="color: #ff4949" @click="uploadRemove(file)" :disabled="isdisableds || isdisableds2">删除
                                    </el-button>
                                </div>
                                <el-button icon="el-icon-upload2" :disabled="isdisableds || isdisableds2">上传</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </template>
            <template  v-if="node3">
                <el-divider content-position="left">仿真工程师仿真</el-divider>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="开始时间" prop="startTime">
                            <el-date-picker
                                    v-model="queryParams.startTime"
                                    value-format="yyyy-MM-dd"
                                    format="yyyy-MM-dd"
                                    type="date"
                                    placeholder="请选择"
                                    disabled
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结束日期" prop="endTime">
                            <el-date-picker
                                    v-model="queryParams.endTime"
                                    value-format="yyyy-MM-dd"
                                    format="yyyy-MM-dd"
                                    type="date"
                                    placeholder="请选择"
                                    disabled
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item
                                label="结果"
                                prop="key"
                        >
                            <el-upload
                                    ref="upload"
                                    :action="uploadUrl()"
                                    :before-upload="beforeUploads"
                                    :on-success="handleSuccess1"
                                    :file-list="queryParams.simulationFileList"
                                    disabled
                                    :headers="headers"
                            >
                                <div slot="file" slot-scope="{file}">
                                    <span style="padding-right: 20px">{{file.fileName}}</span>
                                    <el-button type="text" size="small" @click="look_file1(file)">查看</el-button>
<!--                                    <el-button type="text" size="small" style="color: #1CD0BD"-->
<!--                                               @click="down_file2(file)">-->
<!--                                        下载-->
<!--                                    </el-button>-->
                                    <el-button type="text" size="small" style="color: #ff4949"
                                               @click="uploadRemove1(file)" disabled>删除
                                    </el-button>
                                </div>
                                <el-button icon="el-icon-upload2" disabled>上传</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </template>
        </el-form>
        <!--选择项目经理-->
        <selectPersonal v-if="showPersonal" ref="personal" @cancel="showPersonal = false"
                        @confirm="confirm"></selectPersonal>
    </div>
</template>

<script>
    import selectPersonal from '@/components/common/approveSelectPersonal.vue'
    import {getToken} from "@/utils/auth";
    export default {
        name: "simulationApplication",
        components: {selectPersonal},
        data() {
            return {
                isloading: false,
                isdisabled: false,
                isdisabled1: false,
                isdisabled2: false,
                isdisableds: false,
                isdisableds1: false,
                isdisableds2: false,
                queryParams: {
                    testRequestNo: '',
                    applicant: '',
                    employeeNo: '',
                    deptName: '',
                    costCenter: '',
                    projectNo: '',
                    projectName: '',
                    projectCostNumber: '',
                    projectManager: '',
                    simulationType: '',
                    simulationReason: '',
                    productBu: '',
                    desireEndDate: '',
                    simulationEngineer: '',
                    simulationAmount: '',
                    startTime: '',
                    endTime: '',
                    estimateFileList: [],
                    simulationFileList: [],
                },
                rules: {
                    applicant: [
                        {required: true, message: '请输入申请人', trigger: 'blur'},
                    ],
                    employeeNo: [
                        {required: true, message: '请输入员工号', trigger: 'blur'},
                    ],
                    deptName: [
                        {required: true, message: '请输入部门', trigger: 'blur'},
                    ],
                    projectNo: [
                        {required: true, message: '请输入项目号', trigger: 'blur'},
                    ],
                    projectName: [
                        {required: true, message: '请输入项目名称', trigger: 'blur'},
                    ],
                    simulationReason: [
                        {required: true, message: '请输入仿真原因', trigger: 'blur'},
                    ],
                    simulationAmount: [
                        {required: true, message: '请输入仿真金额', trigger: 'blur'},
                    ],
                },
                emulationTypelist: [],
                bulist: [],
                showType: '',
                showPersonal: false,
                showLab:false,
                labEvents:'(function aa(){return false})()',
                node1:false,
                node2:false,
                node3:false,
                activeIndex: '',
                simulationApplicationFileList: [],
                headers: {Authorization: "Bearer " + getToken()},
            }
        },

        methods: {
            init(type, data,labEvents, activeIndex) {
                this.isdisabled = true
                this.activeIndex = activeIndex
                // 仿真类型
                this.getDicts('emulation_type').then(res => {
                    this.emulationTypelist = res.data
                })
                // 产品所属BU
                this.getDicts('product_BU').then(res => {
                    this.bulist = res.data
                })
                this.queryParams.applicant = this.$mainStore.state.user.userInfo.nickName
                this.queryParams.deptName = this.$mainStore.state.user.userInfo.dept.deptName
                this.queryParams.employeeNo = this.$mainStore.state.user.userInfo.userName
                if (data) {
                    this.queryParams = {
                        ...data
                    }
                }
                if (this.activeIndex == '1') {
                    this.checkLabStatus(labEvents)
                } else {
                    this.node1 = true
                    this.node2 = true
                    this.node3 = true
                    this.isdisableds = true
                }
            },
            // 文件上传成功
            uploadSuccess1(res, file, fileList, index) {
                if (200 == res.code) {
                    let obj = {
                        fileName: res.fileName,
                        filePath: res.url,
                        allUrl: res.allUrl
                    }
                    this.queryParams.simulationApplicationFileList.push(obj)
                } else {
                    this.$message.error("文件上传失败！" + res.msg);
                }
            },
            validate(callback){
                //这个form是子组件内部 el-form 的 ref="form"
                this.$refs.queryForm.validate((valid) => {
                    callback(valid)
                })
            },
            checkLabStatus(labEvents){
               eval(labEvents)
            },
            // 文件上传路径返回
            uploadUrl() {
                return window.globalEnv.VUE_APP_BASE_API + '/simulation/upload'
            },
            beforeUploads(file) {
                // // 限制文件上传大小
                // var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
                // const extension = testmsg === 'pdf'
                // const extension1 = testmsg === 'zip'
                // const extension2 = testmsg === 'rar'
                // const extension3 = testmsg === 'doc'
                // const extension4 = testmsg === 'docx'
                // const extension5 = testmsg === 'png'
                // const extension6 = testmsg === 'jpg'
                // const extension7 = testmsg === 'jpeg'
                // if (!extension && !extension1 && !extension2 && !extension3 && !extension4 && !extension5 && !extension6 && !extension7) {
                //     this.$message({
                //         message: '上传文件只能是pdf,zip,rar,doc,docx,png,jpg格式!',
                //         type: 'warning'
                //     });
                //     return false
                // }
            },
            handleSuccess (res, file) {
                if (res.code == 200) {
                    let obj = {
                        fileName: res.fileName,
                        filePath: res.url,
                    }
                    this.queryParams.estimateFileList.push(obj)
                }
            },
            handleSuccess1 (res, file) {
                if (res.code == 200) {
                    let obj = {
                        fileName: res.fileName,
                        filePath: res.url,
                    }
                    this.queryParams.simulationFileList.push(obj)
                }
            },
            // 查看文件
            look_file(data, type) {
                if (type == 'upload1') {
                    this.queryParams.estimateFileList.map(item => {
                        if (item.fileName === data.fileName) {
                            window.open(process.env.VUE_APP_BASE_API + '/' + item.filePath, '_blank');
                        }
                    })
                } else if (type == 'upload2') {
                    this.queryParams.simulationFileList.map(item => {
                        if (item.fileName === data.fileName) {
                            window.open(process.env.VUE_APP_BASE_API + '/' + item.filePath, '_blank');
                        }
                    })
                } else if (type == 'upload0') {
                    this.queryParams.simulationApplicationFileList.map(item => {
                        if (item.fileName === data.fileName) {
                            window.open(process.env.VUE_APP_BASE_API + '/' + item.filePath, '_blank');
                        }
                    })
                }
            },
            // 查看文件
            look_file1(data) {
                this.queryParams.simulationFileList.map(item => {
                    if (item.fileName === data.fileName) {
                        window.open(process.env.VUE_APP_BASE_API + '/' + item.filePath, '_blank');
                    }
                })
            },
            // 下载文件
            down_file(data) {
                this.queryParams.estimateFileList.map(item => {
                    if (item.fileName === data) {
                        window.location.href = process.env.VUE_APP_BASE_API + "/base/v1/businessFile/downloadFile?fileName=" + encodeURI(item.filePath)
                    }
                })
            },
            // 文件删除
            uploadRemove(file, fileList) {
                /// 1.获取将要删除图片的临时路径
                const filePath = file.filePath
                // 2.从数组中，找到图片对应的索引值
                const i = this.queryParams.estimateFileList.findIndex(x => x.filePath === filePath)
                // 3.调用splice方法，移除图片信息
                this.queryParams.estimateFileList.splice(i, 1)
            },
            // 文件删除
            uploadRemove1(file, fileList) {
                /// 1.获取将要删除图片的临时路径
                const filePath = file.filePath
                // 2.从数组中，找到图片对应的索引值
                const i = this.queryParams.simulationFileList.findIndex(x => x.filePath === filePath)
                // 3.调用splice方法，移除图片信息
                this.queryParams.simulationFileList.splice(i, 1)
            },
            // 选择项目经理
            handleSelect() {
                this.showPersonal = true
                this.$nextTick(() => {
                    this.$refs.personal.init()
                })
            },
            confirm(data) {
                this.queryParams.simulationEngineer = data.nickName
                this.queryParams.simulationEngineerId = data.userId
            },
            // 保存
            handleSave(status) {
                this.$refs.queryForm.validate((valid) => {
                    if (valid) {
                        this.isloading = true
                        this.queryParams.status = status
                        if (this.queryParams.id) {
                            this.$net("/simulation/updateSimuation", 'put', this.queryParams).then(res => {
                                this.isloading = false
                                this.$message.success(res.msg)
                                this.$parent.getList()
                                this.e_close()
                            }).catch(err => {
                                this.isloading = false
                            })
                        } else {
                            this.$net("/simulation/saveSimulation", 'post', this.queryParams).then(res => {
                                this.isloading = false
                                this.$message.success(res.msg)
                                this.$parent.getList()
                                this.e_close()
                            }).catch(err => {
                                this.isloading = false
                            })
                        }
                    }
                })
            },
            handleOk() {
                var params = {}
                if (this.showType == 'start') {
                    if (this.queryParams.startTime == '' || this.queryParams.startTime == null) {
                        this.$message.error('请选择开始时间')
                        return
                    }
                    params = {
                        status: 3,
                        idList: [this.queryParams.id],
                        startTime: this.queryParams.startTime
                    }
                } else {
                    if (this.queryParams.endTime == '' || this.queryParams.endTime == null) {
                        this.$message.error('请选择结束时间')
                        return
                    }
                    params = {
                        status: 4,
                        idList: [this.queryParams.id],
                        endTime: this.queryParams.endTime
                    }
                }
                this.$net('/simulation', 'post', params).then(res => {
                    this.$message.success(res.msg)
                    this.$parent.getList()
                    this.e_close()
                })
            },
            // 提交
            handleSubmit() {
                if (this.queryParams.endTime == '' || this.queryParams.endTime == null) {
                    this.$message.error('请选择结束时间')
                    return
                }
                this.$net('/simulation/submitResult', 'put', {idList: [this.queryParams.id]}).then(res => {
                    this.$message.success(res.msg)
                    this.$parent.getList()
                    this.e_close()
                })
            },
            e_close() {
                this.$emit('close')
            }
        }
    }
</script>

<style scoped>

</style>
