<template>
	<div>
		<div class="a-c-top" v-show="showSearch" style="margin-top: 0">
			<el-form ref="formsample2" :model="queryParams" label-width="100px" class="demo-form-inline"
					 :inline="true">
				<el-form-item label="采购单号">
					<el-input v-model="queryParams.orderNo" class="input-with-select" style="width: 240px" size="small"
							  placeholder="请输入内容" @keyup.enter.native="searchPro" @clear="searchPro"
							  clearable></el-input>
				</el-form-item>
				<el-form-item label="采购日期">
					<el-date-picker v-model="orderDate" style="width: 260px" size="small" value-format="yyyy-MM-dd"
									@change="orderDateChange" type="daterange" range-separator="-"
									start-placeholder="选择开始日期" end-placeholder="选择结束日期"></el-date-picker>
				</el-form-item>
				<el-form-item label="供应商名称">
					<el-select v-model="queryParams.supplierName" placeholder="请选择供应商" @change="searchPro" clearable
							   style="width: 240px" size="small">
						<el-option :value="item.supplierName" :label="item.supplierName"
								   v-for="(item,index) in supplierList"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="耗材名称">
					<el-input v-model="queryParams.materialName" class="input-with-select" style="width: 240px" size="small"
							  placeholder="请输入内容" @keyup.enter.native="searchPro" @clear="searchPro"
							  clearable></el-input>
				</el-form-item>
				<div class="a-c-t-btnarea">
					<el-form-item class="btn_form_item">
						<el-button type="primary"
								   icon="el-icon-search"
								   size="mini" @click="searchPro">
							搜索
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
					<el-button size="mini" type="warning" @click="exportWaitStoreIns">导出</el-button>
				</el-col>
				<el-col :span="1.5"></el-col>
				<right-toolbar
					:showSearch.sync="showSearch"
					@queryTable="resetQuery"
					@fullScreen="e_fullScreen"
					@changeBox="e_changeBox"
					:boxData="colData"
					style="padding-right: 10px">
				</right-toolbar>
			</el-row>
			<el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center" />
				<el-table-column label="序号" align="center" type="index" width="50"/>
				<el-table-column prop="buyOrderNo" align="center"  label="申请单号" sortable v-if="colData[0].istrue"/>
				<el-table-column prop="orderDate" label="采购日期" sortable show-overflow-tooltip width="160"
												 align="center" v-if="colData[1].istrue"/>
				<el-table-column prop="contact" label="联系人" sortable show-overflow-tooltip
												 align="center" v-if="colData[2].istrue"/>
				<el-table-column prop="supplierName" label="供应商名称" sortable show-overflow-tooltip
												 align="center" v-if="colData[3].istrue"/>
				<el-table-column prop="detailDinishDate" label="要求到货日期" sortable show-overflow-tooltip
												 align="center" v-if="colData[4].istrue"/>
				<el-table-column prop="rowIndex" label="行号" sortable show-overflow-tooltip
												 align="center" v-if="colData[5].istrue"/>
				<el-table-column prop="materialName" label="耗材名称" sortable show-overflow-tooltip
												 align="center" v-if="colData[6].istrue"/>
				<el-table-column prop="materialModel" label="规格型号" sortable show-overflow-tooltip
												 align="center" v-if="colData[7].istrue"/>
				<el-table-column prop="manufacturer" label="生产厂商" sortable show-overflow-tooltip
												 align="center" v-if="colData[8].istrue"/>
				<el-table-column prop="grade" label="试剂级别" sortable show-overflow-tooltip
												 align="center" v-if="colData[9].istrue"/>
				<el-table-column prop="unit" label="计量单位" sortable show-overflow-tooltip
												 align="center" v-if="colData[10].istrue"/>
				<el-table-column prop="orderCount" label="采购数量" sortable show-overflow-tooltip
												 align="center" v-if="colData[11].istrue"/>
				<el-table-column prop="acceptCount" label="已交数量" sortable show-overflow-tooltip
												 align="center" v-if="colData[12].istrue"/>
				<el-table-column prop="unAcceptCount" label="未交数量" sortable show-overflow-tooltip
												 align="center" v-if="colData[13].istrue"/>
				<el-table-column prop="remark" label="备注" sortable show-overflow-tooltip
												 align="center" v-if="colData[14].istrue"/>
				<el-table-column label="操作" align="center" width="180">
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="warehousingRow(scope.row)" style="color: #409EFF">
							入库
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

		<warehousing v-if="isWarehousing" @handleOk="handleOk" :detail="detail" @close="isWarehousing = false"
					 :id="id"></warehousing>
	</div>
</template>

<script>
	import { getSelectList } from '@/api/chemical/purchaseOrder'
	import { queryWaitStoreInList, exportWaitStoreIn } from '@/api/chemical/AcceptanceWarehousing'
	import warehousing from '../dialog/warehousing'

	export default {
		name: 'inspectionIncomeLibrary',
		components: { warehousing },
		data() {
			return {
				isWarehousing: false,
				showSearch: true,
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					orderDateBegin: '',
					orderDateEnd: '',
					orderNo: '',
					supplierName: '',
					materialName: ''
				},
				detail: {},
				id: 0,
				total: 0,
				supplierList: [],
				orderDate: '',
				tableData: [],
				colData: [
					{
						title: '采购单号',
						istrue: true
					},
					{
						title: '采购日期',
						istrue: true
					},
					{
						title: '联系人',
						istrue: true
					},
					{
						title: '供应商名称',
						istrue: true
					},
					{
						title: '要求到货日期',
						istrue: true
					},
					{
						title: '行号',
						istrue: true
					},
					{
						title: '耗材名称',
						istrue: true
					},
					{
						title: '规格型号',
						istrue: true
					},
					{
						title: '生产厂商',
						istrue: true
					},
					{
						title: '试剂级别',
						istrue: true
					},
					{
						title: '计量单位',
						istrue: true
					},
					{
						title: '采购数量',
						istrue: true
					},
					{
						title: '已交数量',
						istrue: true
					},
					{
						title: '未交数量',
						istrue: true
					},
					{
						title: '备注',
						istrue: true
					}
				]
			}
		},
		created() {
			this.getList()
			getSelectList().then(res => {
				this.supplierList = res.data
			})
		},
		methods: {
			exportWaitStoreIns() {
				exportWaitStoreIn(this.queryParams).then(res => {
					if (res.code == 200) {
                        this.downLoadFile(res.msg)
					}
				})
			},
			searchPro() {
				this.getList()
			},
			orderDateChange(v) {
				if (this.orderDate) {
					this.queryParams.orderDateBegin = v[0]
					this.queryParams.orderDateEnd = v[1]
				} else {
					this.queryParams.orderDateBegin = ''
					this.queryParams.orderDateEnd = ''
				}
			},
			resetQuery() {
				this.orderDate = ''
				this.queryParams = {
					pageNum: 1,
					pageSize: 10,
					orderDateBegin: '',
					orderDateEnd: '',
					orderNo: '',
					supplierName: '',
					materialName: ''
				}
				this.getList()
			},
			e_fullScreen() {
				this.fullscreen = !this.fullscreen
			},
			warehousingRow(data) {
				this.detail = data
				this.isWarehousing = true
			},
			handleSelectionChange() {

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
			getList() {
				queryWaitStoreInList(this.queryParams).then(res => {
					this.tableData = res.data.list
					this.total = res.data.total
				})
			},
			handleOk() {
				this.isWarehousing = false
				this.resetQuery()
				this.$emit('warehousing')
			}
		}
	}
</script>

<style scoped lang="less">
</style>
