<template>
    <div>
        <el-divider content-position="left">处理基本信息</el-divider>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="处理部门" prop="processingDeptName">
                        <el-input v-model="form.processingDeptName" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="处理人员" prop="processingUserName">
                        <el-input v-model="form.processingUserName" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="处理日期" prop="processingDate">
                        <el-input v-model="form.processingDate" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="处理类型" prop="processingTypeId">
                        <el-select v-model="form.processingTypeId" :disabled="isdisable" @change="handleProcess">
                            <el-option :label="item.dictLabel" :value="item.dictCode"
                                       v-for="item in dealList"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="样品现状" prop="sampleStatusId">
                        <el-select v-model="form.sampleStatusId" @change="handleSample" :disabled="isdisable">
                            <el-option :label="item.dictLabel" :value="item.dictCode"
                                       v-for="item in sampleType"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="处理说明" prop="remark" :disabled="isdisable">
                        <el-input type="textarea" v-model="form.remark" :disabled="isdisable"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="样品图片" prop="">
                        <el-upload
                                ref="upload"
                                :action="uploadUrl"
                                :headers="headers"
                                :file-list="form.uploadFileList"
                                :on-success=" (res, file, fileList) => {uploadSuccess(res, file, fileList); } "
                                :disabled="isdisable"
                                :before-upload="beforeUploads"
                                accept=".png, .jpg, .jpeg"
                        >
                            <div slot="file" slot-scope="{file}" style="margin-left: 10px">
                                <span style="padding-right: 20px">{{ file.fileName }}</span>
                                <el-button type="text" size="small" @click="look_file(file.fileName)">查看</el-button>
                                <el-button type="text" size="small" style="color: #ff4949" :disabled="isdisable"
                                           @click="uploadRemove(file)">删除
                                </el-button>
                            </div>
                            <el-button icon="el-icon-upload2" :disabled="isdisable" size="small">上传</el-button>
                        </el-upload>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-divider content-position="left">处理样品信息</el-divider>
        <div style="color: #3e99f6; margin: 10px;font-size: 15px;font-weight: bold" v-if="showType !== 'add'">
            样品总数：{{ totalSapmle }}
        </div>
        <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column prop="id" type="index" label="序号" width="55px"/>
            <el-table-column prop="sampleCode" label="样品编码" align="center"></el-table-column>
            <el-table-column prop="detectName" label="检测类别" align="center"></el-table-column>
            <el-table-column prop="" label="样品类型" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                          <span>{{
                              microStore.state.BeiYuan.sampleTypeList.filter((item) => {
                                return item.value === scope.row.sampleType;
                              })[0].label
                              }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="detectItem" label="检测项目" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="e_detailItem(scope.row.itemVOList)">{{ scope.row.detectItem }}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="sampleProcessingNumber" label="处理数量" align="center"
                             v-if="showType !== 'add'"></el-table-column>
            <el-table-column label="处理数量" align="center" v-else>
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.stockNumber" :min="1" :max="scope.row.sampleProcessingNumber"/>
                </template>
            </el-table-column>
            <el-table-column prop="sampleUnit" label="单位" align="center"></el-table-column>
            <el-table-column prop="entrustCode" label="委托单号" align="center"></el-table-column>
            <el-table-column prop="warehouseLocation" label="库位" align="center"></el-table-column>
            <el-table-column label="操作" align="center" v-if="showType !== 'detail'">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="e_del(scope.row, scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--检测项目详情-->
        <projectDetails v-if="showProject" ref="project" @close="showProject = false"></projectDetails>
        <!-- 纳通签名  -->
        <signature v-if="showSignature" ref="signatureRef" @close="showSignature = false"
                   @imgBase64="imgBase64"></signature>
    </div>
</template>

<script>
import {getToken} from "@/utils/auth";
import projectDetails from "./projectDetails.vue";
import moment from "moment/moment";
import Vue from "vue";

export default {
    name: "sampleProcessing",
    components: {projectDetails},
    data() {
        return {
            widget: [
                {
                    label: '签名图片',
                    type: 'image'
                }
            ],
            showlog: false,
            isdisable: false,
            isloading: false,
            showSignature: false,
            form: {
                processingDeptName: this.$store.state.user.userInfo.dept.deptName,
                processingDeptId: this.$store.state.user.userInfo.dept.deptId,
                processingUserName: this.$store.state.user.userInfo.nickName,
                processingUserId: this.$store.state.user.userInfo.userId,
                processingDate: moment().format("YYYY-MM-DD HH:mm:ss"),
                processingTypeId: null,
                sampleStatusId: null,
                sampleStatus: '',
                processingType: '',
                remark: '',
                uploadFileList: []
            },
            rules: {
                processingDeptName: [
                    {required: true, message: "请选择处理部门", trigger: "change"},
                ],
                processingTypeId: [
                    {required: true, message: "请选择处理类型", trigger: "change"},
                ],
                sampleStatusId: [
                    {required: true, message: "请选择样品现状", trigger: "change"},
                ],
            },
            tableData: [],
            dealList: [],
            sampleType: [],
            headers: {Authorization: "Bearer " + getToken()},
            showType: '',
            showProject: false,
            totalSapmle: 0,
            stockType: null,
            projectWidget: {},
            resultEntrySlotButtonList: {
                actionButtons: [],
                entrySlotButtonList: []
            },
            imgSrc: ''
        }
    },
    computed: {
        uploadUrl() {
            return window.globalEnv.VUE_APP_BASE_API + "/common/upload";
        },
    },
    async created() {
        await this.doLoadMicroApp('microProject', this.microProjectEntry)
        this.projectWidget = await this.getProjectWidget('sampleSign')
        Vue.component('signature', window.commonComponents.signature)
        this.resultEntrySlotButtonList = await this.getProjectSlotButtons('signatureButton')
    },
    methods: {
        init(data, type, stockType) {
            this.showlog = true
            this.stockType = stockType
            if (type == 'detail') {
                this.isdisable = true
            }
            this.showType = type
            // 处理类型
            this.getDicts("deal_type").then(response => {
                this.dealList = response.data
            });
            // 样品现状
            this.getDicts("ypxz").then(response => {
                this.sampleType = response.data
            });
            if (type !== 'add') {
                this.form = {
                    ...data
                }
                this.tableData = data.detailList
                this.tableData.forEach(item => {
                    this.totalSapmle += item.sampleProcessingNumber
                })
                if (data.extData !== null) {
                    if (data.extData.signImg) {
                        this.imgSrc = data.extData.signImg
                    }
                }
            } else {
                this.tableData = data
                this.tableData.forEach(item => {
                    item.sampleProcessingNumber = item.stockNumber
                    item.warehouseLocation = item.inboundLocation
                })
                console.log(this.tableData)
            }
        },
        handleSample(e) {
            let obj = {};
            obj = this.sampleType.find((item) => { // 这里的userList就是上面遍历的数据源
                return item.dictCode === e; // 筛选出匹配数据
            });
            this.form.sampleStatus = obj.dictLabel
        },
        handleProcess(e) {
            let obj = {};
            obj = this.dealList.find((item) => { // 这里的userList就是上面遍历的数据源
                return item.dictCode === e; // 筛选出匹配数据
            });
            this.form.processingType = obj.dictLabel
        },
        uploadSuccess(res, file, fileList, index) {
            console.log(res, file, fileList, index);
            if (200 == res.code) {
                this.form.uploadFileList.push({
                    filePath: res.url,
                    fileName: res.fileName,
                });
            } else {
                this.$message.error("文件上传失败！" + res.msg);
            }
        },
        beforeUploads(file) {
            // 限制文件上传大小
            // const isLt5M = this.beforeUpload(file);
            // return isLt5M
            var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
            const extension5 = testmsg === 'png'
            const extension6 = testmsg === 'jpg'
            const extension7 = testmsg === 'jpeg'
            if (!extension5 && !extension6 && !extension7) {
                this.$message({
                    message: '只能上传图片!',
                    type: 'warning'
                });
                return false
            }
        },
        // 查看文件
        look_file(data) {
            this.form.uploadFileList.map(item => {
                if (item.fileName === data) {
                    window.open(process.env.VUE_APP_BASE_API + '/' + item.filePath, '_blank');
                }
            })
        },
        // 文件删除
        uploadRemove(file, fileList) {
            /// 1.获取将要删除图片的临时路径
            const filePath = file.filePath
            // 2.从数组中，找到图片对应的索引值
            const i = this.form.uploadFileList.findIndex(x => x.filePath === filePath)
            // 3.调用splice方法，移除图片信息
            this.form.uploadFileList.splice(i, 1)
        },
        // 样品删除
        e_del(row, index) {
            if (this.showType !== 'add') {
                this.$net(`/handover/v2/sampleProcessing/delDetail/${row.id}`, 'delete').then(res => {
                    this.$message.success(res.msg)
                    this.tableData.splice(index, 1)
                    this.totalSapmle = 0
                    this.tableData.forEach(item => {
                        this.totalSapmle += item.sampleProcessingNumber
                    })
                })
            } else {
                this.tableData.splice(index, 1)
            }
        },
        // 查看检测项目
        e_detailItem(list) {
            this.showProject = true
            this.$nextTick(() => {
                this.$refs.project.init('', list)
            })
        },
        /**
         * @author Coder
         * @date 2023/4/20
         * @des 插槽按钮事件
         */
        e_slotButtonEvents(v) {
            var that = this
            new Function('that', v.events)(that)
        },
        handleSave() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.isloading = true
                    if (this.showType == 'add') {
                        this.tableData.map(item => {
                            item.sampleProcessingNumber = item.stockNumber
                        })
                        this.form.fileList = this.form.uploadFileList
                        this.form.detailList = this.tableData
                        this.form.stockType = this.stockType
                        if (this.imgSrc !== '') {
                            this.form.extData = {
                                signImg: this.imgSrc
                            }
                        }
                        this.$net('/handover/v2/sampleProcessing/save', 'post', this.form).then(res => {
                            this.isdisable = false
                            this.$message.success(res.msg)
                            this.e_close()
                        }).finally(() => {
                            this.isloading = false
                        })
                    } else {
                        const params = {
                            fileList: this.form.uploadFileList,
                            id: this.form.id,
                            processingType: this.form.processingType,
                            processingTypeId: this.form.processingTypeId,
                            remark: this.form.remark,
                            sampleStatus: this.form.sampleStatus,
                            sampleStatusId: this.form.sampleStatusId,
                        }
                        this.$net('/handover/v2/sampleProcessing/update', 'post', params).then(res => {
                            this.isdisable = false
                            this.$message.success(res.msg)
                            this.e_close()
                        }).finally(() => {
                            this.isloading = false
                        })
                    }
                }
            })
        },
        // 纳通签名回显
        imgBase64(data) {
            this.imgSrc = data
        },
        e_close() {
            this.$parent.getList()
            this.$emit('close')
        }
    }
}
</script>

<style scoped>

</style>
<script setup>
</script>