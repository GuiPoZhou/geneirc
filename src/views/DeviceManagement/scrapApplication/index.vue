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
				label-width="100px"
			>
				<el-form-item label="设备编号" prop="equipmentNumber">
					<el-input
						v-model="queryParams.equipmentNumber"
						placeholder="请输入设备编号"
						clearable
						class="input-with-select"
						style="width: 240px"
						size="small"
						@clear="handleQuery"
					/>
				</el-form-item>
				<el-form-item label="设备名称" prop="equipmentName">
					<el-input
						v-model="queryParams.equipmentName"
						placeholder="请输入设备名称"
						clearable
						class="input-with-select"
						style="width: 240px"
						size="small"
						@clear="handleQuery"
					/>
				</el-form-item>
				<el-form-item label="申请日期">
					<el-date-picker
						v-model="dateRange"
						style="width: 260px"
						size="small"
						value-format="yyyy-MM-dd"
						@change="ondateChange"
						type="daterange"
						range-separator="-"
						start-placeholder="选择开始日期"
						end-placeholder="选择结束日期"
					></el-date-picker>
				</el-form-item>
				<el-form-item label="审批状态" prop="status">
					<el-select v-model="queryParams.status" placeholder="请选择" clearable style="width: 240px"
							   size="small">
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
							@click="resetQuery('filesForm')"
						>重置
						</el-button
						>
					</el-form-item>
				</div>
			</el-form>
		</div>
		<!-- 主列表区域 -->
		<div
			class="a-c-bottom"
			:class="fullscreen == true ? 'showFullScreen' : ''"
		>
			<el-row :gutter="10" class="mb8">
				<el-col :span="1.5">
					<el-button type="primary" size="mini"  @click="handleAdd">添加</el-button>
					<el-button type="primary" :disabled="ids.length != 1" size="mini"  @click="handlePrint">打印</el-button>
					<el-button type="primary" :disabled="!ids.length > 0" size="mini"  @click="handleSubmit()">提交</el-button>
					<el-button type="danger" :disabled="!ids.length > 0" size="mini"  @click="handleDel()">删除</el-button>
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
				@selection-change="handleSelectionChange"
				@sort-change="sortChange"
			>
				<el-table-column type="selection" width="55"/>
				<el-table-column
					label="序号"
					align="center"
					type="index"
					width="50"
					fixed
				/>
				<el-table-column prop="equipmentNumber" label="设备编号" sortable="custom" show-overflow-tooltip fixed align="center"
								 v-if="colData[0].istrue"/>
				<el-table-column prop="equipmentName" label="设备名称" sortable="custom" show-overflow-tooltip align="center"
								 v-if="colData[1].istrue"/>
				<el-table-column prop="equipmentModel" label="规格型号" sortable="custom" show-overflow-tooltip align="center"
								 v-if="colData[2].istrue"/>
				<el-table-column prop="manufacturer" label="生产厂家" sortable="custom" show-overflow-tooltip align="center"
								 v-if="colData[3].istrue"/>
				<!--        <el-table-column prop="" label="数量" sortable="custom" show-overflow-tooltip v-if="colData[4].istrue"/>-->
				<el-table-column prop="position" label="存放地点" sortable="custom" show-overflow-tooltip align="center"
								 v-if="colData[4].istrue"/>
				<el-table-column prop="administratorName" label="保管人" sortable="custom" show-overflow-tooltip align="center"
								 v-if="colData[5].istrue"/>
				<el-table-column prop="applyDate" label="申请日期" sortable="custom" show-overflow-tooltip align="center"
								 v-if="colData[6].istrue"/>
				<el-table-column prop="applyPerson" label="申请人" sortable="custom" show-overflow-tooltip align="center"
								 v-if="colData[7].istrue"/>
				<el-table-column prop="reason" label="报废原因" sortable="custom" show-overflow-tooltip align="center"
								 v-if="colData[8].istrue"/>
				<el-table-column prop="approvalUser" label="批准人" sortable="custom" show-overflow-tooltip align="center"
								 v-if="colData[9].istrue"/>
				<el-table-column prop="approvalDate" label="批准日期" sortable="custom" show-overflow-tooltip align="center"
								 v-if="colData[10].istrue"/>
				<el-table-column prop="status" label="审批状态" sortable="custom" show-overflow-tooltip align="center"
								 v-if="colData[11].istrue">
					<template slot-scope="scope">
						<span v-if="scope.row.status === 1">待提交</span>
						<span v-if="scope.row.status === 2">审批中</span>
						<span v-if="scope.row.status === 3">已批准</span>
						<span v-if="scope.row.status === 4">已退回</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="200" fixed="right">
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="e_look(scope.row)" style="color: #409EFF">查看</el-button>
						<el-button size="mini" type="text" v-if="scope.row.status === 1 || scope.row.status === 4"
								   @click="e_edit(scope.row)" style="color: #409EFF">修改
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
		<!--添加/修改/查看-->
		<createScrap v-if="showscrap" ref="scrap" @close="showscrap = false"></createScrap>
	</div>
</template>

