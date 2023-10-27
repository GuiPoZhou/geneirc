<template>
	<el-dialog title="选择耗材"
			   :visible.sync="dialogShow" center :show-close="true" :close-on-press-escape="false"
			    width="70%" append-to-body @close="cancelbtn">
		<el-row :gutter="20">
			<!--分类-->
			<el-col :span="5" :xs="24">
				<classification :type="type" :treeList="treeList" @updata="updata" @handleData="handleData" :showTypes="showTypes"></classification>
			</el-col>
			<el-col :span="19" :xs="24" class="a-m-c-right">
				<el-table ref="singleTable" highlight-current-row @current-change="handleCurrentChange" :data="dataList" stripe border>
					<el-table-column label="序号" align="center" type="index" width="50"/>
					<el-table-column prop="materialNumber" label="耗材编号" width="200"/>
					<el-table-column prop="materialName" label="耗材名称"/>
					<el-table-column prop="materialModel" label="规格型号"/>
					<el-table-column prop="unit" label="计量单位"/>
					<el-table-column prop="brand" label="品牌"/>
					<el-table-column prop="manufacturer" label="生产厂商"/>
					<el-table-column prop="grade" label="试剂级别"/>
					<el-table-column prop="currentStoreCount" label="库存数量"/>
				</el-table>
				<pagination v-show="total > 0" :total="total" :page.sync="form.pageNum"
										:limit.sync="form.pageSize" @pagination="getList"/>
			</el-col>
		</el-row>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="handleOk()">确定</el-button>
			<el-button @click="cancelbtn">取消</el-button>
		</div>
	</el-dialog>
</template>

<script>
import {getMaterialStoreCount} from "@/api/chemical/essentialInformation";
import {addBuyApplyDetail} from "@/api/chemical/purchaseApply"
import {addBuyOrderDetail} from "@/api/chemical/purchaseOrder";
import classification from "@/views/ChemicalManagement/essentialInformation/dialog/classification.vue";
import {
	getMaterialTreelist,
	getMaterialList
} from '@/api/chemical/essentialInformation.js'

export default {
	name: "addApplyDetail",
	components: {classification},
	data() {
		return {
			isFullScreen: false,
			queryParams: {
				price: "",
				applyCount: 1,
				amount: 0,
				useDate: "",
				remark: "",
			},
			form: {
				pageNum: 1,
				pageSize: 10
			},
			dialogShow: true,
			selectIndex: -1,
			dataList: [],
			treeList: [],
			currentRow: "",
			type: '0',
			showTypes: 'details',
			materialTreeId: null,
			total: 0
		}
	},
	props: {
		id: 0,
		isEditDetail: 0,
		isOrder: false
	},
	created() {
		// getMaterialStoreCount().then(res2 => {
		// 	this.dataList = res2.data;
		// });
		this.getTreelist()
		this.getList()
	},
	methods: {
		// 标准树查询
		getTreelist() {
			getMaterialTreelist().then(res => {
				this.treeList = res.data
			})
		},
		updata() {
			this.getTreelist()
		},
		handleData(data, row) {
			this.form.materialTreeId = data.id
			// this.trssdata = data
			// this.multiple = false
			// this.ismultiple = true
			this.getList()
		},
		getList() {
			// this.queryParams.decideStandardTreeId = this.trssdata.id
			getMaterialList(this.form).then(res => {
				console.log(111111)
				this.dataList = res.data.list
				this.total = res.data.total
			})
		},
		e_changeBox(type) {
			this.isFullScreen = type;
		},
		setCurrent(row) {
			this.$refs.singleTable.setCurrentRow(row);
		},
		handleCurrentChange(val) {
			this.currentRow = val;
		},
		handleOk() {
			if (this.currentRow) {
				var data = {
					amount: this.queryParams.amount,
					applyCount: this.queryParams.applyCount,
					buyApplyId: this.id,
					buyOrderId: this.id,
					materialId: this.currentRow.id,
					price: this.queryParams.price,
					remark: this.queryParams.remark,
					storeCountShow: this.currentRow.currentStoreCount,
					useDate: this.queryParams.useDate
				}
				if (this.isOrder) {
					if(this.isEditDetail == 1) {
						delete data.buyApplyId
						addBuyOrderDetail(data).then(res => {
							this.$emit('confims', this.currentRow);
						});
					} else {
						this.$emit('confims', this.currentRow);
					}
					return false
				}
				if (this.id == 0) {
					this.$emit('confims', this.currentRow);
				} else {
					delete data.buyOrderId
					addBuyApplyDetail(data).then(res => {
						this.$emit('confims', this.currentRow);
					});
				}
			}
		},
		cancelbtn() {
			this.$emit('close');
		},
		priceChange() {
			this.queryParams.amount = this.queryParams.price * this.queryParams.applyCount;
		}
	}
}
</script>

<style scoped lang="less">


/deep/ .el-dialog__body .el-col {
	margin-bottom: 0;
}

.el-tabs__content {

}

/deep/ .el-tabs .el-tabs__content {
	overflow: initial !important;
}

/deep/ .el-dialog__body .el-table {
	background-color: #fff;
}

.tabDataHeader {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 10px;

	h3 {
		font-weight: bold;
	}
}
</style>
