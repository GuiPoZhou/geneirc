<template>
	<el-dialog :title="titles"
			   :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
			   :close-on-click-modal="false" width="70%" @close="cancelbtn"  @open="open">
    <el-form
        :model="queryParams"
        ref="queryForm"
        :prop="queryParams"
        :rules="rules"
        label-width="120px"
    >
      <el-tabs v-model="activeName" :stretch="true">
        <el-tab-pane label="设备维修申请" name="first">
          <el-row>
            <el-col :span="8">
              <el-form-item label="设备编号" prop="equipmentNumber">
                <el-input placeholder="请输入设备编号" v-model="queryParams.equipmentNumber" readonly @focus="handleAdd" :disabled="isdisable"></el-input>
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
                <el-input placeholder="请输入规格型号" v-model="queryParams.equipmentModel" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="维修日期" prop="repairDate">
                <el-date-picker v-model="queryParams.repairDate" value-format="yyyy-MM-dd" type="date"
                                placeholder="选择日期" style="width:100%" :disabled="isdisable"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="维修人员" prop="repairPerson">
                <el-input placeholder="请输入维修人员" v-model="queryParams.repairPerson" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="维修单位" prop="repairCompany">
                <el-input placeholder="请输入维修单位" v-model="queryParams.repairCompany" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="维修费用/元" prop="repairCost">
                <el-input placeholder="请输入维修费用/元" v-model="queryParams.repairCost" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="设备状况" prop="equipmentStatus">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.equipmentStatus"
                          :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="维修项目" prop="repairItem">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.repairItem"
                          :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="维修结果" prop="repairResult">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.repairResult"
                          :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="实验室意见" prop="labOpinion">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.labOpinion"
                          :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="设备仪器的重新检定情况" prop="recheck">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.recheck"
                          :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="录入人" prop="fileNumber">
                <el-input placeholder="请输入录入人" v-model="userNames" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="录入日期" prop="fileNumber">
                <el-input placeholder="请输入录入日期" v-model="timedate" disabled></el-input>
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
                    <el-button type="text" size="small" @click="look_file(file.response)">查看</el-button>
                    <el-button type="text" size="small" style="color: #1CD0BD" @click="down_file(file.response)">下载</el-button>
                    <el-button type="text" size="small" style="color: #ff4949" @click="uploadRemove(file)" v-if="showType !== 'show'">删除</el-button>
                  </div>
                  <el-button type="primary" icon="el-icon-paperclip" :disabled="isdisable">点击上传</el-button>
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
      <el-button type="success" v-if="showType !== 'show'" @click="handleSubmit('Y')">提交</el-button>
      <el-button type="primary" v-if="showType !== 'show'" @click="handleSubmit('N')">保存</el-button>
      <el-button @click="cancelbtn">取消</el-button>
    </div>
    <!--选择设备-->
    <addEquipment v-if="showequiment" :typeofs="typeofs" ref="equiment" @close="showequiment = false" @choiceEquipment="choiceEquipment"></addEquipment>
  </el-dialog>
</template>

