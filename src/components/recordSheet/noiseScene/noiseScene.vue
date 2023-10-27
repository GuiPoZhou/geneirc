<template>
	<div style="flex:1">

		<a-row>
			<a-col span="20">
				<div class="selected">
          <span>{{label}}</span>
				</div>
			</a-col>
			<a-col span="2" v-if="extendedProperties.formShowType === 0">
				<el-button type="primary" size="mini"  @click="saveFormShow = true" :disabled="multiple">
					编辑监测信息
				</el-button>
			</a-col>
			<a-col span="2" v-if="extendedProperties.formShowType === 0">
				<el-button type="primary" size="mini"  @click="showAdd" :disabled="multiple">
					选择检测仪器
				</el-button>
			</a-col>
		</a-row>
		<el-table :data.sync="extendedProperties.noiseSceneList" @selection-change="handleSelectionChange" ref="multipleTable">
			<el-table-column type="selection" width="55" align="center"/>
			<el-table-column label="序号" align="center" type="index" width="50"/>
			<el-table-column label="样品编码" align="center" prop="sampleCode" :show-overflow-tooltip="true"/>
			<el-table-column label="检测项目" align="center" prop="itemName" :show-overflow-tooltip="true"/>
			<el-table-column label="样品类型" align="center" prop="sampleType" :show-overflow-tooltip="true">
				<template  scope="scope">
					<span>{{parseSampleType(scope.row.sampleType)}}</span>
				</template>
			</el-table-column>
			<el-table-column label="样品数量" align="center" prop="sampleCount" :show-overflow-tooltip="true"/>
      <tableColumn :item="item" :multiple="multiple" @multipleColumnShow="multipleColumnShow" v-for="item in multipleColumnsConfig"/>
			<el-table-column label="检测仪器" align="center" prop="instrumentInfoList" :show-overflow-tooltip="true">
				<template  scope="scope">
					<el-link @click="showInstrumentInfoList(scope.row)">{{(scope.row.instrumentInfoList ? scope.row.instrumentInfoList.length : 0)}}</el-link>
				</template>
			</el-table-column>
		</el-table>

		<!-- -------------------- 编辑采样信息 开始 -------------------- -->

		<el-dialog :title="'噪声监测'" :visible.sync="saveFormShow"
							 class="elDialog" width="70%" append-to-body :destroy-on-close="true" :close-on-click-modal="false" :before-close="beforeClose" @open="openEvent">
			<el-form ref="form" :model="saveForm" :disabled="extendedProperties.formShowType !== 0" size="small" label-width="150px">
				<el-row>
					<el-col :span="24">
						<el-form-item label="采样时间" prop="sampleTime">
							<el-time-picker v-model="saveForm.sampleTime" value-format="HH:mm" format="HH:mm" placeholder="请输入采样时间" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="测量时间(min)" prop="gaugeTime">
							<el-input v-model="saveForm.gaugeTime" placeholder="请输入测量时间(min)" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="主要声源" prop="soundSource">
							<el-input v-model="saveForm.soundSource" placeholder="请输入主要声源" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="测量值dB(A)" prop="measurement">
							<el-input v-model="saveForm.measurement" placeholder="请输入测量值dB(A)" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm" >确 定</el-button>
				<el-button @click="cancelSaveForm">取 消</el-button>
			</div>
		</el-dialog>
		<!-- -------------------- 编辑采样信息 结束 -------------------- -->

		<!-- -------------------- 选择仪器 开始 -------------------- -->
		<a-modal title="选择仪器" v-model="equipmentVisible" :close-on-click-modal="false" :close-on-press-escape="false"
				 :getContainer="getContainer" width="1000px" @cancel="equipmentCancel" @ok="equipmentSubmit" >
			<a-row :gutter="8">
				<a-col :span="6">
					<a-form-item label="仪器名称" prop="equipmentName">
						<a-input v-model="equipmentQueryParam.equipmentName"/>
					</a-form-item>
				</a-col>
				<a-col :span="6">
					<a-form-item label="仪器编码" prop="equipmentNumber">
						<a-input v-model="equipmentQueryParam.equipmentNumber"/>
					</a-form-item>
				</a-col>
				<a-col :span="6">
					<a-form-item label="仪器型号" prop="equipmentModel">
						<a-input v-model="equipmentQueryParam.equipmentModel"/>
					</a-form-item>
				</a-col>
				<a-col :span="6">
					<a-form-item>
						<a-button @click="equipmentQuery" type="primary" icon="search" >查询</a-button>
					</a-form-item>
				</a-col>
			</a-row>

			<a-table :columns="equipmentColumns" rowKey="dataIndex"
					 :data-source="equipmentDataList"
					 :row-selection="{selectedRowKeys: equipmentSelectedRowKeys, onChange: onEquipmentSelectChange}"
					 :pagination="false">
			</a-table>

			<template slot="footer">
				<a-button key="submit" type="primary" @click="equipmentSubmit">
					确定
				</a-button>
				<a-button key="back" @click="equipmentCancel">
					取消
				</a-button>
			</template>

		</a-modal>
		<!-- -------------------- 选择仪器 结束 -------------------- -->

		<el-dialog :title="'编辑仪器'" :visible.sync="recordInstrumentInfoListShow" v-if="recordInstrumentInfoListShow"
				   class="elDialog" width="70%" append-to-body :destroy-on-close="true" :close-on-click-modal="false" :before-close="instrumentInfoListBeforeClose" @open="instrumentInfoListOpenEvent">
			<el-table :data="selectRowInstrumentInfoList">
				<el-table-column label="序号" align="center" type="index" width="50"/>
				<el-table-column label="仪器编号" align="center" prop="equipmentNumber" :show-overflow-tooltip="true"/>
				<el-table-column label="仪器名称" align="center" prop="equipmentName" :show-overflow-tooltip="true"/>
				<el-table-column label="仪器型号" align="center" prop="equipmentModel" :show-overflow-tooltip="true"/>
				<el-table-column  label="操作" >
					<template slot-scope="scope">
						<el-button size="mini" type="text" icon="el-icon-delete" @click="deleteHandle(scope.row, scope.$index)" >
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="instrumentInfoListSubmitForm" >确 定</el-button>
				<el-button @click="instrumentInfoListCancelSaveForm">取 消</el-button>
			</div>
		</el-dialog>

    <multipleEditForm :multipleEditFormShow.sync="multipleEditFormShow" :dataList.sync="selectList" :item="multipleEditItem"/>
	</div>

