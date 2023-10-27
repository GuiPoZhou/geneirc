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
		<el-table :data.sync="extendedProperties.calibrationGasList" @selection-change="handleSelectionChange" ref="multipleTable">
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
						<el-form-item label="标气编号" prop="calibrationGasNumber">
							<el-input v-model="saveForm.calibrationGasNumber" placeholder="请输入标气编号" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="标准气浓度" prop="gasConcentration">
							<el-input v-model="saveForm.gasConcentration" placeholder="请输入标准气体（mg/m3）" @input="calcValue()"/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="采样前测定值（mg/m3）" prop="beforeValue">
							<el-input v-model="saveForm.beforeValue" placeholder="请输入采样前测定值（mg/m3）"  @input="calcValue()"/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="采样前相对误差（％）" prop="beforeDeviation">
							<el-input v-model="saveForm.beforeDeviation" placeholder="请输入采样前相对误差（％）"  @input="calcValue()"/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="是否合格" prop="beforeQualified">
							<el-select v-model="saveForm.beforeQualified" placeholder="请选择是否合格">
								<el-option :key="'是'" :label="'是'" :value="'是'" />
								<el-option :key="'否'" :label="'否'" :value="'否'" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="采样后测定值（mg/m3）" prop="afterValue">
							<el-input v-model="saveForm.afterValue" placeholder="请输入采样后测定值（mg/m3）"  @input="calcValue()"/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="采样后相对误差（％）" prop="afterDeviation">
							<el-input v-model="saveForm.afterDeviation" placeholder="请输入采样后相对误差（％）"  @input="calcValue()"/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="是否合格" prop="afterQualified">
							<el-select v-model="saveForm.afterQualified" placeholder="请选择是否合格">
								<el-option :key="'是'" :label="'是'" :value="'是'" />
								<el-option :key="'否'" :label="'否'" :value="'否'" />
							</el-select>
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
    <multipleEditForm :multipleEditFormShow.sync="multipleEditFormShow" :dataList.sync="selectList" :item="multipleEditItem" @editSubmitForm="editSubmitForm"/>
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
		name: 'calibrationGas',
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
          key: 'calibrationGasNumber',
          label: '标气编号',
          type: 'input',
          options: [],
        },{
          key: 'gasConcentration',
          label: '标准气浓度',
          type: 'input',
          options: [],
        },{
          key: 'beforeValue',
          label: '采样前测定值（mg/m3）',
          type: 'input',
          options: [],
        },{
          key: 'beforeDeviation',
          label: '采样前相对误差（％）',
          type: 'input',
          options: [],
        },{
          key: 'beforeQualified',
          label: '是否合格',
          type: 'select',
          options: [{
            dictValue: "是"
          },{
            dictValue: "否"
          }],
        },{
          key: 'afterValue',
          label: '采样后测定值（mg/m3）',
          type: 'input',
          options: [],
        },{
          key: 'afterDeviation',
          label: '采样后相对误差（％）',
          type: 'input',
          options: [],
        },{
          key: 'afterQualified',
          label: '是否合格',
          type: 'select',
          options: [{
            dictValue: "是"
          },{
            dictValue: "否"
          }],
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
				multiple: true,
				selectList: [],
				saveForm:{
					correctionItem: null,
					calibrationGasNumber: null,
					gasConcentration: null,
					beforeValue: null,
					beforeDeviation: null,
					beforeQualified: null,
					afterValue: null,
					afterDeviation: null,
					afterQualified: null,
					remark: null,
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
				calibrationGasList: [],
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
						this.extendedProperties.calibrationGasList[data][this.enterBatchColumn] = this.enterBatchContent;
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
						calibrationGasNumber: null,
						gasConcentration: null,
						beforeValue: null,
						beforeDeviation: null,
						beforeQualified: null,
						afterValue: null,
						afterDeviation: null,
						afterQualified: null,
						remark: null,
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
						calibrationGasNumber: this.selectList[0].calibrationGasNumber,
						gasConcentration: this.selectList[0].gasConcentration,
						beforeValue: this.selectList[0].beforeValue,
						beforeDeviation: this.selectList[0].beforeDeviation,
						beforeQualified: this.selectList[0].beforeQualified,
						afterValue: this.selectList[0].afterValue,
						afterDeviation: this.selectList[0].afterDeviation,
						afterQualified: this.selectList[0].afterQualified,
						remark: this.selectList[0].remark,
					}
				}
			},
			submitForm(){
				this.selectList.forEach(item => {
					this.$set(item, 'correctionItem', this.saveForm.correctionItem);
					this.$set(item, 'calibrationGasNumber', this.saveForm.calibrationGasNumber);
					this.$set(item, 'gasConcentration', this.saveForm.gasConcentration);
					this.$set(item, 'beforeValue', this.saveForm.beforeValue);
					this.$set(item, 'beforeDeviation', this.saveForm.beforeDeviation);
					this.$set(item, 'beforeQualified', this.saveForm.beforeQualified);
					this.$set(item, 'afterValue', this.saveForm.afterValue);
					this.$set(item, 'afterDeviation', this.saveForm.afterDeviation);
					this.$set(item, 'afterQualified', this.saveForm.afterQualified);
					this.$set(item, 'remark', this.saveForm.remark);
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
					this.extendedProperties.calibrationGasList.splice(index, 1);
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
				console.log('equipmentSubmit', this.extendedProperties.calibrationGasList)
				if(this.extendedProperties.calibrationGasList){
					console.log('equipmentSubmit push');
					this.extendedProperties.calibrationGasList.push(...this.equipmentChooseDataList);
				}else{
					console.log('equipmentSubmit set');
					this.$set(this.extendedProperties, 'calibrationGasList', JSON.parse(JSON.stringify(this.equipmentChooseDataList)))
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
				let tempRow = JSON.parse(JSON.stringify(this.extendedProperties.calibrationGasList[index]));
				this.extendedProperties.calibrationGasList.push(tempRow);
			},
			calcValue(){
				let beforeDeviation = (this.saveForm.beforeValue - this.saveForm.gasConcentration) / this.saveForm.gasConcentration * 100
				if(!isNaN(beforeDeviation)){
					this.saveForm.beforeDeviation = beforeDeviation.toFixed(1);
				}
				let afterDeviation = (this.saveForm.afterValue - this.saveForm.gasConcentration) / this.saveForm.gasConcentration * 100
				if(!isNaN(afterDeviation)){
					this.saveForm.afterDeviation = afterDeviation.toFixed(1);
				}
			},
      multipleColumnShow(item){
        this.multipleEditFormShow = true;
        this.multipleEditItem = item;
      },
      editSubmitForm(data){
        data.forEach(item => {
          let beforeDeviation = (item.beforeValue - item.gasConcentration) / item.gasConcentration * 100
          if(!isNaN(beforeDeviation)){
            item.beforeDeviation = beforeDeviation.toFixed(1);
          }
          let afterDeviation = (item.afterValue - item.gasConcentration) / item.gasConcentration * 100
          if(!isNaN(afterDeviation)){
            item.afterDeviation = afterDeviation.toFixed(1);
          }
        })
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
