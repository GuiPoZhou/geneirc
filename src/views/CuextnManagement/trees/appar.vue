<template>
  <!-- 选择设备的模态框 -->
  <el-dialog :visible.sync="selectGroup" :fullscreen="dialogFull" @open="open">
    <template slot="title">
      <div class="avue-crud__dialog__header">
        <span class="el-dialog__title"> 选择设备 </span>
        <div
          class="avue-crud__dialog__menu"
          @click="dialogFull ? (dialogFull = false) : (dialogFull = true)"
        >
          <i class="el-icon-full-screen"></i>
        </div>
      </div>
    </template>

    <h2>请选择监测设备</h2>
    <el-table
      :data="tabledete"
      stripe
      border
      ref="multipleTable"
      @current-change="handleSelectionChange"
    >
      <el-table-column prop="equipmentNo" label="设备编号" align="center">
      </el-table-column>
      <el-table-column prop="equipmentName" label="设备名称" align="center">
      </el-table-column>
      <el-table-column prop="location" label="安放位置" align="center">
      </el-table-column>
    </el-table>
    <div class="diafot">
      <!-- 触发选择的逻辑 -->
      <el-button type="primary" @click="handleOk">确定</el-button>
      <el-button @click="selectGroup = false">取消</el-button>
    </div>
    <!-- 分页子组件 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="form.pageNum"
      :limit.sync="form.pageSize"
      @pagination="getlist"
    />
  </el-dialog>
</template>

<script>
import { tllop } from "@/api/ctactl/config";
export default {
  data() {
    return {
      form: {
        pageNum: 1, //页码数
        pageSize: 10, //条数
        equipmentNo: "", //设备编号
        location: "", //安放位置
      },
      total: 0,
      tabledete: [],
      dialogFull: true, // 定义全局变量 dialogFull 用来控制弹窗
      selectGroup: false,
      listdata: [],
      selction: [],
    };
  },
  methods: {
    open() {
      this.getlist();
    },
    handleSelectionChange(val) {
      this.listdata = val.map((item) => item);
    },
    getlist() {
      tllop(this.form).then((response) => {
        this.tabledete = response.data.list;
        this.loading = false;
      });
    },
    init(data) {
      this.selectGroup = true;
    },
    handleSelectionChange(val) {
      this.selction = val;
      console.log(val);
    },
    //取消按钮操作
    close() {
      this.$emit("update:selectGroup", false);
    },
    //选择按钮操作
    handleOk() {
      this.$emit("handlapk", this.selction);
      this.selectGroup = false;
    },
  },
};
</script>
<style lang="less" scoped>
/*  弹框最大化按钮样式*/
.diafot {
  position: absolute;
  bottom: 18px;
  left: 40%;
  .el-button {
    margin-right: 20px;
  }
}
/deep/.el-dialog__header {
  padding: 15px 20px 15px;
}
/deep/.el-dialog__headerbtn {
  top: 15px;
}
/deep/.avue-crud__dialog__header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}
/deep/.el-dialog__title {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 800;
  font-size: 16px;
  word-wrap: break-word;
}
/deep/.avue-crud__dialog__menu {
  padding-right: 20px;
  float: left;
}
/deep/.avue-crud__dialog__menu i {
  color: #909399;
  font-size: 15px;
}
/deep/.el-icon-full-screen {
  cursor: pointer;
}
/deep/.el-icon-full-screen:before {
  content: "\e719";
}
</style>
