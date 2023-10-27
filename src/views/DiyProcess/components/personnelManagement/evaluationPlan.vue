<template>
    <div style="margin-top: 20px">
        <el-form :model="queryParams"
                 ref="queryForm"
                 :inline="true"
                 class="searchform"
                 label-width="110px"
                 :rules="rules"
        >
            <el-row>
                <el-col :span="12">
                    <el-form-item label="考核编号" prop="checkNo">
                        <el-input placeholder="请输入考核编号" v-model="queryParams.checkNo" :disabled="isdisabled" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="培训记录" prop="recordNo">
                        <el-input
                                :disabled="isdisabled"
                                readonly
                                @focus="handleFocus"
                                placeholder="请选择培训记录"
                                suffix-icon="el-icon-search"
                                v-model="queryParams.recordNo">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="培训主题" prop="trainTitle">
                        <el-input placeholder="请输入培训主题" v-model="queryParams.trainTitle" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="培训日期" prop="trainDate">
                        <el-input placeholder="请输入培训日期" v-model="queryParams.trainDate" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="培训目的" prop="purpose">
                        <el-input placeholder="请输入培训目的" v-model="queryParams.purpose" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="培训方式" prop="trainMethod">
                        <el-input placeholder="请输入培训方式" v-model="queryParams.trainMethod" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="考核人员" prop="checkPerson">
                        <el-input placeholder="请输入考核人员" v-model="queryParams.checkPerson"  :disabled="isdisabled" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="考核方式" prop="checkWay">
                        <el-select v-model="queryParams.checkWay" placeholder="请选择考核方式" :disabled="isdisabled">
                            <el-option label="口头提问" :value="1"></el-option>
                            <el-option label="笔试" :value="2"></el-option>
                            <el-option label="技能演示" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="监督人员" prop="supervisePeoson">
                        <el-input placeholder="请输入监督人员" v-model="queryParams.supervisePeoson"  :disabled="isdisabled" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="监督结果" prop="superviseResult">
                        <el-select v-model="queryParams.superviseResult" placeholder="请选择监督结果" :disabled="isdisabled">
                            <el-option label="满意" value="满意"></el-option>
                            <el-option label="基本满意" value="基本满意"></el-option>
                            <el-option label="不满意" value="不满意"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="评价人员" prop="opinionPerson">
                        <el-input placeholder="请输入评价人员" v-model="queryParams.opinionPerson"  :disabled="isdisabled" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="评价日期" prop="opinionDate">
                        <el-date-picker
                                :disabled="isdisabled"
                                v-model="queryParams.opinionDate"
                                type="date"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                placeholder="请选择评价日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="综合评价结果" prop="opinion">
                        <el-select v-model="queryParams.opinion" placeholder="请选择综合评价结果" :disabled="isdisabled">
                            <el-option label="达到预定目标" :value="1"></el-option>
                            <el-option label="未达到预定目标" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="综合评价意见" prop="evaluationOpinions">
                        <el-input placeholder="请输入综合评价意见" type="textarea" v-model="queryParams.evaluationOpinions" :disabled="isdisabled" />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="上传附件" prop="key">
                        <el-upload
                                ref="upload"
                                :action="uploadUrl()"
                                :on-success=" (res, file, fileList) => {uploadSuccess(res, file, fileList); } "
                                :file-list="fileList"
                                :disabled="isdisabled"
                        >
                            <div slot="file" slot-scope="{file}">
                                <span style="padding-right: 20px">{{file.fileName}}</span>
                                <el-button type="text" size="small" @click="e_files(file)">查看</el-button>
                                <el-button type="text" size="small"  v-if="showType !== 'detail'" style="color: #ff4949" @click="uploadRemove(file)">删除
                                </el-button>
                            </div>
                            <el-button icon="el-icon-upload2" :disabled="isdisabled">上传</el-button>
                        </el-upload>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-divider content-position="left">考核成绩</el-divider>
        <div>
            <el-button size="mini" type="primary" @click="handleAdd" v-if="showType !== 'detail'">添加</el-button>
            <el-button size="mini" type="warning" @click="handleUpload" v-if="showType !== 'detail'">导入</el-button>
            <el-button size="mini" type="danger" @click="handleDel" :disabled="!rowList.length > 0" v-if="showType !== 'detail'">删除</el-button>
        </div>
        <el-table
                :data="listData"
                stripe
                border
                style="margin-top: 20px"
                @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="序号" type="index" align="center" width="50"/>
            <el-table-column label="受训人">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.personName" :disabled="isdisabled"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="考试成绩">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.personScore" :disabled="isdisabled"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="操作" align="center" width="160">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" style="color: #ff4949" @click="e_del(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: "createEvaluation",
    data () {
        return {
            diaLogShow: false,
            isloading: false,
            isdisabled: false,
            showTrainrecord: false,
            titles: '新增考核记录',
            queryParams: {
                checkNo: '',
                recordNo: '',
                trainTitle: '',
                trainDate: '',
                purpose: '',
                trainMethod: '',
                checkPerson: '',
                supervisePeoson: '',
                superviseResult: '',
                opinionPerson: '',
                opinionDate: '',
                evaluationOpinions: '',
                checkWay: null,
                trainRecordId: null,
                opinion: null,
                uploadFileList: []
            },
            fileList: [],
            rules: {
                checkNo: [
                    {required: true, message: '请输入考核编号', trigger: 'blur'},
                ],
                recordNo: [
                    {required: true, message: '请选择培训记录', trigger: 'change'},
                ],
            },
            showType: '',
            listData: [],
            rowList: [],
        }
    },
    methods: {
        init (type, data) {
            this.showType = type
            if (type === 'edit') {
                this.titles = '修改考核记录'
            } else if (type === 'detail') {
                this.titles = '查看考核记录'
                this.isdisabled = true
            }
            if (data) {
                this.queryParams = {
                    ...data
                }
                this.queryParams.purpose = data.trainRecordPhinx.purpose
                this.queryParams.recordNo = data.trainRecordPhinx.recordNo
                this.queryParams.trainTitle = data.trainRecordPhinx.trainTitle
                this.queryParams.trainDate = data.trainRecordPhinx.trainDate
                this.queryParams.trainMethod = data.trainRecordPhinx.trainMethod
                this.fileList = data.uploadFileList
                this.listData = data.trainCheckScoreList
            }
        },
        handleSelectionChange (val) {
            this.rowList = val
        },
        // 文件上传路径返回
        uploadUrl() {
            return process.env.VUE_APP_BASE_API + "/common/upload";
        },
        // 文件上传成功
        uploadSuccess(res, file, fileList, index) {
            if (200 == res.code) {
                let obj = {
                    fileName: res.fileName,
                    filePath: res.url,
                    allUrl: res.allUrl
                }
                this.fileList.push(obj)
                this.queryParams.uploadFileList = this.fileList
            } else {
                this.$message.error("文件上传失败！" + res.msg);
            }
        },
        // 查看附件
        e_files (row) {
            var obj = row.fileName.substring(row.fileName.lastIndexOf('.')+1)
            if (obj === 'pdf') {
                window.open(process.env.VUE_APP_BASE_API + '/' + row.filePath, '_blank')
            } else if (obj === 'png' || obj === 'jpg' || obj === 'jpeg') {
                this.showimage = true
                this.$nextTick(() => {
                    this.$refs.images.init(row.filePath)
                })
            }else   {
                this.dolondfile(row.filePath)
            }
        },
        // 文件删除
        uploadRemove(file, fileList) {
            /// 1.获取将要删除图片的临时路径
            const filePath = file.filePath
            // 2.从数组中，找到图片对应的索引值
            const i = this.queryParams.uploadFileList.findIndex(x => x.filePath === filePath)
            // 3.调用splice方法，移除图片信息
            this.queryParams.uploadFileList.splice(i, 1)
        },
        // 添加
        handleAdd () {
            let obj = {}
            obj.rowNum = this.listData.length
            obj.personName = ''
            obj.personScore = ''
            this.listData.push(obj)
        },
        e_del (index) {
            this.listData.splice(index,1)
        },
        // 批量删除
        handleDel () {
            this.rowList.forEach((val, index) => {
                this.listData.forEach((v, i) => {
                    if (val.rowNum == v.rowNum) {
                        this.listData.splice(i, 1)
                    }
                })
            })
        },
        // 选择培训记录
        handleFocus () {
            this.showTrainrecord = true
            this.$nextTick(() => {
                this.$refs.recordRef.init()
            })
        },
        // 选择后的数据
        getRecordDetail (row) {
            this.queryParams.recordNo = row.recordNo
            this.queryParams.trainRecordId = row.id
            this.queryParams.trainTitle = row.trainTitle
            this.queryParams.trainMethod = row.trainMethod
            this.queryParams.trainDate = row.trainDate
            this.queryParams.purpose = row.purpose
        },
        // 导入后的列表
        uploadList (data) {
            this.upload.open = false
            this.listData = this.listData.concat(data)
        },
        // 下载模板
        importTemplate () {
            const link = document.createElement('a')
            this.$net('/v1/trainCheckPhinx/downloadImportTemplate', 'getFile').then(res => {
                let blob = new Blob([res], {type: 'application/vnd.ms-excel'});  // res就是接口返回的文件流了
                let objectUrl = URL.createObjectURL(blob);
                // window.location.href = objectUrl;
                link.href = objectUrl
                link.download = '考试成绩导入模板' // 自定义文件名
                link.click() // 下载文件
                URL.revokeObjectURL(objectUrl); // 释放内存
            });
        },
        // 导入
        handleUpload () {
            this.upload.title = "导入";
            this.upload.open = true;
        },
        handleSave (status) {
            this.$refs.queryForm.validate((valid) => {
                if (valid) {
                    this.isloading = true
                    this.queryParams.status = status
                    if (this.listData.length === 0) {
                        this.isloading = false
                        this.$message.error('请至少填写一条考核成绩，完善表格数据')
                        return;
                    }
                    let isEmpty = false
                    this.listData.map(item => {
                        if (item.personName === '' || item.personScore === '') {
                            isEmpty = true
                        }
                    })
                    if (isEmpty) {
                        this.isloading = false
                        this.$message.warning('请完善表格数据')
                        return;
                    }
                    const params = {
                        ...this.queryParams,
                        trainCheckScoreList: this.listData
                    }
                    if (this.queryParams.id) {
                        this.$net('/v1/trainCheckPhinx/updateTrainCheck', 'put', params).then(res => {
                            this.isloading = false
                            this.$message.success(res.msg)
                            this.$parent.getList()
                            this.e_close()
                        }).catch((err) => {
                            this.$message.success(err)
                            this.isloading = false
                        })
                    }else {
                        this.$net('/v1/trainCheckPhinx/addTrainCheck', 'post', params).then(res => {
                            this.isloading = false
                            this.$message.success(res.msg)
                            this.$parent.getList()
                            this.e_close()
                        }).catch((err) => {
                            this.$message.success(err)
                            this.isloading = false
                        })
                    }
                }
            })
        },
        e_close () {
            this.$emit('close')
        }
    }
}
</script>

<style scoped>

</style>