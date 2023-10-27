<template>
    <el-dialog :title="titles"
               :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
               :close-on-click-modal="false" width="70%">

        <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">

            <el-tab-pane label="退库" name="first">
                <el-form ref="checkForm" :rules="rules" v-if="showSearch" :model="queryParams" label-width="100px"
                         class="flexdit">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="退库日期" prop="returnDate">
                                <el-date-picker v-model="queryParams.returnDate" align="right" type="date"
                                                :disabled="isdisable" placeholder="退库日期" value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="退库部门" prop="returnDeptName">
                                <el-select v-model="queryParams.returnDeptName" clearable filterable
                                           :disabled="isdisable" placeholder="退库部门" @change="deptChange">
                                    <el-option :value="item.deptName" :label="item.deptName"
                                               v-for="(item,index) in treeOptions"></el-option>
                                </el-select>
                                <!-- <treeselect :default-expand-level="5" v-model="queryParams.returnDept" :options="treeOptions" :normalizer="normalizer" :show-count="true" placeholder="请选择领用部门" @select="departTreeSelected"/>-->
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="耗材编号" prop="materialNumber">
                                <el-select v-model="queryParams.materialNumber" placeholder="耗材编号"
                                           @change="materialChange" :disabled="true" style="width: 100%;">
                                    <el-option :value="item.materialNumber" :label="item.materialNumber"
                                               v-for="(item,index) in materialList"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="耗材名称">
                                <el-input placeholder="耗材名称" v-model="detail.materialName" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="规格型号">
                                <el-input placeholder="规格型号" v-model="detail.materialModel" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="计量单位">
                                <el-input placeholder="计量单位" v-model="detail.unit" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="品牌">
                                <el-input placeholder="品牌" v-model="detail.brand" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="生产厂商">
                                <el-input placeholder="生产厂商" v-model="detail.manufacturer" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="试剂级别">
                                <el-input placeholder="试剂级别" v-model="detail.grade" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="批号">
                                <el-input placeholder="批号" v-model="detail.batchNumber" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="证书编号">
                                <el-input placeholder="证书编号" v-model="detail.certificateNo" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="生产日期">
                                <el-input placeholder="生产日期" v-model="detail.productionDate"
                                          :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="有效期">
                                <el-input placeholder="有效期" v-model="detail.safeDate" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="有效到期日">
                                <el-input placeholder="有效到期日" v-model="detail.invalidDate" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="原出库数量">
                                <el-input placeholder="原出库数量" v-model="detail.materialCount"
                                          :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="备注">
                                <el-input type="textarea" placeholder="备注" v-model="queryParams.remark"
                                          :disabled="isdisable"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="退库数量" prop="materialCount">
                                <el-input-number placeholder="退库数量" :min="1" :max="detail.materialCount"
                                                 v-model="queryParams.materialCount"
                                                 :disabled="isdisable"></el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="入库库位" prop="storeSiteName">
                                <!--<el-input placeholder="入库库位" v-model="queryParams.storeSiteName" @focus="showStore" @blur="hideStore" :readonly="true"></el-input>-->
                                <!--<stockSelect v-if="isShowStore" :dataList="storeList" @close="isShowStore = false" @confims="storeSiteChange2"></stockSelect>-->
                                <el-select v-model="queryParams.storeSiteName" placeholder="入库库位"
                                           @change="storeSiteChange" :disabled="isdisable" style="width: 100%;">
                                    <el-option :value="item.id" :label="item.storeName"
                                               v-for="(item,index) in storeList"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item style="height: 36px"></el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="保管员1">
                                <el-input placeholder="保管员1" v-model="detail.administratorAName"
                                          :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="退库人1">
                                <el-input placeholder="退库人1" v-model="detail.returnPersonAName"
                                          :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item style="height: 36px"></el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="保管员2">
                                <el-input placeholder="保管员2" v-model="detail.administratorBName"
                                          :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="退库人2">
                                <el-input placeholder="退库人2" v-model="detail.returnPersonBName"
                                          :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item style="height: 36px"></el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="录入人员" v-if="showType != 'add'">
                                <el-input placeholder="录入人员" v-model="detail.createByStr" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="最新修改日期" v-if="showType != 'add'">
                                <el-input placeholder="最新修改日期" v-model="detail.updateTimeStr"
                                          :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="审批流程" name="second">
                <approvalProcess :approvalProcess="approvalProcess"></approvalProcess>
            </el-tab-pane>
        </el-tabs>

        <div slot="footer" class="dialog-footer">
            <el-button type="primary" v-if="showType != 'show'" @click="handleOk('Y')">保存 & 提交</el-button>
            <el-button type="cyan" v-if="showType != 'show'" @click="handleOk('N')">保存</el-button>
            <el-button @click="cancelbtn">取消</el-button>
        </div>

    </el-dialog>
</template>

