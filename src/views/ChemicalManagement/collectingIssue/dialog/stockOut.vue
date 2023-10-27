<template>
  <el-dialog :title="titles" :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
             :close-on-click-modal="false" width="70%" @close="cancelbtn">

    <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">
      <el-tab-pane label="领用出库" name="first">
        <el-form ref="checkForm" v-if="showSearch" :model="queryParams" :rules="rules" label-width="100px"
                 class="flexdit">
          <el-row>
            <el-col :span="8">
              <el-form-item label="出库日期" prop="outerDate">
                <el-date-picker
                  v-model="queryParams.outerDate" align="right" type="date"
                  :disabled="isdisable" placeholder="出库日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="领用部门" prop="useDeptName">
                <el-select v-model="queryParams.useDeptName" clearable filterable :disabled="isdisable"
                           @change="deptChange">
                  <el-option :value="item.deptName" :label="item.deptName"
                             v-for="(item,index) in treeOptions"></el-option>
                </el-select>
                <!-- <treeselect :default-expand-level="5" v-model="queryParams.useDept" :options="treeOptions" :normalizer="normalizer" :show-count="true" placeholder="请选择领用部门" @select="departTreeSelected"/>-->
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="耗材编号" prop="materialNumber">
                <el-input placeholder="请选择耗材编号" v-model="queryParams.materialNumber"
                          :disabled="isdisable" ref="materialNumberInput"
                          @focus="showMaterial" :readonly="true"></el-input>
                <materialSelect v-if="isShowMaterial" ref="materialSelect" :dataList="materialList"
                                @close="hideMaterial"
                                @confims="materialChange"></materialSelect>
                <!--								<el-select v-model="queryParams.materialNumber" placeholder="请选择耗材编号"
                                                           @change="materialChange" :disabled="isdisable" style="width: 100%;">
                                                    <el-option :value="item.materialNumber" :label="item.materialNumber"
                                                               v-for="(item,index) in materialList"></el-option>
                                                </el-select>-->
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

            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" placeholder="备注" v-model="queryParams.remark"
                          :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出库库位" prop="storeSiteName">
                <el-row style="display: flex;height: 30px">
                  <el-col :span="17" style="margin-right: 10px">
                    <el-input placeholder="出库库位" ref="storeSiteNameInput" v-model="queryParams.storeSiteName"
                              :readonly="true" @blur="hideStore" @focus="showStore"
                              :disabled="isdisable"></el-input>
                  </el-col>
                  <el-col :span="6">
                    <el-input placeholder="库存" v-model="detail.storeMaterialCount" :readonly="true"
                              :disabled="isdisable"></el-input>
                  </el-col>
                </el-row>
                <!--<el-select v-model="queryParams.storeSiteName" placeholder="请选择出库库位" @change="storeSiteChange" :disabled="isdisable" style="width: 100%;">
                    <el-option :value="item.storeSiteName" :label="item.storeSiteName"  v-for="(item,index) in storeList"></el-option>
                </el-select>-->
                <stockSelect v-if="isShowStore" :dataList="storeList" @close="isShowStore = false"
                             @confims="storeSiteChange2"></stockSelect>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出库数量" prop="materialCount">
                <!--                                <el-input-number placeholder="出库数量" :min="1" :max="detail.costTotal"-->
                <!--                                                 v-model="queryParams.materialCount"-->
                <!--                                                 :disabled="isdisable"></el-input-number>-->
                <el-input v-model="queryParams.materialCount" :disabled="isdisable" placeholder="出库数量"
                          oninput="value = value.replace(/[^\d]/g,'')"
                          @blur="setMaterialCount()"></el-input>
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
              <el-form-item label="领用人1">
                <el-input placeholder="领用人1" v-model="detail.usePersonAName"
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
              <el-form-item label="领用人2">
                <el-input placeholder="领用人2" v-model="detail.usePersonBName"
                          :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item style="height: 36px"></el-form-item>
            </el-col>
            <el-col :span="8" v-if="showType != 'add'">
              <el-form-item label="录入人员">
                <el-input placeholder="录入人员" v-model="detail.createByStr" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="showType != 'add'">
              <el-form-item label="最新修改日期">
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
      <el-button type="primary" v-if="showType != 'show'" :loading="isloading" @click="handleOk('Y')">保存 & 提交</el-button>
      <el-button type="cyan" v-if="showType != 'show'" :loading="isloading" @click="handleOk('N')">保存</el-button>
      <el-button @click="cancelbtn">取消</el-button>
    </div>


  </el-dialog>