<script>
	import createScrap from './dialog/createScrap'
	import {
		getScrapApplyList,
		getScrapApplyDetail,
		submitScrapApply,
		delScrapApply
	} from '@/api/resources/deviceManagement/index.js'

	export default {
		name: 'index',
		components: { createScrap },
		data() {
			return {
				showSearch: true,
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					equipmentName: '',
					equipmentNumber: '',
					applyDateBegin: '',
					applyDateEnd: '',
					status: null,
					orderByColumn: '',
					isAsc: ''
				},
				fullscreen: false,
				total: 0,
				colData: [
					{ title: '设备编号', istrue: true },
					{ title: '设备名称', istrue: true },
					{ title: '规格型号', istrue: true },
					{ title: '生产厂家', istrue: true },
					// { title: "数量", istrue: true },
					{ title: '存放地点', istrue: true },
					{ title: '保管人', istrue: true },
					{ title: '申请日期', istrue: true },
					{ title: '申请人', istrue: true },
					{ title: '报废原因', istrue: true },
					{ title: '批准人', istrue: true },
					{ title: '批准日期', istrue: true },
					{ title: '审批状态', istrue: true }
				],
				tableData: [],
				ids: [],
				dateRange: [],
				dateValue: [],
				showscrap: false,
				selectionList: []
			}
		},
		mounted() {
			this.getList()
		},
		methods: {
			e_fullScreen() {
				this.fullscreen = !this.fullscreen
			},
			e_changeBox(list) {
				let arrList = this.colData.filter(i => !list.includes(i.title))
				let titleList = arrList.map(item => {
					return item.title
				})
				this.colData.filter(i => {
					if (titleList.indexOf(i.title) != -1) {
						i.istrue = false
					} else {
						i.istrue = true
					}
				})
			},
			ondateChange(v) {
				if (this.dateRange) {
					this.queryParams.applyDateBegin = v[0]
					this.queryParams.applyDateEnd = v[1]
				} else {
					this.queryParams.applyDateBegin = ''
					this.queryParams.applyDateEnd = ''
				}
			},
			/** 重置按钮操作 */
			resetQuery() {
				this.dateRange = []
				this.queryParams.applyDateBegin = undefined
				this.queryParams.applyDateEnd = undefined
				this.resetForm('queryParams')
				this.handleQuery()
			},
			/** 搜索按钮操作 */
			handleQuery() {
				this.queryParams.pageNum = 1
				this.getList()
			},
			// 多选框选中数据
			handleSelectionChange(selection) {
				this.selectionList = selection
				this.ids = selection.map(item => item.id)
			},
			getList() {
				getScrapApplyList(this.queryParams).then(res => {
					this.tableData = res.data.list
					this.total = res.data.total
				})
			},
			// 排序
			sortChange(column, prop, order) {
				this.queryParams.orderByColumn = this.toLine(column.prop)
				if (column.order === 'descending') {
					this.queryParams.isAsc = 'desc'
				} else if (column.order === 'ascending') {
					this.queryParams.isAsc = 'asc'
				} else {
					this.queryParams.isAsc = ''
				}
				this.getList()
			},
			toLine(name) {
				return name.replace(/([A-Z])/g, '_$1').toLowerCase()
			},
			// 添加
			handleAdd() {
				this.showscrap = true
				this.$nextTick(() => {
					this.$refs.scrap.init('add')
				})
			},
			// 查看
			e_look(row) {
				this.getlistDetail(row.id, 'show')
			},
			// 修改
			e_edit(row) {
				this.getlistDetail(row.id, 'update')
			},
			// 获取报废详情
			getlistDetail(id, type) {
				this.showscrap = true
				getScrapApplyDetail(id).then(res => {
					this.$nextTick(() => {
						this.$refs.scrap.init(type, res.data)
					})
				})
			},
			// 删除
			handleDel(index) {
				var ids = this.ids.join(',')
				let status =  this.selectionList.filter((item)=>{
					if (item.status == 2) {
						return true
					}
					if (item.status == 3) {
						return true
					}
				})
				this.$confirm('确定删除吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if(status.length){
						this.$message.error('选中数据存在已准批或审批中不可删除')
						this.getList()
						return
					}
					delScrapApply(ids).then(res => {
						if (res.code == 200) {
							this.$message.success('删除成功')
							this.getList()
						} else {
							this.$message.info(res.msg)
						}
					})
				})
			},
			// 提交
			handleSubmit(index) {
				var ids = this.ids.join(',')
				let status =  this.selectionList.filter((item)=>{
					if (item.status != 1) {
						return true
					}
				})
				this.$confirm('确定提交选中的数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if(status.length){
						this.$message.error('选中数据存在已提交数据不可重复提交！')
						this.getList()
						return
					}
					submitScrapApply(ids).then(res => {
						if (res.code == 200) {
							this.$message.success('提交成功')
							this.getList()
						} else {
							this.$message.info(res.msg)
						}
					})
				})
			},
			handlePrint() {
				POBrowser.openWindowModeless(
					window.globalEnv.VUE_APP_BASE_API +
					'/equipment/pageOffice/printScrapApply?id=' + this.ids[0],
					'width=1440px;height=860px'
				)
			}
		}
	}
</script>

<style scoped>

</style>
