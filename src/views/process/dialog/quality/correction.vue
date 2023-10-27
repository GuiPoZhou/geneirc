<template>
	<el-form
		:model="queryParams"
		ref="queryForm"
		:prop="queryParams"
		style="margin: 15px 0 0 0"
		label-width="120px">
		<el-tabs v-model="activeName" type="card">
			<el-tab-pane label="现场审核记录" name="first">
				<el-row>
					<el-col :span="12">
						<el-form-item label="纠正措施编号" prop="serial">
							<el-input placeholder="请输入纠正措施编号" v-model="queryParams.serial" :disabled="isdisable"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="编制人员" prop="compilerName">
							<el-input placeholder="请输入编制人员" v-model="queryParams.compilerName" :disabled="isdisable"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="编制日期" prop="compilerTime">
							<el-date-picker v-model="queryParams.compilerTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" style="width: 100%" :disabled="isdisable"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<span class="tit">不符合工作事实描述</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="scol">
						<el-form-item prop="description">
							<el-input
								type="textarea"
								:rows="3"
								placeholder="请输入内容"
								v-model="queryParams.description"
								:disabled="isdisable"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<span class="tit">原因分析</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="scol">
						<el-form-item prop="analysis">
							<el-input
								type="textarea"
								:rows="3"
								placeholder="请输入内容"
								v-model="queryParams.analysis"
								:disabled="isdisable"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<span class="tit">对不符合工作严重性的评价</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="scol">
						<el-form-item prop="evaluate">
							<el-input
								type="textarea"
								:rows="3"
								placeholder="请输入内容"
								v-model="queryParams.evaluate"
								:disabled="isdisable"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<span class="tit">采取的纠正措施和完成的时间(明确是否要通知客户)，对不符合工作的可接受性做出决定</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="scol">
						<el-form-item prop="decide">
							<el-input
								type="textarea"
								:rows="3"
								placeholder="请输入内容"
								v-model="queryParams.decide"
								:disabled="isdisable"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<span class="tit">纠正措施实施有效性的验证</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="scol">
						<el-form-item prop="verification">
							<el-input
								type="textarea"
								:rows="3"
								placeholder="请输入内容"
								v-model="queryParams.verification"
								:disabled="isdisable"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<span class="tit">批准是否继续工作的意见</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="scol">
						<el-form-item prop="opinion">
							<el-input
								type="textarea"
								:rows="3"
								placeholder="请输入内容"
								v-model="queryParams.opinion"
								:disabled="isdisable"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-tab-pane>
		</el-tabs>
	</el-form>
</template>

<script>
export default {
	name: "correction",
	data() {
		return {
			dialogShow: false,
			isFullScreen: true,
			screenName: "fullScreen",
			activeName: "first",
			queryParams: {},
			isdisable: true,
			deptOptions: [],
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
		e_changeBox(type) {
			this.isFullScreen = type;
		},
		init(data) {
			this.dialogShow = true;
			if (data) {
				this.queryParams = {
					...data,
				};
			}
		}
	},
};
</script>
<style lang="less" scoped>
.tit {
	font-size: 14px;
	color: #606266;
	font-weight: 700;
}

.scol {
	margin: 10px 0 !important;
}

/deep/ .el-dialog__body .el-col {
	margin-bottom: 0;
}
</style>
