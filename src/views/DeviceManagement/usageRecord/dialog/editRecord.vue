<template>
  <el-dialog :title="titles"
             :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
             :close-on-click-modal="false" width="70%" @close="cancelbtn" @open="open">

    <el-form
        :model="queryParams"
        ref="queryForm"
        :rules="rules"
        label-width="120px"
    >

      <el-row>
        <el-col :span="12">
          <el-form-item label="设备编号" prop="equipmentNumber">
            <el-input placeholder="请输入设备编号" v-model="queryParams.equipmentNumber" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="equipmentName">
            <el-input placeholder="请输入设备名称" v-model="queryParams.equipmentName" disabled></el-input>
          </el-form-item>
        </el-col>
        <!--                <el-col :span="12">-->
        <!--                    <el-form-item label="使用日期" prop="useageDate">-->
        <!--                        <el-date-picker v-model="queryParams.useageDate" value-format="yyyy-MM-dd" type="date"-->
        <!--                                        placeholder="选择日期" style="width:100%" :disabled="isdisable"></el-date-picker>-->
        <!--                    </el-form-item>-->
        <!--                </el-col>-->
        <el-col :span="12">
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker v-model="queryParams.startTime"  value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss" type="datetime"
                            placeholder="选择日期" style="width:100%" :disabled="isdisable"></el-date-picker>

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker v-model="queryParams.endTime"  value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss" type="datetime"
                            placeholder="选择日期" style="width:100%" :disabled="isdisable"></el-date-picker>

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用前状态" prop="beforeStatus">
            <el-select v-model="queryParams.beforeStatus" @change="setBeforeStatus" placeholder="请选择"
                       :disabled="isdisable"
                       style="width: 100%">
              <el-option v-for="(item,index) in option" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用后状态" prop="afterStatus">
            <el-select v-model="queryParams.afterStatus" placeholder="请选择" :disabled="isdisable"
                       style="width: 100%">
              <el-option v-for="(item,index) in option" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作设定" prop="operation">
            <el-input placeholder="请输入操作设定" v-model="queryParams.operation"
                      :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="故障及处理意见" prop="opinion">
            <el-input placeholder="请输入故障及处理意见" v-model="queryParams.opinion"
                      :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="试验项目及数量" prop="testParameter">
            <el-input placeholder="请输入试验项目及数量" v-model="queryParams.testParameter"
                      :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检测样品编号" prop="sampleCode">
            <el-input placeholder="请输入检测样品编号" v-model="queryParams.sampleCode"
                      :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.remark"
                      :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用人" prop="fileNumber">
            <el-input placeholder="请输入使用人" v-model="queryParams.user" :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="录入日期" prop="fileName">
            <el-input placeholder="请输入录入日期" v-model="usetime" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleOk" v-if="showType !== 'show'">确定</el-button>
      <el-button @click="cancelbtn">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {mapState} from 'vuex'
import moment from 'moment'
import {checkTimeUseRecord, addEquipmentUseRecord} from '@/api/resources/deviceManagement/index.js'

export default {
  name: 'editStatus',
  data() {
    return {
      dialogShow: false,
      isFullScreen: true,
      screenName: 'fullScreen',
      titles: '新增',
      showType: 'add',
      activeName: 'first',
      option: [
        {
          label: '正常',
          value: 1
        },
        {
          label: '停用',
          value: 2
        },
        {
          label: '维修',
          value: 3
        },
        {
          label: '保养',
          value: 4
        },
        {
          label: '报废',
          value: 5
        },
        {
          label: '封存',
          value: 6
        },
        {
          label: '核查',
          value: 7
        },
        {
          label: '故障',
          value: 8
        }
      ],
      queryParams: {
        timearr: new Date(2016, 9, 10, 18, 40)
      },
      rules: {
        afterStatus: [{required: true, message: '请选择修改后的状态', trigger: 'change'}],
        timearr: [{type: 'array', required: true, message: '请选择起止时间', trigger: 'change'}],
        useageDate: [{required: true, message: '请选择使用日期', trigger: 'change'}]
      },
      isdisable: false,
      usename: '',
      usetime: '',
      equipmentId: null,
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
        this.titles = '新增'
      } else if (val == 'update') {
        this.titles = '修改仪器状态'
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

    setBeforeStatus(e) {
      console.log(e)
      this.$forceUpdate()
    },
    open() {
      this.usetime = moment().format('YYYY-MM-DD HH:mm:ss')
    },
    init(show, data) {
      this.showType = show
      this.queryParams.equipmentNumber = data.equipmentNumber
      this.queryParams.equipmentName = data.equipmentName
      this.queryParams.beforeStatus = data.status
      this.equipmentId = data.id
      this.dialogShow = true

    },
    // 起止时间
    timeChange(v) {
      this.queryParams.useageTimeStart = v[0]
      this.queryParams.useageTimeEnd = v[1]
    },
    handleOk() {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          const params = {
            equipmentId: this.equipmentId,
            useageTimeEnd: this.queryParams.useageTimeEnd,
            useageTimeStart: this.queryParams.useageTimeStart,
            useageDate: this.queryParams.useageDate,
            startTime: this.queryParams.startTime,
            endTime: this.queryParams.endTime
          }
          checkTimeUseRecord(params).then(res => {
            console.log(res)
            if (res.code === 200) {
              if (res.msg === 'SUCCESS') {
                this.saveData()
              } else {
                this.$confirm('该日期时段已存在使用记录，确定保存吗?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.saveData()
                })
              }
            }
          })
        }
      })
    },
    // 保存数据
    saveData() {
      const params = {
        afterStatus: this.queryParams.afterStatus,
        beforeStatus: this.queryParams.beforeStatus,
        operation: this.queryParams.operation,
        opinion: this.queryParams.opinion,
        sampleCode: this.queryParams.sampleCode,
        testParameter: this.queryParams.testParameter,
        useageDate: this.queryParams.useageDate,
        useageTimeEnd: this.queryParams.useageTimeEnd,
        useageTimeStart: this.queryParams.useageTimeStart,
        user: this.queryParams.user,
        remark: this.queryParams.remark,
        equipmentId: this.equipmentId,
        startTime: this.queryParams.startTime,
        endTime: this.queryParams.endTime
      }
      console.log(params)
      addEquipmentUseRecord(params).then(res => {
        if (res.code === 200) {
          this.$message.success('添加成功')
          this.$parent.getList()
          this.$emit('close')
        }
      })
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

.prices {
  /deep/ .el-select .el-input {
    width: 100px;
  }

  /deep/ .input-with-select .el-input-group__append {
    background-color: #fff;
  }
}

.overMd {
  /deep/ .el-form-item__content {
    width: calc(100% - 130px) !important;
  }
}
</style>
