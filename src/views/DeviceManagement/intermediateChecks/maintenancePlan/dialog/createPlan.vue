<template>
  <el-dialog :title="titles" :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
    :close-on-click-modal="false" width="70%" @close="cancelbtn" @open="open">
    <el-form :model="queryParams" ref="queryForm" :prop="queryParams" :rules="rules" label-width="120px">
      <el-tabs v-model="activeName" :stretch="true">
        <el-tab-pane label="期间核查计划" name="first">
          <el-row>
            <el-col :span="8">
              <el-form-item label="计划日期" prop="planDate">
                <el-date-picker v-model="queryParams.planDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"
                  style="width:100%" :disabled="isdisable"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划单号" prop="planNo">
                <el-input placeholder="请输入计划单号" v-model="queryParams.planNo" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="编制人员" prop="applyPerson">
                <el-input placeholder="请输入编制人员" v-model="queryParams.applyPerson" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="计划年度" prop="planYear">
                <el-date-picker v-model="queryParams.planYear" type="year" value-format="yyyy" :disabled="yeardisable"
                  placeholder="选择计划年度">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="批准人" prop="approvalUser">
                <el-input placeholder="请输入批准人" v-model="queryParams.approvalUser" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="批准日期" prop="approvalDate">
                <el-input placeholder="请输入批准日期" v-model="queryParams.approvalDate" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="计划描述" prop="describe">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.describe"
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
              <el-form-item label="最新修改日期" prop="updateTime">
                <el-input placeholder="请输入录入人" v-model="queryParams.updateTime" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-button type="primary" @click="handleAdd" :disabled="isdisable">添加设备</el-button>
            <el-button type="danger" @click="handleDel" :disabled="isdisable">删除设备</el-button>
          </el-row>
          <el-table ref="multipleTable" :data="tableData" stripe border style="margin-top: 20px"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column label="序号" align="center" type="index" width="50" />
            <el-table-column prop="equipmentNumber" label="设备编号" />
            <el-table-column prop="equipmentName" label="设备名称" show-overflow-tooltip />
            <el-table-column prop="equipmentModel" label="规格型号" show-overflow-tooltip />
            <el-table-column prop="calibrationCycle" label="溯源周期（月）" show-overflow-tooltip />
            <el-table-column prop="loseCalibrationDate" label="检定校准失效日期" show-overflow-tooltip />
            <el-table-column prop="executeDate" label="计划实施日期" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleDate(scope.row)">{{ scope.row.executeDate }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="liablePerson" label="责任人" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.liablePerson" :disabled="isdisable"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" :disabled="isdisable"></el-input>
              </template>
            </el-table-column>
          </el-table>
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
    <!--选择设备-->
    <addEquipment :typeofs="typeofs" v-if="showequiment" ref="equiment" @close="showequiment = false"
      @choiceEquipment="choiceEquipment"></addEquipment>
    <!--添加实施计划日期-->
    <planDate v-if="showeplanedate" ref="planedate" @close="showeplanedate = false" @plandate="plandate"></planDate>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
