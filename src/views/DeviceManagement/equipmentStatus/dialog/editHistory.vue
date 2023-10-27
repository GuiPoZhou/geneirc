<template>
	<el-dialog title="仪器状态修改历史"
			   :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
			   :close-on-click-modal="false" width="70%" @close="cancelbtn" @open="open">
    <el-table
        ref="multipleTable"
        :data="tableData"
        stripe
        border
    >
      <el-table-column label="序号" align="center" type="index" width="50"/>
      <el-table-column prop="createTimeStr" label="修改日期" show-overflow-tooltip/>
      <el-table-column prop="createByStr" label="修改人员" show-overflow-tooltip/>
      <el-table-column prop="beforeStatus" label="修改前状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.beforeStatus === '1'">正常</span>
          <span v-if="scope.row.beforeStatus === '2'">停用</span>
          <span v-if="scope.row.beforeStatus === '3'">维修</span>
          <span v-if="scope.row.beforeStatus === '4'">保养</span>
          <span v-if="scope.row.beforeStatus === '5'">报废</span>
          <span v-if="scope.row.beforeStatus === '6'">封存</span>
          <span v-if="scope.row.beforeStatus === '7'">核查</span>
          <span v-if="scope.row.beforeStatus === '8'">故障</span>
        </template>
      </el-table-column>
      <el-table-column prop="afterStatus" label="修改后状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.afterStatus === '1'">正常</span>
          <span v-if="scope.row.afterStatus === '2'">停用</span>
          <span v-if="scope.row.afterStatus === '3'">维修</span>
          <span v-if="scope.row.afterStatus === '4'">保养</span>
          <span v-if="scope.row.afterStatus === '5'">报废</span>
          <span v-if="scope.row.afterStatus === '6'">封存</span>
          <span v-if="scope.row.afterStatus === '7'">核查</span>
          <span v-if="scope.row.afterStatus === '8'">故障</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="修改说明" width="500px" show-overflow-tooltip/>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelbtn">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: "editStatus",
    data() {
      return {
        dialogShow: false,
        isFullScreen: true,
        screenName: "fullScreen",
        tableData: []
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
    },
    methods: {
      e_changeBox(type) {
        this.isFullScreen = type;
      },
      open() {
      },
      init(data) {
        this.tableData = data
        this.dialogShow = true
      },
      handleOk() {
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
  /deep/ .el-dialog__body .el-table {
    background-color: #fff;
  }
</style>
