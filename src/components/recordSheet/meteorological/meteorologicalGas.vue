<template>
	<div style="flex:1">

		<a-row>
			<a-col span="21">
				<div class="selected">
					<span>气象信息</span>
				</div>
			</a-col>
		</a-row>

		<a-table :columns="columns" size="small" :scroll={y:200} rowKey="dataIndex"
				 :dataSource="meteorologicalGasResultData"
				 :pagination="false">

			<template slot="temperature" slot-scope="text, record">
				<a-input v-model="meteorologicalGasData.temperature" :maxLength="maxLength"/>
			</template>
			<template slot="atmosphericPressure" slot-scope="text, record">
				<a-input v-model="meteorologicalGasData.atmosphericPressure" :maxLength="maxLength"/>
			</template>
			<template slot="windVelocity" slot-scope="text, record">
				<a-input v-model="meteorologicalGasData.windVelocity" :maxLength="maxLength"/>
			</template>
			<template slot="windDirection" slot-scope="text, record">
				<a-input v-model="meteorologicalGasData.windDirection" :maxLength="maxLength"/>
			</template>
			<template slot="weatherCondition" slot-scope="text, record">
				<a-input v-model="meteorologicalGasData.weatherCondition" :maxLength="maxLength"/>
			</template>

		</a-table>

	</div>
</template>

<script>

	const columns = [
		{
			title: '气温(℃)',
			align: 'center',
			dataIndex: 'temperature',
			scopedSlots: {customRender: 'temperature'},
		},{
			title: '湿度',
			align: 'center',
			dataIndex: 'humidity',
			scopedSlots: {customRender: 'humidity'},
		},{
			title: '气压(hPa)',
			align: 'center',
			dataIndex: 'atmosphericPressure',
			scopedSlots: {customRender: 'atmosphericPressure'},
		},{
			title: '风速(m/s)',
			align: 'center',
			dataIndex: 'windVelocity',
			scopedSlots: {customRender: 'windVelocity'},
		},{
			title: '风向',
			align: 'center',
			dataIndex: 'windDirection',
			scopedSlots: {customRender: 'windDirection'},
		},{
			title: '天气情况',
			align: 'center',
			dataIndex: 'weatherCondition',
			scopedSlots: {customRender: 'weatherCondition'},
		}
	];

	export default {
		name: 'meteorologicalGas',
		data() {
			return {
				columns,
				meteorologicalGasResultData: [{}],
				meteorologicalGasData: {
					temperature: "",
					atmosphericPressure: "",
					windVelocity: "",
					windDirection: "",
					weatherCondition: ""
				},
				// 输入长度限制
				maxLength: 50
			}
		},
		props: {
			extendedProperties: {
				// 出参结果数据列表
				meteorological: {}
			}
		},
		mounted() {
			console.log('meteorologicalGas');
			this.init();
			this.refill();
		},
		methods: {
			init() {
				if (this.extendedProperties.meteorological) {
					this.meteorologicalGasData = this.extendedProperties.meteorological;
				}
				this.extendedProperties.meteorological = this.meteorologicalGasData;
			},
			refill() {
			},
		},
		watch: {
			'extendedProperties.editType': {
				handler: function (val, oldVal) {
					if (this.extendedProperties.meteorological) {
						this.meteorologicalGasData = this.extendedProperties.meteorological;
					}
					this.extendedProperties.meteorological = this.meteorologicalGasData;
				},
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
</style>
