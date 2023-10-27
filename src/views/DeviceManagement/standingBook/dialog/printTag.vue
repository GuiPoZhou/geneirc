<template>
	<el-dialog
		title="打印标签"
		:visible.sync="printTagShow"
		append-to-body
		width="600px"
		center
		:show-close="true"
		@close="close"
		:close-on-press-escape="false"
		:close-on-click-modal="false"
	>
		<el-form
			:model="addParam"
			ref="addForm"
			:label-position="labelPosition"
			label-width="90px"
		>
			<el-row>
				<el-form-item label="打印机">
					<el-select v-model="printer">
						<el-option
							:label="printer"
							v-for="(printer, index) in printerList"
							:value="index"
							:key="printer"
						></el-option>
					</el-select>
				</el-form-item>
			</el-row>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="close" center>返回</el-button>
			<!-- <el-button @click="submitPrint" type="primary">打印</el-button> -->
		</div>

		<!-- 标签样式-->
		<div>
			<div ref="unInspect" style="width: 60mm; height: 40mm;border: 1px solid black; padding: 2mm 2mm">
				<ul style="display: flex;flex-wrap: wrap;list-style: none;justify-content: space-between;font-size: 10px">
					<li style="width: 56mm;line-height: 6mm">设备编号：{{equipmentNumber}}</li>
					<li style="width: 56mm;line-height: 6mm">设备名称：{{equipmentName}}</li>
					<li style="width: 56mm;line-height: 6mm">设备状态：{{status}}</li>
				</ul>
			</div>
		</div>
	</el-dialog>
</template>

<script>
import barcode from "@/utils/barcode";

export default {
	name: "printTag",
	data() {
		return {
			height: "10mm",
			labelTypeList: [],
			printer: undefined,
			labelPosition: "right",
			addParam: {},
			printerList: [],
			num: 1,
			selectedTasks: [],
			a: [],
			equipmentNumber: "",
			equipmentName: "",
			status: "",
		};
	},
	props: {
		printTagShow: {
			type: Boolean,
			default: false,
		},
		datas: {
			type: Array,
			default: ()=>{}
		}
	},
	components: {barcode},
	computed: {},
	mounted() {
		this.equipmentNumber = this.datas[0].equipmentNumber
		this.equipmentName = this.datas[0].equipmentName
		this.status = this.datas[0].status == 1?"正常":
					  	this.datas[0].status == 2?"停用":
						this.datas[0].status == 3?"维修":
						this.datas[0].status == 4?"保养":
						this.datas[0].status == 5?"报废":
						this.datas[0].status == 6?"封存":
						this.datas[0].status == 7?"核查":
						this.datas[0].status == 8?"故障":""
		this.initPrintPage()

	},
	methods: {
		// 关闭
		close() {
			this.$emit("cancel", false);
		},

		initPrintPage(selectedTasks) {
			this.selectedTasks = selectedTasks;

			this.$nextTick(() => {
				// this.selectedTasks.forEach((task) => {
				//   JsBarcode(".barcode_" + task.id, task.qualityControlCode, {
				//     format: "CODE128",
				//     lineColor: "#000",
				//     background: "#fff",
				//     displayValue: false,
				//     width: 1,
				//     height: 35,
				//   });
				// });
			});

			this.initPrinterList();
		},

		//初始化打印机列表
		initPrinterList() {
			// this.printerList = [];
			// //调用getLodop获取LODOP对象
			// let LODOP = getLodop();
			// let printerCount = LODOP.GET_PRINTER_COUNT();

			// for (let i = 0; i < printerCount; i++) {
			// 	let printer = LODOP.GET_PRINTER_NAME(i);
			// 	this.printerList.push(printer);
			// }
			// console.log("this.printerList", this.printerList);
		},

	
	},
};
</script>

<style scoped>
ul {
	padding-inline-start: 0;
	margin-block-start: 0;
	margin-block-end: 0;
}
</style>
