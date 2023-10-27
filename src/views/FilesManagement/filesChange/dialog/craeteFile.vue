<template>
	<el-dialog :title="titles"
			   :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
			   :close-on-click-modal="false" width="70%" @close="cancelbtn" @open="open">
		<el-form
			:model="queryParams"
			ref="queryForm"
			:prop="queryParams"
			:rules="rules"
			label-width="120px"
		>
			<el-tabs v-model="activeName" :stretch="true">

				<el-tab-pane label="文档基本信息" name="first">
					<el-row>
						<el-col :span="8">
							<el-form-item label="文件编号" prop="fileNumber">
								<el-input placeholder="请输入文件编号" v-model="queryParams.fileNumber"
										  :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="文件名称" prop="fileName">
								<el-input placeholder="请输入文件名称" v-model="queryParams.fileName"
										  :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="8">
							<el-form-item label="申请部门" prop="standardNameCn" class="three">
								<treeselect
									:disabled="isdisable"
									v-model="queryParams.departmentId"
									:options="deptOptions"
									:show-count="true"
									@select="departmentSelected"
									placeholder="请选择所属部门"
								/>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="8">
							<el-form-item label="申请人员" prop="applyUser">
								<el-input placeholder="请输入申请人员" v-model="queryParams.applyUser" disabled></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="8">
							<el-form-item label="申请日期" prop="applyDate" style="width: 100%">
								<el-date-picker v-model="queryParams.applyDate" value-format="yyyy-MM-dd" type="date"
												placeholder="选择日期" style="width:100%" :disabled="isdisable">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="审批人员" prop="approvalUser">
								<el-input placeholder="请输入审批人员" v-model="queryParams.approvalUser" disabled></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="更改原因" prop="reason">
								<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.reason"
										  :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="更改条款及内容" prop="changeClause">
								<el-input type="textarea" :rows="2" placeholder="请输入内容"
										  v-model="queryParams.changeClause" :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="更改后内容" prop="afterChangeContent">
								<el-input type="textarea" :rows="2" placeholder="请输入内容"
										  v-model="queryParams.afterChangeContent" :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="通知范围" prop="noticeRange">
								<el-input type="textarea" :rows="2" placeholder="请输入内容"
										  v-model="queryParams.noticeRange" :disabled="isdisable"></el-input>
							</el-form-item>
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
									<div slot="file" slot-scope="{file}">
										<span style="padding-right: 20px">{{file.name}}</span>
										<el-button type="text" size="small" @click="look_file(file.response)">查看
										</el-button>
										<el-button type="text" size="small" style="color: #1CD0BD"
												   @click="down_file(file.response)">下载
										</el-button>
										<el-button type="text" size="small" style="color: #ff4949"
												   @click="uploadRemove(file)" v-if="showType !== 'show'">删除
										</el-button>
									</div>
									<el-button type="primary" icon="el-icon-paperclip" :disabled="isdisable">点击上传
									</el-button>
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
			<el-button type="success" @click="handleSubmit" :loading="isloading" v-if="showType !== 'show'">提交</el-button>
			<el-button type="primary" @click="handleSave" :loading="isloading" v-if="showType !== 'show'">保存</el-button>
			<el-button @click="cancelbtn">取消</el-button>
		</div>
	</el-dialog>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {treeselect} from "@/api/system/dept";
import {getInfo} from '@/api/login'
import {
	addChangeApply,
	editChangeApply,
	getInsertOperateRecord,
	getApprovalProcess
} from '@/api/filesManagement/filesManagement'
import approvalProcess from '@/components/approvalProcess/index'

