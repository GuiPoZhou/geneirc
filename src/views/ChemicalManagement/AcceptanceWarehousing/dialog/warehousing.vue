<template>
  <el-dialog :title="titles" :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
             :close-on-click-modal="false" width="70%" @close="cancelbtn">

    <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">

      <el-tab-pane label="验收入库" name="first">
        <el-form ref="checkForm" v-if="showSearch" :rules="rules" :model="queryParams" label-width="100px"
                 class="flexdit">
          <el-row>
            <el-col :span="8">
              <el-form-item label="采购单号">
                <el-input placeholder="采购单号" v-model="detail.buyOrderNo" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商名称" prop="supplierName">
                <el-select v-model="queryParams.supplierName" placeholder="请选择供应商"
                           :disabled="isDetailSelect" @change="supplierChange" style="width: 100%;">
                  <el-option :value="item.supplierName" :label="item.supplierName"
                             v-for="(item,index) in supplierList"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8" v-if="showType != 'add'">
              <el-form-item label="行号">
                <el-input placeholder="行号" v-model="detail.rowIndex" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="耗材编号" prop="materialNumber">
                <el-input placeholder="请选择耗材编号" v-model="queryParams.materialNumber"
                          :disabled="isdisable"
                          @focus="showMaterial" :readonly="true"></el-input>
                <materialSelect v-if="isShowMaterial" ref="materialSelect" :dataList="materialList"
                                @close="hideMaterial"
                                @confims="materialChange"></materialSelect>
                <!--<el-select v-model="queryParams.materialNumber" placeholder="请选择耗材编号" @change="materialChange" :disabled="isDetailSelect" style="width: 100%;">
                        <el-option :value="item.materialNumber" :label="item.materialNumber" v-for="(item,index) in materialList"></el-option>
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
            <el-col :span="8" v-if="showType != 'add'">
              <el-form-item label="采购数量">
                <el-input placeholder="采购数量" v-model="detail.orderCount" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="showType != 'add'">
              <el-form-item label="入库数量合计">
                <el-input placeholder="入库数量合计" v-model="detail.acceptCount"
                          :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="showType != 'add'">
              <el-form-item label="未交数量">
                <el-input placeholder="未交数量" v-model="detail.unAcceptCount"
                          :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="showType != 'add'">
              <el-form-item label="要求到货日期">
                <el-input placeholder="要求到货日期" v-model="detail.finishDate"
                          :disabled="true"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24" style="margin-top: 50px;"></el-col>

            <el-col :span="8">
              <el-form-item label="入库日期" prop="storeInDate">
                <el-date-picker
                  v-model="queryParams.storeInDate"
                  type="date" value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd" :disabled="isdisable"
                  placeholder="选择入库日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="入库库位" prop="storeSiteName">
                <el-select placeholder="入库库位" :disabled="isdisable" v-model="queryParams.storeSiteName"
                           @change="storeSiteChange">
                  <el-option :value="item.id+''" :label="item.storeName"
                             v-for="(item,index) in storeSiteList"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="入库数量" prop="materialCount">
                <el-input placeholder="入库数量" @change="calculate()" v-model="queryParams.materialCount"
                          :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <!--<el-col :span="8">
                <el-form-item label="计量单位">
                    <el-input placeholder="计量单位" v-model="queryParams.unit" :disabled="isdisable"></el-input>
                </el-form-item>
            </el-col>-->

            <el-col :span="8">
              <el-form-item label="单价" prop="price">
                <el-input placeholder="单价" v-model="queryParams.price" @change="calculate()"
                          :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="金额" prop="amount">
                <el-input placeholder="金额" v-model="queryParams.amount" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="批号" prop="batchNumber">
                <el-input placeholder="批号" v-model="queryParams.batchNumber" @change="hasBatchNumber"
                          :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生产日期" prop="productionDate">
                <el-date-picker v-model="queryParams.productionDate"
                                type="date" value-format="yyyy-MM-dd"
                                :disabled="!queryParams.batchNumber || isdisable" format="yyyy-MM-dd"
                                placeholder="选择生产日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="有效期" prop="safeDate">
                <el-input placeholder="有效期" :disabled="!queryParams.batchNumber || isdisable"
                          v-model="queryParams.safeDate"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="有效到期日" prop="invalidDate">
                <el-date-picker :disabled="!queryParams.batchNumber || isdisable"
                                v-model="queryParams.invalidDate" type="date" value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd" placeholder="选择有效到期日">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="证书编号" prop="certificateNo">
                <el-input placeholder="证书编号" v-model="queryParams.certificateNo"
                          :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" 　style="height: 58px;"></el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" placeholder="备注" v-model="queryParams.remark"
                          :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="验收人1" prop="checkPersonaName">
                <el-input placeholder="验收人1" v-model="queryParams.checkPersonaName"
                          :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="入库人1" prop="storePersonaName">
                <el-input placeholder="入库人1" v-model="queryParams.storePersonaName"
                          :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="送货人" prop="postPerson">
                <el-input placeholder="送货人" v-model="queryParams.postPerson"
                          :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="验收人2" prop="checkPersonbName">
                <el-input placeholder="验收人2" v-model="queryParams.checkPersonbName"
                          :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="入库人2" prop="storePersonbName">
                <el-input placeholder="入库人2" v-model="queryParams.storePersonbName"
                          :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="要求关闭采购订单行吗？" label-width="200px" style="height: 36px">
                <el-radio v-model="queryParams.closeFlag" :disabled="isdisable" label="Y">是</el-radio>
                <el-radio v-model="queryParams.closeFlag" :disabled="isdisable" label="N">否</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="showType != 'add' && showType != ''">
              <el-form-item label="录入人员">
                <el-input placeholder="录入人员" v-model="detail.createByStr" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="showType != 'add' && showType != ''">
              <el-form-item label="最新修改日期">
                <el-input placeholder="最新修改日期" v-model="detail.updateTimeStr"
                          :disabled="true"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="附件上传" prop="standardNameCn">
                <el-upload ref="upload" :action="uploadUrl()"
                           :on-success="uploadSuccess" :file-list="fileList"
                           :disabled="isdisable" :before-upload="beforeUpload" name="file">
                  <div slot="file" slot-scope="{file}">
										<span style="padding-right: 20px">{{ file.name ? file.name : file.fileName
											}}</span>
                    <el-button type="text" size="small"
                               @click="look_file(file.response?file.response:file.filePath)">查看
                    </el-button>

                    <el-button type="text" size="small" style="color: #1CD0BD"
                               @click="down_file(file.response?file.response:file.filePath)">下载
                    </el-button>
                    <el-button type="text" size="small" v-if="showType != 'show'"
                               style="color: #ff4949"
                               @click="uploadRemove(file)">删除
                    </el-button>
                  </div>
                  <el-button type="primary" icon="el-icon-paperclip" :disabled="isdisable">点击上传
                  </el-button>
                </el-upload>
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
  import approvalProcess from '@/components/approvalProcess/index'
  import materialSelect from '../../common/materialSelect.vue'
  import {getSelectList} from '@/api/chemical/purchaseOrder'
  import {
    queryStoreSiteList,
    addMaterialStoreIn,
    queryStoreInDetail,
    updateMaterialStoreIn
  } from '@/api/chemical/AcceptanceWarehousing'
  import {getMaterialStoreCount} from '@/api/chemical/essentialInformation'
  import {getApprovalProcess} from '@/api/chemical/purchaseApply'
  import {getNowTime} from '../../common/common'

  var floatObj = require('../../common/floatObj.js')

  export default {
    name: 'warehousing',
    components: {approvalProcess, materialSelect},
    data() {
      return {
        showSearch: true,
        dialogShow: true,
        isloading: false,
        isFullScreen: true,
        supplierList: [],
        isDetailSelect: false,
        isShowMaterial: false,
        queryParams: {
          storeInDate: '',
          materialCount: '',
          storeSiteName: '',
          price: '',
          amount: '',
          batchNumber: '',
          productionDate: '',
          safeDate: '',
          invalidDate: '',
          certificateNo: '',
          remark: '',
          postPerson: '',
          closeFlag: 'N',
          buyOrderId: '',
          materialId: '',
          orderDetailId: '',
          phone: '',
          storeSite: '',
          supplierAddress: '',
          supplierId: '',
          supplierName: '',
          materialNumber: ''
        },
        rules: {
          // supplierName: [{required: true, trailer: "change", message: "请选择供应商名称"}],
          materialNumber: [{required: true, trigger: 'change', message: '请选择耗材编号'}],
          storeInDate: [{required: true, trigger: 'change', message: '请选择入库日期'}],
          materialCount: [{required: true, trigger: 'blur', message: '请输入入库数量'}],
          storeSiteName: [{required: true, trigger: 'blur', message: '请输入入库库位'}],
          price: [{required: true, trigger: 'blur', message: '请输入单价'}],
          // amount: [{required: true, trailer: "blur", message: "请输入金额"}],
          // batchNumber: [{required: true, trailer: "blur", message: "请输入批号"}],
          // certificateNo: [{required: true, trailer: "blur", message: "请输入证书编号"}],
          productionDate: [],
          safeDate: [],
          invalidDate: []
          // remark: [{required: true, trailer: "blur", message: "请输入备注"}],
          // postPerson: [{required: true, trailer: "blur", message: "请输入送货人"}],
        },
        isdisable: false,
        activeName: 'first',
        approvalProcess: {},
        fileList: [],
        storeSiteList: [],
        uploadFileList: [],
        titles: '新增',
        materialList: []
      }
    },
    mounted() {
      queryStoreSiteList({status:1}).then(res3 => {
        getMaterialStoreCount().then(res2 => {
          getSelectList().then(res => {
            this.materialList = res2.data
            this.supplierList = res.data
            this.storeSiteList = res3.data
            this.queryParams.supplierName = this.detail.supplierName ? this.detail.supplierName : ''
            this.queryParams.materialNumber = this.detail.materialNumber ? this.detail.materialNumber : ''

            if (this.showType == 'show') {
              this.titles = '查看'
              this.isdisable = true
            } else if (this.showType == 'edit') {
              this.titles = '编辑'
            } else if (this.showType == 'add') {
              this.titles = '新增'
            } else {
              this.titles = '入库'
              this.queryParams.price = this.detail.price
              this.queryParams.storeSiteName = this.detail.storeSiteName
              this.queryParams.storeSite = this.detail.storeSite
              this.queryParams.materialCount = this.detail.unAcceptCount
              this.calculate()
            }
            if (this.showType == 'show') {
              this.isDetailSelect = true
            }
            if (this.id != 0) {
              this.getInfo()
            } else {
              this.queryParams.storeInDate = getNowTime()
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
      detail: {
        type: Object,
        default: {}
      },
      showType: {
        type: String,
        default: ''
      }
    },
    methods: {
      calculate() {
        this.queryParams.amount = floatObj.accMul(this.queryParams.materialCount, this.queryParams.price)
      },
      hasBatchNumber(val) {
        if (val) {
          this.rules.productionDate = [{required: true, trigger: 'change', message: '请选择生产日期'}]
          this.rules.safeDate = [{required: true, trigger: 'blur', message: '请输入有效期'}]
          this.rules.invalidDate = [{required: true, trigger: 'change', message: '请选择有效到期日'}]
        } else {
          this.rules.productionDate = []
          this.rules.safeDate = []
          this.rules.invalidDate = []
        }
      },
      getProcess(status) {
        const params = {
          businessType: 'MATERIAL_STORE_IN',
          businessId: this.id,
          businessStatus: status,
          materialId: this.detail.materialId
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
      showMaterial() {
        this.isShowMaterial = true
        this.$nextTick(() => {
          this.$refs.materialSelect.init()
        })
      },
      hideMaterial() {
        this.isShowMaterial = false
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
        this.queryParams.storeSiteName = val.storeSiteName ? val.storeSiteName : ''
        this.queryParams.storeSite = val.storeSite ? val.storeSite : ''
        this.hideMaterial()
        /*for (var i in this.materialList) {
            if (val == this.materialList[i].materialNumber) {

            }
        }*/
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
        this.queryParams.storeSite = val
      },
      getInfo() {
        queryStoreInDetail(this.id).then(res => {
          this.detail.buyOrderNo = res.data.buyOrderNo
          this.detail.rowIndex = res.data.rowIndex
          this.detail.materialName = res.data.materialName
          this.detail.materialModel = res.data.materialModel
          this.detail.unit = res.data.unit
          this.detail.brand = res.data.brand
          this.detail.manufacturer = res.data.manufacturer
          this.detail.grade = res.data.grade
          this.detail.orderCount = res.data.orderCount
          this.detail.acceptCount = res.data.acceptCount
          this.detail.unAcceptCount = res.data.unAcceptCount
          this.detail.finishDate = res.data.finishDate
          this.detail.detailDinishDate = res.data.detailDinishDate
          this.detail.createByStr = res.data.createByStr
          this.detail.updateTimeStr = res.data.updateTimeStr
          this.detail.supplierAddress = res.data.supplierAddress
          this.detail.supplierId = res.data.supplierId
          this.detail.supplierName = res.data.supplierName
          this.detail.materialId = res.data.materialId
          this.detail.phone = res.data.phone
          this.detail.contact = res.data.contact
          this.detail.orderDetailId = res.data.orderDetailId
          this.detail.buyOrderId = res.data.buyOrderId
          if (this.detail.buyOrderId != null) {
            this.isDetailSelect = true
          }
          this.queryParams.supplierName = res.data.supplierName
          this.queryParams.materialNumber = res.data.materialNumber
          this.queryParams.storeInDate = res.data.storeInDate
          this.queryParams.materialCount = res.data.materialCount
          this.queryParams.storeSiteName = res.data.storeSiteName
          this.queryParams.storeSite = res.data.storeSite
          this.queryParams.price = res.data.price
          this.queryParams.amount = res.data.amount
          this.queryParams.batchNumber = res.data.batchNumber
          this.queryParams.productionDate = res.data.productionDate
          this.queryParams.safeDate = res.data.safeDate
          this.queryParams.invalidDate = res.data.invalidDate
          this.queryParams.certificateNo = res.data.certificateNo
          this.queryParams.remark = res.data.remark
          this.queryParams.postPerson = res.data.postPerson
          this.queryParams.closeFlag = res.data.closeFlag ? res.data.closeFlag : 'N'
          this.queryParams.checkPersonaName = res.data.checkPersonaName
          this.queryParams.storePersonaName = res.data.storePersonaName
          this.queryParams.checkPersonbName = res.data.checkPersonbName
          this.queryParams.storePersonbName = res.data.storePersonbName
          this.uploadFileList = res.data.uploadFileList
          this.fileList = res.data.uploadFileList
          this.getProcess(res.data.status)
          this.hasBatchNumber(res.data.batchNumber)
        })
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
            this.queryParams.uploadFileList = this.uploadFileList
            this.queryParams.supplierName = this.detail.supplierName
            this.queryParams.supplierId = this.detail.supplierId
            this.queryParams.materialId = this.detail.materialId ? this.detail.materialId : ''
            this.queryParams.orderDetailId = this.detail.orderDetailId ? this.detail.orderDetailId : ''
            this.queryParams.phone = this.detail.phone
            this.queryParams.contact = this.detail.contact
            this.queryParams.buyOrderId = this.detail.buyOrderId ? this.detail.buyOrderId : ''
            this.queryParams.orderDetailId = this.detail.orderDetailId ? this.detail.orderDetailId : ''
            this.queryParams.supplierAddress = this.detail.supplierAddress
            this.isloading = true
            if (this.showType == 'edit') {
              this.queryParams.id = this.id
              updateMaterialStoreIn(this.queryParams).then(res => {
                if (res.code == 200) {
                  this.$message.success('修改成功')
                  this.isloading = false
                  this.$emit('handleOk')
                }
              }).catch((e) => {
                this.isloading = false
              })
            } else {
              addMaterialStoreIn(this.queryParams).then(res => {
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
      },
      // 文件上传路径返回
      uploadUrl() {
        return window.globalEnv.VUE_APP_BASE_API + '/common/upload'
      },
      // 文件上传前校验
      beforeUpload(file) {
        const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
        const whiteList = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'png', 'jpeg', 'jpg']
        if (whiteList.indexOf(fileSuffix) === -1) {
          this.$message.error('上传文件只能是 pdf、doc、docx、xls、xlsx、png、jpeg、jpg格式')
          return false
        }
      },
      // 文件上传成功
      uploadSuccess(res, file, fileList) {
        if (200 == res.code) {
          this.fileList = fileList
          if (this.fileList.length > 0) {
            this.uploadFileList = this.fileList.map(item => {
              console.log(item)
              return {
                fileName: item.name ? item.name : item.fileName,
                filePath: item.response ? item.response.fileName : item.filePath
              }
            })
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
        } else {
          this.uploadFileList = []
        }
      },
      // 查看文件
      look_file(data) {
        window.open(window.globalEnv.VUE_APP_BASE_API + '/' + (data.fileName ? data.fileName : data), '_blank')
      },
      // 下载文件
      down_file(data) {
        this.mbu_downloadFile(data.fileName ? data.fileName : data)
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
