<template>
	<div class="app-container">
		<!-- 统一样式 - 查询区域 -->
		<div class="a-c-top" v-show="showSearch">
			<!-- 表单 -->
			<el-form
				:inline="true"
				:model="projectGroupParams"
				ref="projectGroupParams"
				class="demo-form-inline"
				label-width="100px"
				v-show="showSearch"
			>
				<el-form-item label="检测类别">
					<el-select filterable v-model="projectGroupParams.testCategory" size="small" style="width: 240px;" @change="handleChange">
						<el-option v-for="(item,index) in typeList"
								   :key="index"
								   :label="item.detectName"
								   :value="item.detectName"></el-option>
					</el-select>
<!--					<el-input-->
<!--						v-model="projectGroupParams.testCategory"-->
<!--						clearable-->
<!--						@focus="cateShow = true"-->
<!--						@clear="resetTestCategory"-->
<!--						size="small" style="width: 240px;"-->
<!--					>-->
<!--						<i-->
<!--							slot="suffix"-->
<!--							class="el-input__icon el-icon-search"-->
<!--							@click="cateShow = true"-->
<!--						></i>-->
<!--					</el-input>-->
				</el-form-item>
				<el-form-item label="分组名称">
					<el-input
						v-model="projectGroupParams.groupName"
						size="small" style="width: 240px;"
						@keyup.enter.native="onSubmit"
						@clear="onSubmit"
						clearable
					/>
				</el-form-item>
				<el-form-item label="分组编码">
					<el-input
							v-model="projectGroupParams.groupCode"
							size="small" style="width: 240px;"
							@keyup.enter.native="onSubmit"
							@clear="onSubmit"
							clearable
					/>
				</el-form-item>

				<!-- 统一样式 - 查询区域 按钮 -->
				<div class="a-c-t-btnarea">
					<el-form-item>
						<el-button
							type="primary"
							icon="el-icon-search"
							size="mini"
							@click="onSubmit"
							>搜索</el-button
						>
						<el-button
							icon="el-icon-refresh"
							size="mini"
							@click="resetForm"
							>重置</el-button
						>
					</el-form-item>
				</div>
			</el-form>
		</div>

		<!-- 统一样式 - 主列表区域 -->
		<div class="a-c-bottom">
			<!-- 按钮 -->
			<el-row :gutter="10" class="mb8">
				<el-col :span="1.5">
					<el-button
						type="primary"
						size="mini"
						@click="handleAddpro"
						icon="el-icon-plus"
						>新增
					</el-button>
				</el-col>
				<right-toolbar
					:showSearch.sync="showSearch"
					@queryTable="getTablelist"
				></right-toolbar>
			</el-row>

			<!-- 表格 -->
			<el-table v-loading="loading" :data="tableData" align="center" border>
				<el-table-column
					prop="id"
					type="index"
					label="序号"
					align="center"
					width="55px"
				/>
				<el-table-column prop="groupName" label="分组名称" align="center"/>
				<el-table-column prop="detectCategoryName" label="检测类别" align="center"/>
				<el-table-column prop="groupCode" label="分组编码" align="center"/>
				<el-table-column prop="itemCount" label="检测项目数量" align="center"/>
                <el-table-column prop="departmentShare" label="共享模式" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.departmentShare == 0">共享</span>
                        <span v-if="scope.row.departmentShare == 1">私有</span>
                        <span v-else-if="scope.row.departmentShare !=0 && scope.row.departmentShare != 1">部门共享</span>
                    </template>
                </el-table-column>

				<el-table-column
					prop="createBy"
					label="编制人员"
					width="100px"
					align="center"
				/>
				<el-table-column
					prop="createTime"
					label="编制时间"
					:show-overflow-tooltip="true"
					align="center"
				/>
				<el-table-column fixed="right" label="操作" align="center">
					<template slot-scope="scope">
						<el-button
							slot="reference"
							size="mini"
							type="text"
							icon="el-icon-info"
							@click="handleDetails(scope.row)"
							>详情
						</el-button>
						<el-button
							size="mini"
							icon="el-icon-edit"
							type="text"
							@click="handleEdit(scope.row)"
							>编辑
						</el-button>
						<el-button
							slot="reference"
							size="mini"
							type="text"
							icon="el-icon-delete"
							@click="handleDelete(scope.row)"
							>删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页 -->
			<pagination
				v-show="total > 0"
				:total="total"
				:page.sync="projectParams.pageNum"
				:limit.sync="projectParams.pageSize"
				@pagination="getTablelist"
			/>
		</div>

		<groupAdd v-if="addShow" @close="addShow = false" ref="groups" @reload="handleGroupAdd" />
		<groupDetails
			:detailsShow.sync="detailsShow"
			:detailsParams="detailsParams"
		/>
		<groupEdit
			:editShow.sync="editShow"
			:editParams="editParams"
			:editIds="edit_id"
			v-on:func="getTablelist"
		/>
		<selectDetectName
			:visible.sync="cateShow"
			@handleParentName="changeDetectName" :onlyShowLeaf="true"
		/>
	</div>
