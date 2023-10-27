<template>
	<div class="app-container">
		<!-- 统一样式 - 查询区域 -->
		<div class="a-c-top" v-show="showSearch">
			<!-- 表单 -->
			<el-form :inline="true" :model="deptInfoParams" ref="deptInfoParams" class="demo-form-inline"
					 label-width="100px" @submit.native.prevent>
				<el-form-item label="单位名称">
					<el-input v-model="deptInfoParams.deptName" style="width: 240px" size="small" @keyup.enter.native="onSubmit" @clear="onSubmit" clearable/>
				</el-form-item>

				<!-- 统一样式 - 查询区域 按钮 -->
				<div class="a-c-t-btnarea">
					<el-form-item>
						<el-button type="primary" icon="el-icon-search" size="mini" @click="onSubmit" >搜索</el-button>
						<el-button icon="el-icon-refresh" size="mini" @click="resetForm">重置</el-button>
					</el-form-item>
				</div>
			</el-form>
		</div>

		<!-- 统一样式 - 主列表区域 -->
		<div class="a-c-bottom">
			<!-- 按钮 -->
			<el-row :gutter="10" class="mb8">
				<el-col :span="1.5">
					<el-button type="primary" icon="el-icon-plus" size="mini" @click="addShow = true">
						新增
					</el-button>
				</el-col>
				<right-toolbar :showSearch.sync="showSearch" @queryTable="getTablelist"></right-toolbar>
			</el-row>

			<!-- 表格 -->
			<el-table v-loading="loading" :data="tableData" align="center">
				<el-table-column prop="id" type="index" label="序号" width="55px" />
				<el-table-column prop="deptName" label="单位名称" :show-overflow-tooltip="true"  align="center"/>
				<el-table-column prop="creditCode" label="统一社会信用代码"  align="center"/>
				<el-table-column prop="address" label="单位地址" :show-overflow-tooltip="true" align="center"/>
				<el-table-column prop="contacts" label="联系人"  align="center"/>
				<el-table-column prop="contactsPhone" label="联系电话"  align="center"/>
				<el-table-column prop="createBy" label="编制人员" width="100px" align="center"/>
				<el-table-column prop="createTime" label="编制时间"  :show-overflow-tooltip="true"  align="center"/>
				<el-table-column fixed="right" label="操作" width="300%" align="center">
					<template slot-scope="scope">
						<el-button size="mini" type="text" icon="el-icon-info" @click="viewHandle(scope.row)">
							详情
						</el-button>
						<el-button size="mini" type="text" icon="el-icon-edit" @click="editHandle(scope.row)">
							编辑
						</el-button>
						<el-button size="mini" type="text" icon="el-icon-delete" @click="deleteHandle(scope.row)" >
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页 -->
			<pagination v-show="total > 0" :total="total" :page.sync="deptInfoParams.pageNum" :limit.sync="deptInfoParams.pageSize" @pagination="getTablelist"/>
		</div>
		<infoAdd :addShow.sync="addShow" v-on:func="getTablelist" />
		<infoEdit :editShow.sync="editShow" :editParams="editParams" @func="getTablelist"/>
		<infoView :viewShow.sync="viewShow" :viewParams="viewParams" @func="getTablelist"/>
	</div>
</template>

<script>
import "../../core/components_use";
import "ant-design-vue/dist/antd.css";
import infoAdd from "@/components/resources/deptInfo/add";
import infoEdit from "@/components/resources/deptInfo/edit";
import infoView from "@/components/resources/deptInfo/details";
import {
	getDeptInfoList,
	deleteApi,
	getCheck
} from "@/api/resources/deptInfo/deptInfo";
export default {
	name: "deptInfoManage",
	components: {
		infoAdd,
		infoEdit,
		infoView
	},
	data() {
		return {
			addShow: false,
			editShow: false,
			viewShow: false,
			loading: true,
			// 显示搜索条件
			showSearch: true,
			//表单参数
			deptInfoParams: {
				pageSize: 10,
				pageNum: 1,
				deptName: ""
			},
			total: 2,
			// 参数表格数据
			tableData: [],
			//编辑表单的数据
			editParams: {},
			//查看表单的数据
			viewParams: {}
		};
	},
	methods: {
		temp() {
			this.show = true;
		},
		//查询按钮操作
		onSubmit() {
			//将表单参数中的分组名称赋值给查询参数
			getDeptInfoList(this.deptInfoParams).then(response => {
				this.tableData = response.data.list;
				this.total = response.data.total;
				this.loading = false;
			});

		},
		//重置按钮操作
		resetForm() {
			this.deptInfoParams.deptName = "";
			this.getTablelist();
		},
		//获取单元信息管理列表
		getTablelist() {
			getDeptInfoList(this.deptInfoParams).then(response => {
				this.tableData = response.data.list;
				this.total = response.data.total;
				this.loading = false;
			});
		},
		// 切换每页显示的数量
		handleSizeChange(size) {
			if (this.pagination) {
				this.tableCurrentPagination.startPage = 1;
				this.tableCurrentPagination.pageSize = size;
				if (typeof this.getTablelist === "function") {
					this.getTablelist();
				} else if (typeof this.$parent.getTablelist === "function") {
					this.$parent.getTablelist();
				} else if (
					typeof this.$parent.$parent.getTablelist === "function"
				) {
					this.$parent.$parent.getTablelist();
				}
			}
		},
		//跳转
		handleCurrentChange(val) {
			if (this.pagination) {
				this.tableCurrentPagination.startPage = val;
				if (typeof this.getTablelist === "function") {
					this.getTablelist();
				} else if (typeof this.$parent.getTablelist === "function") {
					this.$parent.getTablelist();
				} else if (
					typeof this.$parent.$parent.getTablelist === "function"
				) {
					this.$parent.$parent.getTablelist();
				}
			}
		},
		// 下一页
		handleNextClick(val) {
			if (this.pagination) {
				this.tableCurrentPagination.startPage = val;
				if (typeof this.getTablelist === "function") {
					this.getTablelist();
				} else if (typeof this.$parent.getTablelist === "function") {
					this.$parent.getTablelist();
				} else if (
					typeof this.$parent.$parent.getTablelist === "function"
				) {
					this.$parent.$parent.getTablelist();
				}
			}
		},
		// 上一页
		handlePreClick(val) {
			if (this.pagination) {
				this.tableCurrentPagination.startPage = val;
				if (typeof this.getTablelist === "function") {
					this.getTablelist();
				} else if (typeof this.$parent.getTablelist === "function") {
					this.$parent.getTablelist();
				} else if (
					typeof this.$parent.$parent.getTablelist === "function"
				) {
					this.$parent.$parent.getTablelist();
				}
			}
		},
		//删除按钮操作
		deleteHandle(row) {
			const deptName = row.deptName;
			const id = row.id;
			this.$confirm("确定要删除吗？", "警告", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			})
				.then(function() {
					return deleteApi(id);
				})
				.then(() => {
					this.getTablelist();
					this.$message.success("删除成功");
				})
				.catch(function() {});
		},
		//新增
		handleAdd() {
			this.visible = true;
			this.modalTitle = "添加";
		},
		//编辑按钮操作
		editHandle(row) {
			const id = row.id;
			this.editShow = true;
			getCheck(id).then(response => {
				this.editParams = response.data;
			});
		},
		//查看按钮操作
		viewHandle(row) {
			const id = row.id;
			this.viewShow = true;
			getCheck(id).then(response => {
				this.viewParams = response.data;
			});
		}
	},
	created() {
		this.getTablelist();
	}
};
</script>
<style lang="less">

.searchDetectName {
	display: flex;
}
</style>
