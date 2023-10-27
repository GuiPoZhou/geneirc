<template>
	<div class="app-container">
		<div class="a-c-top" v-show="showSearch">
			<el-form
				:model="queryParams"
				ref="queryForm"
				:inline="true"
				v-show="showSearch"
				label-width="100px"
			>
				<el-form-item label="审批类型">
					<el-select v-model="queryParams.approvalTypeValue" @change="handleQuery" clearable size="small"
							   style="width: 240px">
						<el-option
							v-for="item in approvalTypeOption"
							:label="item.dictLabel"
							:value="item.dictValue"
							:key="item.dictValue"
						/>
					</el-select>
				</el-form-item>

				<el-form-item label="编制时间">
					<el-date-picker
						v-model="dateRange"
						size="small"
						style="width: 260px"
						value-format="yyyy-MM-dd"
						type="daterange"
						range-separator="-"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						@change="handleQuery"
					></el-date-picker>
				</el-form-item>
				<div class="a-c-t-btnarea">
				<el-form-item>
					<el-button
						type="primary"
						icon="el-icon-search"
						size="mini"
						@click="handleQuery"
					>搜索
					</el-button
					>
					<el-button
						icon="el-icon-refresh"
						size="mini"
						@click="resetQuery"
					>重置
					</el-button
					>
				</el-form-item>
				</div>
			</el-form>
		</div>
		<div class="a-c-bottom">
			<el-row :gutter="10" class="el-row-toolbar">
				<el-col :span="1.5">
					<el-button
						type="primary"
						icon="el-icon-plus"
						size="mini"
						@click="handleAdd"
					>新增审批流程
					</el-button>
				</el-col>
				<right-toolbar
					:showSearch.sync="showSearch"
					@queryTable="getList"
				></right-toolbar>
			</el-row>

			<el-table
				v-loading="loading"
				:data="configList"
				@selection-change="handleSelectionChange"
			>
				<el-table-column
					label="序号"
					type="index"
					width="50"
					align="center"
				/>
				<el-table-column
					label="审批类型"
					align="center"
					prop="approvalTypeName"
				/>
				<el-table-column
					label="编制人"
					align="center"
					prop="updateBy"
				/>
				<el-table-column
					label="编制时间"
					align="center"
					prop="updateTime"
					:formatter="formatterTime"
				/>
				<el-table-column
					label="操作"
					align="center"
					class-name="small-padding fixed-width"
				>
					<template slot-scope="scope">
						<el-button
							size="mini"
							type="text"
							icon="el-icon-info"
							@click="handleUpdate(scope.row)"
						>修改
						</el-button
						>
					</template>
				</el-table-column>
			</el-table>

			<pagination
				v-show="total > 0"
				:total="total"
				:page.sync="queryParams.pageNum"
				:limit.sync="queryParams.pageSize"
				@pagination="getList"
			/>
		</div>

		<add-approval-type
			:approvalTypeOption.sync="approvalTypeOption"
			:approvalTypeVisible.sync="approvalTypeVisible"
			@closePop="closePop"
			ref="addApprovalType"
		></add-approval-type>
	</div>
</template>

<script>
	import addApprovalType from "@/components/manageCenter/base/approvalManage/AddApprovalType";
	import {getDicts} from "@/api/system/dict/data";
	import {
		listConfig,
		delConfig,
		exportConfig,
		testList
	} from "@/api/manageCenter/base/approvalManage/approvalConfig";

	export default {
		name: "Config",
		components: {
			addApprovalType
		},
		data() {
			return {
				approvalTypeVisible: false, //子组件  添加审批流程类型组件
				// 日期范围
				dateRange: [],
				// 遮罩层
				loading: true,
				// 选中数组
				ids: [],
				// 非单个禁用
				single: true,
				// 非多个禁用
				multiple: true,
				// 显示搜索条件
				showSearch: true,
				// 总条数
				total: 0,
				// -- 检测审批配置表格数据
				configList: [],
				// 弹出层标题
				title: "",
				// 是否显示弹出层
				open: false,
				// 查询参数
				queryParams1: {
					pageNum: 1,
					pageSize: 10,
					approvalTypeName: null,
					approvalTypeValue: null
				},
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					approvalTypeValue: "",
					beginTime: null,
					endTime: null
				},
				//下拉框选项
				approvalTypeOption: []
			};
		},
		created() {
			this.getList();
			this.initDict();
			//测试接口时所用
			//this.getTestList();
		},
		methods: {
			getTestList() {
				let param = {};
				param.equipmentClass = "";
				param.equipmentNumber = null;
				param.pageNum = 1;
				param.pageSize = 10;
				testList(param).then(response => {
					console.log(response);
				});
			},
			closePop() {
				this.approvalTypeVisible = false;
				this.getList();
			},
			//初始化审批类型的字典值
			initDict() {
				getDicts("sys_approval_type").then(response => {
					if (response.code === 200 && response.data) {
						this.approvalTypeOption = response.data;
					}
				});
			},
			formatterTime(row, column) {
				return row.updateTime.substring(0, 10);
			},
			/** 查询-- 检测审批配置列表 */
			getList() {
				this.loading = true;
				listConfig(
					this.addDateRange(this.queryParams, this.dateRange)
				).then(response => {
					if (response.code === 200) {
						let data = response.data;
						this.configList = data.list;
						this.total = data.total;
					} else {
						console.info(response.msg);
					}
					this.loading = false;
				});
			},

			/** 搜索按钮操作 */
			handleQuery() {
				this.queryParams.pageNum = 1;
				this.getList();
			},
			/** 重置按钮操作 */
			resetQuery() {
				this.dateRange = [];
				this.resetForm("queryForm");
				this.queryParams.approvalTypeValue = null;
				this.handleQuery();
			},
			// 多选框选中数据
			handleSelectionChange(selection) {
				this.ids = selection.map(item => item.id);
				this.single = selection.length !== 1;
				this.multiple = !selection.length;
			},
			/** 新增按钮操作 */
			handleAdd() {
				this.approvalTypeVisible = true;
				this.$refs.addApprovalType.initApprovalType("");
			},
			/** 修改按钮操作 */
			handleUpdate(row) {
				if (!row) return;
				this.$refs.addApprovalType.initApprovalType(row.approvalTypeValue);
				this.approvalTypeVisible = true;
			},

			/** 删除按钮操作 */
			handleDelete(row) {
				const ids = row.id || this.ids;
				this.$confirm(
					'是否确认删除-- 检测审批配置编号为"' + ids + '"的数据项?',
					"警告",
					{
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					}
				)
					.then(function () {
						return delConfig(ids);
					})
					.then(() => {
						this.getList();
						this.$message.success("删除成功");
					});
			},
			/** 导出按钮操作 */
			handleExport() {
				const queryParams = this.queryParams;
				this.$confirm("是否确认导出所有-- 检测审批配置数据项?", "警告", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(function () {
						return exportConfig(queryParams);
					})
					.then(response => {
						this.download(response.msg);
					});
			}
		}
	};
</script>

<style lang="less" scoped>
	.el-row-toolbar {
		margin: 5px;
	}
</style>
