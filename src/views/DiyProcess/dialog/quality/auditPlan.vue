<template>
		<el-form :model="queryParams" ref="queryForm" :prop="queryParams" style="margin: 15px 0 0 0" :rules="rules" label-width="70px">
			<el-tabs v-model="activeName" type="card">
				<el-tab-pane label="内审计划" name="first">
					<el-row>
						<el-col :span="12">
							<el-form-item label="计划编号" prop="serial">
								<el-input
									placeholder="请输入计划编号"
									v-model="queryParams.serial"
									:disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="计划年度" prop="year">
								<el-date-picker
									v-model="queryParams.year"
									type="year"
									value-format="yyyy"
									:disabled="isdisable"
									placeholder="选择计划年度"
									style="width: 100%;"
								>
								</el-date-picker>
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
							<el-form-item label="内审目的" prop="purpose">
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
							<el-form-item label="内审范围" prop="internalAuditScope">
								<el-input
									type="textarea"
									:rows="2"
									placeholder="请输入内容"
									v-model="queryParams.internalAuditScope"
									:disabled="isdisable"
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="内审依据" prop="basis">
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
							<el-form-item label="审核办法" prop="method">
								<el-checkbox-group
									v-model="queryParams.method"
									:disabled="isdisable"
								>
									<el-radio-group
										v-model="queryParams.method"
										:disabled="isdisable"
									>
										<el-radio :label="1">抽样检查有关资料、记录</el-radio>
										<el-radio :label="2">现场检测</el-radio>
									</el-radio-group>
								</el-checkbox-group>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="评审内容" prop="content">
								<el-input
									type="textarea"
									:rows="2"
									placeholder="请输入内容"
									v-model="queryParams.content"
									:disabled="isdisable"
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="发放范围" prop="distributionScope">
								<el-input
									type="textarea"
									:rows="2"
									placeholder="请输入内容"
									v-model="queryParams.distributionScope"
									:disabled="isdisable"
								></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<div class="tabtit">
						<span>参加人员</span>
					</div>
					<el-table
						v-loading="loading"
						:data="personalData"
						ref="selectTable"
						style="margin-top: 20px"
						highlight-current-row
						border
					>
						<el-table-column
							label="序号"
							align="center"
							type="index"
							width="50"
						/>
						<el-table-column prop="userPostName" label="职务" show-overflow-tooltip>
							<template slot-scope="scope">
								<el-select
										v-model="scope.row.userPostName"
										disabled
								>
									<el-option value="1" label="评审组长"></el-option>
									<el-option value="2" label="组员"></el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column prop="userName" label="姓名" show-overflow-tooltip></el-table-column>
					</el-table>
					<div class="tabtit" style="margin-top: 20px">
						<span>日程安排</span>
					</div>
					<el-table v-loading="loading" :data="schedulelData" ref="selectTable" style="margin-top: 20px" highlight-current-row border>
						<el-table-column label="序号" align="center" type="index" width="50"/>
						<el-table-column prop="time" label="日期" show-overflow-tooltip></el-table-column>
						<el-table-column prop="userName" label="评审人员" show-overflow-tooltip></el-table-column>
						<el-table-column prop="content" label="评审内容" show-overflow-tooltip></el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-form>
</template>

<script>
export default {
	name: "auditPlan",
	data() {
		return {
			dialogShow: false,
			isFullScreen: true,
			screenName: "fullScreen",
			activeName: "first",
			queryParams: {
				userId: "",
				method: "",
			},
			rules: {},
			isdisable: true,
			method: [],
			loading: false,
			personalData: [],
			schedulelData: [],
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
		}
	},
	methods: {
		init(data) {
			console.log(data)
			if (data) {
				this.queryParams = {
					...data,
				};
				this.personalData = this.queryParams.planPersonList;
				this.schedulelData = this.queryParams.planScheduleList;
			}
		}
	},
};
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
	width: calc(100% - 80px);
}
</style>

