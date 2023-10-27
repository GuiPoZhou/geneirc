<template>
	<el-form
		:model="queryParams"
		ref="queryForm"
		:inline="true"
		:prop="queryParams"
		style="margin: 15px 0 0 0"
		:rules="rules"
		label-width="120px"
	>
		<el-row>
			<el-col :span="12">
				<el-form-item label="计划编号" prop="serial">
					<el-input placeholder="计划编号" v-model="queryParams.serial" :disabled="isdisable"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="计划年度" prop="year">
					<el-date-picker
						v-model="queryParams.year"
						type="year"
						value-format="yyyy"
						:disabled="isdisable"
						placeholder="选择计划年度">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="编制人员" prop="compilerName">
					<el-input placeholder="编制人员" v-model="queryParams.compilerName" :disabled="isdisable"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="编制日期" prop="compilerTime">
					<el-date-picker v-model="queryParams.compilerTime" value-format="yyyy-MM-dd" type="date"
									placeholder="选择日期" style="width:100%" :disabled="isdisable"></el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="评审时间安排" prop="reviewTime">
					<el-date-picker v-model="queryParams.reviewTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
									placeholder="评审时间安排" style="width:100%" :disabled="isdisable"></el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="评审地点" prop="location">
					<el-input placeholder="评审地点" v-model="queryParams.location" :disabled="isdisable"></el-input>
				</el-form-item>
			</el-col>

			<el-col :span="24">
				<el-form-item label="评审目的" prop="purpose">
					<el-input type="textarea" :rows="2" placeholder="评审目的" v-model="queryParams.purpose"
							  :disabled="isdisable"></el-input>
				</el-form-item>
			</el-col>

			<el-col :span="24">
				<el-form-item label="评审依据" prop="basis">
					<el-input type="textarea" :rows="2" placeholder="评审依据" v-model="queryParams.basis"
							  :disabled="isdisable"></el-input>
				</el-form-item>
			</el-col>

			<el-col :span="24">
				<el-form-item label="参加评审部门及人员" prop="planPersonName">
					<el-input placeholder="参加评审部门及人员" v-model="planPersonName"
							  :disabled="isdisable"></el-input>
				</el-form-item>
			</el-col>

			<el-col :span="24">
				<el-form-item label="评审内容" prop="content">
					<el-input type="textarea" :rows="2" placeholder="内容" v-model="queryParams.content"
							  :disabled="isdisable"></el-input>
				</el-form-item>
			</el-col>
		</el-row>
	</el-form>
</template>

<script>
export default {
	name: "auditPlan",
	data() {
		return {
			queryParams: {
				serial: "",
				year: "",
				compilerName: "",
				compilerTime: "",
				reviewTime: "",
				location: "",
				purpose: "",
				basis: "",
				content: "",
			},
			planPersonName: "",
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
		}
	},
	props: {
		id: 0
	},
	mounted() {
	},
	methods: {
		next() {
			this.$emit('nextStep', {
				planId: this.id,
				progress: 1
			});
		},
		init(data) {
			this.planPersonName = "";
			this.queryParams.serial = data.serial;
			this.queryParams.year = data.year;
			this.queryParams.compilerName = data.compilerName;
			this.queryParams.compilerTime = data.compilerTime;
			this.queryParams.reviewTime = data.reviewTime;
			this.queryParams.location = data.location;
			this.queryParams.purpose = data.purpose;
			this.queryParams.basis = data.basis;
			this.queryParams.content = data.content;
			for (var i in data.planPersonList) {
				this.planPersonName = this.planPersonName + data.planPersonList[i].userName + (i < data.planPersonList.length - 1 ? "，" : "")
			}

		}
	}
}
</script>

<style scoped>

</style>
