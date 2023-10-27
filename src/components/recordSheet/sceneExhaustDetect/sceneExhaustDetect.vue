<template>
	<div style="flex:1">

		<a-row>
			<a-col :span="21">
				<div class="selected">
					<span>检测信息</span>
				</div>
			</a-col>
		</a-row>

		<a-form :form="data">
			<a-row>
				<a-col :span="8">
					<a-form-item label="检测设备名称：" :labelCol="labelCol">
						<a-input v-model="data.equipmentName"/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="运行负荷(%)：" :labelCol="labelCol">
						<a-input-number v-model="data.operatingLoad" :precision="2"/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="排气筒高度(m)：" :labelCol="labelCol">
						<a-input-number v-model="data.exhaustHeight" :precision="2"/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="排气筒直径(m)：" :labelCol="labelCol">
						<a-input-number v-model="data.exhaustDiameter" :precision="2"/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="采样咀直径(mm)：" :labelCol="labelCol">
						<a-input-number v-model="data.samplingDiameter" :precision="2"/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="等速流量(L/min)：" :labelCol="labelCol">
						<a-input-number v-model="data.velocityFlow" :precision="2"/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="烟温(℃)：" :labelCol="labelCol">
						<a-input-number v-model="data.smokeTemperature" :precision="2"/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="含湿量(%)：" :labelCol="labelCol">
						<a-input-number v-model="data.moistureContent" :precision="2"/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="基准氧含量(%)：" :labelCol="labelCol">
						<a-input-number v-model="data.oxygenContent" :precision="2"/>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>

		<a-row>
			<a-col :span="24">
				<a-table :columns="tableColumns"
						 :rowKey="record => record.sampleCodingItemPickId" :scroll="{ x: 1600 }" bordered
						 :data-source="extendedProperties.sampleSceneExhaustList"
						 :row-selection="{columnWidth: 50, selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
						 :pagination="false">

					<template slot="startTimeTitle">
						检测时间 <a @click="showAdd('startTime')" style="color: #1890ff;">批</a>
					</template>
					<template slot="startTime" slot-scope="text, record, index">
						<a-input v-model="extendedProperties.sampleSceneExhaustList[index].startTime" :maxLength="maxLength"/>
					</template>

					<template slot="samplingVolumeTitle">
						标况采样体积(L) <a @click="showAdd('samplingVolume')" style="color: #1890ff;">批</a>
					</template>
					<template slot="samplingVolume" slot-scope="text, record, index">
						<a-input v-model="extendedProperties.sampleSceneExhaustList[index].samplingVolume" :maxLength="maxLength"/>
					</template>

					<template slot="smokeFlowTitle">
						烟气流量(dNm³/h) <a @click="showAdd('smokeFlow')" style="color: #1890ff;">批</a>
					</template>
					<template slot="smokeFlow" slot-scope="text, record, index">
						<a-input v-model="extendedProperties.sampleSceneExhaustList[index].smokeFlow" :maxLength="maxLength"/>
					</template>

					<template slot="oxygenContentTitle">
						氧含量(%) <a @click="showAdd('oxygenContent')" style="color: #1890ff;">批</a>
					</template>
					<template slot="oxygenContent" slot-scope="text, record, index">
						<a-input v-model="extendedProperties.sampleSceneExhaustList[index].oxygenContent" :maxLength="maxLength"/>
					</template>

					<template slot="measuredConcentrationTitle">
						实测浓度(mg/m³) <a @click="showAdd('measuredConcentration')" style="color: #1890ff;">批</a>
					</template>
					<template slot="measuredConcentration" slot-scope="text, record, index">
						<a-input v-model="extendedProperties.sampleSceneExhaustList[index].measuredConcentration" :maxLength="maxLength"/>
					</template>

					<template slot="convertedConcentrationTitle">
						折算浓度(mg/m³) <a @click="showAdd('convertedConcentration')" style="color: #1890ff;">批</a>
					</template>
					<template slot="convertedConcentration" slot-scope="text, record, index">
						<a-input v-model="extendedProperties.sampleSceneExhaustList[index].convertedConcentration" :maxLength="maxLength"/>
					</template>

					<template slot="emissionsTitle">
						排放量(kg/h) <a @click="showAdd('emissions')" style="color: #1890ff;">批</a>
					</template>
					<template slot="emissions" slot-scope="text, record, index">
						<a-input v-model="extendedProperties.sampleSceneExhaustList[index].emissions" :maxLength="maxLength"/>
					</template>

					<template slot="remarkTitle">
						备注
					</template>
					<template slot="remark" slot-scope="text, record, index">
						<a-input v-model="extendedProperties.sampleSceneExhaustList[index].remark" :maxLength="maxLength"/>
					</template>

				</a-table>
			</a-col>
		</a-row>

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
			title: '现场检测',
			dataIndex: 'sceneDetect',
			align: 'center',
			fixed: 'left',
			width: 50
		},
		{
			title: '检测方法编号',
			dataIndex: 'itemCode',
			align: 'center',
			fixed: 'left',
			width: 160
		},
		{
			dataIndex: 'startTime',
			align: 'center',
			slots: {title: 'startTimeTitle'},
			scopedSlots: {customRender: 'startTime'}
		},
		{
			dataIndex: 'samplingVolume',
			align: 'center',
			slots: {title: 'samplingVolumeTitle'},
			scopedSlots: {customRender: 'samplingVolume'}
		},
		{
			dataIndex: 'smokeFlow',
			align: 'center',
			slots: {title: 'smokeFlowTitle'},
			scopedSlots: {customRender: 'smokeFlow'}
		},
		{
			dataIndex: 'oxygenContent',
			align: 'center',
			slots: {title: 'oxygenContentTitle'},
			scopedSlots: {customRender: 'oxygenContent'}
		},
		{
			dataIndex: 'measuredConcentration',
			align: 'center',
			slots: {title: 'measuredConcentrationTitle'},
			scopedSlots: {customRender: 'measuredConcentration'}
		},
		{
			dataIndex: 'convertedConcentration',
			align: 'center',
			slots: {title: 'convertedConcentrationTitle'},
			scopedSlots: {customRender: 'convertedConcentration'}
		},
		{
			dataIndex: 'emissions',
			align: 'center',
			slots: {title: 'emissionsTitle'},
			scopedSlots: {customRender: 'emissions'}
		},
		{
			dataIndex: 'remark',
			align: 'center',
			slots: {title: 'remarkTitle'},
			scopedSlots: {customRender: 'remark'}
		}
	]

	export default {
		name: 'sceneNoiseDetect',
		components: {},
		data() {
			return {
				labelCol: {
					span: 8
				},
				tableColumns,
				// 批量录入数据显示
				visible: false,
				// 记录批量修改的列
				enterBatchColumn: '',
				// 批量修改的列内容
				enterBatchContent: '',
				// 选中的记录行
				selectedRowKeys: [],
				data: {},
				// 输入长度限制
				maxLength: 50,
			}
		},
		props: {
			extendedProperties: {
				// 出参结果数据对象
				exhaustDetect: {},
				// 出参结果数据列表
				sampleSceneExhaustList: []
			}
		},
		watch: {
			'extendedProperties.editType': {
				handler: function (val, oldVal) {
					console.log('extendedProperties.editType', this.extendedProperties);
					if (this.extendedProperties.exhaustDetect) {
						this.data = this.extendedProperties.exhaustDetect;
					}
				},
			},
		},
		mounted() {
			console.log('sceneNoiseDetect');
			this.init();
			this.refill();
		},
		methods: {
			getContainer() {
				return this.$parent.$el;
			},
			init() {
				if (!this.extendedProperties.exhaustDetect) {
					this.$set(this.extendedProperties, 'exhaustDetect', {});
				}
				this.data = this.extendedProperties.exhaustDetect;
				if (this.extendedProperties.itemInfoList) {
					this.$set(this.extendedProperties, 'sampleSceneExhaustList', this.extendedProperties.itemInfoList);
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
						//sampleCodingItemPickId
						this.extendedProperties.sampleSceneExhaustList.forEach((item) => {
							if(item.sampleCodingItemPickId === data){
								item[this.enterBatchColumn] = this.enterBatchContent;
							}
						})
						// this.extendedProperties.sampleSceneExhaustList[data][this.enterBatchColumn] = this.enterBatchContent;
					});
				}
				this.cancel();
			},
			// 取消选择
			cancel() {
				this.visible = false;
			},
		}
	}
</script>

<style lang="less" scoped>

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

	/deep/ .ant-input-number {
		width: 100%;
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
