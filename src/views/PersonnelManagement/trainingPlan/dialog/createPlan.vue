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
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="培训计划" name="first">
          <el-row>
            <el-col :span="12">
              <el-form-item label="编号" prop="planNo">
                <el-input placeholder="请输入编号" v-model="queryParams.planNo" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划年度" prop="planYear">
                <el-date-picker
                    style="width: 100%"
                    v-model="queryParams.planYear"
                    type="year"
                    value-format="yyyy"
                    :disabled="isdisable"
                    placeholder="选择计划年度">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="编制人员" prop="formulatePerson">
                <el-input placeholder="请输入编制人员" v-model="queryParams.formulatePerson" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="编制日期" prop="formulateDate">
                <el-date-picker v-model="queryParams.formulateDate" value-format="yyyy-MM-dd" type="date"
                                placeholder="选择日期" style="width:100%" :disabled="isdisable">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="计划描述" prop="formulatePerson">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.planDesc" :disabled="isdisable"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-button type="primary" style="margin-bottom: 20px" size="mini" :disabled="isdisable" @click="handleAdd">添加</el-button>
            </el-col>
            <el-table
                ref="multipleTable"
                :data="tableData"
                stripe
                border
            >
              <el-table-column label="序号" align="center" type="index" width="50"/>
              <el-table-column label="培训内容" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.trainContent" :ref="'cont' + scope.$index"
                    :disabled="isdisable"
                    @keyup.enter.native="contChange(scope.row, scope.$index)">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="主办部门/人" align="center">
                <template slot-scope="scope">
                  <el-input
                      v-model="scope.row.sponsor" :ref="'sponsor' + scope.$index"
                      :disabled="isdisable"
                      @keyup.enter.native="sponsorChange(scope.row, scope.$index)">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="参加人员" align="center">
                <template slot-scope="scope">
                  <el-input
                      v-model="scope.row.joinPerson" :ref="'person' + scope.$index"
                      :disabled="isdisable"
                      @keyup.enter.native="personChange(scope.row, scope.$index)">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="培训时间" align="center">
                <template slot-scope="scope">
                  <el-date-picker
                      v-model="scope.row.trainDate"
                      type="date"
                      value-format="yyyy-MM-dd"
                      :disabled="isdisable"
                      placeholder="选择日期">
                  </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column label="培训方式" align="center">
                <template slot-scope="scope">
                  <el-input
                      v-model="scope.row.trainWay" :ref="'way' + scope.$index"
                      :disabled="isdisable"
                      @keyup.enter.native="wayChange(scope.row, scope.$index)">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark" :ref="'remark' + scope.$index" :disabled="isdisable"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="操作" align="center" width="180">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" style="color: #ff4949" @click="e_dele(scope.$index)" :disabled="isdisable">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="审批流程" name="second">
          <approvalProcess :approvalProcess="approvalProcess"></approvalProcess>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="success" v-if="showType !== 'show'" :loading="isloading" @click="handleSubmit(2)">提交</el-button>
      <el-button type="primary" v-if="showType !== 'show'" :loading="isloading" @click="handleSubmit(1)">保存</el-button>
      <el-button @click="cancelbtn">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import approvalProcess from '@/components/approvalProcess/index'
  import {mapState} from "vuex";
  import moment from "moment";
  import { addTrainPlan, editTrainplan } from '@/api/personnelManagement/index'
  import { getApprovalProcess } from '@/api/filesManagement/filesManagement'
  export default {
    name: "createPlan",
    components: {approvalProcess},
    data() {
      return {
        dialogShow: false,
        isloading: false,
        titles: '新增',
        isFullScreen: true,
        showType: 'add',
        activeName: 'first',
        queryParams: {
          formulatePerson: '',
          formulateDate: ''
        },
        rules: {
          planNo: [{required: true, message: "请输入编号", trigger: "blur"}],
          planYear: [{required: true, message: "请选择年度", trigger: "change"}],
        },
        isdisable: false,
        tableData: [],
        approvalProcess: {}
      }
    },
    computed: {
      getLeftWidth() {
        return this.$store.state.app.leftWidth;
      },
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
          this.titles = "新增";
        } else if (val == "update") {
          this.titles = "修改";
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
		if(this.showType == "add"){
			this.queryParams.formulatePerson = this.user.nickName
			this.queryParams.formulateDate = moment().format("YYYY-MM-DD");
		}
      },
      init(show, data) {
        this.dialogShow = true
        this.showType = show
        if (data) {
          this.queryParams = {
            ...data
          }
          this.tableData = this.queryParams.trainPlanDetailList
          this.queryParams.planYear = this.queryParams.planYear.toString()
          this.getProcess()
        }
      },
      contChange (row,index) {
        this.$refs['sponsor' + index].focus()
      },
      sponsorChange (row,index) {
        this.$refs['person' + index].focus()
      },
      personChange (row,index) {
        // this.$refs['person' + index].focus()
      },
      wayChange (row,index) {
        this.$refs['remark' + index].focus()
      },
      // 添加计划
      handleAdd () {
        if (this.tableData == undefined) {
          this.tableData = new Array();
        }
        let obj = {};
          obj.trainContent = '',
          obj.sponsor = '',
          obj.joinPerson = '',
          obj.trainDate = '',
          obj.trainWay = '',
          obj.remark = ''
          this.tableData.push(obj);
      },
      e_dele (index) {
        this.tableData.splice(index, 1);
      },
      // 提交&保存
      handleSubmit (status) {
        this.$refs.queryForm.validate((valid) => {
          if (valid) {
            this.queryParams.status = status
            const tabse = this.tableData.map(item => {
              if (item.joinPerson === '' || item.sponsor === '' || item.trainContent === '' || item.trainDate === '' || item.trainWay === '') {
                // this.$message.error('请完善表格数据')
              } else {
                return item
              }
            })
            var newArr = tabse.filter(item => item)
            this.queryParams.trainPlanDetailList = newArr
            if (this.queryParams.trainPlanDetailList.length === 0) {
              this.$message.error('请至少填写一条培训计划，完善表格数据')
              return
            }
            this.isloading = true
            if (this.queryParams.id) {
              editTrainplan(this.queryParams).then(res => {
                if (res.code === 200) {
                  this.$message.success('修改成功')
                  this.isloading = false
                  this.$parent.getList()
                  this.cancelbtn()
                }
              }).catch((e) => {
                this.isloading = false
              })
            } else {
              addTrainPlan(this.queryParams).then(res => {
                if (res.code === 200) {
                  this.$message.success('添加成功')
                  this.isloading = false
                  this.$parent.getList()
                  this.cancelbtn()
                }
              }).catch((e) => {
                this.isloading = false
              })
            }
          }
        })
      },
      // 获取审批流程
      getProcess () {
        const params = {
          businessType: 'TRAIN_PLAN',
          businessId: this.queryParams.id,
          businessStatus: this.queryParams.status
        }
        getApprovalProcess(params).then(res => {
          this.approvalProcess = res
        })
      },
      cancelbtn() {
        this.$emit('close')
      },
    }
  }
</script>

<style scoped>
  /deep/ .el-dialog__body .el-col {
    margin-bottom: 0;
  }
  /deep/.el-dialog__body .el-table {
    background-color: #fff;
  }
</style>
