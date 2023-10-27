<template>
	<div>
		<div class="a-c-top" v-show="showSearch" style="margin-top: 0">
			<el-form ref="formsample2" :model="queryParams" label-width="100px" class="demo-form-inline" :inline="true">
				<el-form-item label="退货日期">
					<el-date-picker v-model="refundDate" style="width: 260px" size="small" value-format="yyyy-MM-dd"
						@change="refundDateChange" type="daterange" range-separator="-" start-placeholder="开始日期"
						end-placeholder="结束日期"></el-date-picker>
				</el-form-item>
				<el-form-item label="供应商名称">
					<el-select v-model="queryParams.supplierName" placeholder="请选择供应商" style="width: 240px" size="small"
						@change="searchPro" clearable>
						<el-option :value="item.supplierName" :label="item.supplierName"
							v-for="(item, index) in supplierList"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="耗材编号">
					<el-input v-model="queryParams.materialNumber" class="input-with-select" style="width: 240px"
						size="small" placeholder="请输入内容" @clear="searchPro" clearable></el-input>
				</el-form-item>
				<el-form-item label="耗材名称">
					<el-input v-model="queryParams.materialName" class="input-with-select" style="width: 240px" size="small"
						placeholder="请输入内容" @clear="searchPro" clearable></el-input>
				</el-form-item>
				<div class="a-c-t-btnarea">
					<el-form-item class="btn_form_item">
						<el-button type="primary" icon="el-icon-search" size="mini" @click="searchPro">
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
<!--				<el-col :span="1.5">-->
<!--					<el-button size="mini" type="primary" @click="printLabel()" :disabled="selectionData.length <= 0">-->
<!--						打印-->
<!--					</el-button>-->
<!--				</el-col>-->
				<el-col :span="1.5">
					<el-button size="mini" type="warning" @click="exportStoreRefunds()">导出</el-button>
				</el-col>

				<el-col :span="1.5"></el-col>
				<right-toolbar :showSearch.sync="showSearch" @queryTable="resetQuery" @fullScreen="e_fullScreen"
					@changeBox="e_changeBox" :boxData="colData" style="padding-right: 10px">
				</right-toolbar>
			</el-row>

			<el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center" />
				<el-table-column label="序号" align="center" type="index" width="50" />
				<!-- <el-table-column prop="supplierName" label="供应商名称" sortable show-overflow-tooltip align="center"
								 width="160" v-if="colData[1].istrue"/> -->
				<el-table-column prop="materialNumber" label="物料编号" sortable show-overflow-tooltip align="center"
					v-if="colData[0].istrue" />
				<el-table-column prop="materialName" label="耗材名称" sortable show-overflow-tooltip align="center"
					v-if="colData[1].istrue" />
				<el-table-column prop="materialModel" label="规格型号" sortable show-overflow-tooltip align="center"
					v-if="colData[2].istrue" />
				<el-table-column prop="unit" label="计量单位" sortable show-overflow-tooltip align="center"
					v-if="colData[3].istrue" />
				<el-table-column prop="brand" label="品牌" sortable show-overflow-tooltip align="center"
					v-if="colData[4].istrue" />
				<el-table-column prop="refundDate" label="退库日期" sortable v-if="colData[5].istrue" align="center" />
				<el-table-column prop="materialCount" label="退库数量" sortable show-overflow-tooltip align="center"
					v-if="colData[6].istrue" />
				<el-table-column prop="storeSiteName" label="库位" sortable show-overflow-tooltip align="center"
					v-if="colData[7].istrue" />
				<!-- <el-table-column prop="manufacturer" label="生产厂商" sortable show-overflow-tooltip align="center"
								 v-if="colData[6].istrue"/>
				<el-table-column prop="grade" label="试剂级别" sortable show-overflow-tooltip align="center"
								 v-if="colData[7].istrue"/>



				<el-table-column prop="price" label="单价" sortable show-overflow-tooltip align="center"
								 v-if="colData[11].istrue"/>
				<el-table-column prop="amount" label="金额" sortable show-overflow-tooltip align="center"
								 v-if="colData[12].istrue"/>
				<el-table-column prop="status" label="状态" sortable show-overflow-tooltip align="center">
					<template slot-scope="scope">
						<span v-if="scope.row.status == 1">暂存</span>
						<span v-if="scope.row.status == 2">已提交</span>
						<span v-if="scope.row.status == 3">审核通过</span>
						<span v-if="scope.row.status == 4">退回</span>
					</template>
				</el-table-column> -->

				<el-table-column label="操作" align="center" width="180">
					<template slot-scope="scope">
						<el-button size="mini" type="text" style="color: #409EFF" @click="lookOver(scope.row)">
							查看
						</el-button>
						<el-button size="mini" type="text" v-if="(scope.row.status == 1 || scope.row.status == 4)"
							@click="editRow(scope.row)" style="color: #409EFF">
							修改
						</el-button>
						<el-button size="mini" type="text" v-if="(scope.row.status == 1 || scope.row.status == 4)"
							style="color: #409EFF" @click="delRow(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
				:limit.sync="queryParams.pageSize" @pagination="getList" />
		</div>

		<retreat v-if="isRetreat" :showType="showType" @handleOk="handleOk" @close="isRetreat = false" :id="id"></retreat>
	</div>