export default {
	name: "craeteFile",
	components: {Treeselect, approvalProcess},
	data() {
		return {
      isloading: false,
			dialogShow: false,
			isFullScreen: true,
			screenName: "fullScreen",
			titles: '新增',
			showType: 'add',
			activeName: 'first',
			queryParams: {},
			rules: {
				fileNumber: [{required: true, message: "请输入文件编号", trigger: "blur"}],
				fileName: [{required: true, message: "请输入文件名称", trigger: "blur"}],
			},
			// 上传文件列表
			fileList: [],
			isdisable: false,
			// 授权岗位
			postlist: [],
			tableData: [],
			activities1: [],
			// 部门树选项
			deptOptions: [],
			approvalProcess: {}
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
			} else if (val == "update") {
				this.titles = "修改";
			} else if (val == "show") {
				this.titles = "查看";
				this.isdisable = true
			}
		},
	},
	methods: {
		e_changeBox(type) {
			this.isFullScreen = type;
		},
		open() {
			if (this.queryParams.id) {
				if (this.queryParams.uploadFileList.length !== 0) {
					this.fileList = this.queryParams.uploadFileList.map(item => {
						console.log(item)
						return {
							name: item.fileName,
							response: {
								data: {
									filePath: item.filePath,
									id: item.id
								}
							}
						}
					})
					this.uploadFileList = this.fileList.map(item => {
						console.log(item)
						return {
							fileName: item.name,
							filePath: item.response.data.filePath,
						}
					})
				}
			}
		},
		init(show, data) {
			this.dialogShow = true
			this.showType = show
			if (data) {
				this.queryParams = {
					...data,
				};
			}
			this.getTreeselect();
			this.e_getInfo();
			if (this.queryParams.id) {
				this.getProcess()
			}
		}, // 获取审批流程
		getProcess() {
			const params = {
				businessType: 'FILE_MANAGE_CHANGE_APPLY',
				businessId: this.queryParams.id,
				businessStatus: this.queryParams.status
			}
			getApprovalProcess(params).then(res => {
				this.approvalProcess = res
			})
		},

		/** 查询部门下拉树结构 */
		getTreeselect() {
			treeselect().then(response => {
				this.deptOptions = response.data;
			});
		},
		departmentSelected(val) {
			this.queryParams.departmentId = val.id
			this.queryParams.departmentName = val.label
		},
		// 文件上传路径返回
		uploadUrl() {
			return window.globalEnv.VUE_APP_BASE_API + "/fileManage/upload";
		},
		// 文件上传成功
		uploadSuccess(res, file, fileList) {
			if (200 == res.code) {
				this.fileList = fileList
				console.log(this.fileList)
				if (this.fileList.length > 0) {
					this.uploadFileList = this.fileList.map(item => {
						return {
							fileName: item.name,
							filePath: item.response.data.filePath,
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
				return fileItem.name === file.name
			})
			this.fileList.splice(index, 1);
			if (this.fileList.length > 0) {
				this.uploadFileList = this.fileList.map(item => {
					return {
						fileName: item.name,
						filePath: item.response.data.filePath,
					}
				})
				console.log(this.uploadFileList)
			} else {
				this.uploadFileList = []
			}
		},
		// 查看文件
		look_file(data) {
			this.recordInfo(30)
			window.open(window.globalEnv.VUE_APP_BASE_API + '/' + data.data.filePath, '_blank');
		},
		// 下载文件
		down_file(data) {
			this.recordInfo(40)
			this.mbu_downloadFile(data.data.filePath)
		},
		e_getInfo() {
			getInfo().then(res => {
				this.queryParams.applyUser = res.user.nickName
			})
		},
		// 记录
		recordInfo(type) {
			if (this.queryParams.id) {
				getInsertOperateRecord(this.queryParams.id, type).then(res => {
					console.log(res)
				})
			}
		},
		// 提交
		handleSubmit() {
			this.saveInfos(2)
		},
		// 保存
		handleSave() {
			this.saveInfos(1)
		},
		// 需要保存和提交的信息
		saveInfos(status) {
			this.$refs.queryForm.validate((valid) => {
				if (valid) {
					this.queryParams.status = status
					this.queryParams.uploadFileList = this.uploadFileList
					var mag = ''
					if (status === 1) {
						mag = '保存成功'
					} else {
						mag = '提交成功'
					}
          this.isloading = true
					if (this.queryParams.id) {
						editChangeApply(this.queryParams).then(res => {
							if (res.code === 200) {
								this.$message.success(mag)
								this.$parent.getList()
								this.cancelbtn()
							}
						}).finally(() => {
							this.isloading = false
						})
					} else {
						addChangeApply(this.queryParams).then(res => {
							if (res.code === 200) {
								this.$message.success(mag)
								this.$parent.getList()
								this.cancelbtn()
							}
						}).finally(() => {
							this.isloading = false
						})
					}
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
/deep/ .el-dialog__body .el-col {
	margin-bottom: 0;
}

/deep/ .el-form-item.three .el-form-item__content {
	width: calc(100% - 120px);
}
</style>
