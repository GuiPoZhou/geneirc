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
				label-width="50px"
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
				<el-form-item label="状态" prop="status">
					<el-select
						v-model="queryParams.status"
						clearable
						placeholder="请选择"
					>
						<el-option label="待提交" :value="1"></el-option>
						<el-option label="审批中" :value="2"></el-option>
						<el-option label="已批准" :value="3"></el-option>
						<el-option label="已退回" :value="4"></el-option>
					</el-select>
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
				<el-col :span="1.5">
					<el-button type="primary" @click="handleAdd">添加</el-button>
					<el-button
						type="success"
						@click="handlePrint"
						:disabled="ids.length != 1"
					>打印
					</el-button
					>
					<el-button type="warning" @click="handleExport">导出</el-button>
				</el-col>
				<el-col :span="1.5"></el-col>
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
				@selection-change="handleSelectionChange"
				@sort-change="sortChange"
			>
				<el-table-column type="selection" width="55"/>
				<el-table-column label="序号" align="center" type="index" width="50"/>
				<el-table-column
					prop="serial"
					label="计划编号"
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
					prop="planPersonNames"
					label="参加评审部门及人员"
					sortable="custom"
					show-overflow-tooltip
					v-if="colData[2].istrue"
				/>
				<el-table-column
					prop="reviewTime"
					label="评审时间安排"
					sortable="custom"
					show-overflow-tooltip
					v-if="colData[3].istrue"
				/>
				<el-table-column
					prop="location"
					label="评审地点"
					sortable="custom"
					show-overflow-tooltip
					v-if="colData[4].istrue"
				/>
				<el-table-column
					prop="progress"
					label="状态"
					sortable="custom"
					show-overflow-tooltip
					v-if="colData[5].istrue"
				>
					<template slot-scope="scope">
            <span v-if="scope.row.status === 1" style="color: #1cd0bd"
			>待提交</span
			>
						<span v-if="scope.row.status === 2" style="color: #f5bb4a"
						>审批中</span
						>
						<span v-if="scope.row.status === 3" style="color: #0d8ddb"
						>已批准</span
						>
						<span v-if="scope.row.status === 4" style="color: #ff2222"
						>已退回</span
						>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="handleShow(scope.row.id)"
						>查看
						</el-button>
						<el-button
							size="mini"
							type="text"
							@click="handleEdit(scope.row.id)"
							v-if="scope.row.status === 1 || scope.row.status === 4"
						>修改
						</el-button
						>
						<el-button
							size="mini"
							type="text"
							@click="handleDel(scope.row.id)"
							v-if="scope.row.status === 1 || scope.row.status === 4"
						>删除
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
		<!--新增/修改/查看-->
		<createPlan
			v-if="showPlan"
			ref="auditplan"
			@complete="complete"
			@close="showPlan = false"
		></createPlan>
	</div>
</template>

<script>
	import {
		getPlanList,
		delPlan,
		getPlanInfo,
		exportManagementReviewPlan
	} from '@/api/qualityAssurance/managementReview/auditPlan.js'
	import createPlan from './dialog/createPlan'

	export default {
		name: 'auditPlan',
		components: { createPlan },
		data() {
			return {
				showSearch: true,
				fullscreen: false,
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					year: '',
					status: ''
				},
				total: 0,
				ids: [],
				tableData: [],
				colData: [
					{ title: '计划编号', istrue: true },
					{ title: '年度', istrue: true },
					{ title: '参加评审部门及人员', istrue: true },
					{ title: '评审时间安排', istrue: true },
					{ title: '评审地点', istrue: true },
					{ title: '状态', istrue: true }
				],
				showPlan: false
			}
		},
		mounted() {
			this.getList()
		},
		methods: {
			handleExport() {
				exportManagementReviewPlan(this.queryParams).then(res => {
					if (res.code === 200) {
						this.downLoadFile(res.msg)
					}
				})
			},
			/** 重置按钮操作 */
			resetQuery() {
				this.dateRange = []
				this.queryParams.datdateStart = undefined
				this.queryParams.dateEnd = undefined
				this.resetForm('queryParams')
				this.handleQuery()
			},
			/** 搜索按钮操作 */
			handleQuery() {
				if (this.dateValue === null) {
					this.queryParams.datdateStart = undefined
					this.queryParams.dateEnd = undefined
				}
				this.queryParams.pageNum = 1
				this.getList()
			},
			e_fullScreen() {
				this.fullscreen = !this.fullscreen
			},
			e_changeBox(list) {
				let arrList = this.colData.filter((i) => !list.includes(i.title))
				let titleList = arrList.map((item) => {
					return item.title
				})
				this.colData.filter((i) => {
					if (titleList.indexOf(i.title) != -1) {
						i.istrue = false
					} else {
						i.istrue = true
					}
				})
			},
			// 多选框选中数据
			handleSelectionChange(selection) {
				this.ids = selection.map((item) => item.id)
			},
			getList() {
				getPlanList(this.queryParams).then((res) => {
					console.log('res.data.list', res.data.list)
					this.tableData = res.data.list
					this.total = res.data.total
					this.tableData.map((item) => {
						let list = item.planPersonNames.split(',')
						let arr = []
						list.map((item1) => {
							arr.push(item1)
						})
						arr = this.repeat(arr)
						item.planPersonNames = arr.join(',')

					})
				})
				console.log('this.tableData',this.tableData)
			},
			repeat(data) {
				for (let i = 0; i < data.length - 1; i++) {
					for (let j = 1; j < data.length; j++) {
						if (i != j) {
							if (data[i] == data[j]) {
								data.splice(j, 1)
								j--
							}
						}
					}
				}
				return data
			},
			// 排序
			sortChange(column, prop, order) {
				this.queryParams.orderByColumn = this.toLine(column.prop)
				if (column.order === 'descending') {
					this.queryParams.orderByType = 'DESC'
				} else if (column.order === 'ascending') {
					this.queryParams.orderByType = 'ASC'
				} else {
					this.queryParams.orderByType = ''
				}
				this.getList()
			},
			toLine(name) {
				return name.replace(/([A-Z])/g, '_$1').toLowerCase()
			},
			handleAdd() {
				this.showPlan = true
				this.$nextTick(() => {
					this.$refs.auditplan.init('add')
				})
			},
			handleShow(id) {
				this.showPlan = true
				getPlanInfo(id).then((res) => {
					this.$nextTick(() => {
						this.$refs.auditplan.init('show', res.data)
						console.log('res.data', res.data)
					})
				})
			},
			handleEdit(id) {
				this.showPlan = true
				getPlanInfo(id).then((res) => {
					this.$nextTick(() => {
						this.$refs.auditplan.init('update', res.data)
					})
				})
			},
			handleDel(id) {
				this.$confirm('确定删除该评审计划吗？', '提示').then((res) => {
					delPlan(id).then((res) => {
						this.$message.success('删除成功')
						this.getList()
					})
				})
			},
			complete() {
				this.showPlan = false
				this.getList()
			},
			handlePrint() {
				var ids = this.ids.join(',')
				POBrowser.openWindowModeless(
					process.env.VUE_APP_BASE_API +
					'/qualityControl/pageOffice/printManagementReviewProgramme?id=' +
					ids,
					'width=1440px;height=860px'
				)
			}
		}
	}
</script>

<style scoped>
</style>
