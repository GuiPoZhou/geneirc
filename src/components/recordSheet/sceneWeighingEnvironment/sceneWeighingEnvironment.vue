<template>
	<div style="flex:1">

		<a-row>
			<a-col span="21">
				<div class="selected">
					<span>称量环境</span>
				</div>
			</a-col>
		</a-row>

		<a-row>
			<a-col span="6">
				<a-form-item label="分析日期：" prop="analysisDate">
					<a-date-picker v-model="data.analysisDate" placeholder="请选择日期"/>
				</a-form-item>
			</a-col>
			<a-col span="6">
				<a-form-item label="温度：" prop="temperature" maxLength="maxLength">
					<a-input v-model="data.temperature"/>
				</a-form-item>
			</a-col>
			<a-col span="6">
				<a-form-item label="湿度：" prop="humidity" maxLength="maxLength">
					<a-input v-model="data.humidity"/>
				</a-form-item>
			</a-col>
			<a-col span="6">
				<a-form-item label="RH：" prop="rh">
					<a-date-picker v-model="data.rh" placeholder="请选择日期"/>
				</a-form-item>
			</a-col>
		</a-row>


		<a-table :columns="tableColumns" rowKey="dataIndex" size="middle" bordered
				 :data-source="tableData"
				 :pagination="false">

			<template slot="blankWeight1" slot-scope="text, record">
				<a-input-number v-model="data.blankWeight1" :min="0" :max="100000" @change="changeBlank()"/>
			</template>
			<template slot="blankWeight2" slot-scope="text, record">
				<a-input-number v-model="data.blankWeight2" :min="0" :max="100000" @change="changeBlank()"/>
			</template>
			<template slot="blankWeight3" slot-scope="text, record">
				<a-input-number v-model="data.blankWeight3" :min="0" :max="100000" @change="changeBlank()"/>
			</template>
			<template slot="blankWeightResult" slot-scope="text, record">
				<a-input v-model="data.blankWeightResult" :readOnly="true" style="width:120px;"/>
			</template>

			<template slot="samplingWeight1" slot-scope="text, record">
				<a-input-number v-model="data.samplingWeight1" :min="0" :max="100000" @change="changeSampling()"/>
			</template>
			<template slot="samplingWeight2" slot-scope="text, record">
				<a-input-number v-model="data.samplingWeight2" :min="0" :max="100000" @change="changeSampling()"/>
			</template>
			<template slot="samplingWeight3" slot-scope="text, record">
				<a-input-number v-model="data.samplingWeight3" :min="0" :max="100000" @change="changeSampling()"/>
			</template>
			<template slot="samplingWeightResult" slot-scope="text, record">
				<a-input v-model="data.samplingWeightResult" :readOnly="true" style="width:120px;"/>
			</template>

		</a-table>

	</div>

</template>

