<template>
    <el-dialog
        :title="title"
        :visible.sync="saveShow"
        center
        :show-close="true"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        @close="close"
        width="70%"
    >
        <el-form
            :model="personnelParam"
            :rules="rules"
            ref="saveForm"
            :inline="true"
            label-width="120px"
            label-position="left"
        >
            <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true">
                <el-tab-pane label="基本信息" name="first">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="员工工号" prop="staffCode">
                                <el-input v-model="personnelParam.staffCode"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="员工姓名" prop="staffName">
                                <el-input v-model="personnelParam.staffName"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="员工性别" prop="staffSex">
                                <el-select
                                    v-model="personnelParam.staffSex"
                                >
                                    <el-option label="男" :value="0"></el-option>
                                    <el-option label="女" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="身份证号" prop="idCard">
                                <el-input v-model="personnelParam.idCard"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="所属部门" prop="departmentName">
                                <el-input
                                    v-model="personnelParam.departmentName"
                                    placeholder="选择所属部门"
                                    @focus="deptShow = true"
                                    @search="deptShow = true"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="职务岗位" prop="positionName">
                                <el-input
                                    v-model="personnelParam.positionName"
                                    placeholder="选择职务/岗位"
                                    @focus="postShow = true"
                                    @search="postShow = true"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="员工学历" prop="staffEducation">
                                <el-select
                                    v-model="personnelParam.staffEducation"
                                >
                                    <el-option label="硕士" :value="0"></el-option>
                                    <el-option label="本科" :value="1"></el-option>
                                    <el-option label="专科" :value="2"></el-option>
                                    <el-option label="博士" :value="3"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="所学专业" prop="professional">
                                <el-input v-model="personnelParam.professional"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="员工状态" prop="status">
                                <el-select v-model="personnelParam.status">
                                    <el-option label="在职" :value="0"></el-option>
                                    <el-option label="离职" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="入职时间" prop="entryTime">
                                <el-date-picker
                                    v-model="personnelParam.entryTime"
                                    type="date"
                                    placeholder="选择日期"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="离职时间" prop="departureTime">
                                <el-date-picker
                                    v-model="personnelParam.departureTime"
                                    type="date"
                                    placeholder="选择日期"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="关联用户账号" prop="userName" class="overlable">
                                <el-input
                                    v-model="personnelParam.userName"
                                    placeholder="选择用户"
                                    @focus="userShow = true"
                                    @search="userShow = true"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-tab-pane>

                <el-tab-pane label="上岗证信息" name="second">

                        <el-form-item label="上岗证类型" prop="workLicenseType">
                          <el-select
                              v-model="personnelParam.workLicenseType"
                              style="width: 100%"
                              @change="handleClickchild($event)"
                          >
                            <el-option label="采样证" :value="0"></el-option>
                            <el-option label="检测证" :value="1"></el-option>
                          </el-select>
                        </el-form-item>


                        <el-button
                            type="primary"
                            style="margin-left: 10px; margin-bottom: 10px"
                            @click="personnelParam.workLicenseType == 0 ? handleMaintainSample() : handleMaintainDetection()"
                        >
                          添加
                        </el-button>

                    <el-tabs
                        v-model="activeNameSon"
                        @tab-click="handleClickSon"
                        :stretch="true"
                    >
                        <el-tab-pane label="采样证" name="first">
                            <el-row>
                                <el-col>
                                    <el-button
                                        type="primary"
                                        size="mini"
                                        style="margin-left: 10px; margin-bottom: 10px"
                                        @click="handleMaintainSample"
                                    >
                                        维护范围
                                    </el-button>
                                    <el-button
                                        type="primary"
                                        size="mini"
                                        style="margin-left: 10px; margin-bottom: 10px"
                                        @click="handleDelSample"
                                    >
                                        删除
                                    </el-button>
                                </el-col>
                            </el-row>

                            <el-table
                                v-loading="loading"
                                :data="sampleTableData"
                                align="center"
                                border
                                @selection-change="e_seleteSample"
                            >
                                <el-table-column type="selection" width="55"/>
                                <el-table-column
                                    prop="id"
                                    type="index"
                                    label="序号"
                                    width="55px"
                                />
                                <el-table-column
                                    prop="detectName"
                                    label="检测类别名称"
                                    align="center"
                                    :show-overflow-tooltip="true"
                                />
                                <el-table-column
                                    prop="parentName"
                                    label="上级类别名称"
                                    align="center"
                                    :show-overflow-tooltip="true"
                                />
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="检测证" name="second">
                            <el-row>
                                <el-col>
                                    <el-button
                                        type="primary"
                                        size="mini"
                                        style="margin-left: 10px; margin-bottom: 10px"
                                        @click="handleMaintainDetection"
                                    >
                                        维护范围
                                    </el-button>
                                    <el-button
                                        type="primary"
                                        size="mini"
                                        style="margin-left: 10px; margin-bottom: 10px"
                                        @click="handleDelDetection"
                                    >
                                        删除
                                    </el-button>
                                </el-col>
                            </el-row>

                            <el-table
                                v-loading="loading"
                                :data="detectionTableData"
                                align="center"
                                border
                                @selection-change="e_seleteDetection"
                            >
                                <el-table-column type="selection" width="55"/>
                                <el-table-column
                                    prop="id"
                                    type="index"
                                    label="序号"
                                    width="55px"
                                />
                                <el-table-column
                                    prop="detectName"
                                    label="检测类别名称"
                                    align="center"
                                    :show-overflow-tooltip="true"
                                />
                                <el-table-column
                                    prop="itemName"
                                    label="检测项目名称"
                                    align="center"
                                    :show-overflow-tooltip="true"
                                />
                                <el-table-column
                                    prop="methodCode"
                                    label="检测方法编号"
                                    align="center"
                                    :show-overflow-tooltip="true"
                                />
                                <el-table-column
                                    prop="methodName"
                                    label="检测方法名称"
                                    align="center"
                                    :show-overflow-tooltip="true"
                                />
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-tab-pane>
            </el-tabs>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm" :loading="isloading" center> 保存</el-button>
            <el-button @click="close">取消</el-button>
        </div>

        <selectDept :visible.sync="deptShow" @backfill="backFillDept"/>
        <selectPost :visible.sync="postShow" @backfill="backFillPost"/>
        <selectUser :visible.sync="userShow" @backfill="backFillUser"/>
        <selectDetectCategory
            :categoryShow.sync="categoryShow"
            ref="categoryHandle"
        />
        <selectDetectItem :itemShow.sync="itemShow" ref="itemHandle"/>
    </el-dialog>
