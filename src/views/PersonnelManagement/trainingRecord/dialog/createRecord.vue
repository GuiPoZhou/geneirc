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
          <el-form-item label="编号" prop="recordNo">
            <el-input placeholder="请输入编号" v-model="queryParams.recordNo" :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="记录人" prop="recordPerson">
            <el-input placeholder="请输入记录人" v-model="queryParams.recordPerson" :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="培训地点" prop="trainPlace">
            <el-input placeholder="请输入培训地点" v-model="queryParams.trainPlace" :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="培训人" prop="trainPerson">
            <el-input placeholder="请输入培训人" v-model="queryParams.trainPerson" :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="培训主题" prop="trainTitle">
            <el-input placeholder="请输入培训主题" v-model="queryParams.trainTitle" :disabled="isdisable"></el-input>
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
        <el-col :span="24">
          <el-form-item label="培训内容" prop="trainContent">
            <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="queryParams.trainContent"
                      :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="培训结果" prop="trainResult">
            <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="queryParams.trainResult"
                      :disabled="isdisable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" v-if="showType !== 'show'" :loading="isloading" @click="handleSubmit">确定</el-button>
      <el-button @click="cancelbtn">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {addTrainRecord, editTrainrecord} from '@/api/personnelManagement/index'

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
          recordNo: [{required: true, message: "请输入编号", trigger: "blur"}],
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
        }
      },
      cancelbtn() {
        this.$emit('close')
      },
      // 提交
      handleSubmit() {
        this.$refs.queryForm.validate((valid) => {
          if (valid) {
            this.isloading = true
            if (this.queryParams.id) {
              editTrainrecord(this.queryParams).then(res => {
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
              addTrainRecord(this.queryParams).then(res => {
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
      }
    }
  }
</script>

<style scoped>
  /deep/ .el-dialog__body .el-col {
    margin-bottom: 0;
  }

  /deep/ .el-dialog__body .el-table {
    background-color: #fff;
  }
</style>
