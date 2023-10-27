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
		@open="open"
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
		<el-form :model="queryParams" ref="queryForm" :inline="true" :prop="queryParams" style="margin: 15px 0 0 0"
				 :rules="rules" label-width="120px">
			<el-tabs v-model="activeName" type="card">
				<el-tab-pane label="管理评审计划" name="0">
					<auditPlan ref="auditPlanForm" :id="id" @nextStep="nextStep"></auditPlan>
				</el-tab-pane>
				<!--				<el-tab-pane label="实施计划" name="1">
									<implement ref="implementForm" :id="id" :disabled="progressEndStr.search('1') !=-1 || showType == 'show'" @nextStep="nextStep"></implement>
								</el-tab-pane>-->
				<el-tab-pane label="管评通知" name="2">
<!--					<notice ref="noticeForm" :id="id" :disabled="progressEndStr.search('2') !=-1 || showType == 'show'"-->
<!--							@nextStep="nextStep"></notice>-->
					<notice ref="noticeForm" :id="id" @nextStep="nextStep"></notice>
				</el-tab-pane>
				<el-tab-pane label="管评会议记录" name="3">
					<meeting ref="meetingForm" :id="id"
							 :disabled="progressEndStr.search('3') !=-1 || showType == 'show'"
							 @nextStep="nextStep"></meeting>
				</el-tab-pane>
				<el-tab-pane label="管评报告" name="4">
					<report ref="reportForm" :id="id" :disabled="progressEndStr.search('4') !=-1 || showType == 'show'"
							@nextStep="nextStep"></report>
				</el-tab-pane>
			</el-tabs>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="cancelbtn">取消</el-button>
		</div>

	</el-dialog>
</template>

<script>
import {getPlanInfo} from "@/api/qualityAssurance/managementReview/auditPlan";
import auditPlan from './components/auditPlan'
import implement from './components/implement'
import meeting from './components/meeting'
import notice from './components/notice'
import report from './components/report'
import {changeStatus, getFishInfo} from "@/api/qualityAssurance/managementReview/auditImplement";

export default {
	name: "createPlan",
	components: {
		implement,
		meeting,
		notice,
		report,
		auditPlan,
	},
	data() {
		return {
			dialogShow: false,
			isFullScreen: true,
			screenName: "fullScreen",
			titles: '实施',
			showType: 'add',
			activeName: '2',
			queryParams: {},
			rules: {},
			isdisable: false,
			auditData: [],
			firstmeetData: [],
			sceneauditData: [],
			inconformityData: [],
			inconformitytrackData: [],
			auditReportData: [],
			lastmeetData: [],
			showscene: false,
			showinconform: false,
			showtask: false,
			id: 0,
			infoData: "",
			progress: 1,
			dataPro: {},
			progressEndStr: ''
		}
	},
	computed: {
		getLeftWidth() {
			return this.$store.state.app.leftWidth;
		}
	},

	mounted() {

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
				this.titles = "实施";
			} else if (val == "update") {
				this.titles = "修改";
			} else if (val == "show") {
				this.titles = "查看";
				this.isdisable = true
			}
		},
		progress(val) {
			console.log(val)
			switch (val) {
				case (1):
					this.activeName = "tow";
					break;
				case (2):
					this.activeName = "three";
					break;
				case (3):
					this.activeName = "four";
					break;
				default:
					this.activeName = "five";
			}
		}
	},
	methods: {
		nextStep(data) {
			console.log(data);
			this.dataPro = data
			changeStatus(data).then(res => {
				if (data.progress === 4) {
					this.activeName = '4'
				} else {
					this.activeName = (data.progress + 1).toString()
				}
				this.getFinish()
			});
		},
		// 完成情况
		getFinish() {
			getFishInfo(this.id).then(res => {
				console.log(res)
				if (res.data.progressEndStr === null) {
					this.progressEndStr = '2'
				} else {
					this.progressEndStr = res.data.progressEndStr
				}
			})
		},
		init(show, data) {
			this.showType = show;
			this.id = data
			this.dialogShow = true;
			getPlanInfo(this.id).then(res => {
				if (res.data.progress === 5 || res.data.progress === 4) {
					this.activeName = '4'
				} else if (res.data.progress === 1) {
					this.activeName = '2'
				} else {
					this.activeName = (res.data.progress + 1).toString();
				}
				this.$nextTick(() => {
					this.$refs.auditPlanForm.init(res.data);
					// this.$refs.implementForm.setData(res.data);
					this.$refs.noticeForm.setData(res.data);
					this.$refs.meetingForm.setData(res.data);
					this.$refs.reportForm.setData(res.data);
				})
			})
			this.getFinish()
		},
		open() {
		},
		e_changeBox(type) {
			this.isFullScreen = type;
		},


		// 现场审核记录添加
		addscene() {
			this.showscene = true
			this.$nextTick(() => {
				this.$refs.scene.init('add')
			})
		},
		// 不符合记录添加
		addinconform() {
			this.showinconform = true
			this.$nextTick(() => {
				this.$refs.inconform.init('add')
			})
		},
		// 不符合项跟踪验证添加
		addtask() {
			this.showtask = true
			this.$nextTick(() => {
				this.$refs.task.init('add')
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

.tabtit {
	display: flex;
	justify-content: space-between;
	align-content: center;

	span {
		font-size: 14px;
		color: #3C4353;
		font-weight: bold;
	}
}

/deep/ .el-dialog__body .el-table {
	background-color: #fff;
}

.btnbox {
	border-bottom: 1px solid #dfe4ed;
	padding-bottom: 15px;
}

.tabtit {
	font-size: 14px;
	color: #333333;
	font-weight: bold;
	padding: 10px 10px 0;
}
</style>
