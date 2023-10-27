<template>
	<div style="flex:1">

		<a-row>
			<a-col span="21">
				<div class="selected">
					<span>检测信息</span>
				</div>
			</a-col>
		</a-row>

		<a-table :columns="tableColumns" rowKey="dataIndex" size="middle" bordered
				 :data-source="extendedProperties.sampleSceneNoiseList"
				 :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
				 :pagination="false">

			<template slot="startTimeTitle">
				检测时间 <a @click="showAdd('startTime')" style="color: #1890ff;">批</a>
			</template>
			<template slot="startTime" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleSceneNoiseList[index].startTime" :maxLength="maxLength"/>
			</template>

			<template slot="totalTimeTitle">
				测量时间（min） <a @click="showAdd('totalTime')" style="color: #1890ff;">批</a>
			</template>
			<template slot="totalTime" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleSceneNoiseList[index].totalTime" :maxLength="maxLength"/>
			</template>

			<template slot="measurementTitle">
				测量值dB(A) <a @click="showAdd('measurement')" style="color: #1890ff;">批</a>
			</template>
			<template slot="measurement" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleSceneNoiseList[index].measurement" :maxLength="maxLength"/>
			</template>

			<template slot="modelLargeTitle">
				车型（大） <a @click="showAdd('modelLarge')" style="color: #1890ff;">批</a>
			</template>
			<template slot="modelLarge" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleSceneNoiseList[index].modelLarge" :maxLength="maxLength"/>
			</template>

			<template slot="modelMediumTitle">
				车型（中） <a @click="showAdd('modelMedium')" style="color: #1890ff;">批</a>
			</template>
			<template slot="modelMedium" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleSceneNoiseList[index].modelMedium" :maxLength="maxLength"/>
			</template>

			<template slot="modelSmallTitle">
				车型（小） <a @click="showAdd('modelSmall')" style="color: #1890ff;">批</a>
			</template>
			<template slot="modelSmall" slot-scope="text, record, index">
				<a-input v-model="extendedProperties.sampleSceneNoiseList[index].modelSmall" :maxLength="maxLength"/>
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
			dataIndex: 'startTime',
			align: 'center',
			slots: {title: 'startTimeTitle'},
			scopedSlots: {customRender: 'startTime'}
		},
		{
			dataIndex: 'totalTime',
			align: 'center',
			slots: {title: 'totalTimeTitle'},
			scopedSlots: {customRender: 'totalTime'}
		},
		{
			dataIndex: 'measurement',
			align: 'center',
			slots: {title: 'measurementTitle'},
			scopedSlots: {customRender: 'measurement'}
		},
		{
			dataIndex: 'modelLarge',
			align: 'center',
			slots: {title: 'modelLargeTitle'},
			scopedSlots: {customRender: 'modelLarge'}
		},
		{
			dataIndex: 'modelMedium',
			align: 'center',
			slots: {title: 'modelMediumTitle'},
			scopedSlots: {customRender: 'modelMedium'}
		},
		{
			dataIndex: 'modelSmall',
			align: 'center',
			slots: {title: 'modelSmallTitle'},
			scopedSlots: {customRender: 'modelSmall'}
		}
	]

	export default {
		name: 'sceneNoiseDetect',
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
				sampleSceneNoiseList: []
			}
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
				if (this.extendedProperties.itemInfoList) {
					this.$set(this.extendedProperties, 'sampleSceneNoiseList', this.extendedProperties.itemInfoList);
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
						this.extendedProperties.sampleSceneNoiseList[data][this.enterBatchColumn] = this.enterBatchContent;
					});
				}
				this.cancel();
			},
			// 取消选择
			cancel() {
				this.visible = false;
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
