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
		<el-form :model="queryParams" ref="queryForm" :inline="true" :prop="queryParams" style="margin: 15px 0 0 0" :rules="rules" label-width="120px">
			<el-row>
				<el-col :span="12">
					<el-form-item label="会议记录编号" prop="serial">
						<el-input placeholder="请输入会议记录编号" v-model="queryParams.serial" :disabled="isdisable"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="管评计划编号" prop="planSerial">
						<el-input placeholder="请输入管评计划编号" v-model="queryParams.planSerial" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="会议时间" prop="time">
						<el-date-picker v-model="queryParams.time" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="会议时间" style="width:100%" :disabled="isdisable"></el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="会议地点" prop="location">
						<el-input placeholder="请输入会议地点" v-model="queryParams.location" :disabled="isdisable"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="主持人" prop="hostName">
						<el-input placeholder="请选择主持人" readonly @focus="selectPreside()" v-model="queryParams.hostName" :disabled="isdisable"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="记录人" prop="recorder">
						<el-input placeholder="请选择记录人" readonly @focus="selectRecording()" v-model="queryParams.recorder" :disabled="isdisable"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="与会人员" prop="participants">
						<el-input placeholder="请选择与会人员" readonly @focus="selectAttend()" v-model="participants" :disabled="isdisable" ></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="会议纪要" prop="content">
						<el-input type="textarea" autosize placeholder="请输入内容" v-model="queryParams.content" :disabled="isdisable"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="附件上传" prop="standardNameCn">
						<el-upload ref="upload" :action="uploadUrl()" :on-success="uploadSuccess"
								   :on-remove="uploadRemove" :limit="5" :file-list="fileList" :disabled="isdisable">
							<div slot="file" slot-scope="{file}">
								<span style="padding-right: 20px">{{ file.name ? file.name : file.fileName }}</span>
								<el-button type="text" size="small" @click="look_file(file)">
									查看
								</el-button>
								<el-button type="text" size="small" style="color: #1CD0BD" @click="down_file(file)">
									下载
								</el-button>
								<el-button type="text" size="small" style="color: #ff4949" @click="uploadRemove(file)"
										   v-if="showType !== 'show'">
									删除
								</el-button>
							</div>
							<el-button type="primary" icon="el-icon-paperclip" :disabled="isdisable">点击上传</el-button>
						</el-upload>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="save" v-if="showType !== 'show'">保存</el-button>
			<el-button @click="cancelbtn">取消</el-button>
		</div>
		<treeTransfer
			v-if="showTransfer"
			ref="transfer"
			@close="showTransfer = false"
			@handleData="handleData"
		></treeTransfer>
	</el-dialog>
</template>

<script>
import treeTransfer from "../../../common/treeTransfer";
import {addMeeting, editMeeting} from "@/api/qualityAssurance/managementReview/auditImplement"
import {choiceUser} from "@/api/qualityAssurance/index";

export default {
	name: "meetingForm",
	components: {treeTransfer},
	data() {
		return {
			showTransfer: false,
			dialogShow: false,
			isFullScreen: true,
			screenName: "fullScreen",
			titles: '新增',
			showType: 'add',
			queryParams: {
				serial: "",
				planSerial: "",
				time: "",
				location: "",
				hostName: "",
				recorder: "",
				participants: "",
				content: "",
				fileList: [],
			},
			rules: {
				serial: [{required: true, trigger: "blur", message: "请输入会议记录编号"}],
				time: [{required: true, trigger: "blur", message: "请选择会议时间"}],
				location: [{required: true, trigger: "blur", message: "请输入会议地点"}],
				hostName: [{required: true, trigger: "change", message: "请选择主持人"}],
				recorder: [{required: true, trigger: "change", message: "请选择记录人"}],
				participants: [{required: true, trigger: "change", message: "请选择与会人员"}],
			},
			isdisable: false,
			noticeList: [],
			uploadFileList: [],
			fileList: [],
			selectType: 0,
			participants: []
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
		init(show, data) {
			this.showType = show
			this.dialogShow = true
			if (this.showType == "add") {
				this.queryParams.planSerial = data.planSerial;
				this.queryParams.planId = data.planId;
			} else {
				this.queryParams.serial = data.serial
				this.queryParams.planSerial = data.planSerial
				this.queryParams.planId = data.planId;
				this.queryParams.time = data.time
				this.queryParams.location = data.location
				this.queryParams.hostName = data.hostName
				this.queryParams.recorder = data.recorder
				this.queryParams.participants = data.participants
				this.queryParams.content = data.content
				this.participants = data.participantsList.map(item => item.nickName).join(',')
				this.queryParams.participants = data.participantsList.map(item => item.userId).join(',')

				this.queryParams.id = data.id;
				this.uploadFileList = data.fileList
				this.fileList = data.fileList
				this.queryParams.fileList = data.fileList
			}
		},
		selectPreside() {
			this.selectType = 1
			this.showTransfer = true;
			choiceUser().then((res) => {
				this.$nextTick(() => {
					this.$refs.transfer.init(res.data, this.queryParams.hostName, "radio");
				});
			});
		},
		selectRecording() {
			this.selectType = 2
			this.showTransfer = true;
			choiceUser().then((res) => {
				this.$nextTick(() => {
					this.$refs.transfer.init(res.data, this.queryParams.recorder, "radio");
				});
			});
		},
		selectAttend() {
			this.selectType = 3
			this.showTransfer = true;
	/*		var data = [];
			for (var i in this.participants) {
				data.push(this.participants[i].userId);
			}*/
			choiceUser().then((res) => {
				this.$nextTick(() => {
					this.$refs.transfer.init(res.data, this.queryParams.participants.split(','));
				});
			});
		},
		//选择人员
		handleData(data) {
			console.log(data)
			if (this.selectType == 1) {
				this.queryParams.hostName = data[0].label
			} else if (this.selectType == 2) {
				this.queryParams.recorder = data[0].label
			} else {
				this.queryParams.participants = ""
				this.participants = [];
				this.planPersonName = "";
				/*for (var i in data) {
					this.participants.push({
						userId: data[i].id,
						userName: data[i].label
					})
					// this.queryParams.participants += data[i].label + (i < data.length - 1 ? "，" : "");
				}*/
				this.queryParams.participants += data.map(item => item.id).join(',')
				this.participants += data.map(item => item.label).join(',')
			}
			// console.log(this.planPersonList);
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
						addMeeting(this.queryParams).then(res => {
							this.$message.success('新增成功');
							this.$emit("complete");
						})
					} else {
						editMeeting(this.queryParams).then(res => {
							this.$message.success('修改成功')
							this.$emit("complete");
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
.cont {
	font-size: 14px;
	color: #333333;
	font-weight: bold;
}

/deep/ .el-dialog__body .el-table {
	background-color: #fff;
}

/deep/ textarea {
	min-height: 50px;
}
</style>
