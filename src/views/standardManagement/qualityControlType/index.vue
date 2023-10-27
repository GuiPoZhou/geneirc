<template>
	<div class="app-container">

		<!-- 统一样式 - 查询区域 -->
		<div class="a-c-top" v-show="showSearch">

			<!-- 表单 -->
			<el-form :inline="true" :model="queryForm" ref="queryForm" class="demo-form-inline" v-show="showSearch"
					 label-width="100px">

				<el-form-item label="质控名称">
					<el-input v-model="queryForm.qcName" @keyup.enter.native="onSubmit" @clear="onSubmit" clearable size="small" style="width: 240px;"></el-input>
				</el-form-item>
				<el-form-item label="质控类型">
					<el-select v-model="queryForm.qcTypeName"
							   @change="changeQCType"
							   @clear="onSubmit"
							   filterable
							   clearable size="small"
							   style="width: 240px;">
						<el-option v-for="item in typeList"
							:label="item.dictLabel"
								   :value="item.dictLabel"
								   :key="item.dictCode"
						/>
					</el-select>
				</el-form-item>

				<!-- 统一样式 - 查询区域 按钮 -->
				<div class="a-c-t-btnarea">
					<el-form-item>
						<el-button type="primary" icon="el-icon-search" size="mini" @click="onSubmit">搜索</el-button>
						<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
					</el-form-item>
				</div>

			</el-form>

		</div>

		<!-- 统一样式 - 主列表区域 -->
		<div class="a-c-bottom">
<!--			<el-button size="small" type="primary" @click="add">新增</el-button>-->
<!--			<el-button size="small" type="danger" :disabled="selection.length === 0" @click="handleDelete">删除</el-button>-->
			<!--显示搜索条件和刷新table-->
			<el-row :gutter="10" class="mb8">
				<right-toolbar :showSearch.sync="showSearch" @queryTable="getTablelist"></right-toolbar>
			</el-row>

			<!-- 表格 -->
			<el-table :data="tableData"
					   stripe
					  @selection-change="handleSelectionChange"
			>
<!--				<el-table-column type="selection" align="center"></el-table-column>-->
				<el-table-column type="index" align="center" prop="id" label="序号" width="55px"/>
				<el-table-column prop="qcName" align="center" label="质控名称" :show-overflow-tooltip="true"/>
				<el-table-column prop="qcTypeName" align="center" label="质控类型"/>
				<el-table-column prop="remark" align="center" label="备注" :show-overflow-tooltip="true" />
				<el-table-column prop="status" align="center" label="状态" >
					<template slot-scope="scope">
						<el-switch active-color="#5B7BFA" inactive-color="#dadde5" v-model="scope.row.status" :active-value="0"
								   :inactive-value="1"
								   @change="changeStatus($event,  scope.row)"></el-switch>
					</template>
				</el-table-column>

				<el-table-column align="center" fixed="right" label="操作">
					<template slot-scope="scope">
						<el-button size="mini" icon="el-icon-edit" type="text"  @click="handleEdit(scope.row)">编辑
						</el-button>
<!--						<el-button size="mini" icon="el-icon-delete" type="text" @click="handleDelete(scope.row)">删除</el-button>-->
					</template>
				</el-table-column>
			</el-table>
			<pagination v-show="total > 0" :total="total" :page.sync="queryForm.pageNumber" :limit.sync="queryForm.pageSize" @pagination="changePage"/>

		</div>
		<editQuality
			:typeList="typeList"
			v-if="showEdit"
			ref="editQuality"
			@close="closeData"
		/>
	</div>
</template>

<script>
import editQuality from "./dialog/editQuality";
export default {
	name: "index",
	data() {
		return {
			showSearch: true,
			showEdit: false,
			tableData:[],
			typeList:[],
			total:0,
			queryForm: {
				qcName: null,
				qcTypeName: null,
				pageSize: 10,
				pageNum: 1,
			},
			selection:[],
		}
	},
	components: {editQuality},
	created() {
		this.getDicts('quality_control_type').then(res => {
			if (res.code === 200) {
				this.typeList = res.data
			}
		})
	},
	mounted() {
		this.getTablelist()
	},
	methods: {
		changePage(e) {
			this.queryForm.pageNum = e.page
			this.queryForm.pageSize = e.limit
			this.getTablelist()
		},
		changeQCType(e) {
			this.queryForm.qcType  = this.typeList.filter(item => item.dictLabel === e)[0].dictCode
		},
		handleSelectionChange(e) {
			this.selection = e
		},
		getTablelist() {
			this.$net('/v1/quality/control/list','get',this.queryForm).then(res => {
				if (res.code === 200) {
					this.tableData = res.data.list
					this.total = res.data.total
				}
			})
		},
		resetQuery() {
      this.queryForm.qcType = ''
      this.queryForm.qcTypeName = null
			this.$refs.queryForm.resetFields()
			this.getTablelist()
		},
		changeStatus(e,{id}) {
			this.$net('/v1/quality/control/addOrUpdate','post',{id,status:e}).then(res => {
				if (res.code === 200) {
					this.$message.success(res.msg)
          this.microStore.dispatch('get_QCTypeList')
				}
			})
		},
		onSubmit() {
			this.getTablelist()
		},
		closeData() {
			this.showEdit = false
			this.getTablelist()
		},
		async handleEdit({id}) {
			let obj = await this.getDetail(id)
			this.showEdit = true
			this.$nextTick(() => {
				this.$refs.editQuality.init('edit',obj)
			})
		},
		handleDelete({id}) {

			this.$confirm('是否确认删除所选数据？', "警告", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).then(()=>{
				if (id) {
					this.$net('/v1/quality/control/del/'+ id,'delete').then(res => {
						if (res.code === 200) {
							this.$message.success(res.msg)
							this.getTablelist()
						}
					})
				}else {
					const ids = this.selection.map(item => item.id).join(',')
					this.$net('/v1/quality/control/del/' + ids,'delete').then(res => {
						if (res.code === 200) {
							this.$message.success(res.msg)
							this.getTablelist()
						}
					})
				}

			}).catch(() =>{

			});
		},
		async getDetail(id) {
			return await this.$net('/v1/quality/control/byId/' + id,'get').then(res => {
				if (res.code === 200) {
					return res.data
				}
			})
		},
		add() {
			this.showEdit = true
			this.$nextTick(() => {
				this.$refs.editQuality.init('add')
			})
		},
	},
}
</script>

<style scoped>

</style>
