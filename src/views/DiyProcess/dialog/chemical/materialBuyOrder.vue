<template>
	<div style="padding: 20px">
		<el-form
			:model="queryParams"
			ref="queryForm"
			:inline="true"
			:prop="queryParams"
			style="margin: 15px 0 0 0"
			label-width="120px">
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="采购订单" name="first">
					<el-row>
						<el-col :span="8">
							<el-form-item label="采购单号" prop="orderNo">
								<el-input placeholder="请输入采购单号" v-model="queryParams.orderNo"
										  :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="采购日期" prop="orderDate">
								<el-date-picker :disabled="isdisable" v-model="queryParams.orderDate"
												align="right"
												type="date" value-format="yyyy-MM-dd" placeholder="选择采购日期">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="要求到货日期" prop="finishDate">
								<el-date-picker v-model="queryParams.finishDate" align="right" type="date"
												value-format="yyyy-MM-dd" :disabled="isdisable"
												placeholder="选择使用日期">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="供应商名称" prop="supplierId">
								<el-select v-model="queryParams.supplierId" placeholder="请选择供应商" :disabled="isdisable">
									<el-option :value="item.id" :label="item.supplierName"
											   v-for="(item,index) in supplierList"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="地址" prop="supplierAddress">
								<el-input placeholder="请输入地址" :disabled="isdisable"
										  v-model="queryParams.supplierAddress"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="联系人" prop="contact">
								<el-input placeholder="请输入联系人" :disabled="isdisable"
										  v-model="queryParams.contact"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="联系电话" prop="phone">
								<el-input placeholder="请输入联系电话" :disabled="isdisable"
										  v-model="queryParams.phone"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="金额合计">
								<el-input placeholder="金额合计" :disabled="true"
										  v-model="queryParams.amount"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="币种" prop="currency">
								<el-select v-model="queryParams.currency" placeholder="请选择币种"
										   :disabled="isdisable">
									<el-option :value="item.dictValue" :label="item.dictLabel"
											   v-for="(item,index) in currencyList"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="转入申请单号" prop="applyNos">
								<el-input type="textarea" :rows="2" placeholder="请输入内容"
										  v-model="queryParams.applyNos" :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="备注" prop="remark">
								<el-input type="textarea" :rows="2" placeholder="请输入内容"
										  v-model="queryParams.remark"
										  :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="录入人员">
								<el-input placeholder="录入人员" :disabled="true" v-model="queryParams.createByStr"
										  disabled></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="最新修改日期">
								<el-input placeholder="最新修改日期" :disabled="true"
										  v-model="queryParams.updateTimeStr"
										  disabled></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<div class="tabDataHeader">
						<h3>耗材列表</h3>
					</div>
					<el-table ref="multipleTable" :data="dataList" stripe border>
						<el-table-column type="selection" width="55"/>
						<el-table-column label="序号" align="center" type="index" width="50"/>
						<el-table-column prop="materialNumber" label="耗材编号" width="200"></el-table-column>
						<el-table-column prop="materialName" label="耗材名称"/>
						<el-table-column prop="materialModel" label="规格型号"/>
						<el-table-column prop="unit" label="计量单位"/>
						<el-table-column prop="brand" label="品牌"/>
						<el-table-column prop="manufacturer" label="生产厂商"/>
						<el-table-column prop="grade" label="试剂级别"/>
						<el-table-column prop="orderCount" label="采购数量" width="151"></el-table-column>
						<el-table-column prop="waitAcceptCount" label="未交数量"/>
						<el-table-column prop="price" label="单价"></el-table-column>
						<el-table-column prop="amount" label="金额"/>
						<el-table-column prop="finishDate" label="要求到货日期"></el-table-column>
						<el-table-column prop="applyNos" label="申请单号"></el-table-column>
						<el-table-column prop="remark" label="备注" width="300"/>
					</el-table>
					<el-row style="margin-top: 20px">
						<el-col :span="8">
							<el-form-item label="合计金额大写">
								<el-input v-model="queryParams.amountCn" :disabled="true"
										  class="wid"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="合计金额小写">
								<el-input v-model="queryParams.amount" :disabled="true" class="wid"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

				</el-tab-pane>
			</el-tabs>
		</el-form>
	</div>
</template>

<script>
export default {
	name: "materialBuyOrder",
	data() {
		return {
			supplierList: [],
			currencyList: [],
			queryParams: {},
			dataList: [],
			isdisable: true,
			activeName: 'first'
		}
	},
	mounted() {

	},
	methods: {
		handleClick(tab, event) {
			console.log(tab, event);
		},
		init(params) {
			console.log(params)
			if (params) {
				this.queryParams = {
					...params.buyOrder
				}
				this.dataList = params.detailList
			}
		},
	}
}
</script>


<style scoped lang="less">
.cell .el-tag {
	background: none;
	border: none;
}

.flex {
	display: flex;
}

.flexdit {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	background-color: #fff;
	padding-top: 16px;
	border: 1px solid #dfe6ec;
}

.pointer {
	cursor: pointer;
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
/deep/ .el-form--inline .el-form-item {
	width: 100%;
	.el-form-item__content {
		width: calc(100% - 140px);
		.el-date-editor,.el-select--medium,input {
			width: 100%;
		}
	}
}
</style>
