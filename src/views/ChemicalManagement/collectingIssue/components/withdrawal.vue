<template>
	<div>
		<div class="a-c-top" v-show="showSearch" style="margin-top: 0">
			<el-form ref="formsample2" :model="queryParams" label-width="100px" class="demo-form-inline" :inline="true">
				<el-form-item label="退库日期">
					<el-date-picker
						style="width: 260px"
						size="small"
						v-model="returnDate"
						@change="returnDateChange"
						type="daterange"
						range-separator="—"
						value-format="yyyy-MM-dd"
						start-placeholder="开始日期"
						end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="耗材编号">
					<el-input v-model="queryParams.materialNumber" class="input-with-select" style="width: 240px" size="small"
							  placeholder="请输入内容"  clearable
							  @clear="searchPro"></el-input>
				</el-form-item>
				<el-form-item label="耗材名称">
					<el-input v-model="queryParams.materialName" class="input-with-select" style="width: 240px" size="small"
							  placeholder="请输入内容"  clearable
							  @clear="searchPro"></el-input>
				</el-form-item>
				<el-form-item label="规格型号">
					<el-input v-model="queryParams.materialModel" class="input-with-select" style="width: 240px" size="small"
							  placeholder="请输入内容"  clearable
							  @clear="searchPro"></el-input>
				</el-form-item>
				<el-form-item label="批号">
					<el-input v-model="queryParams.batchNumber" class="input-with-select" style="width: 240px" size="small"
							  placeholder="请输入内容"  clearable
							  @clear="searchPro"></el-input>
				</el-form-item>
				<el-form-item label="审批状态">
					<el-select v-model="queryParams.status"  clearable style="width: 240px" size="small">
						<el-option :value="item.value" :label="item.label"
								   v-for="(item,index) in statusList"></el-option>
					</el-select>
				</el-form-item>
				<div class="a-c-t-btnarea">
					<el-form-item>
						<el-button type="primary"
								   icon="el-icon-search"
								   size="mini" @click="searchPro">
							查询
						</el-button>
						<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
							重置
						</el-button>
					</el-form-item>
				</div>
			</el-form>
		</div>

		<div class="a-c-bottom">
			<el-row :gutter="10" class="mb8">
				<el-col :span="1.5">
<!--					<el-button size="mini" type="primary" @click="">打印</el-button>-->
<!--					<el-button size="mini" type="warning" @click="">导入</el-button>-->
				</el-col>

				<el-col :span="1.5"></el-col>

				<right-toolbar :showSearch.sync="showSearch" @queryTable="resetQuery" @fullScreen="e_fullScreen"
							   @changeBox="e_changeBox" :boxData="colData" style="padding-right: 10px"></right-toolbar>
			</el-row>
			<!-- 列表区域 -->
			<el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center" />
				<el-table-column label="序号" align="center" type="index" width="50"/>
				<el-table-column prop="returnDate" label="退库日期" sortable show-overflow-tooltip align="center"
								 v-if="colData[0].istrue"/>
				<el-table-column prop="materialNumber" label="耗材编号" sortable show-overflow-tooltip align="center"
								 v-if="colData[1].istrue"/>
				<el-table-column prop="materialName" label="耗材名称" sortable show-overflow-tooltip align="center"
								 v-if="colData[2].istrue"/>
				<el-table-column prop="materialModel" label="规格型号" sortable show-overflow-tooltip align="center"
								 v-if="colData[3].istrue"/>
				<el-table-column prop="brand" label="品牌" sortable show-overflow-tooltip v-if="colData[4].istrue" align="center"/>
				<el-table-column prop="manufacturer" label="生产厂商" sortable show-overflow-tooltip align="center"
								 v-if="colData[5].istrue"/>
				<el-table-column prop="grade" label="试剂级别" sortable show-overflow-tooltip v-if="colData[6].istrue" align="center"/>
				<el-table-column prop="batchNumber" label="批号" sortable show-overflow-tooltip v-if="colData[7].istrue" align="center"/>
				<el-table-column prop="certificateNo" label="证书编号" sortable show-overflow-tooltip align="center"
								 v-if="colData[8].istrue"/>
				<el-table-column prop="materialCount" label="退库数量" sortable show-overflow-tooltip align="center"
								 v-if="colData[9].istrue"/>
				<el-table-column prop="unit" label="计量单位" sortable show-overflow-tooltip v-if="colData[10].istrue" align="center"/>
				<el-table-column prop="storeSiteName" label="出库库位" sortable show-overflow-tooltip align="center"
								 v-if="colData[11].istrue"/>
				<el-table-column prop="costPrice" label="单价" sortable show-overflow-tooltip v-if="colData[12].istrue" align="center"/>
				<el-table-column prop="costTotal" label="金额" sortable show-overflow-tooltip v-if="colData[13].istrue" align="center"/>
				<el-table-column prop="remark" label="备注" sortable show-overflow-tooltip v-if="colData[14].istrue" align="center"/>
				<el-table-column prop="status" label="审批状态" sortable show-overflow-tooltip v-if="colData[15].istrue" align="center"
								 width="98">
					<template slot-scope="scope">
						<span v-if="scope.row.status == 1">暂存</span>
						<span v-if="scope.row.status == 2">已提交</span>
						<span v-if="scope.row.status == 3">审核通过</span>
						<span v-if="scope.row.status == 4">退回</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" show-overflow-tooltip width="150" align="center">
					<template slot-scope="scope">
						<el-button type="text" @click="viewInfo(scope.row.id)" style="color: #409EFF">查看</el-button>
						<el-button type="text" v-if="(scope.row.status == 1 || scope.row.status == 4)"
								   @click="editRow(scope.row.id)" style="color: #409EFF">修改
						</el-button>
						<el-button type="text" v-if="(scope.row.status == 1 || scope.row.status == 4)"
								   @click="delRow(scope.row.id)" style="color: #409EFF">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
						:limit.sync="queryParams.pageSize" @pagination="getList"/>
		</div>
		<stockRefund v-if="isStockRefund" :id="id" @close="isStockRefund = false" :showType="showType"
					 @handleOk="handleOk()"></stockRefund>
	</div>
