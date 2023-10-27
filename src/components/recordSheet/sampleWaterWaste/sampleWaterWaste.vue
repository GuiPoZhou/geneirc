<template>
	<div style="flex:1">

		<a-row>
			<a-col span="21">
				<div class="selected">
					<span>废水采样信息</span>
				</div>
			</a-col>
		</a-row>

		<a-table :columns="tableColumns" rowKey="dataIndex" :scroll="{ x: 2000 }" bordered
				 :data-source="extendedProperties.sampleWaterWasteList"
				 :row-selection="{columnWidth: 50, selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
				 :pagination="false">

			<template slot="samplingTimeTitle">
				采样时间 <a @click="showAdd('samplingTime')" style="color: #1890ff;">批</a>
			</template>
			<template slot="samplingTime" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleWaterWasteList[index].samplingTime" :maxLength="maxLength"/>
			</template>

			<template slot="dischargeTitle">
				流量(m³/s) <a @click="showAdd('discharge')" style="color: #1890ff;">批</a>
			</template>
			<template slot="discharge" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleWaterWasteList[index].discharge" :maxLength="maxLength"/>
			</template>

			<template slot="waterTemperatureTitle">
				水温(℃) <a @click="showAdd('waterTemperature')" style="color: #1890ff;">批</a>
			</template>
			<template slot="waterTemperature" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleWaterWasteList[index].waterTemperature" :maxLength="maxLength"/>
			</template>

			<template slot="airTemperatureTitle">
				气温(℃) <a @click="showAdd('airTemperature')" style="color: #1890ff;">批</a>
			</template>
			<template slot="airTemperature" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleWaterWasteList[index].airTemperature" :maxLength="maxLength"/>
			</template>

			<template slot="atmosphericPressureTitle">
				气压(hpa) <a @click="showAdd('atmosphericPressure')" style="color: #1890ff;">批</a>
			</template>
			<template slot="atmosphericPressure" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleWaterWasteList[index].atmosphericPressure" :maxLength="maxLength"/>
			</template>

			<template slot="windVelocityTitle">
				风速(m/s) <a @click="showAdd('windVelocity')" style="color: #1890ff;">批</a>
			</template>
			<template slot="windVelocity" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleWaterWasteList[index].windVelocity" :maxLength="maxLength"/>
			</template>

			<template slot="windDirectionTitle">
				风向 <a @click="showAdd('windDirection')" style="color: #1890ff;">批</a>
			</template>
			<template slot="windDirection" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleWaterWasteList[index].windDirection" :maxLength="maxLength"/>
			</template>

			<template slot="fixativeTitle">
				固定剂 <a @click="showAdd('fixative')" style="color: #1890ff;">批</a>
			</template>
			<template slot="fixative" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleWaterWasteList[index].fixative" :maxLength="200"/>
			</template>

			<template slot="preservativeTitle">
				保存条件 <a @click="showAdd('preservative')" style="color: #1890ff;">批</a>
			</template>
			<template slot="preservative" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleWaterWasteList[index].preservative" :maxLength="200"/>
			</template>

			<template slot="remarkTitle">
				感官描述 <a @click="showAdd('remark')" style="color: #1890ff;">批</a>
			</template>
			<template slot="remark" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleWaterWasteList[index].remark" :maxLength="200"/>
			</template>

		</a-table>

		<!-- -------------------- 批量录入 开始 -------------------- -->
		<a-modal title="批量录入" v-model="visible" :close-on-click-modal="false" :close-on-press-escape="false"
				 :getContainer="getContainer"
				 width="300px" :append-to-body="true" @cancel="cancel" @ok="submit">

			<a-row :gutter="8">
				<a-input v-model="enterBatchContent" :maxLength="maxLength"/>
			</a-row>

			<template slot="footer">
				<a-button key="submit" type="primary" @click="submit">
					确定
				</a-button>
				<a-button key="back" @click="cancel">
					取消
				</a-button>
			</template>

		</a-modal>
		<!-- -------------------- 批量录入 结束 -------------------- -->

	</div>

</template>

