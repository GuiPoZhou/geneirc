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
		<el-table :data.sync="extendedProperties.smokePollutionList" @selection-change="handleSelectionChange" ref="multipleTable">
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

		<el-dialog :title="'烟气监测'" :visible.sync="saveFormShow"
							 class="elDialog" width="70%" append-to-body :destroy-on-close="true" :close-on-click-modal="false" :before-close="beforeClose" @open="openEvent">
			<el-form ref="form" :model="saveForm" :disabled="extendedProperties.formShowType !== 0" size="small" label-width="150px">
				<el-row>
					<el-col :span="24">
						<el-form-item label="开始时间" prop="startTime">
							<el-time-picker v-model="saveForm.startTime" value-format="HH:mm" format="HH:mm" placeholder="请输入开始时间" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="结束时间" prop="endTime">
							<el-time-picker v-model="saveForm.endTime" value-format="HH:mm" format="HH:mm" placeholder="请输入结束时间" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="含氧量(%)" prop="oxygenContent">
							<el-input v-model="saveForm.oxygenContent" placeholder="请输入含氧量(%)" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="实测浓度（mg/m3）" prop="measuredConcentration">
							<el-input v-model="saveForm.measuredConcentration" placeholder="请输入实测浓度（mg/m3）" />
						</el-form-item>
					</el-col>
          <el-col :span="24">
            <el-form-item label="计算方式" prop="calculation">
              <el-select v-model="saveForm.calculation" placeholder="请选择计算方式">
                <el-option :key="'基准氧含量'" :label="'基准氧含量'" :value="'基准氧含量'" />
                <el-option :key="'过量空气系数'" :label="'过量空气系数'" :value="'过量空气系数'" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="saveForm.calculation === '基准氧含量'">
            <el-form-item label="基准氧含量(%)" prop="baselineOxygenContent">
              <el-input v-model="saveForm.baselineOxygenContent" placeholder="请输入基准氧含量(%)" />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="saveForm.calculation === '过量空气系数'">
            <el-form-item label="过量空气系数" prop="excessAirCoefficient">
              <el-input v-model="saveForm.excessAirCoefficient" placeholder="请输入过量空气系数" />
            </el-form-item>
          </el-col>
					<el-col :span="24">
						<el-form-item label="烟气流速（m/s）" prop="flueGasFlowRate">
							<el-input v-model="saveForm.flueGasFlowRate" placeholder="请输入烟气流速（m/s）" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="烟气温度（℃）" prop="flueGasTemperature">
							<el-input v-model="saveForm.flueGasTemperature" placeholder="请输入烟气温度（℃）" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="烟气含湿量(%)" prop="smokeMoistureContent">
							<el-input v-model="saveForm.smokeMoistureContent" placeholder="请输入烟气含湿量(%)" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="标杆流量(m³/h)" prop="benchmarkFlow">
							<el-input v-model="saveForm.benchmarkFlow" placeholder="请输入标杆流量(m³/h)" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="备注" prop="remark">
							<el-input v-model="saveForm.remark" placeholder="请输入备注" />
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
		name: 'smokePollution',
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
          key: 'startTime',
          label: '开始时间',
          type: 'time',
          options: [],
        },{
          key: 'endTime',
          label: '结束时间',
          type: 'time',
          options: [],
        },{
          key: 'oxygenContent',
          label: '含氧量(%)',
          type: 'input',
          options: [],
        },{
          key: 'measuredConcentration',
          label: '实测浓度（mg/m3）',
          type: 'input',
          options: [],
        },{
          key: 'calculation',
          label: '计算方式',
          type: 'select',
          options: [{
            dictValue: '基准氧含量'
          },{
            dictValue: '过量空气系数'
          }],
        },{
          key: 'baselineOxygenContent',
          label: '基准氧含量',
          type: 'input',
          options: [],
        },{
          key: 'excessAirCoefficient',
          label: '过量空气系数',
          type: 'input',
          options: [],
        },{
          key: 'flueGasFlowRate',
          label: '烟气流速（m/s）',
          type: 'input',
          options: [],
        },{
          key: 'flueGasTemperature',
          label: '烟气温度（℃）',
          type: 'input',
          options: [],
        },{
          key: 'smokeMoistureContent',
          label: '烟气含湿量(%)',
          type: 'input',
          options: [],
        },{
          key: 'remark',
          label: '备注',
          type: 'textarea',
          options: [],
        },];
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
					oxygenContent: null,
					measuredConcentration: null,
					baselineOxygenContent: null,
					excessAirCoefficient: null,
					flueGasFlowRate: null,
					flueGasTemperature: null,
					smokeMoistureContent: null,
					benchmarkFlow: null,
					remark: null,
					instrumentInfoList: null,
				},
				options: [],
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
				smokePollutionList: []
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
				console.log('smokePollution.vue');
				if (this.extendedProperties.itemInfoList) {
					let list = JSON.parse(JSON.stringify(this.extendedProperties.itemInfoList.filter(item => item.sceneDetect === '是')));

					list.forEach(item => console.log(item)
					)
					this.$set(this.extendedProperties, 'smokePollutionList', list);
				}
			},
			refill() {
			},
			// 批量录入
			// showAdd(column) {
			// 	if (this.selectedRowKeys.length != 0) {
			// 		this.enterBatchColumn = column;
			// 		this.enterBatchContent = "";
			// 		this.visible = true;
			// 	} else {
			// 		this.$message.warning('请选择需要批量修改行数据');
			// 	}
			// },
			onSelectChange(selectedRowKeys, selectedRow) {
				this.selectedRowKeys = selectedRowKeys;
			},
			// 确定选择
			submit() {
				if (this.enterBatchContent != '') {
					this.selectedRowKeys.forEach((data) => {
						this.extendedProperties.smokePollutionList[data][this.enterBatchColumn] = this.enterBatchContent;
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
						startTime: this.selectList[0].startTime,
						endTime: this.selectList[0].endTime,
						oxygenContent: this.selectList[0].oxygenContent,
						measuredConcentration: this.selectList[0].measuredConcentration,
						baselineOxygenContent: this.selectList[0].baselineOxygenContent,
						excessAirCoefficient: this.selectList[0].excessAirCoefficient,
						flueGasFlowRate: this.selectList[0].flueGasFlowRate,
						flueGasTemperature: this.selectList[0].flueGasTemperature,
						smokeMoistureContent: this.selectList[0].smokeMoistureContent,
						benchmarkFlow: this.selectList[0].benchmarkFlow,
						remark: this.selectList[0].remark,
						instrumentInfoList: this.selectList[0].instrumentInfoList,
					}
				}else{
					this.saveForm = {
						startTime: null,
						endTime: null,
						oxygenContent: null,
						measuredConcentration: null,
						baselineOxygenContent: null,
						excessAirCoefficient: null,
						flueGasFlowRate: null,
						flueGasTemperature: null,
						smokeMoistureContent: null,
						benchmarkFlow: null,
						remark: null,
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
					this.$set(item, 'oxygenContent', this.saveForm.oxygenContent);
					this.$set(item, 'measuredConcentration', this.saveForm.measuredConcentration);
					this.$set(item, 'baselineOxygenContent', this.saveForm.baselineOxygenContent);
					this.$set(item, 'excessAirCoefficient', this.saveForm.excessAirCoefficient);
					this.$set(item, 'flueGasFlowRate', this.saveForm.flueGasFlowRate);
					this.$set(item, 'flueGasTemperature', this.saveForm.flueGasTemperature);
					this.$set(item, 'smokeMoistureContent', this.saveForm.smokeMoistureContent);
					this.$set(item, 'benchmarkFlow', this.saveForm.benchmarkFlow);
					this.$set(item, 'remark', this.saveForm.remark);
					this.$set(item, 'instrumentInfoList', this.saveForm.instrumentInfoList);
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
