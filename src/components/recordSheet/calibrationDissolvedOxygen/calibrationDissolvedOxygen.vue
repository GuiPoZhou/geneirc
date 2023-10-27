<template>
	<div style="flex:1">

		<a-row>
			<a-col span="20">
				<div class="selected">
          <span>{{label}}</span>
				</div>
			</a-col>
			<a-col span="2" v-if="extendedProperties.formShowType === 0">
				<el-button type="primary" size="mini"  @click="showAdd">
					选择检测仪器
				</el-button>
			</a-col>
			<a-col span="2" v-if="extendedProperties.formShowType === 0">
				<el-button type="primary" size="mini"  @click="showSaveForm(-1)" :disabled="multiple">
					编辑校正记录
				</el-button>
			</a-col>
		</a-row>
		<el-table :data.sync="extendedProperties.calibrationDissolvedOxygenList" @selection-change="handleSelectionChange" ref="multipleTable">
			<el-table-column type="selection" width="55" align="center"/>
			<el-table-column label="序号" align="center" type="index" width="50"/>
			<el-table-column label="仪器编号" align="center" prop="equipmentNumber" :show-overflow-tooltip="true"/>
			<el-table-column label="仪器名称" align="center" prop="equipmentName" :show-overflow-tooltip="true"/>
			<el-table-column label="仪器型号" align="center" prop="equipmentModel" :show-overflow-tooltip="true"/>
      <tableColumn :item="item" :multiple="multiple" @multipleColumnShow="multipleColumnShow" v-for="item in multipleColumnsConfig"/>
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150" >
				<template slot-scope="scope">
					<el-button size="mini" type="text" icon="el-icon-edit" @click="copyRow(scope.$index)" :disabled="extendedProperties.formShowType !== 0">
						复制
					</el-button>
					<el-button size="mini" type="text" icon="el-icon-edit" @click="handleDelete(scope.row, scope.$index)" :disabled="extendedProperties.formShowType !== 0">
						删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- -------------------- 编辑采样信息 开始 -------------------- -->

		<el-dialog :title="'标准记录'" :visible.sync="saveFormShow"
							 class="elDialog" width="70%" append-to-body :destroy-on-close="true" :close-on-click-modal="false" :before-close="beforeClose" @open="openEvent">
			<el-form ref="form" :model="saveForm" :disabled="extendedProperties.formShowType !== 0" size="small" label-width="200px">
				<el-row>
					<el-col :span="24">
						<el-form-item label="校正项目" prop="correctionItem">
							<el-input v-model="saveForm.correctionItem" placeholder="请输入校正项目" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="大气压" prop="atmosphericPressure">
							<el-input v-model="saveForm.atmosphericPressure" placeholder="请输入大气压" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="温度" prop="temperature">
							<el-input v-model="saveForm.temperature" placeholder="标准温度"/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="盐度" prop="salinity">
							<el-input v-model="saveForm.salinity" placeholder="校正盐度"/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="校正值" prop="value">
							<el-input v-model="saveForm.value" placeholder="校正值"/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="是否合格" prop="qualified">
							<el-select v-model="saveForm.qualified" placeholder="请选择是否合格">
								<el-option :key="'是'" :label="'是'" :value="'是'" />
								<el-option :key="'否'" :label="'否'" :value="'否'" />
							</el-select>
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
		name: 'calibrationDissolvedOxygen',
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
          key: 'correctionItem',
          label: '校正项目',
          type: 'input',
          options: [],
        },{
          key: 'atmosphericPressure',
          label: '大气压',
          type: 'input',
          options: [],
        },{
          key: 'temperature',
          label: '温度',
          type: 'input',
          options: [],
        },{
          key: 'salinity',
          label: '盐度',
          type: 'input',
          options: [],
        },{
          key: 'value',
          label: '校正值',
          type: 'input',
          options: [],
        },{
          key: 'qualified',
          label: '是否合格',
          type: 'select',
          options: [{
            dictValue: "是"
          },{
            dictValue: "否"
          }],
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
				multiple: true,
				selectList: [],
				saveForm:{
					correctionItem: null,
					atmosphericPressure: null,
					temperature: null,
					salinity: null,
					value: null,
					qualified: null,
				},
				options: [],
				nowEditIndex: null,

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
				calibrationDissolvedOxygenList: []
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
			},
			refill() {
			},
			onSelectChange(selectedRowKeys, selectedRow) {
				this.selectedRowKeys = selectedRowKeys;
			},
			// 确定选择
			submit() {
				if (this.enterBatchContent != '') {
					this.selectedRowKeys.forEach((data) => {
						this.extendedProperties.calibrationDissolvedOxygenList[data][this.enterBatchColumn] = this.enterBatchContent;
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
				if(this.selectList.length > 1){
					this.saveForm = {
						correctionItem: null,
						atmosphericPressure: null,
						temperature: null,
						salinity: null,
						value: null,
						qualified: null,
					};
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
				}else{
					this.saveForm = {
						correctionItem: this.selectList[0].correctionItem,
						atmosphericPressure: this.selectList[0].atmosphericPressure,
						temperature: this.selectList[0].temperature,
						salinity: this.selectList[0].salinity,
						value: this.selectList[0].value,
						qualified: this.selectList[0].qualified,
					}
				}
			},
			submitForm(){
				this.selectList.forEach(item => {
					this.$set(item, 'correctionItem', this.saveForm.correctionItem);
					this.$set(item, 'atmosphericPressure', this.saveForm.atmosphericPressure);
					this.$set(item, 'temperature', this.saveForm.temperature);
					this.$set(item, 'salinity', this.saveForm.salinity);
					this.$set(item, 'value', this.saveForm.value);
					this.$set(item, 'qualified', this.saveForm.qualified);
				})
				this.saveFormShow = false;
			},
			cancelSaveForm(){
				this.saveFormShow = false;
			},
			// 删除记录
			handleDelete(record, index) {
				this.$confirm('确认删除该标准信息?', "警告", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					this.extendedProperties.calibrationDissolvedOxygenList.splice(index, 1);
				});
			},
			showSaveForm(nowEditIndex){
				this.saveFormShow = true;
				this.nowEditIndex = nowEditIndex;
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
				console.log('equipmentSubmit', this.extendedProperties.calibrationDissolvedOxygenList)
				if(this.extendedProperties.calibrationDissolvedOxygenList){
					console.log('equipmentSubmit push');
					this.extendedProperties.calibrationDissolvedOxygenList.push(...this.equipmentChooseDataList);
				}else{
					console.log('equipmentSubmit set');
					this.$set(this.extendedProperties, 'calibrationDissolvedOxygenList', JSON.parse(JSON.stringify(this.equipmentChooseDataList)))
				}
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
				this.recordInstrumentInfoListShow = false;
			},
			instrumentInfoListCancelSaveForm(){
				this.recordInstrumentInfoListShow = false;
			},
			deleteHandle(row, index){
				this.selectRowInstrumentInfoList.splice(index, 1);
			},
			copyRow(index){
				let tempRow = JSON.parse(JSON.stringify(this.extendedProperties.calibrationDissolvedOxygenList[index]));
				this.extendedProperties.calibrationDissolvedOxygenList.push(tempRow);
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
