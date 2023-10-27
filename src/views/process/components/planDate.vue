<template>
  <el-dialog
      class="elDialog"
      center
      width="50%"
      :visible.sync="showMode"
      append-to-body
      title="设置计划日期"
  >
    <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        :prop="queryParams"
        style="margin: 15px 0 0 0"
        :rules="rules"
        label-width="80px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="计划说明" prop="executeDate">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" :disabled="isdisable" v-model="queryParams.executeDate"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <span style="font-size: 14px;color: #333333;font-weight: 700">添加维护保养日期</span>
        </el-col>
      </el-row>
      <el-table
          ref="multipleTable"
          :data="tableData"
          stripe
          border
          style="margin-top: 20px"
      >
        <el-table-column label="序号" align="center" type="index" width="50"/>
        <el-table-column label="已选择日期" align="center">
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.planDate" value-format="yyyy-MM-dd" type="date"
                            placeholder="选择日期" style="width:100%" :disabled="isdisable"></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="add_row" :disabled="isdisable">添加</el-button>
            <el-button size="mini" type="text" @click="del_row(scope.$index)" style="color: #ff4949" v-if="tableData.length !== 1" :disabled="isdisable">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleOk" v-if="types !== 'show'">确定</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: "planDate",
    data () {
      return {
        showMode: false,
        queryParams: {},
        rules: {
          executeDate: [{required: true, message: "请输入计划说明", trigger: "blur"}]
        },
        tableData: [{planDate: ''}],
        datas: {},
        types: '',
        isdisable: false
      }
    },
    methods: {
      init (data, type) {
        this.types = type
        this.datas = data
        if (type === 'show') {
          this.isdisable = true
        }
        if (this.datas.executeDate !== '添加') {
          this.tableData = []
          this.queryParams = {
            ...data
          }
          this.datas.dateList.forEach((item, index) => {
            this.tableData.push({
              planDate: item
            })
          })
        }
        this.showMode = true
      },
      // 添加行
      add_row () {
        let obj = {};
        obj.planDate = '',
        this.tableData.push(obj);
      },
      // 删除行
      del_row (index) {
        this.tableData.splice(index, 1)
      },
      handleOk () {
        this.$refs.queryForm.validate((valid) => {
          if (valid) {
            const tabse = this.tableData.map(item => {
              if (item.planDate === '' || item.planDate === null) {
              } else {
                return item
              }
            })
            var newArr = tabse.filter(item => item)
            this.queryParams.dateList = newArr.map(item => {
              return item.planDate
            })
            if (this.queryParams.dateList.length === 0) {
              this.$message.error('请添加维护保养日期， 完善表格数据')
              return
            }
          console.log(this.queryParams.dateList)
            this.queryParams.equipmentNumber = this.datas.equipmentNumber
            this.$emit('plandate', this.queryParams)
            this.close()
          }
        })
      },
      close () {
        this.$emit('close')
      }
    }
  }
</script>

<style scoped lang="less">
  /deep/.el-dialog--center {
    text-align: left !important;
  }
</style>
