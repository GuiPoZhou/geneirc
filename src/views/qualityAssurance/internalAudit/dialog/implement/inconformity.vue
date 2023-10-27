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
        <el-tab-pane label="不符合记录" name="first">
          <el-row>
            <el-col :span="12">
              <el-form-item label="不符合记录编号" prop="serial">
                <el-input
                  placeholder="请输入不符合记录编号"
                  v-model="queryParams.serial"
                  :disabled="isdisable"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="内审计划编号" prop="planSerial">
                <el-input
                  placeholder="请输入内审计划编号"
                  v-model="queryParams.planSerial"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="受审部门" prop="deptId">
                <treeselect
                  :disabled="isdisable"
                  v-model="queryParams.deptId"
                  :options="deptOptions"
                  :show-count="true"
                  @select="departmentSelected"
                  placeholder="请选择所属部门"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="内审员" prop="reviewer">
                <el-input
                  placeholder="请输入内审员"
                  v-model="queryParams.reviewer"
                  :disabled="isdisable"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="审核日期" prop="reviewTime">
                <el-date-picker
                  v-model="queryParams.reviewTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="选择日期"
                  style="width: 100%"
                  :disabled="isdisable"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="tit">不符合项事实描述</span>
            </el-col>
          </el-row>
          <el-row>
            <div class="borderbox">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="queryParams.factDescription"
                :disabled="isdisable"
              ></el-input>
              <el-upload
                style="margin-left: 20px"
                ref="upload"
                :action="uploadpath()"
                :on-success="upload1Success"
                :before-upload="beforeUpload"
                list-type="picture-card"
                :file-list="file1List"
                :disabled="isdisable"
              >
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{ file }">
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url ? file.url : baseUrl + file.filePath"
                    alt=""
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-preview"
                      @click=" handlePictureCardPreview(file.url ? file.url : baseUrl + file.filePath)"
                    >
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span
                      v-if="showType !== 'show'"
                      class="el-upload-list__item-delete"
                      @click="upload1Remove(file)"
                      ><i class="el-icon-delete"></i
                    ></span>
                  </span>
                </div>
              </el-upload>
            </div>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="tit">原因分析 受审核负责人</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="scol">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="queryParams.causeAnalysis"
                :disabled="isdisable"
              ></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="tit">纠正/预防措施 部门负责人</span>
            </el-col>
          </el-row>
          <el-row>
            <div class="borderbox">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="queryParams.measure"
                :disabled="isdisable"
              ></el-input>
              <el-upload
                style="margin-left: 20px"
                ref="upload"
                :action="uploadpath()"
                :on-success="upload2Success"
                :before-upload="beforeUpload"
                list-type="picture-card"
                :file-list="file2List"
                :disabled="isdisable"
              >
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{ file }">
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url ? file.url : baseUrl + file.filePath"
                    alt=""
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-preview"
                      @click="handlePictureCardPreview(file.url ? file.url : baseUrl + file.filePath)"
                    >
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span
                      v-if="showType !== 'show'"
                      class="el-upload-list__item-delete"
                      @click="upload2Remove(file)"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
            </div>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="tit">纠正/措施的完成情况 部门负责人</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="scol">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="queryParams.completion"
                :disabled="isdisable"
              ></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="tit">纠正/预防措施跟踪及有效性验证 部门负责人</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="scol">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="queryParams.validation"
                :disabled="isdisable"
              ></el-input>
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
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </el-dialog>
</template>

<script>
import approvalProcess from "@/components/approvalProcess/index";
import { getApprovalProcess } from "@/api/qualityAssurance/index";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { treeselect } from "@/api/system/dept";
import { inconformityedit, inconformityadd } from "@/api/mass/config";

