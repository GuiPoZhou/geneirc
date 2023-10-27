<template>
	<div style="flex:1">

		<a-row>
			<a-col span="21">
				<div class="selected">
					<span>校准值</span>
				</div>
			</a-col>
		</a-row>

		<a-table :columns="columns" size="small" rowKey="dataIndex" bordered
				 :dataSource="resultData"
				 :pagination="false">

			<template slot="beforeMeasurement" slot-scope="text, record">
				<a-input v-model="data.beforeMeasurement" :maxLength="maxLength"/>
			</template>
			<template slot="afterMeasurement" slot-scope="text, record">
				<a-input v-model="data.afterMeasurement" :maxLength="maxLength"/>
			</template>
			<template slot="backgroundNoise" slot-scope="text, record">
				<a-input v-model="data.backgroundNoise" :maxLength="maxLength"/>
			</template>

		</a-table>

	</div>
</template>

<script>

	const columns = [
		{
			title: '测量前 dB(A)',
			align: 'center',
			dataIndex: 'beforeMeasurement',
			scopedSlots: {customRender: 'beforeMeasurement'},
		}
		, {
			title: '测量后 dB(A)',
			align: 'center',
			dataIndex: 'afterMeasurement',
			scopedSlots: {customRender: 'afterMeasurement'},
		},
		{
			title: '背景噪声dB(A)',
			align: 'center',
			dataIndex: 'backgroundNoise',
			scopedSlots: {customRender: 'backgroundNoise'},
		}
	];

	export default {
		name: 'sceneNoiseCalibration',
		data() {
			return {
				columns,
				resultData: [{}],
				data: {
					beforeMeasurement: "",
					afterMeasurement: "",
					backgroundNoise: ""
				},
				// 输入长度限制
				maxLength: 50,
			}
		},
		props: {
			extendedProperties: {
				// 出参结果数据列表
				noiseCalibration: {}
			}
		},
		mounted() {
			console.log('sceneNoiseCalibration');
			this.init();
			this.refill();
		},
		methods: {
			init() {
				if (this.extendedProperties.noiseCalibration) {
					this.data = this.extendedProperties.noiseCalibration;
				}
				this.extendedProperties.noiseCalibration = this.data;
			},
			refill() {
			},
		},
		watch: {
			'extendedProperties.editType': {
				handler: function (val, oldVal) {
					if (this.extendedProperties.noiseCalibration) {
						this.data = this.extendedProperties.noiseCalibration;
					}
					this.extendedProperties.weighingEnvironment = this.data;
				},
			},
			data(val) {
				this.extendedProperties.noiseCalibration = this.data;
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