<script>
    import { getMaterialStoreCount } from '@/api/chemical/essentialInformation'
    import stockSelect from '../../common/stockSelect.vue'
    import {
        addStoreOutReturn,
        getDept,
        queryStoreListByMaterialId,
        queryStoreOutDetail,
        queryStoreOutReturnDetail,
        updateStoreOutReturn
    } from '@/api/chemical/collectingIssue'
    import approvalProcess from '@/components/approvalProcess/index'
    import Treeselect from '@riophae/vue-treeselect'
    import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import { getApprovalProcess } from '@/api/chemical/purchaseApply'
    import { queryStoreSiteList } from '@/api/chemical/AcceptanceWarehousing'
    import { getNowTime } from '../../common/common'

    export default {
        name: 'stockOut',
        components: { approvalProcess, Treeselect, stockSelect },
        data() {
            return {
                showSearch: true,
                dialogShow: true,
                isFullScreen: true,
                supplierList: [],
                isDetailSelect: true,
                isShowStore: false,
                queryParams: {
                    returnDate: '',
                    materialStoreOutId: '',
                    returnDept: '',
                    returnDeptName: '',
                    storeSite: '',
                    storeSiteName: '',
                    outerDate: '',
                    materialNumber: '',
                    remark: '',
                    materialCount: 1
                },
                isdisable: false,
                activeName: 'first',
                approvalProcess: {},
                fileList: [],
                storeSiteList: [],
                uploadFileList: [],
                titles: '新增',
                materialList: [],
                detail: {},
                treeOptions: [],
                storeList: [],
                rules: {
                    returnDate: [{ required: true, message: '请选择退库日期', trigger: 'change' }],
                    returnDeptName: [{ required: true, message: '请选择退库部门', trigger: 'change' }],
                    // materialNumber: [{required: true, message: "请选择耗材编号", trailer: "change"}],
                    materialCount: [{ type: 'number', required: true, message: '请输入退库数量', trigger: 'blur' }],
                    storeSiteName: [{ required: true, message: '请选择入库库位', trigger: 'blur' }]
                }
            }
        },
        mounted() {
            queryStoreSiteList({status:1}).then(res3 => {
                getDept().then(res => {
                    getMaterialStoreCount().then(res2 => {
                        this.storeList = res3.data
                        this.treeOptions = res.data
                        this.materialList = res2.data
                        if (this.showType == 'show') {
                            this.titles = '查看'
                            this.isdisable = true
                        } else if (this.showType == 'edit') {
                            this.titles = '修改'
                        } else {
                            this.titles = '退库'
                        }
                        if (this.id == 0) {
                            return false
                        }

                        if (this.showType == 'add') {
                            this.queryParams.returnDate = getNowTime()
                            queryStoreOutDetail(this.id).then(res3 => {
                                console.log('res3',res3)
                                this.setValue(res3)
                            })
                        } else {
                            queryStoreOutReturnDetail(this.id).then(res4 => {
                                console.log('res4',res4)
                                this.setValue(res4)
                                this.queryParams.materialStoreOutId = res4.data.materialStoreOutId
                                this.queryParams.returnDate = res4.data.returnDate ? res4.data.returnDate : ''
                                this.storeSiteChange(res4.data.storeSiteName)
                            })
                        }
                    })
                })
            })

        },
        props: {
            id: {
                type: Number,
                default: 0
            },
            showType: {
                type: String,
                default: ''
            }
        },
        methods: {
            /*		normalizer(node) {
                        if (node.childList && !node.childList.length) {
                            delete node.childList;
                        }
                        return {
                            id: node.deptId,
                            label: node.deptName,
                            children: node.children,
                            parentId: node.parentId
                        };
                    },
                    departTreeSelected(node) {
                        this.queryParams.returnDept = node.deptId
                        this.queryParams.returnDeptName = node.deptName
                    },*/
            setValue(res3) {
                this.queryParams.materialId = res3.data.materialId
                // this.getStoreListByMaterialId(this.queryParams.materialId)
                if (this.showType != 'add') {
                    this.queryParams.storeSiteName = res3.data.storeSiteName
                    this.detail.materialCount = Number(res3.data.outCount)
                    this.queryParams.materialCount = Number(res3.data.materialCount)
                }else{
                    this.detail.materialCount = Number(res3.data.materialCount)
                }
                this.queryParams.outerDate = res3.data.outerDate
                this.queryParams.returnDept = res3.data.returnDept
                this.queryParams.materialNumber = res3.data.materialNumber
                this.queryParams.remark = res3.data.remark
                if (res3.data.returnDeptName) {
                    this.queryParams.returnDeptName = res3.data.returnDeptName
                }

                this.detail.materialName = res3.data.materialName
                this.detail.materialModel = res3.data.materialModel
                this.detail.unit = res3.data.unit
                this.detail.brand = res3.data.brand
                this.detail.manufacturer = res3.data.manufacturer
                this.detail.grade = res3.data.grade
                this.detail.batchNumber = res3.data.batchNumber
                this.detail.certificateNo = res3.data.certificateNo
                this.detail.productionDate = res3.data.productionDate
                this.detail.safeDate = res3.data.safeDate
                this.detail.administratorA = res3.data.administratorA
                this.detail.administratorAName = res3.data.administratorAName
                this.detail.administratorB = res3.data.administratorB
                this.detail.administratorBName = res3.data.administratorBName
                this.detail.returnPersonA = res3.data.returnPersonA
                this.detail.returnPersonAName = res3.data.returnPersonAName
                this.detail.returnPersonB = res3.data.returnPersonB
                this.detail.returnPersonBName = res3.data.returnPersonBName
                this.detail.invalidDate = res3.data.invalidDate
                this.detail.createByStr = res3.data.createByStr
                this.detail.updateTimeStr = res3.data.updateTimeStr
                this.detail.costTotal = Number(res3.data.costTotal)
                this.getProcess(res3.data.status)

            },
            getProcess(status) {
                const params = {
                    businessType: 'MATERIAL_STORE_OUT_RETURN',
                    businessId: this.id,
                    businessStatus: status,
                    materialId: this.queryParams.materialId
                }
                getApprovalProcess(params).then(res => {
                    this.approvalProcess = res
                })
            },
            supplierChange(val) {
                for (var i in this.supplierList) {
                    if (val == this.supplierList[i].supplierName) {
                        this.detail.supplierName = this.supplierList[i].supplierName
                        this.detail.supplierId = this.supplierList[i].id
                        this.detail.phone = this.supplierList[i].contactsPhone
                        this.detail.contact = this.supplierList[i].contacts
                        this.detail.supplierAddress = this.supplierList[i].address
                    }
                }
            },
            materialChange(val) {
                for (var i in this.materialList) {
                    if (val == this.materialList[i].materialNumber) {
                        this.detail.materialId = this.materialList[i].id
                        this.detail.materialName = this.materialList[i].materialName
                        this.detail.materialModel = this.materialList[i].materialModel
                        this.detail.unit = this.materialList[i].unit
                        this.detail.brand = this.materialList[i].brand
                        this.detail.manufacturer = this.materialList[i].manufacturer
                        this.detail.grade = this.materialList[i].grade
                        // this.getStoreListByMaterialId(this.materialList[i].id)
                    }
                }
            },
            selectApplyDetail() {
                if (this.showType != 'add' && this.showType != 'show') {
                    return false
                }
                this.addApplyIndex = e.$index
                this.isAddApplyDetail = true
                if (this.dataList[e.$index].materialName) {
                    this.isEditDetail = 1
                } else {
                    this.isEditDetail = 0
                }
            },
            storeSiteChange(val) {
                for (var i in this.storeList) {
                    if (val == this.storeList[i].id) {
                        this.queryParams.storeSiteName = this.storeList[i].storeName
                        this.queryParams.storeSite = this.storeList[i].id
                    }
                }
            },
            storeSiteChange2(val) {
                this.queryParams.storeSiteName = val.storeSiteName
                this.queryParams.storeSite = val.storeSite
                this.isShowStore = false
            },
            showStore() {
                this.isShowStore = true
            },
            hideStore() {
                setTimeout(() => {
                    this.isShowStore = false
                }, 500)
            },
            deptChange(val) {
                for (var i in this.treeOptions) {
                    if (val == this.treeOptions[i].deptName) {
                        this.queryParams.returnDeptName = this.treeOptions[i].deptName
                        this.queryParams.returnDept = this.treeOptions[i].deptId
                    }
                }
            },
            e_changeBox(type) {
                this.isFullScreen = type
            },
            cancelbtn() {
                this.$emit('close')
            },
            handleClick() {

            },
            handleOk(flag) {
                this.$refs['checkForm'].validate(valid => {
                    if (valid) {
                        this.queryParams.submitFlag = flag
                        if (this.showType == 'edit') {
                            this.queryParams.id = this.id
                            delete this.queryParams.materialNumber
                            delete this.queryParams.materialId
                            updateStoreOutReturn(this.queryParams).then(res => {
                                if (res.code == 200) {
                                    this.$message.success('修改成功')
                                    this.$emit('handleOk')
                                }
                            })
                        } else {
                            this.queryParams.materialStoreOutId = this.id
                            addStoreOutReturn(this.queryParams).then(res => {
                                if (res.code == 200) {
                                    this.$message.success('新增成功')
                                    this.$emit('handleOk')
                                }
                            })
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped>
    /deep/ [class*="el-col-"] {
        padding: 0 0 10px;
    }

    .el-tabs,
    .el-tabs__content {
        height: 100%;
    }
</style>


