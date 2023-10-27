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
				<el-tab-pane label="内审报告" name="first">
					<el-row>
						<el-col :span="12">
							<el-form-item label="内审报告编号" prop="serial">
								<el-input
									placeholder="请输入内审报告编号"
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
						<el-col :span="24">
							<el-form-item label="审核目的" prop="purpose">
								<el-input
									type="textarea"
									:rows="2"
									placeholder="请输入内容"
									v-model="queryParams.purpose"
									:disabled="isdisable"
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="审核范围" prop="scope">
								<el-input
									type="textarea"
									:rows="2"
									placeholder="请输入内容"
									v-model="queryParams.scope"
									:disabled="isdisable"
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="审核依据" prop="basis">
								<el-input
									type="textarea"
									:rows="2"
									placeholder="请输入内容"
									v-model="queryParams.basis"
									:disabled="isdisable"
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="被审核部门" prop="deptName">
								<treeselect :disabled="isdisable"
											style="line-height: normal!important;"
											:multiple="true"
											v-model="deptId"
											:options="deptOptions"
											@select="selectDepart"
											:show-count="true" placeholder="请选择部门"/>
								<!--							<el-input
																	type="textarea"
																	:rows="2"
																	placeholder="请输入内容"
																	v-model="queryParams.deptName"
																	:disabled="isdisable"
																></el-input>-->
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="审核组长及成员" prop="userName">
								<el-input
									readonly
									placeholder="请选择审核组长及成员"
									v-model="userStr"
									:disabled="isdisable"
									@focus="handleAdd"
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<span class="tit">质量体系运行情况的综合评价</span>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24" class="scol">
							<el-input
								type="textarea"
								:rows="2"
								autosize
								placeholder="请输入内容"
								v-model="queryParams.overview"
								:disabled="isdisable"
							></el-input>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<span class="tit">存在的主要问题</span>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24" class="scol">
							<el-input
								type="textarea"
								autosize
								:rows="2"
								placeholder="请输入内容"
								v-model="queryParams.problem"
								:disabled="isdisable"
							></el-input>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<span class="tit">纠正措施及要求</span>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24" class="scol">
							<el-input
								type="textarea"
								autosize
								placeholder="请输入内容"
								v-model="queryParams.measure"
								:disabled="isdisable"
							></el-input>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="附件上传" prop="standardNameCn">
								<el-upload
									ref="upload"
									:action="uploadUrl()"
									:on-success="uploadSuccess"
									:on-remove="uploadRemove"
									:limit="5"
									:file-list="fileList"
									:disabled="isdisable"
								>
									<div slot="file" slot-scope="{ file }">
                    <span style="padding-right: 20px">{{
							file.name ? file.name : file.fileName
						}}</span>
										<el-button
											type="text"
											size="small"
											@click="look_file(file)"
										>
											查看
										</el-button>
										<el-button
											type="text"
											size="small"
											style="color: #1cd0bd"
											@click="down_file(file)"
										>
											下载
										</el-button>
										<el-button
											type="text"
											size="small"
											style="color: #ff4949"
											@click="uploadRemove(file)"
											v-if="showType !== 'show'"
										>
											删除
										</el-button>
									</div>
									<el-button
										type="primary"
										icon="el-icon-paperclip"
										:disabled="isdisable"
									>点击上传
									</el-button
									>
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
			>提交
			</el-button
			>
			<el-button type="primary" v-if="showType !== 'show'" @click="handleSave"
			>保存
			</el-button
			>
			<el-button @click="cancelbtn">取消</el-button>
		</div>
		<teamAdd :addShow.sync="addShow" @setUerData="setUerData" ref="teamAdd"/>
	</el-dialog>
</template>

<script>
import approvalProcess from "@/components/approvalProcess/index";
import {getApprovalProcess} from "@/api/qualityAssurance/index";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {treeselect} from "@/api/system/dept";
import {reportadd, reportedit} from "@/api/mass/config";
import teamAdd from "../teamAdd"

