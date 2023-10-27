<template>
	<el-form :model="queryParams" ref="queryForm" :prop="queryParams" style="margin: 15px 0 0 0" label-width="120px">
		<el-tabs v-model="activeName" type="card">
			<el-tab-pane label="现场审核记录" name="first">
				<el-row>
					<el-col :span="12">
						<el-form-item label="不符合记录编号" prop="serial">
							<el-input placeholder="请输入不符合记录编号" v-model="queryParams.serial" :disabled="isdisable"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="责任部门" prop="deptName">
							<treeselect :disabled="isdisable" v-model="queryParams.deptId" :options="deptOptions" :show-count="true" @select="departmentSelected" placeholder="请选择所属部门"/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<span class="tit">不符合或潜在不符合简述</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="scol">
						<el-form-item prop="describe">
							<el-input
								type="textarea"
								:rows="3"
								placeholder="请输入内容"
								v-model="queryParams.describe"
								:disabled="isdisable"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<span class="tit">不符合工作的影响分析</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="scol">
						<el-form-item prop="analyze">
							<el-input
								type="textarea"
								:rows="3"
								placeholder="请输入内容"
								v-model="queryParams.analyze"
								:disabled="isdisable"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<span class="tit">不符合工作的处理及改进措施</span>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24" class="scol">
						<el-form-item prop="analyze">
							<el-input
								type="textarea"
								:rows="3"
								placeholder="请输入内容"
								v-model="queryParams.measure"
								:disabled="isdisable"
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-tab-pane>
		</el-tabs>
	</el-form>
</template>

<script>
import approvalProcess from "@/components/approvalProcess/index";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {treeselect} from "@/api/system/dept";


export default {
	name: "createInconform",
	components: {approvalProcess, Treeselect},
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
			this.getTreeselect();
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

