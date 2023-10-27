<template>
	<el-dialog
		title="检测类别选择"
		:visible.sync="visible"
		append-to-body
		width="800px"
		center
		:close-on-press-escape="false"
		:close-on-click-modal="false"

		@close="close"
	>
		<el-form
			ref="queryForm"
			:model="queryParams"
			label-width="80px"
			@submit.native.prevent
		>
			<!-- 搜索栏 -->
			<el-form-item label="类别名称">
				<el-input
					@keyup.enter.native="handleQuery"
					v-model="queryParams.detectName"
					@input="e_search"
					clearable
					placeholder="请输入选择类别名称"
				>
				</el-input>
			</el-form-item>

			<!-- 表格 -->
			<el-table :data="tableData" height="400">
				<el-table-column
					type="index"
					prop="id"
					label="序号"
					width="50"
				/>
				<el-table-column
					prop="detectName"
					label="类别名称"
					align="center"
				/>
				<el-table-column label="操作" width="100">
					<template slot-scope="scope">
						<el-button
							@click="handleClick(scope.row)"
							type="primary"
							round
							size="mini"
							>选择</el-button
						>
					</template>
				</el-table-column>
			</el-table>
		</el-form>
		<div slot="footer" class="center">
			<el-button @click="close">取消</el-button>
		</div>
	</el-dialog>
</template>
<script>
import { getParentCheckList } from "@/api/standardManagement/config";
import { mapState } from "vuex";
export default {
	data() {
		return {
			// 查询参数
			queryParams: {
				detectName: null,
			},
			// 参数表格数据
			tableData: [],
			//选择的上级类别名称
			selectDetectName: "",
			//选择的上级类别id
			parentId: ""
		};
	},
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		onlyShowLeaf:{
			type: Boolean,
			default: false
		}
	},
	methods: {
		/*
		 *@author: 焦政
		 *@date: 2021-01-25 11:25:07
		 *@description:自动输入自动检索
		 */
		e_search() {
			this.getTablelist();
		},
		/** input框搜索操作 */
		handleQuery() {
			// alert('根据类别名称进行查询')
			this.getTablelist();
		},
		//获取检测类别列表
		getTablelist() {
			this.queryParams.onlyShowLeaf = this.onlyShowLeaf;
			getParentCheckList(this.queryParams).then(response => {
				this.tableData = response.data;
			});
		},
		//取消按钮操作
		close() {
			this.$emit("update:visible", false);
		},
		//选择按钮操作
		handleClick(row) {
			this.$emit("handleClick", row);
			console.log("选择上级类别的一行===>", row);
			const selectDate = {
				parentId: row.parentId,
				selectDetectName: row.detectName,
				id: row.id
			};
			// this.selectDetectName = row.detectName;//现在就是把这个值传给父组件
			// this.parentId = row.parentId;//现在就是把这个值传给父组件
			this.$emit("handleParentName", selectDate);
			this.close();
		}
	},
	computed: {},
	// created() {
	// 	this.getTablelist();
	// },
	mounted() {
		this.getTablelist();
	}
};
</script>
