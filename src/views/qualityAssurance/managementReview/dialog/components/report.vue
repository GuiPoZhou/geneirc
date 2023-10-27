<template>
	<div>
		<div class="btnbox">
			<el-button type="primary" @click="addReport" :disabled="disabled">添加</el-button>
			<el-button type="primary" :disabled="disabled" @click="next">完成</el-button>
		</div>
		<p class="tabtit">管评报告列表</p>
		<el-table ref="multipleTable" :data="reportData" stripe border @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="40"/>
			<el-table-column label="序号" align="center" type="index" width="50"/>
			<el-table-column prop="serial" label="管评报告编号" show-overflow-tooltip/>
			<el-table-column prop="planSerial" label="管评计划编号" show-overflow-tooltip/>
			<el-table-column prop="compilerName" label="编制人" show-overflow-tooltip/>
			<el-table-column prop="compilerTime" label="编制日期" show-overflow-tooltip/>
			<el-table-column prop="status" label="状态" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.status === 1" style="color: #1cd0bd">待提交</span>
					<span v-if="scope.row.status === 2" style="color: #f5bb4a">审批中</span>
					<span v-if="scope.row.status === 3" style="color: #0d8ddb">已批准</span>
					<span v-if="scope.row.status === 4" style="color: #ff2222">已退回</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button size="mini" type="text" @click="lookReport(scope.row.id)">查看</el-button>
					<el-button size="mini" type="text" v-if="scope.row.status === 3" @click="handlePrint(scope.row.id)">打印流程</el-button>
					<template v-if="!disabled">
						<el-button size="mini" type="text" v-if="scope.row.status === 1 || scope.row.status === 4" @click="editReport(scope.row.id)">修改</el-button>
						<el-button size="mini" type="text" v-if="scope.row.status === 1 || scope.row.status === 4" @click="delReport(scope.row.id)">删除</el-button>
					</template>
				</template>
			</el-table-column>
		</el-table>
		<pagination
			v-show="total > 0"
			:total="total"
			:page.sync="queryParams.pageNum"
			:limit.sync="queryParams.pageSize"
			@pagination="getList"
			style="height: 30px"
		/>
		<!--添加/查看/修改管评报告-->
		<reportForm v-if="showReport" @complete="complete" ref="report" @close="showReport = false"></reportForm>
	</div>
</template>

<script>
import reportForm from '../implement/reportForm'
import {
	getReportList,
	getReportInfo,
	delReport
} from "@/api/qualityAssurance/managementReview/auditImplement";

export default {
	name: "report",
	components: {reportForm},
	data() {
		return {
			showReport: false,
			reportData: [],
			queryParams: {
				pageNum: 1,
				pageSize: 10,
				planId: 0,
			},
			total: 0,
			formData: {},
			ids: []
		}
	},
	props: {
		id: 0,
		disabled: false
	},
	mounted() {
		this.getList();
	},
	methods: {
		next() {
			this.$emit('nextStep', {
				planId: this.id,
				progress: 4
			});
		},
		addReport() {
			this.showReport = true
			this.$nextTick(() => {
				this.$refs.report.init('add', this.formData)
			})
		},
		lookReport(id) {
			this.showReport = true
			getReportInfo(id).then(res => {
				this.$nextTick(() => {
					this.$refs.report.init('show', res.data)
				})
			})
		},
		submit(id) {
			console.log(id)
			this.$message.success('提交成功')
		},
		editReport(id) {
			this.showReport = true
			getReportInfo(id).then(res => {
				this.$nextTick(() => {
					this.$refs.report.init('edit', res.data)
				})
			})
		},
		delReport(id) {
			this.$confirm('确定删除该管评报告吗？', '提示').then(res => {
				delReport(id).then(res => {
					this.$message.success('删除成功');
					this.getList();
				})
			})
		},
		setData(data) {
			this.formData = {
				planId: data.id,
				planSerial: data.serial
			}
		},
		complete() {
			this.getList();
			this.showReport = false;
		},
		getList() {
			this.queryParams.planId = this.id
			getReportList(this.queryParams).then(res => {
				this.reportData = res.data.list;
				this.total = res.data.total;
			})
		},
		/***多选框选中数据***/
		handleSelectionChange(selection) {
			this.ids = selection.map(item => item.id);
		},
		// 打印
		handlePrint(id) {
			POBrowser.openWindowModeless(
				process.env.VUE_APP_BASE_API +
				"/qualityControl/pageOffice/printManagementReview?executionId=" +
				id,
				"width=1440px;height=860px"
			);
		}
	}
}
</script>

<style scoped>

</style>