<script>
	const tableColumns = [
		{
			title: '频次',
			dataIndex: 'rate',
			align: 'center',
			fixed: 'left',
			width: 70
		},
		{
			title: '样品编码',
			dataIndex: 'sampleCode',
			align: 'center',
			fixed: 'left',
			width: 160
		},
		{
			title: '检测项目',
			dataIndex: 'detectItem',
			align: 'center',
			fixed: 'left',
			width: 160
		},
		{
			title: '样品数量',
			dataIndex: 'sampleCount',
			align: 'center',
			fixed: 'left',
			width: 70
		},
		{
			dataIndex: 'samplingTime',
			align: 'center',
			slots: {title: 'samplingTimeTitle'},
			scopedSlots: {customRender: 'samplingTime'}
		},
		{
			dataIndex: 'discharge',
			align: 'center',
			slots: {title: 'dischargeTitle'},
			scopedSlots: {customRender: 'discharge'}
		},
		{
			dataIndex: 'waterTemperature',
			align: 'center',
			slots: {title: 'waterTemperatureTitle'},
			scopedSlots: {customRender: 'waterTemperature'}
		},
		{
			dataIndex: 'airTemperature',
			align: 'center',
			slots: {title: 'airTemperatureTitle'},
			scopedSlots: {customRender: 'airTemperature'}
		},
		{
			dataIndex: 'atmosphericPressure',
			align: 'center',
			slots: {title: 'atmosphericPressureTitle'},
			scopedSlots: {customRender: 'atmosphericPressure'}
		},
		{
			dataIndex: 'windVelocity',
			align: 'center',
			slots: {title: 'windVelocityTitle'},
			scopedSlots: {customRender: 'windVelocity'}
		},
		{
			dataIndex: 'windDirection',
			align: 'center',
			slots: {title: 'windDirectionTitle'},
			scopedSlots: {customRender: 'windDirection'}
		},
		{
			dataIndex: 'fixative',
			align: 'center',
			slots: {title: 'fixativeTitle'},
			scopedSlots: {customRender: 'fixative'}
		},
		{
			dataIndex: 'preservative',
			align: 'center',
			slots: {title: 'preservativeTitle'},
			scopedSlots: {customRender: 'preservative'}
		},
		{
			dataIndex: 'remark',
			align: 'center',
			slots: {title: 'remarkTitle'},
			scopedSlots: {customRender: 'remark'}
		}
	]

	export default {
		name: 'sampleWaterWaste',
		watch: {
			chooseVisible(val) {
				console.log(val);
				if (val) {
					this.init();
				}
			}
		},
		components: {},
		data() {
			return {
				tableColumns,
				// 添加仪器数据显示
				visible: false,
				// 记录批量修改的列
				enterBatchColumn: '',
				// 批量修改的列内容
				enterBatchContent: '',
				// 选中的记录行
				selectedRowKeys: [],
				// 输入长度限制
				maxLength: 50
			}
		},
		props: {
			extendedProperties: {
				// 出参结果数据列表
				sampleWaterWasteList: []
			}
		},
		mounted() {
			console.log('sampleWaterWaste');
			this.init();
		},
		methods: {
			init() {
				if (this.extendedProperties.itemInfoList) {
					this.$set(this.extendedProperties, 'sampleWaterWasteList', this.extendedProperties.itemInfoList);
				}
			},
			refill() {
			},
			// 批量录入
			showAdd(column) {
				if (this.selectedRowKeys.length != 0) {
					this.enterBatchColumn = column;
					this.enterBatchContent = "";
					this.visible = true;
				} else {
					this.$message.warning('请选择需要批量修改行数据');
				}
			},
			onSelectChange(selectedRowKeys, selectedRow) {
				this.selectedRowKeys = selectedRowKeys;
			},
			// 确定选择
			submit() {
				if (this.enterBatchContent != '') {
					this.selectedRowKeys.forEach((data) => {
						this.extendedProperties.sampleWaterWasteList[data][this.enterBatchColumn] = this.enterBatchContent;
					});
				}
				this.cancel();
			},
			// 取消选择
			cancel() {
				this.visible = false;
			},
			getContainer() {
				return this.$parent.$el;

			}
		}
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
