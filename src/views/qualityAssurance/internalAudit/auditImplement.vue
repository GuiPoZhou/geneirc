<template>
	<div class="app-container">
		<!-- 统一样式 - 查询区域 -->
		<div class="a-c-top" v-show="showSearch">
			<!-- 表单 -->
			<el-form
				:inline="true"
				:model="queryParams"
				ref="queryParams"
				class="demo-form-inline"
				v-show="showSearch"
			>
				<el-form-item label="年度" prop="year">
					<el-input
						v-model="queryParams.year"
						placeholder="请输入年度"
						clearable
						class="input-with-select"
						style="width: 240px"
					/>

				</el-form-item>
				<el-form-item label="内审计划编号" prop="serial">
					<el-input
						v-model="queryParams.serial"
						placeholder="请输入内审计划编号"
						clearable
						class="input-with-select"
						style="width: 240px"
					/>
				</el-form-item>
				<!-- 统一样式 - 查询区域 按钮 -->
				<div class="a-c-t-btnarea">
					<el-form-item>
						<el-button
							type="cyan"
							icon="el-icon-search"
							size="mini"
							@click="handleQuery"
						>查询
						</el-button>
						<el-button
							icon="el-icon-refresh"
							size="mini"
							@click="resetQuery('filesForm')"
						>重置
						</el-button>
					</el-form-item>
				</div>
			</el-form>
		</div>
		<!-- 主列表区域 -->
		<div class="a-c-bottom" :class="fullscreen == true ? 'showFullScreen' : ''">
			<el-row :gutter="10" class="mb8">
				<right-toolbar
					:showSearch.sync="showSearch"
					@queryTable="resetQuery"
					@fullScreen="e_fullScreen"
					@changeBox="e_changeBox"
					:boxData="colData"
				></right-toolbar>
			</el-row>
			<!-- 列表区域 -->
			<el-table
				ref="multipleTable"
				:data="tableData"
				stripe
				border
				@sort-change="sortChange"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" width="55"/>
				<el-table-column label="序号" align="center" type="index" width="50"/>
				<el-table-column
					prop="serial"
					label="内审计划编号"
					sortable="custom"
					show-overflow-tooltip
					v-if="colData[0].istrue"
				/>
				<el-table-column
					prop="year"
					label="年度"
					sortable="custom"
					show-overflow-tooltip
					v-if="colData[1].istrue"
				/>
				<el-table-column
					prop="purpose"
					label="内审目的"
					sortable="custom"
					show-overflow-tooltip
					v-if="colData[2].istrue"
				/>
				<el-table-column
					prop="internalAuditScope"
					label="内审范围"
					sortable="custom"
					show-overflow-tooltip
					v-if="colData[3].istrue"
				/>
				<el-table-column
					prop="method"
					label="审核办法"
					sortable="custom"
					show-overflow-tooltip
					v-if="colData[4].istrue"
				>
					<template slot-scope="scope">
						<span v-if="scope.row.method === 1">抽样</span>
						<span v-if="scope.row.method === 2">现场</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="progress"
					label="当前进度"
					sortable="custom"
					show-overflow-tooltip
					v-if="colData[5].istrue"
				>
					<template slot-scope="scope" style="color: blue">
						<span v-if="scope.row.progress === 1">内审通知</span>
						<span v-if="scope.row.progress === 2">首次会议</span>
						<span v-if="scope.row.progress === 3">现场记录审核</span>
						<span v-if="scope.row.progress === 4">不符合记录</span>
						<span v-if="scope.row.progress === 5">不符合项跟踪验证</span>
						<span v-if="scope.row.progress === 6">末次会议</span>
						<span v-if="scope.row.progress === 7">内审报告</span>
						<span v-if="scope.row.progress === 8">完成</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="handleLook(scope.row)">查看
						</el-button>
						<el-button size="mini" type="text" @click="e_edit(scope.row)">实施
						</el-button>
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
		<!--实施/查看-->
		<createImplement
			v-if="showimple"
			ref="imple"
			@close="creat"
		></createImplement>
	</div>
</template>

<script>
import createImplement from "./dialog/createImplement";
import {implelist, auditstatus} from "@/api/mass/config";

export default {
	name: "auditImplement",
	components: {createImplement},
	data() {
		return {
			showSearch: true,
			fullscreen: false,
			queryParams: {
				pageNum: 1,
				pageSize: 10,
				id: "",
				serial: "",
				year: ""
			},
			dialogShow: false,
			total: 0,
			colData: [
				{title: "内审计划编号", istrue: true},
				{title: "年度", istrue: true},
				{title: "内审目的", istrue: true},
				{title: "内审范围", istrue: true},
				{title: "审核办法", istrue: true},
				{title: "当前进度", istrue: true},
			],
			tableData: [],
			showimple: false,
			spotCheckRecordParams: "",
		};
	},
	mounted() {
		this.getList();
	},
	methods: {
		/** 重置按钮操作 */
		resetQuery() {
			this.queryParams.serial = "";
			this.queryParams.year = "";
			this.resetForm("queryParams");
			this.handleQuery();
		},
		creat(val) {
			this.showimple = false
			console.log(val)
			if (val) {
				this.getList()
			}
		},
		/** 搜索按钮操作 */
		handleQuery() {
			this.queryParams.pageNum = 1;
			this.getList();
		},
		e_fullScreen() {
			this.fullscreen = !this.fullscreen;
		},
		e_changeBox(list) {
			let arrList = this.colData.filter((i) => !list.includes(i.title));
			let titleList = arrList.map((item) => {
				return item.title;
			});
			this.colData.filter((i) => {
				if (titleList.indexOf(i.title) != -1) {
					i.istrue = false;
				} else {
					i.istrue = true;
				}
			});
		},
		// 排序
		sortChange(column, prop, order) {
			this.queryParams.orderByColumn = this.toLine(column.prop);
			if (column.order === "descending") {
				this.queryParams.orderByType = "DESC";
			} else if (column.order === "ascending") {
				this.queryParams.orderByType = "ASC";
			} else {
				this.queryParams.orderByType = "";
			}
			this.getList();
		},
		toLine(name) {
			return name.replace(/([A-Z])/g, "_$1").toLowerCase();
		},
		// 多选框选中数据
		handleSelectionChange(selection) {
			this.ids = selection.map((item) => item.id);
		},
		// 实施
		e_edit(row) {
			console.log(row);
			this.showimple = true;
			this.$nextTick(() => {
				this.$refs.imple.init("add", row);
			});
		},
		// 查看
		handleLook(row) {
			this.showimple = true;
			this.$nextTick(() => {
				this.$refs.imple.init("show", row);
			});
		},
		// 显示列表数据
		getList() {
			implelist(this.queryParams).then((res) => {
				this.tableData = res.data.list;
				this.total = res.data.total;
			});
		},
	},
};
</script>

<style scoped>
</style>
