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
      <el-row>
        <el-col :span="12">
          <el-form-item label="编号" prop="checkNo">
            <el-input placeholder="请输入编号" v-model="queryParams.checkNo" :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="培训内容" prop="trainContent">
            <el-input placeholder="请输入培训内容" v-model="queryParams.trainContent" :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="培训目的" prop="trainAim">
            <el-input placeholder="请输入培训目的" v-model="queryParams.trainAim" :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="培训日期" prop="trainDate">
            <el-date-picker v-model="queryParams.trainDate" value-format="yyyy-MM-dd" type="date"
                            placeholder="选择日期" style="width:100%" :disabled="isdisable">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="培训方式" prop="trainWay">
            <el-select v-model="queryParams.trainWay" placeholder="请选择" :disabled="isdisable" style="width: 100%">
              <el-option label="外培" :value="1"></el-option>
              <el-option label="自培" :value="2"></el-option>
              <el-option label="网络" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="考核方式" prop="checkWay">
            <el-select v-model="queryParams.checkWay" placeholder="请选择" :disabled="isdisable" style="width: 100%">
              <el-option label="口头提问" :value="1"></el-option>
              <el-option label="笔试" :value="2"></el-option>
              <el-option label="技能演示" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="考核人" prop="checkPerson">
            <el-input placeholder="请输入考核人" v-model="queryParams.checkPerson" :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="监督员" prop="supervisePeoson">
            <el-input placeholder="请输入监督员" v-model="queryParams.supervisePeoson" :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="过程监督结果" prop="superviseResult">
            <el-select v-model="queryParams.superviseResult" placeholder="请选择" :disabled="isdisable" style="width: 100%">
              <el-option label="满意" :value="1"></el-option>
              <el-option label="基本满意" :value="2"></el-option>
              <el-option label="不满意" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="评价人" prop="opinionPerson">
            <el-input placeholder="请输入评价人" v-model="queryParams.opinionPerson" :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="综合评价意见" prop="opinion">
            <el-select v-model="queryParams.opinion" placeholder="请选择" :disabled="isdisable" style="width: 100%">
              <el-option label="达到预定目标" :value="1"></el-option>
              <el-option label="未达到预定目标" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="评价日期" prop="opinionDate">
            <el-date-picker v-model="queryParams.opinionDate" value-format="yyyy-MM-dd" type="date"
                            placeholder="选择日期" style="width:100%" :disabled="isdisable">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span style="font-weight: bold">受训人登记（考核成绩可以是具体分数、合格或者不合格）</span>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" style="margin-bottom: 20px; float: right" @click="handleAdd" :disabled="isdisable">添加</el-button>
        </el-col>
        <el-table
            ref="multipleTable"
            :data="tableData"
            stripe
            border
        >
          <el-table-column label="序号" align="center" type="index" width="50"/>
          <el-table-column label="受训人" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input
                  v-model="scope.row.personName" :ref="'name' + scope.$index"
                  :disabled="isdisable"
                  @keyup.enter.native="nameChange(scope.row, scope.$index)">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="考核成绩" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input
                  v-model="scope.row.personScore" :ref="'score' + scope.$index"
                  :disabled="isdisable">
              </el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" v-if="showType !== 'show'" :loading="isloading" @click="handleSubmit">确定</el-button>
      <el-button @click="cancelbtn">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { addTrainCheck, editTrainCheck } from '@/api/personnelManagement/index'
  export default {
    name: "createRecord",
    data() {
      return {
        dialogShow: false,
        isloading: false,
        titles: '新增',
        isFullScreen: true,
        showType: 'add',
        activeName: 'first',
        queryParams: {},
        rules: {
          checkNo: [{required: true, message: "请输入编号", trigger: "blur"}],
        },
        isdisable: false,
        tableData: []
      }
    },
    computed: {
      getLeftWidth() {
        return this.$store.state.app.leftWidth;
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
      },
      init(show, data) {
        this.dialogShow = true
        this.showType = show
        if (data) {
          this.queryParams = {
            ...data
          }
          this.tableData = this.queryParams.trainCheckScoreList
        }
      },
      nameChange (row,index) {
        this.$refs['score' + index].focus()
      },
      // 添加
      handleAdd () {
        if (this.tableData == undefined) {
          this.tableData = new Array();
        }
        let obj = {};
          obj.personName = '',
          obj.personScore = ''
        this.tableData.push(obj);
      },
      // 提交
      handleSubmit () {
        this.$refs.queryForm.validate((valid) => {
          if (valid) {
            const tabse = this.tableData.map(item => {
              if (item.personName === '' || item.personScore === '') {
                // this.$message.error('请完善表格数据')
              } else {
                return item
              }
            })
            var newArr = tabse.filter(item => item)
            this.queryParams.trainCheckScoreList = newArr
            if (this.queryParams.trainCheckScoreList.length === 0) {
              this.$message.error('请至少填写一条受训人考核成绩， 完善表格数据')
              return
            }
            console.log(this.queryParams)
            this.isloading = true
            if (this.queryParams.id) {
              editTrainCheck(this.queryParams).then(res => {
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
              addTrainCheck(this.queryParams).then(res => {
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
