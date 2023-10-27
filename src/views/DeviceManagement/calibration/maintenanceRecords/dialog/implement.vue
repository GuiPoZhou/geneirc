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
        <el-tab-pane label="检定校准记录" name="first">
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
              <el-form-item label="上次检定日期" prop="lastCalibrationDate">
                <el-input placeholder="请输入上次检定日期" v-model="queryParams.lastCalibrationDate"
                          disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="检定/校准周期" prop="calibrationCycle">
                <el-input placeholder="请输入检定/校准周期" v-model="queryParams.calibrationCycle"
                          disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="检定/校准日期" prop="calibrationDate">
                <el-date-picker v-model="queryParams.calibrationDate" value-format="yyyy-MM-dd"
                                type="date"
                                placeholder="选择日期" style="width:100%" :disabled="isdisable"
                                @change="dateChange"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="overMd">
              <el-form-item label="检定/校准到期日期" prop="loseCalibrationDate" label-width="140px">
                <el-date-picker v-model="queryParams.loseCalibrationDate" value-format="yyyy-MM-dd"
                                type="date"
                                placeholder="选择日期" style="width:100%"
                                :disabled="isdisable"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="主要用途" prop="mainPurpose">
                <el-input type="textarea" :rows="2" placeholder="请输入内容"
                          v-model="queryParams.mainPurpose"
                          :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="确认依据" prop="comfirmBasis">
                <el-input type="textarea" :rows="2" placeholder="请输入内容"
                          v-model="queryParams.comfirmBasis"
                          :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="主要检定/校准项目及技术要求" prop="calibrationItem">
                <el-input type="textarea" :rows="2" placeholder="请输入内容"
                          v-model="queryParams.calibrationItem"
                          :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="检定/校准结果" prop="calibrationResult">
                  <el-input type="textarea" :rows="2" placeholder="请输入内容"
                            v-model="queryParams.calibrationResult"
                            :disabled="isdisable"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-row>
          <el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="校准所产生的修正值或修正因子" prop="correct">
                  <el-input type="textarea" :rows="2" placeholder="请输入内容"
                            v-model="queryParams.correct"
                            :disabled="isdisable"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="确认结论" prop="comfirmConclusion">
                <el-select v-model="queryParams.comfirmConclusion" placeholder="请选择"
                           :disabled="isdisable">
                  <el-option label="符合" :value="1"></el-option>
                  <el-option label="不符合" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="margin-left: 20px">
              <el-form-item label="" prop="useMode">
                <el-select v-model="queryParams.useMode" placeholder="请选择" :disabled="isdisable">
                  <el-option label="正常使用" :value="1"></el-option>
                  <el-option label="按修正值使用" :value="2"></el-option>
                  <el-option label="不可正常使用" :value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="记录说明" prop="remark">
                  <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.remark"
                            :disabled="isdisable"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="确认结果" prop="comfirmResult">
                <el-input placeholder="请输入确认结果" v-model="queryParams.comfirmResult"
                          :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="确认人" prop="comfirmPerson">
                <el-input placeholder="请输入确认人" v-model="queryParams.comfirmPerson"
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
                               @click="uploadRemove(file)"
                               v-if="showType !== 'show'">删除
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
  import {mapState} from 'vuex'
  import {addCalibrationRecord} from '@/api/resources/deviceManagement/index.js'
  import {eventBus} from '@/main.js'
  import approvalProcess from '@/components/approvalProcess/index'
  import {getApprovalProcess} from '@/api/consumables/purchaseApply'

  export default {
    name: 'implement',
    components: {approvalProcess},
    data() {
      return {
        dialogShow: false,
        isFullScreen: true,
        screenName: 'fullScreen',
        titles: '执行',
        showType: 'add',
        activeName: 'first',
        queryParams: {
          calibrationDate: '',
          calibrationCycle: '',
          loseCalibrationDate: ''
        },
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
          this.queryParams.loseCalibrationDate = ''
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
      // 获取流程
      getProcess() {
        const params = {
          businessType: 'EQUIPMENT_CALIBRATION_RECORD',
          businessId: this.queryParams.id,
          businessStatus: this.queryParams.status
        }
        getApprovalProcess(params).then(res => {
          this.approvalProcess = res
        })
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
            addCalibrationRecord(this.queryParams).then(res => {
              if (res.code === 200) {
                this.$message.success(msg)
                this.dialogShow = false
                this.$emit('reload')
              }
            })
          }
        })
      },
      dateChange(v) {
        this.getloseCalibrationDate()
      },
      // 检定/校准到期日期
      getloseCalibrationDate() {
        if (this.queryParams.calibrationCycle != '' && this.queryParams.calibrationDate != '') {
          this.$set(this.queryParams, 'loseCalibrationDate', moment(this.queryParams.calibrationDate).add(this.queryParams.calibrationCycle, 'months').format('YYYY-MM-DD'))
          // var a = moment(this.queryParams.calibrationDate)
          // var b = parseInt(this.queryParams.calibrationCycle)
          //
          // var y = a.get('years')
          // var m = a.get('months')
          // var d = a.get('dates')  //特别注意：这里获取天数用   get（"dates")
          // // var d=moment.duration(a).asDays()
          // //计算月份 获取月份+1加周期月份b
          // var ms = m + 1 + b
          //
          // if (parseInt(ms / 12) > 0) {//大于12个月轮换一年
          //   y = y + (parseInt(ms / 12))
          //   ms = ms - 12 * (parseInt(ms / 12))
          // }
          // if (ms == 0) {//无0月，元月及1月。
          //   ms = 1
          // }
          // var z = y + '-' + (ms < 10 ? ('0' + ms) : ms) + '-' + (d < 10 ? ('0' + d) : d) + ''
          // this.queryParams.loseCalibrationDate = z
        }
      },
      cancelbtn() {
        this.$emit('close')
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/ .el-dialog__body .el-col {
    margin-bottom: 0;
  }

  .overMd {
    /deep/ .el-form-item__content {
      width: calc(100% - 140px) !important;
    }
  }
</style>