export default {
	name: "sceneAudit",
	components: {approvalProcess, Treeselect, teamAdd},
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
				type: "",
				serial: "",
				purpose: "",
				scope: "",
				basis: "",
				deptName: [],

				userName: "",
				overview: "",
				problem: "",
				measure: "",
				id: "",
				fileList: [],
			},
			deptId: [],
			addShow: false,
			rules: {},
			isdisable: false,
			fileList: [],
			shownotice: false,
			activeName: "first",
			// 部门树选项
			deptOptions: [],
			approvalProcess: {},
			uploadFileList: [],
			userStr: "",
			userList: []
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
		setUerData(data) {
			console.log(data)
			let userList = []
			for (let i = 0; i < data.length; i++) {
				userList.push(data[i].userName + (data[i].isGroupLeader ? '(组长)' : ''))
			}
			console.log('userList',userList)
			this.userList = data
			this.userStr = userList.join(',')
		},
		handleAdd() {
			this.addShow = true;
			console.log('this.userList',this.userList)
			this.$refs.teamAdd.initAdd(this.userList)
		},
		// 获取审批流程
		getProcess() {
			const params = {
				businessType: "INTERNAL_AUDIT_REPORT",
				businessId: this.queryParams.id,
				businessStatus: this.queryParams.status,
			};
			getApprovalProcess(params).then((res) => {
				this.approvalProcess = res;
			});
		},
		// 接收父组件数据
		init(show, data) {
			console.log('data',data)
			this.showType = show;
			this.dialogShow = true;
			this.getTreeselect();
			this.getProcess();
			if (this.showType == "add") {
				this.queryParams.planSerial = data.planSerial;
				this.queryParams.planId = data.planId;
			} else {
				this.queryParams = data;
				this.uploadFileList = data.fileList;
				this.fileList = data.fileList;
				this.queryParams.fileList = data.fileList;
				data.deptName = JSON.parse(data.deptName)
				this.queryParams.deptName = data.deptName;
				let userName = []
				if(data.userNameList){
					for (let i = 0; i < data.userNameList.length; i++) {
						userName.push({
							userName: data.userNameList[i].nickName,
							userId: data.userNameList[i].userId,
							userDeptId: data.userNameList[i].deptId,
							userDeptName: data.userNameList[i].deptName,
							isGroupLeader: false,
						})
					}
				}
				console.log(userName)
				console.log(data.groupLeaderName)
				if(data.groupLeaderName){
					let userList = [JSON.parse(data.groupLeaderName), ...userName]
					console.log("userList", userList)
					let userStr = []
					for (let i = 0; i < userList.length; i++) {
						userStr.push(userList[i].userName + (userList[i].isGroupLeader ? '(组长)' : ''))
					}
					this.userList = userList
					this.userStr = userStr.join(',')
				}
				console.log('data.deptName.length',data.deptName.length)
				if (data.deptName.length > 0) {
					this.deptId = data.deptName.map(item => item.id);
				}
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
				this.fileList = fileList;
				if (this.fileList.length > 0) {
					this.uploadFileList = this.fileList.map((item) => {
						console.log(item);
						return {
							fileName: item.name ? item.name : item.fileName,
							filePath: item.response ? item.response.fileName : item.filePath,
						};
					});
					console.log(this.uploadFileList);
				}
			} else {
				this.fileList = [];
				this.uploadFileList = [];
			}
		},
		// 文件删除
		uploadRemove(file) {
			let index = this.fileList.findIndex((fileItem) => {
				return (
					(fileItem.name ? fileItem.name : fileItem.fileName) ===
					(file.name ? file.name : file.fileName)
				);
			});
			this.fileList.splice(index, 1);
			if (this.fileList.length > 0) {
				this.uploadFileList = this.fileList.map((item) => {
					return {
						fileName: item.name,
						filePath: item.response.fileName,
					};
				});
				console.log(this.uploadFileList);
			} else {
				this.uploadFileList = [];
			}
		},
		// 查看文件
		look_file(data) {
			console.log(data);
			window.open(
				process.env.VUE_APP_BASE_API +
				"/" +
				(data.filePath ? data.filePath : data.response.url),
				"_blank"
			);
		},
		// 下载文件
		down_file(data) {
			this.mbu_downloadFile(data.filePath ? data.filePath : data.response.url)
		},
		/** 查询部门下拉树结构 */
		getTreeselect() {
			treeselect().then((response) => {
				this.deptOptions = response.data;
			});
		},
		departmentSelected(val) {
			this.queryParams.departmentId = val.id;
			this.queryParams.departmentName = val.label;
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
		selectDepart(val) {
			console.log('selectDepart', this.queryParams.deptName)
			this.queryParams.deptName.push({
				label: val.label,
				id: val.id
			})
		},
		unique(arr) {
			for (var i = 0; i < arr.length - 1; i++) {
				for (var j = i + 1; j < arr.length; j++) {
					if (arr[i].id == arr[j].id) {
						arr.splice(j, 1);
						j--;
					}
				}
			}
			return arr;
		},
		// 提交&保存
		saveInfos(status) {
			this.$refs.queryForm.validate((valid) => {
				if (valid) {
					this.queryParams.deptName = this.unique(this.queryParams.deptName)
					// console.log(this.queryParams.deptName)
					this.queryParams.status = status;
					this.queryParams.fileList = this.uploadFileList;
					var mag = "";
					if (status === 1) {
						mag = "保存成功";
					} else {
						mag = "提交成功";
					}
					let params = {
						...this.queryParams,
						groupLeaderName: "",
						userName: [],
						deptName: this.queryParams.deptName
					}
					params.deptName = JSON.stringify(params.deptName)
					console.log('this.userList',this.userList)
					if (this.userList.length > 0) {
						params.groupLeaderName = JSON.stringify(this.userList[0])
						for (let i = 1; i < this.userList.length; i++) {
							params.userName.push(this.userList[i].userId);
						}
					}
					console.log('params.userName',params.userName)
					params.userName = params.userName.join(',')
					if (this.queryParams.id) {
						reportedit(params).then((res) => {
							if (res.code == 200) {
								this.$message.success(mag);
								this.$emit("reportdata");
							}
						});
					} else {
						reportadd(params).then((res) => {
							if (res.code == 200) {
								this.$message.success(mag);
								this.$emit("reportdata");
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

/deep/ textarea {
	min-height: 50px !important;
}
</style>