<script>
  import {mapState} from "vuex";
  import moment from "moment";
  import addEquipment from "../../components/addEquipment";
  import { addEquipmentRepairRecord, editEquipmentRepairRecord} from '@/api/resources/deviceManagement/index.js'
  import approvalProcess from '@/components/approvalProcess/index'
  import {getApprovalProcess} from '@/api/consumables/purchaseApply'
  export default {
    name: "implement",
    components: { addEquipment, approvalProcess },
    data () {
      return {
        dialogShow: false,
        isFullScreen: true,
        carrydisable: false,
        screenName: "fullScreen",
        titles: '添加',
        showType: 'add',
        activeName: 'first',
        queryParams: {
          equipmentNumber: ''
        },
        rules: {
          equipmentNumber: [{required: true, message: "请选择设备"}],
        },
        isdisable: false,
        showequiment: false,
        // 上传文件列表
        fileList: [],
        uploadFileList: [],
        userNames: '',
        timedate: '',
        typeofs: 'applys',
        approvalProcess: {},
      }
    },
    computed: {
      ...mapState({
        user:state=>state.user.userInfo
      })
    },
    watch: {
      getLeftWidth() {
        let width = this.$store.state.app.leftWidth;
        if (width < 200) {
          this.screenName = "bigFullScreen";
        } else {
          this.screenName = "fullScreen";
        }
      },
      showType(val) {
        if (val == "add") {
          this.titles = "添加";
        } else if (val == "update") {
          this.titles = "修改";
        } else if (val == "carry") {
          this.titles = "执行";
          this.carrydisable = true
        } else if (val == 'show') {
          this.titles = "查看";
          this.isdisable = true
        }
      },
    },
    methods: {
      e_changeBox(type) {
        this.isFullScreen = type;
      },
      open() {
        this.userNames = this.user.nickName
        this.timedate = moment().format("YYYY-MM-DD HH:mm:ss");
        if (this.queryParams.id) {
          if (this.showType !== 'carry') {
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
                  filePath: item.response.data.filePath,
                }
              })
            }
          }
        }
      },
      init(show, data) {
        this.showType = show
        this.dialogShow = true
        if (show === 'carry') {
          console.log(data)
          this.queryParams = {
            ...data
          }
          this.queryParams.equipmentRepairApplyId = data.id
        } else if (show === 'add') {
          this.queryParams = {
            equipmentNumber: ''
          }
        } else {
          this.queryParams = {
            ...data
          }
          this.getProcess()
        }
      },
      // 文件上传路径返回
      uploadUrl() {
        return window.globalEnv.VUE_APP_BASE_API + "/fileManage/upload";
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
                filePath: item.response.data.filePath,
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
        let index = this.fileList.findIndex( fileItem => {
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
          console.log(this.uploadFileList)
        } else {
          this.uploadFileList = []
        }
      },
      // 查看文件
      look_file(data) {
        window.open(window.globalEnv.VUE_APP_BASE_API + '/' + data.data.filePath, '_blank');
      },
      // 下载文件
      down_file (data) {
        this.mbu_downloadFile(data.data.filePath)
      },
      // 添加设备
      handleAdd() {
        this.showequiment = true
        this.$nextTick(() => {
          this.$refs.equiment.init()
        })
      },
      // 选择后的设备
      choiceEquipment (data) {
        this.queryParams.equipmentNumber = data.equipmentNumber
        this.queryParams.equipmentName = data.equipmentName
        this.queryParams.equipmentId = data.id
        this.queryParams.manufacturer = data.manufacturer
        this.queryParams.equipmentModel = data.equipmentModel
      },
      // 获取流程
      getProcess() {
        const params = {
          businessType: 'EQUIPMENT_REPAIR_RECORD',
          businessId: this.queryParams.id,
          businessStatus: this.queryParams.status
        }
        getApprovalProcess(params).then(res => {
          this.approvalProcess = res
        })
      },
      // 提交
      handleSubmit (status) {
        this.$refs.queryForm.validate((valid) => {
          if (valid) {
            this.queryParams.submitFlag = status
            this.queryParams.uploadFileList = this.uploadFileList
            var msg = ''
            if (status === 'Y') {
              msg = '提交成功'
            } else {
              msg = '保存成功'
            }
            if (this.showType === 'carry') {
              addEquipmentRepairRecord(this.queryParams).then(res => {
                if (res.code === 200) {
                  this.$message.success(msg)
                  this.$parent.getList()
                  this.cancelbtn()
                }
              })
              return
            }
            if (this.queryParams.id) {
              editEquipmentRepairRecord(this.queryParams).then(res => {
                if (res.code === 200) {
                  this.$message.success(msg)
                  this.$parent.getList()
                  this.cancelbtn()
                }
              })
            } else {
              addEquipmentRepairRecord(this.queryParams).then(res => {
                if (res.code === 200) {
                  this.$message.success(msg)
                  this.$parent.getList()
                  this.cancelbtn()
                }
              })
            }
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