</template>

<script>
	import {queryEquipmentList4RecordSheet} from "@/api/recordSheet/config";
  import tableColumn from '@/components/recordSheet/multipleColumn/tableColumn';
  import multipleEditForm from '@/components/recordSheet/multipleColumn/editForm';
	const equipmentColumns = [
		{
			title: '序号',
			dataIndex: 'index',
			width: 65,
			align: 'center',
			customRender: (text, record, index) => `${index + 1}`
		},
		{
			title: '仪器编号',
			dataIndex: 'equipmentNumber',
			align: 'center'
		},
		{
			title: '仪器名称',
			dataIndex: 'equipmentName',
			align: 'center'
		},
		{
			title: '仪器型号',
			dataIndex: 'equipmentModel',
			align: 'center'
		},
		{
			title: '仪器分类',
			dataIndex: 'equipmentClassName',
			align: 'center'
		}
	]
	export default {
		name: 'noiseScene',
		watch: {
			chooseVisible(val) {
				console.log(val);
				if (val) {
					this.init();
				}
			}
		},
    components: {
      tableColumn,
      multipleEditForm
    },
    computed: {
      multipleColumnsConfig() {
        return [{
          key: 'sampleTime',
          label: '采样时间',
          type: 'time',
          options: [],
        },{
          key: 'gaugeTime',
          label: '测量时间(min)',
          type: 'input',
          options: [],
        },{
          key: 'soundSource',
          label: '主要声源',
          type: 'input',
          options: [],
        },{
          key: 'measurement',
          label: '测量值dB(A)',
          type: 'input',
          options: [],
        }];
      },
    },
		data() {
			return {
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

				// 环境空气采样
				saveFormShow: false,
				multiple: true,
				selectList: [],
				saveForm:{
					sampleTime: null,
					gaugeTime: null,
					soundSource: null,
					measurement: null,
				},
				options: [],
				// 添加仪器数据显示
				equipmentVisible: false,
				// 选择仪器查询
				equipmentQueryParam: {
					equipmentName: "",
					equipmentNumber: "",
					equipmentModel: ""
				},
				// 仪器列表数据
				equipmentDataList: [],
				// 仪器选中key列表
				equipmentSelectedRowKeys: [],
				// 仪器选中列表数据
				equipmentChooseDataList: [],
				equipmentColumns,
				selectRow: null,
				recordInstrumentInfoListShow: false,
				selectRowInstrumentInfoList: [],
        multipleEditFormShow: false,
        multipleEditItem: null,
			}
		},
		props: {
			extendedProperties: {
				// 出参结果数据列表
				noiseSceneList: []
			},
      label: {
        type: String,
        default: ''
      }
		},
		mounted() {
			this.init();
			this.refill();
		},
		methods: {
			getContainer() {
				return this.$parent.$el;
			},
			init() {

				if (this.extendedProperties.itemInfoList) {
					let list = JSON.parse(JSON.stringify(this.extendedProperties.itemInfoList.filter(item => item.sceneDetect === '是')));
					list = JSON.parse(JSON.stringify(this.extendedProperties.itemInfoList));
					this.$set(this.extendedProperties, 'noiseSceneList', list);
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
						this.extendedProperties.noiseSceneList[data][this.enterBatchColumn] = this.enterBatchContent;
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
			},
			handleSelectionChange(row){
				console.log('handleSelectionChange', row);
				this.selectList = row;
				this.multiple = !row.length;
			},
			beforeClose(){

			},
			openEvent(){
				console.log('saveFormOpenEvent...');

				if(this.selectList.length === 1){
					this.saveForm = {
						sampleTime: this.selectList[0].sampleTime,
						gaugeTime: this.selectList[0].gaugeTime,
						soundSource: this.selectList[0].soundSource,
						measurement: this.selectList[0].measurement,
					}
				}else{
					this.saveForm = {
						sampleTime: null,
						gaugeTime: null,
						soundSource: null,
						measurement: null,
					}
          for(let key in this.saveForm){
            let lastValue = this.selectList[0][key];
            let diff = false;
            this.selectList.forEach(async item => {
              if(lastValue !== item[key]){
                diff = true;
              }
            })
            if(!diff){
              this.$set(this.saveForm, key, lastValue);
            }

          }
				}
			},
			submitForm(){
				this.selectList.forEach(item => {
					this.$set(item, 'sampleTime', this.saveForm.sampleTime);
					this.$set(item, 'gaugeTime', this.saveForm.gaugeTime);
					this.$set(item, 'soundSource', this.saveForm.soundSource);
					this.$set(item, 'measurement', this.saveForm.measurement);
				});
				this.saveFormShow = false;
			},
			cancelSaveForm(){
				this.saveFormShow = false;
			},
			// 添加选择仪器
			showAdd() {
				this.equipmentVisible = true;
				this.equipmentQueryParam = {
					equipmentName: "",
					equipmentNumber: "",
					equipmentModel: ""
				}
				this.equipmentQuery();
				this.equipmentSelectedRowKeys = [];
				this.equipmentChooseDataList = [];
			},
			// 选择仪器查询
			equipmentQuery() {
				this.loading = true;
				if(this.extendedProperties.entrustId){
					this.equipmentQueryParam.entrustId = this.extendedProperties.entrustId
				}
				queryEquipmentList4RecordSheet(this.equipmentQueryParam).then(response => {
					this.equipmentDataList = response.data;
					this.loading = false;
				})
			},
			onEquipmentSelectChange(selectedRowKeys, selectedRow) {
				this.equipmentSelectedRowKeys = selectedRowKeys;
				this.equipmentChooseDataList = selectedRow;
			},
			// 确定选择
			equipmentSubmit() {
				this.selectList.forEach(item => {
					this.$set(item, 'instrumentInfoList', this.equipmentChooseDataList);
				})
				this.equipmentCancel();
			},
			// 取消选择
			equipmentCancel() {
				this.equipmentVisible = false;
			},
			showInstrumentInfoList(row){
				this.selectRow = row;
				this.selectRowInstrumentInfoList = row.instrumentInfoList ? JSON.parse(JSON.stringify(row.instrumentInfoList)) : [];
				this.recordInstrumentInfoListShow = true;
			},
			instrumentInfoListBeforeClose(){

			},
			instrumentInfoListOpenEvent(){

			},
			instrumentInfoListSubmitForm(){
				this.$set(this.selectRow, 'instrumentInfoList', this.selectRowInstrumentInfoList);
				this.recordInstrumentInfoListShow = false;
			},
			instrumentInfoListCancelSaveForm(){
				this.recordInstrumentInfoListShow = false;
			},
			deleteHandle(row, index){
				this.selectRowInstrumentInfoList.splice(index, 1);
			},
      multipleColumnShow(item){
        this.multipleEditFormShow = true;
        this.multipleEditItem = item;
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
