<template>
  <el-dialog title="查看" :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
             :close-on-click-modal="false" width="70%" @close="cancelbtn" @open="open">

    <!-- 统一样式 - 查询区域 -->
    <!-- 表单 -->
    <el-form :model="queryParams" ref="queryParams" class="demo-form-inline" label-width="100px"
             style="display: flex;flex-wrap: wrap">
      <el-form-item label="使用日期">
        <el-date-picker v-model="dateRange" style="width: 250px"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        @change="ondateChange"
                        type="daterange" range-separator="-" start-placeholder="选择开始日期"
                        end-placeholder="选择结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="使用人" prop="user">
        <el-input v-model="queryParams.user" placeholder="请输入使用人" clearable class="input-with-select"
                  style="width: 250px"/>
      </el-form-item>
      <el-form-item label="样品编号" prop="sampleCode">
        <el-input v-model="queryParams.sampleCode" placeholder="请输入样品编号" clearable class="input-with-select"
                  style="width: 250px"/>
      </el-form-item>

      <!-- 统一样式 - 查询区域 按钮 -->
      <div class="a-c-t-btnarea">
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索
          </el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置
          </el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="success" :disabled="!ids.length > 0" @click="handlePrint">打印</el-button>
        <el-button type="warning" v-if="isExport" @click="handleExcope">导出</el-button>
        <el-button type="danger" :disabled="!ids.length > 0" @click="handleDel">删除</el-button>
        <el-col :span="1.5" v-for="(v, i) in projectSlotButtonList.entrySlotButtonList" :key="i">
          <el-button :type="v.type" :size="v.size" @click="e_slotButtonEvents(v)">{{ v.label }}
          </el-button>
        </el-col>
      </el-col>
    </el-row>
    <el-table ref="multipleTable" :data="tableData" stripe border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column label="序号" align="center" type="index" width="50"/>
      <!--      <el-table-column prop="useageDate" label="使用日期" show-overflow-tooltip/>-->
      <!--      <el-table-column prop="startEndDate" label="起止时间" show-overflow-tooltip>-->
      <el-table-column prop="startTime" label="开始时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="endTime" label="结束时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="user" label="使用人" show-overflow-tooltip/>
      <el-table-column prop="beforeStatus" label="使用前状态">
        <template slot-scope="scope">
          <span v-if="scope.row.beforeStatus === 1">正常</span>
          <span v-if="scope.row.beforeStatus === 2">停用</span>
          <span v-if="scope.row.beforeStatus === 3">维修</span>
          <span v-if="scope.row.beforeStatus === 4">保养</span>
          <span v-if="scope.row.beforeStatus === 5">报废</span>
          <span v-if="scope.row.beforeStatus === 6">封存</span>
          <span v-if="scope.row.beforeStatus === 7">核查</span>
          <span v-if="scope.row.beforeStatus === 8">故障</span>
        </template>
      </el-table-column>
      <el-table-column prop="afterStatus" label="使用后状态">
        <template slot-scope="scope">
          <span v-if="scope.row.afterStatus === 1">正常</span>
          <span v-if="scope.row.afterStatus === 2">停用</span>
          <span v-if="scope.row.afterStatus === 3">维修</span>
          <span v-if="scope.row.afterStatus === 4">保养</span>
          <span v-if="scope.row.afterStatus === 5">报废</span>
          <span v-if="scope.row.afterStatus === 6">封存</span>
          <span v-if="scope.row.afterStatus === 7">核查</span>
          <span v-if="scope.row.afterStatus === 8">故障</span>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作设定" show-overflow-tooltip/>
      <el-table-column prop="opinion" label="故障及处理意见" show-overflow-tooltip/>
      <el-table-column prop="testParameter" label="试验项目" show-overflow-tooltip/>
      <el-table-column prop="sampleCode" label="检测样品编号" show-overflow-tooltip/>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip/>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelbtn">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {lookEquipmentUseRecordList, delUseRecord, exportUseRecord} from '@/api/resources/deviceManagement/index.js'

export default {
  name: "editStatus",
  data() {
    return {
      dialogShow: false,
      isFullScreen: true,
      screenName: "fullScreen",
      tableData: [],
      dateRange: [],
      dateValue: [],
      id: null,
      queryParams: {
        sampleCode: '',
        user: '',
        useageDateBegin: '',
        useageDateEnd: '',
        equipmentId: null,
      },
      ids: [],
      projectSlotButtonList: {},//
      isExport: true,
      startTime: null,
      endTime: null,
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
  async created() {
    this.projectSlotButtonList = await this.getProjectSlotButtons('usageRecordButton')
    // 华淼的导出需要单独的  纳通的导出需要单独的
    this.isExport = !this.projectSlotButtonList.entrySlotButtonList.some(item => item.label == '导出')
    console.log(this.projectSlotButtonList)
  },
  methods: {
    e_changeBox(type) {
      this.isFullScreen = type;
    },
    open() {
      this.getdataList()
    },
    init(data) {
      this.id = data
      this.dialogShow = true
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.queryParams.useageDateBegin = undefined;
      this.queryParams.useageDateEnd = undefined;
      this.resetForm("queryParams");
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if (this.dateValue === null) {
        this.queryParams.useageDateBegin = undefined;
        this.queryParams.useageDateEnd = undefined;
      }
      this.queryParams.pageNum = 1;
      this.getdataList()
    },
    ondateChange(v) {
      this.dateValue = v;
      if (!v) {
        this.queryParams.useageDateBegin = '';
        this.queryParams.useageDateEnd = '';
      } else {
        this.queryParams.useageDateBegin = v[0];
        this.queryParams.useageDateEnd = v[1];
      }
    },
    handleSelectionChange(val) {
      this.ids = val.map(item => item.id);
    },
    getdataList() {
      this.queryParams.equipmentId = this.id
      lookEquipmentUseRecordList(this.queryParams).then(res => {
        this.tableData = res.data
      })
    },
    // 删除
    handleDel() {
      const ids = this.ids.join(',')
      this.$confirm('确定删除选中的数据吗?', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delUseRecord(ids).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getdataList()
          }
        })
      });
    },
    // 导出
    handleExcope() {
      this.queryParams.equipmentId = this.id
      let params = {
        equipmentId: this.id
      }
      if (this.ids.length != 0) {
        params.idList = this.ids
      }
      this.$net('/equipmentUseRecord/v2/exportUseRecord', 'post', params).then(res => {
        this.downLoadFile(res.msg)
      })
    },
    cancelbtn() {
      this.$emit('close')
    },
    e_slotButtonEvents(v) {
      var that = this
      new Function('that', v.events)(that)
    },
    handlePrint() {
      POBrowser.openWindowModeless(
          window.globalEnv.VUE_APP_BASE_API +
          "/equipment/pageOffice/printUseRecord?ids=" + this.ids.join(","),
          "width=1440px;height=860px"
      );
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

/deep/ .el-form--inline .el-form-item {
  width: auto;
}

/deep/ .el-form-item__content {
  width: auto;
}
</style>