</template>
<script>
	import { queryStoreOutReturnList, delStoreOutReturn } from '@/api/chemical/collectingIssue'
	import stockRefund from '../dialog/stockRefund'

	export default {
		name: 'withdrawal',
		components: { stockRefund },
		data() {
			return {
				colData: [
					{ title: '退库日期', istrue: true },
					{ title: '耗材编号', istrue: true },
					{ title: '耗材名称', istrue: true },
					{ title: '规格型号', istrue: true },
					{ title: '品牌', istrue: true },
					{ title: '生产厂商', istrue: true },
					{ title: '试剂级别', istrue: true },
					{ title: '批号', istrue: true },
					{ title: '证书编号', istrue: true },
					{ title: '退库数量', istrue: true },
					{ title: '计量单位', istrue: true },
					{ title: '出库库位', istrue: true },
					{ title: '单价', istrue: true },
					{ title: '金额', istrue: true },
					{ title: '备注', istrue: true },
					{ title: '审批状态', istrue: true }
				],
				tableData: [],
				total: 0,
				queryParams: {
					returnDateBegin: '',
					returnDateEnd: '',
					pageNum: 1,
					pageSize: 10,
					status: ''
				},
				statusList: [
					{ label: '暂存', value: 1 },
					{ label: '已提交', value: 2 },
					{ label: '审核通过', value: 3 },
					{ label: '退回', value: 4 }
				],
				showSearch: true,
				returnDate: '',
				showType: '',
				id: 0,
				isStockRefund: false
			}
		},
		mounted() {
			this.getList()
		},
		methods: {
			getList() {
				queryStoreOutReturnList(this.queryParams).then(res => {
					this.total = res.data.total
					this.tableData = res.data.list
				})
			},
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
			resetQuery() {
				this.returnDate = ''
				this.queryParams = {
					pageNum: 1,
					pageSize: 10,
					materialName: '',
					materialNumber: '',
					materialModel: '',
					batchNumber: '',
					status: '',
					returnDateBegin: '',
					returnDateEnd: ''
				}
				this.getList()
			},
			returnDateChange(v) {
				if (this.returnDate) {
					this.queryParams.returnDateBegin = v[0]
					this.queryParams.returnDateEnd = v[1]
				} else {
					this.queryParams.returnDateBegin = ''
					this.queryParams.returnDateEnd = ''
				}
			},
			searchPro() {
				this.queryParams.pageNum = 1
				this.queryParams.pageSize = 10
				this.getList()
			},
			handleSelectionChange() {

			},
			viewInfo(id) {
				this.id = id
				this.showType = 'show'
				this.isStockRefund = true
			},
			editRow(id) {
				this.id = id
				this.showType = 'edit'
				this.isStockRefund = true
			},
			delRow(id) {
				this.$confirm('确定删除该退库记录吗？', '提示').then(() => {
					delStoreOutReturn(id).then(res => {
						if (res.code == 200) {
							this.$message.success('删除成功')
							this.getList()
						}
					})
				})
			},
			handleOk() {
				this.isStockRefund = false
				this.resetQuery()
			}
		}
	}
</script>

<style scoped lang="less">
</style>
