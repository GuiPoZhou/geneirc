<template>
  <el-dialog
    class="elDialog"
    center
    width="60%"
    :visible.sync="dialogShow"
    :fullscreen="isFullScreen"
    :modal-append-to-body="false"
    :modal="false"
    :show-close="false"
  >
    <div slot="title" class="dialog-title">
      <span class="topTilte">{{ titles }}</span>
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
        <i class="el-icon-close rightIcon" @click="cancelbtn"></i>
      </div>
    </div>
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      :prop="queryParams"
      style="margin: 15px 0 0 0"
      :rules="rules"
      label-width="120px"
    >
      <el-row>
        <el-col :span="22">
          <el-form-item label="不符记录编号" prop="incompatibleSerial">
            <el-input
              placeholder="请选择不符记录编号"
              v-model="queryParams.incompatibleSerial"
              disabled
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1" style="padding-left: 25px">
          <el-button type="primary" @click="handleOption" :disabled="isdisable">选择</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="不符合项" prop="item">
            <el-input
              placeholder="请输入不符合项"
              v-model="queryParams.item"
              :disabled="isdisable"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型" prop="type">
            <el-select
              v-model="queryParams.type"
              placeholder="请输入类型"
              :disabled="isdisable"
            >
              <el-option label="一般不符合" :value="1">一般不符合</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="纠正措施" prop="measure">
            <el-input
              placeholder="请输入纠正措施"
              v-model="queryParams.measure"
              :disabled="isdisable"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="完成日期" prop="finishTime">
            <el-date-picker
              v-model="queryParams.finishTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              style="width: 100%"
              :disabled="isdisable"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="有效性验证结果" prop="validation">
            <el-input
              placeholder="请输入有效性验证结果"
              v-model="queryParams.validation"
              :disabled="isdisable"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="queryParams.remark"
              :disabled="isdisable"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" v-if="showType !== 'show'" @click="handleOk()"
        >保存</el-button
      >
      <el-button @click="cancelbtn">取消</el-button>
    </div>
    <!--内审通知单选择-->
    <el-dialog
      class="elDialog"
      center
      width="40%"
      :visible.sync="shownotice"
      append-to-body
      title="不符合记录选择"
    >
      <div class="cont">
        <p>请选择关联的内审不符合记录</p>
      </div>
      <el-table
        ref="multipleTable"
        :data="noticeList"
        stripe
        border
        highlight-current-row
        @current-change="handleSelectionChange"
      >
        <el-table-column label="序号" align="center" type="index" width="50" />
        <el-table-column
          prop="serial"
          label="不符合记录编号"
          show-overflow-tooltip
        />
        <el-table-column
          prop="deptName"
          label="受审部门"
          show-overflow-tooltip
        />
        <el-table-column
          prop="factDescription"
          label="不符合项"
          show-overflow-tooltip
        />
      </el-table>
      <!-- 公共分页子组件 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="form.pageNum"
        :limit.sync="form.pageSize"
        @pagination="getList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="select">确定</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { checkadd, checkedit, inconformitylist } from "@/api/mass/config";
export default {
  name: "createMeet",
  data() {
    return {
      dialogShow: false,
      isFullScreen: true,
      screenName: "fullScreen",
      titles: "新增",
      showType: "add",
      queryParams: {
        planSerial: "",
        planId: "",
        item: "",
        type: "",
        measure: "",
        finishTime: "",
        validation: "",
        remark: "",
        incompatibleSerial: "",
        status: 3,
      },
      form: {
        pageNum: 1,
        pageSize: 10,
      },
      rules: {
        incompatibleSerial: [
          { required: true, message: "请输入不符合记录编号", trigger: "blur" },
        ],
      },
      isdisable: false,
      fileList: [],
      total: 0,
      noticeList: [],
      shownotice: false,
      planSerials: [],
      incompatibleSerial: [],
      planser: [],
      selction: [],
    };
  },
  computed: {
    getLeftWidth() {
      return this.$store.state.app.leftWidth;
    },
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
      } else if (val == "show") {
        this.titles = "查看";
        this.isdisable = true;
      }
    },
  },
  methods: {
    init(show, data) {
      console.log(data);
      this.showType = show;
      this.dialogShow = true;
      this.form.planId = data.planId;
      if (this.showType == "add") {
        this.queryParams.planSerial = data.planSerial;
        this.queryParams.planId = data.planId;
        this.queryParams.status = data.status;
      } else {
        this.queryParams.planSerial = data.planSerial;
        this.queryParams.incompatibleSerial = data.incompatibleSerial;
        console.log(data);
        this.queryParams.id = data.id;
        this.queryParams.planId = data.planId;
        this.queryParams.item = data.item;
        this.queryParams.type = data.type;
        this.queryParams.measure = data.measure;
        this.queryParams.finishTime = data.finishTime;
        this.queryParams.validation = data.validation;
        this.queryParams.remark = data.remark;
        this.queryParams.status = data.status;

        // this.incompatibleSerial = "";
        // for (var i in data.incompatibleSerial) {
        //   this.planSerials +=
        //     data.incompatibleSerial +
        //     (i < data.incompatibleSerial.length - 1 ? "，" : "");
        // }
      }
      this.getList();
    },
    getList() {
      inconformitylist(this.form).then((response) => {
        var noticeList = [];
        for(var i in response.data.list) {
          if(response.data.list[i].status == 3) {
            noticeList.push(response.data.list[i])
          }
        }
        this.noticeList = noticeList;
        this.total = noticeList.length;
        this.loading = false;
      });
    },
    e_changeBox(type) {
      this.isFullScreen = type;
    },
    // 内审通知
    handleOption() {
      console.log(this.handleOption);
      this.shownotice = true;
    },
    close() {
      this.shownotice = false;
    },
    cancelbtn() {
      this.$emit("close");
    },
    // 将数据填充到表单中
    handleSelectionChange(val) {
      this.selction = val;
    },
    select() {
      var val = this.selction;
      this.queryParams.incompatibleSerial = val.serial;
      this.queryParams.incompatibleId = val.id;
      // this.incompatibleSerial = [];
      // this.planser = [];
      // for (var item in val) {
      //   this.incompatibleSerial.push(val[item].serial);
      //   this.planser.push({
      //     incompatibleId: val[item].id,
      //     incompatibleSerial: val[item].serial,
      //   });
      // }
      this.shownotice = false;
    },
    // 执行添加和编辑的逻辑
    handleOk() {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          if (this.queryParams.id) {
            checkedit(this.queryParams).then((res) => {
              if (res.code === 200) {
                this.$message.success("编辑成功");
                this.$emit("creat");
              }
            });
          } else {
            checkadd(this.queryParams).then((res) => {
              if (res.code === 200) {
                this.$message.success("添加成功");
                this.$emit("creat");
              }
            });
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.cont {
  font-size: 14px;
  color: #333333;
  font-weight: bold;
}

/deep/ .el-dialog__body .el-table {
  background-color: #fff;
}
</style>
