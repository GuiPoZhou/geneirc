<template>
	<div>
		<el-form :model="queryParams" ref="queryForm" :inline="true"
				 :prop="queryParams" style="margin: 15px 0 0 0" label-width="120px">
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="采购申请" name="first">
					<el-row>
						<el-col :span="8">
							<el-form-item label="申请单号" prop="applyNo">
								<el-input placeholder="请输入申请单号" v-model="queryParams.applyNo"
										  :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="申请日期" prop="applyDate">
								<el-date-picker
									:disabled="isdisable"
									v-model="queryParams.applyDate"
									align="right"
									type="date"
									value-format="yyyy-MM-dd"
									placeholder="选择申请日期">
								</el-date-picker>
							</el-form-item>
						</el-col>

						<el-col :span="8">
							<el-form-item label="申请人员">
								<el-input placeholder="申请人员" :disabled="true"
										  v-model="queryParams.applyPersonName"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="使用日期" prop="useDate">
								<el-date-picker
									v-model="queryParams.useDate"
									align="right"
									type="date"
									value-format="yyyy-MM-dd"
									:disabled="isdisable"
									placeholder="选择使用日期">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="批准人">
								<el-input placeholder="批准人" :disabled="true"
										  v-model="queryParams.approvePersonName"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="批准日期">
								<el-date-picker :disabled="true" v-model="queryParams.date" align="right" type="date"
												value-format="yyyy-MM-dd" placeholder="批准日期">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="申请部门">
								<el-input placeholder="申请部门" :disabled="true"
										  v-model="queryParams.applyDeptName"></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="8">
							<el-form-item label="预估金额合计">
								<el-input placeholder="预估金额合计" :disabled="true" v-model="queryParams.amount"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="申请原因" prop="applyReason">
								<el-input type="textarea" :rows="2" placeholder="请输入内容"
										  v-model="queryParams.applyReason" :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="备注" prop="remark">
								<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="queryParams.remark"
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
								<el-input placeholder="最新修改日期" :disabled="true" v-model="queryParams.updateTimeStr"
										  disabled></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<div class="tabDataHeader">
						<h3>耗材列表</h3>
						<div v-if="!isdisable">
							<el-button type="primary" @click="addRows">添加行</el-button>
							<el-button type="danger" @click="delRows">删除行</el-button>
						</div>
					</div>
					<el-table ref="multipleTable" :data="dataList" stripe border>
						<el-table-column type="selection" width="55"/>
						<el-table-column label="序号" align="center" type="index" width="50"/>
						<el-table-column prop="materialNumber" label="耗材编号" width="200"/>
						<el-table-column prop="materialName" label="耗材名称"/>
						<el-table-column prop="materialModel" label="规格型号"/>
						<el-table-column prop="unit" label="计量单位"/>
						<el-table-column prop="brand" label="品牌"/>
						<el-table-column prop="manufacturer" label="生产厂商"/>
						<el-table-column prop="grade" label="试剂级别"/>
						<el-table-column prop="applyCount" label="申请数量" width="151"/>
						<el-table-column prop="currentStoreCount" label="库存数量"/>
						<el-table-column prop="price" label="预估单价"/>
						<el-table-column prop="amount" label="预估金额"/>
						<el-table-column prop="useDate" label="使用日期" width="200"/>
						<el-table-column prop="remark" label="备注" width="300"/>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-form>
	</div>
</template>

<script>
import {
	getDetailByBuyApplyId,
} from '@/api/consumables/purchaseApply'

export default {
	name: "materialBuyApply",
	data() {
		return {
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
			if (params) {
				this.queryParams = {
					...params
				}
				getDetailByBuyApplyId(params.id).then(res => {
					this.dataList = res.data;
				});
			}
		},
	}
}
</script>

<style scoped lang="less">
/deep/ .el-form--inline .el-form-item {
	width: 100%;
	.el-form-item__content {
		width: calc(100% - 140px);
		.el-date-editor, .el-select--medium, input {
			width: 100%;
		}
	}
}
</style>
