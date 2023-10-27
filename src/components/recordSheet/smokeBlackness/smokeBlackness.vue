<template>
	<div style="flex:1">

		<a-row>
			<a-col span="22">
				<div class="selected">
          <span>{{label}}</span>
				</div>
			</a-col>
		</a-row>
		<el-form ref="form1" :model="saveForm" :disabled="extendedProperties.formShowType !== 0" size="small" label-width="150px">
			<el-col :span="12">
				<el-form-item label="观测开始时间" prop="startTime">
					<el-time-picker v-model="saveForm.startTime" value-format="HH:mm" format="HH:mm" placeholder="请输入观测开始时间" @change="saveFormChange"/>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="观测结束时间" prop="startTime">
					<el-time-picker v-model="saveForm.endTime" value-format="HH:mm" format="HH:mm" placeholder="请输入观测结束时间" @change="saveFormChange"/>
				</el-form-item>
			</el-col>
		</el-form>
		<a-col span="2" v-if="extendedProperties.formShowType === 0">
			<el-button type="primary" size="mini"  @click="showAdd" :disabled="equipmentMultiple">
				选择检测仪器
			</el-button>
		</a-col>
		<el-table :data.sync="extendedProperties.smokeBlacknessTempList" ref="multipleTable" size="mini" @selection-change="handleEquipmentSelectionChange">
			<el-table-column type="selection" width="55" align="center"/>
			<el-table-column label="序号" align="center" type="index" width="50"/>
			<el-table-column label="样品编码" align="center" prop="sampleCode" :show-overflow-tooltip="true"/>
			<el-table-column label="检测项目" align="center" prop="itemName" :show-overflow-tooltip="true"/>
			<el-table-column label="检测方法编号" align="center" prop="itemCode" :show-overflow-tooltip="true"/>
			<el-table-column label="检测结果" align="center" prop="result" :show-overflow-tooltip="true">
        <template slot="header" slot-scope="scope">
          <el-row>
            <el-col :span="24">{{testResultsColumnConfig.label}}</el-col>
            <el-col :span="24"><el-button type="text" :disabled="equipmentMultiple" @click="multipleColumnShow(testResultsColumnConfig)">批量录入</el-button></el-col>
          </el-row>
        </template>
				<template scope="scope">
					<el-input v-model="scope.row.result" placeholder="请输入内容" @focus="showInputForm(scope.$index)" />
				</template>
			</el-table-column>
			<el-table-column label="检测仪器" align="center" prop="instrumentInfoList" :show-overflow-tooltip="true">
				<template  scope="scope">
					<el-link @click="showInstrumentInfoList(scope.row)">{{(scope.row.instrumentInfoList ? scope.row.instrumentInfoList.length : 0)}}</el-link>
				</template>
			</el-table-column>
		</el-table>
		<el-table :data.sync="statisticsList" ref="multipleTable1" size="mini">
			<el-table-column label="" align="center" prop="name" :show-overflow-tooltip="true"/>
			<el-table-column label="<1级" align="center" prop="level1" :show-overflow-tooltip="true"/>
			<el-table-column label="≥1级" align="center" prop="level2" :show-overflow-tooltip="true"/>
			<el-table-column label="≥2级" align="center" prop="level3" :show-overflow-tooltip="true"/>
			<el-table-column label="≥3级" align="center" prop="level4" :show-overflow-tooltip="true"/>
			<el-table-column label="≥4级" align="center" prop="level5" :show-overflow-tooltip="true"/>
			<el-table-column label="5级" align="center" prop="level6" :show-overflow-tooltip="true"/>
		</el-table>
		<a-col span="2" v-if="extendedProperties.formShowType === 0">
			<el-button type="primary" size="mini"  @click="saveFormShow = true" :disabled="multiple">
				编辑监测信息
			</el-button>
		</a-col>
		<el-table :data.sync="extendedProperties.smokeBlacknessObservedList" ref="multipleTable2" size="mini" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center"/>
			<el-table-column label="分/秒" align="center" prop="minute" :show-overflow-tooltip="true"/>
      <tableColumn :item="item" :multiple="multiple" @multipleColumnShow="multipleColumnShow1" v-for="item in multipleColumnsConfig"/>
		</el-table>


		<el-dialog :title="'录入检测结果'" :visible.sync="saveResultShow"
							 class="elDialog" width="70%" append-to-body :destroy-on-close="true" :close-on-click-modal="false" :before-close="beforeCloseResult" @open="openEventResult">
			<el-form ref="form" :model="saveForm" :disabled="extendedProperties.formShowType !== 0" size="small" label-width="200px">
				<el-col :span="24">
					<el-form-item label="烟气黑度（林格曼级）：" prop="result">
						<el-input v-model="saveForm.result" placeholder="请输入烟气黑度（林格曼级）：" />
					</el-form-item>
				</el-col>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitFormResult" >确 定</el-button>
				<el-button @click="cancelSaveFormResult">取 消</el-button>
			</div>
		</el-dialog>
		<!-- -------------------- 编辑采样信息 开始 -------------------- -->

		<el-dialog :title="'检测信息'" :visible.sync="saveFormShow"
							 class="elDialog" width="70%" append-to-body :destroy-on-close="true" :close-on-click-modal="false" :before-close="beforeClose" @open="openEvent">
			<el-form ref="form" :model="saveListForm" :disabled="extendedProperties.formShowType !== 0" size="small" label-width="150px">
				<el-row>
					<el-col :span="24">
						<el-form-item label="0" prop="second0">
							<el-input-number controls-position="right" :precision="2" :min="0" v-model="saveListForm.second0" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="15" prop="second15">
							<el-input-number controls-position="right" :precision="2" :min="0" v-model="saveListForm.second15" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="30" prop="second30">
							<el-input-number controls-position="right" :precision="2" :min="0" v-model="saveListForm.second30" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="45" prop="second45">
							<el-input-number controls-position="right" :precision="2" :min="0" v-model="saveListForm.second45" placeholder="请输入" />
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

    <multipleEditForm :multipleEditFormShow.sync="multipleEditFormShow" :dataList.sync="equipmentSelectList" :item="multipleEditItem"/>
    <multipleEditForm :multipleEditFormShow.sync="multipleEditFormShow1" :dataList.sync="selectList" :item="multipleEditItem" @editSubmitForm="editSubmitForm"/>
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
	];
  const testResultsColumnConfig = {
    key: 'result',
    label: '烟气黑度（林格曼级）',
    type: 'input',
    options: [],
  };
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
          key: 'second0',
          label: '0',
          type: 'number',
          options: [],
        },{
          key: 'second15',
          label: '15',
          type: 'number',
          options: [],
        },{
          key: 'second30',
          label: '30',
          type: 'number',
          options: [],
        },{
          key: 'second45',
          label: '45',
          type: 'number',
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
				saveResultShow: false,
				multiple: true,
				selectList: [],
				saveForm:{
					startTime: null,
					endTime: null,
					result: null,
				},
				saveListForm:{
					second0: 0,
					second15: 0,
					second30: 0,
					second45: 0,
				},
				options: [],
				statisticsList: [],
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
				equipmentMultiple: true,
				equipmentSelectList: [],

        testResultsColumnConfig,
        multipleEditFormShow: false,
        multipleEditFormShow1: false,
        multipleEditItem: null,
			}
		},
		props: {
			extendedProperties: {
				// 出参结果数据列表
				smokeBlacknessList: [],
				smokeBlacknessObservedList: [],
				smokeBlacknessTempList: [],
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
		watch: {
			'extendedProperties.editType': {
				handler: function(val, oldVal) {
					if(this.extendedProperties.smokeBlacknessList && this.extendedProperties.smokeBlacknessList.length > 0) {
						this.$set(this.saveForm, 'startTime', this.extendedProperties.smokeBlacknessList[0].startTime);
					}
					if(this.extendedProperties.smokeBlacknessList && this.extendedProperties.smokeBlacknessList.length > 0) {
						this.$set(this.saveForm, 'endTime', this.extendedProperties.smokeBlacknessList[0].endTime);
					}
					this.calcStatistics();

				},
			}
		},
		methods: {
			getContainer() {
				return this.$parent.$el;
			},
			init() {
				if (this.extendedProperties.itemInfoList) {
					let list = JSON.parse(JSON.stringify(this.extendedProperties.itemInfoList.filter(item => item.sceneDetect === '是')));
					list = JSON.parse(JSON.stringify(this.extendedProperties.itemInfoList));
					this.$set(this.extendedProperties, 'smokeBlacknessList', list);
					let tempList = list;
					this.$set(this.extendedProperties, 'smokeBlacknessTempList', tempList);
					this.statisticsList.push({
						name: '次数',
						level1: 0,
						level2: 0,
						level3: 0,
						level4: 0,
						level5: 0,
						level6: 0,
					});
					this.statisticsList.push({
						name: '累计时间(min)',
						level1: 0,
						level2: 0,
						level3: 0,
						level4: 0,
						level5: 0,
						level6: 0,
					});
					this.$set(this.extendedProperties, 'smokeBlacknessObservedList', []);
					for (let i = 0; i < 30; i++) {
						this.extendedProperties.smokeBlacknessObservedList.push({
							minute: i,
							second0: 0,
							second15: 0,
							second30: 0,
							second45: 0
						});
					}
				}
				this.calcStatistics();
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
					this.saveListForm = {
						second0: this.selectList[0].second0,
						second15: this.selectList[0].second15,
						second30: this.selectList[0].second30,
						second45: this.selectList[0].second45,
					}
				}else{
					this.saveListForm = {
						second0: 0,
						second15: 0,
						second30: 0,
						second45: 0,
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
					this.$set(item, 'second0', this.saveListForm.second0);
					this.$set(item, 'second15', this.saveListForm.second15);
					this.$set(item, 'second30', this.saveListForm.second30);
					this.$set(item, 'second45', this.saveListForm.second45);
				});
				this.calcStatistics();
				this.saveFormShow = false;
			},
			cancelSaveForm(){
				this.saveFormShow = false;
			},


			beforeCloseResult(){

			},
			openEventResult(){
				console.log('saveFormOpenEvent...');
				this.saveForm.result = this.extendedProperties.smokeBlacknessTempList[this.nowEditIndex].result;
			},
			submitFormResult(){
				this.$set(this.extendedProperties.smokeBlacknessTempList[this.nowEditIndex], 'result', this.saveForm.result);
				this.saveResultShow = false;
			},
			cancelSaveFormResult(){
				this.saveResultShow = false;
			},
			saveFormChange(){
				this.extendedProperties.smokeBlacknessTempList.forEach(item => {
					this.$set(item, 'startTime', this.saveForm.startTime);
					this.$set(item, 'endTime', this.saveForm.endTime);
				})
			},
			calcStatistics(){
				console.log('calcStatistics');
				this.statisticsList.splice(0);
				this.statisticsList.push({
					name: '次数',
					level1: 0,
					level2: 0,
					level3: 0,
					level4: 0,
					level5: 0,
					level6: 0,
				});
				this.statisticsList.push({
					name: '累计时间(min)',
					level1: 0,
					level2: 0,
					level3: 0,
					level4: 0,
					level5: 0,
					level6: 0,
				});
				this.extendedProperties.smokeBlacknessObservedList.forEach(item => {
					this.calcValue(item.second0);
					this.calcValue(item.second15);
					this.calcValue(item.second30);
					this.calcValue(item.second45);
				});
				this.calcTime();
			},
			calcValue(value){
				if(value >= 5){
					this.$set(this.statisticsList[0], 'level6', this.statisticsList[0].level6 += 1);
				}else if(value >= 4 && value < 5){
					this.$set(this.statisticsList[0], 'level5', this.statisticsList[0].level5 += 1);
				}else if(value >= 3 && value < 4){
					this.$set(this.statisticsList[0], 'level4', this.statisticsList[0].level4 += 1);
				}else if(value >= 2 && value < 3){
					this.$set(this.statisticsList[0], 'level3', this.statisticsList[0].level3 += 1);
				}else if(value >= 1 && value < 2){
					this.$set(this.statisticsList[0], 'level2', this.statisticsList[0].level2 += 1);
				}else{
					this.$set(this.statisticsList[0], 'level1', this.statisticsList[0].level1 += 1);
				}
			},
			calcTime(){
				this.$set(this.statisticsList[1], 'level6', ((this.statisticsList[0].level6 * 15) / 60).toFixed(2));
				this.$set(this.statisticsList[1], 'level5', ((this.statisticsList[0].level5 * 15) / 60).toFixed(2));
				this.$set(this.statisticsList[1], 'level4', ((this.statisticsList[0].level4 * 15) / 60).toFixed(2));
				this.$set(this.statisticsList[1], 'level3', ((this.statisticsList[0].level3 * 15) / 60).toFixed(2));
				this.$set(this.statisticsList[1], 'level2', ((this.statisticsList[0].level2 * 15) / 60).toFixed(2));
				this.$set(this.statisticsList[1], 'level1', ((this.statisticsList[0].level1 * 15) / 60).toFixed(2));
				this.extendedProperties.smokeBlacknessList.forEach(item => {
					this.$set(item, 'frequency0', this.statisticsList[0].level1);
					this.$set(item, 'frequency1', this.statisticsList[0].level2);
					this.$set(item, 'frequency2', this.statisticsList[0].level3);
					this.$set(item, 'frequency3', this.statisticsList[0].level4);
					this.$set(item, 'frequency4', this.statisticsList[0].level5);
					this.$set(item, 'frequency5', this.statisticsList[0].level6);
					this.$set(item, 'time0', this.statisticsList[1].level1);
					this.$set(item, 'time1', this.statisticsList[1].level2);
					this.$set(item, 'time2', this.statisticsList[1].level3);
					this.$set(item, 'time3', this.statisticsList[1].level4);
					this.$set(item, 'time4', this.statisticsList[1].level5);
					this.$set(item, 'time5', this.statisticsList[1].level6);
				})
			},
			showInputForm(index){
				this.saveResultShow = true;
				this.nowEditIndex = index;
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
				this.equipmentSelectList.forEach(item => {
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
			handleSelectionChange(row){
				console.log('handleSelectionChange', row);
				this.selectList = row;
				this.multiple = !row.length;
			},
      handleEquipmentSelectionChange(row){
        console.log('handleEquipmentSelectionChange', row);
        this.equipmentSelectList = row;
        this.equipmentMultiple = !row.length;
      },
      multipleColumnShow(item){
        this.multipleEditFormShow = true;
        this.multipleEditItem = item;
      },
      multipleColumnShow1(item){
        this.multipleEditFormShow1 = true;
        this.multipleEditItem = item;
      },
      editSubmitForm(data){
			  console.log('editSubmitForm', data);
			  this.calcStatistics();
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