</template>

<script>
  import {getMaterialStoreCount} from '@/api/chemical/essentialInformation'
  import stockSelect from '../../common/stockSelect.vue'
  import materialSelect from '../../common/materialSelect.vue'
  import {
    addMaterialStoreOut,
    getDept,
    queryStoreListByMaterialId,
    queryStoreOutDetail,
    updateMaterialStoreOut
  } from '@/api/chemical/collectingIssue'
  import approvalProcess from '@/components/approvalProcess/index'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {getApprovalProcess} from '@/api/chemical/purchaseApply'
  import {getNowTime} from '../../common/common'

  export default {
    name: 'stockOut',
    components: {approvalProcess, Treeselect, stockSelect, materialSelect},
    data() {
      return {
        showSearch: true,
        isloading: false,
        dialogShow: true,
        isFullScreen: true,
        supplierList: [],
        isDetailSelect: true,
        isShowMaterial: false,
        queryParams: {
          outerDate: '',
          materialNumber: '',
          remark: '',
          materialCount: 1,
          materialStoreId: '',
          useDeptName: '',
          useDept: '',
          storeSiteName: ''
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
        isShowStore: false,
        rules: {
          outerDate: [{required: true, message: '请选择出库数量', trigger: 'change'}],
          useDeptName: [{required: true, message: '请选择领用部门', trigger: 'change'}],
          materialNumber: [{required: true, message: '请选择耗材编号', trigger: 'blur'}],
          materialCount: [{required: true, message: '请输入出库数量', trigger: 'blur'}],
          storeSiteName: [{required: true, message: '请选择出库库位', trigger: 'blur'}]
        }
      }
    },
    mounted() {
      getDept().then(res => {
        getMaterialStoreCount().then(res2 => {
          this.treeOptions = res.data
          this.materialList = res2.data
          if (this.id == 0) {
            this.queryParams.outerDate = getNowTime()
            return false
          }
          queryStoreOutDetail(this.id).then(res3 => {
            this.queryParams.materialId = res3.data.materialId
            this.getStoreListByMaterialId(this.queryParams.materialId)
            this.queryParams.outerDate = res3.data.outerDate
            this.queryParams.useDept = res3.data.useDept
            this.queryParams.materialCount = res3.data.materialCount * 1
            this.queryParams.materialNumber = res3.data.materialNumber
            this.queryParams.remark = res3.data.remark
            this.queryParams.storeSite = res3.data.storeSite
            this.queryParams.storeSiteName = res3.data.storeSiteName
            this.queryParams.useDeptName = res3.data.useDeptName

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
            this.detail.invalidDate = res3.data.invalidDate
            this.detail.costTotal = Number(res3.data.costTotal)
            this.detail.status = res3.data.status

            this.detail.createByStr = res3.data.createByStr
            this.detail.updateTimeStr = res3.data.updateTimeStr
            this.getProcess(res3.data.status)

          })
        })
      })

      if (this.showType == 'show') {
        this.titles = '查看'
        this.isdisable = true
      } else if (this.showType == 'edit') {
        this.titles = '修改'
      } else {
        this.titles = '新增'
      }
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
                  this.queryParams.useDept = node.deptId
                  this.queryParams.useDeptName = node.deptName
              },*/
      getProcess(status) {
        const params = {
          businessType: 'MATERIAL_STORE_OUT',
          businessId: this.id,
          businessStatus: status,
          materialId: this.queryParams.materialId
        }
        getApprovalProcess(params).then(res => {
          this.approvalProcess = res
          console.log('res', res)
        })
      },
      // 限制出库数量
      setMaterialCount() {
        if (this.queryParams.materialCount * 1 > this.detail.costTotal * 1) {
          this.queryParams.materialCount = this.detail.costTotal * 1
        }
      },
      showMaterial() {
        this.isShowMaterial = true
        this.$nextTick(() => {
          this.$refs.materialSelect.init()
        })
      },
      hideMaterial() {
        this.isShowMaterial = false
      },
      showStore() {
        this.isShowStore = true
      },
      hideStore() {
        setTimeout(() => {
          this.isShowStore = false
        }, 500)
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
        this.queryParams.materialNumber = val.materialNumber
        this.detail.materialId = val.id
        this.detail.materialName = val.materialName
        this.detail.materialModel = val.materialModel
        this.detail.unit = val.unit
        this.detail.brand = val.brand
        this.detail.manufacturer = val.manufacturer
        this.detail.grade = val.grade
        this.getStoreListByMaterialId(val.id)
        this.hideMaterial()
        this.$nextTick(() => {
          this.$refs.materialNumberInput.focus()
          setTimeout(() => {
            this.isShowMaterial = false
            this.$refs.materialNumberInput.blur()
          }, 10)
        })
        /*for (var i in this.materialList) {
            if (val == this.materialList[i].materialNumber) {

            }
        }*/
      },
      getStoreListByMaterialId(id) {
        queryStoreListByMaterialId(id).then(res => {
          this.storeList = res.data
          this.storeSiteChange(this.queryParams.storeSiteName)
        })
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
      storeSiteChange2(val) {
        console.log(111111)
        this.queryParams.materialStoreId = val.id
        this.detail.batchNumber = val.batchNumber
        this.detail.certificateNo = val.certificateNo
        this.detail.productionDate = val.productionDate
        this.detail.safeDate = val.safeDate
        this.detail.invalidDate = val.invalidDate
        this.detail.costTotal = Number(val.costTotal)
        this.queryParams.materialCount = 1
        this.detail.storeMaterialCount = val.materialCount
        this.isShowStore = false
        this.queryParams.storeSite = val.storeSite
        this.queryParams.storeSiteName = val.storeSiteName
        this.$nextTick(() => {
          this.$refs.storeSiteNameInput.focus()
          setTimeout(() => {
            this.$refs.storeSiteNameInput.blur()
          }, 10)
        })
      },
      storeSiteChange(val) {
        console.log(222222)
        for (var i in this.storeList) {
          if (val == this.storeList[i].storeSiteName) {
            console.log(this.storeList[i])
            this.queryParams.materialStoreId = this.storeList[i].id
            this.detail.batchNumber = this.storeList[i].batchNumber
            this.detail.certificateNo = this.storeList[i].certificateNo
            this.detail.productionDate = this.storeList[i].productionDate
            this.detail.safeDate = this.storeList[i].safeDate
            this.detail.invalidDate = this.storeList[i].invalidDate
            this.detail.storeMaterialCount = Number(this.storeList[i].materialCount)
            this.detail.costTotal = Number(this.storeList[i].costTotal)
            // this.queryParams.materialCount = 1
            this.isShowStore = false
            this.queryParams.storeSiteName = this.storeList[i].storeSiteName
          }
        }
      },
      deptChange(val) {
        for (var i in this.treeOptions) {
          if (val == this.treeOptions[i].deptName) {
            this.queryParams.useDeptName = this.treeOptions[i].deptName
            this.queryParams.useDept = this.treeOptions[i].deptId
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
            this.isloading = true
            if (this.showType == 'edit') {
              this.queryParams.id = this.id
              delete this.queryParams.materialNumber
              delete this.queryParams.materialId
              updateMaterialStoreOut(this.queryParams).then(res => {
                if (res.code == 200) {
                  this.$message.success('修改成功')
                  this.isloading = false
                  this.$emit('handleOk')
                }
              }).catch((e) => {
                this.isloading = false
              })
            } else {
              addMaterialStoreOut(this.queryParams).then(res => {
                if (res.code == 200) {
                  this.$message.success('新增成功')
                  this.isloading = false
                  this.$emit('handleOk')
                }
              }).catch((e) => {
                this.isloading = false
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


