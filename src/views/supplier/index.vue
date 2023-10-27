<template>
	<div class="app-container">
		<!-- 统一样式 - 查询区域 -->
		<div class="a-c-top" v-show="showSearch">
			<!-- 表单 -->
			<el-form :inline="true" :model="supplierParams" ref="supplierParams" v-show="showSearch"
				class="demo-form-inline" label-width="100px">
				<el-form-item label="供应商名称">
					<a-input v-model="supplierParams.supplierName" style="width: 200px" />
				</el-form-item>
				<el-form-item label="联系人">
					<a-input v-model="supplierParams.contacts" style="width: 200px" />
				</el-form-item>
				<!-- 统一样式 - 查询区域 按钮 -->
				<div class="a-c-t-btnarea">
					<el-form-item>
						<el-button type="cyan" icon="el-icon-search" size="mini" @click="onSubmit">搜索</el-button>
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
					<el-button type="primary" icon="el-icon-plus" size="mini" @click="e_add">
						新增
					</el-button>
				</el-col>
				<right-toolbar :showSearch.sync="showSearch" @queryTable="resetForm" @fullScreen="e_fullScreen"
					@changeBox="e_changeBox" :boxData="colData"></right-toolbar>
				<!--			<right-toolbar :showSearch.sync="showSearch" @queryTable="getTablelist"></right-toolbar>-->
			</el-row>
			<!-- 表格 -->
			<el-table v-loading="loading" :data="tableData" align="center" stripe border>
				<el-table-column prop="id" type="index" label="序号" width="55px" />
				<el-table-column prop="supplierName" label="供应商名称" :show-overflow-tooltip="true" v-if="colData[0].istrue" />
				<!--			  <el-table-column prop="creditCode" label="统一社会信用代码" />-->
				<el-table-column prop="address" label="供应商地址" :show-overflow-tooltip="true" v-if="colData[1].istrue" />
				<el-table-column prop="contacts" label="联系人" v-if="colData[2].istrue" />
				<el-table-column prop="contactsPhone" label="联系电话" v-if="colData[3].istrue" />
				<!--			  <el-table-column prop="openBank" label="开户行" :show-overflow-tooltip="true" />-->
				<!--			  <el-table-column prop="account" label="账号" />-->
				<el-table-column fixed="right" label="操作" width="300%">
					<template slot-scope="scope">
						<el-button size="mini" type="text" icon="el-icon-info" @click="viewHandle(scope.row)">
							详情
						</el-button>
						<el-button size="mini" type="text" icon="el-icon-edit" @click="editHandle(scope.row)">
							编辑
						</el-button>
						<el-button size="mini" type="text" icon="el-icon-delete" @click="deleteHandle(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页 -->
			<pagination v-show="total > 0" :total="total" :page.sync="supplierParams.pageNum"
				:limit.sync="supplierParams.pageSize" @pagination="getTablelist" />
		</div>
		<infoAdd ref="infoAdd" v-if="showInfoAdd" v-on:func="getTablelist" @close="showInfoAdd=false"/>
		<infoEdit v-if="editShow" ref="infoEdit" :editParams="editParams" @func="getTablelist" @close="editShow=false"/>
		<infoView ref="infoView" :viewParams="viewParams" v-if="showinfoView" @func="getTablelist" @close="showinfoView=false"/>
	</div>
</template>

<script>
import '../core/components_use'
import 'ant-design-vue/dist/antd.css'
import infoAdd from '@/components/resources/supplier/add'
import infoEdit from '@/components/resources/supplier/edit'
import infoView from '@/components/resources/supplier/details'
import { getSupplierList, deleteApi, getCheck } from '@/api/resources/supplier/supplier'

export default {
	name: 'supplierManage',
	components: {
		infoAdd,
		infoEdit,
		infoView
	},
	data() {
		return {
			showinfoView:false,
			showInfoAdd: false,
			editShow: false,
			viewShow: false,
			loading: true,
			// 显示搜索条件
			showSearch: true,
			//表单参数
			supplierParams: {
				pageSize: 10,
				pageNum: 1,
				supplierName: '',
				contacts: ''
			},
			total: 10,
			// 参数表格数据
			tableData: [],
			//编辑表单的数据
			editParams: {},
			//查看表单的数据
			viewParams: {},
			colData: [
				{ title: "供应商名称", istrue: true },
				{ title: "供应商地址", istrue: true },
				{ title: "联系人", istrue: true },
				{ title: "联系电话", istrue: true },
			]
		}
	},
	methods: {
		e_add() {
			this.showInfoAdd = true
			this.$nextTick(() => {
				this.$refs.infoAdd.init()
			})
		},
		e_fullScreen() {
			this.fullscreen = !this.fullscreen;
		},
		e_changeBox(list) {
			let arrList = this.colData.filter(i => !list.includes(i.title));
			let titleList = arrList.map(item => {
				return item.title;
			});
			this.colData.filter(i => {
				if (titleList.indexOf(i.title) != -1) {
					i.istrue = false;
				} else {
					i.istrue = true;
				}
			});
		},
		temp() {
			this.show = true
		},
		//查询按钮操作
		onSubmit() {
			//将表单参数中的分组名称赋值给查询参数
			getSupplierList(this.supplierParams).then((response) => {
				this.tableData = response.data.list
				this.total = response.data.total
				this.loading = false
			})
		},
		//重置按钮操作
		resetForm() {
			this.supplierParams.supplierName = ''
			this.supplierParams.contacts = ''
			this.getTablelist()
		},
		//获取单元信息管理列表
		getTablelist() {
			this.showInfoAdd = false
			this.editShow = false
			this.showinfoView = false
			getSupplierList(this.supplierParams).then((response) => {
				this.tableData = response.data.list
				this.total = response.data.total
				this.loading = false
			})
		},

		//删除按钮操作
		deleteHandle(row) {
			const supplierName = row.supplierName
			const id = row.id
			this.$confirm('确定要删除吗？', '警告', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(function () {
					return deleteApi(id)
				})
				.then(() => {
					this.getTablelist()
					this.$message.success('删除成功')
				})
				.catch(function () {
				})
		},
		//新增
		addHandle() {
			this.visible = true
			this.modalTitle = '添加'
		},
		//编辑按钮操作
		editHandle(row) {
			const id = row.id
			this.editShow = true
			getCheck(id).then(response => {
				this.$nextTick(() => {
					this.$refs.infoEdit.init(response.data)
				})
				this.editParams = response.data
			}
			)
		},
		//查看按钮操作
		viewHandle(row) {
			const id = row.id
			this.showinfoView=true
			getCheck(id).then(response => {
				this.$nextTick(() => {
					this.$refs.infoView.init(response.data)
				})
				this.viewParams = response.data
			}
			)
		}
	},
	created() {
		this.getTablelist()
	}
}
</script>
<style lang="less">
.supplierManage {
	margin-top: 20px;
	margin-left: 30px;
}

.searchDetectName {
	display: flex;
}
</style>
