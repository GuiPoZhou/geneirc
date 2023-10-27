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
					编辑检测结果
				</el-button>
			</a-col>
			<a-col span="2" v-if="extendedProperties.formShowType === 0">
				<el-button type="primary" size="mini"  @click="showAdd" :disabled="multiple">
					选择检测仪器
				</el-button>
			</a-col>
		</a-row>
		<el-table :data.sync="extendedProperties.sheetSceneDetectList" @selection-change="handleSelectionChange" ref="multipleTable">
			<el-table-column type="selection" width="55" align="center"/>
			<el-table-column label="序号" align="center" type="index" width="50"/>
			<el-table-column label="样品编码" align="center" prop="sampleCode" :show-overflow-tooltip="true"/>
      <tableColumn :item="item" :multiple="multiple" @multipleColumnShow="multipleColumnShow" v-for="item in multipleColumnsConfig1"/>
			<el-table-column label="检测项目" align="center" prop="detectItem" :show-overflow-tooltip="true"/>
      <tableColumn :item="item" :multiple="multiple" @multipleColumnShow="multipleColumnShow" v-for="item in multipleColumnsConfig2"/>
			<el-table-column label="方法编号" align="center" prop="itemCode" :show-overflow-tooltip="true"/>
			<el-table-column label="执行标准" align="center" prop="executiveStandard" :show-overflow-tooltip="true"/>
			<el-table-column label="判定指标" align="center" prop="judgmentIndex" :show-overflow-tooltip="true"/>
      <tableColumn :item="item" :multiple="multiple" @multipleColumnShow="multipleColumnShow" v-for="item in multipleColumnsConfig3"/>
			<el-table-column label="检测仪器" align="center" prop="instrumentInfoList" :show-overflow-tooltip="true">
				<template  scope="scope">
					<el-link @click="showInstrumentInfoList(scope.row)">{{(scope.row.instrumentInfoList ? scope.row.instrumentInfoList.length : 0)}}</el-link>
				</template>
			</el-table-column>
		</el-table>

		<!-- -------------------- 编辑采样信息 开始 -------------------- -->

		<el-dialog :title="'检测结果'" :visible.sync="saveFormShow"
							 class="elDialog" width="70%" append-to-body :destroy-on-close="true" :ccalibrationTurbidityListlose-on-click-modal="false" :before-close="beforeClose" @open="openEvent">
			<el-form ref="form" :model="saveForm" :disabled="extendedProperties.formShowType !== 0" size="small" label-width="150px">
				<el-row>
					<el-col :span="22">
						<el-form-item label="开始时间" prop="startTime">
							<el-time-picker v-model="saveForm.startTime" value-format="HH:mm" format="HH:mm" placeholder="请输入开始时间" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="结束时间" prop="endTime">
							<el-time-picker v-model="saveForm.endTime" value-format="HH:mm" format="HH:mm" placeholder="请输入结束时间" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="检测结果" prop="detectResult">
							<el-input v-model="saveForm.detectResult" placeholder="请输入检测结果" />
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="结果单位" prop="detectResultUnitStr">
							<el-input v-model="saveForm.detectResultUnitStr" placeholder="请选择结果单位" :readOnly="true">
								<el-button slot="append" icon="el-icon-search" @click="getUnit" />
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="22">
						<el-form-item label="判定结论" prop="judgmentConclusion">
							<el-input v-model="saveForm.judgmentConclusion" placeholder="请输入判定结论" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm" >确 定</el-button>
				<el-button @click="cancelSaveForm">取 消</el-button>
			</div>
			<selectUnit :visible.sync="selectUnitShow"
									@backfill="changeUnit"/>
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
	import selectUnit from "@/components/common/selectUnit";
	import { getItemDefaultUnit } from "@/api/standardManagement/measuringUnit";
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
		name: 'sceneDetect',
		components: {
			selectUnit,
      tableColumn,
      multipleEditForm
		},
    computed: {
      multipleColumnsConfig1() {
        return [{
          key: 'startTime',
          label: '开始时间',
          type: 'time',
          options: [],
        },{
          key: 'endTime',
          label: '结束时间',
          type: 'time',
          options: [],
        }];
      },
      multipleColumnsConfig2() {
        return [{
          key: 'detectResult',
          label: '检测结果',
          type: 'input',
          options: [],
        },{
          key: 'detectResultUnitStr',
          label: '结果单位',
          type: 'unitSearch',
          options: [],
        }];
      },
      multipleColumnsConfig3() {
        return [{
          key: 'judgmentConclusion',
          label: '判定结论',
          type: 'input',
          options: [],
        }];
      },
    },
		watch: {
			chooseVisible(val) {
				console.log(val);
				if (val) {
					this.init();
				}
			}
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
				multiple: true,
				selectList: [],
				saveForm:{
					startTime: null,
					endTime: null,
					detectResult: null,
					detectResultUnit: null,
					detectResultUnitStr: null,
					itemCode: null,
					executiveStandard: null,
					judgmentIndex: null,
					judgmentConclusion: null,
				},
				options: [],
				// 单位选择显示
				selectUnitShow: false,
				// 单位选择内容
				selectUnitData: {},
				selectUnitId: "",
				selectUnitColumn: "",
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
				sheetSceneDetectList: []
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
					// let filterType = [5 ,6 ,7]
					// let list = JSON.parse(JSON.stringify(this.extendedProperties.itemInfoList.filter(item => !filterType.includes(item.sampleType) && item.sceneDetect === '是')));
					// 2021年8月26日 所有质控样全部录入
					let list = JSON.parse(JSON.stringify(this.extendedProperties.itemInfoList.filter(item => item.sceneDetect === '是')));
					this.$set(this.extendedProperties, 'sheetSceneDetectList', list);
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
						this.extendedProperties.sheetSceneDetectList[data][this.enterBatchColumn] = this.enterBatchContent;
					});
				}
				this.cancel();
			},
			// 取消选择
			cancel() {
				this.visible = false;
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
						startTime: this.selectList[0].startTime,
						endTime: this.selectList[0].endTime,
						detectResult: this.selectList[0].detectResult,
						detectResultUnit: this.selectList[0].detectResultUnit,
						itemCode: this.selectList[0].itemCode,
						executiveStandard: this.selectList[0].executiveStandard,
						judgmentIndex: this.selectList[0].judgmentIndex,
						judgmentConclusion: this.selectList[0].judgmentConclusion,
						detectResultUnitStr: this.selectList[0].detectResultUnitStr,
						instrumentInfoList: this.selectList[0].instrumentInfoList,
					};
					if(!this.saveForm.detectResultUnit){
						getItemDefaultUnit({
							itemId: this.selectList[0].itemId
						}).then(res => {
							if(res.data){
								this.$set(this.saveForm, 'detectResultUnit', res.data.id);
								this.$set(this.saveForm, 'detectResultUnitStr', res.data.unitName);
							}
						})
					}
				}else{
					this.saveForm = {
						startTime: null,
						endTime: null,
						detectResult: null,
						detectResultUnit: null,
						itemCode: null,
						executiveStandard: null,
						judgmentIndex: null,
						judgmentConclusion: null,
						detectResultUnitStr: null,
						instrumentInfoList: [],
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
					this.$set(item, 'startTime', this.saveForm.startTime);
					this.$set(item, 'endTime', this.saveForm.endTime);
					this.$set(item, 'detectResult', this.saveForm.detectResult);
					this.$set(item, 'detectResultUnit', this.saveForm.detectResultUnit);
					this.$set(item, 'detectResultUnitStr', this.saveForm.detectResultUnitStr);
					this.$set(item, 'judgmentConclusion', this.saveForm.judgmentConclusion);
					this.$set(item, 'instrumentInfoList', this.saveForm.instrumentInfoList);
				});
				this.saveFormShow = false;
			},
			cancelSaveForm(){
				this.saveFormShow = false;
			},
			// 选择单位
			getUnit() {
				this.selectUnitData = this.saveForm;
				// 结果单位
				this.selectUnitId = "detectUnit";
				this.selectUnitColumn = "detectUnitStr";
				this.selectUnitShow = true;
			},
			// 选择单位回调
			changeUnit(record) {
				this.$set(this.saveForm, 'detectResultUnit', record.id);
				this.$set(this.saveForm, 'detectResultUnitStr', record.unitName);
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
