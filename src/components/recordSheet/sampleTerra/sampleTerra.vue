<template>
	<div style="flex:1">

		<a-row>
			<a-col span="21">
				<div class="selected">
					<span>土壤采样信息</span>
				</div>
			</a-col>
		</a-row>

		<a-table :columns="tableColumns" rowKey="dataIndex" :scroll="{ x: 1200 }" bordered
				 :data-source="extendedProperties.sampleTerraList"
				 :row-selection="{columnWidth: 50, selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
				 :pagination="false">

			<template slot="samplingTimeTitle">
				采样时间 <a @click="showAdd('samplingTime')" style="color: #1890ff;">批</a>
			</template>
			<template slot="samplingTime" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleTerraList[index].samplingTime" :maxLength="maxLength"/>
			</template>

			<template slot="samplingVolumeTitle">
				采样量 <a @click="showAdd('samplingVolume')" style="color: #1890ff;">批</a>
			</template>
			<template slot="samplingVolume" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleTerraList[index].samplingVolume" :maxLength="maxLength"/>
			</template>

			<template slot="preservativeTitle">
				保存条件 <a @click="showAdd('preservative')" style="color: #1890ff;">批</a>
			</template>
			<template slot="preservative" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleTerraList[index].preservative" :maxLength="maxLength"/>
			</template>

			<template slot="colorTitle">
				颜色 <a @click="showAdd('color')" style="color: #1890ff;">批</a>
			</template>
			<template slot="color" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleTerraList[index].color" :maxLength="maxLength"/>
			</template>

			<template slot="textureTitle">
				质地 <a @click="showAdd('texture')" style="color: #1890ff;">批</a>
			</template>
			<template slot="texture" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleTerraList[index].texture" :maxLength="maxLength"/>
			</template>

			<template slot="humidityTitle">
				湿度 <a @click="showAdd('humidity')" style="color: #1890ff;">批</a>
			</template>
			<template slot="humidity" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleTerraList[index].humidity" :maxLength="maxLength"/>
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
			title: '深度',
			dataIndex: 'deep',
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
			dataIndex: 'samplingVolume',
			align: 'center',
			slots: {title: 'samplingVolumeTitle'},
			scopedSlots: {customRender: 'samplingVolume'}
		},
		{
			dataIndex: 'preservative',
			align: 'center',
			slots: {title: 'preservativeTitle'},
			scopedSlots: {customRender: 'preservative'}
		},
		{
			title: '样品描述',
			children: [
				{
					dataIndex: 'color',
					align: 'center',
					slots: {title: 'colorTitle'},
					scopedSlots: {customRender: 'color'}
				},
				{
					dataIndex: 'texture',
					align: 'center',
					slots: {title: 'textureTitle'},
					scopedSlots: {customRender: 'texture'}
				},
				{
					dataIndex: 'humidity',
					align: 'center',
					slots: {title: 'humidityTitle'},
					scopedSlots: {customRender: 'humidity'}
				}
			]
		}
	]

	export default {
		name: 'sampleTerra',
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
				maxLength: 50,
			}
		},
		props: {
			extendedProperties: {
				// 出参结果数据列表
				sampleTerraList: []
			}
		},
		mounted() {
			console.log('sampleTerra');
			this.init();
			this.refill();
		},
		methods: {
			init() {
				if (this.extendedProperties.itemGroupInfoList) {
					this.$set(this.extendedProperties, 'sampleTerraList', this.extendedProperties.itemGroupInfoList);
				}
			},
			refill() {
			},
			// 批量录入
			showAdd(column) {
				if (this.selectedRowKeys.length != 0) {
					this.enterBatchContent = "";
					this.visible = true;
				} else {
					this.$message.warning('请选择需要批量修改行数据');
				}
				this.enterBatchColumn = column;
			},
			onSelectChange(selectedRowKeys, selectedRow) {
				this.selectedRowKeys = selectedRowKeys;
			},
			// 确定选择
			submit() {
				if (this.enterBatchContent != '') {
					this.selectedRowKeys.forEach((data) => {
						this.extendedProperties.sampleTerraList[data][this.enterBatchColumn] = this.enterBatchContent;
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