</template>

<script>
    import {
        addPersonnel,
        getPersonnel,
        editPersonnel,
        getWorkLicenseList
    } from '@/api/personnel/personnel'
    import selectDept from '@/components/common/selectDept'
    import selectPost from '@/components/common/selectMultiplePost'
    import selectUser from './selectUser'
    import selectDetectCategory from './selectDetectCategory'
    import selectDetectItem from './selectDetectItem'

    export default {
        name: 'saveOrEdit',
        components: {
            selectPost,
            selectDept,
            selectUser,
            selectDetectCategory,
            selectDetectItem
        },
        data() {
            return {
                activeName: 'first',
                activeNameSon: 'first',
                loading: false,
                saveShow: false,
                isloading: false,
                editNum: '',
                dialogImageUrl: '',
                dialogVisible: false,

                deptShow: false,
                postShow: false,
                userShow: false,
                categoryShow: false,
                itemShow: false,
                // 采样证表格数据
                sampleTableData: [],
                // 检测证表格数据
                detectionTableData: [],
                // 性别状态字典
                sexOptions: [],
                // 部门树选项
                deptOptions: undefined,
                selPackage: [],
                selPackageDetection: [],
                personnelParam: {
                    id: null,
                    staffCode: null,
                    staffName: null,
                    staffSex: null,
                    idCard: null,
                    departmentId: null,
                    departmentName: null,
                    positionId: null,
                    positionName: null,
                    staffEducation: null,
                    professional: null,
                    status: null,
                    entryTime: null,
                    departureTime: null,
                    userId: null,
                    userName: null,
                    workLicenseType: null,
                    workLicenseTypeSample: null,
                    workLicenseTypeDetection: null,
                    samplingList: null,
                    detectionList: null
                },
                rules: {
                    staffCode: [
                        { required: true, message: '请输入员工编号', trigger: 'blur' }
                    ],
                    staffName: [
                        { required: true, message: '请输入员工姓名', trigger: 'blur' }
                    ],
                    staffSex: [
                        { required: true, message: '请选择员工性别', trigger: 'change' }
                    ],
                    idCard: [
                        { required: true, message: '请输入身份证号', trigger: 'blur' }
                    ],
                    departmentName: [
                        { required: true, message: '请选择所属部门', trigger: 'change' }
                    ],
                    staffEducation: [
                        { required: true, message: '请选择员工学历', trigger: 'change' }
                    ],
                    status: [
                        { required: true, message: '请输入员工状态', trigger: 'change' }
                    ],
                    entryTime: [
                        { required: true, message: '请输入入职时间', trigger: 'blur' }
                    ]
                },
                uploadShow: false
            }
        },
        props: {
            title: {
                type: String,
                default: ''
            }
        },
        methods: {
            addInit() {
                this.saveShow = true
                this.personnelParam = {}
                this.sampleTableData = []
                this.detectionTableData = []
                this.activeName = 'first'
                this.activeNameSon = 'first'
                this.personnelParam.workLicenseType = 0
            },
            editInIt(id, state) {
                this.saveShow = true
                this.editNum = state
                this.activeName = 'first'
                this.activeNameSon = 'first'
                getPersonnel(id).then((response) => {
                    this.personnelParam = response.data
                })
                this.personnelParam.id = id
                getWorkLicenseList(this.personnelParam).then((response) => {
                    response.data.sampleList.forEach((item) => {
                        let selPackage = {
                            detectCategoryId: item.id,
                            detectName: item.detectName,
                            parentName: item.parentName
                        }
                        this.sampleTableData.push(selPackage)
                    })
                    response.data.detectionList.forEach((item) => {
                        let selPackage = {
                            itemMethodId: item.itemId,
                            detectCategoryId: item.detectId,
                            detectName: item.detectName,
                            itemName: item.itemName,
                            methodName: item.methodName,
                            methodCode: item.methodCode
                        }
                        this.detectionTableData.push(selPackage)
                    })
                    console.log('this.sampleTableData,修改', this.sampleTableData)
                    console.log('this.detectionTableData，修改', this.detectionTableData)
                })
            },
            handleClick(tab, event) {
                if (this.activeName === 'second') {
                    this.personnelParam.workLicenseType = 0
                    this.activeNameSon = 'first'
                }
            },
            handleClickchild(e) {
                this.personnelParam.workLicenseType = e
                if (this.personnelParam.workLicenseType == 0) {
                    this.activeNameSon = 'first'
                } else if (this.personnelParam.workLicenseType == 1) {
                    this.activeNameSon = 'second'
                }
            },
            handleClickSon(tab, event) {
                if (this.activeNameSon === 'first') {
                    this.personnelParam.workLicenseType = 0
                } else if (this.activeNameSon === 'second') {
                    this.personnelParam.workLicenseType = 1
                }
            },
            //保存按钮
            submitForm() {
                if (this.sampleTableData.length) {
                    this.personnelParam.workLicenseTypeSample = 0
                    this.personnelParam.samplingList = this.sampleTableData
                } else {
                    this.sampleTableData = []
                    this.personnelParam.samplingList = this.sampleTableData
                }
                if (this.detectionTableData.length) {
                    this.personnelParam.workLicenseTypeDetection = 1
                    this.personnelParam.detectionList = this.detectionTableData
                } else {
                    this.personnelParam.detectionList = []
                }
                console.log('this.personnelParam', this.personnelParam)
                this.$refs['saveForm'].validate((valid) => {
                    if (valid) {
                        this.isloading = true
                        if (this.personnelParam.id != null) {
                            editPersonnel(this.personnelParam, this.personnelParam.id).then(
                                (response) => {
                                    if (response.code === 200) {
                                        this.$message.success('保存成功')
                                        this.isloading = false
                                        this.detectionTableData = []
                                        this.sampleTableData = []
                                    }
                                    //触发父组件传递过来的函数getTableList()
                                    this.$emit('func', null)
                                    this.close()
                                }).catch((e) => {
                                this.isloading = false
                            })
                        } else {
                            addPersonnel(this.personnelParam).then((response) => {
                                //触发父组件传递过来的函数getTableList()
                                if (response.code === 200) {
                                    this.$message.success('保存成功')
                                    this.isloading = false
                                    this.detectionTableData = []
                                    this.sampleTableData = []
                                }
                                this.$emit('func', null)
                                this.close()
                            }).catch((e) => {
                                this.isloading = false
                            })
                        }
                    }
                })
            },
            //取消按钮操作
            close() {
                this.saveShow = false
                this.detectionTableData = []
                this.sampleTableData = []
                this.personnelParam = {}
                this.$emit('close')
            },
            //填充检测单位
            backFillDept(dept) {
                this.personnelParam.departmentId = dept.deptId
                this.$set(this.personnelParam, 'departmentName', dept.deptName)
            },
            backFillPost(resultPosts) {
                let tempIds = ''
                let tempNames = ''
                resultPosts.forEach((item) => {
                    tempIds += item.postId + ','
                    tempNames += item.postName + ','
                })
                this.personnelParam.positionId = tempIds
                this.personnelParam.positionName = tempNames
            },
            //回填选中的用户
            backFillUser(resultUsers) {
                let tempIds = ''
                let tempNames = ''
                resultUsers.forEach((item) => {
                    tempIds += item.userId
                    tempNames += item.userName
                })
                this.personnelParam.userId = tempIds
                this.personnelParam.userName = tempNames
            },
            //采样证选择检测类别
            backFillCategory(resultCategory) {
                console.log('resultCategory 采样证选择检测类别', resultCategory)
                this.sampleTableData = []
                for (let i = 0; i < resultCategory.length; i++) {
                    // let num = 0
                    // if (this.sampleTableData.length > 0) {
                    // 	this.sampleTableData.forEach((item,index) => {
                    // 		if (item.detectCategoryId == resultCategory[i].id) {
                    // 			num = 1
                    // 		}
                    // 	})
                    // }
                    // if (num == 0) {
                    this.sampleTableData.push({
                        detectCategoryId: resultCategory[i].id,
                        detectName: resultCategory[i].detectName,
                        parentName: resultCategory[i].parentName
                    })
                }
            },
            //检测证选择坚持项目
            backFillItem(resultItem) {
                this.detectionTableData = []
                console.log('resultItem 检测证选择坚持项目', resultItem)
                for (let i = 0; i < resultItem.length; i++) {
                    // let num = 0
                    // if (this.detectionTableData.length > 0) {
                    // 	this.detectionTableData.forEach((item) => {
                    // 		if (item.itemMethodId == resultItem[i].itemId) {
                    // 			num = 1
                    // 		}
                    // 	})
                    // }
                    // if (num == 0) {
                    this.detectionTableData.push({
                        itemMethodId: resultItem[i].itemId,
                        detectCategoryId: resultItem[i].detectId,
                        detectName: resultItem[i].detectName,
                        itemName: resultItem[i].itemName,
                        methodName: resultItem[i].methodName,
                        methodCode: resultItem[i].methodCode
                    })
                    // }
                }
            },
            //采样证维护范围
            handleMaintainSample() {
                this.categoryShow = true
                let TableData = []
                this.sampleTableData.forEach((item) => {
                    TableData.push({
                        id: item.detectCategoryId,
                        detectName: item.detectName,
                        parentName: item.parentName
                    })
                })
                this.sampleTableData = TableData
                this.$refs.categoryHandle.init(this.sampleTableData)
            },
            //采样证选择数据
            e_seleteSample(arr) {
                this.selPackage = arr
            },
            //采样证删除
            handleDelSample() {
                console.log('this.selPackage', this.selPackage)
                if (!this.selPackage.length) {
                    this.$message.info('至少选择一条数据')
                    return
                }
                this.$confirm('确定要删除', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        for (var j in this.selPackage) {
                            for (var i = this.sampleTableData.length - 1; i >= 0; i--) {
                                if (this.selPackage[j].detectCategoryId == this.sampleTableData[i].detectCategoryId) {
                                    this.sampleTableData.splice(i, 1)
                                }
                            }
                        }
                        this.getItemList()
                        this.$message.success('删除成功')
                    })
                    .catch(function() {
                    })
                console.log('this.sampleTableData', this.sampleTableData)
            },
            //检测证维护范围
            handleMaintainDetection() {
                this.itemShow = true
                let detectionTableData = []
                this.detectionTableData.forEach((item) => {
                    console.log('item', item)
                    detectionTableData.push({
                        itemId: item.itemMethodId,
                        detectId: item.detectCategoryId,
                        detectName: item.detectName,
                        itemName: item.itemName,
                        methodName: item.methodName,
                        methodCode: item.methodCode
                    })
                })
                this.detectionTableData = detectionTableData
                console.log('this.detectionTableData', this.detectionTableData)
                this.$refs.itemHandle.init(this.detectionTableData)
            },
            //检测证选择数据
            e_seleteDetection(arr) {
                this.selPackageDetection = arr
            },
            //检测证删除
            handleDelDetection() {
                console.log('selPackageDetection', this.selPackageDetection)
                if (!this.selPackageDetection.length) {
                    this.$message.info('至少选择一条数据')
                    return
                }
                this.$confirm('确定要删除', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        for (var j in this.selPackageDetection) {
                            for (var i = this.detectionTableData.length - 1; i >= 0; i--) {
                                if (this.selPackageDetection[j].itemMethodId == this.detectionTableData[i].itemMethodId) {
                                    this.detectionTableData.splice(i, 1)
                                }
                            }
                        }
                        this.getItemList()
                        this.$message.success('删除成功')
                    })
                    .catch(function() {
                    })
            }
        },
        created() {
        }
    }
</script>

<style scoped>
</style>