export default {
  name: "inconformity",
  components: { approvalProcess, Treeselect },
  data() {
    return {
      dialogShow: false,
      isFullScreen: true,
      screenName: "fullScreen",
      titles: "新增",
      showType: "add",
      queryParams: {
        remark:
          "该不符合项不符合标准、手册、程序（含条款号）：\n 不符合类型(划√)：(1) 体系性不符合□  (2)实施性不符合□  (3)效果性不符合□\n",
        planSerial: "",
        serial: "",
        planId: "",
        deptName: null,
        deptId: null,
        reviewer: "",
        reviewTime: "",
        factDescription: "",
        causeAnalysis: "",
        measure: "",
        completion: "",
        validation: "",
        file2List: [],
        file1List: [],
      },
      rules: {
        deptId: [
          { required: true, message: "请选择受审部门", trigger: "change" },
        ],
      },
      isdisable: false,
      file2List: [],
      file1List: [],
      shownotice: false,
      activeName: "first",
      // 部门树选项
      deptOptions: [],
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      approvalProcess: {},
      baseUrl: process.env.VUE_APP_BASE_API + "/",
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
        businessType: "INTERNAL_AUDIT_INCOMPATIBLE",
        businessId: this.queryParams.id,
        businessStatus: this.queryParams.status,
      };
      getApprovalProcess(params).then((res) => {
        this.approvalProcess = res;
      });
    },
    init(show, data) {
      console.log(show,data)
      this.showType = show;
      this.dialogShow = true;
      this.getTreeselect();
      if (this.showType == "add") {
        this.queryParams.planSerial = data.planSerial;
        this.queryParams.planId = data.planId;
      } else {
        this.queryParams = data;
        console.log(data)
        // this.queryParams.planSerial = data.planSerial;
        // this.queryParams.serial = data.serial;
        this.queryParams.planId = data.planId;
        this.queryParams.id = data.id;
        this.queryParams.deptId = data.deptId;
        this.queryParams.deptName = data.deptName;
        // this.queryParams.reviewer = data.reviewer;
        // this.queryParams.reviewTime = data.reviewTime;
        // this.queryParams.factDescription = data.factDescription;
        // this.queryParams.causeAnalysis = data.causeAnalysis;
        // this.queryParams.measure = data.measure;
        // this.queryParams.completion = data.completion;
        // this.queryParams.validation = data.validation;
        // this.queryParams.file1List = data.file1List;
        // this.queryParams.file2List = data.file2List;

        this.file1List = data.file1List;
        this.file2List = data.file2List;
        this.getProcess();
      }
    },
    e_changeBox(type) {
      this.isFullScreen = type;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    // 文件上传路径返回
    uploadpath() {
      return process.env.VUE_APP_BASE_API + "/fileManage/upload";
    },

    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG,png 格式!");
      }
      return isJPG;
    },
    // 文件上传成功
    upload1Success(res, file, fileList) {
      if (200 == res.code) {
        console.log(res);
        console.log(fileList);
        this.file1List = fileList;
        if (fileList.length > 0) {
          this.queryParams.file1List = this.file1List.map((item) => {
            return {
              fileName: item.response ? item.name : item.fileName,
              filePath: item.response
                ? item.response.data.filePath
                : item.filePath,
            };
          });
        }
        console.log(this.queryParams.file1List);
      }
    },
    upload2Success(res, file, fileList) {
      if (200 == res.code) {
        console.log(res);
        this.file2List = fileList;
        if (fileList.length > 0) {
          this.queryParams.file2List = this.file2List.map((item) => {
            return {
              fileName: item.response ? item.name : item.fileName,
              filePath: item.response
                ? item.response.data.filePath
                : item.filePath,
            };
          });
        }
        console.log(this.queryParams.file2List);
      }
    },
    // 文件删除
    upload1Remove(file) {
      let index = this.queryParams.file1List.findIndex((fileItem) => {
        return (
          (fileItem.fileName ? fileItem.fileName : fileItem.name) ===
          (file.fileName ? file.fileName : file.name)
        );
      });
      console.log(index);
      this.file1List.splice(index, 1);
      if (this.file1List.length > 0) {
        this.queryParams.file1List = this.file1List.map((item) => {
          return {
            fileName: item.response ? item.name : item.fileName,
            filePath: item.response
              ? item.response.data.filePath
              : item.filePath,
          };
        });
        console.log(this.queryParams.file1List);
      } else {
        this.queryParams.file1List = [];
      }
    },
    upload2Remove(file) {
      let index = this.queryParams.file2List.findIndex((fileItem) => {
        return (
          (fileItem.fileName ? fileItem.fileName : fileItem.name) ===
          (file.fileName ? file.fileName : file.name)
        );
      });
      console.log(index);
      this.file2List.splice(index, 1);
      if (this.file2List.length > 0) {
        this.queryParams.file2List = this.file2List.map((item) => {
          return {
            fileName: item.response ? item.name : item.fileName,
            filePath: item.response
              ? item.response.data.filePath
              : item.filePath,
          };
        });
        console.log(this.queryParams.file2List);
      } else {
        this.queryParams.file2List = [];
      }
    },
    // // 查看文件
    look_file(data) {
      this.recordInfo(30);
      window.open(
        process.env.VUE_APP_BASE_API + "/" + data.data.filePath,
        "_blank"
      );
    },
    // // 下载文件
    down_file(data) {
      this.recordInfo(40);
      this.mbu_downloadFile(data.data.filePath)
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    departmentSelected(val) {
      this.queryParams.deptId = val.id;
      this.queryParams.deptName = val.label;
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
      console.log(this.queryParams);
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          this.queryParams.status = status;
          // this.queryParams.file2List = this.uploadFileList;
          // this.queryParams.file1List = this.uploadphoto;
          var mag = "";
          if (status === 1) {
            mag = "保存成功";
          } else {
            mag = "提交成功";
          }
          if (this.queryParams.id) {
            inconformityedit(this.queryParams).then((res) => {
              if (res.code === 200) {
                this.$message.success(mag);
                this.$emit("completeone");
              }
            });
          } else {
            inconformityadd(this.queryParams).then((res) => {
              if (res.code === 200) {
                this.$message.success(mag);
                this.$emit("completeone");
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
.tit {
  font-size: 14px;
  color: #606266;
  font-weight: 700;
}
.scol {
  margin: 10px 0 !important;
}
.borderbox {
  border: 1px solid #dde2ee;
  opacity: 1;
  border-radius: 3px;
  margin: 10px 0 !important;
  padding-bottom: 10px;
  /deep/ .el-textarea__inner {
    border: none;
  }
  /deep/ .el-upload--picture-card {
    width: 120px;
    height: 120px;
    line-height: 126px;
  }
  /deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 120px;
    height: 120px;
  }
}
</style>
