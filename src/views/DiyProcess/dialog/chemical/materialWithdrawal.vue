<template>
	<div>
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">

			<el-tab-pane label="采购订单" name="first">
				<el-form ref="formsample" :model="queryParams" label-width="100px" class="flexdit">
					<el-row>
						<el-col :span="8">
							<el-form-item label="退库日期">
								<el-date-picker v-model="queryParams.returnDate" align="right" type="date" :disabled="isdisable" placeholder="退库日期" value-format="yyyy-MM-dd"></el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="退库部门">
								<el-input placeholder="退库部门" v-model="queryParams.returnDeptName" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="耗材编号">
								<el-input placeholder="耗材编号" v-model="queryParams.materialNumber" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="耗材名称">
								<el-input placeholder="耗材名称" v-model="queryParams.materialName" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="规格型号">
								<el-input placeholder="规格型号" v-model="queryParams.materialModel" :disabled="true"></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="8">
							<el-form-item label="计量单位">
								<el-input placeholder="计量单位" v-model="queryParams.unit" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="品牌">
								<el-input placeholder="品牌" v-model="queryParams.brand" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="生产厂商">
								<el-input placeholder="生产厂商" v-model="queryParams.manufacturer" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="试剂级别">
								<el-input placeholder="试剂级别" v-model="queryParams.grade" :disabled="true"></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="8">
							<el-form-item label="批号">
								<el-input placeholder="批号" v-model="queryParams.batchNumber" :disabled="true"></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="8">
							<el-form-item label="证书编号">
								<el-input placeholder="证书编号" v-model="queryParams.certificateNo" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="生产日期">
								<el-input placeholder="生产日期" v-model="queryParams.productionDate"
										  :disabled="true"></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="8">
							<el-form-item label="有效期">
								<el-input placeholder="有效期" v-model="queryParams.safeDate" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="有效到期日">
								<el-input placeholder="有效到期日" v-model="queryParams.invalidDate" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="原出库数量">
								<el-input placeholder="原出库数量" v-model="queryParams.materialCount"
										  :disabled="true"></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="24">
							<el-form-item label="备注">
								<el-input type="textarea" placeholder="备注" v-model="queryParams.remark"
										  :disabled="isdisable"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="退库数量">
								<el-input placeholder="入库库位" v-model="queryParams.materialCount" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="入库库位">
								<el-input placeholder="入库库位" v-model="queryParams.storeSiteName" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item style="height: 36px"></el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="保管员1">
								<el-input placeholder="保管员1" v-model="queryParams.administratorAName" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="退库人1">
								<el-input placeholder="退库人1" v-model="queryParams.returnPersonAName" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item style="height: 36px"></el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="保管员2">
								<el-input placeholder="保管员2" v-model="queryParams.administratorBName" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="退库人2">
								<el-input placeholder="退库人2" v-model="queryParams.returnPersonBName" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item style="height: 36px"></el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="录入人员">
								<el-input placeholder="录入人员" v-model="queryParams.createByStr" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="最新修改日期">
								<el-input placeholder="最新修改日期" v-model="queryParams.updateTimeStr" :disabled="true"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
export default {
	name: "materialWithdrawal",
	data() {
		return {
			queryParams: {},
			dataList: [],
			isdisable: true,
			activeName: 'first',
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
					...params
				}
			}
		}
	}
}
</script>

<style scoped>

</style>
