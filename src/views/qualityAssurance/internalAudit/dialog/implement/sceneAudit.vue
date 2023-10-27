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
        <el-tab-pane label="现场审核记录" name="first">
          <el-row>
            <el-col :span="12">
              <el-form-item label="现场记录编号" prop="serial">
                <el-input
                  placeholder="请输入现场记录编号"
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
              <el-form-item label="审核项目" prop="item">
                <el-input
                  placeholder="请输入审核项目"
                  v-model="queryParams.item"
                  :disabled="isdisable"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="陪同人" prop="escort">
                <el-input
                  placeholder="请输入陪同人"
                  v-model="queryParams.escort"
                  :disabled="isdisable"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="对应文件名称" prop="fileName">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="queryParams.fileName"
                  :disabled="isdisable"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="tit">发现的情况与客观证据 内审员</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="scol">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="queryParams.situationEvidence"
                :disabled="isdisable"
              ></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="tit">内审员意见 内审员</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="scol">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="queryParams.reviewerOpinion"
                :disabled="isdisable"
              ></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="tit">受审核部门负责人意见 部门负责人</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="scol">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="queryParams.onTrialOpinion"
                :disabled="isdisable"
              ></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="tit">审核组评审结果 内审组长</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="scol">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="queryParams.assessmentResults"
                :disabled="isdisable"
              ></el-input>
            </el-col>
          </el-row>
          <el-row>
				<el-col :span="24">
					<el-form-item label="附件上传" prop="standardNameCn">
						<el-upload ref="upload" :action="uploadUrl()" :on-success="uploadSuccess"
								   :on-remove="uploadRemove" :limit="5" :file-list="fileList" :disabled="isdisable">
							<div slot="file" slot-scope="{file}">
								<span style="padding-right: 20px">{{file.name?file.name:file.fileName}}</span>
								<el-button type="text" size="small" @click="look_file(file)">
									查看
								</el-button>
								<el-button type="text" size="small" style="color: #1CD0BD" @click="down_file(file)">
									下载
								</el-button>
								<el-button type="text" size="small" style="color: #ff4949" @click="uploadRemove(file)" v-if="showType !== 'show'">
									删除
								</el-button>
							</div>
							<el-button type="primary" icon="el-icon-paperclip" :disabled="isdisable">点击上传</el-button>
						</el-upload>
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
        >提交</el-button
      >
      <el-button type="primary" v-if="showType !== 'show'" @click="handleSave"
        >保存</el-button
      >
      <el-button @click="cancelbtn">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { treeselect } from "@/api/system/dept";
import approvalProcess from "@/components/approvalProcess/index";
import { getApprovalProcess } from "@/api/qualityAssurance/index";

import { spotadd, spotedit } from "@/api/mass/config";
export default {
  name: "sceneAudit",
  components: { approvalProcess, Treeselect },
  data() {
    return {
      dialogShow: false,
      isFullScreen: true,
      screenName: "fullScreen",
      titles: "新增",
      showType: "add",
      queryParams: {
        planSerial: "",
        serial: "",
        planId: "",
        deptName: null,
        deptId: null,
        escort: "",
        situationEvidence: "",
        fileName: "",
        reviewerOpinion: "",
        onTrialOpinion: "",
        assessmentResults: "",
        item: "",
        reviewer: "",
        fileList: [],
      },
      rules: {
        deptId: [
          { required: true, message: "请选择受审部门", trigger: "change" },
        ],
      },
      isdisable: false,
      fileList: [],
      shownotice: false,
      activeName: "first",
      // 部门树选项
      deptOptions: [],
      approvalProcess: {},
      uploadFileList: [],
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
      console.log(111);
      const params = {
        businessType: "INTERNAL_AUDIT_ONSITE",
        businessId: this.queryParams.id,
        businessStatus: this.queryParams.status,
      };
      console.log(this.queryParams);
      console.log(params);
      getApprovalProcess(params).then((res) => {
        this.approvalProcess = res;
      });
    },
    init(show, data) {
      this.showType = show;
      this.dialogShow = true;
      this.getTreeselect();
      if (this.showType == "add") {
        this.queryParams.planSerial = data.planSerial;
        this.queryParams.planId = data.planId;
      } else {
        this.queryParams = data;
        this.uploadFileList = data.fileList
				this.fileList = data.fileList
				this.queryParams.fileList = data.fileList
        // this.queryParams.serial = data.serial;
        // this.queryParams.planId = data.planId;
        // this.queryParams.id = data.id;
        // this.queryParams.deptName = data.deptName;
        // this.queryParams.deptId = data.deptId;
        // this.queryParams.escort = data.escort;
        // this.queryParams.situationEvidence = data.situationEvidence;
        // this.queryParams.fileName = data.fileName;
        // this.queryParams.reviewerOpinion = data.reviewerOpinion;
        // this.queryParams.onTrialOpinion = data.onTrialOpinion;
        // this.queryParams.assessmentResults = data.assessmentResults;
        // this.queryParams.item = data.item;
        // this.queryParams.reviewer = data.reviewer;
        this.getProcess();
      }
    },
    e_changeBox(type) {
      this.isFullScreen = type;
    },
    // 文件上传路径返回
		uploadUrl() {
			return process.env.VUE_APP_BASE_API + "/common/upload";
		},
		// 文件上传成功
		uploadSuccess(res, file, fileList) {
			if (200 == res.code) {
				this.fileList = fileList
				if (this.fileList.length > 0) {
					this.uploadFileList = this.fileList.map(item => {
						console.log(item)
						return {
							fileName: item.name?item.name:item.fileName,
							filePath: item.response?item.response.fileName:item.filePath,
						}
					})
					console.log(this.uploadFileList)
				}
			} else {
				this.fileList = []
				this.uploadFileList = []
			}
		},
		// 文件删除
		uploadRemove(file) {
			let index = this.fileList.findIndex(fileItem => {
				return (fileItem.name?fileItem.name:fileItem.fileName) === (file.name?file.name:file.fileName)
			})
			this.fileList.splice(index, 1);
			if (this.fileList.length > 0) {
				this.uploadFileList = this.fileList.map(item => {
					return {
						fileName: item.name,
						filePath: item.response.fileName,
					}
				})
				console.log(this.uploadFileList)
			} else {
				this.uploadFileList = []
			}
		},
		// 查看文件
		look_file(data) {
			console.log(data)
			window.open(process.env.VUE_APP_BASE_API + '/' + (data.filePath?data.filePath:data.response.url), '_blank');
		},
		// 下载文件
		down_file(data) {
      this.mbu_downloadFile(data.filePath?data.filePath:data.response.url)
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
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          this.queryParams.status = status;
          this.queryParams.fileList = this.uploadFileList;
          var mag = "";
          if (status === 1) {
            mag = "保存成功";
          } else {
            mag = "提交成功";
          }
          if (this.queryParams.id) {
            spotedit(this.queryParams).then((res) => {
              if (res.code === 200) {
                this.$message.success(mag);
                this.$emit("sence");
              }
            });
          } else {
            spotadd(this.queryParams).then((res) => {
              if (res.code === 200) {
                this.$message.success(mag);
                this.$emit("sence");
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
</style>
