<!-- 已废弃-查看结果 -->
<template>
  <div class="receiveTask">
    <el-dialog
      class="elDialog"
      center
      width="70%"
      :visible.sync="recordResultShow"
      :fullscreen="isFullScreen"
      :modal-append-to-body="false"
      @open="open"
      ref="recordResultDialog"
      :show-close="false"
    >
      <!-- 标题 -->
      <div slot="title" class="dialog-title">
        <span class="topTilte">{{ title }}</span>
        <div class="topRight">
          <!-- 最小化 -->
          <i
            class="el-icon-minus rightIcon"
            v-if="isFullScreen"
            @click="e_changeBox(false)"
          ></i>
          <!-- 最大化 -->
          <i
            class="el-icon-full-screen rightIcon"
            v-if="!isFullScreen"
            @click="e_changeBox(true)"
          ></i>
          <!-- 关闭 -->
          <i class="el-icon-close rightIcon" @click="close"></i>
        </div>
      </div>
      <!-- 按钮 -->
      <!-- <el-button
        type="primary"
        size="mini"
        style="margin-top: 5px"
        @click="listBtn"
      >
        列表设置
      </el-button> -->
      <!-- 表格数据 -->
      <el-table
        :data="tableData"
        border
        class="lookDataTable"
        ref="lookDataTable"
        style="width: 100%; height: 100%; margin-top: 15px"
      >
        <el-table-column prop="batchCode" label="批次编码"></el-table-column>
        <el-table-column
          prop="detectTypeStr"
          label="检测类别"
        ></el-table-column>
        <el-table-column prop="sampleCode" label="样品编码"></el-table-column>
        <el-table-column prop="itemName" label="检测项目名称"></el-table-column>
        <el-table-column prop="detectResult" label="检测结果"></el-table-column>
        <el-table-column prop="editHisCount" label="修改记录">
          <template slot-scope="scope">
            <a @click="getEditHisCount(scope.row)" style="color: #1890ff">{{
              scope.row.editHisCount
            }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="instrumentCount" label="检测仪器">
          <template slot-scope="scope">
            <a @click="getInstrumentCount(scope.row)" style="color: #1890ff">{{
              scope.row.instrumentCount
            }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="itemFileList" label="检测记录">
          <template slot-scope="scope">
            <a @click="getDetectHistory(scope.row)" style="color: #1890ff">{{
              scope.row.instrumentCount
            }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="detectResult" label="检测结果"></el-table-column>
        <el-table-column
          prop="detectResultUnitStr"
          label="结果单位"
        ></el-table-column>
        <el-table-column prop="itemCode" label="方法编号"></el-table-column>
        <el-table-column prop="subname" label="子法名称"></el-table-column>
        <el-table-column
          prop="detectLimit"
          label="方法检出限"
        ></el-table-column>
        <el-table-column prop="rationLimit" label="定量限制"></el-table-column>
        <el-table-column
          prop="itemDecideLimitList"
          label="执行标准"
        ></el-table-column>
        <el-table-column prop="stroma" label="基质"></el-table-column>
        <el-table-column prop="limitDesc" label="判定指标"></el-table-column>
      </el-table>

      <!-- 输入框 -->
      <div slot="footer">
        <el-button @click="close">取消</el-button>
      </div>
    </el-dialog>

    <!-- 列表设置 -->
    <!-- <listSet :listSetShow="listSetShow" @cancel1="cancel" /> -->
    <!-- 修改记录弹框 -->
    <editHistory :editHisShow="editHisShow" 
    @cancel="editHisShow = false"
    :resultId="resultId"
     />
    <!-- 检测仪器 -->
    <detectInstrument
      :detectInstrumentShow="detectInstrumentShow"
      @cancel="detectInstrumentShow = false"
      :resultId="resultId"
    />
    <!-- 检测记录 -->
    <detectHistory
      :detectHistoryShow="detectHistoryShow"
      @cancel="detectHistoryShow = false"
      :tableData1="fileList"
    />
  </div>
</template>
<script>
// import listSet from "@/components/detectionManage/resultEntry/listSet";
import editHistory from "./editHistory.vue";
import detectInstrument from "./detectInstrument.vue";
import detectHistory from "./detectHistory.vue";
export default {
  name: "discardResult",
  components: {
    // listSet,
    editHistory,
    detectInstrument,
    detectHistory,
  },
  data() {
    return {
      pageSizes: [100, 200, 500], //分页数
      isFullScreen: true, //全屏
      // listSetShow: false, // 列表设置弹出框
      title: "已废弃-查看结果",
      tableWidth: 680,
      tableData: [],
      queryData: {
        pageNum: 1,
        pageSize: 100,
      },
      total: 0,
      editHisShow: false, //修改记录列表
      resultId: null,
      detectInstrumentShow: false, //检测仪器
      detectHistoryShow: false, // 检测记录
      resultId:null, //id 
      fileList:[]
    };
  },
  props: {
    recordResultShow: {
      type: Boolean,
      default: false,
    },
    discardResuleId: {
      type: Number,
    },
  },
  methods: {
    // 检测记录
    getDetectHistory(row) {
      this.detectHistoryShow = true;
      this.resultId = row.resultId
      this.fileList = row.itemFileList
    },
    // 设备仪器列表
    getInstrumentCount(row) {
      this.detectInstrumentShow = true;
      this.resultId = row.resultId
    },
    //修改记录列表
    getEditHisCount(row) {
      console.log(row);
      this.editHisShow = true;
      this.resultId = row.resultId
    },
    // 关闭弹出
    cancel() {
      this.listSetShow = false;
    },
    // 列表设置按钮弹框
    listBtn() {
      this.listSetShow = true;
    },
    open() {
      this.getDetail();
    },
    async getDetail() {
      const res = await this.$net(
        `/v1/detectManage/resultEnter/${this.discardResuleId}/getDetail`,
        "get"
      );
      this.tableData = res.data;
      // console.log(res);
      console.log(this.tableData);
    },
    //取消按钮操作
    close() {
      this.$emit("update:recordResultShow", false);
    },
    e_changeBox(type) {
      console.log("type", type);
      this.isFullScreen = type;
      if (type) {
        this.tableWidth = 680;
      } else {
        this.tableWidth = 500;
      }
    },
    getResultList() {},
  },
  computed: {},
  created() {},
  mounted() {},
  updated() {},
};
</script>
<style lang="less" scoped>
.pagination-container {
  height: 33px;
}

/deep/ .dialog-footer {
  display: flex;
  align-items: center;
  height: 50px;
  line-height: 16px;
  font-size: 16px;

  .left {
    border-right: 2px solid rgb(156, 153, 153);
    padding-right: 10px;

    span {
      color: blue;
    }
  }

  .right {
    display: flex;

    span {
      display: block;
      margin-right: 10px;
    }

    align-items: center;
    margin-left: 10px;
  }
}
.inputs {
  margin-top: 10px;
}

/deep/ .el-dialog__body {
  padding-bottom: 0;
  padding-top: 20px;
}
</style>
