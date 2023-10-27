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
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="纠正与预防措施" name="first">
          <el-row>
            <el-col :span="12">
              <el-form-item label="纠正措施编号" prop="serial">
                <el-input
                  placeholder="请输入纠正措施编号"
                  v-model="queryParams.serial"
                  :disabled="isdisable"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="编制人员" prop="compilerName">
                <el-input
                  placeholder="请输入编制人员"
                  v-model="queryParams.compilerName"
                  :disabled="isdisable"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="编制日期" prop="compilerTime">
                <el-date-picker
                  v-model="queryParams.compilerTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"
                  style="width: 100%"
                  :disabled="isdisable"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                prop="description"
                style="
                  text-align: left;
                  margin-bottom: -100px;
                  margin-left: -56px;
                "
                label="不符合工作事实描述"
                label-width="210px"
              ></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="scol">
              <el-form-item prop="description">
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="请输入内容"
                  v-model="queryParams.description"
                  :disabled="isdisable"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                prop="analysis"
                style="
                  text-align: left;
                  margin-left: -126px;
                  margin-bottom: -100px;
                "
                label="原因分析"
                label-width="210px"
              ></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="scol">
              <el-form-item prop="analysis">
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="请输入内容"
                  v-model="queryParams.analysis"
                  :disabled="isdisable"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                prop="evaluate"
                style="
                  text-align: left;
                  margin-left: -15px;
                  margin-bottom: -100px;
                "
                label="对不符合工作严重性的评价"
                label-width="210px"
              ></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="scol">
              <el-form-item prop="evaluate">
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="请输入内容"
                  v-model="queryParams.evaluate"
                  :disabled="isdisable"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                prop="decide"
                style="text-align: left; margin-bottom: -100px; width: 568px"
                label="采取的纠正措施和完成的时间(明确是否要通知客户)，对不符合工作的可接受性做出决定"
                label-width="210px"
              ></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="scol">
              <el-form-item prop="decide">
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="请输入内容"
                  v-model="queryParams.decide"
                  :disabled="isdisable"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                prop="verification"
                style="
                  text-align: left;
                  margin-bottom: -100px;
                  margin-left: -10px;
                "
                label="纠正措施实施有效性的验证"
                label-width="210px"
              ></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="scol">
              <el-form-item prop="verification">
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="请输入内容"
                  v-model="queryParams.verification"
                  :disabled="isdisable"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                prop="opinion"
                style="
                  text-align: left;
                  margin-left: -28px;
                  margin-bottom: -100px;
                "
                label="批准是否继续工作的意见"
                label-width="210px"
              ></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="scol">
              <el-form-item prop="opinion">
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="请输入内容"
                  v-model="queryParams.opinion"
                  :disabled="isdisable"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="审批流程" name="second">
          <approvalProcess :approvalProcess="approvalProcess"></approvalProcess>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="success" v-if="showType !== 'show'" @click="handleSubmit"
        >提交
      </el-button>
      <el-button type="primary" v-if="showType !== 'show'" @click="handleSave"
        >保存
      </el-button>
      <el-button @click="cancelbtn">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import approvalProcess from "@/components/approvalProcess/index";
import { getApprovalProcess } from "@/api/qualityAssurance/index";
import { correctadd, correctedit } from "@/api/mass/config";

export default {
  name: "createInconform",
  components: { approvalProcess },
  data() {
    return {
      dialogShow: false,
      isFullScreen: true,
      screenName: "fullScreen",
      titles: "新增",
      showType: "add",
      activeName: "first",
      queryParams: {
        serial: "",
        compilerName: "",
        compilerTime: "",
        description: "",
        analysis: "",
        evaluate: "",
        decide: "",
        verification: "",
        opinion: "",
      },
      rules: {
        serial: [
          { required: true, message: "请输入纠正措施编号", trigger: "blur" },
        ],
        compilerName: [
          { required: true, message: "请输入编制人员", trigger: "blur" },
        ],
        compilerTime: [
          { required: true, message: "请输入编制日期", trigger: "blur" },
        ],
        description: [
          {
            required: true,
            message: "请输入不符合工作事实描述",
            trigger: "blur",
          },
        ],
        analysis: [
          { required: true, message: "请输入原因分析", trigger: "blur" },
        ],
        evaluate: [
          {
            required: true,
            message: "请输入对不符合工作严重性的评价",
            trigger: "blur",
          },
        ],
        decide: [
          {
            required: true,
            message: "请输入采取的纠正措施和完成的时间",
            trigger: "blur",
          },
        ],
        verification: [
          {
            required: true,
            message: "请输入纠正措施实施有效性的验证",
            trigger: "blur",
          },
        ],
        opinion: [
          {
            required: true,
            message: "请输入批准是否继续工作的意见",
            trigger: "blur",
          },
        ],
      },
      isdisable: false,
      deptOptions: [],
      approvalProcess: {},
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
    // 获取审批流程
    getProcess() {
      const params = {
        businessType: "QUALITY_CORRECTION_PREVENTION",
        businessId: this.queryParams.id,
        businessStatus: this.queryParams.status,
      };
      getApprovalProcess(params).then((res) => {
        this.approvalProcess = res;
      });
    },
    e_changeBox(type) {
      this.isFullScreen = type;
    },
    init(show, data) {
      this.dialogShow = true;
      this.showType = show;
      if (data) {
        this.queryParams = {
          ...data,
        };
        this.getProcess();
      }
    },
    cancelbtn() {
      this.$emit("close");
    },
    // 提交
    handleSubmit() {
      this.saveInfos(2);
    },
    // 保存
    handleSave() {
      this.saveInfos(1);
    },
    saveInfos(status) {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          this.queryParams.status = status;
          this.queryParams.uploadFileList = this.uploadFileList;
          var mag = "";
          if (status === 1) {
            mag = "保存成功";
          } else {
            mag = "提交成功";
          }
          if (this.queryParams.id) {
            correctedit(this.queryParams).then((res) => {
              if (res.code === 200) {
                this.$message.success(mag);
                this.$parent.getList();
                this.cancelbtn();
              }
            });
          } else {
            correctadd(this.queryParams).then((res) => {
              if (res.code === 200) {
                this.$message.success(mag);
                this.$parent.getList();
                this.cancelbtn();
              }
            });
          }
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.tit {
  font-size: 14px;
  color: #606266;
  font-weight: 700;
}

.scol {
  margin: 10px 0 !important;
}

/deep/ .el-dialog__body .el-col {
  margin-bottom: 0;
}
</style>