import addEquipment from "../../../components/addEquipment";
import planDate from "../../../components/planDate";
import { addEquipmentCheckPlan, editEquipmentCheckPlan } from '@/api/resources/deviceManagement/index'
import approvalProcess from '@/components/approvalProcess/index'
import { getApprovalProcess } from '@/api/consumables/purchaseApply'
export default {
  name: "createPlan",
  components: { addEquipment, planDate, approvalProcess },
  data() {
    return {
      dialogShow: false,
      isFullScreen: true,
      yeardisable: false,
      screenName: "fullScreen",
      titles: '新增',
      showType: 'add',
      activeName: 'first',
      queryParams: {
        createBy: '',
        updateTime: '',
      },
      rules: {
        planDate: [{ required: true, message: "请选择计划日期", trigger: "change" }],
        planNo: [{ required: true, message: "请输入计划单号", trigger: "blur" }],
        planYear: [{ required: true, message: "请选择计划年度", trigger: "change" }],
      },
      isdisable: false,
      tableData: [],
      multipleSelection: [],
      enqlist: [],
      showequiment: false,
      showeplanedate: false,
      typeofs: 'EQUIPMENT_CHECK_PLAN',
      approvalProcess: {},
    }
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
        this.titles = "新增";
      } else if (val == "update") {
        this.titles = "修改";
        this.yeardisable = true
      } else if (val == 'show') {
        this.titles = "查看";
        this.isdisable = true
        this.yeardisable = true
      }
    },
  },
  computed: {
    ...mapState({
      user: state => state.user.userInfo
    })
  },
  methods: {
    e_changeBox(type) {
      this.isFullScreen = type;
    },
    open() {
      this.queryParams.createBy = this.user.nickName
      this.queryParams.updateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    },
    init(show, data) {
      this.showType = show
      this.dialogShow = true
      if (data) {
        this.queryParams = {
          ...data
        }
        this.tableData = data.detailList
        this.getProcess()
      }
    },
    handleOk() {
    },
    // 添加设备
    handleAdd() {
      if (this.queryParams.planYear === undefined) {
        this.$message.error('请先选择年度')
        return
      }
      this.showequiment = true
      this.$nextTick(() => {
        this.$refs.equiment.init(this.tableData, this.queryParams.planYear)
      })
    },
    // 选择后的设备
    choiceEquipment(data) {
      this.tableData = this.tableData.concat(data)
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    handleDel() {
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i];
        element.id = i
      }
      if (this.multipleSelection.length == 0) this.$message.error('请先至少选择一项')
      this.multipleSelection.forEach(element => {
        this.tableData.forEach((e, i) => {
          if (element.id == e.id) {
            this.tableData.splice(i, 1)
          }
        });
      });
    },
    // 实施计划日期
    handleDate(row) {
      this.showeplanedate = true
      this.$nextTick(() => {
        this.$refs.planedate.init(row, this.showType)
      })
    },
    plandate(data) {
      this.tableData.forEach((item, index) => {
        if (item.equipmentNumber === data.equipmentNumber) {
          this.$set(this.tableData[index], 'executeDate', data.executeDate)
          this.$set(this.tableData[index], 'dateList', data.dateList)
        }
      })
    },
    // 获取流程
    getProcess() {
      const params = {
        businessType: 'EQUIPMENT_CHECK_PLAN',
        businessId: this.queryParams.id,
        businessStatus: this.queryParams.status
      }
      getApprovalProcess(params).then(res => {
        this.approvalProcess = res
      })
    },
    // 提交
    handleSubmit(status) {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          this.queryParams.status = status
          this.queryParams.detailList = this.tableData
          console.log(this.queryParams)
          var bool1 = this.tableData.some(item => item.executeDate == '添加')
          if (bool1 === true) {
            this.$message.error('请添加计划实施日期')
            return;
          }
          if (this.queryParams.id) {
            editEquipmentCheckPlan(this.queryParams).then(res => {
              if (res.code === 200) {
                this.$message.success('修改成功')
                this.$parent.getList()
                this.cancelbtn()
              }
            })
          } else {
            addEquipmentCheckPlan(this.queryParams).then(res => {
              if (res.code === 200) {
                this.$message.success('新增成功')
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

<style scoped lang="less">
/deep/ .el-dialog__body .el-col {
  margin-bottom: 0;
}

/deep/ .el-dialog__body .el-table {
  background-color: #fff;
}

.treeDiv {
  position: absolute;
  top: 40px;
  left: -1px;
  z-index: 1000;
  width: 868px;
  overflow: auto;
  max-height: 400px;

  .el-table {
    border: 1px solid #ccc;
    border-radius: 6px;
  }

  .el-table /deep/ td {
    padding: 4px 0;
  }
}
</style>