</template>
<script>
import "../../core/components_use";
import "ant-design-vue/dist/antd.css";
import groupAdd from "@/components/project/groupAdd";
import groupDetails from "@/components/project/groupDetails";
import groupEdit from "@/components/project/groupEdit";
import selectDetectName from "@/components/project/selectDetectName";
import {
	getProjectGroupList,
	datailsProjectGroupList,
	deleteProjectGroupList
} from "@/api/standardManagement/config";
import { getParentCheckList } from "@/api/standardManagement/config";
export default {
	name: "projectGroupManagement",
	components: {
		groupAdd,
		groupDetails,
		groupEdit,
		selectDetectName
	},
	data() {
		return {
			// 控制搜索栏显示隐藏
			showSearch: true,
			addShow: false,
			editShow: false,
			detailsShow: false,
			cateShow: false,
			centerDialogVisible: false,
			loading: true,
			//表单参数
			projectGroupParams: {
				testCategory: "",
				groupName: "",
				groupCode: "",
			},
			//查询参数
			projectParams: {
				detectCategory: "", //这是一个id
				groupName: "",
				pageNum: 1,
				pageSize: 10
			},
			total: 0,
			// 参数表格数据
			tableData: [],
			//详情数据
			detailsParams: {},
			//编辑数据
			editParams: {},
			//编辑的id
			edit_id: null,
			// 查询参数
			queryParams: {
				detectName: null,
			},
			onlyShowLeaf: true,
			typeList: []
		};
	},
	watch: {
		projectGroupParams: {
			handler(val) {
				if (!val.testCategory) {
					this.projectParams.detectCategory = "";
				}
			},
			deep: true
		}
	},
	methods: {
		handleChange (e) {
			let obj = this.typeList.find((item) => item.detectName == e)
			this.projectParams.detectCategory = obj.id
		},
		temp() {
			this.show = true;
		},
		//获取检测类别列表
		getTypelist() {
			this.queryParams.onlyShowLeaf = this.onlyShowLeaf;
			getParentCheckList(this.queryParams).then(response => {
				this.typeList = response.data;
			});
		},
		//查询按钮操作1
		onSubmit() {
			//将表单参数中的分组名称赋值给查询参数
			this.projectParams.groupName = this.projectGroupParams.groupName;
			this.projectParams.groupCode = this.projectGroupParams.groupCode;
			this.projectParams.testCategory = this.projectGroupParams.testCategory;
			this.projectParams.pageNum = 1;
			this.getTablelist();
		},
		resetTestCategory(){
			this.projectParams.detectCategory = "";
			this.onSubmit();
		},
		//重置按钮操作1
		resetForm() {
			this.projectGroupParams.testCategory = "";
			this.projectGroupParams.groupCode = "";
			this.projectGroupParams.groupName = "";
			this.projectParams.detectCategory = "";
			this.onSubmit();
		},
		//详情按钮操作1
		handleDetails(row) {
			console.log("详情按钮行数据的id==>", row.id);
			const DetailsId = row.id;
			datailsProjectGroupList(DetailsId).then(response => {
				console.log("详情数据===>", response.data);
				this.detailsParams = response.data;
				this.addShow = true;
				this.$nextTick(() => {
					this.$refs.groups.init(this.detailsParams, 'detail')
				})
			});
		},
		//编辑按钮操作1
		handleEdit(row) {
			this.edit_id = row.id;
			const EditId = row.id;
			datailsProjectGroupList(EditId).then(response => {
				this.editParams = response.data;
                //此处处理是因为 后台在存储这个共享模式的时候，除了1和0  3部门共享会存储当前id
                (this.editParams.departmentShare != 0 && this.editParams.departmentShare != 1) ? this.editParams.departmentShare = 3 :''
				this.$store.commit(
					"set_detectCategory",
					this.editParams.detectCategory
				);
				this.addShow = true;
				this.$nextTick(() => {
					this.$refs.groups.init(this.editParams, 'edit')
				})
			});
		},
		// 新增回调
		handleGroupAdd(){
			this.addShow = false
			this.getTablelist()
		},
		handleAddpro () {
			this.addShow = true;
			this.$nextTick(() => {
				this.$refs.groups.init('', 'add')
			})
		},
		//删除按钮操作1
		handleDelete(row) {
			console.log("项目分组删除按钮行数据==>", row);
			const groupName = row.groupName;
			const id = row.id;
			this.$confirm('确定要删除"' + groupName + '"分组？', "警告", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			})
				.then(function() {
					return deleteProjectGroupList(id);
				})
				.then(() => {
					this.getTablelist();
					this.$message.success("删除成功");
				})
				.catch(function() {});
		},
		//新增1
		handleAdd() {
			this.visible = true;
		},
		//val是子组件传递过来的数据1
		changeDetectName(val) {
			console.log("子组件传递过来的数据==>", val);
			this.projectGroupParams.testCategory = val.selectDetectName;
			this.projectParams.detectCategory = val.id;
		},
		//获取项目分组列表1
		getTablelist() {
			getProjectGroupList(this.projectParams).then(response => {
				console.log("项目分组列表的数据", response.data);
				this.tableData = response.data.list;
				this.total = response.data.total;
				this.loading = false;
			});
		}
	},
	created() {
		this.$store.commit("set_projecttype", "common");
		this.getTablelist();
		this.getTypelist();
	}
};
</script>
<style lang="less">
.projectGroupManagement {
	margin-top: 20px;
	margin-left: 30px;
}

.searchDetectName {
	display: flex;
}
</style>
