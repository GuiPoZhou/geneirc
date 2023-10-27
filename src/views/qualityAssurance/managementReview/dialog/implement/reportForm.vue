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
				<i class="el-icon-minus rightIcon" v-if="isFullScreen" @click="e_changeBox(false)"></i>
				<!-- 最大化 -->
				<i class="el-icon-full-screen rightIcon" v-if="!isFullScreen" @click="e_changeBox(true)"></i>
				<!-- 关闭 -->
				<i class="el-icon-close rightIcon" @click="cancelbtn"></i>
			</div>
		</div>
		<el-tabs v-model="activeName" type="card">
			<el-tab-pane label="管评报告" name="first">
				<el-form :model="queryParams"
						 ref="queryForm"
						 :inline="true"
						 :prop="queryParams"
						 style="margin: 15px 0 0 0"
						 :rules="rules" label-width="120px">
					<el-row>
						<el-col :span="12">
							<el-form-item label="管评报告编号" prop="serial">
								<el-input placeholder="请输入管评报告编号" v-model="queryParams.serial"
										  :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="管评计划编号" prop="planSerial">
								<el-input placeholder="请输入管评计划编号" v-model="queryParams.planSerial" disabled></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="编制人" prop="compilerName">
								<el-input placeholder="请输入编制人" v-model="queryParams.compilerName"
										  :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="编制日期" prop="compilerTime">
								<el-date-picker v-model="queryParams.compilerTime" value-format="yyyy-MM-dd HH:mm:ss"
												type="datetime" placeholder="选择日期" style="width:100%"
												:disabled="isdisable"></el-date-picker>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="备注" prop="remark">
								<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.remark"
										  :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="附件上传" prop="standardNameCn">
								<el-upload ref="upload" :action="uploadUrl()" :on-success="uploadSuccess"
										   :on-remove="uploadRemove" :limit="5" :file-list="fileList"
										   :disabled="isdisable">
									<div slot="file" slot-scope="{file}">
										<span
											style="padding-right: 20px">{{
												file.name ? file.name : file.fileName
											}}</span>
										<el-button type="text" size="small" @click="look_file(file)">
											查看
										</el-button>
										<el-button type="text" size="small" style="color: #1CD0BD"
												   @click="down_file(file)">
											下载
										</el-button>
										<el-button type="text" size="small" style="color: #ff4949"
												   @click="uploadRemove(file)" v-if="showType !== 'show'">
											删除
										</el-button>
									</div>
									<el-button type="primary" icon="el-icon-paperclip" :disabled="isdisable">点击上传
									</el-button>
								</el-upload>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-tab-pane>

			<el-tab-pane label="审批流程" name="second">
				<approvalProcess :approvalProcess="approvalProcess"></approvalProcess>
			</el-tab-pane>
		</el-tabs>
		<div slot="footer" class="dialog-footer">
			<el-button type="success" v-if="showType !== 'show'" @click="submit">提交</el-button>
			<el-button type="primary" v-if="showType !== 'show'" @click="save">保存</el-button>
			<el-button @click="cancelbtn">取消</el-button>
		</div>
	</el-dialog>
</template>

<script>
import {addReport, editReport, submitAndSave} from "@/api/qualityAssurance/managementReview/auditImplement";
import {getApprovalProcess} from "@/api/qualityAssurance/index";
import approvalProcess from "@/components/approvalProcess/index";

export default {
	name: "reportForm",
	components: {approvalProcess},
	data() {
		return {
			dialogShow: false,
			isFullScreen: true,
			screenName: "fullScreen",
			titles: '新增',
			showType: 'add',
			queryParams: {
				serial: "",
				planSerial: "",
				planId: "",
				compilerName: "",
				compilerTime: "",
				remark: "",
				fileList: [],
			},
			activeName: "first",
			rules: {
				serial: [{required: true, trigger: "blur", message: "请输入管评报告编号"}],
				compilerName: [{required: true, trigger: "blur", message: "请输入编制人"}],
				compilerTime: [{required: true, trigger: "blur", message: "请选择编制日期"}],
			},
			isdisable: false,
			fileList: [],
			uploadFileList: [],
			noticeList: [],
			approvalProcess: {},
			status: 0
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
			} else if (val == "edit") {
				this.titles = "修改";
			} else if (val == "show") {
				this.titles = "查看";
				this.isdisable = true
			}
		},
	},
	methods: {
		// 获取审批流程
		getProcess() {
			console.log(111);
			const params = {
				businessType: "APPROVAL_OF_MANAGEMENT_EVALUATION_REPORT",
				businessId: this.queryParams.id,
				businessStatus: this.status,
			};
			console.log(this.queryParams);
			console.log(params);
			getApprovalProcess(params).then((res) => {
				this.approvalProcess = res;
			});
		},
		init(show, data) {
			this.showType = show
			this.dialogShow = true
			if (this.showType == "add") {
				this.queryParams.planSerial = data.planSerial;
				this.queryParams.planId = data.planId;
			} else {
				this.queryParams.personList = data.personList;
				this.queryParams.serial = data.serial
				this.queryParams.planSerial = data.planSerial
				this.queryParams.planId = data.planId;
				this.queryParams.compilerName = data.compilerName;
				this.queryParams.compilerTime = data.compilerTime;
				this.queryParams.remark = data.remark;
				this.queryParams.id = data.id;
				this.uploadFileList = data.fileList
				this.fileList = data.fileList
				this.queryParams.fileList = data.fileList
				this.uploadFileList = data.fileList
				this.status = data.status
				this.getProcess()
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
							fileName: item.name ? item.name : item.fileName,
							filePath: item.response ? item.response.fileName : item.filePath,
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
				return (fileItem.name ? fileItem.name : fileItem.fileName) === (file.name ? file.name : file.fileName)
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
			window.open(process.env.VUE_APP_BASE_API + '/' + (data.filePath ? data.filePath : data.response.url), '_blank');
		},
		// 下载文件
		down_file(data) {
			this.mbu_downloadFile(data.filePath ? data.filePath : data.response.url)
		},
		save() {
			this.$refs.queryForm.validate((valid) => {
				if (valid) {
					this.queryParams.fileList = this.uploadFileList;
					if (this.showType == "add") {
						addReport(this.queryParams).then(res => {
							this.$message.success('新增成功');
							this.$emit("complete")
						});
					} else {
						editReport(this.queryParams).then(res => {
							this.$message.success('修改成功')
							this.$emit("complete")
						});
					}
				}
			})
		},
		submit() {
			this.$refs.queryForm.validate((valid) => {
				if (valid) {
					this.queryParams.fileList = this.uploadFileList;
					submitAndSave(this.queryParams).then(res => {
						this.$message.success('提交成功');
						this.$emit("complete")
					});
				}
			})
		},
		cancelbtn() {
			this.$emit('close')
		}
	}
}
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
