<template>
	<el-dialog title="选择部门" :visible.sync="visible" append-to-body width="600px"
						 center :close-on-press-escape="false" :close-on-click-modal="false" @close="close" >
		<el-form ref="queryForm" :model="queryParams" @submit.native.prevent :inline="true">
			<!-- 搜索栏 -->
			<el-form-item label="部门名称">
				<el-input
					@keyup.enter.native="handleQuery"
					v-model="queryParams.deptName"
					clearable
					size="small"
					placeholder="请输入选择部门名称">
				</el-input>

			</el-form-item>
			<el-form-item>
				<el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
			</el-form-item>
		</el-form>
		<!-- 表格 -->
		<div>
			<el-table height="500" :data="deptList" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
				<el-table-column type="index" prop="id" label="序号" width="55px"/>
				<el-table-column prop="label" label="部门名称" align="center"/>
<!--				<el-table-column prop="parentName" label="上级部门" align="center"/>-->
				<el-table-column fixed="right" label="操作">
					<template slot-scope="scope">
						<el-button @click="handleClick(scope.row)" type="primary" round size="mini">选择</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button @click="close">取消</el-button>
		</div>
	</el-dialog>
</template>
<script>
	import {getLastDeptList} from "@/api/system/dept"

	export default {
		data() {
			return {
				// 查询参数
				queryParams: {
					deptName: null,
					deptScope: null
				},
				//单位列表
				deptList: [],
			}
		},
		props: {
			visible: {
				type: Boolean,
				default: false,
			},
			deptScope:{
				type: Number,
				default: null,
			},
		},
		methods: {
			/** input框搜索操作 */
			// handleClose(){
			// 	this.$emit("update:visible", false);
			// },
			handleQuery() {
				this.getlist();
			},
			//获取部门列表
			getlist() {
				this.queryParams.deptScope = this.deptScope;
				this.$net('/system/dept/treeselect','get',this.queryParams).then(response => {
						if (response.code == 200) {
							this.deptList = response.data;
						} else {
							console.info(response.msg)
						}

					}
				);
			},
			//取消按钮操作
			close() {
				this.$emit("update:visible", false);
			},
			//选择按钮操作
			handleClick(row) {
				this.$emit('backfill', row)
				this.close()
			},

		},
		computed: {},
		created() {
			this.handleQuery();
		},
	}
</script>