</template>

<script>
import { getSelectList } from "@/api/chemical/purchaseOrder";
import { queryStoreRefundList, exportStoreRefund, delStoreRefund } from "@/api/chemical/AcceptanceWarehousing"
import retreat from "../dialog/retreat"


export default {
	name: "inspectionIncomeLibrary",
	components: { retreat },
	data() {
		return {
			selectionData: [],
			isRetreat: false,
			showSearch: true,
			queryParams: {
				pageNum: 1,
				pageSize: 10,
				storeInDateBegin: "",
				storeInDateEnd: "",
				orderNo: "",
				supplierName: "",
				materialName: "",
				materialNumber: ""
			},
			showType: "add",
			detail: {},
			id: 0,
			total: 0,
			supplierList: [],
			refundDate: "",
			tableData: [],
			colData: [


				{
					title: "物料编号",
					istrue: true
				},
				{
					title: "耗材名称",
					istrue: true
				},
				{
					title: "规格型号",
					istrue: true
				},
				{
					title: "计量单位",
					istrue: true
				},
				{
					title: "品牌",
					istrue: true
				},
				{
					title: "退库日期",
					istrue: true
				},
				{
					title: "退库数量",
					istrue: true
				},

				{
					title: "库位",
					istrue: true
				}

			]
		}
	},
	created() {
		console.log(2222)
		this.getList();
		getSelectList().then(res => {
			this.supplierList = res.data;
		});
	},
	methods: {
		searchPro() {
			this.getList();
		},
		delRow(val) {
			this.$confirm('确定要删除该退货记录吗？', '提示').then(res => {
				delStoreRefund(val.id).then(res => {
					if (res.code == 200) {
						this.$message.success('删除成功');
						this.resetQuery();
					}
				});
			})
		},
		addStorehouse() {
			this.isRetreat = true
		},
		refundDateChange(v) {
			if (this.refundDate) {
				this.queryParams.refundDateBegin = v[0]
				this.queryParams.refundDateEnd = v[1]
			} else {
				this.queryParams.refundDateBegin = ''
				this.queryParams.refundDateEnd = ''
			}
		},
		resetQuery() {
			this.refundDate = "";
			this.queryParams = {
				pageNum: 1,
				pageSize: 10,
				refundDateBegin: "",
				refundDateEnd: "",
				orderNo: "",
				supplierName: "",
				materialName: ""
			}
			this.getList();
		},
		e_fullScreen() {
			this.fullscreen = !this.fullscreen;
		},
		warehousingRow(data) {
			this.detail = data;
			this.isRetreat = true;
		},
		handleSelectionChange(val) {
			this.selectionData = val;
		},
		printLabel() {
			// 1、获取选中行
			let array = this.$refs.multipleTable.selection.map(item => item.id);
			if (!array || array.length == 0) {
				return false;
			}
			POBrowser.openWindowModeless(
				process.env.VUE_APP_BASE_API +
				"/fileManage/pageOffice/printControll?multipleSelection=" + array.join(","),
				"width=1440px;height=860px"
			);
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
		getList() {
			queryStoreRefundList(this.queryParams).then(res => {
				this.tableData = res.data.list
				this.total = res.data.total
			})
		},
		handleOk() {
			this.isRetreat = false;
			this.resetQuery();
		},
		lookOver(val) {
			this.id = val.id
			this.showType = "show";
			this.isRetreat = true;
		},
		editRow(val) {
			this.id = val.id
			this.showType = "edit";
			this.isRetreat = true;
		},
		del(val) {

		},
		returnOfGoods(val) {

		},
		exportStoreRefunds() {
			exportStoreRefund().then(res => {
				if (res.code == 200) {
					this.downLoadFile(res.msg)
				}
			});
		}
	}
}
</script>

<style scoped lang="less">
.flexdit {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	background-color: #fff;
	padding-top: 16px;
	border: 1px solid #dfe6ec;
}

.btn_form_item /deep/ .el-form-item__content {
	margin-left: 0 !important;
}

.cell {
	.el-tag {
		background: none !important;
		border: none !important;
	}
}

.tabbody {
	background-color: #fff;
	border-bottom: 1px solid #dfe6ec;

	h3 {
		margin-bottom: 0;
		border-left: 1px solid #dfe6ec;
		border-right: 1px solid #dfe6ec;
		padding: 5px 10px;
		font-size: 14px;
		font-weight: bold;
	}

	.pagtion {
		border-left: 1px solid #dfe6ec;
		border-right: 1px solid #dfe6ec;
		position: relative;
		height: 50px;

		.el-pagination {
			position: absolute;
			right: 0;
			padding-top: 10px;
			padding-bottom: 10px;
		}
	}
}

.pagination-container {
	margin-top: 0;
}

.linel {
	border: 1px solid #dfe6ec;
	background-color: #fff;
	margin-top: 10px;
	padding-left: 10px;
	padding-top: 10px;
}
</style>
