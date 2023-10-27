<template>
  <el-dialog :title="titles" :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
             :close-on-click-modal="false" width="70%" @close="cancelbtn">
    <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">
      <el-tab-pane label="退货" name="first">
        <el-form ref="checkForm" :rules="rules" v-if="showSearch" :model="queryParams" label-width="100px"
                 class="flexdit">
          <el-row>
            <el-col :span="8">
              <el-form-item label="入库日期">
                <el-input placeholder="入库日期" v-model="detail.storeInDate" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商名称">
                <el-input placeholder="供应商名称" v-model="detail.supplierName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item style="height: 36px"></el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="耗材编号">
                <el-input placeholder="耗材编号" v-model="detail.materialNumber"
                          :disabled="true"></el-input>
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
              <el-form-item label="入库数量">
                <el-input placeholder="入库数量" v-model="detail.orderCount" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="入库库位">
                <el-input placeholder="入库库位" v-model="detail.storeSiteName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单价">
                <el-input placeholder="单价" v-model="detail.price" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="金额">
                <el-input placeholder="金额" v-model="detail.amount" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="批号">
                <el-input placeholder="批号" v-model="detail.batchNumber" :disabled="true"></el-input>
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
              <el-form-item label="证书编号">
                <el-input placeholder="证书编号" v-model="detail.certificateNo" :disabled="true"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24" style="margin-top: 50px;"></el-col>

            <el-col :span="8">
              <el-form-item label="退货日期" prop="refundDate">
                <el-date-picker v-model="queryParams.refundDate" type="date" value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd" :disabled="isdisable" placeholder="选择退货日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="退货数量" prop="materialCount">
                <el-input placeholder="退货数量" v-model="queryParams.materialCount"
                          :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="退货库位" prop="storeSiteName">
                <el-input placeholder="退货库位" ref="storeSiteNameInput" v-model="queryParams.storeSiteName"
                          :disabled="isdisable"
                          @focus="showStore" @blur="hideStore" :readonly="true"></el-input>
                <stockSelect v-if="isShowStore" :dataList="storeSiteList" @close="closeStockSelect"
                             @confims="storeSiteChange" :disabled="isdisable"></stockSelect>

                <!--								<el-select placeholder="退货库位" :disabled="isdisable" v-model="queryParams.storeSiteName" @change="storeSiteChange">
                                  <el-option :value="item.storeNo" :label="item.storeName"
                                         v-for="(item,index) in storeSiteList"></el-option>
                                </el-select>-->
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="退货人" prop="refundPersonName">
                <el-input placeholder="退货人" v-model="queryParams.refundPersonName"
                          :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="退货原因" prop="reason">
                <el-input type="textarea" placeholder="退货原因" v-model="queryParams.reason"
                          :disabled="isdisable"></el-input>
              </el-form-item>
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

            <el-col :span="24">
              <el-form-item label="附件上传" prop="standardNameCn">
                <el-upload ref="upload" :action="uploadUrl()" :disabled="true"
                           :on-success="uploadSuccess" :file-list="fileList"
                           :before-upload="beforeUpload" name="file">
                  <div slot="file" slot-scope="{file}">
										<span
                      style="padding-right: 20px">{{file.name ? file.name : file.fileName}}</span>
                    <el-button type="text" size="small"
                               @click="look_file(file.response?file.response:file.filePath)">查看
                    </el-button>
                    <el-button type="text" size="small" style="color: #1CD0BD"
                               @click="down_file(file.response?file.response:file.filePath)">下载
                    </el-button>
                  </div>

                  <el-button type="primary" icon="el-icon-paperclip" :disabled="true">点击上传</el-button>
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
      <el-button type="primary" v-if="showType != 'show'" @click="handleOk('Y')">保存 & 提交</el-button>
      <el-button type="cyan" v-if="showType != 'show'" @click="handleOk('N')">保存</el-button>
      <el-button @click="cancelbtn">取消</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import approvalProcess from '@/components/approvalProcess/index'
  import {
    queryStoreSiteList,
    addStoreRefund,
    updateStoreRefund,
    queryStoreRefundDetail,
    queryStoreInDetail,
  } from "@/api/chemical/AcceptanceWarehousing";
  import {getApprovalProcess} from '@/api/chemical/purchaseApply'
  import stockSelect from "../../common/stockSelect.vue"
  import {queryStoreListByMaterialId} from "@/api/chemical/collectingIssue"

  export default {
    name: "retreat",
    components: {approvalProcess, stockSelect},
    data() {
      return {
        showSearch: false,
        dialogShow: true,
        isFullScreen: true,
        isShowStore: false,
        rules: {
          refundDate: [{required: true, message: "请输选择退货日期", trigger: "change"}],
          materialCount: [{required: true, message: "请输入退货数量", trigger: "blur"}],
          storeSiteName: [{required: true, message: "请选择退货库位", trigger: "blur"}],
          refundPersonName: [{required: true, message: "请输入退货人", trigger: "change"}],
          reason: [{required: true, message: "请输入退货原因", trigger: "blur"}],
        },
        queryParams: {
          refundDate: "",
          materialCount: "",
          storeSiteName: "",
          refundPersonName: "",
          reason: "",
        },
        detail: {},
        isdisable: false,
        activeName: "first",
        approvalProcess: {},
        fileList: [],
        storeSiteList: [],
        uploadFileList: [],
        titles: ""
      }
    },
    mounted() {
      /*queryStoreSiteList().then(res => {
        this.storeSiteList = res.data
      });*/
      if (this.showType == "add") {
        this.getInfo();
      } else {
        this.getRefundInfo();
      }
      if (this.showType == "show") {
        this.titles = "查看"
        this.isdisable = true
      } else if (this.showType == "edit") {
        this.titles = "编辑"
      } else {
        this.titles = "退货"
      }
    },
    props: {
      id: {
        type: Number,
        default: 0
      },
      showType: {
        type: String,
        default: "add"
      }
    },
    methods: {
      getProcess(status) {
        const params = {
          businessType: 'MATERIAL_STORE_REFUND',
          businessId: this.id,
          businessStatus: status,
          materialId: this.detail.materialId
        }
        getApprovalProcess(params).then(res => {
          this.approvalProcess = res
        })
      },
      showStore() {
        this.isShowStore = true;
      },
      hideStore() {
        setTimeout(() => {
          this.isShowStore = false
        }, 500)
      },
      getStoreListByMaterialId(id) {
        queryStoreListByMaterialId(id).then(res => {
          this.storeSiteList = res.data;
          // this.storeSiteChange(this.queryParams.storeSiteName);
        })
      },
      getRefundInfo() {
        queryStoreRefundDetail(this.id).then(res => {
          this.detail.storeInDate = res.data.storeInDate;
          this.detail.supplierName = res.data.supplierName ? res.data.supplierName : "";
          this.detail.materialNumber = res.data.materialNumber;
          this.detail.materialName = res.data.materialName;
          this.detail.materialModel = res.data.materialModel;
          this.detail.unit = res.data.unit;
          this.detail.brand = res.data.brand;
          this.detail.manufacturer = res.data.manufacturer;
          this.detail.grade = res.data.grade;
          this.detail.orderCount = res.data.storeInCount ? res.data.storeInCount : "";
          this.detail.storeSiteName = res.data.storeSiteName;
          this.detail.price = res.data.price;
          this.detail.amount = res.data.amount ? res.data.amount : "";
          this.detail.batchNumber = res.data.batchNumber;
          this.detail.productionDate = res.data.productionDate;
          this.detail.safeDate = res.data.safeDate;
          this.detail.invalidDate = res.data.invalidDate;
          this.detail.certificateNo = res.data.certificateNo;

          this.queryParams.refundDate = res.data.refundDate ? res.data.refundDate : '';
          this.queryParams.materialCount = res.data.materialCount;
          this.queryParams.storeSiteName = res.data.storeSiteName;
          this.queryParams.storeSite = res.data.storeSite;
          this.queryParams.refundPersonName = res.data.refundPersonName;
          this.queryParams.reason = res.data.reason;
          this.detail.createByStr = res.data.createByStr;
          this.detail.updateTimeStr = res.data.updateTimeStr;
          this.queryParams.materialStoreInId = res.data.materialStoreInId
          this.queryParams.storeSite = res.data.storeSite
          this.getStoreListByMaterialId(res.data.materialId)
          this.fileList = res.data.uploadFileList
          this.showSearch = true
          this.getProcess(res.data.status);
        });
      },
      storeSiteChange(val) {
        this.queryParams.storeSite = val.storeSite
        this.queryParams.storeSiteName = val.storeSiteName
        this.$nextTick(() => {
          this.$refs.storeSiteNameInput.focus()
          setTimeout(() => {
            this.$refs.storeSiteNameInput.blur()
          }, 10)
        })
      },
      closeStockSelect() {
        this.isShowStore = false
      },
      getInfo() {
        queryStoreInDetail(this.id).then(res => {
          this.detail.storeInDate = res.data.storeInDate;
          this.detail.supplierName = res.data.supplierName;
          this.detail.materialNumber = res.data.materialNumber;
          this.detail.materialId = res.data.materialId;
          this.detail.materialName = res.data.materialName;
          this.detail.materialModel = res.data.materialModel;
          this.detail.unit = res.data.unit;
          this.detail.brand = res.data.brand;
          this.detail.manufacturer = res.data.manufacturer;
          this.detail.grade = res.data.grade;
          this.detail.orderCount = res.data.materialCount;
          this.detail.storeSiteName = res.data.storeSiteName;
          this.detail.price = res.data.price;
          this.detail.amount = res.data.amount;
          this.detail.batchNumber = res.data.batchNumber;
          this.detail.productionDate = res.data.productionDate;
          this.detail.safeDate = res.data.safeDate;
          this.detail.invalidDate = res.data.invalidDate;
          this.detail.certificateNo = res.data.certificateNo;
          this.detail.createByStr = res.data.createByStr;
          this.detail.updateTimeStr = res.data.updateTimeStr;
          this.queryParams = {
            refundDate: "",
            materialCount: "",
            storeSiteName: "",
            storeSite: "",
            refundPersonName: "",
            reason: "",
          }
          this.getStoreListByMaterialId(res.data.materialId)

          this.showSearch = true

        })
      },
      e_changeBox(type) {
        this.isFullScreen = type
      },
      cancelbtn() {
        this.$emit("close")
      },
      handleClick() {

      },
      handleOk(flag) {
        this.$refs["checkForm"].validate(valid => {
          if (valid) {
            this.queryParams.submitFlag = flag
            if (this.showType == "edit") {
              this.queryParams.id = this.id;
              updateStoreRefund(this.queryParams).then(res => {
                if (res.code == 200) {
                  this.$message.success('修改成功')
                  this.$emit("handleOk")
                }
              })
            } else {
              this.queryParams.materialStoreInId = this.id
              addStoreRefund(this.queryParams).then(res => {
                if (res.code == 200) {
                  this.$message.success('新增成功')
                  this.$emit("handleOk")
                }
              })
            }
          }
        });
      },
      // 文件上传路径返回
      uploadUrl() {
        return window.globalEnv.VUE_APP_BASE_API + "/common/upload"
      },
      // 文件上传前校验
      beforeUpload(file) {
        const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1)
        const whiteList = ["pdf", "doc", "docx", "xls", "xlsx", "png", "jpeg", "jpg"]
        if (whiteList.indexOf(fileSuffix) === -1) {
          this.$message.error("上传文件只能是 pdf、doc、docx、xls、xlsx、png、jpeg、jpg格式")
          return false
        }
      },
      // 文件上传成功
      uploadSuccess(res, file, fileList) {
        if (200 == res.code) {
          this.fileList = fileList
          if (this.fileList.length > 0) {
            this.uploadFileList = this.fileList.map(item => {
              return {
                fileName: item.name,
                filePath: item.response.fileName,
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
        this.fileList.splice(index, 1);
        if (this.fileList.length > 0) {
          this.uploadFileList = this.fileList.map(item => {
            return {
              fileName: item.name,
              filePath: item.response.data.filePath,
            }
          })
        } else {
          this.uploadFileList = []
        }
      },
      // 查看文件
      look_file(data) {
        window.open(window.globalEnv.VUE_APP_BASE_API + '/' + (data.fileName ? data.fileName : data), '_blank');
      },
      // 下载文件
      down_file(data) {
        this.mbu_downloadFile(data.fileName ? data.fileName : data)
      },
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
