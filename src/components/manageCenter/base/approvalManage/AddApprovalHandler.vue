<template>
	<div>
		<!-- 添加或修改-- 检测审批配置对话框 -->
		<el-dialog title="选择人员" center :visible.sync="selectHandlerVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="800px"
				   append-to-body @close="cancelSelect()">
			<el-button-group>
				<el-button size="medium" type="primary" @click="clickByUser()">按人员</el-button>
				<el-button size="medium" type="primary" @click="clickByRole()">按角色</el-button>
			</el-button-group>

			<el-form>
				<el-form-item>
					<el-table :data="roleList" v-show="roleTabVisible" class="div-margin-top" @selection-change="handleSelectionChange">
						<el-table-column type="selection" align="center" width="50px"/>
						<el-table-column label="序号" type="index" width="55px" align="center"/>
						<el-table-column label="角色名称" align="center" prop="roleName"/>
					</el-table>
				</el-form-item>
			</el-form>

			<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="userTabVisible" style="margin-top: 20px">
				<el-form-item label="人员名称" prop="tableName">
					<el-input v-model="queryParams.nickName" placeholder="请输入人员名称" clearable size="small" @keyup.enter.native="handleQuery"/>
				</el-form-item>

				<el-form-item label="人员部门" prop="tableName">
					<el-input v-model="queryParams.deptName" placeholder="请输入部门名称" clearable size="small" @keyup.enter.native="handleQuery"
							  @focus="deptShow = true" suffix-icon="el-icon-search"/>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
					<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
				</el-form-item>
			</el-form>

			<el-table :data="userList" v-show="userTabVisible" :row-key="getRowKeys" @selection-change="handleSelectionChange">
				<el-table-column type="selection" :reserve-selection="true" align="center" width="50px"/>
				<el-table-column label="序号" type="index" width="55px" align="center"/>
				<el-table-column label="人员姓名" align="center" prop="nickName"/>
				<el-table-column label="所属部门" align="center" prop="dept.deptName"/>
			</el-table>
			<pagination v-show="total > 0 && userTabVisible" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
						@pagination="getList"/>

			<el-form>
				<el-form-item>
					<div style="text-align: center" class="div-margin-top">
						<el-button type="primary" @click="comfirmSelect()">确认</el-button>
						<el-button @click="cancelSelect()">取消</el-button>
					</div>
				</el-form-item>
			</el-form>
		</el-dialog>

		<!-- 弹出框 -->
		<selectDept :visible.sync="deptShow" @backfill="backfillDept"/>
	</div>
</template>

<script>
	import {listUser} from '@/api/system/user'
	import {allRole} from '@/api/system/role'
	import selectDept from '@/components/common/selectDept'

	export default {
		components: {
			selectDept,
		},
		data() {
			return {
				selected: [],
				// 总条数
				total: 0,
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					nickName: '',
					deptName: '',
					deptId: undefined,
				},
				userTabVisible: true,
				roleTabVisible: false,

				userList: [],
				roleList: [],

				//存储表格多选时的id和name
				idArray: [],
				nameArray: [],

				//是否显示部门列表
				deptShow: false,
			}
		},
		props: {
			selectHandlerVisible: {
				type: Boolean,
				default: false,
			},
			nodeLevel2Child: {
				type: Number,
			},
		},
		methods: {
			//填充部门信息
			backfillDept(dept) {
				this.queryParams.deptId = dept.deptId
				this.queryParams.deptName = dept.deptName
			},
			handleSelectionChange(selection) {
				if (this.userTabVisible) {
					this.idArray = selection.map(item => item.userId);
					this.nameArray = selection.map(item => item.nickName)
				} else {
					this.idArray = selection.map(item => item.roleId);
					this.nameArray = selection.map(item => item.nickName)
				}
			},

			getRowKeys(row) {
				return row.userId
			},
			reset() {
				this.idArray = [];
				this.nameArray = []
			},
			//确认并组织所选数据
			comfirmSelect() {
				// alert('确定')
				let idStr = this.idArray.join(','); //所选人员/角色id
				let nameStr = this.nameArray.join(','); //所选人员/角色名称
				let nodeLevel = this.nodeLevel2Child; //节点步骤
				let nodeHanderType = this.userTabVisible ? 0 : 1; //节点处理人类型  0用户  1角色
				this.$emit('refrehData', [idStr, nameStr, nodeLevel, nodeHanderType])
			},
			cancelSelect() {
				this.$emit('refrehData')
			},
			/** 搜索按钮操作 */
			handleQuery() {
				this.queryParams.pageNum = 1;
				this.getUserList()
			},
			getUserList() {
				listUser(this.queryParams).then(response => {
					this.userList = response.rows;
					this.total = response.total
				})
			},
			getRoleList() {
				allRole().then(response => {
					this.roleList = response.data
				})
			},
			//根据选择类型不同调用不同接口
			getList() {
				this.reset(); //清空存储多选表格数据
				if (this.userTabVisible) {
					//用户接口
					this.getUserList()
				} else {
					//角色接口
					this.getRoleList()
				}
			},
			//切换选择方式
			clickByUser() {
				this.userTabVisible = true;
				this.roleTabVisible = false;
				this.getList()
			},
			clickByRole() {
				this.userTabVisible = false;
				this.roleTabVisible = true;
				this.getList()
			},
			/** 重置按钮操作 */
			resetQuery() {
				this.queryParams.deptId = null;
				this.queryParams.deptName = null;
				this.queryParams.nickName = null;
				this.handleQuery()
			},
		},
		computed: {},
		created() {
			this.getList()
		},
		mounted() {
		},
	}
</script>
<style lang="less">
	.div-margin-top {
		margin-top: 15px;
	}

	.infoView {
		ul,
		li {
			list-style: none;
			padding: 0;
		}
	}
</style>
