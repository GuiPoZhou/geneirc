<!-- 打印模板管理 -->
<template>
	<div class="kevincontainer" :style="{ height: $mainStore.state.boshland.boContainerHeight + 'px' }">
		<!-- 左侧模板分类 -->

		<div class="k_c_left">
			<el-menu :default-active="category[0] ? String(category[0].dictCode) : ''" @select="selectMenu">
				<el-menu-item v-for="item in category" :key="item.dictCode" :index="String(item.dictCode)"
					style="text-align:center">
					{{ item.dictLabel }}
				</el-menu-item>
			</el-menu>

		</div>
		<div class="k_c_right">
			<!-- 查询 -->
			<section class="container a-m-c-right">
				<div class="a-m-c-l-top" v-show="showSearch">
					<el-row :gutter="10">
						<el-col :span="48" :xs="24">
							<el-form :model="queryParams" ref="queryForm" :inline="true" class="formInline"
								v-show="showSearch">
								<div>
									<el-form-item label="模板名称" prop="templateName">
										<el-input v-model="queryParams.templateName" placeholder="请输入模板名称"
											@keyup.enter.native="handleQuery" @clear="handleQuery" clearable
											style="width: 240px;" size="small" />
									</el-form-item>
									<el-form-item label="模板状态" prop="status">
										<el-select v-model="queryParams.status" placeholder="模板状态" clearable
											@change="handleQuery" style="width: 240px;" size="small">
											<el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
												:value="item.value" />
										</el-select>
									</el-form-item>
									<div class="a-c-t-btnarea">
										<el-form-item>
											<el-button @click="handleQuery" type="primary" icon="el-icon-search"
												size="mini">搜索
											</el-button>
											<el-button @click="resetQuery" icon="el-icon-refresh" size="mini">重置
											</el-button>
										</el-form-item>
									</div>
								</div>
							</el-form>
						</el-col>
					</el-row>
				</div>
				<div class="a-m-c-l-bottom">
					<el-row :gutter="10" class="el-row-toolbar" style="margin-bottom: 10px;">
						<el-col :span="1.5">
							<el-button class="addRule" type="primary" icon="el-icon-plus" size="mini"
								@click="addChooseShow = true">新增
							</el-button>
						</el-col>
						
					</el-row>

					<el-table v-loading="loading" :data="dataList" row-key="id" border :height="innerHeight">
						<el-table-column prop="" label="序号" :show-overflow-tooltip="true" width="60">
							<template slot-scope="scope">
								<span v-text="scope.$index + 1"> </span>
							</template>
						</el-table-column>
						<el-table-column prop="templateName" label="模板名称" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column prop="prepareWay" label="编制方式" :show-overflow-tooltip="true">
							<template slot-scope="scope">{{
								scope.row.prepareWay == 1 ? 'PF' : '标签'
							}}
							</template>
						</el-table-column>
						<el-table-column prop="status" label="模板状态" align="center">
							<template slot-scope="scope">
								<el-switch v-model="scope.row.status" :active-value="false" :inactive-value="true"
									@change="handleStatusChange(scope.row)"></el-switch>
							</template>
						</el-table-column>
						<el-table-column prop="remarks" label="说明" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column prop="updateBy" label="编制人员" :show-overflow-tooltip="true"></el-table-column>
						<el-table-column prop="updateTime" label="编制时间" align="center"></el-table-column>
						<el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
							<template slot-scope="scope">
								<el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改
								</el-button>
								<el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除
								</el-button>
							</template>
						</el-table-column>
					</el-table>

					<div class="block">
						<pagination v-show="dataTotal > 0" :total="dataTotal" :page.sync="queryParams.pageNum"
							:limit.sync="queryParams.pageSize" @pagination="getDataList" />
					</div>
				</div>
			</section>
		</div>



		<!-- 新増选择方式 -->
		<el-dialog title="选择方式" :visible.sync="addChooseShow" :close-on-click-modal="false" :close-on-press-escape="false"
			width="400px" center>
			<el-form :inline="true">
				<el-row>
					<el-form-item label="编制方式" prop="prepareWay">
						<el-col :span="24">
							<el-select v-model="prepareWayOptionsSelect" size="small">
								<el-option v-for="item in prepareWayOptions" :key="item.value" :label="item.label"
									:value="item.value" />
							</el-select>
						</el-col>
					</el-form-item>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addChooseSubmit">确 定
				</el-button>
				<el-button @click="addChooseShow = false">取消</el-button>
			</div>
		</el-dialog>

		<!-- 添加或修改参数配置对话框 -->
		<templatePF ref="templatePF" />

		<templateLabel ref="templateLabel" />
	</div>
</template>

<script>
import templatePF from './pf/index'
import templateLabel from './label/index'
import {
	listData,
	updateDataStatus,
	delData,
	getData
} from '@/api/manageCenter/base/templateManage/template'
import { getBusinessCategoryTemplateList } from '@/api/manageCenter/baseConfig'

