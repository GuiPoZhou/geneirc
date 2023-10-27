<template>
	<div>
		<BoDialog :diaLogShow="dialogShow"
							diaLogTitle="文件借阅申请"
							diaLogWidth="70%" @close="cancelbtn" @open="open">
			<template slot="bologbody">
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
						<el-tab-pane label="文件借阅申请" name="first">
							<el-row>
								<el-col :span="8">
									<el-form-item label="借阅日期" prop="applyDate">
										<el-input placeholder="请输入借阅日期" v-model="queryParams.applyDate" disabled></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="借阅部门" prop="departmentName">
										<el-input placeholder="请输入借阅部门" v-model="queryParams.departmentName"
															disabled></el-input>
									</el-form-item>
								</el-col>

								<el-col :span="8">
									<el-form-item label="借阅人员" prop="applyUser">
										<el-input placeholder="请输入借阅人员" v-model="queryParams.applyUser" disabled></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="8">
									<el-form-item label="批准人员" prop="approvalUser">
										<el-input placeholder="请输入批准人员" v-model="queryParams.approvalUser" disabled></el-input>
									</el-form-item>
								</el-col>

								<el-col :span="8">
									<el-form-item label="文件编号" prop="fileNumber">
										<el-input placeholder="请输入文件编号" v-model="queryParams.fileNumber" disabled></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="文件名称" prop="fileName">
										<el-input placeholder="请输入文件名称" v-model="queryParams.fileName" disabled></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="8">
									<el-form-item label="归还日期" prop="returnDate">
										<el-input placeholder="请输入归还日期" v-model="queryParams.returnDate" disabled></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="批准日期" prop="approvalDate">
										<el-input placeholder="请输入批准日期" v-model="queryParams.approvalDate" disabled></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="借阅数量" prop="amount">
										<el-input placeholder="请输入借阅数量" v-model="queryParams.amount"
															:disabled="isdisable"></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="24">
									<el-form-item label="备注" prop="remark" style="width:100%">
										<el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="queryParams.remark"
															:disabled="isdisable"></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row v-if="fileList.length !== 0">
								<el-col :span="24">
									<el-form-item label="附件" prop="standardNameCn">
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
											</div>
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
			</template>
			<template slot="bologfooter">
				<el-button type="primary" @click="handleOk" :loading="isloading" v-if="showType !== 'show'">确定</el-button>
				<el-button @click="cancelbtn">取消</el-button>
			</template>
		</BoDialog>
		<!--查看pdf-->
		<PdfShow ref="originalPdf" v-if="showPdfLog" @close="showPdfLog = false"/>
		<!--查看图片-->
		<lookPicture ref="lookpicture" v-if="showPicture" @close="showPicture = false"/>
	</div>
</template>

<script>
import {getInfo} from '@/api/login'
import {
	borrowPrintRecord,
	getApprovalProcess,
	getInsertOperateRecord,
	uploadfilde
} from '@/api/filesManagement/filesManagement'
import approvalProcess from '@/components/approvalProcess/index'
import PdfShow from "@/components/common/pdfshow.vue";
import lookPicture from "../../components/lookPicture";

export default {
	name: "craeteFile",
	components: {
        approvalProcess,
        PdfShow,
        lookPicture
    },
	data() {
		return {
      isloading: false,
			dialogShow: false,
			showPdfLog: false,
			showPicture: false,
			isFullScreen: true,
			screenName: "fullScreen",
			activeName: 'first',
			queryParams: {
				applyDate: '',
				departmentName: '',
				applyUser: '',
				approvalUser: '',
				returnDate: '',
				approvalDate: '',
				fileNumber: '',
				fileName: '',
				remark: '',
				amount: null,
			},
			fileList: [],
			rules: {
				amount: [{required: true, message: "请输入借阅数量", trigger: "blur"}]
			},
			showType: 'add',
			// 上传文件列表
			isdisable: false,
			drawer: false,
			approvalProcess: {},
			uploadFileList: []
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
			} else if (val == 'show') {
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
			this.getNowtime()
			this.e_getInfo()
			if (this.queryParams.uploadFileList) {
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
		// 获取当前时间
		getNowtime() {
			let yy = new Date().getFullYear();
			let mm = new Date().getMonth() + 1;
			let dd = new Date().getDate();
			let hh = new Date().getHours();
			let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
			let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
			this.queryParams.applyDate = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
			console.log(this.queryParams.applyDate)
		},
		e_getInfo() {
			getInfo().then(res => {
			  console.log(res)
				this.queryParams.applyUser = res.user.nickName
				this.queryParams.departmentName = res.user.dept.deptName
				this.queryParams.departmentId = res.user.dept.deptId
			})
		},
		init(show, data) {
			console.log(data)
			this.dialogShow = true
			this.showType = show
			if (data) {
				this.queryParams = {
					...data
				}
			}
			if (this.queryParams.id) {
				this.getProcess()
			}
		},
		// 获取审批流程
		getProcess() {
			const params = {
				businessType: 'FILE_MANAGE_BORROW',
				businessId: this.queryParams.id,
				businessStatus: this.queryParams.status
			}
			getApprovalProcess(params).then(res => {
				this.approvalProcess = res
			})
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
			uploadfilde(this.queryParams.id, data.data.id).then(res => {
				console.log(res)
				if (res.data.pdf) {
					this.showPdfLog = true
					this.$nextTick(() => {
						this.$refs.originalPdf.showPdfs(res.data.pdf);
					});
				}
				if (res.data.filePath) {
					let links = this.getNameFromLink(res.data.filePath)
					if (links === 'png' || links === 'jpg') {
						this.showPicture = true
						this.$nextTick(() => {
							this.$refs.lookpicture.init(res.data.filePath);
						});
					}
				}
			})
		},
		// 获取文件后缀
		getNameFromLink(obj) {
			var index = obj.lastIndexOf("\.");
			obj = obj.substring(index + 1, obj.length);
			return obj;
		},
		// 下载文件
		down_file(data) {
			this.recordInfo(40)
			this.mbu_downloadFile(data.data.filePath)
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
		handleOk() {
			this.$refs.queryForm.validate((valid) => {
				if (valid) {
					this.queryParams.businessType = 1
					this.queryParams.amount = this.queryParams.amount - 0
					this.queryParams.fileId = this.queryParams.id
          this.isloading = true
					borrowPrintRecord(this.queryParams).then(res => {
						if (res.code === 200) {
							this.$message.success('申请成功')
							this.$parent.getList()
							this.cancelbtn()
						}
					}).finally(() => {
						this.isloading = false
					})
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

/deep/ .el-upload-list {
	margin-top: -42px;
}
</style>
