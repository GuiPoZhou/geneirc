<template>
	<el-form :model="queryParams" ref="queryForm" :prop="queryParams" style="margin: 15px 0 0 0" :rules="rules" label-width="120px">
		<el-tabs v-model="activeName" type="card">
			<el-tab-pane label="内审计划" name="first">
				<el-row>
					<el-col :span="8">
						<el-form-item label="计划编号" prop="serial">
							<el-input placeholder="请输入计划编号" class="input-with-select" v-model="queryParams.serial" :disabled="isdisable"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="计划年度" prop="year">
							<el-date-picker v-model="queryParams.year" type="year" value-format="yyyy" :disabled="isdisable" placeholder="选择计划年度" style="width:100%">
							</el-date-picker>
						</el-form-item>
					</el-col>

					<el-col :span="8">
						<el-form-item label="编制人员" prop="compilerName">
							<el-input placeholder="请输入编制人员" class="input-with-select" v-model="queryParams.compilerName" :disabled="isdisable"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="编制日期" prop="compilerTime">
							<el-date-picker v-model="queryParams.compilerTime" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择日期" style="width:100%" :disabled="isdisable"></el-date-picker>
						</el-form-item>
					</el-col>

					<el-col :span="8">
						<el-form-item label="评审时间安排" prop="reviewTime">
							<el-date-picker v-model="queryParams.reviewTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期" style="width:100%" :disabled="isdisable"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="评审地点" prop="location">
							<el-input placeholder="请输入评审地点" class="input-with-select" v-model="queryParams.location" :disabled="isdisable"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="内审目的" prop="purpose">
							<el-input type="textarea" :rows="2" class="input-with-select" placeholder="请输入内容" v-model="queryParams.purpose" :disabled="isdisable"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="评审依据" prop="basis">
							<el-input type="textarea" :rows="2" class="input-with-select" placeholder="请输入内容" v-model="queryParams.basis" :disabled="isdisable"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="参加评审部门及人员" prop="planPersonList">
							<el-input placeholder="请选择参加评审部门及人员" class="input-with-select" v-model="planPersonName" disabled></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="评审内容" prop="content">
							<el-input type="textarea" :rows="2" class="input-with-select" placeholder="请输入内容" v-model="queryParams.content" :disabled="isdisable"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-tab-pane>
		</el-tabs>
	</el-form>
</template>

<script>
export default {
	name: "qualityReviewPlan",
	data() {
		return {
			showTransfer: false,
			dialogShow: false,
			isFullScreen: true,
			screenName: "fullScreen",
			activeName: 'first',
			queryParams: {
				serial: "",
				year: "",
				// compilerId: "",
				compilerName: "",
				compilerTime: "",
				reviewTime: "",
				purpose: "",
				basis: "",
				location: "",
				content: ""
			},
			rules: {},
			isdisable: true,
			auditMode: [],
			modeList: [
				{value: '1', label: '抽样检查有关资料、记录', ischecked: false},
				{value: '2', label: '现场检测', ischecked: false}
			],
			loading: false,
			personalData: [],
			schedulelData: [],
			selectHandlerVisible: true,
			planPersonList: [],
			planPersonName: ""
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
	},
	methods: {
		init(data,show) {
			console.log(data)
			this.queryParams = {
				id: data.id,
				serial: data.serial,
				year: data.year ? data.year : '',
				compilerId: data.compilerId,
				compilerName: data.compilerName,
				compilerTime: data.compilerTime,
				reviewTime: data.reviewTime,
				purpose: data.purpose,
				basis: data.basis,
				location: data.location,
				content: data.content
			}
			this.planPersonList = data.planPersonList
			this.planPersonName = ""
			for (var i in data.planPersonList) {
				this.planPersonName += data.planPersonList[i].userName + (i < data.planPersonList.length - 1 ? '，' : '')
			}
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
/deep/ .el-form-item__content {
	width: calc(100% - 120px);
}
</style>