<script>
	const tableColumns = [
			{
				title: '空白采样管重量(g)',
				children: [
					{
						title: '第1次',
						align: 'center',
						dataIndex: 'blankWeight1',
						scopedSlots: {customRender: 'blankWeight1'},
					}
					, {
						title: '第2次',
						align: 'center',
						dataIndex: 'blankWeight2',
						scopedSlots: {customRender: 'blankWeight2'},
					},
					{
						title: '第3次',
						align: 'center',
						dataIndex: 'blankWeight3',
						scopedSlots: {customRender: 'blankWeight3'},
					},
					{
						title: '结果',
						align: 'center',
						dataIndex: 'blankWeightResult',
						scopedSlots: {customRender: 'blankWeightResult'},
					}
				]
			},
			{
				title: '采样后采样管重量(g)',
				children: [
					{
						title: '第1次',
						align: 'center',
						dataIndex: 'samplingWeight1',
						scopedSlots: {customRender: 'samplingWeight1'},
					}
					, {
						title: '第2次',
						align: 'center',
						dataIndex: 'samplingWeight2',
						scopedSlots: {customRender: 'samplingWeight2'},
					},
					{
						title: '第3次',
						align: 'center',
						dataIndex: 'samplingWeight3',
						scopedSlots: {customRender: 'samplingWeight3'},
					},
					{
						title: '结果',
						align: 'center',
						dataIndex: 'samplingWeightResult',
						scopedSlots: {customRender: 'samplingWeightResult'},
					}
				]
			}
		]
	;

	export default {
		name: 'sceneWeighingEnvironment',
		components: {},
		data() {
			return {
				tableColumns,
				// 表格空白数据
				tableData: [{}],
				// 组件数据
				data: {},
				// 输入长度限制
				maxLength: 50,
			}
		},
		props: {
			extendedProperties: {
				// 出参结果数据对象
				weighingEnvironment: {},
			}
		},
		mounted() {
			console.log('sceneWeighingEnvironment');
			this.init();
			this.refill();
		},
		methods: {
			init() {
				if (!this.extendedProperties.weighingEnvironment) {
					this.extendedProperties.weighingEnvironment = {};
				}
				this.data = this.extendedProperties.weighingEnvironment;
			},
			refill() {
			},
			changeBlank() {
				let blankWeight1 = this.data.blankWeight1;
				let blankWeight2 = this.data.blankWeight2;
				let blankWeight3 = this.data.blankWeight3;

				let blankWeight = 0;
				let length = 0;

				if (blankWeight1) {
					blankWeight += Number(blankWeight1);
					length++;
				}
				if (blankWeight2) {
					blankWeight += Number(blankWeight2);
					length++;
				}
				if (blankWeight3) {
					blankWeight += Number(blankWeight3);
					length++;
				}

				if (length != 0) {
					let result = Number(blankWeight / length).toFixed(4);
					this.$set(this.data, 'blankWeightResult', result);
				}
			},
			changeSampling() {
				let samplingWeight1 = this.data.samplingWeight1;
				let samplingWeight2 = this.data.samplingWeight2;
				let samplingWeight3 = this.data.samplingWeight3;

				let samplingWeight = 0;
				let length = 0;

				if (samplingWeight1) {
					samplingWeight += Number(samplingWeight1);
					length++;
				}
				if (samplingWeight2) {
					samplingWeight += Number(samplingWeight2);
					length++;
				}
				if (samplingWeight3) {
					samplingWeight += Number(samplingWeight3);
					length++;
				}

				if (length != 0) {
					let result = Number(samplingWeight / length).toFixed(4);
					this.$set(this.data, 'samplingWeightResult', result);
				}
			}
		},
		watch: {
			'extendedProperties.editType': {
				handler: function (val, oldVal) {
					if (this.extendedProperties.weighingEnvironment) {
						this.data = this.extendedProperties.weighingEnvironment;
					}
					this.extendedProperties.weighingEnvironment = this.data;
				},
			},
			data(val) {
				this.extendedProperties.weighingEnvironment = this.data;
			}
		},
	}
</script>

<style lang="less" scoped>
	/deep/ .ant-form {
		display: flex;
		align-items: center;

		.ant-form-item {
			margin-bottom: 0;
		}
	}

	/deep/ .ant-table-header {
		margin-bottom: 0 !important;
		min-width: 100% !important;
		overflow: hidden !important;
	}

	/deep/ .ant-form-inline {
		height: 50px;
	}

	/deep/ .ant-form-item-label {
		padding: 0;
	}

	/deep/ .ant-form-item {
		padding-bottom: 0 !important;
		display: flex;
		align-items: center;
	}

	.selected {
		span {
			font-weight: bolder;
			font-size: 24px;
		}
	}

	/deep/ .ant-table-row-cell-break-word {
		height: 57px;
	}

	/deep/ .ant-modal-title {
		margin: 0;
		color: rgba(0, 0, 0, 0.85);
		font-weight: 500;
		font-size: 16px;
		line-height: 22px;
		word-wrap: break-word;
		text-align: center;
		font-weight: bold !important;
	}

	/deep/ .ant-modal-footer {
		padding: 10px 16px;
		text-align: right;
		background: transparent;
		border-top: 1px solid #e8e8e8;
		border-radius: 0 0 4px 4px;
		text-align: center;
	}
</style>
