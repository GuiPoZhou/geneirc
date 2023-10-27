<template>
	<el-dialog title="采购申请单"
			   :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false" :modal="false"
			   :close-on-click-modal="false" width="70%">
		<div>
			<el-table ref="multipleTable" :data="dataLists" stripe border>
				<el-table-column label="序号" align="center" type="index" width="50"/>
				<el-table-column prop="buyApplyNo" label="申请单号" width="200" />
				<el-table-column prop="applyDate" label="申请日期"/>
				<el-table-column prop="applyPersonName" label="申请人员"/>
				<el-table-column prop="applyDeptName" label="申请部门"/>
				<el-table-column prop="useDate" label="使用日期"/>
				<el-table-column prop="materialName" label="耗材名称"/>
				<el-table-column prop="materialModel" label="规格型号"/>
				<el-table-column prop="manufacturer" label="生产厂商" width="151"/>
				<el-table-column prop="grade" label="试剂级别"/>
				<el-table-column prop="unit" label="计量单位"/>
				<el-table-column prop="applyCount" label="申请数量"/>
				<el-table-column prop="orderCount" label="下单数量"/>
				<el-table-column prop="remark" label="备注" width="300"/>
			</el-table>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button @click="cancelbtn">关闭</el-button>
		</div>
	</el-dialog>
</template>

<script>
export default {
	name: "showPurchaseOrder",
	data() {
		return {
			dialogShow: true,
			isFullScreen: false,
			screenName: "fullScreen",
			titles: '',
			// showType: 'add',
			activeName: 'first',
			dataList: []
		}
	},
	props: {
		dataLists: ""
	},
	methods: {
		e_changeBox(type) {
			this.isFullScreen = type;
		},
		handleOk() {

		},
		cancelbtn() {
			this.$emit('close')
		}
	}
}
</script>

<style scoped>

</style>