export default {
	name: 'templateManagement',
	components: { templatePF, templateLabel },
	data() {
		return {
			// 显示搜索条件
			showSearch: true,
			category: [],
			// 遮罩层
			loading: true,
			// 是否显示新増选择弹层
			addChooseShow: false,
			// 表格数据
			dataList: [],
			// 表格数据总条数
			dataTotal: 0,
			// 模板状态选项
			statusOptions: [
				{
					value: '',
					label: '所有类型'
				},
				{
					value: '0',
					label: '启用'
				},
				{
					value: '1',
					label: '停用'
				}
			],
			// 新増编制方式选项
			prepareWayOptions: [
				{
					value: '1',
					label: 'PF'
				},
				{
					value: '2',
					label: '标签'
				}
			],
			// 新増编制方式默认选项
			prepareWayOptionsSelect: '1',
			// 查询参数
			queryParams: {
				pageNum: 1,
				pageSize: 10,
				templateType: '',
				templateName: '',
				status: ''
			},
			innerHeight:0,
		}
	},
	// 创建方法，初始自动执行
	created() {
		this.e_getInnerHeight()
		document.addEventListener('resize',this.e_getInnerHeight)
		this.getMenuList()
	},
	methods: {
		e_getInnerHeight(){
			this.innerHeight = window.innerHeight -220
		},
		// 左顺业务类型加载
		getMenuList() {
			getBusinessCategoryTemplateList().then(res => {
				this.category = res.data
				this.queryParams.templateType = res.data[0].dictCode
				this.getDataList()
			})
		},
		// 左侧业务类型选择
		selectMenu(key) {
			this.queryParams.templateType = key
			this.getDataList()
		},

		// 搜索按钮操作
		handleQuery() {
			this.getDataList()
		},
		// 重置按钮操作
		resetQuery() {
			this.resetForm('queryForm')
			this.getDataList()
		},

		// 新増模板编制方式选择确定
		addChooseSubmit() {
			if (this.prepareWayOptionsSelect == 1) {
				// PF方式
				this.addChooseShow = false
				this.$refs.templatePF.show()
				this.$refs.templatePF.reset({
					templateType: this.queryParams.templateType,
					prepareWay: this.prepareWayOptionsSelect
				})
			} else if (this.prepareWayOptionsSelect == 2) {
				// 标签方式
				this.addChooseShow = false
				this.$refs.templateLabel.show()
				this.$refs.templateLabel.reset({
					templateType: this.queryParams.templateType,
					prepareWay: this.prepareWayOptionsSelect
				})
			}
		},

		/** 修改按钮操作 */
		handleUpdate(row) {
			getData(row.id).then(response => {
				if (row.prepareWay == 1) {
					// PF
					this.$refs.templatePF.show()
					this.$refs.templatePF.reset(response.data)
				} else if (row.prepareWay == 2) {
					// 标签
					this.$refs.templateLabel.show()
					this.$refs.templateLabel.reset(response.data)
				}
			})
		},
		/** 删除按钮操作 */
		handleDelete(row) {
			this.$confirm(
				'是否确认删除模板【' + row.templateName + '】?',
				'警告',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}
			)
				.then(function () {
					return delData(row.id)
				})
				.then(() => {
					this.getDataList()
					this.$message.success('删除成功')
				})
				.catch(function () {
				})
		},
		// 状态修改
		handleStatusChange(row) {
			let text = row.status ? '停用' : '启用'
			this.$confirm(
				'确认要 ' + text + ' 【' + row.templateName + '】吗?',
				'警告',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}
			)
				.then(function () {
					return updateDataStatus(row.id, row.status)
				})
				.then(() => {
					this.$message.success(text + '成功')
				})
				.catch(function () {
					row.status = row.status ? false : true
				})
		},

		/** 查询菜单列表 */
		getDataList() {
			this.loading = true
			listData(this.queryParams).then(response => {
				this.dataList = response.data.list
				this.dataTotal = response.data.total
				this.loading = false
			})
		}
	}
}
</script>

<style lang="less" scoped>
.kevincontainer {
	width: 100%;
	padding: 0.4rem;
	display: flex;
	flex-direction: row;
	align-items: center;
	overflow: hidden;
	justify-content: space-between;

	.k_c_left {
		width: 10%;
		height: 100%;
		background-color: #fff;
		overflow: auto;
	}

	.k_c_right {
		width: 90%;
		padding: 0.3rem;
		height: 100%;
		background-color: #ffff;
	}

}

.templateManagement {
	display: flex;

	.menu {
		width: 200px;
	}

	.container {
		flex: 1;

		.formInline {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 80px;
			padding: 0 30px;

			.el-form-item {
				margin-bottom: 0;
				margin-right: 20px;
			}
		}

		.addRule {
			margin-left: 5px;
		}
	}

	.el-row-toolbar {
		margin: 5px;
	}
}

/deep/ .rulesType {
	display: flex;
	align-items: center;

	p {
		width: 100px;
		margin-bottom: 0;
	}
}
</style>
